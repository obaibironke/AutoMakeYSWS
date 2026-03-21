import type { VercelRequest, VercelResponse } from "@vercel/node";
import Airtable from "airtable";

const table = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID!)
  .table("Active Users");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const records = await table
      .select({
        fields: ["Name", "Credits Earned"],
        sort: [{ field: "Credits Earned", direction: "desc" }],
        maxRecords: 50,
      })
      .firstPage();

    const leaderboard = records
      .filter(
        (r) => r.fields["Name"] && r.fields["Credits Earned"] !== undefined,
      )
      .map((r, i) => ({
        rank: i + 1,
        name: r.fields["Name"] as string,
        credits: r.fields["Credits Earned"] as number,
      }));

    return res.status(200).json({ success: true, leaderboard });
  } catch (error: any) {
    console.error("Leaderboard error:", error?.message || error);
    return res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
}
