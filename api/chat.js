export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.API1;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing API1 key' });
  }

  const { system, messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages array' });
  }

  // Doctor Persona & Medication Identification System Instruction
  const doctorSystemPrompt = `You are a helpful, professional, and empathetic medical AI assistant ("Swasthya Sahayak").

RULES FOR YOUR RESPONSES:
1. NO internal reasoning/thinking text, chain-of-thought, or weird ramblings. Output ONLY direct answers.
2. Adopt a concise, authoritative, and caring doctor persona. Keep responses crisp and actionable.
3. MEDICINE IDENTIFICATION: If the user names or describes a medicine/pill:
   - State what the medicine is commonly used for (Active Class & Purpose).
   - List standard dosage warnings / general usage notes.
   - Mention key side effects or precautions.
   - Always remind them: "Consult a qualified doctor or pharmacist before starting or stopping any medication."
4. Structure your response with clean headings or bullet points so it reads like a clinical note or prescription advice.`;

  try {
    const formattedMessages = [
      { role: 'system', content: system ? `${doctorSystemPrompt}\n\nAdditional Context: ${system}` : doctorSystemPrompt },
      ...messages
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Fast, non-thinking, doctor-friendly model on Groq
        messages: formattedMessages,
        max_tokens: 1000,
        temperature: 0.3, // Lower temperature for direct, factual answers
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', data);
      return res.status(response.status).json({ error: 'API request failed', details: data });
    }

    const replyText = data.choices?.[0]?.message?.content || "No response generated.";

    return res.status(200).json({
      content: [{ type: 'text', text: replyText }]
    });

  } catch (error) {
    console.error('Error in chat route:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
