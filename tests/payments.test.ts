import {
  buildSubscribeTransaction,
  buildBuyCreditsTransaction,
} from "../src/stellar/payments";
import {
  buildAddTrustlineXdr,
  checkAccountTrustline,
} from "../src/stellar/trustline";

describe("Stellar Payments & Trustlines Builder", () => {
  const testAddress = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
  const xlmContract = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

  test("buildSubscribeTransaction returns valid base64 XDR string", async () => {
    const xdr = await buildSubscribeTransaction(testAddress, 1, xlmContract);
    expect(typeof xdr).toBe("string");
    expect(xdr.length).toBeGreaterThan(10);
    // Standard Stellar TransactionEnvelope XDR starts with AAAA
    expect(xdr.startsWith("AAAA")).toBe(true);
  });

  test("buildBuyCreditsTransaction returns valid base64 XDR string", async () => {
    const xdr = await buildBuyCreditsTransaction(testAddress, 20, xlmContract);
    expect(typeof xdr).toBe("string");
    expect(xdr.length).toBeGreaterThan(10);
    expect(xdr.startsWith("AAAA")).toBe(true);
  });

  test("buildAddTrustlineXdr returns valid base64 XDR string for ChangeTrust", async () => {
    const issuer = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";
    const xdr = await buildAddTrustlineXdr(testAddress, "USDC", issuer);
    expect(typeof xdr).toBe("string");
    expect(xdr.length).toBeGreaterThan(10);
    expect(xdr.startsWith("AAAA")).toBe(true);
  });

  test("checkAccountTrustline reports XLM as native without needing trustline", async () => {
    const res = await checkAccountTrustline(testAddress, "XLM");
    expect(res.hasTrustline).toBe(true);
    expect(res.isNative).toBe(true);
    expect(res.needsTrustline).toBe(false);
  });
});
