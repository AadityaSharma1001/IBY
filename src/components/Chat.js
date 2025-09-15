// page.js
"use client";

import { useState } from "react";
import Uploader from "../components/Uploader";
import Chat from "../components/Chat";
import RoadmapEditor from "../components/RoadmapEditor";

export default function Home() {
  const [answer, setAnswer] = useState(null);
  const [resources, setResources] = useState([]);
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);
  const [contexts, setContexts] = useState([]);
  const [error, setError] = useState(null);

  const handleAsk = async (question, pdfs) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate inputs
      if (!question?.trim()) {
        throw new Error("Question cannot be empty");
      }

      const formData = new FormData();
      formData.append("question", question.trim());
      
      // Handle PDF files with validation
      if (pdfs && pdfs.length > 0) {
        Array.from(pdfs).forEach((pdf, index) => {
          if (!pdf || pdf.type !== "application/pdf") {
            throw new Error(`File ${index + 1} is not a valid PDF`);
          }
          if (pdf.size > 50 * 1024 * 1024) { // 50MB limit
            throw new Error(`File ${pdf.name} is too large (max 50MB)`);
          }
          formData.append("pdfs", pdf);
        });
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

      const res = await fetch("/api/ask", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${res.status}`);
      }

      const data = await res.json();
      
      // Validate response data
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid response from server");
      }

      setAnswer(data.answer || "No answer provided");
      setContexts(Array.isArray(data.contexts) ? data.contexts : []);
      setResources(Array.isArray(data.resources) ? data.resources : []);
      setRoadmap(data.roadmap || "");
      
    } catch (err) {
      console.error("Error in handleAsk:", err);
      if (err.name === 'AbortError') {
        setError("Request timed out. Please try again.");
      } else {
        setError(err.message || "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (email) => {
    try {
      if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        throw new Error("Please enter a valid email address");
      }

      if (!answer?.trim()) {
        throw new Error("No content to send - please generate an answer first");
      }

      const emailContent = {
        to: email.trim(),
        subject: "Your Q&A + Roadmap",
        content: `Answer:\n${answer}\n\nResources:\n${resources.map(r => r?.title || 'Untitled').join("\n")}\n\nRoadmap:\n${roadmap}`
      };

      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailContent)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send email");
      }

      alert("Email sent successfully!");
    } catch (err) {
      console.error("Error sending email:", err);
      alert(`Failed to send email: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            PDF Q&A + Roadmap Generator
          </h1>
          <p className="text-gray-400 text-lg">
            Upload PDFs, ask questions, and generate personalized learning roadmaps
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-400 font-medium">Error: {error}</span>
            </div>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">
          <Uploader onAsk={handleAsk} loading={loading} />

          {answer && (
            <Chat answer={answer} resources={resources} contexts={contexts} />
          )}

          {answer && (
            <RoadmapEditor
              roadmap={roadmap}
              setRoadmap={setRoadmap}
              onSendEmail={handleSendEmail}
            />
          )}
        </div>
      </div>
    </div>
  );
}
