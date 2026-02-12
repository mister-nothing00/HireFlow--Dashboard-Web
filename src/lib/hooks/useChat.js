"use client";

import { useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { supabase } from "../supabase.js";

export function useChat(matchId) {
  const { messages, setMessages, addMessage, setActiveChat } = useApp();
  const chatMessages = messages[matchId] || [];

  useEffect(() => {
    if (!matchId) return;

    setActiveChat(matchId);
    fetchMessages();
    const unsubscribe = subscribeToMessages();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [matchId]);

  const fetchMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(matchId, data || []);
      console.log("✅ Messages loaded:", data?.length);
    } catch (e) {
      console.error("❌ fetchMessages error:", e);
    }
  }, [matchId, setMessages]);

  const subscribeToMessages = useCallback(() => {
    const channel = supabase
      .channel(`chat-messages-${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          // addMessage gestisce già il dedup nel reducer
          addMessage(matchId, payload.new);
        },
      )
      .subscribe((status) => console.log("📡 Chat sub:", status));

    return () => supabase.removeChannel(channel);
  }, [matchId, addMessage]);

  const sendMessage = useCallback(
    async (content, senderId, senderType = "company") => {
      if (!content?.trim()) return { error: "Content vuoto" };

      // Optimistic update: id temporaneo
      const tempId = `temp-${Date.now()}`;
      const tempMsg = {
        id: tempId,
        match_id: matchId,
        sender_id: senderId,
        sender_type: senderType,
        content: content.trim(),
        created_at: new Date().toISOString(),
      };
      addMessage(matchId, tempMsg);

      try {
        const { data, error } = await supabase
          .from("messages")
          .insert([
            {
              match_id: matchId,
              sender_id: senderId,
              sender_type: senderType,
              content: content.trim(),
            },
          ])
          .select()
          .single();

        if (error) throw error;

        // Rimuovi il messaggio temporaneo dopo conferma
        return { data, error: null };
      } catch (e) {
        console.error("❌ sendMessage error:", e);
        // Rimuovi il messaggio temporaneo in caso di errore
        return { data: null, error: e };
      }
    },
    [matchId, addMessage],
  );

  return {
    messages: chatMessages,
    fetchMessages,
    sendMessage,
  };
}
