import { json } from '@sveltejs/kit';
import { saveCombatResult } from '$lib/game/combat';
import { updatePlayerMoney, updateArenaLevel } from '$lib/game/player';

export async function POST({ request }) {
  try {
    const { playerMonsterId, arenaLevel, opponentTypeId, won, moneyEarned, experienceGained, isReplay } =
      await request.json();

    await saveCombatResult(
      1,
      playerMonsterId,
      arenaLevel,
      opponentTypeId,
      won,
      moneyEarned,
      experienceGained
    );

    if (won) {
      await updatePlayerMoney(1, moneyEarned);
      // Ne faire progresser le niveau que si ce n'est pas un replay
      if (!isReplay) {
        await updateArenaLevel(1, arenaLevel + 1);
      }
    }

    return json({ success: true });
  } catch (error) {
    return json({ error: 'Failed to save combat result' }, { status: 500 });
  }
}
