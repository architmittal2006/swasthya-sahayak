// Serverless function — runs on the server, never in the user's browser.
// Deployed on Vercel, this file automatically becomes: POST /api/chat
//
// It receives {system, messages} from the frontend, adds our private
// ANTHROPIC_API_KEY (stored as an environment variable, never in code),
// and forwards the request to Anthropic. This keeps the key hidden from
// anyone viewing the page source.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY' });
  }

  const { system, messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: system || '',
        messages,
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      console.error('Anthropic API error:', data);
      return res.status(anthropicRes.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Server error calling Anthropic:', err);
    return res.status(500).json({ error: 'Failed to reach Anthropic API' });
  }
}
