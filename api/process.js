export default async function handler(req, res) {
  const { transcription } = req.body;
  
  // Aqui está o segredo: ele busca a chave que você salvou na Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Chave API não encontrada no sistema." });
  }

  const prompt = `Aja como um Revisor Jurídico. Corrija termos técnicos da transcrição abaixo e organize em: Matéria, Subtema, Resumo, Artigos e Cards Anki. TRANSCRICÃO: "${transcription}"`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content) {
      res.status(200).json({ result: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ error: "A IA não devolveu uma resposta válida." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro na conexão com a IA." });
  }
}
