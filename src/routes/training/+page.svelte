<script lang="ts">
  import { onMount } from 'svelte';
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import MonsterCard from '$lib/components/MonsterCard.svelte';
  import { gameState, updateMoney, setActiveMonster } from '$lib/stores/game.svelte';
  import { TRAINING_OPTIONS } from '$lib/game/training';
  import type { PlayerMonster } from '$lib/types';

  let isLoading = $state(true);
  let message = $state('');

  onMount(() => {
    isLoading = false;
  });

  async function train(stat: string, cost: number, improvement: number) {
    if (!gameState.activeMonster || !gameState.player) return;

    if (gameState.player.money < cost) {
      message = "Pas assez d'argent !";
      setTimeout(() => (message = ''), 3000);
      return;
    }

    const res = await fetch('/api/training', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        monsterId: gameState.activeMonster.id,
        stat,
        cost,
        improvement,
      }),
    });

    if (res.ok) {
      updateMoney(-cost);
      if (stat === 'hp') {
        gameState.activeMonster.max_hp += improvement;
        gameState.activeMonster.hp += improvement;
      } else {
        (gameState.activeMonster as any)[stat] += improvement;
      }
      gameState.activeMonster.training_count++;

      message = `Entraînement réussi ! +${improvement} ${stat.toUpperCase()}`;
      setTimeout(() => (message = ''), 3000);

      // Refresh active monster
      const monsterRes = await fetch('/api/player/active-monster');
      const monsterData = await monsterRes.json();
      setActiveMonster(monsterData.monster);
    } else {
      message = "Échec de l'entraînement";
      setTimeout(() => (message = ''), 3000);
    }
  }
</script>

<svelte:head>
  <title>Monster Arena - Entraînement</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
  <div class="mb-4">
    <Button onclick={() => (window.location.href = '/')} variant="secondary">← Retour</Button>
  </div>

  {#if message}
    <div class="mb-4 p-4 bg-accent border-4 border-black">
      <p class="pixel-text text-dark">{message}</p>
    </div>
  {/if}

  {#if !gameState.activeMonster}
    <Card title="Aucun monstre actif">
      <p class="pixel-text">Vous devez sélectionner un monstre actif pour l'entraîner.</p>
      <div class="mt-4">
        <Button onclick={() => (window.location.href = '/monsters')}>Mes Monstres</Button>
      </div>
    </Card>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <Card title="Monstre actif">
          <MonsterCard monster={gameState.activeMonster} />
          <div class="mt-4 p-2 bg-secondary border-2 border-black">
            <p class="pixel-text text-xs text-dark">
              Entraînements effectués: {gameState.activeMonster.training_count}
            </p>
          </div>
        </Card>
      </div>

      <Card title="Options d'entraînement">
        <p class="pixel-text text-sm mb-4">
          Chaque entraînement améliore une statistique de votre monstre.
        </p>
        <div class="space-y-4">
          {#each TRAINING_OPTIONS as option}
            <div class="p-4 bg-white border-4 border-black">
              <div class="flex justify-between items-center mb-2">
                <h4 class="pixel-text font-bold">{option.label}</h4>
                <span class="pixel-text text-sm text-green-600">{option.cost}€</span>
              </div>
              <p class="pixel-text text-xs mb-3">+{option.improvement} points</p>
              <Button
                onclick={() => train(option.name, option.cost, option.improvement)}
                disabled={!gameState.player || gameState.player.money < option.cost}
              >
                Entraîner
              </Button>
            </div>
          {/each}
        </div>
      </Card>
    </div>
  {/if}
</div>
