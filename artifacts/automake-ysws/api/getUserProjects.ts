import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_ID = "appqHPb7zQXJeFYIZ";
const PROJECTS_TABLE = "Projects";
const USERS_TABLE = "Active Users";

const airtableFetch = async (url: string) => {
  const apiKey = process.env.AIRTABLE_API_KEY;
  return fetch(`https://api.airtable.com/v0/${BASE_ID}/${url}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });
};

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
    // Step 1: find the user's Airtable record ID
    const userRes = await airtableFetch(
      `${encodeURIComponent(USERS_TABLE)}?filterByFormula=${encodeURIComponent(
        `{Slack ID} = "${slack_id}"`
      )}&fields[]=Slack+ID`
    );
    const userData = await userRes.json();
    const userRecord = userData.records?.[0];

    if (!userRecord) {
      return res.status(404).json({ error: "User not found" });
    }

    // Step 2: filter projects by the user's record ID via the User linked field
    const filter = encodeURIComponent(`FIND("${userRecord.id}", ARRAYJOIN(User))`);
    const url = `${encodeURIComponent(PROJECTS_TABLE)}?filterByFormula=${filter}&sort[0][field]=Created+Time&sort[0][direction]=desc`;

    const projectsRes = await airtableFetch(url);
    const data = await projectsRes.json();

    const projects = (data.records || []).map((record: any) => ({
      id: record.id,
      name: record.fields["Project Name"] ?? "",
      status: record.fields["Status"] ?? "Pending Review",
      creditsAwarded: record.fields["Credits Awarded"] ?? null,
      hoursLogged: record.fields["Hours Logged"] ?? null,
    }));

    return res.status(200).json({ projects });
  } catch (err) {
    console.error("Failed to fetch user projects:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}