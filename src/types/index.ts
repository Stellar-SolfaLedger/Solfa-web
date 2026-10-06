/**
 * SolfaLedger Core Domain Types: Wallets, Entitlements, Music, and Jobs.
 */

export type WalletType =
  | "freighter"
  | "lobstr"
  | "albedo"
  | "xbull"
  | "rabet"
  | "hana"
  | "walletconnect";

export interface ConnectedWallet {
  address: string;
  walletName: string;
  icon?: string;
  balanceXlm?: string;
}

export interface UserEntitlements {
  user: string;
  can_transcribe: boolean;
  has_active_subscription: boolean;
  subscription_plan_id: number | null;
  subscription_expires_at: number | null;
  is_unlimited: boolean;
  credits_remaining: number;
}

export interface NoteItem {
  solfa: string;
  octave: string;
  start_beat: number;
  duration_beats: number;
  midi: number;
  pitch_hz?: number | null;
}

export interface MeasureItem {
  index: number;
  start_sec: number;
  duration_sec: number;
  notes: NoteItem[];
}

export interface TranscriptionConfidences {
  key: number;
  tempo: number;
  meter: number;
}

export interface TranscriptionResult {
  key: string;
  mode: "major" | "minor";
  tonic: string;
  bpm: number;
  time_signature: string;
  confidences: TranscriptionConfidences;
  measures: MeasureItem[];
  solfa_text: string;
}

export type JobStatus = "pending" | "processing" | "completed" | "failed" | "unbilled";

export interface JobResponse {
  id: string;
  user_address: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  original_filename?: string | null;
  duration_sec?: number | null;
  error_message?: string | null;
  result?: TranscriptionResult | null;
  credit_consumed: boolean;
}

export interface JobListResponse {
  jobs: JobResponse[];
  total: number;
}

export interface OverrideParams {
  key?: string;
  mode?: "major" | "minor";
  time_signature?: string;
  bpm?: number;
}

export interface ContractBillingEvent {
  id: string;
  topic: string;
  user: string;
  planId?: number;
  token?: string;
  amount?: string;
  credits?: number;
  timestamp: number;
  txHash: string;
}
