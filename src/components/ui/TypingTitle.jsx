'use client';

import { useEffect, useState } from 'react';

const TITLES = [
  "Trova il lavoro perfetto con un semplice swipe 🚀",
  "Match immediato con le migliori aziende ⚡",
  "72 ore dal match all'assunzione 🎯"
];

export default function TypingTitle() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTitle = TITLES[titleIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (text.length < currentTitle.length) {
          setText(currentTitle.slice(0, text.length + 1));
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 3000);
        }
      } else {
        // Deleting
        if (text.length > 0) {
          setText(text.slice(0, -1));
        } else {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % TITLES.length);
        }
      }
    }, isDeleting ? 30 : 80);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, titleIndex]);

  return (
    <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
      {text}
      <span className="text-blue-600 animate-pulse">|</span>
    </h1>
  );
}