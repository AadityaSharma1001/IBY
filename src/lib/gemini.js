import fetch from "node-fetch";

/**
 * Use Gemini with provided PDFs
 */
export async function callGeminiWithPdf(prompt, pdfTexts = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
    apiKey;

  const systemPrompt = `
You are a teaching assistant.
First, carefully analyze the provided PDF contents.
- If the answer to the user’s question IS found in the PDFs:
  • Provide a concise answer.
  • Include up to 5 supporting contexts from the PDFs (verbatim excerpts).
  • Create a stepwise learning roadmap.

- If the answer is NOT in the PDFs:
  • Provide a concise answer anyway.
  • Suggest up to 5 relevant research papers or tech blogs (with title + link).
  • Generate a stepwise learning roadmap for that topic.
  • If the question is vague (e.g., "what is the meaning of my name?"), reply with:
    "Please ask a science or tech related question."

Respond strictly in JSON with keys: 
{ "answer": string, "contexts": string[], "resources": {title, link}[], "roadmap": string[] }
`;

  const parts = [{ text: systemPrompt }, { text: "User Question: " + prompt }];
  pdfTexts.forEach((t, i) => {
    parts.push({ text: `PDF ${i + 1}:\n${t.slice(0, 4000)}` }); // avoid token overflow
  });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
    }),
  });

  const data = await res.json();
  console.log("Gemini response:", data);

  try {
    return JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text);
  } catch {
    return { answer: "No response parsed", contexts: [], roadmap: [], resources: [] };
  }
}

/**
 * Use Gemini when no PDFs are uploaded
 * → find papers/blogs + roadmap
 */
export async function callGeminiNoPdf(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
    apiKey;

  const systemPrompt = `
  You are a research assistant.
  If the user question is related to science/tech:
  - Provide a concise answer.
  - Suggest up to 5 relevant papers or blogs with title + link (in JSON array).
  - Create a learning roadmap if applicable.
  If the question is vague (like 'what is the meaning of my name?'), reply with:
  "Please ask a science or tech related question."
  Respond strictly in JSON with keys: answer, resources, roadmap.
  `;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\nUser: " + prompt }] },
      ],
    }),
  });

  const data = await res.json();

  try {
    return JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text);
  } catch {
    return { answer: "No response parsed", resources: [], roadmap: [] };
  }
}
