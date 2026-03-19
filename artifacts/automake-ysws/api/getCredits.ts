import type { VercelRequest, VercelResponse } from "@vercel/node";

const AIRTABLE_BASE_ID = "appqHPb7zQXJeFYIZ";
const AIRTABLE_TABLE = "Active Users";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slack_id } = req.body;
  if (!slack_id) {
    return res.status(400).json({ error: "Missing slack_id" });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing Airtable API key" });
  }

  try {
    const filter = encodeURIComponent(`{Slack ID} = "${slack_id}"`);
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}?filterByFormula=${filter}&fields[]=Credits+Earned&fields[]=Projects+Submitted`;

    const airtableRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const data = await airtableRes.json();
    const record = data.records?.[0];

    if (!record) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      credits: record.fields["Credits Earned"] ?? 0,
      projectsSubmitted: record.fields["Projects Submitted"] ?? 0,
    });
  } catch (err) {
    console.error("Airtable fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch from Airtable" });
  }
}
