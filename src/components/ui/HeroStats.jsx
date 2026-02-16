'use client';

import { useEffect, useState } from 'react';

const STATS = [
  { value: 5000, suffix: "+", label: "Candidati", emoji: "👥" },
  { value: 500, suffix: "+", label: "Aziende", emoji: "🏢" },
  { value: 1200, suffix: "+", label: "Match/giorno", emoji: "❤️" },
  { value: 72, suffix: "h", label: "Tempo medio", emoji: "⚡" }
];

function MiniStat({ value, suffix, label, emoji, delay = 0 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const duration = 1500;
      const increment = value / (duration / 16);

      const counter = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(counter);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 hover:scale-105 transition-transform">
      <span className="text-xl">{emoji}</span>
      <div>
        <p className="text-lg font-black text-gray-900">
          {count.toLocaleString()}{suffix}
        </p>
        <p className="text-xs text-gray-600 font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function HeroStats() {
  return (
    <div className="flex flex-wrap gap-3">
      {STATS.map((stat, i) => (
        <MiniStat key={i} {...stat} delay={i * 100} />
      ))}
    </div>
  );
}