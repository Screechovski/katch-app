import { ExerciseServer } from '@/types/ExerciseServer';
import { TrainSetServer } from '@/types/TrainsServer';
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
}));
