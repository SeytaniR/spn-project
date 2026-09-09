import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/useGameStore';
import { db } from '../core/Database';

export function BaseScreen() {
  const { t } = useTranslation();
  const { familyBusiness, turn, roster, setScreen, inventory, equipItem } = useGameStore();
  const [equipModal, setEquipModal] = useState(null); // { charId, slot }

  const handleEquip = (itemId) => {
    equipItem(equipModal.charId, equipModal.slot, itemId);
    setEquipModal(null);
  };

  return (
    <div className="container" style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
      {equipModal && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10, padding: '5%' }}>
          <h3 style={{ color: 'var(--accent-gold)' }}>{t('UI.CHANGE_EQUIPMENT')} ({equipModal.slot})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1vh', marginTop: '2vh' }}>
            <button onClick={() => handleEquip(null)} style={{ padding: '3%', background: 'transparent', color: '#888', border: '1px solid #555' }}>
              {t('UI.UNEQUIP')}
            </button>
            {/* Lista os itens do inventário dependendo do slot selecionado */}
            {inventory[equipModal.slot === 'weapon' ? 'weapons' : equipModal.slot === 'kit' ? 'kits' : 'relics'].map(itemId => {
              const item = db.findById('items', itemId);
              return (
                <button key={itemId} onClick={() => handleEquip(itemId)} style={{ padding: '3%', background: '#333', color: 'white', border: 'none' }}>
                  {item.name}
                </button>
              )
            })}
            <button onClick={() => setEquipModal(null)} style={{ padding: '3%', marginTop: '2vh', background: 'var(--accent-red)', color: 'white', border: 'none' }}>Cancelar</button>
          </div>
        </div>
      )}

      <header className="card" style={{ marginBottom: '2vh', background: 'var(--accent-red)', color: 'white', borderColor: 'var(--accent-red)' }}>
        <h2>{t('UI.ROSTER')} (Base)</h2>
        <p>{t('UI.TURN')}: {turn} | {t('UI.FAMILY_BUSINESS')}: {familyBusiness}%</p>
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
                  style={{ width: '20vw', maxWidth: '80px', height: '20vw', maxHeight: '80px', borderRadius: '4px', objectFit: 'cover' }} 
                />
                
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '1.2rem', color: 'var(--accent-gold)' }}>{char.name}</strong> <br/>
                  <small>{t('UI.ENGAGEMENT')}: {char.engagement}% | {t('UI.HP')}: {char.stats.hp.current}/{char.stats.hp.max}</small>
                  
                  <div style={{ marginTop: '1vh', fontSize: '0.85rem', color: '#888', display: 'flex', flexDirection: 'column', gap: '0.5vh' }}>
                    <div onClick={() => setEquipModal({ charId: char.id, slot: 'weapon'})} style={{ cursor: 'pointer', background: '#222', padding: '2%', borderRadius: '4px' }}>
                      {t('UI.WEAPON')}: {hydrated.equipped.weapon ? hydrated.equipped.weapon.name : t('UI.NONE')}
                    </div>
                    <div onClick={() => setEquipModal({ charId: char.id, slot: 'kit'})} style={{ cursor: 'pointer', background: '#222', padding: '2%', borderRadius: '4px' }}>
                      {t('UI.KIT')}: {hydrated.equipped.kit ? hydrated.equipped.kit.name : t('UI.NONE')}
                    </div>
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
        {t('UI.GO_TO_MAP')}
      </button>
    </div>
  );
}
