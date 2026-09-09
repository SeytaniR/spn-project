import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { db } from '../core/Database';
import GameEngine from '../core/GameEngine';

export function InvestigationScreen() {
  const { activeCaseId, setScreen, roster } = useGameStore();
  const hydratedCase = db.getHydratedCase(activeCaseId);
  const targetMonster = hydratedCase.targetMonster;

  const [ap, setAp] = useState(hydratedCase.investigationPoints);
  const [logs, setLogs] = useState([]);
  const [cluesFound, setCluesFound] = useState([]);

  // Seleciona um personagem que tem o maior atributo necessário
  const attemptInvestigation = (clueId) => {
    if (ap <= 0) return;
    
    const clue = db.findById('clues', clueId);
    
    // Procura o melhor personagem para a tarefa
    let bestChar = roster[0];
    let bestVal = 0;
    
    roster.forEach(char => {
      if (char.attributes[clue.requiredAttribute] > bestVal) {
        bestVal = char.attributes[clue.requiredAttribute];
        bestChar = char;
      }
    });

    const roll = GameEngine.rollSkillCheck(bestVal, clue.difficulty, 0);
    
    if (roll.success) {
      if (!cluesFound.includes(clueId)) {
        setCluesFound([...cluesFound, clueId]);
      }
      setLogs([`[SUCESSO] ${bestChar.name} rolou ${roll.rollValue} e encontrou uma pista: "${clue.textKey}"`, ...logs]);
    } else {
      setLogs([`[FALHA] ${bestChar.name} rolou ${roll.rollValue} e não achou nada.`, ...logs]);
    }

    setAp(ap - 1);
  };

  const goToCombat = () => {
    setScreen('COMBAT');
  };

  if (!hydratedCase) return <div>Erro ao carregar caso.</div>;

  return (
    <div className="container" style={{ flex: 1 }}>
      <header className="card" style={{ marginBottom: '2vh' }}>
        <h2 style={{ color: 'var(--accent-gold)' }}>Investigando: {hydratedCase.title}</h2>
        <p>Pontos de Ação (AP): <strong>{ap}</strong></p>
      </header>

      <div className="card" style={{ display: 'flex', gap: '2%', marginBottom: '2vh', flexWrap: 'wrap' }}>
        {/* Renderiza possíveis pistas do monstro para o jogador tentar descobrir */}
        {targetMonster.cluePool.map(clueId => {
          const isFound = cluesFound.includes(clueId);
          return (
            <button 
              key={clueId}
              onClick={() => attemptInvestigation(clueId)}
              disabled={ap <= 0 || isFound}
              style={{ padding: '2%', background: isFound ? 'var(--accent-gold)' : 'transparent', color: isFound ? '#121212' : 'white', border: '1px solid var(--accent-gold)' }}
            >
              {isFound ? 'Pista Revelada' : 'Investigar Local'}
            </button>
          )
        })}
      </div>

      <div className="card" style={{ flex: 1, overflowY: 'auto', marginBottom: '2vh', fontSize: '0.9rem' }}>
        <h3>Registro de Investigação</h3>
        <ul style={{ padding: 0, listStyle: 'none', color: '#aaa', marginTop: '1vh' }}>
          {logs.map((log, i) => <li key={i} style={{ marginBottom: '1vh' }}>{log}</li>)}
        </ul>
      </div>

      <button 
        onClick={goToCombat}
        style={{ padding: '5%', background: 'var(--accent-red)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>
        Iniciar Combate!
      </button>
    </div>
  );
}
