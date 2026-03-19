import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!,
);
const table = base("Users");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  try {
    const tokenResponse = await axios.post(
      "https://auth.hackclub.com/public/api/token",
      {
        code,
        client_id: process.env.HACK_CLUB_CLIENT_ID,
        client_secret: process.env.HACK_CLUB_CLIENT_SECRET,
      },
    );

    const {
      id: slackId,
      name,
      email,
      verify_status,
      ysws_eligible,
    } = tokenResponse.data.user;

    const records = await table
      .select({
        filterByFormula: `{Slack ID} = '${slackId}'`,
      })
      .firstPage();

    let userRecord;

    if (records.length === 0) {
      userRecord = await table.create({
        "Slack ID": slackId,
        Name: name,
        Email: email,
        Verified: verify_status ? "Yes" : "No",
        "YSWS Eligible": ysws_eligible ? "Yes" : "No",
        "Credits Earned": 0,
      });
    } else {
      userRecord = await table.update(records[0].id, {
        Name: name,
        Email: email,
        Verified: verify_status ? "Yes" : "No",
        "YSWS Eligible": ysws_eligible ? "Yes" : "No",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        slack_id: slackId,
        name: name,
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
