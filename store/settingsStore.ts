import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsState = {
    isWeightAfterTrain: boolean;
    isHistoryInExerciseSelector: boolean;
};

type SettingsActions = {
    toggle: (key: keyof SettingsState) => void;
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
    persist(
        (set) => ({
            isWeightAfterTrain: true,
            isHistoryInExerciseSelector: true,
            toggle: (key) => set((state) => ({ ...state, [key]: !state[key] })),
        }),
        {
            name: 'system-settings',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
