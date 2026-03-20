import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return res.status(500).json({ error: 'Airtable not configured' });
  }

  // Read caller's Slack ID from header
  const callerSlackId = req.headers['x-slack-id'] as string;
  if (!callerSlackId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { project_id } = req.body;
  if (!project_id) {
    return res.status(400).json({ error: 'No project_id provided' });
  }

  try {
    // Verify the caller owns this project before deleting
    const projectRes = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Projects/${project_id}`,
      { headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` } }
    );
    const projectRecord = await projectRes.json();
    const ownerSlackId = projectRecord.fields?.['Slack ID Formula'];

    if (!ownerSlackId || ownerSlackId !== callerSlackId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Projects/${project_id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            Screenshot: null,
          },
        }),
      }
    );

    const contentType = airtableResponse.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await airtableResponse.text();
      console.error('Airtable returned non-JSON response:', text);
      return res.status(502).json({ error: 'Airtable returned unexpected response' });
    }

    const airtableData = await airtableResponse.json();

    if (!airtableResponse.ok) {
      console.error('Airtable error:', airtableData);
      return res.status(airtableResponse.status).json({
        error: airtableData.error?.message || 'Failed to delete screenshot',
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete screenshot error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to delete screenshot',
    });
  }
}