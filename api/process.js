export default async function handler(req, res) {
  const { transcription } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // Novo comando focado em Direito e Subtemas
  const prompt = `Aja como um professor de Direito. Com base na aula: "${transcription}", identifique obrigatoriamente no início do texto:
  MATÉRIA: (Ex: Direito Constitucional, Direito Civil, etc)
  SUBTEMA: (Ex: Controle de Constitucionalidade, Contratos, etc)
  
  Depois, organize o conteúdo em: 
  1. Tópicos detalhados.
  2. Leis e Artigos citados.
  3. 3 Questões estilo FGV com gabarito comentado.
  4. Cards Anki no formato (Frente;Verso).`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();
    res.status(200).json({ result: data.candidates[0].content.parts[0].text });
  } catch (error) {
    res.status(500).json({ error: "Erro na IA" });
  }
}
