# Monster Arena API Documentation

All API routes are located in `/app/api/` and follow RESTful conventions.

## Authentication

Currently uses a simple client-side player ID (`player-1`). In production, replace with proper authentication.

## Player Endpoints

### Initialize Player
- **POST** `/api/player/init`
- **Body**: `{ playerId: string }`
- **Response**: `{ success: boolean, player: Player }`
- **Description**: Initialize a new player with default data

### Get Player Status
- **GET** `/api/player/status?playerId=player-1`
- **Response**: `{ success: boolean, player: Player, monsters: Monster[] }`
- **Description**: Get current player data and owned monsters

## Combat Endpoints

### Start Combat
- **POST** `/api/combat/start`
- **Body**: `{ playerId: string, playerMonsterId: string }`
- **Response**: `{ success: boolean, playerMonster: Monster, enemyMonster: Monster, tierBattleNumber: number }`
- **Description**: Start a new battle, returns both combatants

### Perform Combat Action
- **POST** `/api/combat/action`
- **Body**: `{ playerId: string, playerMonsterId: string, enemyMonsterId: string, action: 'attack' | 'defend' }`
- **Response**: `{ success: boolean, result: BattleResult, reward: number, playerMonster: Monster, enemyMonster: Monster }`
- **Description**: Perform an action in combat, returns updated state and rewards if victorious

## Shop Endpoints

### Get Shop Monsters
- **GET** `/api/monsters/list`
- **Response**: `{ success: boolean, monsters: Monster[] }`
- **Description**: Get all purchasable monsters

### Buy Monster
- **POST** `/api/shop/buy`
- **Body**: `{ playerId: string, monsterId: string }`
- **Response**: `{ success: boolean, player: Player, monsters: Monster[], message: string }`
- **Description**: Purchase a monster, updates player balance and inventory

## Training Endpoints

### Train Monster
- **POST** `/api/training/start`
- **Body**: `{ playerId: string, monsterId: string }`
- **Response**: `{ success: boolean, player: Player, trainedMonster: Monster, message: string }`
- **Description**: Train a monster to improve its stats (costs 20 coins)

## Data Models

### Player
\`\`\`typescript
{
  money: number;              // Current coins
  ownedMonsters: string[];    // Array of monster IDs
  nextArenaTier: number;      // Current arena tier (1-5)
  totalBattles: number;       // Total battles fought
  wins: number;               // Total victories
}
\`\`\`

### Monster
\`\`\`typescript
{
  id: string;
  name: string;
  type: string;
  level: number;
  health: number;
  maxHealth: number;
  stats: {
    attack: number;
    defense: number;
    speed: number;
    hp: number;
  };
  mood: 'happy' | 'neutral' | 'angry';
  image: string;
  cost: number;               // 0 for non-purchasable monsters
}
\`\`\`

### Combat Result
\`\`\`typescript
{
  playerDamage: number;       // Damage dealt by player
  enemyDamage: number;        // Damage dealt by enemy
  battleOver: boolean;        // Is combat finished
  winner: string;             // 'player' or 'enemy'
}
\`\`\`

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request or game logic error
- `404`: Resource not found
- `500`: Server error

Error responses include a message:
\`\`\`json
{ "error": "Descriptive error message" }
\`\`\`

## Rate Limiting

Currently no rate limiting. In production, implement per-player rate limits to prevent abuse.

## Future Improvements

- Multiplayer PvP combat endpoints
- Leaderboards endpoint
- Monster breeding/evolution
- Guilds and cooperative gameplay
- Real authentication with JWT tokens
