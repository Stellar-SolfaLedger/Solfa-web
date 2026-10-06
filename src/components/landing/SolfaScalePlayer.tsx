"use client";

import React, { useState } from "react";

interface ScaleDegree {
  syllable: string;
  name: string;
  semitones: number;
}

const SCALE_DEGREES: ScaleDegree[] = [
  { syllable: "d", name: "Do (Tonic)", semitones: 0 },
  { syllable: "r", name: "Re (Supertonic)", semitones: 2 },
  { syllable: "m", name: "Mi (Mediant)", semitones: 4 },
  { syllable: "f", name: "Fa (Subdominant)", semitones: 5 },
  { syllable: "s", name: "So (Dominant)", semitones: 7 },
  { syllable: "l", name: "La (Submediant)", semitones: 9 },
  { syllable: "t", name: "Ti (Leading Tone)", semitones: 11 },
  { syllable: "d1", name: "Do' (Octave)", semitones: 12 },
];

const ROOT_KEYS: Record<string, number> = {
  C: 261.63,
  D: 293.66,
  E: 329.63,
  F: 349.23,
  G: 392.0,
  A: 440.0,
  Bb: 466.16,
};

export function SolfaScalePlayer() {
  const [selectedKey, setSelectedKey] = useState<string>("C");
  const [activeDegree, setActiveDegree] = useState<string | null>(null);

  const playTone = (semitones: number, syllable: string) => {
    if (typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const baseFreq = ROOT_KEYS[selectedKey] || 261.63;
      const freq = baseFreq * Math.pow(2, semitones / 12);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);

      setActiveDegree(syllable);
      setTimeout(() => setActiveDegree(null), 400);
    } catch {
      // Audio context fallback
    }
  };

  const playEntireScale = () => {
    SCALE_DEGREES.forEach((deg, idx) => {
      setTimeout(() => {
        playTone(deg.semitones, deg.syllable);
      }, idx * 350);
    });
  };

  return (
    <section className="py-20 border-t border-gray-900 bg-gray-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
            Movable-Do Interactive Audio
          </h2>
          <p className="text-3xl font-extrabold text-white tracking-tight">
            Hear Movable-Do in Action
          </p>
          <p className="text-sm text-gray-400">
            Click any tonic solfa degree to synthesize its frequency. Change keys to observe how
            movable-do transposes seamlessly.
          </p>
        </div>

        {/* Key selector buttons */}
        <div className="mt-8 flex items-center justify-center space-x-2 flex-wrap gap-2">
          <span className="text-xs font-semibold text-gray-400 mr-2">Key:</span>
          {Object.keys(ROOT_KEYS).map((k) => (
            <button
              key={k}
              onClick={() => setSelectedKey(k)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedKey === k
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-gray-900 text-gray-400 hover:text-white border border-gray-800"
              }`}
            >
              Key of {k}
            </button>
          ))}
          <button
            onClick={playEntireScale}
            className="ml-4 px-4 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20"
          >
            ▶ Play Full Scale
          </button>
        </div>

        {/* Solfa Keypad Grid */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 max-w-5xl mx-auto">
          {SCALE_DEGREES.map((deg) => {
            const isActive = activeDegree === deg.syllable;
            return (
              <button
                key={deg.syllable}
                onClick={() => playTone(deg.semitones, deg.syllable)}
                className={`p-5 rounded-2xl border text-center transition-all transform active:scale-95 ${
                  isActive
                    ? "bg-indigo-600 border-indigo-400 text-white scale-105 shadow-xl shadow-indigo-500/40"
                    : "bg-gray-900/80 border-gray-800 hover:border-indigo-500/50 hover:bg-gray-850 text-gray-200"
                }`}
              >
                <div className="text-2xl font-black mb-1 text-white">{deg.syllable}</div>
                <div className="text-[11px] font-semibold text-indigo-400">{deg.name}</div>
                <div className="text-[10px] text-gray-400 mt-1">+{deg.semitones} st</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
