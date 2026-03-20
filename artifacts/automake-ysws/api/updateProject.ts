import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_ID = "appqHPb7zQXJeFYIZ";
const PROJECTS_TABLE = "Projects";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing API key" });
  }

  // Read caller's Slack ID from header
  const callerSlackId = req.headers["x-slack-id"] as string;
  if (!callerSlackId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const { project_id, fields } = req.body;
  if (!project_id || !fields) {
    return res.status(400).json({ error: "Missing project_id or fields" });
  }

  try {
    // Verify ownership before updating
    const projectRes = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(PROJECTS_TABLE)}/${project_id}`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    const projectRecord = await projectRes.json();
    const ownerSlackId = projectRecord.fields?.["Slack ID Formula"];

    if (!ownerSlackId || ownerSlackId !== callerSlackId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updateRes = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(PROJECTS_TABLE)}/${project_id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
      },
    );

    const contentType = updateRes.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await updateRes.text();
      console.error("Airtable returned non-JSON response:", text);
      return res
        .status(502)
        .json({ error: "Airtable returned unexpected response" });
    }

    const updateData = await updateRes.json();

    if (!updateRes.ok) {
      console.error("Airtable error:", updateData);
      return res.status(updateRes.status).json({
        error: updateData.error?.message || "Failed to update project",
      });
    }

    return res.status(200).json({ success: true, fields: updateData.fields });
  } catch (err) {
    console.error("Update project error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
