# SPN Web Game - AI Agent Guidelines

Este documento contém as regras estritas de arquitetura e design do jogo. Qualquer Inteligência Artificial auxiliando neste repositório deve ler e seguir estas diretrizes ao escrever ou refatorar código.

## 1. Arquitetura Orientada a Dados (Data-Driven JSONs)
O coração do jogo está nos arquivos `.json` em `src/data/`. O código em React/JS é apenas um "leitor" e "executor" de regras.
NÃO FAÇA "Hardcode" de regras de jogo na UI (ex: `if (monster.name === 'Wendigo')`). 
Sempre verifique as `tags` e `effects` nos JSONs para criar dinâmicas que escalam (ex: `if (weapon.tags.includes(monster.weakness))`).

## 2. Tecnologias Permitidas
- **Frontend**: React (Vite).
- **Módulos**: ES6 Modules nativo (`import`/`export`).
- **Padrão de Componentes**: Functional Components com Hooks.
- **Tradução**: `i18next` e `react-i18next`. O jogo deve ter suporte nativo a PT-BR e EN. Textos fixos não são permitidos nos componentes (use `t("CHAVE")`).

## 3. UI: Mobile-First e CSS Fluido
Todo CSS/estilo deve usar porcentagens (`%`), `vw`, `vh`, `flex` ou `grid`. A interface vai rodar principalmente em celulares, então os componentes (Cards, HUD, Mapas) devem se autoajustar.
Não utilize medidas fixas em `px` que quebrem em telas menores.

## 4. O "Negócio da Família" (Z%) e Engajamento
A progressão é medida pelo sucesso das missões (Z%) e o quão felizes e ativos os membros do orfanato estão (Engajamento).
A perda de membros por deserção ou morte permanente é uma mecânica principal.

## 5. Estrutura ECS (Entity Component System) - Simplificada
As "entidades" do jogo são os Órfãos (Roster).
Os "componentes" são as Traits (Cicatrizes, Poderes, itens equipados).
Os "sistemas" são as funções (ex: `resolveCombatTurn`, `rollSkillCheck`) que leem as entidades e os componentes, processando as regras a partir dos dados do JSON.

> **Nunca modifique este arquivo sem a autorização expressa do usuário final.**
