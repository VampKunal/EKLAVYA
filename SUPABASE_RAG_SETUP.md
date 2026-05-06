# Phase 1: Database Setup for Document Uploads (RAG)

To enable "Chat with your sources" (RAG) just like NotebookLM, we need to upgrade your Supabase database to store files and their mathematical representations (vector embeddings).

Follow these steps directly in your Supabase Dashboard:

## Step 1: Run the SQL Setup Script
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project.
3. Click on **SQL Editor** in the left sidebar.
4. Click **New Query** and paste the following SQL code:

```sql
-- 1. Enable the pgvector extension for similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create a table to track uploaded documents/sources
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  companion_id UUID REFERENCES companions(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_url TEXT,
  content_type TEXT NOT NULL, -- e.g., 'application/pdf', 'text/plain'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create a table to store the text chunks and their embeddings
-- NOTE: We use vector(1536) for OpenAI or Gemini (with output dimensionality set to 1536).
CREATE TABLE IF NOT EXISTS document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE NOT NULL,
  companion_id UUID REFERENCES companions(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create an HNSW index for ultra-fast semantic search
CREATE INDEX ON document_chunks USING hnsw (embedding vector_cosine_ops);

-- 5. Create a function to search for relevant chunks
CREATE OR REPLACE FUNCTION match_document_chunks (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_companion_id uuid
)
RETURNS TABLE (
  id uuid,
  content text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    document_chunks.id,
    document_chunks.content,
    1 - (document_chunks.embedding <=> query_embedding) AS similarity
  FROM document_chunks
  WHERE document_chunks.companion_id = p_companion_id
    AND 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY document_chunks.embedding <=> query_embedding
  LIMIT match_count;
$$;
```

5. Click **Run**. This will create the necessary tables and the matching function for your AI to search through documents!

## Step 2: Create a Storage Bucket
We need a place to securely save the actual PDF and text files before we process them.
1. In the Supabase sidebar, click on **Storage**.
2. Click **New Bucket**.
3. Name it exactly: `companion-sources`.
4. You can leave it as "Public" for now to make things easier. Click **Save**.

---

## Step 3: Install Required Packages
Now that the database is ready, we need to install the backend tools in your Next.js project to read PDFs and generate embeddings.

Run this command in your terminal:
```bash
npm install pdf-parse langchain @langchain/openai
```
*(We install langchain to easily chunk text and generate embeddings).*

---

### What's Next?
Once you have run the SQL, created the bucket, and installed the packages, **let me know!** 

The next step is to create an API Route (`app/api/upload-source/route.ts`) that takes an uploaded file, extracts the text, creates embeddings, and saves them to your shiny new Supabase tables.
