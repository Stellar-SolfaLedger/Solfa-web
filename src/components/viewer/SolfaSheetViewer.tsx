"use client";

import React, { useState } from "react";
import { TranscriptionResult } from "@/types";

interface SolfaSheetViewerProps {
  result: TranscriptionResult;
  activeMeasureIndex?: number | null;
  onMeasureClick?: (measureIndex: number) => void;
}

export function SolfaSheetViewer({
  result,
  activeMeasureIndex,
  onMeasureClick,
}: SolfaSheetViewerProps) {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.solfa_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const getFontSizeClass = () => {
    if (fontSize === "sm") return "text-xs leading-6";
    if (fontSize === "lg") return "text-base sm:text-lg leading-8";
    return "text-sm leading-7";
  };

  return (
    <div className="rounded-3xl bg-gray-900/80 border border-gray-800 shadow-2xl overflow-hidden">
      {/* Viewer Action Bar */}
      <div className="flex flex-wrap items-center justify-between p-4 px-6 border-b border-gray-800 bg-gray-950/60">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            Tonic Solfa Score Sheet
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {/* Font size control */}
          <div className="flex items-center space-x-1 bg-gray-850 p-1 rounded-lg border border-gray-800 text-gray-400">
            <button
              onClick={() => setFontSize("sm")}
              className={`px-2 py-0.5 rounded ${fontSize === "sm" ? "bg-gray-700 text-white" : ""}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize("base")}
              className={`px-2 py-0.5 rounded ${fontSize === "base" ? "bg-gray-700 text-white" : ""}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize("lg")}
              className={`px-2 py-0.5 rounded ${fontSize === "lg" ? "bg-gray-700 text-white" : ""}`}
            >
              A+
            </button>
          </div>

          {/* Copy button */}
          <button
            onClick={copyToClipboard}
            className="px-3.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-all border border-gray-700 active:scale-95"
          >
            {copied ? "✓ Copied Score" : "📋 Copy Score"}
          </button>
        </div>
      </div>

      {/* Main Sheet Music Score Body */}
      <div className="p-6 sm:p-8 bg-black/60 overflow-x-auto">
        {/* Preformatted text score */}
        <pre
          className={`font-mono font-bold tracking-wider text-indigo-200 select-text whitespace-pre ${getFontSizeClass()}`}
        >
          {result.solfa_text}
        </pre>
      </div>

      {/* Bar-by-Bar Visualizer Grid */}
      {result.measures && result.measures.length > 0 && (
        <div className="p-6 border-t border-gray-800 bg-gray-950/40">
          <div className="text-[11px] font-semibold uppercase text-gray-400 tracking-wider mb-3">
            Interactive Measure Grid (Click a bar to jump playback)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {result.measures.map((m) => {
              const isActive = activeMeasureIndex === m.index;
              return (
                <button
                  key={m.index}
                  onClick={() => onMeasureClick && onMeasureClick(m.index)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? "bg-indigo-600 border-indigo-400 text-white scale-105 shadow-lg shadow-indigo-600/40"
                      : "bg-gray-900 border-gray-800 hover:border-gray-700 text-gray-300"
                  }`}
                >
                  <div className="text-[10px] text-gray-400 font-bold">Bar {m.index}</div>
                  <div className="text-xs font-mono font-bold truncate mt-1">
                    {m.notes.map((n) => `${n.solfa}${n.octave}`).join(" ") || "-"}
                  </div>
                  <div className="text-[9px] text-gray-400 mt-0.5">{m.start_sec.toFixed(1)}s</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
