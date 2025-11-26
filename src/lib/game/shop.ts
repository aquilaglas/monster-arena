import { sql } from '$lib/db';
import type { MonsterType } from '$lib/types';

export async function getAvailableMonsters(): Promise<MonsterType[]> {
  return await sql<MonsterType[]>`
    SELECT * FROM monster_types
    WHERE is_boss = FALSE AND price > 0
    ORDER BY price ASC, name ASC
  `;
}

export async function buyMonster(
  playerId: number,
  monsterTypeId: number,
  price: number
): Promise<{ success: boolean; error?: string; monsterId?: number }> {
  try {
    let newMonsterId: number | undefined;

    await sql.begin(async (sql) => {
      const [player] = await sql`
        SELECT money FROM players WHERE id = ${playerId}
      `;

      if (!player || player.money < price) {
        throw new Error('Pas assez d\'argent');
      }

      const [monsterType] = await sql<MonsterType[]>`
        SELECT * FROM monster_types WHERE id = ${monsterTypeId}
      `;

      if (!monsterType) {
        throw new Error('Type de monstre introuvable');
      }

      await sql`
        UPDATE players
        SET money = money - ${price}
        WHERE id = ${playerId}
      `;

      const [newMonster] = await sql`
        INSERT INTO player_monsters
          (player_id, monster_type_id, nickname, level, hp, max_hp, attack, defense, speed, is_active)
        VALUES
          (${playerId}, ${monsterTypeId}, ${monsterType.name}, 1,
           ${monsterType.base_hp}, ${monsterType.base_hp},
           ${monsterType.base_attack}, ${monsterType.base_defense}, ${monsterType.base_speed}, FALSE)
        RETURNING id
      `;

      newMonsterId = newMonster.id;
    });

    return { success: true, monsterId: newMonsterId };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
