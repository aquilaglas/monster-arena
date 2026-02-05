import type {
  CombatState,
  PlayerMonster,
  ArenaOpponent,
  CombatLog,
  CombatMove,
  ElementType,
} from '$lib/types';

export function initializeCombat(
  playerMonster: PlayerMonster,
  opponent: ArenaOpponent
): CombatState {
  const opponentStats = calculateMonsterStats(opponent.monster_type!, opponent.monster_level);

  return {
    playerMonster: { ...playerMonster },
    opponentMonster: {
      type: opponent.monster_type!,
      level: opponent.monster_level,
      hp: opponentStats.hp,
      max_hp: opponentStats.hp,
      attack: opponentStats.attack,
      defense: opponentStats.defense,
      speed: opponentStats.speed,
    },
    turn: playerMonster.speed >= opponentStats.speed ? 'player' : 'opponent',
    logs: [
      {
        id: crypto.randomUUID(),
        message: `Combat contre ${opponent.monster_type!.name} niveau ${opponent.monster_level} !`,
        type: 'info',
        timestamp: Date.now(),
      },
    ],
    isFinished: false,
  };
}

function calculateMonsterStats(
  monsterType: any,
  level: number
): { hp: number; attack: number; defense: number; speed: number } {
  const multiplier = 1 + (level - 1) * 0.1;
  return {
    hp: Math.floor(monsterType.base_hp * multiplier),
    attack: Math.floor(monsterType.base_attack * multiplier),
    defense: Math.floor(monsterType.base_defense * multiplier),
    speed: Math.floor(monsterType.base_speed * multiplier),
  };
}

// Pierre/Feuille/Ciseau
function getRandomMove(): CombatMove {
  const moves: CombatMove[] = ['rock', 'paper', 'scissors'];
  return moves[Math.floor(Math.random() * moves.length)];
}

function getMoveResult(playerMove: CombatMove, opponentMove: CombatMove): 'win' | 'lose' | 'draw' {
  if (playerMove === opponentMove) return 'draw';

  if (
    (playerMove === 'rock' && opponentMove === 'scissors') ||
    (playerMove === 'paper' && opponentMove === 'rock') ||
    (playerMove === 'scissors' && opponentMove === 'paper')
  ) {
    return 'win';
  }

  return 'lose';
}

const MOVE_NAMES: Record<CombatMove, string> = {
  rock: 'Pierre',
  paper: 'Feuille',
  scissors: 'Ciseaux',
};

// Système de types
const TYPE_ADVANTAGES: Record<ElementType, ElementType[]> = {
  fire: ['ice', 'wind'],
  water: ['fire', 'earth'],
  earth: ['electric', 'fire'],
  electric: ['water', 'wind'],
  ice: ['earth', 'wind'],
  wind: ['ice'],
  dark: ['light'],
  light: ['dark'],
  poison: [], // Faible bonus contre tous
  crystal: [], // Neutre mais défensif
  time: [], // Neutre
  normal: [],
};

function getTypeMultiplier(attackerType: ElementType, defenderType: ElementType): number {
  // Avantage de type
  if (TYPE_ADVANTAGES[attackerType]?.includes(defenderType)) {
    return 1.5; // +50% dégâts
  }

  // Désavantage (inversé)
  if (TYPE_ADVANTAGES[defenderType]?.includes(attackerType)) {
    return 0.75; // -25% dégâts
  }

  // Poison fait un peu plus de dégâts à tous
  if (attackerType === 'poison') {
    return 1.1;
  }

  // Crystal résiste un peu à tout
  if (defenderType === 'crystal') {
    return 0.9;
  }

  return 1.0; // Neutre
}

export function executeTurn(
    state: CombatState,
    playerMove: CombatMove
): CombatState {
    const newState = { ...state };
    const logs: CombatLog[] = [...state.logs];

    const opponentMove = getRandomMove();
    const isPlayerTurn = state.turn === "player";

    const attacker = isPlayerTurn ? newState.playerMonster : newState.opponentMonster;
    const defender = isPlayerTurn ? newState.opponentMonster : newState.playerMonster;

    // @ts-ignore
    const attackerType = (attacker.monster_type?.element_type || attacker.type?.element_type || "normal");
    // @ts-ignore
    const defenderType = (defender.monster_type?.element_type || defender.type?.element_type || "normal");

    const moveResult = getMoveResult(
        isPlayerTurn ? playerMove : opponentMove,
        isPlayerTurn ? opponentMove : playerMove
    );

    // --- LOG : choix des attaques (uniquement tour du joueur)
    if (isPlayerTurn) {
        logs.push(makeLog(
            `${newState.playerMonster.nickname} choisit ${MOVE_NAMES[playerMove]} ! ` +
            `${newState.opponentMonster.type.name} choisit ${MOVE_NAMES[opponentMove]} !`,
            "info"
        ));
    }

    const typeMultiplier = getTypeMultiplier(attackerType, defenderType);

    const speedMultiplier = shouldSpeedBoost(attacker.speed, defender.speed) ? 2 : 1;

    let moveMultiplier = getMoveMultiplier(
        moveResult,
        attacker,
        defender,
        logs,
        isPlayerTurn
    );

    let damage = calculateDamage(attacker.attack, defender.defense);
    damage = Math.floor(damage * typeMultiplier * moveMultiplier * speedMultiplier);

    // LOGS bonus type / vitesse
    pushTypeAndSpeedLogs(typeMultiplier, speedMultiplier, logs);

    // Appliquer dégâts
    defender.hp = Math.max(0, defender.hp - damage);

    logs.push(makeLog(
        // @ts-ignore
        `${attacker.nickname || attacker.type.name} inflige ${damage} dégâts !`,
        isPlayerTurn ? "attack" : "damage"
    ));

    if (defender.hp === 0) {
        newState.isFinished = true;
        newState.winner = isPlayerTurn ? "player" : "opponent";

        logs.push(makeLog(
            isPlayerTurn
                // @ts-ignore
                ? `🎉 Victoire ! ${attacker.nickname} a gagné le combat !`
                : `💀 Défaite... ${newState.playerMonster.nickname} est K.O.`,
            isPlayerTurn ? "victory" : "defeat"
        ));
    } else {
        newState.turn = isPlayerTurn ? "opponent" : "player";
    }

    newState.logs = logs;
    return newState;
}

function makeLog(message: string, type: CombatLog["type"]): CombatLog {
    return {
        id: crypto.randomUUID(),
        message,
        type,
        timestamp: Date.now(),
    };
}

function shouldSpeedBoost(attackerSpeed: number, defenderSpeed: number): boolean {
    return attackerSpeed >= defenderSpeed * 2 && Math.random() < 0.2;
}

function getMoveMultiplier(
    result: "win" | "lose" | "draw",
    attacker: any,
    defender: any,
    logs: CombatLog[],
    isPlayer: boolean
): number {
    const attackerName = attacker.nickname || attacker.type?.name;
    const defenderName = defender.nickname || defender.type?.name;

    switch (result) {
        case "win":
            logs.push(makeLog(
                `💥 COUP CRITIQUE ! ${attackerName} remporte le duel !`,
                isPlayer ? "attack" : "damage"
            ));
            return 1.5;

        case "draw":
            logs.push(makeLog(`Égalité ! Attaque normale.`, "info"));
            return 1;

        case "lose":
            if (Math.random() < 0.2) {
                logs.push(makeLog(`❌ ${attackerName} rate son attaque !`, "info"));
                return 0;
            }
            logs.push(makeLog(
                `${defenderName} remporte le duel ! Attaque${isPlayer ? "" : " adverse"} affaiblie (-25%).`,
                "info"
            ));
            return 0.75;
    }
}

function pushTypeAndSpeedLogs(
    typeMult: number,
    speedMult: number,
    logs: CombatLog[]
) {
    if (typeMult > 1) {
        logs.push(makeLog(`✨ C'est super efficace ! (x${typeMult.toFixed(1)})`, "info"));
    } else if (typeMult < 1) {
        logs.push(makeLog(`Ce n'est pas très efficace... (x${typeMult.toFixed(1)})`, "info"));
    }

    if (speedMult > 1) {
        logs.push(makeLog(`⚡ ATTAQUE ÉCLAIR ! La vitesse double les dégâts !`, "attack"));
    }
}

function calculateDamage(attack: number, defense: number): number {
  const baseDamage = attack - defense * 0.5;
  const variance = Math.random() * 0.2 + 0.9; // 90% à 110%
  return Math.max(5, Math.floor(baseDamage * variance));
}
