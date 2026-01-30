import { useEffect } from 'react';
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
    console.log('🔄 Subscribing to chat real-time updates...');

    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          console.log('🔔 New message:', payload.new);
          addMessage(matchId, payload.new);
        }
      )
      .subscribe((status) => {
        console.log('📡 Chat subscription status:', status);
      });

    return () => {
      console.log('🔴 Unsubscribing from chat real-time...');
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (content, senderId, senderType) => {
    try {
      const messageData = {
        match_id: matchId,
        sender_id: senderId,
        sender_type: senderType,
        content: content.trim(),
      };

      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;

      // Update last_message su matches
      await supabase
        .from('matches')
        .update({
          last_message: content.trim(),
          last_message_at: new Date().toISOString(),
        })
        .eq('id', matchId);

      console.log('✅ Message sent:', data);
      return { data, error: null };
    } catch (error) {
      console.error('❌ Error sending message:', error);
      return { data: null, error };
    }
  };

  return {
    messages: chatMessages,
    sendMessage,
    refetch: fetchMessages,
  };
}