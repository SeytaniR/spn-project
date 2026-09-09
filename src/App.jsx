import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from './store/useGameStore';
import { MainMenuScreen } from './screens/MainMenuScreen';
import { BaseScreen } from './screens/BaseScreen';
import { MapScreen } from './screens/MapScreen';
import { InvestigationScreen } from './screens/InvestigationScreen';
import { CombatScreen } from './screens/CombatScreen';

import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const { currentScreen, isGameStarted, roster, sealsProtected, desertedMembers } = useGameStore();
  const [popup, setPopup] = useState(null);
  const { turn, endTurn, updateFamilyBusiness, setScreen, activeCaseId } = useGameStore();

  // Monitora deserções, Game Over globais ou Eventos
  useEffect(() => {
    if (isGameStarted && roster.length === 0) {
      setPopup('GAME_OVER');
    } else if (isGameStarted && sealsProtected >= 88) {
      setPopup('VICTORY');
    } else if (isGameStarted && turn > 1 && turn % 5 === 0 && currentScreen === 'INVESTIGATION') {
      // Evento de aliado interrompendo caso
      setPopup('ALLY_EVENT');
    }
  }, [roster.length, isGameStarted, sealsProtected, turn]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'pt' ? 'en' : 'pt');
  };

  const handleAllyAccept = () => {
    // Cancela o caso, prejudica Z% mas ganha favor
    updateFamilyBusiness(-15);
    endTurn();
    setScreen('BASE');
    setPopup(null);
  };

  const handleAllyDecline = () => {
    // Ignora o aliado, perde favor mas continua caso
    setPopup(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'MAIN_MENU': return <MainMenuScreen />;
      case 'BASE': return <BaseScreen />;
      case 'MAP': return <MapScreen />;
      case 'INVESTIGATION': return <InvestigationScreen />;
      case 'COMBAT': return <CombatScreen />;
      default: return <MainMenuScreen />;
    }
  };

  const renderPopup = () => {
    if (popup === 'GAME_OVER') {
      return (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="card" style={{ width: '90%', textAlign: 'center' }}>
            <h1 style={{ color: 'var(--accent-red)' }}>{t('UI.GAME_OVER')}</h1>
            <p>{t('UI.ORPHANAGE_EMPTY')}</p>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ padding: '5%', background: '#c5a059', color: '#121212', marginTop: '2vh', fontWeight: 'bold' }}>Restart</button>
          </div>
        </div>
      );
    }
    if (popup === 'VICTORY') {
      return (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="card" style={{ width: '90%', textAlign: 'center' }}>
            <h1 style={{ color: 'var(--accent-gold)' }}>VITÓRIA!</h1>
            <p>{t('UI.SEALS')}: {sealsProtected}/88</p>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ padding: '5%', background: '#c5a059', color: '#121212', marginTop: '2vh', fontWeight: 'bold' }}>Play Again</button>
          </div>
        </div>
      );
    }
    if (popup === 'ALLY_EVENT') {
      return (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="card" style={{ width: '90%', textAlign: 'center', background: '#222' }}>
            <h2 style={{ color: 'var(--accent-gold)' }}>{t('UI.ALLY_REQUEST')}</h2>
            <p style={{ marginTop: '1vh' }}>Um caçador aliado pediu ajuda urgente. Se aceitar, você precisará abandonar o caso atual (o monstro fará mais vítimas).</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2vh' }}>
              <button onClick={handleAllyDecline} style={{ flex: 1, padding: '3%', background: 'transparent', color: '#888', border: '1px solid #555' }}>{t('UI.DECLINE')}</button>
              <button onClick={handleAllyAccept} style={{ flex: 1, padding: '3%', background: 'var(--accent-red)', color: 'white', border: 'none', marginLeft: '1vh' }}>{t('UI.ACCEPT')}</button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 100 }}>
        <button onClick={toggleLanguage} style={{ padding: '8px', background: 'transparent', color: '#c5a059', border: '1px solid #c5a059', cursor: 'pointer', borderRadius: '4px' }}>
          {i18n.language.toUpperCase()}
        </button>
      </div>
      {renderPopup()}
      {renderScreen()}
    </>
  );
}

export default App;
