import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export function useGetSchemeWidth() {
    const _width = (279 + 277) / 2;
    const _height = (792 + 777) / 2;
    const diff = _width / _height;

    const { width } = useWindowDimensions();

    const padding = 40;

    return {
        width: useMemo(() => (width - padding) / 2, [width]),
        height: useMemo(() => (width - padding) / 2 / diff, [width]),
    };
}
