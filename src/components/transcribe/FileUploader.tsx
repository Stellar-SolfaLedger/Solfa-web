"use client";

import React, { useRef, useState } from "react";

interface FileUploaderProps {
  onFileSelected: (file: File | null) => void;
  selectedFile: File | null;
}

const ALLOWED_EXTENSIONS = [".mp3", ".wav", ".m4a", ".ogg", ".flac"];
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export function FileUploader({ onFileSelected, selectedFile }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndSet = (file: File) => {
    setError(null);
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported format '${ext}'. Allowed: MP3, WAV, M4A, OGG, FLAC.`);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File exceeds maximum size limit of 50 MB.");
      return;
    }
    onFileSelected(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSet(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSet(e.target.files[0]);
    }
  };

  return (
    <div className="w-full space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,.wav,.m4a,.ogg,.flac"
        onChange={handleChange}
        className="hidden"
      />

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${
          dragActive
            ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]"
            : "border-gray-800 hover:border-indigo-500/50 bg-gray-900/40 hover:bg-gray-900/70"
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-3xl mb-4 text-indigo-400">
          🎵
        </div>

        {selectedFile ? (
          <div className="text-center space-y-1">
            <div className="text-base font-bold text-white">{selectedFile.name}</div>
            <div className="text-xs text-indigo-400 font-mono">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for Transcription
            </div>
            <div className="pt-2">
              <span className="text-xs text-gray-400 underline">Click to choose another file</span>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-1">
            <div className="text-base font-semibold text-white">
              Drag & Drop song audio, or <span className="text-indigo-400">browse files</span>
            </div>
            <div className="text-xs text-gray-400">
              Supports MP3, WAV, M4A, OGG, FLAC up to 50 MB
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
          {error}
        </div>
      )}
    </div>
  );
}
