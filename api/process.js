export default async function handler(req, res) {
  const { transcription } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // Se a transcrição chegar vazia ou curta, ele ainda salva para você ver o que houve
  if (!transcription || transcription.length < 1) {
    return res.status(200).json({ result: "Nenhuma palavra foi capturada pelo sistema de áudio." });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Trate este texto como uma transcrição de aula. Mesmo que esteja picado, organize o que for possível: " + transcription }] }]
      })
    });

    const data = await response.json();
    const textoFinal = data.candidates[0].content.parts[0].text;
    res.status(200).json({ result: textoFinal });
  } catch (error) {
    // ESSA LINHA É A CHAVE: Se a IA falhar, o sistema salva o texto do monitor preto puro
    res.status(200).json({ result: "TEXTO CAPTURADO (SEM IA): " + transcription });
  }
}
