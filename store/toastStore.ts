import { create } from 'zustand';
type Toast = { message: string; id: number; type: 'success' | 'error' };
type ToastState = {
    toasts: Toast[];
    setError: (message: string) => void;
    setSuccess: (message: string) => void;
};

export const useToastStore = create<ToastState>((set) => {
    const setToast = (message: Toast['message'], type: Toast['type']) => {
        const id = setTimeout(() => {
            set((state) => ({
                toasts: state.toasts.filter((t) => t.id !== id),
            }));
        }, 3000);

        set((state) => ({
            toasts: [...state.toasts, { message, id, type }],
        }));
    };

    return {
        toasts: [],
        setError: (message: string) => {
            setToast(message, 'error');
        },
        setSuccess: (message: string) => {
            setToast(message, 'success');
        },
    };
});
