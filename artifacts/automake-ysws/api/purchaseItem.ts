import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_ID = "appqHPb7zQXJeFYIZ";
const USERS_TABLE = "Active Users";
const SHOP_TABLE = "Shop Items";
const ORDERS_TABLE = "Orders";

const airtableFetch = async (url: string, options: RequestInit = {}) => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  return fetch(`https://api.airtable.com/v0/${BASE_ID}/${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slack_id, item_id } = req.body;

  if (!slack_id || !item_id) {
    return res.status(400).json({ error: "Missing slack_id or item_id" });
  }

  try {
    // 1. IDENTIFY — fetch user and item in parallel
    const [userRes, itemRes] = await Promise.all([
      airtableFetch(
        `${encodeURIComponent(USERS_TABLE)}?filterByFormula=${encodeURIComponent(
          `{Slack ID} = "${slack_id}"`
        )}&fields[]=Credits&fields[]=Slack+ID`
      ),
      airtableFetch(`${encodeURIComponent(SHOP_TABLE)}/${item_id}`),
    ]);

    const userData = await userRes.json();
    const itemData = await itemRes.json();

    const userRecord = userData.records?.[0];
    if (!userRecord) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!itemData?.id) {
      return res.status(404).json({ error: "Item not found" });
    }

    const userRecordId = userRecord.id;
    const currentBalance: number = userRecord.fields["Credits"] ?? 0;
    const itemCost: number = itemData.fields["Cost"] ?? 0;

    // 2. GATEKEEPER — check balance
    if (currentBalance < itemCost) {
      return res.status(400).json({
        error: "Insufficient credits",
        required: itemCost,
        available: currentBalance,
      });
    }

    // 3. EXECUTION — create order record
    const orderRes = await airtableFetch(encodeURIComponent(ORDERS_TABLE), {
      method: "POST",
      body: JSON.stringify({
        fields: {
          Users: [userRecordId],
          Item: [item_id],
          "Credits Spent": itemCost,
        },
      }),
    });

    const orderData = await orderRes.json();

    if (!orderData?.id) {
      console.error("Order creation failed:", orderData);
      return res.status(500).json({ error: "Failed to create order" });
    }

    // 4. FEEDBACK — return new balance (Credits field will auto-update via rollup)
    const newBalance = currentBalance - itemCost;
    return res.status(200).json({
      success: true,
      orderId: orderData.id,
      newBalance,
    });
  } catch (err) {
    console.error("Purchase error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}