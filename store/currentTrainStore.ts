import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CurrentTrainExercise = {
    name: string;
    exerciseId: number;
} & Partial<{
    speed: number;
    time: number;
    incline: number;
    sets: number;
    reps: number;
    weight: number;
}>;

type CurrentTrainState = {
    train: {
        weight: number;
        exercises: CurrentTrainExercise[];
    };
    appendExercise: (exercise: CurrentTrainExercise) => void;
    clearExercises: () => void;
    removeExercise: (index: number) => void;
};

export const useCurrentTrainStore = create<CurrentTrainState>()(
    devtools(
        persist(
            (set) => ({
                train: {
                    weight: 0,
                    exercises: [],
                },
                appendExercise: (exerciseSet: CurrentTrainExercise) => {
                    set((state) => {
                        return {
                            train: {
                                ...state.train,
                                exercises: [...state.train.exercises, exerciseSet],
                            },
                        };
                    });
                },
                clearExercises: () => {
                    set(() => ({
                        train: {
                            weight: 0,
                            exercises: [],
                        },
                    }));
                },
                removeExercise: (index: number) => {
                    set((state) => ({
                        train: {
                            ...state.train,
                            exercises: state.train.exercises.filter(
                                (_, _index) => _index !== index,
                            ),
                        },
                    }));
                },
            }),
            {
                name: 'current-train',
                storage: createJSONStorage(() => AsyncStorage),
            },
        ),
    ),
);
