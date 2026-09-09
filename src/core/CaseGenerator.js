import { db } from './Database';

class CaseGenerator {
  static generateCases(monsterKills) {
    const availableMonsters = db.db.monsters.filter(m => m.tier === 'COMMON');
    const alphaMonsters = db.db.monsters.filter(m => m.tier === 'ALPHA');
    
    let generatedCases = [];

    // Gerar 3 casos comuns aleatórios
    for (let i = 0; i < 3; i++) {
      const monster = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
      generatedCases.push({
        id: `proc_case_${Date.now()}_${i}`,
        title: `Ataque Suspeito em Cidade ${i+1}`, // Could use a real city list array
        image: "/images/cases/default.png",
        location: `Cidade ${i+1}, EUA`,
        timeLimit: Math.floor(Math.random() * 3) + 3, // 3 to 5
        status: "AVAILABLE",
        targetMonsterId: monster.id,
        cluesDiscovered: [],
        victims: Math.floor(Math.random() * 3),
        rewards: {
          xp: 200 + Math.floor(Math.random() * 100),
          reputation: 10 + Math.floor(Math.random() * 10),
          loot: []
        }
      });
    }

    // Checar Alfas baseados no contador de mortes
    alphaMonsters.forEach(alpha => {
      // Pega o monstro base do alfa (ex: "weak_silver" tag check ou nome parecido)
      // Simplificando: vamos pegar a string do monstro base. Lobisomem Alfa requer 20 Lobisomens normais
      const baseMonsterId = alpha.id.replace('_alpha', '');
      const kills = monsterKills[baseMonsterId] || 0;
      
      if (kills >= alpha.killCountForSpawn) {
        generatedCases.push({
          id: `proc_alpha_${alpha.id}_${Date.now()}`,
          title: `Covil do ${alpha.name}`,
          image: "/images/cases/alpha_den.png",
          location: `Desconhecido`,
          timeLimit: 10,
          status: "AVAILABLE",
          targetMonsterId: alpha.id,
          cluesDiscovered: [],
          victims: 5,
          rewards: {
            xp: 1000,
            reputation: 30,
            loot: [] // Poderia dropar relíquia aqui
          }
        });
      }
    });

    return generatedCases;
  }
}

export default CaseGenerator;
