import { create } from 'zustand';

type SystemState = {
    isOffline: boolean;
    setOffline: () => void;
};

export const useSystemStore = create<SystemState>((set) => ({
    isOffline: false,
    setOffline: () => {
        set(() => ({
            isOffline: true,
        }));
    },
}));
