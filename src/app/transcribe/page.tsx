"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileUploader } from "@/components/transcribe/FileUploader";
import { apiService } from "@/services/api";

type IngestMode = "file" | "url";

export default function TranscribePage() {
  const router = useRouter();
  const [mode, setMode] = useState<IngestMode>("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === "file" && !selectedFile) {
      setErrorMessage("Please select an audio file to transcribe.");
      return;
    }
    if (mode === "url" && !audioUrl.trim()) {
      setErrorMessage("Please enter a valid audio URL.");
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadProgress("Validating audio format & Soroban entitlements...");

      const formData = new FormData();
      if (mode === "file" && selectedFile) {
        formData.append("file", selectedFile);
      } else if (mode === "url") {
        formData.append("audio_url", audioUrl.trim());
      }

      setUploadProgress("Uploading audio stream to transcription engine...");
      const job = await apiService.createJob(formData);

      setUploadProgress("Transcription job enqueued! Redirecting to viewer...");
      setTimeout(() => {
        router.push(`/jobs/${job.id}`);
      }, 800);
    } catch (err: any) {
      if (err.message && err.message.includes("402")) {
        setErrorMessage("Insufficient credits or subscription expired. Please subscribe on-chain.");
        setTimeout(() => router.push("/pricing"), 2500);
      } else {
        setErrorMessage(err.message || "Failed to submit transcription job.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Page Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Audio-to-Tonic-Solfa AI
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transcribe Song Audio
          </h1>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Upload an audio recording or paste an online link. We convert the vocal line or melody
            into movable-do tonic solfa notation.
          </p>
        </div>

        {/* Tab switchers: File Upload vs URL */}
        <div className="flex border-b border-gray-800 mb-8 justify-center space-x-8">
          <button
            onClick={() => setMode("file")}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              mode === "file"
                ? "border-indigo-500 text-white"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            File Upload (MP3, WAV, etc.)
          </button>
          <button
            onClick={() => setMode("url")}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              mode === "url"
                ? "border-indigo-500 text-white"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Audio Stream URL
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "file" ? (
            <FileUploader
              onFileSelected={(file) => setSelectedFile(file)}
              selectedFile={selectedFile}
            />
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-300">Direct Audio URL</label>
              <input
                type="url"
                placeholder="https://example.com/audio/song_melody.mp3"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 focus:border-indigo-500 text-white text-sm focus:outline-none transition-colors"
              />
              <p className="text-[11px] text-gray-400">
                Direct link to MP3, WAV, M4A, OGG, or FLAC file.
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center">
              {errorMessage}
            </div>
          )}

          {uploadProgress && (
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium text-center animate-pulse">
              {uploadProgress}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 font-bold text-base text-white transition-all shadow-xl shadow-indigo-600/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing Audio..." : "Transcribe into Tonic Solfa (1 Credit)"}
            </button>
          </div>

          <div className="text-center text-xs text-gray-500">
            Protected by Stellar Soroban smart contracts • No charges for re-renders or overrides
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
