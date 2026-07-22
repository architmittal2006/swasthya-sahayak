export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Uses your Vercel Environment Variable "API1"
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

    // Call Groq Cloud API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: formattedMessages,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', data);
      return res.status(response.status).json({ error: 'Groq API request failed', details: data });
    }

    const replyText = data.choices?.[0]?.message?.content || "No response generated.";

    // Return in the payload structure index.html expects
    return res.status(200).json({
      content: [
        { type: 'text', text: replyText }
      ]
    });

  } catch (error) {
    console.error('Error in chat route:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
