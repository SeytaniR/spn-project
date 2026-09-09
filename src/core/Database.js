import charactersData from '../data/characters.json';
import itemsData from '../data/items.json';
import monstersData from '../data/monsters.json';
import traitsData from '../data/traits.json';
import casesData from '../data/cases.json';
import alliesData from '../data/allies.json';
import cluesData from '../data/clues.json';

/**
 * Core Database Service
 * Serve como um leitor relacional para os JSONs, resolvendo IDs em objetos completos.
 */
class Database {
  constructor() {
    this.db = {
      characters: charactersData,
      items: itemsData,
      monsters: monstersData,
      traits: traitsData,
      cases: casesData,
      allies: alliesData,
      clues: cluesData,
    };
  }

  // Busca item genérico por ID em qualquer tabela
  findById(tableName, id) {
    if (!this.db[tableName]) return null;
    return this.db[tableName].find(entry => entry.id === id) || null;
  }

  // Popula um personagem com seus objetos completos de Equipamentos e Traits
  getHydratedCharacter(charId) {
    const char = this.findById('characters', charId);
    if (!char) return null;

    // Criamos uma cópia para não mutar o JSON base
    const hydratedChar = { ...char };

    // Resolve as armas/kits
    hydratedChar.equipped = {
      weapon: this.findById('items', char.equipped.weapon),
      kit: this.findById('items', char.equipped.kit),
      relic: this.findById('items', char.equipped.relic),
    };

    // Resolve traits
    hydratedChar.traits = char.traits.map(traitId => this.findById('traits', traitId)).filter(Boolean);

    return hydratedChar;
  }

  // Popula um Caso com o monstro associado e as pistas completas
  getHydratedCase(caseId) {
    const cse = this.findById('cases', caseId);
    if (!cse) return null;

    const hydratedCase = { ...cse };
    hydratedCase.targetMonster = this.findById('monsters', cse.targetMonsterId);
    hydratedCase.cluesDiscoveredObjects = cse.cluesDiscovered.map(clueId => this.findById('clues', clueId));

    return hydratedCase;
  }

  // Retorna todos os personagens hidratados (prontos pra renderizar)
  getAllHydratedCharacters() {
    return this.db.characters.map(char => this.getHydratedCharacter(char.id));
  }
}

export const db = new Database();
