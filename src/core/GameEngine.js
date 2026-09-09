import { db } from './Database';

/**
 * GameEngine
 * Responsável por toda a matemática de rolagens de dados, combates e testes.
 * Nenhuma lógica de UI deve estar aqui, apenas números e retornos estruturados.
 */
class GameEngine {
  
  /**
   * Rola um teste de D100 contra um atributo.
   * Fórmula: DificuldadeBase + (Atributo * 5) + BônusFoco
   */
  static rollSkillCheck(attributeValue, difficultyBase = 30, focusSpent = 0) {
    const focusBonus = focusSpent * 20; 
    let successChance = difficultyBase + (attributeValue * 5) + focusBonus;
    
    // Limita entre 5% (Falha crítica) e 95% (Nada é 100% certo no mundo sobrenatural)
    successChance = Math.max(5, Math.min(95, successChance)); 
    
    const roll = Math.floor(Math.random() * 100) + 1; // 1 a 100
    const isSuccess = roll <= successChance;
    const isCrit = roll <= (successChance * 0.1); // 10% da margem é crítico

    return { 
      success: isSuccess, 
      crit: isCrit, 
      rollValue: roll, 
      targetChance: successChance 
    };
  }

  /**
   * Avalia os efeitos do equipamento para aplicar os multiplicadores de dano ou imunidades.
   */
  static parseEffects(character, monster) {
    let damageMultiplier = 1;
    let ignoresDefense = false;
    let attackLogs = [];

    // Hidrata o personagem para ler os efeitos reais do JSON
    const hydratedChar = db.getHydratedCharacter(character.id);
    const weaponsAndKits = [hydratedChar.equipped.weapon, hydratedChar.equipped.kit].filter(Boolean);

    weaponsAndKits.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === 'EXPLOIT_WEAKNESS') {
          // Checa se o monstro tem a fraqueza alvo da arma/kit
          if (monster.weaknesses.includes(effect.targetTag)) {
            damageMultiplier *= effect.multiplier;
            attackLogs.push(`Explorou a fraqueza! (${item.name} -> ${effect.targetTag})`);
          }
        }
        
        if (effect.type === 'IGNORE_DEFENSE') {
          ignoresDefense = true;
          attackLogs.push(`A defesa do inimigo foi anulada por ${item.name}!`);
        }
      });
    });

    return { damageMultiplier, ignoresDefense, attackLogs };
  }

  /**
   * Resolve um turno de ataque de um Personagem contra um Monstro
   */
  static resolveAttack(character, monster) {
    const hydratedChar = db.getHydratedCharacter(character.id);
    const weapon = hydratedChar.equipped.weapon;
    
    if (!weapon) {
      return { damageDealt: 0, logs: ["Personagem desarmado!"] };
    }

    // Calcula Acerto Baseado na Precisão (ou Força se for Melee, simplificando com precisão por padrão)
    const accuracyResult = this.rollSkillCheck(character.attributes.precision, 40);
    
    if (!accuracyResult.success) {
      return { damageDealt: 0, logs: ["O ataque errou o alvo!"] };
    }

    // 1. Processa Efeitos Mágicos / Fraquezas
    const effectCalc = this.parseEffects(character, monster);
    
    // 2. Cálculo do Dano Bruto
    let rawDamage = weapon.damageBase + Math.floor(character.attributes.precision / 2);
    
    // 3. Aplica Defesa (se não for ignorada)
    let finalDamage = rawDamage;
    if (!effectCalc.ignoresDefense) {
      finalDamage = Math.max(1, finalDamage - monster.stats.defense);
    }
    
    // 4. Aplica Multiplicadores (Fraquezas)
    finalDamage = Math.floor(finalDamage * effectCalc.damageMultiplier);

    const logs = [...effectCalc.attackLogs, `Ataque causou ${finalDamage} de dano! (Rolagem: ${accuracyResult.rollValue}/${accuracyResult.targetChance}%)`];

    return {
      damageDealt: finalDamage,
      logs: logs
    };
  }
}

export default GameEngine;
