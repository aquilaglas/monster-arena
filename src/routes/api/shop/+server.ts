import { json } from '@sveltejs/kit';
import { getAvailableMonsters, buyMonster } from '$lib/game/shop';

export async function GET() {
  try {
    const monsters = await getAvailableMonsters();
    return json({ monsters });
  } catch (error) {
    return json({ error: 'Failed to load shop' }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const { monsterTypeId, price } = await request.json();

    const result = await buyMonster(1, monsterTypeId, price);

    if (result.success) {
      return json({ success: true, monsterId: result.monsterId });
    } else {
      return json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    return json({ error: 'Failed to buy monster' }, { status: 500 });
  }
}
