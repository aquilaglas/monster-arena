import { sql } from '$lib/db';

export async function saveCombatResult(
  playerId: number,
  playerMonsterId: number,
  arenaLevel: number,
  opponentTypeId: number,
  won: boolean,
  moneyEarned: number,
  experienceGained: number
): Promise<void> {
  try {
    await sql`
      INSERT INTO combat_history (
        player_id,
        player_monster_id,
        arena_level,
        opponent_type_id,
        won,
        money_earned,
        experience_gained
      ) VALUES (
        ${playerId},
        ${playerMonsterId},
        ${arenaLevel},
        ${opponentTypeId},
        ${won},
        ${moneyEarned},
        ${experienceGained}
      )
    `;

    // Mettre à jour l'expérience du monstre
    if (experienceGained > 0) {
      await sql`
        UPDATE player_monsters
        SET experience = experience + ${experienceGained},
            updated_at = NOW()
        WHERE id = ${playerMonsterId}
      `;
    }
  } catch (error) {
    console.error('Error saving combat result:', error);
    throw error;
  }
}
