"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WalletModal } from "@/components/WalletModal";
import { ConnectedWallet } from "@/types";
import { env } from "@/config/env";

export function Navbar() {
  const pathname = usePathname();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Transcribe", href: "/transcribe" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Pricing", href: "/pricing" },
    { label: "Billing", href: "/billing" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black text-white">♪</span>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                Solfa<span className="text-indigo-400">Ledger</span>
              </span>
              <span className="block text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                Stellar Soroban
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Network Indicator Chip */}
            <div className="flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
              {env.stellarNetwork}
            </div>

            {/* Friendbot Faucet Link on Testnet */}
            {env.isTestnet && (
              <a
                href="https://laboratory.stellar.org/#account-creator?network=test"
                target="_blank"
                rel="noreferrer"
                title="Get free Testnet Lumens via Friendbot"
                className="hidden lg:flex items-center px-2.5 py-1 rounded-lg text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-colors"
              >
                Faucet
              </a>
            )}

            <ThemeToggle />

            {/* Wallet Connect Button */}
            {wallet ? (
              <button
                onClick={() => setWallet(null)}
                title="Click to disconnect"
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gray-800/90 hover:bg-gray-700/90 border border-gray-700 text-sm font-semibold text-white transition-all shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>
                  {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
                </span>
                <span className="text-xs text-indigo-400 font-mono">
                  ({wallet.balanceXlm || "0"} XLM)
                </span>
              </button>
            ) : (
              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-600/30"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden px-4 pt-2 pb-4 space-y-2 border-t border-gray-800 bg-gray-950">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              {wallet ? (
                <button
                  onClick={() => setWallet(null)}
                  className="w-full text-center px-4 py-2 rounded-xl bg-gray-800 text-white text-sm font-semibold"
                >
                  Disconnect ({wallet.address.slice(0, 4)}...{wallet.address.slice(-4)})
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsWalletModalOpen(true);
                  }}
                  className="w-full text-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Wallet Selection Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onWalletConnected={(w) => setWallet(w)}
      />
    </>
  );
}
