"use client";

import React, { useState, useEffect, useRef } from "react";
import { MeasureItem } from "@/types";

interface PlaybackHighlighterProps {
  measures: MeasureItem[];
  bpm: number;
  activeMeasureIndex: number | null;
  onActiveMeasureChange: (measureIndex: number | null) => void;
}

export function PlaybackHighlighter({
  measures,
  bpm,
  activeMeasureIndex,
  onActiveMeasureChange,
}: PlaybackHighlighterProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [loopMeasure, setLoopMeasure] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentMeasureRef = useRef<number>(1);

  const totalMeasures = measures.length || 1;
  const barDurationSec = (60.0 / bpm) * 4; // 4 beats per bar approx

  const startPlayback = () => {
    setIsPlaying(true);
    let bar = activeMeasureIndex || 1;
    currentMeasureRef.current = bar;
    onActiveMeasureChange(bar);

    const intervalMs = (barDurationSec / playbackSpeed) * 1000;

    timerRef.current = setInterval(() => {
      if (loopMeasure) {
        // Keep repeating current bar
        return;
      }

      currentMeasureRef.current += 1;
      if (currentMeasureRef.current > totalMeasures) {
        currentMeasureRef.current = 1;
      }
      onActiveMeasureChange(currentMeasureRef.current);
    }, intervalMs);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 flex flex-wrap items-center justify-between gap-4">
      {/* Play / Pause button */}
      <div className="flex items-center space-x-3">
        <button
          onClick={isPlaying ? stopPlayback : startPlayback}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/30 active:scale-95"
        >
          <span>{isPlaying ? "⏸ Pause Highlight" : "▶ Start Playback Highlight"}</span>
        </button>

        <div className="text-xs text-gray-300">
          Current Bar:{" "}
          <span className="font-bold text-indigo-400 font-mono text-sm">
            {activeMeasureIndex ? `Bar ${activeMeasureIndex}` : "None"}
          </span>
          <span className="text-gray-500 text-[11px] ml-1">/ {totalMeasures}</span>
        </div>
      </div>

      {/* Speed & Loop Controls */}
      <div className="flex items-center space-x-4 text-xs">
        {/* Loop bar toggle */}
        <label className="flex items-center space-x-2 cursor-pointer text-gray-300">
          <input
            type="checkbox"
            checked={loopMeasure}
            onChange={(e) => setLoopMeasure(e.target.checked)}
            className="rounded border-gray-700 text-indigo-600 focus:ring-0"
          />
          <span>Loop Bar</span>
        </label>

        {/* Speed selector */}
        <div className="flex items-center space-x-1 bg-gray-950 p-1 rounded-lg border border-gray-800">
          {[0.75, 1.0, 1.25].map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                playbackSpeed === speed ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
