import pdf from "pdf-parse";

export async function pdfToText(buffer) {
  const data = await pdf(buffer);
  return data.text;
}
