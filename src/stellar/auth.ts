/**
 * Stellar SEP-10 Client Authentication Service.
 */

import { env } from "@/config/env";

export interface ChallengeResponse {
  transaction_xdr: string;
  network_passphrase: string;
}

export interface VerifyResponse {
  access_token: string;
  token_type: string;
  address: string;
  expires_in: number;
}

/**
 * Step 1: Request SEP-10 challenge transaction envelope from SolfaLedger Engine.
 */
export async function requestSep10Challenge(address: string): Promise<ChallengeResponse> {
  const res = await fetch(`${env.apiUrl}/auth/challenge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to request challenge" }));
    throw new Error(err.detail || `Server returned ${res.status}`);
  }

  return res.json();
}

/**
 * Step 2: Submit wallet-signed challenge transaction XDR to obtain JWT.
 */
export async function verifySep10Challenge(signedXdr: string): Promise<VerifyResponse> {
  const res = await fetch(`${env.apiUrl}/auth/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transaction_xdr: signedXdr }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Challenge verification failed" }));
    throw new Error(err.detail || `Server returned ${res.status}`);
  }

  const data: VerifyResponse = await res.json();
  if (typeof window !== "undefined") {
    localStorage.setItem("solfa_jwt_token", data.access_token);
    localStorage.setItem("solfa_auth_address", data.address);
  }
  return data;
}

/**
 * Get stored JWT token from localStorage.
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("solfa_jwt_token");
}

/**
 * Clear stored auth credentials.
 */
export function clearAuthSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("solfa_jwt_token");
    localStorage.removeItem("solfa_auth_address");
  }
}
