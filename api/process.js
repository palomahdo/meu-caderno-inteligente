export default async function handler(req, res) {
  const { transcription } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!transcription || transcription.length < 5) {
    return res.status(200).json({ result: "Texto muito curto para resumir. Capture mais tempo de aula." });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Atue como revisor jurídico. Organize este texto de aula em tópicos, resumo e cards: " + transcription }] }]
      })
    });

    const data = await response.json();
    const textoFinal = data.candidates[0].content.parts[0].text;
    
    // Devolve o texto pronto para o site salvar na matéria
    res.status(200).json({ result: textoFinal });
  } catch (error) {
    res.status(500).json({ result: "Erro ao conectar com a IA. Tente novamente." });
  }
}
