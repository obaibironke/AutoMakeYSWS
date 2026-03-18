// Inside your api/verify-auth.ts handler...

try {
  const tokenResponse = await axios.post(
    "https://auth.hackclub.com/public/api/token",
    {
      code,
      client_id: process.env.HACK_CLUB_CLIENT_ID,
      client_secret: process.env.HACK_CLUB_CLIENT_SECRET,
    },
  );

  // Extracting all the fields Hack Club provides
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
    // Create new record with ALL the details
    userRecord = await table.create({
      "Slack ID": slackId,
      Name: name,
      Email: email,
      Verified: verify_status ? "Yes" : "No",
      "YSWS Eligible": ysws_eligible ? "Yes" : "No",
      "Credits Earned": 0,
    });
  } else {
    // Optional: Update existing record in case their verification status changed
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
} catch (error) {
  // Error handling...
}
