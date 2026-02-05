-- Migration pour ajouter le système d'entraînement avec durée

-- Ajouter les colonnes pour l'entraînement
ALTER TABLE player_monsters
ADD COLUMN IF NOT EXISTS is_training BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS training_end_time TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS training_stat VARCHAR(50) NULL,
ADD COLUMN IF NOT EXISTS training_improvement INTEGER NULL;

-- Créer un index pour trouver les monstres en entraînement
CREATE INDEX IF NOT EXISTS idx_player_monsters_training ON player_monsters(is_training) WHERE is_training = TRUE;

-- Mettre à jour les monstres existants
UPDATE player_monsters SET is_training = FALSE, training_end_time = NULL WHERE is_training IS NULL;

-- Ajouter colonne type aux monster_types
ALTER TABLE monster_types
ADD COLUMN IF NOT EXISTS element_type VARCHAR(20) DEFAULT 'normal';
