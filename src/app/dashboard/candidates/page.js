"use client";

import { X, Heart, Star, MapPin, Euro, Briefcase } from "lucide-react";
import { useState } from "react";
import { useCandidates } from "@/lib/hooks/useCandidates";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";

export default function CandidatesPage() {
  const { currentCandidate, remainingCandidates, nextCandidate, loading } =
    useCandidates();
  const { company, addSwipe } = useStore();
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [swipeLoading, setSwipeLoading] = useState(false);

  const handleSwipe = async (direction) => {
    if (!currentCandidate || swipeLoading) return;

    // Verifica che company exista
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
          direction: direction === "right" ? "right" : "left",
        },
      ]);

      if (error) {
        // Se è un duplicato, non bloccare il flow
        if (error.code === "23505") {
          console.warn("⚠️ Swipe duplicato, skippando...");
        } else {
          console.error("❌ Error saving swipe:", error);
        }
      } else {
        addSwipe(currentCandidate.id, direction);
      }

      // Controlla match solo se swipe right
      if (direction === "right") {
        await checkForMatch(currentCandidate.id);
      }
    } catch (err) {
      console.error("Swipe error:", err);
    }

    // Animazione poi passa al prossimo
    setTimeout(() => {
      setSwipeDirection(null);
      setSwipeLoading(false);
      nextCandidate();
    }, 300);
  };

  const checkForMatch = async (candidateId) => {
    try {
      // Cerca se il candidato ha swipato right su un nostro job
      const { data: candidateSwipes, error } = await supabase
        .from("swipes")
        .select("job_id")
        .eq("candidate_id", candidateId)
        .eq("direction", "right")
        .in(
          "job_id",
          // Cerca solo nei nostri job
          await supabase
            .from("jobs")
            .select("id")
            .eq("company_id", company.id)
            .then((res) => res.data?.map((j) => j.id) || []),
        );

      if (error) throw error;

      if (candidateSwipes && candidateSwipes.length > 0) {
        console.log("🎉 MATCH!");
        showToast.success(
          "🎉 È un MATCH! Il candidato ha già swipato right su un tuo job!",
        );
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
          <p className="text-gray-600">Caricamento candidati...</p>
        </div>
      </div>
    );
  }

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
          {/* Company badge */}
          <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500">Swipe come</p>
            <p className="text-sm font-semibold text-gray-900">
              {company?.name || "Company"}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="relative" style={{ height: "600px" }}>
          <div
            className={`absolute inset-0 bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
              swipeDirection === "left"
                ? "-translate-x-full opacity-0"
                : swipeDirection === "right"
                  ? "translate-x-full opacity-0"
                  : ""
            }`}
          >
            <div className="h-full flex flex-col overflow-hidden">
              {/* Avatar + Header */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                    👤
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">
                      {currentCandidate.first_name} {currentCandidate.last_name}
                    </h2>
                    <p className="text-blue-100">{currentCandidate.headline}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                    <MapPin size={14} />
                    <span>{currentCandidate.location}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                    <Euro size={14} />
                    <span>
                      €{currentCandidate.salary_min?.toLocaleString()} - €
                      {currentCandidate.salary_max?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm capitalize">
                    <Briefcase size={14} />
                    <span>{currentCandidate.remote_preference}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Bio</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {currentCandidate.bio || "Nessuna bio disponibile."}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentCandidate.skills?.map((skill, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-8 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => handleSwipe("left")}
                    disabled={swipeLoading}
                    className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={32} color="white" strokeWidth={3} />
                  </button>

                  <button
                    onClick={() => handleSwipe("right")}
                    disabled={swipeLoading}
                    className="w-20 h-20 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Heart size={36} color="white" strokeWidth={3} />
                  </button>

                  <button
                    disabled
                    className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center shadow-lg opacity-50 cursor-not-allowed"
                  >
                    <Star size={28} color="white" />
                  </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                  ❌ Passa • ✅ Interessa • ⭐ Super (coming soon)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
