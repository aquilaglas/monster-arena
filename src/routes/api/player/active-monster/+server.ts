import { json } from '@sveltejs/kit';
import { getActiveMonster } from '$lib/game/player';

export async function GET() {
  try {
    const monster = await getActiveMonster(1);
    return json({ monster });
  } catch (error) {
    return json({ error: 'Failed to load active monster' }, { status: 500 });
  }
}
