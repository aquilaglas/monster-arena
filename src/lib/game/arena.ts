import { sql } from '$lib/db';
import type { ArenaOpponent } from '$lib/types';

export async function getArenaOpponent(level: number): Promise<ArenaOpponent | null> {
  const [result] = await sql<ArenaOpponent[]>`
    SELECT
      ao.id,
      ao.level,
      ao.monster_type_id,
      ao.monster_level,
      ao.reward_money,
      ao.is_boss,
      json_build_object(
        'id', mt.id,
        'name', mt.name,
        'description', mt.description,
        'base_hp', mt.base_hp,
        'base_attack', mt.base_attack,
        'base_defense', mt.base_defense,
        'base_speed', mt.base_speed,
        'price', mt.price,
        'image_url', mt.image_url,
        'is_boss', mt.is_boss
      ) as monster_type
    FROM arena_opponents ao
    JOIN monster_types mt ON ao.monster_type_id = mt.id
    WHERE ao.level = ${level}
  `;
  return result || null;
}

export async function getNextOpponents(currentLevel: number, count: number = 5): Promise<ArenaOpponent[]> {
  return await sql<ArenaOpponent[]>`
    SELECT ao.*,
           mt.name as monster_type_name,
           mt.description as monster_type_description,
           mt.image_url as monster_type_image_url,
           mt.is_boss as monster_type_is_boss
    FROM arena_opponents ao
    JOIN monster_types mt ON ao.monster_type_id = mt.id
    WHERE ao.level >= ${currentLevel}
    ORDER BY ao.level ASC
    LIMIT ${count}
  `;
}
