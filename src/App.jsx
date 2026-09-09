import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from './store/useGameStore';
import { MainMenuScreen } from './screens/MainMenuScreen';
import { BaseScreen } from './screens/BaseScreen';
import { MapScreen } from './screens/MapScreen';
import { InvestigationScreen } from './screens/InvestigationScreen';
import { CombatScreen } from './screens/CombatScreen';

import './App.css';

function App() {
  const { i18n } = useTranslation();
  const currentScreen = useGameStore(state => state.currentScreen);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'pt' ? 'en' : 'pt');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'MAIN_MENU':
        return <MainMenuScreen />;
      case 'BASE':
        return <BaseScreen />;
      case 'MAP':
        return <MapScreen />;
      case 'INVESTIGATION':
        return <InvestigationScreen />;
      case 'COMBAT':
        return <CombatScreen />;
      default:
        return <MainMenuScreen />;
    }
  };

  return (
    <>
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 100 }}>
        <button onClick={toggleLanguage} style={{ padding: '8px', background: 'transparent', color: '#c5a059', border: '1px solid #c5a059', cursor: 'pointer', borderRadius: '4px' }}>
          {i18n.language.toUpperCase()}
        </button>
      </div>
      {renderScreen()}
    </>
  );
}

export default App;
