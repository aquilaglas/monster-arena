#!/bin/bash

# Script de configuration de la base de données Monster Arena

echo "🎮 Configuration de la base de données Monster Arena..."

# Vérifier si psql est installé
if ! command -v psql &> /dev/null; then
    echo "❌ psql n'est pas installé. Veuillez installer PostgreSQL."
    exit 1
fi

# URL de connexion Neon
DATABASE_URL="postgresql://neondb_owner:npg_OTuzAq1veb5x@ep-weathered-breeze-ad2zbr0i-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

echo "📦 Création du schéma de base de données..."
psql "$DATABASE_URL" -f database/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schéma créé avec succès!"
else
    echo "❌ Erreur lors de la création du schéma"
    exit 1
fi

echo "🌱 Insertion des données initiales..."
psql "$DATABASE_URL" -f database/seed.sql

if [ $? -eq 0 ]; then
    echo "✅ Données insérées avec succès!"
else
    echo "❌ Erreur lors de l'insertion des données"
    exit 1
fi

echo "🎉 Base de données configurée avec succès!"
echo ""
echo "📊 Statistiques:"
psql "$DATABASE_URL" -c "SELECT COUNT(*) as monster_types FROM monster_types;"
psql "$DATABASE_URL" -c "SELECT COUNT(*) as arena_levels FROM arena_opponents;"
psql "$DATABASE_URL" -c "SELECT COUNT(*) as players FROM players;"
