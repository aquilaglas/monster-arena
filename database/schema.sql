-- Monster Arena Database Schema

-- Table des joueurs
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    money INTEGER DEFAULT 1000,
    current_arena_level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des types de monstres (templates)
CREATE TABLE IF NOT EXISTS monster_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_hp INTEGER NOT NULL,
    base_attack INTEGER NOT NULL,
    base_defense INTEGER NOT NULL,
    base_speed INTEGER NOT NULL,
    price INTEGER NOT NULL,
    image_url VARCHAR(255),
    is_boss BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des monstres possédés par les joueurs
CREATE TABLE IF NOT EXISTS player_monsters (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    monster_type_id INTEGER REFERENCES monster_types(id),
    nickname VARCHAR(100),
    level INTEGER DEFAULT 1,
    hp INTEGER NOT NULL,
    max_hp INTEGER NOT NULL,
    attack INTEGER NOT NULL,
    defense INTEGER NOT NULL,
    speed INTEGER NOT NULL,
    experience INTEGER DEFAULT 0,
    training_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des adversaires de l'arène
CREATE TABLE IF NOT EXISTS arena_opponents (
    id SERIAL PRIMARY KEY,
    level INTEGER NOT NULL UNIQUE,
    monster_type_id INTEGER REFERENCES monster_types(id),
    monster_level INTEGER NOT NULL,
    reward_money INTEGER NOT NULL,
    is_boss BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de l'historique des combats
CREATE TABLE IF NOT EXISTS combat_history (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    player_monster_id INTEGER REFERENCES player_monsters(id),
    arena_level INTEGER NOT NULL,
    opponent_type_id INTEGER REFERENCES monster_types(id),
    won BOOLEAN NOT NULL,
    money_earned INTEGER DEFAULT 0,
    experience_gained INTEGER DEFAULT 0,
    combat_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de l'historique d'entraînement
CREATE TABLE IF NOT EXISTS training_history (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    monster_id INTEGER REFERENCES player_monsters(id) ON DELETE CASCADE,
    stat_improved VARCHAR(50) NOT NULL,
    improvement_value INTEGER NOT NULL,
    cost INTEGER NOT NULL,
    training_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_player_monsters_player_id ON player_monsters(player_id);
CREATE INDEX IF NOT EXISTS idx_player_monsters_active ON player_monsters(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_combat_history_player ON combat_history(player_id);
CREATE INDEX IF NOT EXISTS idx_training_history_player ON training_history(player_id);
CREATE INDEX IF NOT EXISTS idx_arena_opponents_level ON arena_opponents(level);
