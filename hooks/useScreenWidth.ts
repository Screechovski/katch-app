import { APP_MAX_WIDTH } from '@/constants/App';
import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

export const useScreenSize = () => {
    const dimensions = useWindowDimensions();
    const width = useMemo(() => {
        if (dimensions.width > APP_MAX_WIDTH) return APP_MAX_WIDTH;
        return dimensions.width;
    }, [dimensions.width]);
    return {
        width,
        height: dimensions.height,
    };
};
