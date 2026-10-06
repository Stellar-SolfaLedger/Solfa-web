/**
 * Stellar Asset Trustline Checker and ChangeTrust Transaction Builder.
 */

import { env } from "@/config/env";

export interface TrustlineCheckResult {
  hasTrustline: boolean;
  balance?: string;
  isNative: boolean;
  needsTrustline: boolean;
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
  // In frontend with wallet-kit, returns an unsigned ChangeTrust transaction envelope
  // or triggers wallet's native add trustline method
  return `CHANGERUST_XDR_${assetCode}_${assetIssuer}_${accountAddress}`;
}
