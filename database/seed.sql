-- Seed data for Monster Arena

-- Insertion des types de monstres
INSERT INTO monster_types (name, description, base_hp, base_attack, base_defense, base_speed, price, image_url, is_boss) VALUES
-- Monstres de base (moins chers)
('Flammy', 'Un petit dragon de feu espiègle qui crache des flammes', 80, 45, 30, 55, 500, '/monsters/flammy.png', FALSE),
('Aqualis', 'Une créature aquatique agile et mystérieuse', 90, 35, 40, 60, 500, '/monsters/aqualis.png', FALSE),
('Terros', 'Un monstre de terre robuste avec une défense solide', 100, 40, 50, 30, 500, '/monsters/terros.png', FALSE),
('Voltix', 'Un être électrique rapide comme l''éclair', 75, 50, 25, 70, 600, '/monsters/voltix.png', FALSE),

-- Monstres intermédiaires
('Infernus', 'Un dragon de feu puissant aux flammes dévastatrices', 120, 65, 45, 50, 1500, '/monsters/infernus.png', FALSE),
('Glacior', 'Un colosse de glace aux attaques glaciales', 130, 55, 60, 40, 1500, '/monsters/glacior.png', FALSE),
('Zephyr', 'Un esprit du vent insaisissable et rapide', 100, 60, 35, 80, 1800, '/monsters/zephyr.png', FALSE),
('Titanor', 'Un géant de roche d''une force impressionnante', 150, 70, 70, 25, 2000, '/monsters/titanor.png', FALSE),

-- Monstres avancés
('Shadowclaw', 'Une bête des ténèbres aux griffes acérées', 110, 80, 40, 65, 3000, '/monsters/shadowclaw.png', FALSE),
('Luminos', 'Un ange de lumière aux pouvoirs divins', 115, 75, 50, 70, 3200, '/monsters/luminos.png', FALSE),
('Venomfang', 'Un serpent toxique aux crocs empoisonnés', 105, 70, 45, 75, 2800, '/monsters/venomfang.png', FALSE),
('Crystallia', 'Une créature de cristal aux reflets éblouissants', 125, 65, 65, 55, 3500, '/monsters/crystallia.png', FALSE),

-- Boss
('Pyrothor', 'Boss de feu légendaire - Le Seigneur des Flammes Éternelles', 200, 90, 60, 50, 0, '/monsters/boss_pyrothor.png', TRUE),
('Leviathan', 'Boss aquatique légendaire - Le Maître des Profondeurs', 220, 80, 75, 45, 0, '/monsters/boss_leviathan.png', TRUE),
('Stormlord', 'Boss électrique légendaire - Le Roi des Tempêtes', 180, 100, 50, 80, 0, '/monsters/boss_stormlord.png', TRUE),
('Chronos', 'Boss ultime légendaire - Le Gardien du Temps', 250, 95, 80, 60, 0, '/monsters/boss_chronos.png', TRUE);

-- Insertion d'un joueur de test
INSERT INTO players (name, money, current_arena_level) VALUES
('Dresseur Débutant', 1000, 1);

-- Donner un monstre de départ au joueur
INSERT INTO player_monsters (player_id, monster_type_id, nickname, level, hp, max_hp, attack, defense, speed, is_active)
SELECT
    1,
    id,
    name,
    5,
    base_hp + 20,
    base_hp + 20,
    base_attack + 10,
    base_defense + 5,
    base_speed + 5,
    TRUE
FROM monster_types
WHERE name = 'Flammy'
LIMIT 1;

-- Création des 50 premiers niveaux de l'arène (avec boss tous les 5 niveaux)
DO $$
DECLARE
    v_level INTEGER;
    v_monster_type_id INTEGER;
    v_monster_level INTEGER;
    v_reward INTEGER;
    v_is_boss BOOLEAN;
BEGIN
    FOR v_level IN 1..50 LOOP
        v_is_boss := (v_level % 5 = 0);
        v_monster_level := (v_level / 2) + 1;
        v_reward := 50 + (v_level * 25);

        IF v_is_boss THEN
            -- Boss tous les 5 niveaux
            v_reward := v_reward * 3;

            -- Sélectionner un boss en fonction du niveau
            IF v_level <= 15 THEN
                SELECT id INTO v_monster_type_id FROM monster_types WHERE name = 'Pyrothor';
            ELSIF v_level <= 30 THEN
                SELECT id INTO v_monster_type_id FROM monster_types WHERE name = 'Leviathan';
            ELSIF v_level <= 45 THEN
                SELECT id INTO v_monster_type_id FROM monster_types WHERE name = 'Stormlord';
            ELSE
                SELECT id INTO v_monster_type_id FROM monster_types WHERE name = 'Chronos';
            END IF;
        ELSE
            -- Monstre normal basé sur le niveau
            IF v_level <= 10 THEN
                SELECT id INTO v_monster_type_id FROM monster_types
                WHERE is_boss = FALSE AND price <= 600
                ORDER BY RANDOM() LIMIT 1;
            ELSIF v_level <= 25 THEN
                SELECT id INTO v_monster_type_id FROM monster_types
                WHERE is_boss = FALSE AND price > 600 AND price <= 2000
                ORDER BY RANDOM() LIMIT 1;
            ELSE
                SELECT id INTO v_monster_type_id FROM monster_types
                WHERE is_boss = FALSE AND price > 2000
                ORDER BY RANDOM() LIMIT 1;
            END IF;
        END IF;

        INSERT INTO arena_opponents (level, monster_type_id, monster_level, reward_money, is_boss)
        VALUES (v_level, v_monster_type_id, v_monster_level, v_reward, v_is_boss);
    END LOOP;
END $$;
