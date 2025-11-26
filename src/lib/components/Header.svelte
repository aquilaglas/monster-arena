<script lang="ts">
  import { gameState } from '$lib/stores/game.svelte';
</script>

<header class="bg-primary border-b-4 border-black p-4 shadow-lg">
  <div class="container mx-auto flex justify-between items-center">
    <h1 class="text-2xl font-bold text-white pixel-text">MONSTER ARENA</h1>
    <div class="flex items-center gap-6 pixel-text text-sm">
      {#if gameState.player}
        <div class="text-white">
          <span class="text-accent">💰</span> {gameState.player.money}€
        </div>
        <div class="text-white">
          <span class="text-accent">🏆</span> Niveau {gameState.player.current_arena_level}
        </div>
      {/if}
    </div>
  </div>
</header>
