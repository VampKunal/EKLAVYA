# EKLAVYA Remodeling & Setup Guide: The NotebookLM Approach

This guide provides a comprehensive roadmap for transforming the **EKLAVYA** project into a powerful, user-friendly study companion inspired by Google's NotebookLM. It also includes step-by-step instructions for recovering your lost environment variables and setting up all required API keys.

---

## 1. Environment Variables Setup (`.env`)

You've lost your `.env` file. Based on your project's current dependencies (`Clerk`, `Supabase`, `OpenAI SDK`, `Vapi`), here is what your `.env.local` or `.env` file needs to look like.

I have created an `.env.example` file in your project root. You can copy it to `.env` and fill in the values using the instructions below.

### How to get each key:

#### A. Authentication (Clerk)
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/).
2. Create a new application (if you haven't already).
3. Select "API Keys" from the sidebar.
4. Copy the **Publishable Key** (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`) and **Secret Key** (`CLERK_SECRET_KEY`).
5. Also, add the standard routing keys:
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard`

#### B. Database & Storage (Supabase)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard).
2. Create a new project.
3. Once created, go to **Project Settings -> API**.
4. Copy the **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`) and the **anon `public` key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).
5. (Optional but recommended for backend admin tasks): Copy the **service_role secret** (`SUPABASE_SERVICE_ROLE_KEY`). *Never expose this to the frontend!*

#### C. LLM Provider (OpenAI / Gemini)
Your code (`lib/llm.ts`) uses the OpenAI SDK but defaults to the `gemini-2.0-flash` model. This means you are likely using an OpenAI-compatible API endpoint for Gemini, such as OpenRouter or Gemini's own compatibility layer.
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) (or OpenRouter if you use that).
2. Generate an API Key.
3. Set `LLM_API_KEY=your_api_key`.
4. If using Gemini directly via their OpenAI-compatible endpoint, set `LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/`.

#### D. Real-time Voice Agent (Vapi.ai)
To achieve the high-quality conversational audio ("Audio Overview") like NotebookLM, you will need Vapi.
1. Go to [Vapi Dashboard](https://dashboard.vapi.ai/).
2. Create an account and navigate to "API Keys".
3. Copy your **Public Key** (`NEXT_PUBLIC_VAPI_PUBLIC_KEY`).

#### E. Error Tracking (Sentry) (Optional but recommended)
1. Go to [Sentry.io](https://sentry.io/).
2. Create a Next.js project.
3. Copy the DSN to `NEXT_PUBLIC_SENTRY_DSN` and your auth token to `SENTRY_AUTH_TOKEN`.

---

## 2. Remodeling Strategy: Achieving the "NotebookLM" Experience

To make EKLAVYA as good and easy to use as NotebookLM, you need to shift the architecture from a simple "chat with a bot" to a **Source-Grounding (RAG) Architecture**.

### Phase 1: The "Sources" Feature (Document Upload)
NotebookLM's magic starts with uploading documents.
1. **UI Update**: Build a dashboard where users can upload PDFs, text files, or paste website URLs to create a "Notebook" (or "Companion Context").
2. **Backend**:
   - Use **Supabase Storage** to save the uploaded PDFs/documents.
   - Implement **Document Parsing** (e.g., `pdf-parse` or LangChain/LlamaIndex document loaders) to extract text.
3. **Vector Database**:
   - Chunk the extracted text into smaller segments.
   - Generate embeddings using an embedding model (like `text-embedding-3-small` or Gemini embeddings).
   - Store these embeddings in a **Supabase `pgvector`** database table.

### Phase 2: "Chat with your Sources" (Interactive Companion)
Currently, your app just chats via standard LLM prompts. We need to upgrade it to Retrieval-Augmented Generation (RAG).
1. When a user asks the companion a question, first **search the vector database** for the most relevant text chunks from their uploaded sources.
2. Inject those text chunks into the system prompt:
   *"You are an expert tutor. Answer the user's question using ONLY the following source material..."*
3. This prevents hallucinations and makes the companion highly accurate, just like NotebookLM.

### Phase 3: The "Audio Deep Dive" (Podcast Generation)
This is NotebookLM's most viral feature.
1. Use an LLM to generate a conversational script between two "hosts" discussing the user's uploaded sources.
2. Use **Vapi** (which you already have in `package.json`) or **ElevenLabs** to synthesize this script into high-quality, expressive audio.
3. Serve this audio to the user as a "Listen to your notes" feature.

### Phase 4: UI/UX Overhaul
- **Dual-Pane Layout**: Implement a layout using Shadcn UI where the left sidebar contains the user's "Sources" and the right main area contains the "Notebook Guide" (auto-generated summaries) and the "Chat".
- **Auto-Generated Content**: The moment a user uploads a source, automatically trigger your LLM to generate:
  - A brief summary.
  - 5 Suggested Questions.
  - A Study Guide or Quiz (you already have a `/quiz` route, which is perfect!).

---

## Next Steps
1. Create your `.env.local` file by copying the `.env.example` file provided in the project root.
2. Review the Shadcn components available in your project and start sketching out the dual-pane layout.
3. Once your environment is set up, we can start implementing Phase 1 (Document Upload & Vector DB). Let me know when you are ready to write code!
