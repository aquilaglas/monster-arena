import { sql } from '$lib/db';
import type { Player, PlayerMonster } from '$lib/types';

export async function getPlayer(playerId: number = 1): Promise<Player | null> {
  const [player] = await sql<Player[]>`
    SELECT * FROM players WHERE id = ${playerId}
  `;
  return player || null;
}

export async function updatePlayerMoney(playerId: number, amount: number): Promise<void> {
  await sql`
    UPDATE players
    SET money = money + ${amount}, updated_at = NOW()
    WHERE id = ${playerId}
  `;
}

export async function updateArenaLevel(playerId: number, level: number): Promise<void> {
  await sql`
    UPDATE players
    SET current_arena_level = ${level}, updated_at = NOW()
    WHERE id = ${playerId}
  `;
}

export async function getActiveMonster(playerId: number): Promise<PlayerMonster | null> {
  const [monster] = await sql<PlayerMonster[]>`
    SELECT
      pm.id,
      pm.player_id,
      pm.monster_type_id,
      pm.nickname,
      pm.level,
      pm.hp,
      pm.max_hp,
      pm.attack,
      pm.defense,
      pm.speed,
      pm.experience,
      pm.training_count,
      pm.is_active,
      pm.is_training,
      pm.training_end_time,
      pm.training_stat,
      pm.training_improvement,
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
        'is_boss', mt.is_boss,
        'element_type', mt.element_type
      ) as monster_type
    FROM player_monsters pm
    JOIN monster_types mt ON pm.monster_type_id = mt.id
    WHERE pm.player_id = ${playerId} AND pm.is_active = TRUE
    LIMIT 1
  `;
  return monster || null;
}

export async function getPlayerMonsters(playerId: number): Promise<PlayerMonster[]> {
  return await sql<PlayerMonster[]>`
    SELECT pm.*,
           mt.name as monster_type_name,
           mt.description as monster_type_description,
           mt.image_url as monster_type_image_url,
           mt.is_boss as monster_type_is_boss
    FROM player_monsters pm
    JOIN monster_types mt ON pm.monster_type_id = mt.id
    WHERE pm.player_id = ${playerId}
    ORDER BY pm.is_active DESC, pm.level DESC, pm.id DESC
  `;
}

export async function setActiveMonster(
  playerId: number,
  monsterId: number
): Promise<void> {
  await sql.begin(async (sql) => {
    await sql`
      UPDATE player_monsters
      SET is_active = FALSE
      WHERE player_id = ${playerId}
    `;
    await sql`
      UPDATE player_monsters
      SET is_active = TRUE
      WHERE id = ${monsterId} AND player_id = ${playerId}
    `;
  });
}
