"use client";

import { useState } from "react";

export default function Uploader({ onAsk, loading }) {
  const [question, setQuestion] = useState("");
  const [pdfs, setPdfs] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState([]);

  // File validation constants
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_FILES = 10;
  const ALLOWED_TYPES = ['application/pdf'];

  // Validate files
  const validateFiles = (files) => {
    const fileArray = Array.from(files);
    const validationErrors = [];

    if (fileArray.length > MAX_FILES) {
      validationErrors.push(`Maximum ${MAX_FILES} files allowed`);
      return { validFiles: [], errors: validationErrors };
    }

    const validFiles = fileArray.filter((file, index) => {
      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        validationErrors.push(`File ${index + 1} (${file.name}): Only PDF files are allowed`);
        return false;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        validationErrors.push(`File ${index + 1} (${file.name}): File too large (max 50MB)`);
        return false;
      }

      // Check if file has content
      if (file.size === 0) {
        validationErrors.push(`File ${index + 1} (${file.name}): File is empty`);
        return false;
      }

      return true;
    });

    return { validFiles, errors: validationErrors };
  };

  // Handle file selection
  const handleFileChange = (files) => {
    if (!files || files.length === 0) {
      setPdfs([]);
      setErrors([]);
      return;
    }

    const { validFiles, errors: validationErrors } = validateFiles(files);
    setPdfs(validFiles);
    setErrors(validationErrors);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      setErrors(["Please enter a question"]);
      return;
    }

    if (errors.length > 0) {
      return;
    }

    try {
      if (typeof onAsk === 'function') {
        await onAsk(trimmedQuestion, pdfs);
      } else {
        setErrors(["Question processing is not available"]);
      }
    } catch (err) {
      console.error("Error in form submission:", err);
      setErrors([err.message || "Failed to process your question"]);
    }
  };

  // Remove file from list
  const removeFile = (indexToRemove) => {
    const newPdfs = pdfs.filter((_, index) => index !== indexToRemove);
    setPdfs(newPdfs);
    // Clear errors when files change
    setErrors([]);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-100">Upload & Ask</h2>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              {errors.length === 1 ? (
                <p className="text-red-400">{errors[0]}</p>
              ) : (
                <ul className="text-red-400 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Question Input */}
      <div className="mb-6">
        <label htmlFor="question-input" className="block text-sm font-medium text-gray-300 mb-2">
          Your Question
        </label>
        <input
          id="question-input"
          type="text"
          placeholder="What would you like to know about the uploaded PDFs?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
          className={`w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          maxLength={500}
        />
        <div className="mt-1 text-xs text-gray-400">
          {question.length}/500 characters
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          PDF Files (Optional)
        </label>
        
        {/* Drag & Drop Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-600/50 hover:border-gray-500/70'
          } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={(e) => handleFileChange(e.target.files)}
            disabled={loading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-300 font-medium">
                {dragActive ? 'Drop your PDF files here' : 'Drag & drop PDF files here'}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                or click to browse (max {MAX_FILES} files, 50MB each)
              </p>
            </div>
          </div>
        </div>

        {/* File List */}
        {pdfs.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-400 font-medium">
              Selected Files ({pdfs.length}):
            </p>
            {pdfs.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-900/30 rounded-lg p-3 border border-gray-600/30">
                <div className="flex items-center min-w-0 flex-1">
                  <svg className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-200 text-sm font-medium truncate">
                      {file.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={loading}
                  className="ml-3 p-1 text-gray-400 hover:text-red-400 transition-colors duration-200 flex-shrink-0"
                  title="Remove file"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !question.trim() || errors.length > 0}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing your question...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Ask Question</span>
          </>
        )}
      </button>

      {/* Help Text */}
      <div className="mt-4 p-3 bg-gray-900/20 rounded-lg border border-gray-600/20">
        <p className="text-gray-400 text-sm">
          <span className="font-medium">💡 Tip:</span> You can ask questions with or without uploading PDF files. 
          With PDFs, you'll get answers based on the document content plus additional context and resources.
        </p>
      </div>
    </form>
  );
}