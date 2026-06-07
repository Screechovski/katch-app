import { SetParams } from '@/helpers/api/v2';

export const prettySetParams = (exercise: Partial<SetParams>) => {
    let line = [];

    if (exercise.weight) {
        line.push(`${exercise.weight}кг`);
    }
    if (exercise.sets && exercise.reps) {
        line.push(`${exercise.sets}x${exercise.reps}`);
    }
    if (exercise.speed) {
        line.push(`${exercise.speed}км/ч`);
    }
    if (exercise.time) {
        line.push(`${exercise.time}мин`);
    }
    if (exercise.incline) {
        line.unshift(`${exercise.incline}°`);
    }

    return line.join(' ');
};
