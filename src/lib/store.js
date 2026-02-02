import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // ========== USER & COMPANY STATE ==========
      user: null,
      company: {
        id: 'cdf8c6e0-8f89-4d3f-b123-456789abcdef', // Temporaneo finché non c'è auth
        name: 'Tech Startup Inc.',
        logo_url: '🏢',
        location: 'Milano, IT',
      },
      setUser: (user) => set({ user }),
      setCompany: (company) => set({ company }),
      clearAuth: () => {
        // Clear everything except settings
        set({ 
          user: null, 
          company: null, 
          jobs: [], 
          candidates: [], 
          matches: [],
          messages: {},
          currentCandidateIndex: 0,
          stats: {
            activeJobs: 0,
            totalSwipes: 0,
            totalMatches: 0,
            activeChats: 0,
          },
        });
        console.log('🗑️ Store cleared (logout)');
      },

      // ========== JOBS STATE ==========
      jobs: [],
      jobsLoading: false,
      setJobs: (jobs) => set({ jobs }),
      setJobsLoading: (loading) => set({ jobsLoading: loading }),
      addJob: (job) => set((state) => ({ 
        jobs: [job, ...state.jobs],
        stats: {
          ...state.stats,
          activeJobs: state.stats.activeJobs + 1,
        }
      })),
      updateJob: (id, updates) => set((state) => ({
        jobs: state.jobs.map(j => j.id === id ? { ...j, ...updates } : j)
      })),
      deleteJob: (id) => set((state) => ({
        jobs: state.jobs.filter(j => j.id !== id),
        stats: {
          ...state.stats,
          activeJobs: state.stats.activeJobs - 1,
        }
      })),

      // ========== CANDIDATES STATE ==========
      candidates: [],
      candidatesLoading: false,
      currentCandidateIndex: 0,
      setCandidates: (candidates) => set({ candidates }),
      setCandidatesLoading: (loading) => set({ candidatesLoading: loading }),
      nextCandidate: () => set((state) => ({
        currentCandidateIndex: state.currentCandidateIndex + 1
      })),
      resetCandidateIndex: () => set({ currentCandidateIndex: 0 }),
      addSwipe: (candidateId, direction) => set((state) => ({
        stats: {
          ...state.stats,
          totalSwipes: state.stats.totalSwipes + 1,
        }
      })),

      // ========== MATCHES STATE ==========
      matches: [],
      matchesLoading: false,
      setMatches: (matches) => {
        const matchCount = matches.filter(m => m.hasMatch).length;
        set({ 
          matches,
          stats: {
            ...get().stats,
            totalMatches: matchCount,
          }
        });
      },
      setMatchesLoading: (loading) => set({ matchesLoading: loading }),
      addMatch: (match) => set((state) => ({ 
        matches: [match, ...state.matches],
        stats: {
          ...state.stats,
          totalMatches: state.stats.totalMatches + 1,
        }
      })),
      updateMatch: (id, updates) => set((state) => ({
        matches: state.matches.map(m => m.id === id ? { ...m, ...updates } : m)
      })),

      // ========== CHAT STATE ==========
      activeChat: null,
      messages: {},
      setActiveChat: (chatId) => set({ activeChat: chatId }),
      setMessages: (chatId, messages) => set((state) => ({
        messages: { ...state.messages, [chatId]: messages }
      })),
      addMessage: (chatId, message) => set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), message]
        }
      })),
      clearMessages: (chatId) => set((state) => {
        const newMessages = { ...state.messages };
        delete newMessages[chatId];
        return { messages: newMessages };
      }),

      // ========== SETTINGS STATE ==========
      settings: {
        notifications: true,
        emailAlerts: true,
        theme: 'light',
      },
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),

      // ========== STATS STATE (for dashboard) ==========
      stats: {
        activeJobs: 0,
        totalSwipes: 0,
        totalMatches: 0,
        activeChats: 0,
      },
      setStats: (stats) => set({ stats }),
      updateStats: (updates) => set((state) => ({
        stats: { ...state.stats, ...updates }
      })),

      // ========== UTILITY METHODS ==========
      reset: () => set({
        jobs: [],
        candidates: [],
        matches: [],
        messages: {},
        currentCandidateIndex: 0,
        stats: {
          activeJobs: 0,
          totalSwipes: 0,
          totalMatches: 0,
          activeChats: 0,
        }
      }),
    }),
    {
      name: 'hireflow-storage', // LocalStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Salva solo user, company, settings
        user: state.user,
        company: state.company,
        settings: state.settings,
      }),
    }
  )
);