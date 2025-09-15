import { NextResponse } from "next/server";
import { PDFExtract } from "pdf.js-extract";
import { callGeminiWithPdf, callGeminiNoPdf } from "@/lib/gemini";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const question = formData.get("question");
    const files = formData.getAll("files");

    let pdfTexts = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const pdfExtract = new PDFExtract();
        const data = await pdfExtract.extractBuffer(buffer);
        const text = data.pages
          .map((p) => p.content.map((c) => c.str).join(" "))
          .join("\n");
        pdfTexts.push(text);
      }

      // Answer using PDFs
      const { answer, contexts, roadmap, resources } = await callGeminiWithPdf(question, pdfTexts);
      console.log("Answer with PDFs:", { answer, contexts, roadmap, resources });
      return NextResponse.json({ answer, contexts, roadmap, resources });
    } else {
      // No PDFs uploaded → fetch from web
      const { answer, resources, roadmap } = await callGeminiNoPdf(question);
      console.log("Answer without PDFs:", { answer, resources, roadmap });
      return NextResponse.json({ answer, resources, roadmap });
    }
  } catch (err) {
    console.error("Error in /api/ask:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
