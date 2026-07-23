export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Uses your Vercel Environment Variable "API1" (OpenRouter API Key)
  const apiKey = process.env.API1;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing API1 key' });
  }

  const { system, messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages array' });
  }

  try {
    // Build conversation list including optional system prompt
    const formattedMessages = [];
    if (system) {
      formattedMessages.push({ role: 'system', content: system });
    }
    formattedMessages.push(...messages);

    // Call OpenRouter API for Qwen3.7 Max
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://swasthya-sahayak.vercel.app', // Optional site URL
        'X-Title': 'Swasthya Sahayak', // Optional site name
      },
      body: JSON.stringify({
        model: 'qwen/qwen-max',
        messages: formattedMessages,
        max_tokens: 1600, // raised from 1000 so replies can be more complete
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter API error:', data);
      return res.status(response.status).json({ error: 'API request failed', details: data });
    }

    const replyText = data.choices?.[0]?.message?.content || "No response generated.";

    // Return in the payload structure index.html expects
    return res.status(200).json({
      content: [{ type: 'text', text: replyText }]
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
