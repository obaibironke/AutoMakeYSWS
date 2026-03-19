import type { VercelRequest, VercelResponse } from "@vercel/node";

const BASE_ID = "appqHPb7zQXJeFYIZ";
const SESSIONS_TABLE = "Work Sessions";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { project_id, hours, notes, lapseSession } = req.body;

  if (!project_id || !hours || !notes || !lapseSession) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing API key" });
  }

  try {
    const res2 = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(SESSIONS_TABLE)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Project: [project_id],
            Hours: Number(hours),
            Notes: notes,
            "Link to Lapse Session": lapseSession,
            Date: new Date().toISOString().split("T")[0],
          },
        }),
      }
    );

    const data = await res2.json();

    if (!data?.id) {
      console.error("Session creation failed:", data);
      return res.status(500).json({ error: "Failed to log session" });
    }

    return res.status(200).json({
      success: true,
      session: {
        id: data.id,
        hours: data.fields["Hours"],
        notes: data.fields["Notes"],
        date: data.fields["Date"],
        lapseSession: data.fields["Link to Lapse Session"],
      },
    });
  } catch (err) {
    console.error("Log session error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}