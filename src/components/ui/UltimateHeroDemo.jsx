"use client";

import { useState, useEffect } from "react";
import { X, Heart, Star, TrendingUp, Users, Zap } from "lucide-react";

const DEMO_CANDIDATES = [
  {
    name: "Marco Rossi",
    role: "Senior React Developer",
    location: "Milano",
    skills: ["React", "Node.js", "TypeScript"],
    avatar: "🧑‍💻",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    name: "Sara Bianchi",
    role: "UX/UI Designer",
    location: "Roma",
    skills: ["Figma", "Adobe XD", "User Research"],
    avatar: "👩‍🎨",
    gradient: "from-pink-400 to-purple-600",
  },
  {
    name: "Luigi Verdi",
    role: "DevOps Engineer",
    location: "Torino",
    skills: ["AWS", "Docker", "Kubernetes"],
    avatar: "👨‍💼",
    gradient: "from-green-400 to-teal-600",
  },
];

const TYPING_MESSAGES = [
  "Swipe. Match. Hire. 🚀",
  "72 ore dal match all'assunzione ⚡",
  "Zero perdite di tempo 🎯",
];

// ─── Animated Stat Component ───────────────────────────────────────
function AnimatedStat({ icon: Icon, value, label, delay = 0 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, delay);
  }, [value, delay]);

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-lg hover:shadow-xl transition-shadow">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="text-blue-600" size={20} />
      </div>
      <div>
        <p className="text-2xl font-black text-gray-900">
          {count.toLocaleString()}+
        </p>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────
export default function UltimateHeroDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState(0);
  const [animate, setAnimate] = useState("");
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [typingIndex, setTypingIndex] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const candidate = DEMO_CANDIDATES[currentIndex];

  // ─── Typing Effect ─────────────────────────────────────────────────
  useEffect(() => {
    const currentMessage = TYPING_MESSAGES[typingIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (typingText.length < currentMessage.length) {
            setTypingText(currentMessage.slice(0, typingText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (typingText.length > 0) {
            setTypingText(typingText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setTypingIndex((prev) => (prev + 1) % TYPING_MESSAGES.length);
          }
        }
      },
      isDeleting ? 50 : 100,
    );

    return () => clearTimeout(timeout);
  }, [typingText, isDeleting, typingIndex]);

  // ─── 3D Rotation Effect ────────────────────────────────────────────
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setRotation({
      x: y * 15,
      y: x * 15,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  // ─── Swipe Handler ─────────────────────────────────────────────────
  const handleSwipe = (direction) => {
    setAnimate(direction);

    if (direction === "right") {
      setMatches((prev) => prev + 1);
    }

    setTimeout(() => {
      setAnimate("");
      if (currentIndex < DEMO_CANDIDATES.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex(0);
      }
    }, 500);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Animated Stats Row */}

      {/* 3D Card Container */}
      <div
        className="perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`relative transition-all duration-500 ${
            animate === "left"
              ? "-translate-x-[200%] rotate-[-30deg] opacity-0"
              : animate === "right"
                ? "translate-x-[200%] rotate-[30deg] opacity-0"
                : "translate-x-0 rotate-0 opacity-100"
          }`}
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: "preserve-3d",
            transition: animate ? "all 0.5s" : "transform 0.2s",
          }}
        >
          {/* Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-8">
            {/* Avatar */}
            <div className="text-center mb-6">
              <div
                className={`w-32 h-32 mx-auto bg-gradient-to-br ${candidate.gradient} rounded-full flex items-center justify-center text-6xl shadow-xl`}
              >
                {candidate.avatar}
              </div>
            </div>

            {/* Info */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {candidate.name}
              </h3>
              <p className="text-lg text-gray-600 mb-2">{candidate.role}</p>
              <p className="text-sm text-gray-500">📍 {candidate.location}</p>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {candidate.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold hover:bg-blue-100 transition"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/*  */}
            {matches > 0 && (
              <div className="text-center mb-4">
                <div className="inline-block bg-green-100 text-green-700 px-6 py-2 rounded-full font-bold animate-bounce">
                  🎉 {matches} Match{matches > 1 ? "es" : ""}!
                </div>
              </div>
            )}

            {/* Provami - Badge */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-bounce">
              👆 Provami!
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Buttons */}
      <div className="flex justify-center gap-8 mt-8">
        <button
          onClick={() => handleSwipe("left")}
          className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition shadow-xl hover:scale-110 active:scale-95"
        >
          <X size={32} strokeWidth={3} />
        </button>

        <button
          onClick={() => handleSwipe("right")}
          className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition shadow-xl hover:scale-110 active:scale-95"
        >
          <Heart size={36} strokeWidth={3} fill="currentColor" />
        </button>

        <button
          onClick={() => handleSwipe("super")}
          className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition shadow-xl hover:scale-110 active:scale-95"
        >
          <Star size={32} strokeWidth={3} fill="currentColor" />
        </button>
      </div>

      {/* Istruzioni */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 font-medium">
          ❌ Scarta • ❤️ Match • ⭐ Super Like
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Muovi il mouse sulla card per l'effetto 3D!
        </p>
      </div>
    </div>
  );
}
