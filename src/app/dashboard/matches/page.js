"use client";

import { useState } from "react";
import {
  MessageCircle,
  Calendar,
  MapPin,
  Euro,
  Briefcase,
  ExternalLink,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useMatches } from "@/lib/hooks/useMatches";

export default function MatchesPage() {
  const { matches, stats, loading } = useMatches(); // ✅ Usa hook centralizzato
  const [filter, setFilter] = useState("all");

  // Filtra i match in base al filtro selezionato
  const filteredMatches = matches.filter((match) => {
    if (filter === "all") return true;
    if (filter === "new") return match.hasMatch;
    if (filter === "interested") return !match.hasMatch;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            I Tuoi Matches
          </h1>
          <p className="text-gray-600">
            Candidati che hai swipato e che hanno matchato con i tuoi job
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            label="Totale Swipe"
            value={stats.total}
            icon="👥"
            color="bg-blue-100 text-blue-700"
          />
          <StatCard
            label="Match Reciproci"
            value={stats.matched}
            icon="🎉"
            color="bg-green-100 text-green-700"
          />
          <StatCard
            label="In Attesa"
            value={stats.interested}
            icon="⏳"
            color="bg-orange-100 text-orange-700"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Tutti ({stats.total})
          </button>
          <button
            onClick={() => setFilter("new")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "new"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            🎉 Match ({stats.matched})
          </button>
          <button
            onClick={() => setFilter("interested")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "interested"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            ⏳ In Attesa ({stats.interested})
          </button>
        </div>

        {/* Matches List */}
        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="text-6xl mb-4">
              {filter === "new" ? "🎉" : filter === "interested" ? "⏳" : "👥"}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {filter === "new" && "Nessun match ancora"}
              {filter === "interested" && "Tutti i candidati hanno matchato!"}
              {filter === "all" && "Nessun candidato swipato"}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "Vai nella sezione Candidati e inizia a swipare!"
                : "Continua a swipare per trovare nuovi match!"}
            </p>
            <Link
              href="/dashboard/candidates"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Swipe Candidati
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ========== COMPONENTS ==========

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${color}`}>
          {value}
        </div>
      </div>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  );
}

function MatchCard({ match }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 24) return `${diffHours}h fa`;
    if (diffDays === 1) return "1 giorno fa";
    if (diffDays < 7) return `${diffDays} giorni fa`;
    return date.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-3xl">
            {match.avatar_url || "👤"}
          </div>
          {match.hasMatch && (
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
              ✓
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {match.first_name} {match.last_name}
                </h3>
                {match.hasMatch && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    🎉 MATCH
                  </span>
                )}
              </div>
              <p className="text-gray-600">{match.headline}</p>
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(match.swipedAt)}
            </span>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin size={16} />
              <span>{match.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Briefcase size={16} />
              <span className="capitalize">{match.remote_preference}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Euro size={16} className="text-green-600" />
              <span>
                €{match.salary_min?.toLocaleString()} - €
                {match.salary_max?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {match.skills?.slice(0, 5).map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {match.skills?.length > 5 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                +{match.skills.length - 5}
              </span>
            )}
          </div>

          {/* Matched Job Info */}
          {match.hasMatch && match.matchedJob && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Star size={16} className="text-green-600" />
                <span className="text-green-900 font-medium">
                  Match su: <strong>{match.matchedJob.title}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            {match.hasMatch ? (
              <>
                <Link
                  href={`/dashboard/chat`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <MessageCircle size={18} />
                  <span>Inizia Chat</span>
                </Link>
                <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium">
                  <Calendar size={18} />
                </button>
              </>
            ) : (
              <div className="flex-1 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-center font-medium">
                ⏳ In attesa che il candidato swipe i tuoi job
              </div>
            )}
            <Link
              href={`/dashboard/candidates/${match.id}`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <ExternalLink size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}