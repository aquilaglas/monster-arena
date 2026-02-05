<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import StatBar from '$lib/components/StatBar.svelte';
  import { gameState, updateMoney } from '$lib/stores/game.svelte';
  import { initializeCombat, executeTurn } from '$lib/game/combat.client';
  import type { ArenaOpponent, CombatState, CombatMove } from '$lib/types';

  let opponent = $state<ArenaOpponent | null>(null);
  let nextOpponents = $state<ArenaOpponent[]>([]);
  let combatState = $state<CombatState | null>(null);
  let isLoading = $state(true);
  let selectedLevel = $state<number>(1);
  let isReplay = $state(false);

  onMount(async () => {
    selectedLevel = gameState.player?.current_arena_level || 1;
    await loadOpponent();
    await loadNextOpponents();
    isLoading = false;
  });

  async function loadOpponent() {
    const res = await fetch(
      `/api/arena/opponent?level=${selectedLevel}`
    );
    const data = await res.json();
    opponent = data.opponent;
    // C'est un replay si le niveau sélectionné est inférieur au niveau actuel
    isReplay = selectedLevel < (gameState.player?.current_arena_level || 1);
  }

  async function loadNextOpponents() {
    const res = await fetch(
      `/api/arena/opponent?level=${gameState.player?.current_arena_level || 1}&next=true`
    );
    const data = await res.json();
    nextOpponents = data.opponents;
  }

  async function changeLevel(newLevel: number) {
    selectedLevel = newLevel;
    await loadOpponent();
  }

  function startCombat() {
    if (!gameState.activeMonster || !opponent) return;

    // Vérifier si le monstre est en entraînement
    if (gameState.activeMonster.is_training) {
      alert('Votre monstre est en entraînement ! Attendez qu\'il termine.');
      return;
    }

    combatState = initializeCombat(gameState.activeMonster, opponent);
  }

  function attack(move: CombatMove) {
    if (!combatState || combatState.isFinished || combatState.turn !== 'player') return;

    combatState = executeTurn(combatState, move);

    if (!combatState.isFinished && combatState.turn === 'opponent') {
      setTimeout(() => {
        if (combatState) {
          // L'adversaire attaque automatiquement avec un choix aléatoire
          const opponentMove: CombatMove = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)] as CombatMove;
          combatState = executeTurn(combatState, opponentMove);
        }
      }, 1500);
    }
  }

  async function finishCombat() {
    if (!combatState || !opponent) return;

    const won = combatState.winner === 'player';
    // Si c'est un replay, récompense à 50%
    const rewardMultiplier = isReplay ? 0.5 : 1;
    const moneyEarned = won ? Math.floor(opponent.reward_money * rewardMultiplier) : 0;
    const experienceGained = won ? opponent.monster_level * 50 : 0;

    await fetch('/api/combat/result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerMonsterId: gameState.activeMonster?.id,
        arenaLevel: opponent.level,
        opponentTypeId: opponent.monster_type_id,
        won,
        moneyEarned,
        experienceGained,
        isReplay,
      }),
    });

    if (won) {
      updateMoney(moneyEarned);
      // Ne faire progresser le niveau d'arène que si ce n'est pas un replay
      if (gameState.player && !isReplay) {
        gameState.player.current_arena_level = opponent.level + 1;
      }
    }

    combatState = null;
    await loadOpponent();
    await loadNextOpponents();
  }
</script>

<svelte:head>
  <title>Monster Arena - Arène</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
  <div class="mb-4">
    <Button onclick={() => goto('/')} variant="secondary">← Retour</Button>
  </div>

  {#if isLoading}
    <p class="text-white pixel-text">Chargement...</p>
  {:else if !gameState.activeMonster}
    <Card title="Aucun monstre actif">
      <p class="pixel-text">Vous devez sélectionner un monstre actif pour combattre.</p>
      <div class="mt-4">
        <Button onclick={() => goto('/monsters')}>Mes Monstres</Button>
      </div>
    </Card>
  {:else if combatState}
    <Card title="Combat en cours">
      <div class="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 class="pixel-text mb-4">Votre monstre</h3>
          <div class="retro-animation">
            <img
              src={combatState.playerMonster.monster_type?.image_url || '/monsters/placeholder.png'}
              alt={combatState.playerMonster.nickname}
              class="w-full h-48 object-contain mb-4 bg-gray-200 border-4 border-black {combatState.turn === 'player' ? 'ring-4 ring-accent' : ''}"
            />
          </div>
          <h4 class="pixel-text font-bold mb-2">{combatState.playerMonster.nickname}</h4>
          <StatBar
            label="PV"
            current={combatState.playerMonster.hp}
            max={combatState.playerMonster.max_hp}
            color="bg-green-500"
          />
        </div>

        <div>
          <h3 class="pixel-text mb-4">Adversaire</h3>
          <div class="retro-animation">
            <img
              src={combatState.opponentMonster.type.image_url || '/monsters/placeholder.png'}
              alt={combatState.opponentMonster.type.name}
              class="w-full h-48 object-contain mb-4 bg-gray-200 border-4 border-black {combatState.turn === 'opponent' ? 'ring-4 ring-primary' : ''}"
            />
          </div>
          <h4 class="pixel-text font-bold mb-2">
            {combatState.opponentMonster.type.name} (Niv. {combatState.opponentMonster.level})
          </h4>
          <StatBar
            label="PV"
            current={combatState.opponentMonster.hp}
            max={combatState.opponentMonster.max_hp}
            color="bg-red-500"
          />
        </div>
      </div>

      <div class="bg-dark border-4 border-black p-4 mb-4 h-48 overflow-y-auto">
        {#each combatState.logs as log}
          <p class="pixel-text text-xs mb-1 {log.type === 'victory' ? 'text-green-400' : log.type === 'defeat' ? 'text-red-400' : 'text-white'}">
            {log.message}
          </p>
        {/each}
      </div>

      {#if combatState.isFinished}
        <Button onclick={finishCombat}>
          {combatState.winner === 'player' ? '🎉 Continuer' : '😢 Réessayer'}
        </Button>
      {:else}
        <div class="space-y-2">
          <p class="pixel-text text-xs text-white mb-2">
            {combatState.turn === 'player' ? 'Choisissez votre attaque !' : 'L\'adversaire réfléchit...'}
          </p>
          <div class="grid grid-cols-3 gap-4">
            <Button
              onclick={() => attack('rock')}
              disabled={combatState.turn === 'opponent'}
            >
              🪨<br/>Pierre
            </Button>
            <Button
              onclick={() => attack('paper')}
              disabled={combatState.turn === 'opponent'}
              variant="secondary"
            >
              📄<br/>Feuille
            </Button>
            <Button
              onclick={() => attack('scissors')}
              disabled={combatState.turn === 'opponent'}
              variant="danger"
            >
              ✂️<br/>Ciseaux
            </Button>
          </div>
        </div>
      {/if}
    </Card>
  {:else if opponent}
    <!-- Sélecteur de niveau d'arène -->
    <div class="mb-6">
      <Card title="Sélection du niveau">
        <div class="flex items-center gap-2 mb-2">
          <Button
            onclick={() => changeLevel(Math.max(1, selectedLevel - 1))}
            disabled={selectedLevel <= 1}
            variant="secondary"
          >
            ◀
          </Button>
          <div class="flex-1 text-center">
            <p class="pixel-text text-lg font-bold">
              Niveau {selectedLevel}
              {#if isReplay}
                <span class="text-yellow-600">⟲ REPLAY</span>
              {/if}
            </p>
            <p class="pixel-text text-xs text-gray-600">
              Niveau actuel: {gameState.player?.current_arena_level || 1}
            </p>
          </div>
          <Button
            onclick={() => changeLevel(Math.min(gameState.player?.current_arena_level || 1, selectedLevel + 1))}
            disabled={selectedLevel >= (gameState.player?.current_arena_level || 1)}
            variant="secondary"
          >
            ▶
          </Button>
        </div>
        {#if isReplay}
          <div class="p-2 bg-yellow-100 border-2 border-yellow-600">
            <p class="pixel-text text-xs text-yellow-800">
              💰 Récompense réduite à 50% pour les niveaux déjà battus
            </p>
          </div>
        {/if}
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card title={isReplay ? 'Adversaire (Replay)' : 'Prochain adversaire'}>
        <div class="retro-animation">
          <img
            src={opponent.monster_type?.image_url || '/monsters/placeholder.png'}
            alt={opponent.monster_type?.name}
            class="w-full h-64 object-contain mb-4 bg-gray-200 border-4 border-black"
          />
        </div>
        <h3 class="pixel-text text-xl font-bold mb-2">
          {opponent.monster_type?.name}
          {#if opponent.is_boss}
            <span class="text-primary">👑 BOSS</span>
          {/if}
        </h3>
        <p class="pixel-text text-sm mb-4">Niveau {opponent.monster_level}</p>
        <p class="pixel-text text-sm mb-4">
          Récompense:
          {#if isReplay}
            <span class="text-yellow-600">{Math.floor(opponent.reward_money * 0.5)}€ (50%)</span>
            <span class="text-gray-400 line-through text-xs">{opponent.reward_money}€</span>
          {:else}
            {opponent.reward_money}€
          {/if}
        </p>

        {#if gameState.activeMonster?.is_training}
          <div class="mb-4 p-3 bg-red-100 border-4 border-red-500">
            <p class="pixel-text text-xs text-red-800">
              ⚠️ Votre monstre est en entraînement ! Attendez qu'il termine avant de combattre.
            </p>
          </div>
        {/if}

        <Button onclick={startCombat} disabled={gameState.activeMonster?.is_training}>
          ⚔️ Combattre !
        </Button>
      </Card>

      <Card title="Prochains adversaires">
        <div class="space-y-2">
          {#each nextOpponents as next, i}
            <div class="flex justify-between items-center p-2 bg-white border-2 border-black">
              <span class="pixel-text text-xs">
                Niv. {next.level}: {next.monster_type_name}
                {#if next.is_boss}👑{/if}
              </span>
              <span class="pixel-text text-xs text-green-600">{next.reward_money}€</span>
            </div>
          {/each}
        </div>
      </Card>
    </div>
  {/if}
</div>
