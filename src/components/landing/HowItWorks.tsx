import React from "react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Connect Stellar Wallet",
      desc: "Connect Freighter, LOBSTR, Albedo, xBull, or WalletConnect. Authenticate securely via SEP-10 challenge without private key exposure.",
    },
    {
      num: "02",
      title: "Upload or Stream Audio",
      desc: "Drag and drop any MP3, WAV, M4A, OGG, or FLAC audio file (up to 50MB) or provide a direct audio streaming URL.",
    },
    {
      num: "03",
      title: "Soroban Verified Execution",
      desc: "Our Soroban smart contract validates subscription or credit balance before processing notes through our 22.05 kHz signal pipeline.",
    },
    {
      num: "04",
      title: "Inspect, Re-render & Export",
      desc: "View tonic solfa sheet music with interactive playback highlighting, adjust keys at no cost, and download in PDF, MusicXML, or TXT.",
    },
  ];

  return (
    <section className="py-20 border-t border-gray-900 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Simple Workflow</h2>
          <p className="text-3xl font-extrabold text-white tracking-tight">How SolfaLedger Works</p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative p-6 rounded-2xl bg-gray-900/40 border border-gray-800/80 hover:border-gray-700 transition-all"
            >
              <div className="text-3xl font-black text-indigo-500/30 mb-3">{s.num}</div>
              <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
