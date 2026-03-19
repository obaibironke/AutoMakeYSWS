import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_ID = "appqHPb7zQXJeFYIZ";
const PROJECTS_TABLE = "Projects";

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
    return res.status(500).json({ error: "Missing API key" });
  }

  try {
    const filter = encodeURIComponent(`{Slack ID Formula} = "${slack_id}"`);
    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(PROJECTS_TABLE)}?filterByFormula=${filter}&sort[0][field]=Created+Time&sort[0][direction]=desc`;

    const airtableRes = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    const data = await airtableRes.json();

    const projects = (data.records || []).map((record: any) => ({
      id: record.id,
      name: record.fields["Project Name"] ?? "",
      status: record.fields["Status"] ?? "Unsubmitted",
      creditsAwarded: record.fields["Credits Awarded"] ?? null,
      hoursLogged: record.fields["Hours Logged"] ?? null,
    }));

    return res.status(200).json({ projects });
  } catch (err) {
    console.error("Failed to fetch user projects:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
