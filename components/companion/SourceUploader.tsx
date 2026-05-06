"use client";

import { useState, useRef } from "react";
import { uploadSource } from "@/lib/actions/source.actions";
import { UploadCloud, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SourceUploaderProps {
  companionId: string;
}

export default function SourceUploader({ companionId }: SourceUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setStatus("idle");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("companionId", companionId);

      await uploadSource(formData);

      setStatus("success");
      setFile(null); // Clear after success
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setErrorMessage(error.message || "Something went wrong while uploading.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded-xl bg-card shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Add Source Document</h3>
        <p className="text-sm text-muted-foreground">
          Upload a PDF or TXT file to give your companion context.
        </p>
      </div>

      <div
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer
          ${file ? "border-primary/50 bg-primary/5" : "border-muted-foreground/25 hover:bg-accent/50"}
        `}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="application/pdf, text/plain"
          onChange={handleFileChange}
        />

        {file ? (
          <div className="flex flex-col items-center text-center">
            <FileText className="size-10 text-primary mb-2" />
            <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <UploadCloud className="size-10 text-muted-foreground mb-2" />
            <p className="font-medium text-sm">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">PDF or TXT (Max 10MB)</p>
          </div>
        )}
      </div>

      {status === "error" && (
        <div className="mt-4 p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
          <AlertCircle className="size-4" />
          {errorMessage}
        </div>
      )}

      {status === "success" && (
        <div className="mt-4 p-3 bg-green-500/10 text-green-600 dark:text-green-400 text-sm rounded-md flex items-center gap-2">
          <CheckCircle2 className="size-4" />
          Document processed and vectorized successfully!
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button
          disabled={!file || isUploading}
          onClick={handleUpload}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Processing & Embedding...
            </>
          ) : (
            "Upload & Process"
          )}
        </Button>
      </div>
    </div>
  );
}
