export default async function handler(req, res) {
  const { transcription } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!transcription || transcription.length < 5) {
    return res.status(200).json({ result: "Áudio muito curto. Tente gravar por pelo menos 30 segundos para a IA ter contexto." });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Atue como revisor jurídico. Corrija a transcrição, remova erros de português e organize em Resumo e Anki. Se o texto estiver confuso, tente deduzir o sentido jurídico. TEXTO: " + transcription }] }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content) {
      const respostaIA = data.candidates[0].content.parts[0].text;
      res.status(200).json({ result: respostaIA });
    } else {
      res.status(200).json({ result: "O Gemini recebeu o áudio, mas não conseguiu gerar o resumo. Tente falar mais claramente ou por mais tempo." });
    }
  } catch (error) {
    res.status(500).json({ result: "Erro técnico na conexão. Tente novamente em instantes." });
  }
}
