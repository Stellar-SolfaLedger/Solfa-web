"use client";

import React, { useState } from "react";
import { apiService } from "@/services/api";

interface ExportMenuProps {
  jobId: string;
  songTitle?: string;
}

export function ExportMenu({ jobId, songTitle = "Score" }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const formats = [
    { id: "pdf", name: "Printable PDF Score", desc: "ReportLab high-res sheet", icon: "📕", ext: "pdf" },
    { id: "musicxml", name: "MusicXML 3.1", desc: "MuseScore & Sibelius score", icon: "🎼", ext: "musicxml" },
    { id: "txt", name: "Plaintext Solfa", desc: "Traditional text layout", icon: "📝", ext: "txt" },
    { id: "json", name: "Raw Musical JSON", desc: "Notes, beats & metrics", icon: "⚡", ext: "json" },
  ];

  const handleDownload = async (formatId: "pdf" | "txt" | "musicxml" | "json", ext: string) => {
    try {
      setDownloadingFormat(formatId);
      const blob = await apiService.downloadExport(jobId, formatId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${songTitle.replace(/\s+/g, "_")}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setIsOpen(false);
    } catch (err: any) {
      alert(`Download failed: ${err.message || err}`);
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 active:scale-95"
      >
        <span>📥 Export Score</span>
        <span>▾</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl p-2 z-50 animate-fade-in divide-y divide-gray-850">
          <div className="p-2 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            Choose Score Format
          </div>
          <div className="pt-1 space-y-1">
            {formats.map((f) => (
              <button
                key={f.id}
                onClick={() => handleDownload(f.id as any, f.ext)}
                disabled={Boolean(downloadingFormat)}
                className="flex items-center w-full p-2.5 rounded-xl hover:bg-gray-800 transition-colors text-left group"
              >
                <span className="text-xl mr-3">{f.icon}</span>
                <div className="flex-1">
                  <div className="text-xs font-bold text-white group-hover:text-indigo-400">
                    {f.name}
                  </div>
                  <div className="text-[10px] text-gray-400">{f.desc}</div>
                </div>
                {downloadingFormat === f.id && (
                  <span className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
