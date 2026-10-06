/**
 * Stellar Asset Trustline Checker and ChangeTrust Transaction Builder.
 */

import { env } from "@/config/env";
import { signWithWallet } from "@/stellar/walletKit";
import {
  Account,
  Asset,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

export interface TrustlineCheckResult {
  hasTrustline: boolean;
  balance?: string;
  isNative: boolean;
  needsTrustline: boolean;
}

/**
 * Fetch current sequence number for an account from Horizon.
 */
export async function fetchAccountSequence(address: string): Promise<string> {
  try {
    const res = await fetch(`${env.horizonUrl}/accounts/${address}`);
    if (res.ok) {
      const data = await res.json();
      return data.sequence || "1";
    }
  } catch (err) {
    console.warn("Could not query account sequence from Horizon, using fallback:", err);
  }
  return "1000";
}

/**
 * Check if a Stellar account has established a trustline for a non-native asset (e.g. USDC, USDT).
 */
export async function checkAccountTrustline(
  accountAddress: string,
  assetCode: string,
  assetIssuer?: string
): Promise<TrustlineCheckResult> {
  // Native XLM does not require a trustline
  if (assetCode.toUpperCase() === "XLM" || !assetIssuer) {
    return {
      hasTrustline: true,
      balance: "Available",
      isNative: true,
      needsTrustline: false,
    };
  }

  try {
    const res = await fetch(`${env.horizonUrl}/accounts/${accountAddress}`);
    if (!res.ok) {
      return { hasTrustline: false, isNative: false, needsTrustline: true };
    }
    const data = await res.json();
    const balances = data.balances || [];

    const found = balances.find(
      (b: any) =>
        b.asset_code === assetCode &&
        (!assetIssuer || b.asset_issuer === assetIssuer)
    );

    if (found) {
      return {
        hasTrustline: true,
        balance: found.balance,
        isNative: false,
        needsTrustline: false,
      };
    }

    return {
      hasTrustline: false,
      isNative: false,
      needsTrustline: true,
    };
  } catch (err) {
    console.warn("Error checking trustline on Horizon:", err);
    return {
      hasTrustline: false,
      isNative: false,
      needsTrustline: true,
    };
  }
}

/**
 * Build a transaction envelope requesting the user's wallet to add a trustline.
 */
export async function buildAddTrustlineXdr(
  accountAddress: string,
  assetCode: string,
  assetIssuer: string
): Promise<string> {
  const sequence = await fetchAccountSequence(accountAddress);
  const account = new Account(accountAddress, sequence);
  const asset = new Asset(assetCode, assetIssuer);

  const tx = new TransactionBuilder(account, {
    fee: "100000",
    networkPassphrase: env.networkPassphrase,
  })
    .addOperation(
      Operation.changeTrust({
        asset,
      })
    )
    .setTimeout(30)
    .build();

  return tx.toXDR();
}

/**
 * Execute 1-click Add Trustline workflow signed by connected wallet and submitted to Horizon.
 */
export async function executeAddTrustline(
  accountAddress: string,
  assetCode: string,
  assetIssuer: string,
  walletName: string
): Promise<{ success: boolean; hash?: string; error?: string }> {
  try {
    const txXdr = await buildAddTrustlineXdr(accountAddress, assetCode, assetIssuer);
    const signedXdr = await signWithWallet(txXdr, walletName);

    const formData = new URLSearchParams();
    formData.append("tx", signedXdr);

    const res = await fetch(`${env.horizonUrl}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, hash: data.hash };
    }

    const errData = await res.json().catch(() => ({}));
    return {
      success: false,
      error: errData.title || `Horizon rejected trustline transaction (${res.status})`,
    };
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to add trustline" };
  }
}
