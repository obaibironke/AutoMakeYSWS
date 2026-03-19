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
  if (!CDN_API_KEY) {
    return res.status(500).json({ error: "CDN API key not configured" });
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

    // Read temp file into a Buffer and wrap as Blob so native fetch
    // can correctly construct the multipart body with its own boundary
    const fileBuffer = fs.readFileSync(file.filepath);
    const blob = new Blob([fileBuffer], { type: file.mimetype || "image/png" });

    const formData = new FormData();
    formData.append("file", blob, file.originalFilename || "screenshot.png");

    // Clean up temp file before the network request
    fs.unlinkSync(file.filepath);

    // Only set Authorization — never set Content-Type manually for multipart,
    // letting fetch set it automatically ensures the boundary matches the body
    const cdnResponse = await fetch("https://cdn.hackclub.com/api/v4/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CDN_API_KEY}`,
      },
      body: formData,
    });

    // Guard against HTML error pages before attempting to parse JSON
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
        // Surface quota details if it's a 402
        ...(cdnData.quota && { quota: cdnData.quota }),
      });
    }

    // Update your database here if needed:
    // await db.query('UPDATE projects SET screenshot = $1 WHERE id = $2', [cdnData.url, projectId]);

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
