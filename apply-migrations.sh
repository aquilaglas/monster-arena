#!/bin/bash

# Script pour appliquer les migrations de la base de données Monster Arena

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Charger les variables d'environnement depuis .env
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Vérifier que DATABASE_URL est défini
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Erreur: DATABASE_URL n'est pas défini dans .env${NC}"
    exit 1
fi

echo -e "${YELLOW}=== Application des migrations Monster Arena ===${NC}\n"

# Migration 1: Système d'entraînement
echo -e "${YELLOW}Migration 1: Ajout du système d'entraînement avec durée...${NC}"
if psql "$DATABASE_URL" -f database/migration_training.sql; then
    echo -e "${GREEN}✓ Migration training appliquée avec succès${NC}\n"
else
    echo -e "${RED}✗ Erreur lors de l'application de la migration training${NC}\n"
    exit 1
fi

# Migration 2: Types élémentaires
echo -e "${YELLOW}Migration 2: Attribution des types élémentaires aux monstres...${NC}"
if psql "$DATABASE_URL" -f database/update_monster_types.sql; then
    echo -e "${GREEN}✓ Types élémentaires appliqués avec succès${NC}\n"
else
    echo -e "${RED}✗ Erreur lors de l'attribution des types${NC}\n"
    exit 1
fi

echo -e "${GREEN}=== Toutes les migrations ont été appliquées avec succès! ===${NC}"
echo -e "${YELLOW}Vous pouvez maintenant relancer l'application.${NC}"
