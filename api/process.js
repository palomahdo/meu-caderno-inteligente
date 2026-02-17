export default async function handler(req, res) {
  const { transcription } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Você é um monitor jurídico. O texto abaixo foi capturado via áudio e pode conter erros de fonética. Corrija os termos técnicos (como impostos, leis, siglas) e crie um resumo estruturado. TEXTO: " + transcription }] }]
      })
    });

    const data = await response.json();
    res.status(200).json({ result: data.candidates[0].content.parts[0].text });
  } catch (error) {
    res.status(500).json({ result: "Erro na conexão. Tente novamente." });
  }
}
