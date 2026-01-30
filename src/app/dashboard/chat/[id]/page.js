"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, MoreVertical, Phone, Video } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ChatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id;

  const [match, setMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const COMPANY_ID = "cdf8c6e0-8f89-4d3f-b123-456789abcdef";

  useEffect(() => {
    if (matchId) {
      fetchMatchAndMessages();
      subscribeToMessages();
    }
  }, [matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMatchAndMessages = async () => {
    try {
      setLoading(true);

      // Fetch match info
      const { data: matchData, error: matchError } = await supabase
        .from("matches")
        .select(
          `
          *,
          candidate:candidates(id, first_name, last_name, headline, avatar_url),
          job:jobs(id, title, location)
        `,
        )
        .eq("id", matchId)
        .single();

      if (matchError) throw matchError;
      setMatch(matchData);

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);

      console.log("✅ Chat loaded:", messagesData?.length || 0, "messages");
    } catch (error) {
      console.error("Error fetching chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          console.log("📨 New message received:", payload.new);
          setMessages((prev) => [...prev, payload.new]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setSending(true);

    try {
      const messageData = {
        match_id: matchId,
        sender_id: COMPANY_ID,
        sender_type: "company",
        content: newMessage.trim(),
      };

      const { data, error } = await supabase
        .from("messages")
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;

      // Update match last_message
      await supabase
        .from("matches")
        .update({
          last_message: newMessage.trim(),
          last_message_at: new Date().toISOString(),
        })
        .eq("id", matchId);

      console.log("✅ Message sent:", data);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Errore nell'invio del messaggio");
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    // Se meno di 1 minuto fa
    if (diffMins < 1) return "Ora";

    // Se meno di 1 ora fa
    if (diffMins < 60) return `${diffMins}min fa`;

    // Se oggi
    if (diffHours < 24) {
      return date.toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Se più vecchio, mostra data
    return date.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Chat non trovata
          </h2>
          <Link
            href="/dashboard/chat"
            className="text-blue-600 hover:text-blue-700"
          >
            Torna alle chat
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/chat"
            className="hover:bg-gray-100 p-2 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </Link>

          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-xl">
            {match.candidate?.avatar_url || "👤"}
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              {match.candidate?.first_name} {match.candidate?.last_name}
            </h2>
            <p className="text-sm text-gray-600">{match.candidate?.headline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Phone size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Video size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <MoreVertical size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Match info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-900">
              🎉 Hai un match con <strong>{match.candidate?.first_name}</strong>{" "}
              per <strong>{match.job?.title}</strong>!
            </p>
          </div>

          {/* Messages */}
          {messages.map((message) => {
            const isCompany = message.sender_type === "company";
            return (
              <div
                key={message.id}
                className={`flex ${isCompany ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isCompany
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isCompany ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {formatMessageTime(message.created_at)}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto flex items-center gap-3"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Scrivi un messaggio..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
          >
            {sending ? (
              "Invio..."
            ) : (
              <>
                <Send size={20} />
                <span>Invia</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}


// Explanation:// This code defines a chat detail page in a Next.js application using React. It fetches match and message data from a Supabase backend, subscribes to real-time message updates, and allows sending new messages. The UI includes a header with match info, a scrollable message area, and an input form for sending messages. The code handles loading states, error handling, and formats message timestamps for better user experience.