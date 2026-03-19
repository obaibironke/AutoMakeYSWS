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
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );

    // Fields are nested under identity
    const {
      slack_id,
      first_name,
      last_name,
      primary_email,
      verification_status,
      ysws_eligible,
    } = userResponse.data.identity;

    const name = `${first_name} ${last_name}`.trim();
    const isVerified = verification_status === "verified";

    // Step 3: Check if user already exists
    const records = await table
      .select({ filterByFormula: `{Slack ID} = '${slack_id}'` })
      .firstPage();

    let userRecord;

    if (records.length > 0) {
      // User exists — just return their data, no writes
      userRecord = records[0];
    } else {
      // New user — create record
      userRecord = await table.create({
        "Slack ID": slack_id,
        Name: name,
        Email: primary_email,
        Verified: isVerified ? "Yes" : "No",
        "YSWS Eligible": ysws_eligible ? "Yes" : "No",
        "Credits Earned": 0,
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        slack_id,
        name: userRecord.fields["Name"] || name,
        email: userRecord.fields["Email"] || primary_email,
        verified: userRecord.fields["Verified"] === "Yes",
        credits: userRecord.fields["Credits Earned"] || 0,
      },
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
