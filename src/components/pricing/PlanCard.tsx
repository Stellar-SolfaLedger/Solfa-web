"use client";

import React from "react";
import { SubscriptionPlanMeta } from "@/config/stellar";
import { formatTokenPrice } from "@/utils/pricing";

interface PlanCardProps {
  plan: SubscriptionPlanMeta;
  selectedToken: string;
  priceStroops: bigint;
  onSubscribe: (planId: number) => void;
  isLoading?: boolean;
}

export function PlanCard({
  plan,
  selectedToken,
  priceStroops,
  onSubscribe,
  isLoading,
}: PlanCardProps) {
  const { tokenText, usdText } = formatTokenPrice(priceStroops, selectedToken);

  return (
    <div
      className={`relative rounded-3xl p-8 transition-all flex flex-col justify-between ${
        plan.popular
          ? "bg-gradient-to-b from-indigo-950/60 to-gray-900 border-2 border-indigo-500/80 shadow-2xl shadow-indigo-900/30 scale-105"
          : "bg-gray-900/60 border border-gray-800 hover:border-gray-700"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-md">
          MOST POPULAR
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
          {plan.unlimited ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-400 border border-violet-500/30">
              Unlimited
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {plan.credits} Credits / mo
            </span>
          )}
        </div>

        <p className="text-xs text-gray-400 mb-6 leading-relaxed">{plan.description}</p>

        {/* Pricing display */}
        <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-gray-800">
          <div className="text-2xl sm:text-3xl font-black text-white">{tokenText}</div>
          <div className="text-xs text-gray-400 mt-1">{usdText} / month</div>
        </div>

        {/* Features checklist */}
        <ul className="space-y-3 mb-8">
          {plan.features.map((feat, idx) => (
            <li key={idx} className="flex items-start text-xs text-gray-300">
              <span className="text-emerald-400 mr-2.5 font-bold">✓</span>
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => onSubscribe(plan.id)}
        disabled={isLoading}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
          plan.popular
            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 active:scale-95"
            : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 active:scale-95"
        }`}
      >
        {isLoading ? "Signing on Soroban..." : `Subscribe with ${selectedToken}`}
      </button>
    </div>
  );
}
