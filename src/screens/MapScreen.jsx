import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/useGameStore';
import CaseGenerator from '../core/CaseGenerator';

export function MapScreen() {
  const { t } = useTranslation();
  const { setScreen, startCaseWithApproach, activeMapCases, generateMapCases, monsterKills } = useGameStore();
  const [selectedCaseId, setSelectedCaseId] = useState(null);

  const handleGenerateCases = () => {
    const newCases = CaseGenerator.generateCases(monsterKills);
    generateMapCases(newCases);
  };

  const confirmApproach = (apAmmount) => {
    if (selectedCaseId) {
      startCaseWithApproach(selectedCaseId, apAmmount);
    }
  };

  return (
    <div className="container" style={{ flex: 1, position: 'relative' }}>
      {selectedCaseId && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="card" style={{ width: '90%', background: '#1a1a1a' }}>
            <h3 style={{ color: 'var(--accent-gold)' }}>{t('UI.SELECT_APPROACH')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh', marginTop: '2vh' }}>
              <button onClick={() => confirmApproach(10)} style={{ padding: '4%', background: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>{t('UI.APPROACH_CALM')}</button>
              <button onClick={() => confirmApproach(5)} style={{ padding: '4%', background: '#333', color: 'white', border: 'none', cursor: 'pointer' }}>{t('UI.APPROACH_FAST')}</button>
              <button onClick={() => confirmApproach(0)} style={{ padding: '4%', background: 'var(--accent-red)', color: 'white', border: 'none', cursor: 'pointer' }}>{t('UI.APPROACH_DIRECT')}</button>
              <button onClick={() => setSelectedCaseId(null)} style={{ padding: '2%', background: 'transparent', color: '#888', border: 'none', cursor: 'pointer', marginTop: '1vh' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <header className="card" style={{ marginBottom: '2vh' }}>
        <h2>{t('UI.USA_MAP')}</h2>
        <p>{t('UI.SELECT_CASE')}</p>
        <button onClick={handleGenerateCases} style={{ padding: '2%', background: '#c5a059', color: '#121212', border: 'none', borderRadius: '4px', marginTop: '1vh', cursor: 'pointer', fontWeight: 'bold' }}>
          Gerar Novos Casos
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh', overflowY: 'auto' }}>
        {activeMapCases.map(cse => (
          <div key={cse.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
            <h3 style={{ color: 'var(--accent-gold)' }}>{cse.title}</h3>
            <small style={{ color: '#888' }}>📍 {cse.location} | {t('UI.VICTIMS')}: {cse.victims}</small>
            <p>{t('UI.TIME_LEFT')}: {cse.timeLimit} {t('UI.TURN')}s</p>
            <button 
              onClick={() => setSelectedCaseId(cse.id)}
              style={{ padding: '3%', background: 'var(--accent-red)', color: 'white', border: 'none', borderRadius: '4px', marginTop: '1vh', cursor: 'pointer' }}>
              {t('UI.INVESTIGATE_CASE')}
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={() => setScreen('BASE')}
        style={{ padding: '4%', background: 'transparent', color: 'var(--text-light)', border: '1px solid #555', borderRadius: '4px', fontSize: '1rem', marginTop: 'auto', cursor: 'pointer' }}>
        {t('UI.BACK_TO_BASE')}
      </button>
    </div>
  );
}
