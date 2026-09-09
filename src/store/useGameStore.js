import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '../core/Database';

export const useGameStore = create(
  persist(
    (set, get) => ({
      // --- ESTADO GLOBAL ---
      isGameStarted: false,
      currentScreen: 'MAIN_MENU',
      turn: 1,
      familyBusiness: 50,
      
      sealsProtected: 0,
      sealsBroken: 0,
      monsterKills: {}, // { 'mon_werewolf': 5 }
      
      roster: [],
      desertedMembers: [],
      
      turnsWithLowBusiness: 0,
      turnsWithHighBusiness: 0,

      inventory: {
        weapons: [],
        kits: [],
        relics: []
      },
      
      activeMapCases: [],
      activeCaseId: null,
      activeCaseAp: 0,
      
      // --- AÇÕES ---
      startNewGame: () => {
        const initialRoster = JSON.parse(JSON.stringify(db.db.characters));
        const initialCases = JSON.parse(JSON.stringify(db.db.cases)); // Start with base JSON cases
        set({
          isGameStarted: true,
          currentScreen: 'BASE',
          turn: 1,
          familyBusiness: 50,
          sealsProtected: 0,
          sealsBroken: 0,
          monsterKills: {},
          roster: initialRoster,
          desertedMembers: [],
          turnsWithLowBusiness: 0,
          turnsWithHighBusiness: 0,
          inventory: {
            weapons: ['wpn_shotgun', 'wpn_revolver'],
            kits: ['kit_silver_bullets', 'kit_holy_water'],
            relics: []
          },
          activeMapCases: initialCases,
          activeCaseId: null,
          activeCaseAp: 0
        });
      },

      setScreen: (screenName) => set({ currentScreen: screenName }),
      
      generateMapCases: (cases) => set({ activeMapCases: cases }),
      
      updateFamilyBusiness: (amount) => set((state) => ({
        familyBusiness: Math.max(0, Math.min(100, state.familyBusiness + amount))
      })),

      equipItem: (charId, slot, itemId) => set((state) => {
        return {
          roster: state.roster.map(char => {
            if (char.id === charId) {
              return { ...char, equipped: { ...char.equipped, [slot]: itemId } };
            }
            return char;
          })
        };
      }),

      killCharacter: (charId) => set((state) => {
        const char = state.roster.find(c => c.id === charId);
        if (!char) return state;
        
        const newRoster = state.roster.filter(c => c.id !== charId);
        
        // Game over check will be handled in the component calling this, or right after.
        return { roster: newRoster };
      }),

      registerMonsterKill: (monsterId) => set((state) => {
        const currentKills = state.monsterKills[monsterId] || 0;
        return {
          monsterKills: { ...state.monsterKills, [monsterId]: currentKills + 1 }
        };
      }),

      startCaseWithApproach: (caseId, apAmmount) => set({
        activeCaseId: caseId,
        activeCaseAp: apAmmount,
        currentScreen: 'INVESTIGATION'
      }),

      // Fim do turno do mapa (após concluir uma missão)
      endTurn: () => set((state) => {
        let newTurnsLow = state.familyBusiness < 40 ? state.turnsWithLowBusiness + 1 : 0;
        let newTurnsHigh = state.familyBusiness > 80 ? state.turnsWithHighBusiness + 1 : 0;
        
        let currentRoster = [...state.roster];
        let currentDeserted = [...state.desertedMembers];
        let notification = null;

        // Mecânica de Deserção
        if (newTurnsLow >= 5 && currentRoster.length > 1) {
          // Sort by engagement ascending
          currentRoster.sort((a, b) => a.engagement - b.engagement);
          const deserter = currentRoster.shift(); // Remove the lowest engagement
          currentDeserted.push(deserter);
          newTurnsLow = 0; // Reset counter
          notification = 'MEMBER_DESERTED';
        }

        // Mecânica de Retorno (Recrutamento)
        if (newTurnsHigh >= 5 && currentDeserted.length > 0) {
          const returner = currentDeserted.shift();
          returner.engagement = 50; // Resets engagement
          currentRoster.push(returner);
          newTurnsHigh = 0;
          notification = 'MEMBER_RECRUITED';
        }

        return { 
          turn: state.turn + 1,
          turnsWithLowBusiness: newTurnsLow,
          turnsWithHighBusiness: newTurnsHigh,
          roster: currentRoster,
          desertedMembers: currentDeserted,
          // Pode-se usar notification num global state pop-up se desejado futuramente
        };
      })
    }),
    {
      name: 'spn-save-game',
    }
  )
);
