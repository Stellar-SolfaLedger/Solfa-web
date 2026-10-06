"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContractBillingEvent } from "@/types";
import { env } from "@/config/env";

export default function BillingPage() {
  const [filterType, setFilterType] = useState<string>("all");

  const mockEvents: ContractBillingEvent[] = [
    {
      id: "evt_1",
      topic: "sub",
      user: "GCATRF5LE7EWYOA55FIDRDB2UR76NYXOQ4CINGCTAD5RSGJODAGPQA7J",
      planId: 1,
      token: "XLM",
      amount: "10.00 XLM",
      timestamp: Date.now() - 3600 * 1000 * 4,
      txHash: "4f7a229cb7a91c0ece59c03cf1539814c3ec4d3457f7a150ba0d154bdc584850",
    },
    {
      id: "evt_2",
      topic: "use",
      user: "GCATRF5LE7EWYOA55FIDRDB2UR76NYXOQ4CINGCTAD5RSGJODAGPQA7J",
      credits: 1,
      timestamp: Date.now() - 3600 * 1000 * 2,
      txHash: "18bccda26651e3670d041c73d80d2f409b28012cbbd7f13e2bc4d4eb2e7108bb",
    },
    {
      id: "evt_3",
      topic: "buy",
      user: "GCATRF5LE7EWYOA55FIDRDB2UR76NYXOQ4CINGCTAD5RSGJODAGPQA7J",
      token: "USDC",
      amount: "5.00 USDC",
      credits: 20,
      timestamp: Date.now() - 3600 * 1000 * 24,
      txHash: "99d0866cb7a91c011055d03cf1531bf572a18bccda26651e3670d041c73d80d2",
    },
    {
      id: "evt_4",
      topic: "sub",
      user: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
      planId: 2,
      token: "USDC",
      amount: "15.00 USDC",
      timestamp: Date.now() - 3600 * 1000 * 48,
      txHash: "a9de5cb22207240ece59c9814c3ec4d3457f7a150ba0d154bdc584850644e17f",
    },
  ];

  const filtered = mockEvents.filter((e) => {
    if (filterType === "all") return true;
    return e.topic === filterType;
  });

  const renderEventBadge = (topic: string) => {
    switch (topic) {
      case "sub":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Subscription
          </span>
        );
      case "buy":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Buy Credits
          </span>
        );
      case "use":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
            Credit Consumed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-800 text-gray-300">
            {topic}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-850">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              On-Chain Billing History
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Live Soroban smart contract events emitted by SolfaPayments contract.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-gray-400 font-semibold mr-1">Filter:</span>
            {["all", "sub", "buy", "use"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3 py-1.5 rounded-lg font-semibold uppercase text-[11px] transition-colors ${
                  filterType === f
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-900 text-gray-400 hover:text-white border border-gray-800"
                }`}
              >
                {f === "all" ? "All Events" : f}
              </button>
            ))}
          </div>
        </div>

        {/* Contract Info Banner */}
        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Contract ID:</span>
            <span className="font-mono text-indigo-400 font-bold">
              {env.paymentsContractId}
            </span>
          </div>
          <a
            href={`https://stellar.expert/explorer/testnet/contract/${env.paymentsContractId}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-indigo-400 hover:underline font-semibold"
          >
            Inspect Contract on StellarExpert ↗
          </a>
        </div>

        {/* Events Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900/40 shadow-xl">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="border-b border-gray-800 bg-gray-950/80 text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Event Topic</th>
                <th className="py-3.5 px-4">Account Address</th>
                <th className="py-3.5 px-4">Details / Amount</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4 text-right">Transaction Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-850">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="py-3.5 px-4">{renderEventBadge(item.topic)}</td>
                  <td className="py-3.5 px-4 font-mono text-gray-300">
                    {item.user.slice(0, 6)}...{item.user.slice(-6)}
                  </td>
                  <td className="py-3.5 px-4">
                    {item.amount && <span className="font-bold text-white mr-2">{item.amount}</span>}
                    {item.planId && (
                      <span className="text-gray-400 text-[11px]">Plan #{item.planId}</span>
                    )}
                    {item.credits && (
                      <span className="text-emerald-400 font-semibold">
                        {item.credits} Credit{item.credits > 1 ? "s" : ""}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-gray-400 font-mono text-[11px]">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${item.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-indigo-400 hover:underline text-[11px]"
                    >
                      {item.txHash.slice(0, 8)}...{item.txHash.slice(-8)} ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
