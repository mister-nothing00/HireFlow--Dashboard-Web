"use client";

import { X, Heart, Star, MapPin, Euro, Briefcase } from "lucide-react";
import { useState } from "react";
import { useCandidates } from "@/lib/hooks/useCandidates";
import { useApp} from "@/lib/store";
import { supabase } from "@/lib/supabase-server";
import { showToast } from "@/lib/toast";
import { SkeletonCandidates } from "@/components/ui/Skeletons";

export default function CandidatesPage() {
  const { currentCandidate, remainingCandidates, nextCandidate, loading } =
    useCandidates();
  const { company, addSwipe } = useStore();
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [swipeLoading, setSwipeLoading] = useState(false);

  const handleSwipe = async (direction) => {
    if (!currentCandidate || swipeLoading) return;

    if (!company?.id) {
      console.error("❌ Company non trovata nello store");
      showToast.error("Errore: Company non trovata. Ricarica la pagina.");
      return;
    }

    console.log(
      `${direction === "right" ? "✅" : "❌"} Swipe ${direction}:`,
      currentCandidate.first_name,
    );
    setSwipeDirection(direction);
    setSwipeLoading(true);

    try {
      const { error } = await supabase.from("company_swipes").insert([
        {
          job_id: null,
          candidate_id: currentCandidate.id,
          company_id: company.id,
          direction: direction === "right" ? "right" : "left",
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          console.warn("⚠️ Swipe duplicato, skippando...");
        } else {
          console.error("❌ Error saving swipe:", error);
        }
      } else {
        addSwipe(currentCandidate.id, direction);
      }

      if (direction === "right") {
        await checkForMatch(currentCandidate.id);
      }
    } catch (err) {
      console.error("Swipe error:", err);
    }

    setTimeout(() => {
      setSwipeDirection(null);
      setSwipeLoading(false);
      nextCandidate();
    }, 300);
  };

  // Funzione per verificare se c'è un match dopo uno swipe right
  const checkForMatch = async (candidateId) => {
    try {
      // 1. Cerca se il candidato ha swipato right su un job della nostra company
      const { data, error } = await supabase
        .from("swipes")
        .select("job_id, job:jobs!inner(id, company_id)")
        .eq("candidate_id", candidateId)
        .eq("direction", "right")
        .eq("job.company_id", company.id)
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const jobId = data[0].job_id;

        // 2. ✅ FIX CRITICO: inserisce il match nella tabella matches
        const { error: matchError } = await supabase.from("matches").insert({
          candidate_id: candidateId,
          job_id: jobId,
          company_id: company.id,
          status: "matched",
        });

        // 23505 = duplicate key, match già esiste → non è un errore
        if (matchError && matchError.code !== "23505") {
          console.error("❌ Error creating match:", matchError);
          throw matchError;
        }

        console.log("🎉 MATCH creato!", { candidateId, jobId });
        showToast.success(
          "🎉 È un MATCH! Il candidato ha già swipato right su un tuo job!",
        );
      }
    } catch (error) {
      console.error("Error checking match:", error);
    }
  };

  if (loading) return <SkeletonCandidates />;

  if (!currentCandidate) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Hai visto tutti i candidati!
          </h2>
          <p className="text-gray-600 mb-8">
            Torna più tardi per nuovi profili o rivedi i tuoi match.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Scopri Candidati
            </h1>
            <p className="text-gray-600 mt-1">
              {remainingCandidates}{" "}
              {remainingCandidates === 1
                ? "profilo disponibile"
                : "profili disponibili"}
            </p>
          </div>
          <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500">Swipe come</p>
            <p className="text-sm font-semibold text-gray-900">
              {company?.name || "Company"}
            </p>
          </div>
        </div>

        {/* Card candidato */}
        <div className="relative" style={{ height: "600px" }}>
          <div
            className={`absolute inset-0 bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
              swipeDirection === "left"
                ? "-translate-x-full opacity-0 rotate-[-5deg]"
                : swipeDirection === "right"
                  ? "translate-x-full opacity-0 rotate-[5deg]"
                  : ""
            }`}
          >
            {/* Candidate Card Content */}
            <div className="h-full flex flex-col p-8 overflow-y-auto">
              {/* Avatar e nome */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {currentCandidate.first_name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentCandidate.first_name} {currentCandidate.last_name}
                  </h2>
                  <p className="text-gray-500">
                    {currentCandidate.headline || "Candidato"}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-wrap gap-3 mb-4">
                {currentCandidate.location && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={14} />
                    <span>{currentCandidate.location}</span>
                  </div>
                )}
                {(currentCandidate.salary_min ||
                  currentCandidate.salary_max) && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Euro size={14} />
                    <span>
                      {currentCandidate.salary_min?.toLocaleString()} -{" "}
                      {currentCandidate.salary_max?.toLocaleString()}
                    </span>
                  </div>
                )}
                {currentCandidate.remote_preference && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Briefcase size={14} />
                    <span className="capitalize">
                      {currentCandidate.remote_preference}
                    </span>
                  </div>
                )}
              </div>

              {/* Bio */}
              {currentCandidate.bio && (
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                  {currentCandidate.bio}
                </p>
              )}

              {/* Skills */}
              {currentCandidate.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentCandidate.skills.slice(0, 8).map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottoni azione */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            onClick={() => handleSwipe("left")}
            disabled={swipeLoading}
            className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition disabled:opacity-50 border-2 border-red-100"
          >
            <X size={28} />
          </button>
          <button
            onClick={() => handleSwipe("up")}
            disabled={swipeLoading}
            className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-yellow-500 hover:bg-yellow-50 transition disabled:opacity-50 border-2 border-yellow-100"
          >
            <Star size={24} />
          </button>
          <button
            onClick={() => handleSwipe("right")}
            disabled={swipeLoading}
            className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-green-500 hover:bg-green-50 transition disabled:opacity-50 border-2 border-green-100"
          >
            <Heart size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}
