"use client";

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
} from "react";

// ─── Initial State ───────────────────────────────────────────────
const initialState = {
  user: null,
  company: null,
  settings: {
    notifications: true,
    emailAlerts: true,
    theme: "light",
  },
  // Chat state (in-memory, no persist)
  activeChat: null,
  messages: {},
  // UI
  candidateIndex: 0,
};

// ─── Reducer ─────────────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "SET_COMPANY":
      return { ...state, company: action.payload };

    case "CLEAR_AUTH":
      return {
        ...initialState,
        settings: state.settings, // mantieni le settings
      };

    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };

    // ── Chat ────────────────────────────────────────────────────
    case "SET_ACTIVE_CHAT":
      return { ...state, activeChat: action.payload };

    case "SET_MESSAGES":
      return {
        ...state,
        messages: { ...state.messages, [action.chatId]: action.payload },
      };

    case "ADD_MESSAGE": {
      const existing = state.messages[action.chatId] || [];
      // Dedup: evita doppi (optimistic + realtime)
      const alreadyExists = existing.some((m) => m.id === action.payload.id);
      if (alreadyExists) return state;
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.chatId]: [...existing, action.payload],
        },
      };
    }

    case "CLEAR_MESSAGES": {
      const { [action.chatId]: _, ...rest } = state.messages;
      return { ...state, messages: rest };
    }

    // ── Candidate swipe index ───────────────────────────────────
    case "NEXT_CANDIDATE":
      return { ...state, candidateIndex: state.candidateIndex + 1 };

    case "RESET_CANDIDATE_INDEX":
      return { ...state, candidateIndex: 0 };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators stabili con useCallback
  const setUser = useCallback(
    (u) => dispatch({ type: "SET_USER", payload: u }),
    [],
  );
  const setCompany = useCallback(
    (c) => dispatch({ type: "SET_COMPANY", payload: c }),
    [],
  );
  const clearAuth = useCallback(() => dispatch({ type: "CLEAR_AUTH" }), []);
  const updateSettings = useCallback(
    (s) => dispatch({ type: "UPDATE_SETTINGS", payload: s }),
    [],
  );

  const setActiveChat = useCallback(
    (id) => dispatch({ type: "SET_ACTIVE_CHAT", payload: id }),
    [],
  );
  const setMessages = useCallback(
    (chatId, msgs) => dispatch({ type: "SET_MESSAGES", chatId, payload: msgs }),
    [],
  );
  const addMessage = useCallback(
    (chatId, msg) => dispatch({ type: "ADD_MESSAGE", chatId, payload: msg }),
    [],
  );
  const clearMessages = useCallback(
    (chatId) => dispatch({ type: "CLEAR_MESSAGES", chatId }),
    [],
  );

  const nextCandidate = useCallback(
    () => dispatch({ type: "NEXT_CANDIDATE" }),
    [],
  );
  const resetCandidateIndex = useCallback(
    () => dispatch({ type: "RESET_CANDIDATE_INDEX" }),
    [],
  );

  // Memoizza il value per evitare re-render inutili
  const value = useMemo(
    () => ({
      // State
      ...state,

      // Auth actions
      setUser,
      setCompany,
      clearAuth,
      updateSettings,

      // Chat actions
      setActiveChat,
      setMessages,
      addMessage,
      clearMessages,

      // Candidate actions
      nextCandidate,
      resetCandidateIndex,
    }),
    [
      state,
      setUser,
      setCompany,
      clearAuth,
      updateSettings,
      setActiveChat,
      setMessages,
      addMessage,
      clearMessages,
      nextCandidate,
      resetCandidateIndex,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

// ─── Selectors specializzati (evitano re-render inutili) ──────────
export function useUser() {
  return useApp().user;
}
export function useCompany() {
  return useApp().company;
}
export function useSettings() {
  return useApp().settings;
}
export function useChatState(chatId) {
  const { messages, activeChat } = useApp();
  return {
    messages: messages[chatId] || [],
    activeChat,
  };
}
