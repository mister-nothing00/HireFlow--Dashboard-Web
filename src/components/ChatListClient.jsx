"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// Componente principale per la lista delle chat, con ricerca e real-time updates
export default function ChatListClient({ company, initialMatches }) {
  const [matches, setMatches] = useState(initialMatches);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔔 REALTIME
  useEffect(() => {
    if (!company?.id) return;

    const channel = supabase
      .channel(`chat-list-${company.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "matches",
          filter: `company_id=eq.${company.id}`,
        },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setMatches((prev) =>
              prev
                .map((m) =>
                  m.id === payload.new.id ? { ...m, ...payload.new } : m,
                )
                .sort((a, b) => {
                  const aTime = a.last_message_at
                    ? new Date(a.last_message_at)
                    : new Date(0);
                  const bTime = b.last_message_at
                    ? new Date(b.last_message_at)
                    : new Date(0);
                  return bTime - aTime;
                }),
            );
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMsg = payload.new;
          setMatches((prev) => {
            const matchExists = prev.find((m) => m.id === newMsg.match_id);
            if (!matchExists) return prev;

            return prev
              .map((m) =>
                m.id === newMsg.match_id
                  ? {
                      ...m,
                      last_message_at: newMsg.created_at,
                      last_message_content: newMsg.content,
                    }
                  : m,
              )
              .sort((a, b) => {
                const aTime = a.last_message_at
                  ? new Date(a.last_message_at)
                  : new Date(0);
                const bTime = b.last_message_at
                  ? new Date(b.last_message_at)
                  : new Date(0);
                return bTime - aTime;
              });
          });
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [company?.id]);

  const filteredMatches = matches.filter((match) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    const candidateName =
      `${match.candidate?.first_name} ${match.candidate?.last_name}`.toLowerCase();
    return (
      candidateName.includes(searchLower) ||
      match.candidate?.headline?.toLowerCase().includes(searchLower)
    );
  });

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Ora";
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return "Ieri";
    return `${diffDays}g fa`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-full max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat</h1>
          <p className="text-gray-600">
            {matches.length} conversazion{matches.length === 1 ? "e" : "i"}{" "}
            attiv{matches.length === 1 ? "a" : "e"}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Cerca candidato..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Lista */}
        {filteredMatches.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Nessuna chat
            </h2>
            <p className="text-gray-600">
              I match appariranno qui.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredMatches.map((match) => (
              <Link key={match.id} href={`/dashboard/chat/${match.id}`}>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {match.candidate?.first_name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {match.candidate?.first_name}{" "}
                        {match.candidate?.last_name}
                      </p>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {formatTime(match.last_message_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {match.candidate?.headline || "Candidato"}
                    </p>
                  </div>
                  <div className="text-gray-300 flex-shrink-0">›</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}