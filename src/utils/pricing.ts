/**
 * Stellar 7-decimal unit (stroop) conversions and USD price estimations.
 */

import { SUPPORTED_TOKENS } from "@/config/stellar";

export const STELLAR_DECIMALS = 7;
export const STROOPS_PER_UNIT = 10_000_000n;

/**
 * Convert human-readable token amount (e.g. "10.5") into 7-decimal stroop BigInt.
 */
export function toStroops(amount: number | string): bigint {
  const str = String(amount).trim();
  if (!str || isNaN(Number(str))) return 0n;

  const [intPart, fracPart = ""] = str.split(".");
  const paddedFrac = (fracPart + "0000000").slice(0, 7);
  return BigInt(intPart || "0") * STROOPS_PER_UNIT + BigInt(paddedFrac);
}

/**
 * Convert 7-decimal stroop integer (BigInt or number) to human-readable string.
 */
export function fromStroops(stroops: bigint | number | string, maxDecimals = 4): string {
  try {
    const big = BigInt(stroops);
    const isNegative = big < 0n;
    const absBig = isNegative ? -big : big;

    const intPart = absBig / STROOPS_PER_UNIT;
    const fracPart = absBig % STROOPS_PER_UNIT;

    let fracStr = fracPart.toString().padStart(7, "0");
    fracStr = fracStr.slice(0, maxDecimals).replace(/0+$/, "");

    const sign = isNegative ? "-" : "";
    return fracStr ? `${sign}${intPart}.${fracStr}` : `${sign}${intPart}`;
  } catch {
    return "0";
  }
}

/**
 * Calculate estimated USD value for an amount of a specific token.
 */
export function calculateUsdEstimate(amountTokens: number, tokenSymbol: string): number {
  const token = SUPPORTED_TOKENS[tokenSymbol.toUpperCase()];
  if (!token) return 0;
  return amountTokens * token.usdPriceEstimate;
}

/**
 * Format a stroop amount into display token string and USD estimate.
 */
export function formatTokenPrice(
  amountStroops: bigint | number | string,
  tokenSymbol: string
): { tokenText: string; usdText: string } {
  const tokenStr = fromStroops(amountStroops, 2);
  const tokenNum = parseFloat(tokenStr) || 0;
  const usdVal = calculateUsdEstimate(tokenNum, tokenSymbol);

  return {
    tokenText: `${tokenStr} ${tokenSymbol}`,
    usdText: `≈ $${usdVal.toFixed(2)} USD`,
  };
}
