import { ModalNames, Payload, useModalStore } from '@/store/modalStore';

export const useModal = <T extends ModalNames>(modalName: T) => {
    const openM = useModalStore((state) => state.open);
    const closeM = useModalStore((state) => state.close);

    const modals = useModalStore((state) => state.modals);

    const visible = Boolean(modals[modalName]);
    const payload = modals[modalName];

    const open = (
        ...args: Payload<T> extends null ? [payload?: undefined] : [payload: Payload<T>]
    ) => {
        openM(modalName, ...args);
    };
    const close = () => {
        closeM(modalName);
    };

    return {
        visible,
        open,
        close,
        payload,
    };
};
