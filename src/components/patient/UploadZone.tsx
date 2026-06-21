"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, X, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import type { MedicalRecord } from "@/types/medical-record";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onParsedRecord: (record: MedicalRecord) => void;
  onParseError?: (message: string) => void;
}

interface ParseResponse {
  success: boolean;
  data?: MedicalRecord;
  message?: string;
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
const MAX_SIZE_MB = 10;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

export default function UploadZone({ onParsedRecord, onParseError }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastFile, setLastFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setSelectedFile(null);
    setError(null);
    setIsUploading(false);
    setLastFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type))
      return "Unsupported file type. Please upload PNG, JPEG, or PDF.";
    if (file.size > MAX_SIZE_MB * 1024 * 1024)
      return `File is too large. Maximum size is ${MAX_SIZE_MB}MB.`;
    return null;
  };

  const processFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setSelectedFile(file);
      setLastFile(file);
      setError(null);
      setIsUploading(true);

      try {
        const fileBase64 = await fileToBase64(file);
        const response = await fetch("/api/parse-document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileBase64, fileType: file.type }),
        });
        const json = (await response.json()) as ParseResponse;
        if (!json.success || !json.data)
          throw new Error(json.message ?? "AI parsing failed. Please try again.");
        onParsedRecord(json.data);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(msg);
        setSelectedFile(null);
        onParseError?.(msg);
      } finally {
        setIsUploading(false);
      }
    },
    [onParsedRecord, onParseError]
  );

  const handleRetry = () => {
    if (lastFile) processFile(lastFile);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="w-full space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-all duration-300",
          isDragging
            ? "border-[#10B981]/70 bg-[#10B981]/[0.06]"
            : "border-white/[0.10] bg-white/[0.02] hover:border-[#10B981]/40 hover:bg-[#10B981]/[0.03]",
          isUploading && "pointer-events-none opacity-70"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) processFile(file);
          }}
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-5">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#10B981]/20 bg-[#10B981]/10">
              <Loader2 className="h-9 w-9 animate-spin text-[#10B981]" />
              <div className="absolute inset-0 rounded-full bg-[#10B981]/5 animate-ping" />
            </div>
            <div>
              <p className="text-base font-semibold text-[#E2E8F0]">AI is analyzing your prescription</p>
              <p className="mt-1.5 text-sm text-[#94A3B8]">Extracting medicines, tests, and vitals. Please wait.</p>
            </div>
          </div>
        ) : selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#10B981]/20 bg-[#10B981]/10">
              <FileText className="h-8 w-8 text-[#10B981]" />
            </div>
            <p className="text-sm font-medium text-[#E2E8F0]">{selectedFile.name}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#10B981]/20 bg-[#10B981]/10">
              <UploadCloud className="h-9 w-9 text-[#10B981]" />
            </div>
            <div>
              <p className="text-base font-semibold text-[#E2E8F0]">
                {isDragging
                  ? "Drop your file here"
                  : "Drag & drop your prescription"}
              </p>
              <p className="mt-1.5 text-sm text-[#94A3B8]">
                or click to browse — PNG, JPG, JPEG, PDF (max {MAX_SIZE_MB}MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <div className="flex-1 text-sm text-red-300">{error}</div>
          <div className="flex items-center gap-2 shrink-0">
            {lastFile && (
              <button
                onClick={handleRetry}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            )}
            <button
              onClick={reset}
              className="shrink-0 text-red-400/60 hover:text-red-400 transition-colors"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
