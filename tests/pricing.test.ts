import {
  toStroops,
  fromStroops,
  calculateUsdEstimate,
  formatTokenPrice,
  STROOPS_PER_UNIT,
} from "../src/utils/pricing";

describe("Stellar Pricing Utilities", () => {
  test("toStroops correctly converts whole token amounts to 7-decimal BigInt", () => {
    expect(toStroops(1)).toBe(10_000_000n);
    expect(toStroops(10)).toBe(100_000_000n);
    expect(toStroops("5")).toBe(50_000_000n);
    expect(toStroops(0)).toBe(0n);
  });

  test("toStroops handles fractional amounts with up to 7 decimals", () => {
    expect(toStroops("0.5")).toBe(5_000_000n);
    expect(toStroops("0.0000001")).toBe(1n);
    expect(toStroops("1.25")).toBe(12_500_000n);
  });

  test("fromStroops converts 7-decimal BigInt back to human-readable string", () => {
    expect(fromStroops(10_000_000n)).toBe("1");
    expect(fromStroops(50_000_000n)).toBe("5");
    expect(fromStroops(12_500_000n)).toBe("1.25");
    expect(fromStroops(0n)).toBe("0");
  });

  test("calculateUsdEstimate multiplies token quantity by configured price", () => {
    // XLM configured at 0.12 USD
    expect(calculateUsdEstimate(100, "XLM")).toBeCloseTo(12.0);
    // USDC configured at 1.00 USD
    expect(calculateUsdEstimate(50, "USDC")).toBeCloseTo(50.0);
  });

  test("formatTokenPrice produces clean token and estimated USD strings", () => {
    const formatted = formatTokenPrice(100_000_000n, "XLM");
    expect(formatted.tokenText).toBe("10 XLM");
    expect(formatted.usdText).toBe("≈ $1.20 USD");
  });
});
