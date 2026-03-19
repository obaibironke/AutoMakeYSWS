// api/uploadToCDN.ts
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
    // Forward the multipart form data to Hack Club CDN
    const cdnResponse = await fetch(
      "https://cdn.hackclub.com/api/v4/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CDN_API_KEY}`,
        },
        body: req,
      }
    );

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

    // Extract project_id from form data (you'll need to parse it properly)
    // For now, we'll assume it's passed and update the database
    // You may need to use a library like 'formidable' to parse multipart data properly

    // Update your database with the CDN URL
    // await db.query('UPDATE projects SET screenshot = $1 WHERE id = $2', [cdnData.url, project_id]);

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