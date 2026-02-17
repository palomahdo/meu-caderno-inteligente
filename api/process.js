export default async function handler(req, res) {
  const { transcription } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!transcription || transcription.length < 2) {
    return res.status(200).json({ result: "Nenhum áudio detectado pelo navegador. Verifique o microfone." });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Reescreva este texto de aula de Direito de forma clara e organizada: " + transcription }] }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content) {
      res.status(200).json({ result: data.candidates[0].content.parts[0].text });
    } else {
      res.status(200).json({ result: "A IA não conseguiu entender o áudio. Tente falar mais perto do microfone." });
    }
  } catch (error) {
    res.status(500).json({ result: "Erro técnico de conexão." });
  }
}
