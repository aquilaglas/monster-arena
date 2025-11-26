<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import { gameState } from '$lib/stores/game.svelte';
</script>

<svelte:head>
  <title>Monster Arena - Menu Principal</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
  <Card title="Menu Principal">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Button onclick={() => (window.location.href = '/arena')}>
        🏟️ ARÈNE
      </Button>

      <Button onclick={() => (window.location.href = '/training')} variant="secondary">
        💪 ENTRAÎNEMENT
      </Button>

      <Button onclick={() => (window.location.href = '/shop')} variant="secondary">
        🛒 BOUTIQUE
      </Button>

      <Button onclick={() => (window.location.href = '/monsters')} variant="secondary">
        👾 MES MONSTRES
      </Button>
    </div>

    {#if gameState.activeMonster}
      <div class="mt-8 p-4 bg-secondary border-4 border-black">
        <h3 class="pixel-text text-sm mb-2 text-dark">Monstre actif:</h3>
        <p class="pixel-text text-lg text-dark font-bold">
          {gameState.activeMonster.nickname} (Niv. {gameState.activeMonster.level})
        </p>
      </div>
    {:else}
      <div class="mt-8 p-4 bg-red-500 border-4 border-black">
        <p class="pixel-text text-sm text-white">
          ⚠️ Aucun monstre actif ! Allez dans "Mes Monstres" pour en sélectionner un.
        </p>
      </div>
    {/if}
  </Card>
</div>
