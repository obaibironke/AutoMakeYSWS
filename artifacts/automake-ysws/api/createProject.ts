import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_ID = "appqHPb7zQXJeFYIZ";
const PROJECTS_TABLE = "Projects";
const USERS_TABLE = "Active Users";

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

  const { slack_id, name, description } = req.body;

  if (!slack_id || !name || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing API key" });
  }

  try {
    const userRes = await airtableFetch(
      `${encodeURIComponent(USERS_TABLE)}?filterByFormula=${encodeURIComponent(
        `{Slack ID} = "${slack_id}"`,
      )}&fields[]=Slack+ID`,
    );
    const userData = await userRes.json();
    const userRecord = userData.records?.[0];

    if (!userRecord) {
      return res.status(404).json({ error: "User not found" });
    }

    const createRes = await airtableFetch(encodeURIComponent(PROJECTS_TABLE), {
      method: "POST",
      body: JSON.stringify({
        fields: {
          "Project Name": name,
          Description: description,
          Status: "Pending Review",
          User: [userRecord.id],
        },
      }),
    });

    const createData = await createRes.json();

    if (!createData?.id) {
      console.error("Project creation failed:", createData);
      return res.status(500).json({ error: "Failed to create project" });
    }

    return res.status(200).json({
      success: true,
      recordId: createData.id,
    });
  } catch (err) {
    console.error("Create project error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
