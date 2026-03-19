import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import Airtable from "airtable";

const table = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_ID!)
  .table("Active Users");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, redirect_uri } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  try {
    // Step 1: Exchange code for access token
    const tokenResponse = await axios.post(
      "https://auth.hackclub.com/oauth/token",
      {
        client_id: process.env.HACK_CLUB_CLIENT_ID,
        client_secret: process.env.HACK_CLUB_CLIENT_SECRET,
        redirect_uri: redirect_uri || process.env.HACK_CLUB_REDIRECT_URI,
        code,
        grant_type: "authorization_code",
      },
    );

    const { access_token } = tokenResponse.data;

    // Step 2: Use access token to get user info
    const userResponse = await axios.get(
      "https://auth.hackclub.com/api/v1/me",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    // DEBUG: return raw Hack Club response so we can see all fields
    // This returns success:true so the frontend won't error out,
    // and we can see exactly what Hack Club sends back
    return res.status(200).json({
      success: true,
      debug_hack_club_response: userResponse.data,
    });

  } catch (error: any) {
    console.error(
      "Auth error:",
      error?.response?.data || error?.message || error,
    );
    return res.status(500).json({
      error: "Authentication failed",
      details: error?.response?.data || error?.message || "Unknown error",
    });
  }
}