export default async function handler(req, res) {
  const { transcription } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Atue como um revisor jurídico sênior. Transcreva com precisão, corrija os termos técnicos e organize esta aula em Matéria, Resumo e Cards para o Anki: " + transcription }] }]
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0].content) {
      res.status(200).json({ result: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ result: "A IA não conseguiu processar. Verifique o áudio." });
    }
  } catch (error) {
    res.status(500).json({ result: "Erro de conexão com o servidor da IA." });
  }
}
