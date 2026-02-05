import { sql } from '$lib/db';

export async function trainMonster(
  playerId: number,
  monsterId: number,
  stat: string,
  cost: number,
  improvement: number,
  durationMinutes: number
): Promise<boolean> {
  try {
    await sql.begin(async (sql) => {
      const [player] = await sql`
        SELECT money FROM players WHERE id = ${playerId}
      `;

      if (!player || player.money < cost) {
        throw new Error('Pas assez d\'argent');
      }

      // Vérifier que le monstre n'est pas déjà en entraînement
      const [monster] = await sql`
        SELECT is_training, training_end_time
        FROM player_monsters
        WHERE id = ${monsterId}
      `;

      if (monster.is_training) {
        const now = new Date();
        const endTime = new Date(monster.training_end_time);
        if (endTime > now) {
          throw new Error('Le monstre est déjà en entraînement');
        }
      }

      await sql`
        UPDATE players
        SET money = money - ${cost}
        WHERE id = ${playerId}
      `;

      // Calculer le temps de fin d'entraînement
      const endTime = new Date(Date.now() + durationMinutes * 60 * 1000);

      // Mettre le monstre en entraînement (sans améliorer les stats immédiatement)
      await sql`
        UPDATE player_monsters
        SET is_training = TRUE,
            training_end_time = ${endTime},
            training_stat = ${stat},
            training_improvement = ${improvement},
            updated_at = NOW()
        WHERE id = ${monsterId}
      `;

      // Enregistrer l'entraînement en cours
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

export async function completeTraining(monsterId: number): Promise<boolean> {
  try {
    await sql.begin(async (sql) => {
      const [monster] = await sql`
        SELECT is_training, training_end_time, training_stat, training_improvement
        FROM player_monsters
        WHERE id = ${monsterId}
      `;

      if (!monster.is_training) {
        return false;
      }

      const now = new Date();
      const endTime = new Date(monster.training_end_time);

      // Vérifier que l'entraînement est bien terminé
      if (endTime > now) {
        throw new Error('L\'entraînement n\'est pas encore terminé');
      }

      const stat = monster.training_stat;
      const improvement = monster.training_improvement;

      // Appliquer l'amélioration
      if (stat === 'hp') {
        await sql`
          UPDATE player_monsters
          SET max_hp = max_hp + ${improvement},
              hp = hp + ${improvement},
              training_count = training_count + 1,
              is_training = FALSE,
              training_end_time = NULL,
              training_stat = NULL,
              training_improvement = NULL,
              updated_at = NOW()
          WHERE id = ${monsterId}
        `;
      } else {
        await sql`
          UPDATE player_monsters
          SET ${sql(stat)} = ${sql(stat)} + ${improvement},
              training_count = training_count + 1,
              is_training = FALSE,
              training_end_time = NULL,
              training_stat = NULL,
              training_improvement = NULL,
              updated_at = NOW()
          WHERE id = ${monsterId}
        `;
      }
    });

    return true;
  } catch (error) {
    console.error('Complete training error:', error);
    return false;
  }
}

export async function checkAndCompleteTrainings(): Promise<void> {
  try {
    // Récupérer tous les monstres dont l'entraînement est terminé
    const monsters = await sql`
      SELECT id
      FROM player_monsters
      WHERE is_training = TRUE
      AND training_end_time <= NOW()
    `;

    // Pour chaque monstre, appliquer l'amélioration
    for (const monster of monsters) {
      await completeTraining(monster.id);
    }
  } catch (error) {
    console.error('Check training error:', error);
  }
}
