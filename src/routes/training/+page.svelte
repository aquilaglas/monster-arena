<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import MonsterCard from '$lib/components/MonsterCard.svelte';
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
  let remainingTime = $state(0);
  let intervalId: number | null = null;

  onMount(async () => {
    // Vérifier si des entraînements sont terminés
    await checkCompletedTrainings();
    isLoading = false;

    // Démarrer le timer si le monstre est en entraînement
    if (gameState.activeMonster?.is_training) {
      startTimer();
    }
  });

  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  function startTimer() {
    if (intervalId) {
      clearInterval(intervalId);
    }

    updateRemainingTime();

    intervalId = setInterval(() => {
      updateRemainingTime();

      if (remainingTime <= 0) {
        clearInterval(intervalId!);
        intervalId = null;
        // Recharger le monstre
        refreshMonster();
      }
    }, 1000) as unknown as number;
  }

  function updateRemainingTime() {
    if (gameState.activeMonster?.is_training && gameState.activeMonster.training_end_time) {
      remainingTime = getRemainingTrainingTime(gameState.activeMonster.training_end_time);
    } else {
      remainingTime = 0;
    }
  }

  async function checkCompletedTrainings() {
    await fetch('/api/training');
    await refreshMonster();
  }

  async function refreshMonster() {
    const monsterRes = await fetch('/api/player/active-monster');
    const monsterData = await monsterRes.json();
    setActiveMonster(monsterData.monster);

    if (monsterData.monster?.is_training) {
      startTimer();
    }
  }

  async function train(stat: string, cost: number, improvement: number) {
    if (!gameState.activeMonster || !gameState.player) return;

    if (gameState.player.money < cost) {
      message = "Pas assez d'argent !";
      setTimeout(() => (message = ''), 3000);
      return;
    }

    if (gameState.activeMonster.is_training) {
      message = 'Le monstre est déjà en entraînement !';
      setTimeout(() => (message = ''), 3000);
      return;
    }

    const durationMinutes = improvement * TRAINING_DURATION_PER_POINT;

    const res = await fetch('/api/training', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        monsterId: gameState.activeMonster.id,
        stat,
        cost,
        improvement,
        durationMinutes,
      }),
    });

    if (res.ok) {
      updateMoney(-cost);

      message = `Entraînement commencé ! Durée: ${formatTrainingDuration(improvement)}`;
      setTimeout(() => (message = ''), 3000);

      // Recharger le monstre
      await refreshMonster();
    } else {
      const error = await res.json();
      message = error.error || "Échec de l'entraînement";
      setTimeout(() => (message = ''), 3000);
    }
  }

  async function claimTraining() {
    if (!gameState.activeMonster) return;

    // Trouver le dernier entraînement
    const lastOption = TRAINING_OPTIONS[0]; // On pourrait stocker ça dans la DB

    const res = await fetch('/api/training', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        monsterId: gameState.activeMonster.id,
        stat: 'hp', // À remplacer par la vraie stat
        improvement: lastOption.improvement,
      }),
    });

    if (res.ok) {
      message = 'Entraînement terminé avec succès !';
      setTimeout(() => (message = ''), 3000);
      await refreshMonster();
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

          {#if gameState.activeMonster.is_training}
            <div class="mt-4 p-4 bg-primary border-4 border-black">
              <h3 class="pixel-text text-sm text-white mb-2">🏋️ Entraînement en cours</h3>
              <p class="pixel-text text-xl text-accent mb-2">
                {formatRemainingTime(remainingTime)}
              </p>
              {#if remainingTime <= 0}
                <Button onclick={claimTraining}>✅ Récupérer</Button>
              {/if}
            </div>
          {/if}
        </Card>
      </div>

      <Card title="Options d'entraînement">
        {#if gameState.activeMonster.is_training}
          <div class="p-4 bg-red-100 border-4 border-red-500 mb-4">
            <p class="pixel-text text-xs text-red-800">
              ⚠️ Le monstre est en entraînement. Attendez qu'il termine avant de commencer un
              nouvel entraînement.
            </p>
          </div>
        {/if}

        <p class="pixel-text text-sm mb-4">
          Chaque entraînement améliore une statistique de votre monstre. La durée dépend de
          l'amélioration.
        </p>

        <div class="space-y-4">
          {#each TRAINING_OPTIONS as option}
            <div class="p-4 bg-white border-4 border-black">
              <div class="flex justify-between items-center mb-2">
                <h4 class="pixel-text font-bold">{option.label}</h4>
                <span class="pixel-text text-sm text-green-600">{option.cost}€</span>
              </div>
              <p class="pixel-text text-xs mb-2">+{option.improvement} points</p>
              <p class="pixel-text text-xs mb-3 text-gray-600">
                ⏱️ Durée: {formatTrainingDuration(option.improvement)}
              </p>
              <Button
                onclick={() => train(option.name, option.cost, option.improvement)}
                disabled={!gameState.player ||
                  gameState.player.money < option.cost ||
                  gameState.activeMonster?.is_training}
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
