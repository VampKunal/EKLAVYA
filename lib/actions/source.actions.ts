'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const uploadSource = async (formData: FormData) => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    const companionId = formData.get("companionId") as string;

    if (!file || !companionId) {
        throw new Error("Missing file or companionId");
    }

    const supabase = createSupabaseClient();

    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${companionId}/${Date.now()}.${fileExt}`;
    
    // Convert File to ArrayBuffer for uploading and processing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('companion-sources')
        .upload(fileName, buffer, {
            contentType: file.type,
        });

    if (uploadError) {
        throw new Error(`Failed to upload file to storage: ${uploadError.message}`);
    }

    const fileUrl = supabase.storage.from('companion-sources').getPublicUrl(fileName).data.publicUrl;

    // 2. Insert record into `sources` table
    const { data: sourceData, error: sourceError } = await supabase
        .from('sources')
        .insert({
            companion_id: companionId,
            user_id: userId,
            filename: file.name,
            file_url: fileUrl,
            content_type: file.type,
        })
        .select()
        .single();

    if (sourceError || !sourceData) {
        throw new Error(`Failed to save source record: ${sourceError?.message}`);
    }

    // 3. Extract text from the file
    let text = "";
    if (file.type === "application/pdf") {
        try {
            const { extractText } = await import("unpdf");
            const pdfData = await extractText(new Uint8Array(buffer));
            
            // Ensure we have a string, joining pages if necessary
            text = typeof pdfData.text === 'string' ? pdfData.text : 
                   (Array.isArray(pdfData.pages) ? pdfData.pages.map((p: any) => p.text).join('\n') : "");
            
            console.log(`PDF successfully parsed. Extracted ${text.length} characters.`);
        } catch (e) {
            console.error("PDF Parsing error:", e);
            throw new Error("Failed to parse PDF file. The file might be corrupt or image-only.");
        }
    } else if (file.type === "text/plain") {
        text = buffer.toString('utf-8');
    } else {
        throw new Error("Unsupported file type. Please upload a PDF or TXT file.");
    }

    if (!text || typeof text !== 'string' || !text.trim()) {
        throw new Error("No text could be extracted from the file.");
    }

    // 4. Chunk the extracted text
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const chunks = await splitter.createDocuments([text]);

    console.log(`Processing ${chunks.length} chunks...`);

    // 5. Generate embeddings for all chunks in batch
    const { GoogleGenerativeAIEmbeddings } = await import("@langchain/google-genai");
    
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.LLM_API_KEY,
        modelName: "text-embedding-004", 
    });

    // Batch embed all chunks
    const chunkTexts = chunks.map(chunk => chunk.pageContent);
    const embeddingResults = await embeddings.embedDocuments(chunkTexts);

    // Prepare chunk records for insertion
    const chunkRecords = chunks.map((chunk, index) => ({
        source_id: sourceData.id,
        companion_id: companionId,
        content: chunk.pageContent,
        embedding: embeddingResults[index],
    }));

    // 6. Save chunks and embeddings to `document_chunks` table
    const { error: chunkError } = await supabase
        .from('document_chunks')
        .insert(chunkRecords);

    if (chunkError) {
        throw new Error(`Failed to save document chunks to database: ${chunkError.message}`);
    }

    // Revalidate the companion page to show the new source
    revalidatePath(`/companion/${companionId}`);
    return sourceData;
};
