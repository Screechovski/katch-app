import { CurrentTrainExercise } from '@/store/currentTrainStore';
import { create } from 'zustand';

type ModalState = {
    modals: {
        settingsHideExercises: null | {};
        weightInput: null | {
            setWeight(n: number): void;
        };
        exerciseParametersSelector: null | {
            imageName: string;
            exerciseId: number;
            exerciseName: string;
            onComplete(params: CurrentTrainExercise): void;
        };
    };
};
export type ModalNames = keyof ModalState['modals'];
export type Payload<T extends ModalNames> = ModalState['modals'][T];
type ModalActions = {
    open: <T extends ModalNames>(
        name: T,
        ...args: ModalState['modals'][T] extends null
            ? [payload?: undefined]
            : [payload: ModalState['modals'][T]]
    ) => void;
    close: (key: ModalNames) => void;
};

export const useModalStore = create<ModalState & ModalActions>((set, get) => ({
    modals: {
        settingsHideExercises: null,
        weightInput: null,
        exerciseParametersSelector: null,
    },
    open: (name, ...args) => {
        set((state) => {
            if (state.modals[name]) return state;

            return {
                modals: {
                    ...state.modals,
                    [name]: args[0] ?? null,
                },
            };
        });
    },
    close: (name) => {
        set((state) => ({
            modals: {
                ...state.modals,
                [name]: null,
            },
        }));
    },
}));
