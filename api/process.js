export default async function handler(req, res) {
  const { transcription, discipline } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `Aja como um mentor. Organize a aula de ${discipline}: "${transcription}" em: 1. Tópicos, 2. Leis citadas, 3. Questões FGV e 4. Cards Anki (Frente;Verso).`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });

  const data = await response.json();
  res.status(200).json({ result: data.candidates[0].content.parts[0].text });
}
