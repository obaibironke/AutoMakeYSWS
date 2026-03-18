import Airtable from 'airtable';
import axios from 'axios';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

const table = base('Users');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  try {
    const tokenResponse = await axios.post(
      "https://auth.hackclub.com/public/api/token",
      {
        code,
        client_id: process.env.HACK_CLUB_CLIENT_ID,
        client_secret: process.env.HACK_CLUB_CLIENT_SECRET,
      }
    );

    const { id: slackId, name, email, verify_status, ysws_eligible } = tokenResponse.data.user;

    const records = await table.select({
      filterByFormula: `{Slack ID} = '${slackId}'`,
    }).firstPage();

    let userRecord;
    const userData = {
      "Slack ID": slackId,
      "Name": name,
      "Email": email,
      "Verified": verify_status ? "Yes" : "No",
      "YSWS Eligible": ysws_eligible ? "Yes" : "No",
    };

    if (records.length === 0) {
      userRecord = await table.create({ ...userData, "Credits Earned": 0 });
    } else {
      userRecord = await table.update(records[0].id, userData);
    }

    return res.status(200).json({
      success: true,
      user: {
        slack_id: slackId,
        name: name,
        credits: userRecord.fields["Credits Earned"] || 0,
      },
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}