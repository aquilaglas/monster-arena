import type { Player, PlayerMonster } from '$lib/types';

export const gameState = $state<{
  player: Player | null;
  activeMonster: PlayerMonster | null;
  loading: boolean;
}>({
  player: null,
  activeMonster: null,
  loading: true,
});

export function setPlayer(player: Player) {
  gameState.player = player;
}

export function setActiveMonster(monster: PlayerMonster | null) {
  gameState.activeMonster = monster;
}

export function updateMoney(amount: number) {
  if (gameState.player) {
    gameState.player.money += amount;
  }
}

export function setLoading(loading: boolean) {
  gameState.loading = loading;
}
