import type { TrainingStat } from '$lib/types';

export const TRAINING_OPTIONS: TrainingStat[] = [
  { name: 'hp', cost: 100, improvement: 10, label: 'Points de Vie' },
  { name: 'attack', cost: 150, improvement: 5, label: 'Attaque' },
  { name: 'defense', cost: 150, improvement: 5, label: 'Défense' },
  { name: 'speed', cost: 120, improvement: 3, label: 'Vitesse' },
];

// Durée en minutes par point d'amélioration
export const TRAINING_DURATION_PER_POINT = 1;

export function calculateTrainingDuration(improvement: number): number {
    return improvement * TRAINING_DURATION_PER_POINT * 60 * 1000; // en millisecondes
}

export function formatTrainingDuration(improvement: number): string {
    const minutes = improvement * TRAINING_DURATION_PER_POINT;
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
        return `${hours}h`;
    }
    return `${hours}h${remainingMinutes}`;
}

export function getRemainingTrainingTime(endTime: Date | null): number {
    if (!endTime) return 0;
    const now = new Date().getTime();
    const end = new Date(endTime).getTime();
    return Math.max(0, end - now);
}

export function formatRemainingTime(milliseconds: number): string {
    if (milliseconds <= 0) return 'Terminé';

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    }

    if (minutes > 0) {
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }

    return `${seconds}s`;
}
