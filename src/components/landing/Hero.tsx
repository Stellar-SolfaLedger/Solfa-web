"use client";

import React, { useState } from "react";
import Link from "next/link";

export function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);

  const playDemoAudio = () => {
    if (typeof window === "undefined") return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      setIsPlaying(true);

      // C4, D4, E4, F4, G4, A4, B4, C5
      const freqs = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];
      let time = ctx.currentTime + 0.1;

      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, time);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.exponentialRampToValueAtTime(0.3, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.3);
        time += 0.3;
      });

      setTimeout(() => {
        setIsPlaying(false);
      }, freqs.length * 300 + 200);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <span>🚀 Stellar Soroban Smart Contract Verified</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Transcribe Any Song into{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-500 bg-clip-text text-transparent">
                Tonic Solfa Notation
              </span>
            </h1>

            <p className="text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Movable-do transcription (<i>do re mi fa so la ti do</i>) reporting key signature,
              tempo (BPM), meter, and timing details. Metered and paid on-chain exclusively with
              Stellar assets (XLM, USDC, USDT).
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/transcribe"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-center transition-all shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95"
              >
                Transcribe Audio Now
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 font-semibold text-center transition-all hover:border-gray-700"
              >
                View Plans & Credits
              </Link>
            </div>

            {/* Feature badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-800/80 text-left max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-lg font-bold text-white">4 Formats</div>
                <div className="text-xs text-gray-400">PDF, MusicXML, TXT, JSON</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">100% On-Chain</div>
                <div className="text-xs text-gray-400">Soroban Rust Contract</div>
              </div>
              <div>
                <div className="text-lg font-bold text-white">Zero Recharge</div>
                <div className="text-xs text-gray-400">Free Key Overrides</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Solfa Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 p-6 shadow-2xl shadow-indigo-950/40">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-gray-400 pl-2">solfa_score.txt</span>
                </div>
                <button
                  onClick={playDemoAudio}
                  disabled={isPlaying}
                  className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm"
                >
                  <span>{isPlaying ? "Playing..." : "▶ Play Audio"}</span>
                </button>
              </div>

              {/* Detected parameter chips */}
              <div className="grid grid-cols-3 gap-2 my-4">
                <div className="p-2.5 rounded-xl bg-gray-800/60 border border-gray-700/50 text-center">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Key</div>
                  <div className="text-sm font-bold text-indigo-400">C Major</div>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-800/60 border border-gray-700/50 text-center">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Tempo</div>
                  <div className="text-sm font-bold text-emerald-400">120 BPM</div>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-800/60 border border-gray-700/50 text-center">
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Meter</div>
                  <div className="text-sm font-bold text-violet-400">4/4 Time</div>
                </div>
              </div>

              {/* Traditional Tonic Solfa Layout Box */}
              <div className="rounded-xl bg-black/70 p-4 border border-gray-800 font-mono text-xs text-gray-200 space-y-2 select-none overflow-x-auto">
                <div className="text-gray-400 text-[10px] pb-1 border-b border-gray-800">
                  KEY: C Major | TIME: 4/4 | MOVABLE-DO SCORE
                </div>
                <div className="pt-1 text-sm font-semibold tracking-wide text-indigo-300">
                  | d : r : m : f | s : - : l : t |
                </div>
                <div className="text-sm font-semibold tracking-wide text-indigo-300">
                  | d1 : - : - : - | - : - : - : - ||
                </div>
              </div>

              {/* Verified badge */}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800/80">
                <span className="flex items-center text-emerald-400 font-medium">
                  ✓ Entitlement Verified on Soroban
                </span>
                <span className="text-gray-500 font-mono text-[11px]">Fee: 1 Credit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
