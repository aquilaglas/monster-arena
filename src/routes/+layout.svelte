<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import { onMount } from 'svelte';
  import { gameState, setPlayer, setActiveMonster, setLoading } from '$lib/stores/game.svelte';

  let { children } = $props();

  onMount(async () => {
    try {
      const playerRes = await fetch('/api/player');
      const playerData = await playerRes.json();
      setPlayer(playerData.player);

      const monsterRes = await fetch('/api/player/active-monster');
      const monsterData = await monsterRes.json();
      setActiveMonster(monsterData.monster);
    } catch (error) {
      console.error('Error loading game data:', error);
    } finally {
      setLoading(false);
    }
  });
</script>

<div class="min-h-screen bg-dark">
  <Header />
  <main class="container mx-auto px-4 py-8">
    {#if gameState.loading}
      <div class="text-center text-white pixel-text">Chargement...</div>
    {:else}
      {@render children()}
    {/if}
  </main>
</div>
