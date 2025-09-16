import { NextResponse } from "next/server";
import { callGeminiWithPdf, callGeminiNoPdf } from "@/lib/gemini";
import pdfParse from "pdf-parse-fixed";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const question = formData.get("question");
    const files = formData.getAll("pdfs");

    let pdfTexts = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const data = await pdfParse(buffer);
        pdfTexts.push(data.text);
      }

      const { answer, contexts, roadmap, resources } = await callGeminiWithPdf(
        question,
        pdfTexts
      );

      console.log("PDF Texts:", answer, contexts, roadmap, resources);
      return NextResponse.json({ answer, contexts, roadmap, resources });
    } else {
      const { answer, resources, roadmap } = await callGeminiNoPdf(question);
      return NextResponse.json({ answer, resources, roadmap });
    }
  } catch (err) {
    console.error("Error in /api/ask:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
