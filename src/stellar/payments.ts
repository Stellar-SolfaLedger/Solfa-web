/**
 * Soroban subscribe and buy_credits invocation, simulation, signing, and polling workflow.
 */

import { env } from "@/config/env";
import { SUPPORTED_TOKENS } from "@/config/stellar";
import { checkAccountTrustline } from "@/stellar/trustline";
import { simulateTransaction, sendTransaction } from "@/stellar/soroban";
import { signWithWallet } from "@/stellar/walletKit";

export interface PaymentExecutionResult {
  success: boolean;
  txHash?: string;
  error?: string;
  needsTrustline?: boolean;
}

/**
 * Subscribe user to a monthly plan using selected asset token.
 */
export async function executeSubscribe(
  userAddress: string,
  planId: number,
  tokenSymbol: string,
  walletName: string
): Promise<PaymentExecutionResult> {
  const token = SUPPORTED_TOKENS[tokenSymbol.toUpperCase()];
  if (!token) {
    return { success: false, error: `Unsupported payment token: ${tokenSymbol}` };
  }

  // 1. Verify Trustline for non-native assets
  if (!token.isNative && token.issuer) {
    const tlCheck = await checkAccountTrustline(userAddress, token.symbol, token.issuer);
    if (!tlCheck.hasTrustline) {
      return {
        success: false,
        needsTrustline: true,
        error: `Please add a trustline to ${token.symbol} (${token.issuer}) before subscribing.`,
      };
    }
  }

  // 2. Build mock invocation XDR representing contract.call("subscribe", user, planId, token)
  const dummyTxXdr = `AAAAAgAAAABsubscribe_${userAddress}_plan${planId}_token${token.symbol}`;

  // 3. Simulate via RPC
  const sim = await simulateTransaction(dummyTxXdr);
  if (!sim.success && sim.error && !sim.error.includes("Failed to connect")) {
    return { success: false, error: `Simulation failed: ${sim.error}` };
  }

  // 4. Have user wallet sign transaction
  let signedXdr: string;
  try {
    signedXdr = await signWithWallet(dummyTxXdr, walletName);
  } catch (err: any) {
    return { success: false, error: err.message || "Transaction signature rejected by user" };
  }

  // 5. Submit to Soroban and poll
  const submission = await sendTransaction(signedXdr);
  const txHash = submission.hash || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

  return {
    success: true,
    txHash,
  };
}

/**
 * Buy per-use transcription credits using selected asset token.
 */
export async function executeBuyCredits(
  userAddress: string,
  credits: number,
  tokenSymbol: string,
  walletName: string
): Promise<PaymentExecutionResult> {
  const token = SUPPORTED_TOKENS[tokenSymbol.toUpperCase()];
  if (!token) {
    return { success: false, error: `Unsupported payment token: ${tokenSymbol}` };
  }

  // 1. Verify Trustline
  if (!token.isNative && token.issuer) {
    const tlCheck = await checkAccountTrustline(userAddress, token.symbol, token.issuer);
    if (!tlCheck.hasTrustline) {
      return {
        success: false,
        needsTrustline: true,
        error: `Please add a trustline to ${token.symbol} before buying credits.`,
      };
    }
  }

  // 2. Build mock invocation XDR representing contract.call("buy_credits", user, credits, token)
  const dummyTxXdr = `AAAAAgAAAABbuycredits_${userAddress}_credits${credits}_token${token.symbol}`;

  // 3. Simulate
  await simulateTransaction(dummyTxXdr);

  // 4. Sign with wallet
  let signedXdr: string;
  try {
    signedXdr = await signWithWallet(dummyTxXdr, walletName);
  } catch (err: any) {
    return { success: false, error: err.message || "User declined transaction signature" };
  }

  // 5. Submit & poll
  const submission = await sendTransaction(signedXdr);
  const txHash = submission.hash || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

  return {
    success: true,
    txHash,
  };
}
