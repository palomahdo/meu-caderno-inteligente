export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { transcription } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ result: "Erro: Chave API não configurada na Vercel." });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Aja como um Revisor Jurídico. Corrija e organize em Matéria, Resumo e Cards Anki: " + transcription }] }]
      })
    });

    const data = await response.json();
    const textoFinal = data.candidates[0].content.parts[0].text;
    
    res.status(200).json({ result: textoFinal });
  } catch (error) {
    res.status(500).json({ result: "Erro ao processar com a IA." });
  }
}
