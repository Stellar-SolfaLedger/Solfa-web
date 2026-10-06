import { checkAccountTrustline } from "../src/stellar/trustline";
import { SUPPORTED_TOKENS, SUBSCRIPTION_PLANS } from "../src/config/stellar";

describe("SolfaLedger Web Configuration and Trustlines", () => {
  beforeAll(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ balances: [] }),
      })
    ) as any;
  });

  test("Native XLM asset does not require a trustline", async () => {
    const res = await checkAccountTrustline(
      "GCATRF5LE7EWYOA55FIDRDB2UR76NYXOQ4CINGCTAD5RSGJODAGPQA7J",
      "XLM"
    );
    expect(res.hasTrustline).toBe(true);
    expect(res.isNative).toBe(true);
    expect(res.needsTrustline).toBe(false);
  });

  test("Supported tokens list includes XLM and Circle USDC Testnet", () => {
    expect(SUPPORTED_TOKENS.XLM).toBeDefined();
    expect(SUPPORTED_TOKENS.XLM.isNative).toBe(true);
    expect(SUPPORTED_TOKENS.USDC).toBeDefined();
    expect(SUPPORTED_TOKENS.USDC.decimals).toBe(7);
    expect(SUPPORTED_TOKENS.USDC.issuer).toBe(
      "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
    );
  });

  test("Subscription plans configuration has Plan 1 (Monthly Basic) and Plan 2 (Pro Unlimited)", () => {
    const plan1 = SUBSCRIPTION_PLANS.find((p) => p.id === 1);
    const plan2 = SUBSCRIPTION_PLANS.find((p) => p.id === 2);

    expect(plan1).toBeDefined();
    expect(plan1?.unlimited).toBe(false);
    expect(plan1?.credits).toBe(20);

    expect(plan2).toBeDefined();
    expect(plan2?.unlimited).toBe(true);
  });
});
