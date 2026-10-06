"use client";

import React from "react";
import { formatTokenPrice } from "@/utils/pricing";

interface CreditPackCardProps {
  credits: number;
  selectedToken: string;
  priceStroops: bigint;
  onBuy: (credits: number) => void;
  isLoading?: boolean;
}

export function CreditPackCard({
  credits,
  selectedToken,
  priceStroops,
  onBuy,
  isLoading,
}: CreditPackCardProps) {
  const { tokenText, usdText } = formatTokenPrice(priceStroops, selectedToken);

  return (
    <div className="rounded-2xl p-6 bg-gray-900/60 border border-gray-800 hover:border-gray-700 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-bold text-white">{credits} Credits</h4>
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
            Pay-As-You-Go
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Never expire. Transcribe {credits} full song melodies.
        </p>

        <div className="p-3 rounded-xl bg-black/40 border border-gray-800/80 mb-4">
          <div className="text-xl font-bold text-white">{tokenText}</div>
          <div className="text-[11px] text-gray-400 mt-0.5">{usdText}</div>
        </div>
      </div>

      <button
        onClick={() => onBuy(credits)}
        disabled={isLoading}
        className="w-full py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold border border-gray-700 active:scale-95 transition-all"
      >
        {isLoading ? "Processing..." : `Buy ${credits} Credits`}
      </button>
    </div>
  );
}
