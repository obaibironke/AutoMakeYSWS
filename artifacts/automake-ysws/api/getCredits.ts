import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_ID = "appqHPb7zQXJeFYIZ";
const PROJECTS_TABLE = "Projects";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Missing project id" });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing API key" });
  }

  try {
    const filter = encodeURIComponent(`{Project ID} = "${id}"`);
    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(PROJECTS_TABLE)}?filterByFormula=${filter}`;

    const airtableRes = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    const data = await airtableRes.json();
    const record = data.records?.[0];

    if (!record) {
      return res.status(404).json({ error: "Project not found" });
    }

    return res.status(200).json({
      project: {
        id: record.fields["Project ID"],
        recordId: record.id,
        name: record.fields["Project Name"] ?? "",
        description: record.fields["Description"] ?? "",
        status: record.fields["Status"] ?? "Pending Review",
        submittedAt: record.fields["Submitted At"] ?? null,
        repoUrl: record.fields["Repo URL"] ?? null,
        howToTest: record.fields["How to test?"] ?? null,
        screenshot: record.fields["Screenshot"]?.[0]?.url ?? null,
        creditsAwarded: record.fields["Credits Awarded"] ?? null,
        hoursLogged: record.fields["Hours Logged"] ?? null,
      },
    });
  } catch (err) {
    console.error("Failed to fetch project:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
