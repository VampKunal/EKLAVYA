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
    <div className="w-full max-w-md p-8 border border-white/5 bg-black/20 backdrop-blur-md shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 text-[8px] uppercase tracking-[2px] opacity-10 font-black italic">UPLOAD_GATE // 07</div>
      
      <div className="mb-10">
        <h3 className="text-xs uppercase tracking-[4px] font-black text-white/40 mb-2">Neural_Ingestion</h3>
        <p className="text-[10px] uppercase tracking-[2px] font-bold opacity-30 leading-relaxed">
          Upload PDF/TXT datasets to synchronize your node's knowledge parameters.
        </p>
      </div>

      <div
        className={`relative flex flex-col items-center justify-center p-12 border border-dashed transition-all duration-500 cursor-pointer group/upload
          ${file ? "border-magenta bg-magenta/5 shadow-[0_0_20px_rgba(255,0,110,0.1)]" : "border-white/10 hover:border-magenta/50 hover:bg-white/5"}
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
            <FileText className="size-12 text-magenta mb-4 animate-pulse" />
            <p className="text-[10px] uppercase tracking-[2px] font-black text-white truncate max-w-[200px]">{file.name}</p>
            <p className="text-[8px] uppercase tracking-[3px] font-black opacity-20 mt-2">
              SIZE // {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <UploadCloud className="size-12 text-white/10 group-hover/upload:text-magenta transition-colors mb-4" />
            <p className="text-[10px] uppercase tracking-[3px] font-black opacity-40 group-hover/upload:opacity-100 transition-opacity">Initialize_Upload</p>
            <p className="text-[8px] uppercase tracking-[2px] opacity-20 mt-2 font-black">MAX_LOAD // 10MB</p>
          </div>
        )}
      </div>

      {status === "error" && (
        <div className="mt-6 p-4 bg-magenta/10 border-l-2 border-magenta text-magenta text-[10px] uppercase tracking-[2px] font-black flex items-center gap-3">
          <AlertCircle className="size-4" />
          {errorMessage}
        </div>
      )}

      {status === "success" && (
        <div className="mt-6 p-4 bg-green-500/10 border-l-2 border-green-500 text-green-500 text-[10px] uppercase tracking-[2px] font-black flex items-center gap-3">
          <CheckCircle2 className="size-4" />
          Ingestion_Success // Vectorized
        </div>
      )}

      <div className="mt-8">
        <button
          disabled={!file || isUploading}
          onClick={handleUpload}
          className="w-full bg-white text-black py-4 text-[10px] uppercase tracking-[4px] font-black hover:bg-magenta hover:text-white transition-all disabled:opacity-20 shadow-xl relative overflow-hidden group/btn"
        >
          <span className="relative z-10">
            {isUploading ? "Processing_Sync..." : "Execute_Ingestion"}
          </span>
          <div className="absolute inset-0 bg-magenta translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
        </button>
      </div>
    </div>
  );
}
