<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import MonsterCard from '$lib/components/MonsterCard.svelte';
  import { setActiveMonster } from '$lib/stores/game.svelte';
  import type { PlayerMonster } from '$lib/types';

  let monsters = $state<PlayerMonster[]>([]);
  let isLoading = $state(true);
  let message = $state('');

  onMount(async () => {
    await loadMonsters();
    isLoading = false;
  });

  async function loadMonsters() {
    const res = await fetch('/api/monsters');
    const data = await res.json();
    monsters = data.monsters;
  }

  async function selectMonster(monster: PlayerMonster) {
    const res = await fetch('/api/monsters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monsterId: monster.id }),
    });

    if (res.ok) {
      monsters = monsters.map((m) => ({
        ...m,
        is_active: m.id === monster.id,
      }));
      setActiveMonster(monster);
      message = `${monster.nickname} est maintenant actif !`;
      setTimeout(() => (message = ''), 3000);
    }
  }
</script>

<svelte:head>
  <title>Monster Arena - Mes Monstres</title>
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

  <Card title="Mes Monstres">
    {#if isLoading}
      <p class="pixel-text">Chargement...</p>
    {:else if monsters.length === 0}
      <p class="pixel-text mb-4">Vous n'avez aucun monstre. Visitez la boutique !</p>
      <Button onclick={() => (goto('/shop'))}>🛒 Boutique</Button>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each monsters as monster}
          <div class="relative">
            {#if monster.is_active}
              <div class="absolute -top-2 -right-2 bg-accent border-4 border-black px-2 py-1 z-10">
                <span class="pixel-text text-xs">ACTIF</span>
              </div>
            {/if}
            <button
              type="button"
              class="cursor-pointer hover:scale-105 transition-transform text-left w-full {monster.is_active ? 'ring-4 ring-accent' : ''}"
              onclick={() => selectMonster(monster)}
            >
              <MonsterCard {monster} />
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </Card>
</div>
