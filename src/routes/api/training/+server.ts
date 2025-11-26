import { json } from '@sveltejs/kit';
import { trainMonster } from '$lib/game/training';

export async function POST({ request }) {
  try {
    const { monsterId, stat, cost, improvement } = await request.json();

    const success = await trainMonster(1, monsterId, stat, cost, improvement);

    if (success) {
      return json({ success: true });
    } else {
      return json({ error: 'Entraînement échoué' }, { status: 400 });
    }
  } catch (error) {
    return json({ error: 'Failed to train monster' }, { status: 500 });
  }
}
