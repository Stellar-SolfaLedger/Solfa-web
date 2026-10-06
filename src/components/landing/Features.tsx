import React from "react";

export function Features() {
  const features = [
    {
      title: "Movable-Do Solfa Engine",
      desc: "Instant mapping to traditional solfa syllables (d r m f s l t d) with full chromatic sharps (di, ri, fi, si, li) and flats (ra, me, se, le, te).",
      icon: "🎼",
    },
    {
      title: "Krumhansl-Schmuckler Key AI",
      desc: "Robust 12-tone chroma profile correlation accurately identifying tonality across all 24 major and minor keys with algorithmic confidence scores.",
      icon: "🎯",
    },
    {
      title: "Tempo & Meter Detection",
      desc: "Inter-Onset Interval tracking calculating precise BPM and classifying time signatures into 4/4, 3/4, 2/4, and 6/8 compound meters.",
      icon: "⏱",
    },
    {
      title: "Stellar Soroban Settlement",
      desc: "Pay on-chain in sub-seconds with native XLM or stablecoins (USDC, USDT). Zero centralized payment processors or custody.",
      icon: "🛡",
    },
    {
      title: "4 Pro Export Formats",
      desc: "Export as high-resolution printable PDF sheet music (ReportLab), MusicXML 3.1 score for MuseScore/Sibelius, Plaintext TXT, or JSON.",
      icon: "📄",
    },
    {
      title: "Zero-Charge Parameter Overrides",
      desc: "Want to change the detected key from C to G or adjust the tempo? Re-render your tonic solfa score instantly without being billed again.",
      icon: "🔄",
    },
  ];

  return (
    <section className="py-20 border-t border-gray-900 bg-gray-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
            Built for Musicians & Choirs
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Precision Musical Notation
          </p>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            From African choral anthems and classical hymns to contemporary gospel and pop melodies,
            SolfaLedger converts audio waveforms into accurate tonic solfa notation.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-indigo-500/40 hover:bg-gray-800/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
