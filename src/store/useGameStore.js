import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '../core/Database';

export const useGameStore = create(
  persist(
    (set, get) => ({
      // --- ESTADO GLOBAL (Memória Viva do Jogo) ---
      isGameStarted: false,
      currentScreen: 'MAIN_MENU', // Telas: MAIN_MENU, BASE, MAP, INVESTIGATION, COMBAT
      turn: 1,
      familyBusiness: 50, // Z% inicial
      roster: [], // Personagens ativos com HP, Foco e Status mutáveis
      inventory: {
        weapons: [],
        kits: [],
        relics: []
      },
      activeCaseId: null,
      
      // --- AÇÕES ---
      startNewGame: () => {
        // Pega os personagens iniciais do Database e cria uma cópia "viva" para o estado
        const initialRoster = JSON.parse(JSON.stringify(db.db.characters));
        
        set({
          isGameStarted: true,
          currentScreen: 'BASE',
          turn: 1,
          familyBusiness: 50,
          roster: initialRoster,
          inventory: {
            weapons: ['wpn_shotgun', 'wpn_revolver'],
            kits: ['kit_silver_bullets', 'kit_holy_water'],
            relics: []
          },
          activeCaseId: null
        });
      },

      setScreen: (screenName) => set({ currentScreen: screenName }),
      
      updateFamilyBusiness: (amount) => set((state) => ({
        familyBusiness: Math.max(0, Math.min(100, state.familyBusiness + amount))
      })),

      updateCharacterStats: (charId, statsPatch) => set((state) => ({
        roster: state.roster.map(char => 
          char.id === charId 
            ? { ...char, stats: { ...char.stats, ...statsPatch } }
            : char
        )
      })),

      startCase: (caseId) => set({
        activeCaseId: caseId,
        currentScreen: 'INVESTIGATION'
      }),

      endTurn: () => set((state) => ({ turn: state.turn + 1 }))
    }),
    {
      name: 'spn-save-game', // Chave de salvamento no localStorage
    }
  )
);
