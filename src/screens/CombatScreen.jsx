import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/useGameStore';
import { db } from '../core/Database';
import GameEngine from '../core/GameEngine';

export function CombatScreen() {
  const { t } = useTranslation();
  const { activeCaseId, activeMapCases, roster, setScreen, endTurn, updateFamilyBusiness } = useGameStore();
  
  const rawCase = activeMapCases.find(c => c.id === activeCaseId);
  const hydratedCase = db.getHydratedCase(rawCase);
  const targetMonster = hydratedCase ? hydratedCase.targetMonster : null;
  
  const [monsterHp, setMonsterHp] = useState(targetMonster ? targetMonster.stats.hp : 0);
  const [logs, setLogs] = useState([`Um ${targetMonster.name} apareceu!`]);

  const handleAttack = (character) => {
    // Personagem ataca monstro
    const result = GameEngine.resolveAttack(character, targetMonster);
    const newMonsterHp = Math.max(0, monsterHp - result.damageDealt);
    setMonsterHp(newMonsterHp);
    
    let currentLogs = [...result.logs, ...logs];

    if (newMonsterHp > 0) {
      // Monstro ataca de volta um alvo aleatório
      const targetChar = roster[Math.floor(Math.random() * roster.length)];
      const mDmg = Math.max(1, targetMonster.stats.damage - Math.floor(targetChar.attributes.dexterity / 2));
      
      useGameStore.getState().updateCharacterStats(targetChar.id, {
        hp: { ...targetChar.stats.hp, current: Math.max(0, targetChar.stats.hp.current - mDmg) }
      });
      currentLogs = [`${targetMonster.name} atacou ${targetChar.name} causando ${mDmg} de dano!`, ...currentLogs];
      
      if (targetChar.stats.hp.current - mDmg <= 0) {
        useGameStore.getState().killCharacter(targetChar.id);
        currentLogs = [`[MORTE] ${targetChar.name} foi morto em combate!`, ...currentLogs];
      }
    }
    
    setLogs(currentLogs);
  };

  const handleFlee = () => {
    updateFamilyBusiness(-10);
    endTurn(); // Fleeing finishes the hunt -> 1 turn passes
    setScreen('BASE');
  };

  const handleVictory = () => {
    updateFamilyBusiness(hydratedCase.rewards.reputation);
    useGameStore.getState().registerMonsterKill(targetMonster.id.replace('_alpha', '')); // Registra morte para gerar alfa
    endTurn(); // Victory finishes the hunt -> 1 turn passes
    setScreen('BASE');
  };

  return (
    <div className="container" style={{ flex: 1 }}>
      <header className="card" style={{ marginBottom: '2vh', background: 'rgba(139, 0, 0, 0.2)', borderColor: 'var(--accent-red)' }}>
        <h2 style={{ color: 'var(--accent-red)' }}>{t('UI.COMBAT_TITLE')}: {targetMonster.name}</h2>
        <div style={{ background: '#333', width: '100%', height: '20px', borderRadius: '10px', marginTop: '1vh', overflow: 'hidden' }}>
          <div style={{ background: 'var(--accent-red)', width: `${(monsterHp / targetMonster.stats.hp) * 100}%`, height: '100%', transition: 'width 0.3s' }}></div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '0.5vh' }}>{t('UI.HP')}: {monsterHp} / {targetMonster.stats.hp}</p>
      </header>

      {monsterHp <= 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--accent-gold)' }}>{t('UI.VICTORY')}</h2>
          <p>{t('UI.MONSTER_DESTROYED')}</p>
          <button onClick={handleVictory} style={{ padding: '5%', background: 'var(--accent-gold)', color: '#121212', border: 'none', borderRadius: '4px', fontWeight: 'bold', marginTop: '2vh', width: '100%', cursor: 'pointer' }}>
            {t('UI.RETURN_BASE')}
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh', marginBottom: '2vh' }}>
            {roster.map(char => (
              <div key={char.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{char.name}</strong><br/>
                  <small>{t('UI.HP')}: {char.stats.hp.current}</small>
                </div>
                <button 
                  onClick={() => handleAttack(char)}
                  style={{ padding: '3% 5%', background: 'transparent', color: 'var(--text-light)', border: '1px solid var(--accent-gold)', borderRadius: '4px', cursor: 'pointer' }}>
                  {t('UI.ATTACK')}
                </button>
              </div>
            ))}
          </div>

          <div className="card" style={{ flex: 1, overflowY: 'auto', marginBottom: '2vh', fontSize: '0.85rem' }}>
            <h3>{t('UI.BATTLE_LOG')}</h3>
            <ul style={{ padding: 0, listStyle: 'none', color: '#aaa', marginTop: '1vh' }}>
              {logs.map((log, i) => <li key={i} style={{ marginBottom: '1vh' }}>{log}</li>)}
            </ul>
          </div>

          <button 
            onClick={handleFlee}
            style={{ padding: '4%', background: 'transparent', color: '#888', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer' }}>
            {t('UI.FLEE_COST')}
          </button>
        </>
      )}
    </div>
  );
}
