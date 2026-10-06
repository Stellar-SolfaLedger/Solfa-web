import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SolfaLedger | On-Chain Audio to Tonic Solfa Notation on Stellar",
  description:
    "Transcribe songs of any genre into movable-do tonic solfa notation (do re mi fa so la ti do) with key, tempo, meter, and timing details, paid on-chain via Stellar Soroban smart contracts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
