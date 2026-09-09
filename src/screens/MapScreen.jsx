import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { db } from '../core/Database';

export function MapScreen() {
  const { setScreen, startCase } = useGameStore();

  // Busca todos os casos da base estática para listar no mapa
  const availableCases = db.db.cases.filter(c => c.status === 'AVAILABLE');

  const handleStartCase = (caseId) => {
    startCase(caseId);
  };

  return (
    <div className="container" style={{ flex: 1 }}>
      <header className="card" style={{ marginBottom: '2vh' }}>
        <h2>Mapa dos Estados Unidos</h2>
        <p>Selecione um caso para investigar.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh', overflowY: 'auto' }}>
        {availableCases.map(cse => (
          <div key={cse.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1vh' }}>
            <h3 style={{ color: 'var(--accent-gold)' }}>{cse.title}</h3>
            <small style={{ color: '#888' }}>📍 {cse.location} | Vítimas: {cse.victims}</small>
            <p>Tempo Restante: {cse.timeLimit} turnos</p>
            <button 
              onClick={() => handleStartCase(cse.id)}
              style={{ padding: '3%', background: 'var(--accent-red)', color: 'white', border: 'none', borderRadius: '4px', marginTop: '1vh', cursor: 'pointer' }}>
              Investigar Caso
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={() => setScreen('BASE')}
        style={{ padding: '4%', background: 'transparent', color: 'var(--text-light)', border: '1px solid #555', borderRadius: '4px', fontSize: '1rem', marginTop: 'auto', cursor: 'pointer' }}>
        &larr; Voltar para a Base
      </button>
    </div>
  );
}
