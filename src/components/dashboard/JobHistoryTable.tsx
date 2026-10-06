"use client";

import React from "react";
import Link from "next/link";
import { JobResponse, JobStatus } from "@/types";

interface JobHistoryTableProps {
  jobs: JobResponse[];
  isLoading?: boolean;
}

export function JobHistoryTable({ jobs, isLoading }: JobHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-gray-400 bg-gray-900/40 rounded-2xl border border-gray-800 animate-pulse">
        Loading transcription job history from engine...
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="p-12 text-center bg-gray-900/40 rounded-2xl border border-gray-800 space-y-3">
        <div className="text-3xl">🎼</div>
        <div className="text-sm font-semibold text-white">No transcriptions submitted yet</div>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">
          Upload your first vocal song or church hymn to generate its tonic solfa score.
        </p>
        <Link
          href="/transcribe"
          className="inline-block px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
        >
          Transcribe Your First Song
        </Link>
      </div>
    );
  }

  const renderStatusBadge = (status: JobStatus) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ✓ Completed
          </span>
        );
      case "processing":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse">
            Processing...
          </span>
        );
      case "pending":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Queued
          </span>
        );
      case "unbilled":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            Unbilled (Retry)
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            Failed
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900/60 shadow-xl">
      <table className="w-full text-left text-xs text-gray-300">
        <thead className="border-b border-gray-800 bg-gray-950/80 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
          <tr>
            <th className="py-3.5 px-4">Song / File</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Detected Tonality</th>
            <th className="py-3.5 px-4">Tempo & Meter</th>
            <th className="py-3.5 px-4">Created Date</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-850">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-800/40 transition-colors">
              <td className="py-3.5 px-4 font-semibold text-white truncate max-w-xs">
                {job.original_filename || `Job ${job.id.slice(0, 8)}`}
              </td>
              <td className="py-3.5 px-4">{renderStatusBadge(job.status)}</td>
              <td className="py-3.5 px-4">
                {job.result ? (
                  <span className="font-semibold text-indigo-400">{job.result.tonic}</span>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </td>
              <td className="py-3.5 px-4">
                {job.result ? (
                  <span>
                    {Math.round(job.result.bpm)} BPM • {job.result.time_signature}
                  </span>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </td>
              <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">
                {new Date(job.created_at).toLocaleDateString()}
              </td>
              <td className="py-3.5 px-4 text-right">
                <Link
                  href={`/jobs/${job.id}`}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-semibold transition-all inline-block border border-indigo-500/30"
                >
                  View Score →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
