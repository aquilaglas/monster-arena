<script lang="ts">
  import type { PlayerMonster, MonsterType } from '$lib/types';
  import StatBar from './StatBar.svelte';

  interface Props {
    monster: PlayerMonster | MonsterType;
    showStats?: boolean;
    onclick?: () => void;
  }

  let { monster, showStats = true, onclick }: Props = $props();

  const isPlayerMonster = $derived('level' in monster && 'max_hp' in monster);
</script>

<div
  class="pixel-card cursor-pointer hover:scale-105 transition-transform"
  onclick={onclick}
  role="button"
  tabindex="0"
>
  <div class="retro-animation">
    <img
      src={isPlayerMonster
        ? (monster as PlayerMonster).monster_type?.image_url || '/monsters/placeholder.svg'
        : (monster as MonsterType).image_url || '/monsters/placeholder.svg'}
      alt={isPlayerMonster
        ? (monster as PlayerMonster).nickname
        : (monster as MonsterType).name}
      class="w-full h-48 object-contain mb-4 bg-gray-200 border-4 border-black"
    />
  </div>

  <h3 class="text-lg font-bold mb-2 text-dark pixel-text">
    {isPlayerMonster ? (monster as PlayerMonster).nickname : (monster as MonsterType).name}
  </h3>

  {#if isPlayerMonster}
    <p class="text-xs mb-2 text-dark pixel-text">Niveau {(monster as PlayerMonster).level}</p>
  {/if}

  {#if showStats && isPlayerMonster}
    <StatBar
      label="PV"
      current={(monster as PlayerMonster).hp}
      max={(monster as PlayerMonster).max_hp}
      color="bg-green-500"
    />
    <div class="grid grid-cols-3 gap-2 mt-2 pixel-text text-xs text-dark">
      <div>ATT: {(monster as PlayerMonster).attack}</div>
      <div>DEF: {(monster as PlayerMonster).defense}</div>
      <div>VIT: {(monster as PlayerMonster).speed}</div>
    </div>
  {:else if !isPlayerMonster}
    <p class="text-xs mt-2 text-dark pixel-text">Prix: {(monster as MonsterType).price}€</p>
  {/if}
</div>
