"use client";

import React, { useState } from "react";
import { env } from "@/config/env";

interface FriendbotButtonProps {
  userAddress?: string | null;
  onFunded?: () => void;
}

export function FriendbotButton({ userAddress, onFunded }: FriendbotButtonProps) {
  const [isFunding, setIsFunding] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  if (!env.isTestnet) return null;

  const handleFund = async () => {
    const targetAddress =
      userAddress || "GCATRF5LE7EWYOA55FIDRDB2UR76NYXOQ4CINGCTAD5RSGJODAGPQA7J";

    try {
      setIsFunding(true);
      setStatus("Contacting Friendbot faucet...");

      const res = await fetch(`https://friendbot.stellar.org/?addr=${targetAddress}`);
      if (!res.ok) {
        throw new Error(`Friendbot returned ${res.status}`);
      }

      setStatus("🎉 10,000 Testnet XLM funded to your account!");
      if (onFunded) onFunded();
      setTimeout(() => setStatus(null), 5000);
    } catch (e: any) {
      setStatus(`Faucet failed: ${e.message || "Network error"}`);
    } finally {
      setIsFunding(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-center">
      <button
        onClick={handleFund}
        disabled={isFunding}
        className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold active:scale-95 transition-all shadow-sm"
      >
        <span>🪙</span>
        <span>{isFunding ? "Requesting XLM..." : "Fund 10,000 Testnet XLM (Friendbot)"}</span>
      </button>

      {status && (
        <span className="text-[11px] text-gray-400 mt-1.5 animate-fade-in font-medium">
          {status}
        </span>
      )}
    </div>
  );
}
