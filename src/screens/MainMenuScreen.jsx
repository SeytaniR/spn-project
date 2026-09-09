import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/useGameStore';

export function MainMenuScreen() {
  const { t } = useTranslation();
  const startNewGame = useGameStore(state => state.startNewGame);

  return (
    <div className="card" style={{ textAlign: 'center', margin: 'auto' }}>
      <h1 style={{ color: 'var(--accent-red)', marginBottom: '4vh' }}>SUPERNATURAL<br/>ORPHANAGE</h1>
      <button 
        onClick={startNewGame}
        style={{ padding: '5%', background: '#c5a059', color: '#121212', border: 'none', borderRadius: '4px', fontSize: '1.2rem', fontWeight: 'bold', width: '100%', cursor: 'pointer' }}>
        {t('UI.START_GAME')}
      </button>
    </div>
  );
}
