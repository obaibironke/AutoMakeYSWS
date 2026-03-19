import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_ID = "appqHPb7zQXJeFYIZ";
const SHOP_TABLE = "Shop Items";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing Airtable API key" });
  }

  try {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(SHOP_TABLE)}?fields[]=Name&fields[]=Description&fields[]=Cost&sort[0][field]=Cost&sort[0][direction]=asc`;

    const airtableRes = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    const data = await airtableRes.json();

    const items = (data.records || []).map((record: any) => ({
      id: record.id,
      name: record.fields["Name"] ?? "",
      description: record.fields["Description"] ?? "",
      cost: record.fields["Cost"] ?? 0,
    }));

    return res.status(200).json({ items });
  } catch (err) {
    console.error("Failed to fetch shop items:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
