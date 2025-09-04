import {IExercise} from './IExercise';

export type ICurrentApproach = {
    exercise: IExercise;
    approach: number;
    repeat: number;
    weight: number;
    prev?: {
        approach: number;
        repeat: number;
        weight: number;
    };
};
