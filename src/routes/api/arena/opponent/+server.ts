import { json } from '@sveltejs/kit';
import { getArenaOpponent, getNextOpponents } from '$lib/game/arena';

export async function GET({ url }) {
  try {
    const level = parseInt(url.searchParams.get('level') || '1');
    const next = url.searchParams.get('next') === 'true';

    if (next) {
      const opponents = await getNextOpponents(level, 5);
      return json({ opponents });
    } else {
      const opponent = await getArenaOpponent(level);
      return json({ opponent });
    }
  } catch (error) {
    return json({ error: 'Failed to load arena opponent' }, { status: 500 });
  }
}
