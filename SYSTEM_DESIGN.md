# Gemini PDF QA App - System Design Document

## Overview

This application allows users to upload PDFs or ask questions without PDFs and get AI-generated answers, learning roadmaps, and supporting contexts or resources. The system uses the Gemini 2.0 Flash API for natural language understanding and generation.

---

## Architecture

### 1. Frontend

* **Framework:** Next.js (App Router, `src/` structure)
* **Language:** JavaScript (React)
* **Responsibilities:**

  * Upload multiple PDFs (without storing on the server)
  * Send questions and PDFs to backend
  * Display AI answer, contexts, resources, and roadmap
  * Allow roadmap editing and emailing
  * Polished UI with handling of null/empty states

### 2. Backend

* **Framework:** Next.js API Routes (App Router)
* **Libraries:**

  * `pdf.js-extract` for PDF parsing
  * `node-fetch` for calling Gemini API
  * `nodemailer` for sending email
* **Responsibilities:**

  * Extract text from uploaded PDFs
  * Call Gemini API with PDFs or fallback to web resources
  * Return structured JSON: `answer`, `contexts`, `resources`, `roadmap`
  * Handle email sending
  * Optional: background processing using Redis or RabbitMQ to handle tasks without blocking main requests

### 3. AI Integration

* **Service:** Gemini 2.0 Flash API (Google Generative Language API)
* **Functions:**

  * Answer questions using PDF content
  * Provide learning roadmap
  * Suggest research papers or blogs if answer not found in PDFs
* **Fallback logic:**

  * If PDFs are uploaded but answer not found, same behavior as no-PDF mode

### 4. Data Handling

* PDFs are processed **in-memory**; no local storage is used for privacy and security
* Output structured as JSON to simplify frontend rendering
* Email feature sends final roadmap + answer to user-specified email

---

## Technology Stack Rationale

| Component             | Choice             | Reason                                                                                     |
| --------------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| Frontend              | Next.js            | Server-side rendering, App Router, good React integration, easy to manage forms and modals |
| Backend               | Next.js API Routes | Same codebase, minimal overhead, easy to deploy together                                   |
| PDF Parsing           | `pdf.js-extract`   | Efficient in-memory extraction, avoids storing files                                       |
| AI LLM                | Gemini 2.0 Flash   | State-of-the-art language understanding and code/text generation                           |
| Email                 | `nodemailer`       | Simple SMTP integration for sending user emails                                            |
| State Management      | React local state  | Simple for this MVP; roadmap editor works without global state                             |
| Background Processing | Redis / RabbitMQ   | Handle long-running or async tasks without blocking main request flow                      |

### Why Local PDF Handling?

* Ensures **user privacy** (PDFs never stored on server or DB)
* Avoids **storage costs** and overhead for MVP
* Simplifies architecture and deployment

---

## Scaling Considerations

1. **Storing PDFs in S3 or other cloud storage**

   * Pros: Allows history, larger PDFs, multiple users
   * Cons: Requires secure access controls, storage costs

2. **Vector Database for semantic search**

   * Example: Pinecone, Chroma, Weaviate
   * PDFs can be embedded into vectors, enabling:

     * Faster retrieval of relevant passages
     * Better handling of large PDF collections
     * Support for multiple questions over time without resending entire PDFs to LLM

3. **Caching Gemini Responses**

   * Reduce repeated API calls for same questions
   * Use Redis or in-memory cache

4. **User Management**

   * Add NextAuth.js for Google login
   * Store email and Q\&A history for better UX

5. **Load Handling & Serverless Deployment**

   * Deploy frontend + backend on Vercel / Netlify
   * For heavy PDF processing or multiple concurrent requests, consider a separate microservice for LLM + PDF extraction

6. **Rate Limiting / Cost Control**

   * Limit requests per user to avoid excessive Gemini API costs
   * Optional: queue large PDF jobs and process asynchronously

7. **Background Task Queue**

   * Redis or RabbitMQ can be used to handle long-running tasks (PDF parsing, Gemini calls, email sending) without blocking user requests

---

## Data Flow

1. User uploads PDFs or types a question.
2. Frontend sends `question` + `files` to `/api/ask`.
3. Backend parses PDFs (if any) and calls appropriate Gemini function:

   * `callGeminiWithPdf` → PDFs exist
   * `callGeminiNoPdf` → No PDFs
4. Gemini responds with JSON: `answer`, `contexts`, `resources`, `roadmap`.
5. Backend returns JSON to frontend.
6. Frontend displays all sections:

   * Answer
   * Contexts (from PDFs)
   * Resources (links)
   * Roadmap (editable)
7. User can edit roadmap and send via email (`/api/email`).

---

## Conclusion

This design allows a **privacy-focused, fast, and interactive AI-powered PDF QA app**. For scaling, we can:

* Store PDFs in cloud (S3)
* Use vector DB for semantic retrieval
* Add caching and user management
* Separate heavy processing into microservices
* Use Redis/RabbitMQ for background processing to avoid blocking main requests

This ensures the app can grow from an MVP to a production-ready multi-user service.
