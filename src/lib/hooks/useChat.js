import { useEffect, useCallback } from 'react';
import { useStore } from '../store';
import { supabase } from '../supabase';

export function useChat(matchId) {
  const { messages, setMessages, addMessage, setActiveChat } = useStore();
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

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('✅ Messages loaded:', data?.length || 0);
      setMessages(matchId, data || []);
    } catch (error) {
      console.error('❌ Error fetching messages:', error);
    }
  };

  const subscribeToMessages = () => {
    console.log('🔄 Subscribing to chat real-time...');

    const channel = supabase
      .channel(`messages:${matchId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`,
      }, (payload) => {
        console.log('📨 New message via realtime:', payload.new.id);

        // ✅ FIX dedup: l'optimistic update ha già aggiunto il messaggio
        // Il realtime arriva dopo → verifica ID prima di aggiungere
        const current = useStore.getState().messages[matchId] || [];
        const exists = current.find(m => m.id === payload.new.id);
        if (!exists) {
          addMessage(matchId, payload.new);
        }
      })
      .subscribe((status) => {
        console.log('📡 Chat subscription:', status);
      });

    return () => {
      console.log('🔴 Unsubscribing from chat...');
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (content, senderId, senderType) => {
    if (!content?.trim()) return { data: null, error: 'Empty message' };

    const trimmed = content.trim();

    // ✅ OPTIMISTIC UPDATE: messaggio appare ISTANTANEAMENTE prima della risposta DB
    // Crea un ID temporaneo riconoscibile
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      match_id: matchId,
      sender_id: senderId,
      sender_type: senderType,
      content: trimmed,
      created_at: new Date().toISOString(),
      _pending: true, // flag per mostrare spinner se vuoi
    };
    addMessage(matchId, optimisticMsg);

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{ match_id: matchId, sender_id: senderId, sender_type: senderType, content: trimmed }])
        .select()
        .single();

      if (error) throw error;

      // Sostituisce il messaggio temporaneo con quello reale (con ID definitivo)
      const current = useStore.getState().messages[matchId] || [];
      const updated = current.map(m => m.id === tempId ? data : m);
      setMessages(matchId, updated);

      // Aggiorna last_message_at sul match (fire and forget)
      supabase
        .from('matches')
        .update({ last_message: trimmed, last_message_at: new Date().toISOString() })
        .eq('id', matchId)
        .then(() => console.log('✅ Match last_message updated'));

      console.log('✅ Message sent:', data.id);
      return { data, error: null };
    } catch (error) {
      console.error('❌ Error sending message:', error);
      // Rimuovi il messaggio ottimistico in caso di errore
      const current = useStore.getState().messages[matchId] || [];
      setMessages(matchId, current.filter(m => m.id !== tempId));
      return { data: null, error };
    }
  };

  return {
    messages: chatMessages,
    sendMessage,
    refetch: fetchMessages,
  };
}