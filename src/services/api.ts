/**
 * Client HTTP Service for interacting with SolfaLedger Engine API.
 */

import { env } from "@/config/env";
import { getStoredToken } from "@/stellar/auth";
import {
  JobResponse,
  JobListResponse,
  UserEntitlements,
  OverrideParams,
} from "@/types";

function getHeaders(isMultipart: boolean = false): HeadersInit {
  const token = getStoredToken();
  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const apiService = {
  /**
   * Fetch live user subscription and credit entitlements from backend / Soroban.
   */
  async getEntitlements(): Promise<UserEntitlements> {
    const res = await fetch(`${env.apiUrl}/me/entitlements`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch entitlements: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Upload audio file or submit URL for transcription.
   */
  async createJob(formData: FormData): Promise<JobResponse> {
    const res = await fetch(`${env.apiUrl}/jobs`, {
      method: "POST",
      headers: getHeaders(true),
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Upload failed" }));
      throw new Error(err.detail || `Upload failed with status ${res.status}`);
    }
    return res.json();
  },

  /**
   * List transcription jobs for current user.
   */
  async listJobs(limit = 50, offset = 0): Promise<JobListResponse> {
    const res = await fetch(`${env.apiUrl}/jobs?limit=${limit}&offset=${offset}`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Failed to list jobs: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Fetch single job details and result.
   */
  async getJob(jobId: string): Promise<JobResponse> {
    const res = await fetch(`${env.apiUrl}/jobs/${jobId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Failed to get job: ${res.statusText}`);
    }
    return res.json();
  },

  /**
   * Override musical parameters (key, mode, meter) at zero cost.
   */
  async overrideJob(jobId: string, params: OverrideParams): Promise<JobResponse> {
    const res = await fetch(`${env.apiUrl}/jobs/${jobId}/override`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Override failed" }));
      throw new Error(err.detail || "Failed to override parameters");
    }
    return res.json();
  },

  /**
   * Download exported score (PDF, MusicXML, TXT, JSON).
   */
  async downloadExport(jobId: string, format: "pdf" | "txt" | "musicxml" | "json"): Promise<Blob> {
    const res = await fetch(`${env.apiUrl}/jobs/${jobId}/export?format=${format}`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Export download failed: ${res.statusText}`);
    }
    return res.blob();
  },
};
