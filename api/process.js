export default async function handler(req, res) {
  const { transcription } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!transcription || transcription.length < 5) {
    return res.status(200).json({ result: "O áudio capturado foi muito curto. Tente gravar por mais tempo." });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Resuma este texto jurídico de forma profissional: " + transcription }] }]
      })
    });

    const data = await response.json();
    
    // Verificação de segurança para garantir que a resposta existe
    if (data.candidates && data.candidates[0].content) {
      const textoFinal = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ result: textoFinal });
    } 
    
    return res.status(200).json({ result: "A IA recebeu o texto, mas não conseguiu resumir. Conteúdo enviado: " + transcription.substring(0, 100) });
    
  } catch (error) {
    return res.status(500).json({ result: "Erro de comunicação com a Google. Tente novamente." });
  }
}
