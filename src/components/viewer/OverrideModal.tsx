"use client";

import React, { useState } from "react";
import { OverrideParams, TranscriptionResult } from "@/types";

interface OverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentResult: TranscriptionResult;
  onSaveOverride: (params: OverrideParams) => Promise<void>;
}

const KEYS = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const TIME_SIGNATURES = ["4/4", "3/4", "2/4", "6/8"];

export function OverrideModal({
  isOpen,
  onClose,
  currentResult,
  onSaveOverride,
}: OverrideModalProps) {
  const [key, setKey] = useState<string>(currentResult.key || "C");
  const [mode, setMode] = useState<"major" | "minor">(currentResult.mode || "major");
  const [timeSignature, setTimeSignature] = useState<string>(
    currentResult.time_signature || "4/4"
  );
  const [bpm, setBpm] = useState<number>(Math.round(currentResult.bpm) || 120);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSaveOverride({
        key,
        mode,
        time_signature: timeSignature,
        bpm,
      });
      onClose();
    } catch (err: any) {
      alert(`Failed to re-render score: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-gray-900 border border-gray-800 p-6 shadow-2xl text-white">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div>
            <h3 className="text-lg font-bold">Edit Musical Parameters</h3>
            <span className="text-[11px] text-emerald-400 font-medium">
              ✓ Free Re-render • Zero Additional Charge
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-lg">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Key Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Root Key</label>
              <select
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
              >
                {KEYS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as "major" | "minor")}
                className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
              >
                <option value="major">Major (Ionian)</option>
                <option value="minor">Minor (Aeolian)</option>
              </select>
            </div>
          </div>

          {/* Meter & Tempo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Time Signature
              </label>
              <select
                value={timeSignature}
                onChange={(e) => setTimeSignature(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
              >
                {TIME_SIGNATURES.map((sig) => (
                  <option key={sig} value={sig}>
                    {sig}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Tempo (BPM)</label>
              <input
                type="number"
                min="40"
                max="260"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <p className="text-[11px] text-gray-400 pt-1 leading-relaxed">
            Movable-do tonic solfa notes will be recomputed relative to your specified tonic key
            root and meter grid.
          </p>

          <div className="flex items-center space-x-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30"
            >
              {isSubmitting ? "Re-rendering..." : "Apply & Re-render"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
