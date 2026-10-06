/**
 * Application environment configuration and fallback defaults.
 */

export interface AppConfig {
  stellarNetwork: "TESTNET" | "PUBLIC";
  networkPassphrase: string;
  rpcUrl: string;
  horizonUrl: string;
  paymentsContractId: string;
  apiUrl: string;
  isTestnet: boolean;
}

export const env: AppConfig = {
  stellarNetwork: (process.env.NEXT_PUBLIC_STELLAR_NETWORK as "TESTNET" | "PUBLIC") || "TESTNET",
  networkPassphrase:
    process.env.NEXT_PUBLIC_STELLAR_NETWORK === "PUBLIC"
      ? "Public Global Stellar Network ; September 2015"
      : "Test SDF Network ; September 2015",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://soroban-testnet.stellar.org",
  horizonUrl: process.env.NEXT_PUBLIC_HORIZON_URL || "https://horizon-testnet.stellar.org",
  paymentsContractId:
    process.env.NEXT_PUBLIC_CONTRACT_ID ||
    "CAWY3OQG5R6W5H32YUS2W3J2A3NZZUUS3G6C5Y667L7BWWK3W76KOG6V",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  isTestnet: (process.env.NEXT_PUBLIC_STELLAR_NETWORK || "TESTNET") !== "PUBLIC",
};
