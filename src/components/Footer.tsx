import React from "react";
import Link from "next/link";
import { env } from "@/config/env";

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-800/80 bg-gray-950 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              ♪
            </span>
            <span className="text-base font-bold text-white tracking-tight">
              Solfa<span className="text-indigo-400">Ledger</span>
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            AI-driven movable-do tonic solfa transcription engine metered on-chain through Stellar
            Soroban smart contracts.
          </p>
          <div className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-800 text-indigo-400 border border-gray-700">
            Contract: {env.paymentsContractId.slice(0, 8)}...{env.paymentsContractId.slice(-6)}
          </div>
        </div>

        {/* Product column */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-200 mb-3">
            Product
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/transcribe" className="hover:text-indigo-400 transition-colors">
                Transcribe Audio
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">
                My Dashboard
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-indigo-400 transition-colors">
                Plans & Credits
              </Link>
            </li>
            <li>
              <Link href="/billing" className="hover:text-indigo-400 transition-colors">
                On-Chain Billing
              </Link>
            </li>
          </ul>
        </div>

        {/* Stellar Web3 column */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-200 mb-3">
            Stellar Ecosystem
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href={`https://stellar.expert/explorer/testnet/contract/${env.paymentsContractId}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-400 transition-colors"
              >
                StellarExpert Explorer ↗
              </a>
            </li>
            <li>
              <a
                href="https://developers.stellar.org/docs/smart-contracts"
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-400 transition-colors"
              >
                Soroban Smart Contracts ↗
              </a>
            </li>
            <li>
              <a
                href="https://laboratory.stellar.org/#account-creator?network=test"
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-400 transition-colors"
              >
                Friendbot Faucet ↗
              </a>
            </li>
          </ul>
        </div>

        {/* Developers column */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-200 mb-3">
            Developers
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a
                href={`${env.apiUrl}/openapi.json`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-400 transition-colors"
              >
                OpenAPI Spec (/openapi.json) ↗
              </a>
            </li>
            <li>
              <a
                href={`${env.apiUrl}/docs`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-400 transition-colors"
              >
                Interactive Swagger Docs ↗
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Stellar-SolfaLedger"
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-400 transition-colors"
              >
                GitHub Polyrepo ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-900 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
        <div>© {new Date().getFullYear()} SolfaLedger. Built exclusively for Stellar.</div>
        <div className="mt-2 sm:mt-0 flex space-x-4">
          <span>Stellar Protocol 22</span>
          <span>•</span>
          <span>Soroban Rust Contracts</span>
        </div>
      </div>
    </footer>
  );
}
