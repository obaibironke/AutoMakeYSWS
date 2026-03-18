import Airtable from 'airtable';
import axios from 'axios';

// 1. Initialize Airtable outside the handler
const base = new Airtable({ 
  apiKey: process.env.AIRTABLE_API_KEY 
}).base(process.env.AIRTABLE_BASE_ID!);

const table = base('Users');

// 2. YOU MUST HAVE THIS WRAPPER FUNCTION
export default async function handler(req: any, res: any) {

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  try {
    // 3. Exchange code for Token
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

    // 4. Find user in Airtable
    const records = await table
      .select({
        filterByFormula: `{Slack ID} = '${slackId}'`,
      })
      .firstPage();

    let userRecord;

    if (records.length === 0) {
      // Create new record
      userRecord = await table.create({
        "Slack ID": slackId,
        "Name": name,
        "Email": email,
        "Verified": verify_status ? "Yes" : "No",
        "YSWS Eligible": ysws_eligible ? "Yes" : "No",
        "Credits Earned": 0,
      });
    } else {
      // Update existing record
      userRecord = await table.update(records[0].id, {
        "Name": name,
        "Email": email,
        "Verified": verify_status ? "Yes" : "No",
        "YSWS Eligible": ysws_eligible ? "Yes" : "No",
      });
    }

    // 5. Return success JSON
    return res.status(200).json({
      success: true,
      user: {
        slack_id: slackId,
        name: name,
        credits: userRecord.fields["Credits Earned"] || 0,
      },
    });

  } catch (error: any) {
    console.error("Auth Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || "No extra details",
    });
  }
}