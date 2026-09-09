import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/useGameStore';
import { db } from '../core/Database';

export function BaseScreen() {
  const { t } = useTranslation();
  const { familyBusiness, turn, roster, setScreen } = useGameStore();

  return (
    <div className="container" style={{ flex: 1, overflowY: 'auto' }}>
      <header className="card" style={{ marginBottom: '2vh', background: 'var(--accent-red)', color: 'white', borderColor: 'var(--accent-red)' }}>
        <h2>Orfanato (Base)</h2>
        <p>Turno: {turn} | {t('UI.FAMILY_BUSINESS')}: {familyBusiness}%</p>
      </header>

      <section className="card">
        <h3>{t('UI.ROSTER')}</h3>
        <ul style={{ listStyleType: 'none', marginTop: '2vh', padding: 0 }}>
          {roster.map(char => {
            const hydrated = db.getHydratedCharacter(char.id);
            return (
              <li key={char.id} style={{ display: 'flex', gap: '4%', marginBottom: '2vh', borderBottom: '1px dotted #333', paddingBottom: '2vh' }}>
                <img 
                  src={char.image || 'https://via.placeholder.com/80?text=IMG'} 
                  alt={char.name} 
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=IMG' }}
                  style={{ width: '80px', height: '80px', borderRadius: '4px', objectFit: 'cover' }} 
                />
                
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--accent-gold)' }}>{char.name}</strong> <br/>
                  <small>{t('UI.ENGAGEMENT')}: {char.engagement}% | {t('UI.HP')}: {char.stats.hp.current}/{char.stats.hp.max}</small>
                  
                  <div style={{ marginTop: '1vh', fontSize: '0.85rem', color: '#888' }}>
                    Arma: {hydrated.equipped.weapon ? hydrated.equipped.weapon.name : 'Nenhuma'} <br/>
                    Kit: {hydrated.equipped.kit ? hydrated.equipped.kit.name : 'Nenhum'}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <button 
        onClick={() => setScreen('MAP')}
        style={{ padding: '5%', background: 'transparent', color: 'var(--text-light)', border: '1px solid var(--accent-gold)', borderRadius: '4px', fontSize: '1.2rem', fontWeight: 'bold', marginTop: 'auto', cursor: 'pointer' }}>
        Ir para o Mapa &rarr;
      </button>
    </div>
  );
}
