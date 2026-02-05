import { json } from '@sveltejs/kit';
import { trainMonster, completeTraining, checkAndCompleteTrainings } from '$lib/game/training';

export async function POST({ request }) {
  try {
    const { monsterId, stat, cost, improvement, durationMinutes } = await request.json();

    const success = await trainMonster(1, monsterId, stat, cost, improvement, durationMinutes);

    if (success) {
      return json({ success: true });
    } else {
      return json({ error: 'Entraînement échoué' }, { status: 400 });
    }
  } catch (error) {
    return json({ error: 'Failed to train monster' }, { status: 500 });
  }
}

export async function PUT({ request }) {
  try {
    const { monsterId } = await request.json();

    const success = await completeTraining(monsterId);

    if (success) {
      return json({ success: true });
    } else {
      return json({ error: 'Impossible de terminer l\'entraînement' }, { status: 400 });
    }
  } catch (error) {
    return json({ error: 'Failed to complete training' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await checkAndCompleteTrainings();
    return json({ success: true });
  } catch (error) {
    return json({ error: 'Failed to check trainings' }, { status: 500 });
  }
}
