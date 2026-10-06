"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PlanCard } from "@/components/pricing/PlanCard";
import { CreditPackCard } from "@/components/pricing/CreditPackCard";
import { SUBSCRIPTION_PLANS, SUPPORTED_TOKENS } from "@/config/stellar";
import { toStroops } from "@/utils/pricing";
import { executeSubscribe, executeBuyCredits } from "@/stellar/payments";

export default function PricingPage() {
  const [selectedToken, setSelectedToken] = useState<string>("XLM");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Pricing constants in base token units
  // Plan 1 (Monthly Basic): 10 XLM = 100_000_000 stroops, or 5 USDC = 50_000_000 stroops
  // Plan 2 (Pro Unlimited): 30 XLM = 300_000_000 stroops, or 15 USDC = 150_000_000 stroops
  // Credit unit: 1 XLM per credit, or 0.5 USDC
  const planPrices: Record<number, Record<string, bigint>> = {
    1: {
      XLM: toStroops(10),
      USDC: toStroops(5),
      USDT: toStroops(5),
    },
    2: {
      XLM: toStroops(30),
      USDC: toStroops(15),
      USDT: toStroops(15),
    },
  };

  const creditPacks = [
    { credits: 5, multiplier: 5 },
    { credits: 20, multiplier: 18 }, // slight volume discount
    { credits: 50, multiplier: 40 }, // bigger volume discount
  ];

  const handleSubscribe = async (planId: number) => {
    try {
      setLoadingAction(`sub_${planId}`);
      setStatusMessage(null);
      const res = await executeSubscribe(
        "GCATRF5LE7EWYOA55FIDRDB2UR76NYXOQ4CINGCTAD5RSGJODAGPQA7J",
        planId,
        selectedToken,
        "Freighter"
      );

      if (res.success) {
        setStatusMessage(`🎉 Subscription confirmed on Soroban! Tx: ${res.txHash?.slice(0, 16)}...`);
      } else {
        alert(res.error || "Subscription failed");
      }
    } finally {
      setLoadingAction(null);
    }
  };

  const handleBuyCredits = async (creditsCount: number) => {
    try {
      setLoadingAction(`credit_${creditsCount}`);
      setStatusMessage(null);
      const res = await executeBuyCredits(
        "GCATRF5LE7EWYOA55FIDRDB2UR76NYXOQ4CINGCTAD5RSGJODAGPQA7J",
        creditsCount,
        selectedToken,
        "Freighter"
      );

      if (res.success) {
        setStatusMessage(`🎉 Credits added to your Soroban account! Tx: ${res.txHash?.slice(0, 16)}...`);
      } else {
        alert(res.error || "Failed to buy credits");
      }
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Transparent On-Chain Pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Simple Plans & Flexible Credits
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Choose a monthly subscription or buy pay-as-you-go credits. Paid directly to the Soroban
            treasury via Stellar Asset Contracts.
          </p>

          {/* Token Selector Switcher */}
          <div className="pt-4 flex items-center justify-center space-x-2">
            <span className="text-xs font-semibold text-gray-400 mr-2">Pay With:</span>
            {Object.keys(SUPPORTED_TOKENS).map((sym) => (
              <button
                key={sym}
                onClick={() => setSelectedToken(sym)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedToken === sym
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "bg-gray-900 text-gray-400 hover:text-white border border-gray-800"
                }`}
              >
                {sym}
              </button>
            ))}
          </div>

          {statusMessage && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium animate-fade-in">
              {statusMessage}
            </div>
          )}
        </div>

        {/* Subscription Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20 items-stretch">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const price = planPrices[plan.id]?.[selectedToken] || toStroops(10);
            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                selectedToken={selectedToken}
                priceStroops={price}
                onSubscribe={handleSubscribe}
                isLoading={loadingAction === `sub_${plan.id}`}
              />
            );
          })}
        </div>

        {/* Per-Use Credit Packs Section */}
        <div className="border-t border-gray-900 pt-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Per-Use Transcription Credits</h2>
            <p className="text-xs text-gray-400">
              Only need a few songs transcribed? Buy credits that never expire.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {creditPacks.map((pack) => {
              const basePrice = selectedToken === "XLM" ? 1 : 0.5;
              const packStroops = toStroops(pack.multiplier * basePrice);
              return (
                <CreditPackCard
                  key={pack.credits}
                  credits={pack.credits}
                  selectedToken={selectedToken}
                  priceStroops={packStroops}
                  onBuy={handleBuyCredits}
                  isLoading={loadingAction === `credit_${pack.credits}`}
                />
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
