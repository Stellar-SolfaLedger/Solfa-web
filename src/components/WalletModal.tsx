"use client";

import React, { useState } from "react";
import { SUPPORTED_WALLETS, connectWalletProvider } from "@/stellar/walletKit";
import { ConnectedWallet, WalletType } from "@/types";
import { env } from "@/config/env";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnected: (wallet: ConnectedWallet) => void;
}

export function WalletModal({ isOpen, onClose, onWalletConnected }: WalletModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = async (walletId: WalletType) => {
    try {
      setIsConnecting(true);
      setSelectedWallet(walletId);
      const connected = await connectWalletProvider(walletId);
      onWalletConnected(connected);
      onClose();
    } catch (err: any) {
      alert(`Wallet connection failed: ${err.message || err}`);
    } finally {
      setIsConnecting(false);
      setSelectedWallet(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Connect Stellar Wallet</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Network: <span className="text-indigo-400 font-semibold">{env.stellarNetwork}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 rounded-lg hover:text-white hover:bg-gray-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Wallet Options List */}
        <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {SUPPORTED_WALLETS.map((w) => (
            <button
              key={w.id}
              onClick={() => handleSelect(w.id)}
              disabled={isConnecting}
              className="flex items-center w-full p-3.5 rounded-xl border border-gray-800 hover:border-indigo-500/50 bg-gray-950/60 hover:bg-gray-800/60 transition-all text-left group"
            >
              <div className="flex items-center justify-center w-10 h-10 mr-3 text-xl rounded-lg bg-gray-800/80 group-hover:scale-110 transition-transform">
                {w.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm group-hover:text-indigo-400 transition-colors">
                  {w.name}
                </div>
                <div className="text-xs text-gray-400">{w.description}</div>
              </div>
              {selectedWallet === w.id && isConnecting && (
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mr-2" />
              )}
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-gray-800/80 text-center">
          <p className="text-xs text-gray-400">
            Need testnet XLM? Use the{" "}
            <a
              href="https://laboratory.stellar.org/#account-creator?network=test"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:underline font-medium"
            >
              Stellar Friendbot faucet
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
