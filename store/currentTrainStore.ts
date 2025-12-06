import { ExerciseServer } from '@/models/ExerciseServer';
import { TrainSetServer } from '@/models/TrainsServer';
import { create } from 'zustand';

export type RepsWeight = Pick<TrainSetServer, 'reps' | 'weight'>;
export type Set = {
    sets: RepsWeight[];
    exercises: ExerciseServer;
};

type CounterState = {
    selectedExercise: ExerciseServer | null;
    setSelectedExercise: (exercises: ExerciseServer | null) => void;

    sets: Set[];
    setSets: (sets: RepsWeight[]) => void;
    clearSets: () => void;
    removeSet: (index: number) => void;
};

export const useCurrentTrainStore = create<CounterState>((set) => ({
    selectedExercise: null,
    setSelectedExercise: (exercises: ExerciseServer | null) => {
        set(() => ({ selectedExercise: exercises }));
    },

    sets: [],
    setSets: (sets: RepsWeight[]) => {
        set((state) => {
            if (state.selectedExercise) {
                return {
                    sets: [
                        ...state.sets,
                        {
                            sets,
                            exercises: state.selectedExercise,
                        },
                    ],
                };
            }

            return state;
        });
    },
    clearSets: () =>
        set(() => ({
            sets: [],
        })),
    removeSet: (index: number) =>
        set((state) => ({
            sets: state.sets.filter((_, _index) => _index !== index),
        })),
}));
