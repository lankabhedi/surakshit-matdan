import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Election, Vote } from '../types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  elections: Election[];
  currentElection: Election | null;
  votes: Vote[];
  showVotedModal: boolean;
  
  setUser: (user: User | null) => void;
  logout: () => void;
  setElections: (elections: Election[]) => void;
  setCurrentElection: (election: Election | null) => void;
  addVote: (vote: Vote) => void;
  updateElection: (electionId: string, updates: Partial<Election>) => void;
  setShowVotedModal: (show: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      elections: [],
      currentElection: null,
      votes: [],
      showVotedModal: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        votes: [],
        showVotedModal: false,
      }),
      
      setElections: (elections) => set({ elections }),
      
      setCurrentElection: (election) => set({ currentElection: election }),
      
      addVote: (vote) => set((state) => ({ 
        votes: [...state.votes, vote],
        showVotedModal: true,
      })),
      
      updateElection: (electionId, updates) => set((state) => ({
        elections: state.elections.map(e => 
          e.id === electionId ? { ...e, ...updates } : e
        ),
        currentElection: state.currentElection?.id === electionId 
          ? { ...state.currentElection, ...updates }
          : state.currentElection
      })),

      setShowVotedModal: (show) => set({ showVotedModal: show }),
    }),
    {
      name: 'surakshit-matdan-storage',
    }
  )
);
