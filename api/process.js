export default async function handler(req, res) {
  const { transcription } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Tente extrair qualquer conceito jurídico ou resumo deste texto, mesmo que esteja incompleto ou com erros de transcrição: " + transcription }] }]
      })
    });

    const data = await response.json();
    const textoFinal = data.candidates[0].content.parts[0].text;
    
    // Isso garante que o site receba o texto e libere o clique na matéria
    res.status(200).json({ result: textoFinal });
  } catch (error) {
    res.status(200).json({ result: "IA em manutenção. Texto capturado: " + transcription });
  }
}
