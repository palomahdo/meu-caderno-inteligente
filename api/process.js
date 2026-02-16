export default async function handler(req, res) {
  const { transcription } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `Aja como um Professor de Direito. Analise esta transcrição: "${transcription}".
  Extraia e organize EXATAMENTE neste formato:
  MATÉRIA: [Nome da Matéria]
  SUBTEMA: [Nome do Subtema/Tópico da aula]
  ---
  RESUMO: [Pontos principais da explicação]
  ARTIGOS CITADOS: [Apenas a lista dos artigos citados, ex: Art. 5º, CF]
  QUESTÕES FGV: [3 questões de múltipla escolha com gabarito]
  CARDS ANKI: [Perguntas e respostas no formato: Frente;Verso]`;

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
