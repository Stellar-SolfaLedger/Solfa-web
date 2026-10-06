"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MusicalChips } from "@/components/viewer/MusicalChips";
import { PlaybackHighlighter } from "@/components/viewer/PlaybackHighlighter";
import { SolfaSheetViewer } from "@/components/viewer/SolfaSheetViewer";
import { ExportMenu } from "@/components/viewer/ExportMenu";
import { OverrideModal } from "@/components/viewer/OverrideModal";
import { JobResponse, OverrideParams, TranscriptionResult } from "@/types";
import { apiService } from "@/services/api";

export default function JobViewerPage() {
  const params = useParams();
  const jobId = (params?.id as string) || "mock-job-id";

  const [job, setJob] = useState<JobResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [activeMeasureIndex, setActiveMeasureIndex] = useState<number | null>(null);

  // Mock result fallback if local backend is idling
  const fallbackResult: TranscriptionResult = {
    key: "C",
    mode: "major",
    tonic: "C Major",
    bpm: 120.0,
    time_signature: "4/4",
    confidences: { key: 0.96, tempo: 0.94, meter: 0.91 },
    measures: [
      {
        index: 1,
        start_sec: 0.0,
        duration_sec: 2.0,
        notes: [
          { solfa: "d", octave: "", start_beat: 0, duration_beats: 1, midi: 60 },
          { solfa: "r", octave: "", start_beat: 1, duration_beats: 1, midi: 62 },
          { solfa: "m", octave: "", start_beat: 2, duration_beats: 1, midi: 64 },
          { solfa: "f", octave: "", start_beat: 3, duration_beats: 1, midi: 65 },
        ],
      },
      {
        index: 2,
        start_sec: 2.0,
        duration_sec: 2.0,
        notes: [
          { solfa: "s", octave: "", start_beat: 0, duration_beats: 2, midi: 67 },
          { solfa: "l", octave: "", start_beat: 2, duration_beats: 1, midi: 69 },
          { solfa: "t", octave: "", start_beat: 3, duration_beats: 1, midi: 71 },
        ],
      },
      {
        index: 3,
        start_sec: 4.0,
        duration_sec: 2.0,
        notes: [{ solfa: "d", octave: "1", start_beat: 0, duration_beats: 4, midi: 72 }],
      },
    ],
    solfa_text:
      "KEY: C Major | TEMPO: 120 BPM | TIME: 4/4\n=================================================================\n\n| d : r : m : f | s : - : l : t | d1 : - : - : - ||\n",
  };

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getJob(jobId).catch(() => ({
        id: jobId,
        user_address: "GCATRF5LE7EWYOA55FIDRDB2UR76NYXOQ4CINGCTAD5RSGJODAGPQA7J",
        status: "completed" as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        original_filename: "Ascending_Major_Scale_Chorus.wav",
        duration_sec: 6.0,
        credit_consumed: true,
        result: fallbackResult,
      }));
      setJob(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const handleApplyOverride = async (overrideParams: OverrideParams) => {
    const updated = await apiService.overrideJob(jobId, overrideParams).catch(() => {
      // Local fallback simulation
      if (!job || !job.result) return job;
      const newKey = overrideParams.key || job.result.key;
      const newMode = overrideParams.mode || job.result.mode;
      return {
        ...job,
        result: {
          ...job.result,
          key: newKey,
          mode: newMode,
          tonic: `${newKey} ${newMode.toUpperCase()}`,
          bpm: overrideParams.bpm || job.result.bpm,
          time_signature: overrideParams.time_signature || job.result.time_signature,
        },
      };
    });
    if (updated) setJob(updated);
  };

  const currentResult = job?.result || fallbackResult;

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-850">
          <div>
            <Link
              href="/dashboard"
              className="text-xs text-indigo-400 hover:underline font-semibold flex items-center space-x-1 mb-2"
            >
              <span>← Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {job?.original_filename || `Transcription #${jobId.slice(0, 8)}`}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Verified on Stellar Soroban • 1 Credit Consumed
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <ExportMenu jobId={jobId} songTitle={job?.original_filename || "Solfa_Score"} />
          </div>
        </div>

        {/* 4 Parameter Chips (Key, BPM, Meter, Free Edit) */}
        <MusicalChips
          result={currentResult}
          onOpenOverrideModal={() => setIsOverrideModalOpen(true)}
        />

        {/* Bar-by-bar Playback Synchronizer */}
        <PlaybackHighlighter
          measures={currentResult.measures}
          bpm={currentResult.bpm}
          activeMeasureIndex={activeMeasureIndex}
          onActiveMeasureChange={(idx) => setActiveMeasureIndex(idx)}
        />

        {/* Tonic Solfa Sheet Music Viewer */}
        <SolfaSheetViewer
          result={currentResult}
          activeMeasureIndex={activeMeasureIndex}
          onMeasureClick={(idx) => setActiveMeasureIndex(idx)}
        />

        {/* Free Parameter Override Modal */}
        <OverrideModal
          isOpen={isOverrideModalOpen}
          onClose={() => setIsOverrideModalOpen(false)}
          currentResult={currentResult}
          onSaveOverride={handleApplyOverride}
        />
      </main>

      <Footer />
    </div>
  );
}
