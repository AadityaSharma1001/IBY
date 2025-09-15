import { NextResponse } from "next/server";
import { callGemini } from "../../../lib/gemini.js";

export async function POST(req) {
  try {
    const { question, resources } = await req.json();
    const prompt = `Generate a roadmap with ordered steps for learning about: ${question}. Use these resources: ${JSON.stringify(resources)}.`;
    const roadmap = await callGemini(prompt);
    return NextResponse.json({ roadmap });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
