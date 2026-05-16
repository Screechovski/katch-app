import { ExerciseServer } from '@/models/ExerciseServer';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CurrentTrainExerciseSet = {
    reps: number;
    sets: number;
    weight: number;
};

export type CurrentTrainExercise = {
    name: string;
    exerciseId: number;
} & CurrentTrainExerciseSet;

type CurrentTrainState = {
    selectedExercise: ExerciseServer | null;
    setSelectedExercise: (exercises: ExerciseServer | null) => void;

    train: {
        weight: number;
        exercises: CurrentTrainExercise[];
    };
    appendExercise: (exercise: CurrentTrainExerciseSet) => void;
    clearExercises: () => void;
    removeExercise: (index: number) => void;
};

export const useCurrentTrainStore = create<CurrentTrainState>()(
    devtools(
        persist(
            (set) => ({
                selectedExercise: null,
                setSelectedExercise: (exercises: ExerciseServer | null) => {
                    set(() => ({ selectedExercise: exercises }));
                },

                train: {
                    weight: 0,
                    exercises: [],
                },
                appendExercise: (exerciseSet: CurrentTrainExerciseSet) => {
                    set((state) => {
                        if (!state.selectedExercise) {
                            return state;
                        }

                        return {
                            train: {
                                ...state.train,
                                exercises: [
                                    ...state.train.exercises,
                                    {
                                        image: state.selectedExercise.imageName,
                                        name: state.selectedExercise.name,
                                        exerciseId: state.selectedExercise.ID,
                                        ...exerciseSet,
                                    },
                                ],
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
