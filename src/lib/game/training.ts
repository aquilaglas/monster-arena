import { sql } from '$lib/db';
import type { TrainingStat } from '$lib/types';

export const TRAINING_OPTIONS: TrainingStat[] = [
  { name: 'hp', cost: 100, improvement: 10, label: 'Points de Vie' },
  { name: 'attack', cost: 150, improvement: 5, label: 'Attaque' },
  { name: 'defense', cost: 150, improvement: 5, label: 'Défense' },
  { name: 'speed', cost: 120, improvement: 3, label: 'Vitesse' },
];

export async function trainMonster(
  playerId: number,
  monsterId: number,
  stat: string,
  cost: number,
  improvement: number
): Promise<boolean> {
  try {
    await sql.begin(async (sql) => {
      const [player] = await sql`
        SELECT money FROM players WHERE id = ${playerId}
      `;

      if (!player || player.money < cost) {
        throw new Error('Pas assez d\'argent');
      }

      await sql`
        UPDATE players
        SET money = money - ${cost}
        WHERE id = ${playerId}
      `;

      if (stat === 'hp') {
        await sql`
          UPDATE player_monsters
          SET max_hp = max_hp + ${improvement},
              hp = hp + ${improvement},
              training_count = training_count + 1,
              updated_at = NOW()
          WHERE id = ${monsterId}
        `;
      } else {
        await sql`
          UPDATE player_monsters
          SET ${sql(stat)} = ${sql(stat)} + ${improvement},
              training_count = training_count + 1,
              updated_at = NOW()
          WHERE id = ${monsterId}
        `;
      }

      await sql`
        INSERT INTO training_history (player_id, monster_id, stat_improved, improvement_value, cost)
        VALUES (${playerId}, ${monsterId}, ${stat}, ${improvement}, ${cost})
      `;
    });

    return true;
  } catch (error) {
    console.error('Training error:', error);
    return false;
  }
}
