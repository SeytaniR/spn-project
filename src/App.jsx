import { useTranslation } from 'react-i18next'
import './App.css'
import characters from './data/characters.json'

function App() {
  const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'pt' ? 'en' : 'pt')
  }

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Supernatural Orphanage</h1>
        <button onClick={toggleLanguage} style={{ padding: '2%', background: 'transparent', color: '#c5a059', border: '1px solid #c5a059' }}>
          {i18n.language.toUpperCase()}
        </button>
      </header>

      <section className="card">
        <h2>{t('UI.ROSTER')}</h2>
        <ul style={{ listStyleType: 'none', marginTop: '2vh' }}>
          {characters.map(char => (
            <li key={char.id} style={{ marginBottom: '1vh', borderBottom: '1px dotted #333', paddingBottom: '1vh' }}>
              <strong>{char.name}</strong> <br/>
              <small>{t('UI.ENGAGEMENT')}: {char.engagement}% | {t('UI.HP')}: {char.stats.hp.current}/{char.stats.hp.max}</small>
            </li>
          ))}
        </ul>
      </section>

      <button style={{ padding: '5%', marginTop: 'auto', background: '#8b0000', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1.2rem', fontWeight: 'bold' }}>
        {t('UI.START_GAME')}
      </button>
    </div>
  )
}

export default App
