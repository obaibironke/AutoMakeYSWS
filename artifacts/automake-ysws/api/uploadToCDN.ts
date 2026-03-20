import type { VercelRequest, VercelResponse } from "@vercel/node";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const CDN_API_KEY = process.env.CDN_API_KEY;
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

  if (!CDN_API_KEY) {
    return res.status(500).json({ error: "CDN API key not configured" });
  }
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return res.status(500).json({ error: "Airtable not configured" });
  }

  const callerSlackId = req.headers["x-slack-id"] as string;
  if (!callerSlackId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    const file = files.file?.[0];
    const projectId = fields.project_id?.[0];

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }
    if (!projectId) {
      return res.status(400).json({ error: "No project_id provided" });
    }

    const projectRes = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Projects/${projectId}`,
      { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } },
    );
    const projectRecord = await projectRes.json();
    const ownerSlackId = projectRecord.fields?.["Slack ID Formula"]?.[0];

    if (!ownerSlackId || ownerSlackId !== callerSlackId) {
      fs.unlinkSync(file.filepath);
      return res.status(403).json({ error: "Not authorized" });
    }

    const fileBuffer = fs.readFileSync(file.filepath);
    const blob = new Blob([fileBuffer], { type: file.mimetype || "image/png" });

    const formData = new FormData();
    formData.append("file", blob, file.originalFilename || "screenshot.png");

    fs.unlinkSync(file.filepath);

    const cdnResponse = await fetch("https://cdn.hackclub.com/api/v4/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CDN_API_KEY}`,
      },
      body: formData,
    });

    const contentType = cdnResponse.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await cdnResponse.text();
      console.error("CDN returned non-JSON response:", text);
      return res.status(502).json({
        error: `CDN returned unexpected response (${cdnResponse.status})`,
      });
    }

    const cdnData = await cdnResponse.json();

    if (!cdnResponse.ok) {
      return res.status(cdnResponse.status).json({
        error: cdnData.error || "CDN upload failed",
        ...(cdnData.quota && { quota: cdnData.quota }),
      });
    }

    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Projects/${projectId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Screenshot: cdnData.url,
          },
        }),
      },
    );

    const airtableContentType =
      airtableResponse.headers.get("content-type") || "";
    if (!airtableContentType.includes("application/json")) {
      const text = await airtableResponse.text();
      console.error("Airtable returned non-JSON response:", text);
      return res
        .status(502)
        .json({ error: "Airtable returned unexpected response" });
    }

    const airtableData = await airtableResponse.json();

    if (!airtableResponse.ok) {
      console.error("Airtable error:", airtableData);
      return res.status(airtableResponse.status).json({
        error: airtableData.error?.message || "Failed to save to Airtable",
      });
    }

    return res.status(200).json({
      url: cdnData.url,
      id: cdnData.id,
      filename: cdnData.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Upload failed",
    });
  }
}
