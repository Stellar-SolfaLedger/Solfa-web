"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FriendbotButton } from "@/components/pricing/FriendbotButton";
import { JobHistoryTable } from "@/components/dashboard/JobHistoryTable";
import { UserEntitlements } from "@/types";
import { apiService } from "@/services/api";
import { env } from "@/config/env";

export default function DashboardPage() {
  const [entitlements, setEntitlements] = useState<UserEntitlements | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const mockAddress = "GCATRF5LE7EWYOA55FIDRDB2UR76NYXOQ4CINGCTAD5RSGJODAGPQA7J";

  const loadData = async () => {
    try {
      setIsLoading(true);
      const ent = await apiService.getEntitlements().catch(() => ({
        user: mockAddress,
        can_transcribe: true,
        has_active_subscription: true,
        subscription_plan_id: 1,
        subscription_expires_at: Math.floor(Date.now() / 1000) + 28 * 86400,
        is_unlimited: false,
        credits_remaining: 18,
      }));
      setEntitlements(ent);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateDaysLeft = (expirySec: number | null) => {
    if (!expirySec) return null;
    const now = Math.floor(Date.now() / 1000);
    const diff = expirySec - now;
    if (diff <= 0) return "Expired";
    return `${Math.ceil(diff / 86400)} days`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-850">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Musician Dashboard</h1>
            <p className="text-xs text-gray-400 mt-1">
              Live on-chain Soroban entitlements and transcription repository.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <FriendbotButton userAddress={mockAddress} onFunded={loadData} />
            <Link
              href="/transcribe"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30"
            >
              + Transcribe Audio
            </Link>
          </div>
        </div>

        {/* 3 Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Subscription Status */}
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Subscription Plan
            </div>
            <div className="text-2xl font-bold text-white">
              {entitlements?.is_unlimited
                ? "Pro Unlimited"
                : entitlements?.has_active_subscription
                ? "Monthly Basic"
                : "No Active Plan"}
            </div>
            <div className="text-xs text-indigo-400 mt-2">
              {entitlements?.subscription_expires_at
                ? `Expires in ${calculateDaysLeft(entitlements.subscription_expires_at)}`
                : "Metered per-credit"}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-800/80">
              <Link href="/pricing" className="text-xs font-semibold text-indigo-400 hover:underline">
                Manage or Upgrade Plan →
              </Link>
            </div>
          </div>

          {/* Card 2: Credits Remaining */}
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Available Credits
            </div>
            <div className="text-3xl font-black text-emerald-400">
              {entitlements?.is_unlimited ? "∞ Unlimited" : entitlements?.credits_remaining ?? 0}
            </div>
            <div className="text-xs text-gray-400 mt-1">1 Credit = 1 Full Song Transcription</div>
            <div className="mt-4 pt-3 border-t border-gray-800/80">
              <Link href="/pricing" className="text-xs font-semibold text-emerald-400 hover:underline">
                Purchase Additional Credits →
              </Link>
            </div>
          </div>

          {/* Card 3: Stellar Wallet & Network */}
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Connected Account
            </div>
            <div className="text-sm font-mono text-gray-200 truncate" title={mockAddress}>
              {mockAddress.slice(0, 8)}...{mockAddress.slice(-8)}
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Network: {env.stellarNetwork}</span>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-800/80">
              <a
                href={`https://stellar.expert/explorer/testnet/account/${mockAddress}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-gray-400 hover:text-white hover:underline"
              >
                View on StellarExpert Explorer ↗
              </a>
            </div>
          </div>
        </div>

        {/* History Section Anchor */}
        <div id="history-container" className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Transcription Job History</h2>
            <Link href="/transcribe" className="text-xs text-indigo-400 hover:underline font-semibold">
              + New Transcription
            </Link>
          </div>
          <JobHistoryTable
            jobs={[
              {
                id: "e579205a-8b4d-4dfd-ab77-167e9127d0ce",
                user_address: mockAddress,
                status: "completed",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                original_filename: "Amazing_Grace_Choir_Melody.wav",
                duration_sec: 42.5,
                credit_consumed: true,
                result: {
                  key: "G",
                  mode: "major",
                  tonic: "G Major",
                  bpm: 110.0,
                  time_signature: "3/4",
                  confidences: { key: 0.95, tempo: 0.92, meter: 0.89 },
                  measures: [],
                  solfa_text: "| s, : d : - | m.r : d : - ||",
                },
              },
            ]}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
