<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import { gameState, updateMoney } from '$lib/stores/game.svelte';
  import type { MonsterType } from '$lib/types';

  let monsters = $state<MonsterType[]>([]);
  let isLoading = $state(true);
  let message = $state('');

  onMount(async () => {
    await loadMonsters();
    isLoading = false;
  });

  async function loadMonsters() {
    const res = await fetch('/api/shop');
    const data = await res.json();
    monsters = data.monsters;
  }

  async function buy(monster: MonsterType) {
    if (!gameState.player) return;

    if (gameState.player.money < monster.price) {
      message = "Pas assez d'argent !";
      setTimeout(() => (message = ''), 3000);
      return;
    }

    const res = await fetch('/api/shop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        monsterTypeId: monster.id,
        price: monster.price,
      }),
    });

    if (res.ok) {
      updateMoney(-monster.price);
      message = `${monster.name} acheté avec succès !`;
      setTimeout(() => (message = ''), 3000);
    } else {
      const error = await res.json();
      message = error.error || "Échec de l'achat";
      setTimeout(() => (message = ''), 3000);
    }
  }
</script>

<svelte:head>
  <title>Monster Arena - Boutique</title>
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

  <Card title="Boutique de Monstres">
    {#if isLoading}
      <p class="pixel-text">Chargement...</p>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each monsters as monster}
          <div class="pixel-card">
            <div class="retro-animation">
              <img
                src={monster.image_url || '/monsters/placeholder.png'}
                alt={monster.name}
                class="w-full h-48 object-contain mb-4 bg-gray-200 border-4 border-black"
              />
            </div>
            <h3 class="pixel-text font-bold mb-2">{monster.name}</h3>
            <p class="pixel-text text-xs mb-4">{monster.description}</p>
            <div class="grid grid-cols-2 gap-2 mb-4 pixel-text text-xs">
              <div>PV: {monster.base_hp}</div>
              <div>ATT: {monster.base_attack}</div>
              <div>DEF: {monster.base_defense}</div>
              <div>VIT: {monster.base_speed}</div>
            </div>
            <div class="flex justify-between items-center">
              <span class="pixel-text text-lg text-green-600">{monster.price}€</span>
              <Button
                onclick={() => buy(monster)}
                disabled={!gameState.player || gameState.player.money < monster.price}
              >
                Acheter
              </Button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </Card>
</div>
