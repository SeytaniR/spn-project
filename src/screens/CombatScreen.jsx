import React, { useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import { db } from '../core/Database';
import GameEngine from '../core/GameEngine';

export function CombatScreen() {
  const { activeCaseId, roster, setScreen, endTurn, updateFamilyBusiness } = useGameStore();
  
  const hydratedCase = db.getHydratedCase(activeCaseId);
  const targetMonster = hydratedCase.targetMonster;
  
  const [monsterHp, setMonsterHp] = useState(targetMonster.stats.hp);
  const [logs, setLogs] = useState([`Um ${targetMonster.name} apareceu!`]);

  const handleAttack = (character) => {
    const result = GameEngine.resolveAttack(character, targetMonster);
    
    setMonsterHp(prev => Math.max(0, prev - result.damageDealt));
    setLogs([...result.logs, ...logs]);
  };

  const handleFlee = () => {
    updateFamilyBusiness(-10); // Punição por fugir
    endTurn();
    setScreen('BASE');
  };

  const handleVictory = () => {
    updateFamilyBusiness(hydratedCase.rewards.reputation);
    endTurn();
    setScreen('BASE');
  };

  return (
    <div className="container" style={{ flex: 1 }}>
      <header className="card" style={{ marginBottom: '2vh', background: 'rgba(139, 0, 0, 0.2)', borderColor: 'var(--accent-red)' }}>
        <h2 style={{ color: 'var(--accent-red)' }}>COMBATE: {targetMonster.name}</h2>
        <div style={{ background: '#333', width: '100%', height: '20px', borderRadius: '10px', marginTop: '1vh', overflow: 'hidden' }}>
          <div style={{ background: 'var(--accent-red)', width: `${(monsterHp / targetMonster.stats.hp) * 100}%`, height: '100%', transition: 'width 0.3s' }}></div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '0.5vh' }}>HP: {monsterHp} / {targetMonster.stats.hp}</p>
      </header>

      {monsterHp <= 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--accent-gold)' }}>VITÓRIA!</h2>
          <p>O monstro foi destruído.</p>
          <button onClick={handleVictory} style={{ padding: '5%', background: 'var(--accent-gold)', color: '#121212', border: 'none', borderRadius: '4px', fontWeight: 'bold', marginTop: '2vh', width: '100%', cursor: 'pointer' }}>
            Retornar à Base
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh', marginBottom: '2vh' }}>
            {roster.map(char => (
              <div key={char.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{char.name}</strong><br/>
                  <small>HP: {char.stats.hp.current}</small>
                </div>
                <button 
                  onClick={() => handleAttack(char)}
                  style={{ padding: '3% 5%', background: 'transparent', color: 'var(--text-light)', border: '1px solid var(--accent-gold)', borderRadius: '4px', cursor: 'pointer' }}>
                  Atacar
                </button>
              </div>
            ))}
          </div>

          <div className="card" style={{ flex: 1, overflowY: 'auto', marginBottom: '2vh', fontSize: '0.85rem' }}>
            <h3>Log de Batalha</h3>
            <ul style={{ padding: 0, listStyle: 'none', color: '#aaa', marginTop: '1vh' }}>
              {logs.map((log, i) => <li key={i} style={{ marginBottom: '1vh' }}>{log}</li>)}
            </ul>
          </div>

          <button 
            onClick={handleFlee}
            style={{ padding: '4%', background: 'transparent', color: '#888', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer' }}>
            Fugir (Custa -10% Negócio da Família)
          </button>
        </>
      )}
    </div>
  );
}
