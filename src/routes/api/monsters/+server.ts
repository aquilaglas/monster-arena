import { json } from '@sveltejs/kit';
import { getPlayerMonsters, setActiveMonster } from '$lib/game/player';

export async function GET() {
  try {
    const monsters = await getPlayerMonsters(1);
    return json({ monsters });
  } catch (error) {
    return json({ error: 'Failed to load monsters' }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const { monsterId } = await request.json();
    await setActiveMonster(1, monsterId);
    return json({ success: true });
  } catch (error) {
    return json({ error: 'Failed to set active monster' }, { status: 500 });
  }
}
