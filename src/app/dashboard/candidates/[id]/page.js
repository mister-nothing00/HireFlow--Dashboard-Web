"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Euro,
  Briefcase,
  MessageCircle,
  Heart,
  X,
  Star,
  Mail,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";

export default function CandidateProfilePage() {
  const params = useParams();
  const router = useRouter();
  const candidateId = params.id;
  const { company } = useStore();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [swipeStatus, setSwipeStatus] = useState(null); // 'right', 'left', null
  const [swiping, setSwiping] = useState(false);

  useEffect(() => {
    if (candidateId) {
      fetchCandidate();
      checkSwipeStatus();
    }
  }, [candidateId]);

  // Fetch dati del candidato
  const fetchCandidate = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", candidateId)
        .single();

      if (error) throw error;

      console.log("✅ Candidate loaded:", data);
      setCandidate(data);
    } catch (error) {
      console.error("❌ Error fetching candidate:", error);
      router.push("/dashboard/candidates");
    } finally {
      setLoading(false);
    }
  };

  // Controlla se abbiamo già swipato questo candidato
  const checkSwipeStatus = async () => {
    try {
      const { data } = await supabase
        .from("company_swipes")
        .select("direction")
        .eq("candidate_id", candidateId)
        .single();

      if (data) {
        setSwipeStatus(data.direction);
        console.log("📌 Swipe status:", data.direction);
      }
    } catch (error) {
      // Nessun swipe ancora, è normale
      console.log("ℹ️ No swipe yet for this candidate");
    }
  };

  // Esegui swipe dal profilo
  const handleSwipe = async (direction) => {
    if (swiping || !company?.id) return;
    setSwiping(true);

    try {
      const { error } = await supabase.from("company_swipes").insert([
        {
          candidate_id: candidateId,
          direction: direction,
          job_id: null,
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          console.warn("⚠️ Swipe duplicato");
        } else {
          throw error;
        }
      }

      setSwipeStatus(direction);
      console.log(`✅ Swipe ${direction} saved`);

      // Se swipe right, controlla match
      if (direction === "right") {
        await checkForMatch();
      }
    } catch (error) {
      console.error("❌ Error swiping:", error);
    } finally {
      setSwiping(false);
    }
  };

  // Controlla se è un match
  const checkForMatch = async () => {
    try {
      const { data: ourJobs } = await supabase
        .from("jobs")
        .select("id")
        .eq("company_id", company.id);

      const ourJobIds = ourJobs?.map((j) => j.id) || [];
      if (ourJobIds.length === 0) return;

      const { data: theirSwipes } = await supabase
        .from("swipes")
        .select("job_id")
        .eq("candidate_id", candidateId)
        .eq("direction", "right")
        .in("job_id", ourJobIds);

      if (theirSwipes && theirSwipes.length > 0) {
        console.log("🎉 MATCH!");
        alert("🎉 È un MATCH! Il candidato ha swipato right su un tuo job!");
      }
    } catch (error) {
      console.error("Error checking match:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento profilo...</p>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Candidato non trovato
          </h2>
          <Link
            href="/dashboard/candidates"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Torna ai Candidati
          </Link>
        </div>
      </div>
    );
  }

  const getRemoteIcon = (pref) => {
    if (pref === "remote") return "🏠";
    if (pref === "hybrid") return "🔀";
    return "🏢";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Gradient */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-8 pt-8 pb-12">
          {/* Back Button */}
          <Link
            href="/dashboard/matches"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition"
          >
            <ArrowLeft size={20} />
            <span>Torna ai Matches</span>
          </Link>

          {/* Profile Header */}
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center text-5xl flex-shrink-0 border-4 border-white/30">
              👤
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">
                {candidate.first_name} {candidate.last_name}
              </h1>
              <p className="text-blue-200 text-lg mb-4">
                {candidate.headline}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  <MapPin size={14} />
                  <span>{candidate.location}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  <Euro size={14} />
                  <span>
                    €{candidate.salary_min?.toLocaleString()} -
                    €{candidate.salary_max?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  <Briefcase size={14} />
                  <span>{getRemoteIcon(candidate.remote_preference)} {candidate.remote_preference}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 -mt-6">
        {/* Swipe Action Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              {swipeStatus === "right" && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <p className="font-semibold text-green-700">
                    Hai già espresso interesse per questo candidato
                  </p>
                </div>
              )}
              {swipeStatus === "left" && (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">❌</span>
                  <p className="font-semibold text-red-700">
                    Hai già rifiutato questo candidato
                  </p>
                </div>
              )}
              {!swipeStatus && (
                <p className="font-semibold text-gray-700">
                  Cosa pensi di questo candidato?
                </p>
              )}
            </div>

            {/* Swipe Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSwipe("left")}
                disabled={swiping || swipeStatus === "left"}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow transition-all hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                  swipeStatus === "left"
                    ? "bg-red-200"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                <X size={24} color="white" strokeWidth={3} />
              </button>

              <button
                onClick={() => handleSwipe("right")}
                disabled={swiping || swipeStatus === "right"}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                  swipeStatus === "right"
                    ? "bg-green-200"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                <Heart size={28} color="white" strokeWidth={3} />
              </button>

              <button
                disabled
                className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shadow opacity-40 cursor-not-allowed"
              >
                <Star size={22} color="white" />
              </button>
            </div>
          </div>
        </div>

        {/* Bio Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🎯 About Me
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {candidate.bio || "Nessuna bio disponibile."}
          </p>
        </div>

        {/* Skills Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            💻 Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {candidate.skills?.map((skill, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📋 Dettagli
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold text-gray-900">{candidate.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <Euro size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Salary Atteso</p>
                <p className="font-semibold text-gray-900">
                  €{candidate.salary_min?.toLocaleString()} - €{candidate.salary_max?.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Preferenza</p>
                <p className="font-semibold text-gray-900 capitalize">
                  {getRemoteIcon(candidate.remote_preference)} {candidate.remote_preference}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Star size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Stato</p>
                <p className="font-semibold text-green-700">
                  ✅ Attivo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ⚡ Azioni
          </h2>
          <div className="flex flex-wrap gap-3">
            {swipeStatus === "right" && (
              <Link
                href="/dashboard/chat"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                <MessageCircle size={20} />
                <span>Inizia Chat</span>
              </Link>
            )}
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold">
              <Mail size={20} />
              <span>Invia Email</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold">
              <ExternalLink size={20} />
              <span>Vedi CV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}