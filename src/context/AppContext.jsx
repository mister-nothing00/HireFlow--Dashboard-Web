'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';

// ─── Context ─────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Auth state ────────────────────────────────────────────────
  const [user, setUser]       = useState(null);
  const [company, setCompany] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    theme: 'light',
  });

// ── Chat state ───────────────────────────────────────────────
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessagesMap]  = useState({}); // { [matchId]: Message[] }

  // ── Candidates state ──────────────────────────────────────────
  const [candidateIndex, setCandidateIndex] = useState(0);

  // ── Actions ───────────────────────────────────────────────────

  const clearAuth = useCallback(() => {
    setUser(null);
    setCompany(null);
    setMessagesMap({});
    setCandidateIndex(0);
  }, []);

  const updateSettings = useCallback((updates) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // Chat
  const setMessages = useCallback((chatId, msgs) => {
    setMessagesMap(prev => ({ ...prev, [chatId]: msgs }));
  }, []);

  const addMessage = useCallback((chatId, msg) => {
    setMessagesMap(prev => {
      const existing = prev[chatId] || [];
      // Dedup: evita doppi da optimistic update + realtime
      if (existing.some(m => m.id === msg.id)) return prev;
      return { ...prev, [chatId]: [...existing, msg] };
    });
  }, []);

  const clearMessages = useCallback((chatId) => {
    setMessagesMap(prev => {
      const next = { ...prev };
      delete next[chatId];
      return next;
    });
  }, []);

  // Candidates
  const nextCandidate       = useCallback(() => setCandidateIndex(i => i + 1), []);
  const resetCandidateIndex = useCallback(() => setCandidateIndex(0), []);

  // ── Value memoizzato ──────────────────────────────────────────
  const value = useMemo(() => ({
    // State
    user,
    company,
    settings,
    activeChat,
    messages,
    candidateIndex,

    // Actions auth
    setUser,
    setCompany,
    clearAuth,
    updateSettings,

    // Actions chat
    setActiveChat,
    setMessages,
    addMessage,
    clearMessages,

    // Actions candidates
    nextCandidate,
    resetCandidateIndex,
  }), [
    user, company, settings, activeChat, messages, candidateIndex,
    clearAuth, updateSettings,
    setMessages, addMessage, clearMessages,
    nextCandidate, resetCandidateIndex,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook principale ──────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve essere usato dentro <AppProvider>');
  return ctx;
}

// ─── Selectors specifici (meno re-render) ─────────────────────────
// Usa questi invece di useApp() quando ti serve solo 1 pezzo di stato

export function useUser()     { return useApp().user; }
export function useCompany()  { return useApp().company; }
export function useSettings() { return useApp().settings; }

export function useChatMessages(chatId) {
  const { messages } = useApp();
  return messages[chatId] || [];
}