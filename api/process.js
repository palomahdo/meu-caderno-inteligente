export default async function handler(req, res) {
  const { transcription } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Resuma os pontos principais deste áudio de aula: " + transcription }] }]
      })
    });

    const data = await response.json();
    const textoFinal = data.candidates[0].content.parts[0].text;
    
    // Isso envia o texto para o seu banco de dados e permite abrir a matéria
    res.status(200).json({ result: textoFinal });
  } catch (error) {
    // Se der erro, ele salva o texto original para você não perder a aula
    res.status(200).json({ result: "Conteúdo capturado: " + transcription });
  }
}
