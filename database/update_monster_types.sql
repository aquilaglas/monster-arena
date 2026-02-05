-- Mise à jour des types d'éléments pour chaque monstre

-- Monstres de feu
UPDATE monster_types SET element_type = 'fire' WHERE name IN ('Flammy', 'Infernus', 'Pyrothor');

-- Monstres d'eau
UPDATE monster_types SET element_type = 'water' WHERE name IN ('Aqualis', 'Leviathan');

-- Monstres de terre/roche
UPDATE monster_types SET element_type = 'earth' WHERE name IN ('Terros', 'Titanor');

-- Monstres électriques
UPDATE monster_types SET element_type = 'electric' WHERE name IN ('Voltix', 'Stormlord');

-- Monstres de glace
UPDATE monster_types SET element_type = 'ice' WHERE name = 'Glacior';

-- Monstres de vent
UPDATE monster_types SET element_type = 'wind' WHERE name = 'Zephyr';

-- Monstres d'ombre
UPDATE monster_types SET element_type = 'dark' WHERE name = 'Shadowclaw';

-- Monstres de lumière
UPDATE monster_types SET element_type = 'light' WHERE name = 'Luminos';

-- Monstres de poison
UPDATE monster_types SET element_type = 'poison' WHERE name = 'Venomfang';

-- Monstres de cristal
UPDATE monster_types SET element_type = 'crystal' WHERE name = 'Crystallia';

-- Monstres du temps
UPDATE monster_types SET element_type = 'time' WHERE name = 'Chronos';
