import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_ID = "appqHPb7zQXJeFYIZ";
const SESSIONS_TABLE = "Work Sessions";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { project_id } = req.query;
  if (!project_id) {
    return res.status(400).json({ error: "Missing project_id" });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing API key" });
  }

  try {
    const filter = encodeURIComponent(
      `FIND("${project_id}", ARRAYJOIN(Project))`,
    );
    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(SESSIONS_TABLE)}?filterByFormula=${filter}`;

    const airtableRes = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    const data = await airtableRes.json();

    const sessions = (data.records || []).map((record: any) => ({
      id: record.id,
      hours: record.fields["Hours"] ?? 0,
      notes: record.fields["Notes"] ?? "",
      date: record.fields["Date"] ?? "",
    }));

    return res.status(200).json({ sessions });
  } catch (err) {
    console.error("Failed to fetch sessions:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
