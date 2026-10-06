# SolfaLedger Web (`solfa-web`)

> **Web3 Audio-to-Tonic-Solfa Transcription Interface on Stellar Soroban**

SolfaLedger Web is a Next.js 14 (App Router, TypeScript, Tailwind CSS) decentralized application designed exclusively for the **Stellar Network**. It enables musicians, choir directors, and students to transcribe song audio into traditional movable-do **tonic solfa notation** (`do re mi fa so la ti do`), view musical key, tempo (BPM), and meter breakdowns, and pay on-chain with Stellar assets (XLM, USDC, USDT) via a Soroban smart contract.

---

## Key Features

- **Multi-Wallet Support**: Powered by `@creit.tech/stellar-wallets-kit` supporting **Freighter, LOBSTR, Albedo, xBull, Rabet, Hana, and WalletConnect** through a unified modal.
- **On-Chain Soroban Payments**: Native interaction with the `SolfaPayments` smart contract for subscription plans (`subscribe`) and per-use credits (`buy_credits`).
- **Interactive Solfa Score Viewer**: Traditional tonic solfa sheet music layout with bar lines (`|`), beat colons (`:`), half-beat dots (`.`), and sustain holds (`-`).
- **Bar-by-Bar Playback Highlighter**: Real-time musical audio synthesizer highlighting active measures sequentially with loop and tempo controls.
- **Free Musical Overrides**: User-directed parameter corrections (key, mode, meter, tempo) re-render the score at zero additional cost.
- **Multi-Format Export**: One-click download in **PDF (ReportLab printable score), MusicXML 3.1 (engraving in MuseScore/Sibelius), Plaintext TXT, and JSON**.
- **Automated Trustline Guard**: Detects missing trustlines for non-native assets (USDC, USDT) and prompts the user to add them before payment.
- **Testnet Friendbot Faucet**: Automated 1-click testnet XLM faucet trigger built right into the interface.

---

## Application Structure & Routes

```
src/
├── app/
│   ├── page.tsx            # Landing page (Hero, Scale Player, Features, Workflow)
│   ├── pricing/page.tsx    # Monthly plans & credit packs with multi-token selector
│   ├── dashboard/page.tsx  # Credits badge, subscription countdown, and history table
│   ├── transcribe/page.tsx # Audio file drag-and-drop & URL ingest with 50MB validator
│   ├── jobs/[id]/page.tsx  # Result viewer (playback highlight, chips, edit mode, export)
│   ├── billing/page.tsx    # On-chain Soroban event ledger inspector
│   ├── globals.css         # Design tokens, glassmorphism, and responsive layout
│   └── layout.tsx          # Root layout and metadata
├── components/
│   ├── Navbar.tsx          # Navigation, wallet connection, network chip, faucet link
│   ├── Footer.tsx          # Ecosystem links, contract IDs, and status badges
│   ├── WalletModal.tsx     # Unified multi-wallet selector modal
│   ├── ThemeToggle.tsx     # Dark/light mode switcher
│   ├── landing/            # Hero, Features, HowItWorks, SolfaScalePlayer
│   ├── pricing/            # PlanCard, CreditPackCard, FriendbotButton
│   ├── transcribe/         # FileUploader (drag & drop, audio preview)
│   ├── dashboard/          # JobHistoryTable (real-time status chips)
│   └── viewer/             # SolfaSheetViewer, PlaybackHighlighter, MusicalChips, OverrideModal, ExportMenu
├── config/
│   ├── env.ts              # Environment variables and network fallbacks
│   └── stellar.ts          # SAC contract IDs, token metadata, and plan configurations
├── stellar/
│   ├── auth.ts             # SEP-10 challenge request and verification
│   ├── walletKit.ts        # StellarWalletsKit adapter
│   ├── soroban.ts          # JSON-RPC simulation and submission
│   ├── payments.ts         # subscribe and buy_credits workflow
│   └── trustline.ts        # Account balance and trustline checker
├── services/
│   └── api.ts              # Engine client for transcription and export downloads
└── utils/
    └── pricing.ts          # 7-decimal stroop math and USD price estimations
```

---

## Payment & On-Chain Settlement Workflow

1. **Token Selection & Stroop Conversion**:
   Prices are displayed in the selected currency (XLM, USDC, USDT) and converted into 7-decimal Stellar integer units (`1 XLM = 10_000_000 stroops`) with real-time USD estimations.
2. **Trustline Verification**:
   Before initiating a payment in USDC or USDT, the application inspects the user's account balances on Horizon. If no trustline is present, the user is prompted to establish one first.
3. **Soroban Simulation**:
   The transaction envelope is simulated against `https://soroban-testnet.stellar.org` via JSON-RPC to verify gas footprint, resource fees, and ledger footprints.
4. **Wallet Signing & Submission**:
   The wallet signs the transaction envelope. The application submits it to Soroban and polls the transaction status until confirmed.
5. **Entitlement Refresh**:
   Upon transaction confirmation, the user's credits and subscription status are refreshed instantly from the smart contract.

---

## Stellar Soroban Contract Addresses

| Property | Value |
| :--- | :--- |
| **SolfaPayments Contract** | `CAAU3BUYOH7464VPCE26ONCSHQRR3O6VLR7SVN5UPDK4ZLMT47EW2Q33` |
| **Native Asset SAC (XLM)** | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |
| **USDC Testnet SAC** | `CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWUIE3USSTHZX5C6WD7` |
| **Network** | Stellar Testnet (`Test SDF Network ; September 2015`) |
| **Soroban RPC URL** | `https://soroban-testnet.stellar.org` |
| **Horizon URL** | `https://horizon-testnet.stellar.org` |

---

## Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Setup & Run
```bash
# 1. Clone repository
git clone https://github.com/Stellar-SolfaLedger/Solfa-web.git
cd Solfa-web

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Copy environment configuration
cp .env.example .env.local

# 4. Start development server
npm run dev

# 5. Open in browser
# http://localhost:3000
```

### Run Tests
```bash
npm test
```

### Production Build & Docker
```bash
# Production bundle build
npm run build
npm start

# Or using Docker
docker build -t solfa-web .
docker run -p 3000:3000 solfa-web
```

---

## Mainnet Transition Notes

To point `solfa-web` to Stellar Public Mainnet:
1. Update `NEXT_PUBLIC_STELLAR_NETWORK="PUBLIC"` in `.env.local`.
2. Update `NEXT_PUBLIC_RPC_URL="https://mainnet.sorobanrpc.com"` (or an RPC provider like QuickNode / Blockdaemon).
3. Set `NEXT_PUBLIC_CONTRACT_ID` to your Mainnet Soroban deployment.
4. Set Circle USDC Mainnet SAC (`CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75`).

---

## Web3 & Soroban Integration Features

- **Genuine Soroban Transaction Envelopes**: `buildSubscribeTransaction` and `buildBuyCreditsTransaction` use `@stellar/stellar-sdk`'s `Contract.call` to assemble standard transaction envelopes for `subscribe` and `buy_credits`.
- **1-Click Trustline Flow**: When paying with non-native assets (Circle USDC or USDT), missing trustlines trigger a 1-click action prompt that builds, signs, and broadcasts a Stellar `ChangeTrust` operation.
- **Universal Multi-Wallet Routing**: Seamlessly interfaces with Freighter, Albedo Web Auth, xBull SDK, and Rabet with automated provider detection and transaction signature routing.
