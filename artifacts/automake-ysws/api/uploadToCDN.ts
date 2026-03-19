// api/uploadToCDN.ts
import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const CDN_API_KEY = process.env.CDN_API_KEY;

  if (!CDN_API_KEY) {
    return res.status(500).json({ error: "CDN API key not configured" });
  }

  try {
    // Parse the incoming form data
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

    // Create a new FormData instance for the CDN upload
    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.filepath), {
      filename: file.originalFilename || "screenshot.png",
      contentType: file.mimetype || "image/png",
    });

    // Upload to Hack Club CDN
    const cdnResponse = await fetch("https://cdn.hackclub.com/api/v4/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CDN_API_KEY}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    // Clean up the temporary file
    fs.unlinkSync(file.filepath);

    if (!cdnResponse.ok) {
      const errorData = await cdnResponse.json();

      if (cdnResponse.status === 402) {
        return res.status(402).json({
          error: "Storage quota exceeded",
          quota: errorData.quota,
        });
      }

      return res
        .status(cdnResponse.status)
        .json({ error: errorData.error || "CDN upload failed" });
    }

    const cdnData = await cdnResponse.json();

    // Update your database with the CDN URL
    // Example (adjust to your database setup):
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
