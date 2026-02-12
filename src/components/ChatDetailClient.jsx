"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";

// ─── Memoized MessageBubble ───────────────────────────────────────
const MessageBubble = memo(function MessageBubble({ msg, isOurs }) {
  const time = new Date(msg.created_at).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isOurs ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          isOurs
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm"
        }`}
      >
        <p className="text-sm leading-relaxed">{msg.content}</p>
        <p
          className={`text-xs mt-1 ${isOurs ? "text-blue-200" : "text-gray-400"}`}
        >
          {time}
        </p>
      </div>
    </div>
  );
});

// ─── Main ─────────────────────────────────────────────────────────
export default function ChatDetailClient({ match, initialMessages, company }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const candidate = match.candidate;

  // Auto-scroll al fondo quando arrivano nuovi messaggi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📡 Real-time: nuovi messaggi
  useEffect(() => {
    const channel = supabase
      .channel(`chat-detail-${match.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${match.id}`,
        },
        (payload) => {
          setMessages((prev) => {
            // ✅ FIX: Rimuovi TUTTI i temp prima di aggiungere il real
            const withoutTemp = prev.filter(
              (m) => !m.id.toString().startsWith("temp-"),
            );

            // Poi aggiungi real (se non esiste già)
            if (withoutTemp.some((m) => m.id === payload.new.id)) return prev;

            return [...withoutTemp, payload.new];
          });
        },
      )
      .subscribe((status) => console.log("📡 Chat realtime:", status));

    return () => supabase.removeChannel(channel);
  }, [match.id]);

  // ✅ Mark as read on mount
  useEffect(() => {
    const markAsRead = async () => {
      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("match_id", match.id)
        .neq("sender_type", "company") // Solo messaggi ricevuti
        .is("read_at", null);
    };

    markAsRead();
  }, [match.id]);

  const handleSend = useCallback(
    async (e) => {
      e.preventDefault();
      if (!newMessage.trim() || sending || !company?.id) return;

      const content = newMessage.trim();
      setNewMessage("");
      setSending(true);

      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const tempMsg = {
        id: tempId,
        match_id: match.id,
        sender_id: company.id,
        sender_type: "company",
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMsg]);

      try {
        const { data, error } = await supabase
          .from("messages")
          .insert([
            {
              match_id: match.id,
              sender_id: company.id,
              sender_type: "company",
              content,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        // ✅ FIX: Replace viene gestito dal real-time listener sopra
        // Non serve più fare manualmente il replace qui

        // Aggiorna last_message nel match
        await supabase
          .from("matches")
          .update({ last_message: content, last_message_at: data.created_at })
          .eq("id", match.id);
      } catch (err) {
        console.error("❌ sendMessage error:", err);
        showToast.error("Errore nell'invio");
        // Rimuovi il messaggio ottimistico
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      } finally {
        setSending(false);
      }
    },
    [newMessage, sending, company?.id, match.id],
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSend(e);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
        <Link
          href="/dashboard/chat"
          className="text-gray-500 hover:text-gray-700 transition"
        >
          <ArrowLeft size={22} />
        </Link>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
          {candidate?.first_name?.[0]}
          {candidate?.last_name?.[0]}
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-gray-900">
            {candidate?.first_name} {candidate?.last_name}
          </h1>
          <p className="text-sm text-gray-500">{candidate?.headline}</p>
        </div>
        <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
          {match.job?.title}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-gray-500 font-medium">Nessun messaggio ancora</p>
            <p className="text-gray-400 text-sm mt-1">
              Inizia la conversazione!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isOurs={msg.sender_type === "company"}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-white"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Scrivi un messaggio... (Invio per inviare)"
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          disabled={sending}
          autoFocus
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || sending}
          className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
