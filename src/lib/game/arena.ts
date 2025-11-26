import { sql } from '$lib/db';
import type { ArenaOpponent } from '$lib/types';

export async function getArenaOpponent(level: number): Promise<ArenaOpponent | null> {
  const [opponent] = await sql<ArenaOpponent[]>`
    SELECT ao.*, mt.*
    FROM arena_opponents ao
    JOIN monster_types mt ON ao.monster_type_id = mt.id
    WHERE ao.level = ${level}
  `;
  return opponent || null;
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
