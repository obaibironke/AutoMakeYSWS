const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
const table = base('Users');

module.exports = async (req, res) => {
  const { slackId } = req.query;
  if (!slackId) return res.status(400).json({ error: "Missing ID" });

  try {
    const records = await table.select({ filterByFormula: `{Slack ID} = '${slackId}'` }).firstPage();
    if (records.length === 0) return res.status(404).json({ error: "Not found" });

    return res.status(200).json({
      name: records[0].fields["Name"],
      credits: records[0].fields["Credits Earned"] || 0
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};