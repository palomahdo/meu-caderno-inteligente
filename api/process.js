export default async function handler(req, res) {
  const { transcription } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!transcription) return res.status(200).json({ result: "Áudio não capturado." });

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Reescreva este texto jurídico de forma organizada: " + transcription }] }]
      })
    });

    const data = await response.json();
    res.status(200).json({ result: data.candidates[0].content.parts[0].text });
  } catch (e) {
    res.status(500).json({ result: "Erro na IA. Tente gravar novamente." });
  }
}
