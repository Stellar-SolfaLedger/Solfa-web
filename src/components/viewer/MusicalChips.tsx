"use client";

import React from "react";
import { TranscriptionResult } from "@/types";

interface MusicalChipsProps {
  result: TranscriptionResult;
  onOpenOverrideModal: () => void;
}

export function MusicalChips({ result, onOpenOverrideModal }: MusicalChipsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* 1. Key Signature Chip */}
      <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Musical Key
          </div>
          <div className="text-lg font-bold text-indigo-400 mt-0.5">{result.tonic}</div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {Math.round(result.confidences.key * 100)}%
        </span>
      </div>

      {/* 2. Tempo BPM Chip */}
      <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Tempo
          </div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">
            {Math.round(result.bpm)} BPM
          </div>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
      </div>

      {/* 3. Time Signature Chip */}
      <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Time Signature
          </div>
          <div className="text-lg font-bold text-violet-400 mt-0.5">
            {result.time_signature} Time
          </div>
        </div>
        <span className="text-xs font-mono text-gray-400">Meter</span>
      </div>

      {/* 4. Free Override / Edit Button */}
      <button
        onClick={onOpenOverrideModal}
        className="p-4 rounded-2xl bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-indigo-500/40 text-left transition-all group flex items-center justify-between"
      >
        <div>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Need adjustments?
          </div>
          <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
            ✏ Edit Key / Meter
          </div>
        </div>
        <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded">
          Free
        </span>
      </button>
    </div>
  );
}
