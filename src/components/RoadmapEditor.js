"use client";

import { useState } from "react";

export default function RoadmapEditor({ roadmap, setRoadmap, onSendEmail }) {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Validate and normalize roadmap data
  const normalizeRoadmap = (roadmapData) => {
    if (Array.isArray(roadmapData)) {
      return roadmapData.filter(item => item && typeof item === 'string' && item.trim());
    }
    if (typeof roadmapData === "string") {
      return roadmapData.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  const roadmapArray = normalizeRoadmap(roadmap);
  const roadmapText = roadmapArray.join("\n");

  // Email validation
  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue.trim());
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setIsEmailValid(emailValue === "" || validateEmail(emailValue));
  };

  const handleRoadmapChange = (e) => {
    try {
      const value = e.target.value || "";
      const arr = value.split("\n").map(s => s.trim()).filter(Boolean);
      
      if (typeof setRoadmap === 'function') {
        setRoadmap(arr);
      }
    } catch (err) {
      console.error("Error updating roadmap:", err);
    }
  };

  const handleSendEmail = async () => {
    try {
      const trimmedEmail = email.trim();
      
      if (!trimmedEmail) {
        alert("Please enter an email address");
        return;
      }

      if (!validateEmail(trimmedEmail)) {
        alert("Please enter a valid email address");
        return;
      }

      if (roadmapArray.length === 0) {
        alert("No roadmap content to send");
        return;
      }

      setIsSending(true);
      
      if (typeof onSendEmail === 'function') {
        await onSendEmail(trimmedEmail);
        setEmail(""); // Clear email on successful send
      } else {
        throw new Error("Email sending function is not available");
      }
    } catch (err) {
      console.error("Error in handleSendEmail:", err);
      alert(`Failed to send email: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-100">Learning Roadmap</h2>
      </div>

      {/* Roadmap Editor */}
      <div className="mb-6">
        <label htmlFor="roadmap-textarea" className="block text-sm font-medium text-gray-300 mb-2">
          Edit your personalized roadmap (one item per line):
        </label>
        <textarea
          id="roadmap-textarea"
          value={roadmapText}
          onChange={handleRoadmapChange}
          placeholder="Enter roadmap items, one per line..."
          className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg p-4 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none min-h-[160px]"
          style={{ lineHeight: "1.6" }}
        />
        <div className="mt-2 text-sm text-gray-400">
          {roadmapArray.length} {roadmapArray.length === 1 ? 'item' : 'items'} in roadmap
        </div>
      </div>

      {/* Email Section */}
      <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-600/30">
        <label htmlFor="email-input" className="block text-sm font-medium text-gray-300 mb-3">
          Send roadmap via email:
        </label>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              id="email-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={handleEmailChange}
              disabled={isSending}
              className={`w-full bg-gray-800/50 border rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                !isEmailValid 
                  ? 'border-red-500/50 focus:ring-red-500' 
                  : 'border-gray-600/50'
              } ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {!isEmailValid && email && (
              <p className="mt-1 text-sm text-red-400">Please enter a valid email address</p>
            )}
          </div>
          <button
            onClick={handleSendEmail}
            disabled={isSending || !email.trim() || !isEmailValid || roadmapArray.length === 0}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 min-w-[120px] justify-center"
          >
            {isSending ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}