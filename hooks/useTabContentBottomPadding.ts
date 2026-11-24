import { TAB_BAR_MIN_BOTTOM_INSET, TAB_CONTENT_PADDING } from '@/constants/App';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useTabContentBottomPadding() {
    const tabBarHeight = useBottomTabBarHeight();
    const { bottom } = useSafeAreaInsets();

    return (
        TAB_CONTENT_PADDING.paddingBottom +
        tabBarHeight +
        Math.max(TAB_BAR_MIN_BOTTOM_INSET, bottom)
    );
}
