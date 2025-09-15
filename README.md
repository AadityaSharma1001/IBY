Name - Aaditya Sharma
College - IIT jodhpur
Department - Mechanical Engineering

# Gemini PDF QA App - Documentation & Setup Guide

## Table of Contents

1. Overview
2. Core Features (Mandatory)
3. Optional Features (Bonus Points)
4. Tech Stack
5. Project Setup
6. Environment Variables
7. Running the App
8. Folder Structure
9. Deployment
10. Notes & Recommendations

---

## 1. Overview

The Gemini PDF QA App is a full-stack application that helps users automate the process of answering technical or research questions based on PDFs or general web content. The app uses Gemini 2.0 Flash API to generate answers, provide relevant context from PDFs, suggest resources, and create a learning roadmap. Users can edit the roadmap and email it.

---

## 2. Core Features (Mandatory)

* Automates the manual task of searching and summarizing information from PDFs or online resources.
* Allows users to upload multiple PDFs (processed in-memory, no storage) or ask questions directly.
* Generates concise answers, relevant PDF contexts, and a stepwise learning roadmap.
* Provides suggestions for up to 5 research papers or blogs if the answer is not found in PDFs.
* Includes a user interface for viewing answers, contexts, resources, and an editable roadmap.
* Users can edit the roadmap and send it via email.

---

## 3. Optional Features (Bonus Points)

* Multi-agent collaboration: Separate roles for reasoning and task execution and handling data.
* Background processing: Use Redis or RabbitMQ to handle long-running tasks without blocking main requests.(Can Be skipped for simplicity)
---

## 4. Tech Stack

* **Frontend:** Next.js (React, App Router)
* **Backend:** Next.js API Routes
* **PDF Parsing:** pdf.js-extract
* **AI LLM:** Gemini 2.0 Flash API
* **Email:** Nodemailer
* **Background Processing:** Redis / RabbitMQ (optional)
* **Styling:** TailwindCSS

---

## 5. Project Setup

1. **Clone the repo:**

```bash
git clone <your-repo-url>
cd <repo-folder>
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set environment variables:**
   Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_URL=your_gemini_api_url
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
```

(Optional for background processing)

```env
REDIS_URL=redis://localhost:6379
```

---

## 6. Running the App

1. **Development mode:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Production build:**

```bash
npm run build
npm start
```

3. **Optional:**

* If using Redis/RabbitMQ for background tasks, start your worker queue separately.

---

## 7. Folder Structure

```
src/
├─ app/
│  ├─ api/
│  │  ├─ ask/route.js       # Endpoint for question + PDFs
│  │  ├─ email/route.js     # Endpoint for sending roadmap emails
│  │  └─ roadmap/route.js   # Optional: Endpoint for managing roadmaps explicitly
│  ├─ page.js               # Home page
│  └─ components/
│     ├─ Chat.js            # Chat display (answer, contexts, resources, roadmap)
│     ├─ Uploader.js        # Component for uploading PDFs
│     └─ RoadmapEditor.js   # Editable roadmap UI
├─ lib/
│   ├─ fetchPapers.js       # Fetch research papers/blogs from web if needed (Didn't used beacuse sematic scholar api key will be given to me later)
│   └─ gemini.js            # Gemini API integration
├─ styles/
│  └─ globals.css
```

---

## 8. Deployment

* Deploy on **Vercel** for serverless functions (API routes).
* Ensure `.env` variables are set in the deployment environment.
* Optional: Use **Redis Cloud** for background task queue.

---

## 9. Notes & Recommendations

* PDFs are processed in-memory for privacy; consider S3 if you need persistence.
* Use a vector database (e.g., Pinecone, Chroma) for semantic search in large PDF collections.
* Implement caching for repeated questions to reduce Gemini API calls.
* Monitor Gemini API usage to control costs.
* Ensure email credentials are secured; consider app-specific passwords.
* Background task queues prevent blocking long-running requests.

---

This guide should allow anyone to set up, run, and understand the Gemini PDF QA App quickly.
