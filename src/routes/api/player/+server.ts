import { json } from '@sveltejs/kit';
import { getPlayer } from '$lib/game/player';

export async function GET() {
  try {
    const player = await getPlayer(1);
    return json({ player });
  } catch (error) {
    return json({ error: 'Failed to load player' }, { status: 500 });
  }
}
