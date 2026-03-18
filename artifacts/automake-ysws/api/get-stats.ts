import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID!,
);
const table = base("Users");

export default async function handler(req: any, res: any) {
  // In a real app, you'd check a secure cookie here.
  // For now, we'll use the Slack ID as the key.
  const { slackId } = req.query;

  try {
    const records = await table
      .select({
        filterByFormula: `{Slack ID} = '${slackId}'`,
      })
      .firstPage();

    if (records.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only return what the frontend needs
    return res.status(200).json({
      name: records[0].fields["Name"],
      hours: records[0].fields["Total Hours"] || 0,
    });
  } catch (error) {
    return res.status(500).json({ error: "Database connection failed" });
  }
}
