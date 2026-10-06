/**
 * Stellar Network Assets, Contract Addresses, and Supported Payment Tokens.
 */

export interface TokenConfig {
  symbol: string;
  name: string;
  decimals: number;
  contractId: string;
  issuer?: string;
  isNative: boolean;
  usdPriceEstimate: number;
  icon: string;
}

export interface SubscriptionPlanMeta {
  id: number;
  name: string;
  description: string;
  durationSecs: number;
  credits: number;
  unlimited: boolean;
  features: string[];
  popular?: boolean;
}

export const SUPPORTED_TOKENS: Record<string, TokenConfig> = {
  XLM: {
    symbol: "XLM",
    name: "Stellar Lumens",
    decimals: 7,
    contractId: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    isNative: true,
    usdPriceEstimate: 0.12,
    icon: "lumens",
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 7,
    contractId: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWUIE3USSTHZX5C6WD7",
    issuer: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
    isNative: false,
    usdPriceEstimate: 1.0,
    icon: "usdc",
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD (Test Asset)",
    decimals: 7,
    contractId: "CB64D3WD2CHELGQCUDJ2V637P76M6YUXO6ZGYTGLZ22Z223456789012",
    isNative: false,
    usdPriceEstimate: 1.0,
    icon: "usdt",
  },
};

export const SUBSCRIPTION_PLANS: SubscriptionPlanMeta[] = [
  {
    id: 1,
    name: "Monthly Basic",
    description: "Ideal for choir directors, music students, and hobbyists.",
    durationSecs: 30 * 86400, // 30 days
    credits: 20,
    unlimited: false,
    popular: true,
    features: [
      "20 Full Song Transcriptions",
      "Movable-Do Tonic Solfa Score",
      "Key & Tempo (BPM) Detection",
      "Time Signature & Beat Breakdown",
      "PDF, MusicXML, TXT & JSON Export",
      "Zero-Charge Musical Overrides",
    ],
  },
  {
    id: 2,
    name: "Pro Unlimited",
    description: "Unlimited high-frequency access for recording studios & churches.",
    durationSecs: 30 * 86400, // 30 days
    credits: 0,
    unlimited: true,
    popular: false,
    features: [
      "Unlimited Audio Transcriptions",
      "Priority Worker Queue",
      "All Export Formats (PDF, MusicXML)",
      "Interactive Bar-by-Bar Playback",
      "Unlimited Free Re-renders & Overrides",
      "Commercial Music Rights",
    ],
  },
];
