<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import { gameState, updateMoney, setActiveMonster } from '$lib/stores/game.svelte';
  import {
    TRAINING_OPTIONS,
    TRAINING_DURATION_PER_POINT,
    formatTrainingDuration,
    getRemainingTrainingTime,
    formatRemainingTime,
  } from '$lib/game/training.client';
  import type { PlayerMonster } from '$lib/types';

  let isLoading = $state(true);
  let message = $state('');
  let allMonsters = $state<PlayerMonster[]>([]);
  let remainingTimes = $state<Map<number, number>>(new Map());
  let intervalId: number | null = null;

  onMount(async () => {
    await loadAllMonsters();
    isLoading = false;
    startTimer();
  });

  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  async function loadAllMonsters() {
    const res = await fetch('/api/monsters');
    const data = await res.json();
    allMonsters = data.monsters;
  }

  function startTimer() {
    if (intervalId) {
      clearInterval(intervalId);
    }

    updateAllRemainingTimes();

    intervalId = setInterval(() => {
      updateAllRemainingTimes();
    }, 1000) as unknown as number;
  }

  function updateAllRemainingTimes() {
    const newTimes = new Map<number, number>();

    for (const monster of allMonsters) {
      if (monster.is_training && monster.training_end_time) {
        const remaining = getRemainingTrainingTime(monster.training_end_time);
        newTimes.set(monster.id, remaining);

        if (remaining <= 0 && remainingTimes.get(monster.id)! > 0) {
          // L'entraînement vient de se terminer
          loadAllMonsters();
        }
      }
    }

    remainingTimes = newTimes;
  }

  async function train(monster: PlayerMonster, stat: string, cost: number, improvement: number) {
    if (!gameState.player) return;

    if (gameState.player.money < cost) {
      message = "Pas assez d'argent !";
      setTimeout(() => (message = ''), 3000);
      return;
    }

    if (monster.is_training) {
      message = 'Ce monstre est déjà en entraînement !';
      setTimeout(() => (message = ''), 3000);
      return;
    }

    const durationMinutes = improvement * TRAINING_DURATION_PER_POINT;

    const res = await fetch('/api/training', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        monsterId: monster.id,
        stat,
        cost,
        improvement,
        durationMinutes,
      }),
    });

    if (res.ok) {
      updateMoney(-cost);

      message = `Entraînement de ${monster.nickname} commencé ! Durée: ${formatTrainingDuration(improvement)}`;
      setTimeout(() => (message = ''), 3000);

      await loadAllMonsters();

      // Rafraîchir le monstre actif si c'est lui qui s'entraîne
      if (monster.is_active) {
        const monsterRes = await fetch('/api/player/active-monster');
        const monsterData = await monsterRes.json();
        setActiveMonster(monsterData.monster);
      }
    } else {
      const error = await res.json();
      message = error.error || "Échec de l'entraînement";
      setTimeout(() => (message = ''), 3000);
    }
  }

  async function claimTraining(monster: PlayerMonster) {
    const res = await fetch('/api/training', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        monsterId: monster.id,
      }),
    });

    if (res.ok) {
      message = `Entraînement de ${monster.nickname} terminé avec succès !`;
      setTimeout(() => (message = ''), 3000);
      await loadAllMonsters();

      // Rafraîchir le monstre actif si c'est lui
      if (monster.is_active) {
        const monsterRes = await fetch('/api/player/active-monster');
        const monsterData = await monsterRes.json();
        setActiveMonster(monsterData.monster);
      }
    } else {
      const error = await res.json();
      message = error.error || 'Erreur lors de la récupération';
      setTimeout(() => (message = ''), 3000);
    }
  }
</script>

<svelte:head>
  <title>Monster Arena - Entraînement</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
  <div class="mb-4">
    <Button onclick={() => (goto('/'))} variant="secondary">← Retour</Button>
  </div>

  {#if message}
    <div class="mb-4 p-4 bg-accent border-4 border-black">
      <p class="pixel-text text-dark">{message}</p>
    </div>
  {/if}

  <Card title="Centre d'Entraînement">
    <p class="pixel-text text-sm mb-6">
      Sélectionnez un monstre et une statistique à améliorer. La durée dépend de l'amélioration (1
      min/point).
    </p>

    {#if isLoading}
      <p class="pixel-text">Chargement...</p>
    {:else if allMonsters.length === 0}
      <p class="pixel-text mb-4">Vous n'avez aucun monstre.</p>
      <Button onclick={() => (goto('/shop'))}>🛒 Boutique</Button>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each allMonsters as monster}
          <div class="relative">
            {#if monster.is_active}
              <div class="absolute -top-2 -right-2 bg-accent border-4 border-black px-2 py-1 z-10">
                <span class="pixel-text text-xs">ACTIF</span>
              </div>
            {/if}

            <div class="pixel-card">
              <div class="retro-animation">
                <img
                  src={monster.monster_type?.image_url || '/monsters/placeholder.svg'}
                  alt={monster.nickname}
                  class="w-full h-48 object-contain mb-4 bg-gray-200 border-4 border-black"
                />
              </div>

              <h3 class="pixel-text font-bold mb-2">{monster.nickname}</h3>
              <p class="pixel-text text-xs mb-2">Niveau {monster.level}</p>

              <div class="grid grid-cols-2 gap-2 mb-4 pixel-text text-xs">
                <div>PV: {monster.max_hp}</div>
                <div>ATT: {monster.attack}</div>
                <div>DEF: {monster.defense}</div>
                <div>VIT: {monster.speed}</div>
              </div>

              <p class="pixel-text text-xs mb-3 text-gray-600">
                Entraînements: {monster.training_count}
              </p>

              {#if monster.is_training}
                <div class="p-3 bg-primary border-4 border-black mb-3">
                  <h4 class="pixel-text text-xs text-white mb-1">🏋️ En entraînement</h4>
                  <p class="pixel-text text-sm text-accent">
                    {formatRemainingTime(remainingTimes.get(monster.id) || 0)}
                  </p>
                  {#if (remainingTimes.get(monster.id) || 0) <= 0}
                    <Button onclick={() => claimTraining(monster)}>✅ Récupérer</Button>
                  {/if}
                </div>
              {:else}
                <details class="pixel-text text-xs">
                  <summary class="cursor-pointer font-bold mb-2 hover:text-primary">
                    Choisir un entraînement
                  </summary>
                  <div class="space-y-2 mt-2">
                    {#each TRAINING_OPTIONS as option}
                      <div class="p-2 bg-gray-100 border-2 border-black">
                        <div class="flex justify-between mb-1">
                          <span class="font-bold">{option.label}</span>
                          <span class="text-green-600">{option.cost}€</span>
                        </div>
                        <p class="mb-1">+{option.improvement} pts</p>
                        <p class="mb-2 text-gray-600">⏱️ {formatTrainingDuration(option.improvement)}</p>
                        <Button
                          onclick={() => train(monster, option.name, option.cost, option.improvement)}
                          disabled={!gameState.player || gameState.player.money < option.cost}
                        >
                          Entraîner
                        </Button>
                      </div>
                    {/each}
                  </div>
                </details>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </Card>
</div>
