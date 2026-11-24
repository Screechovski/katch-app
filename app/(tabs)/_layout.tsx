import { workoutColors as colors } from '@/shared/ui/workout/theme';
import { TAB_BAR_MIN_BOTTOM_INSET } from '@/constants/App';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, I18nManager, Platform, StyleSheet, View } from 'react-native';

const BAR_HEIGHT = 64;
const INDICATOR_HEIGHT = 44;
const MAX_INDICATOR_WIDTH = 64;

const tabs = [
    { name: 'index', title: 'Добавить', icon: 'plus-circle-outline' },
    { name: 'history', title: 'История', icon: 'history' },
    { name: 'statistic', title: 'Статистика', icon: 'chart-bar' },
    { name: 'profile', title: 'Профиль', icon: 'account-outline' },
] as const;

function FloatingTabBar(props: BottomTabBarProps) {
    const { insets, state } = props;
    const [width, setWidth] = useState(0);
    const [progress] = useState(() => new Animated.Value(state.index));
    const sideInset = Math.max(insets.left, insets.right);
    const tabWidth = Math.max(0, (width - 2 * sideInset) / state.routes.length);
    const indicatorWidth = Math.min(MAX_INDICATOR_WIDTH, tabWidth);

    useEffect(() => {
        let active = true;
        let animation: Animated.CompositeAnimation | undefined;

        void AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
            if (!active) return;

            animation = Animated.timing(progress, {
                toValue: state.index,
                duration: reduceMotion ? 0 : 240,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: Platform.OS !== 'web',
            });
            animation.start();
        });

        return () => {
            active = false;
            animation?.stop();
        };
    }, [progress, state.index]);

    return (
        <View style={[styles.overlay, { bottom: Math.max(TAB_BAR_MIN_BOTTOM_INSET, insets.bottom) }]}>
            <View style={styles.frame} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
                {indicatorWidth > 0 && (
                    <Animated.View
                        aria-hidden
                        style={[
                            styles.indicator,
                            {
                                width: indicatorWidth,
                                start: sideInset + (tabWidth - indicatorWidth) / 2,
                                transform: [{ translateX: Animated.multiply(progress, I18nManager.isRTL ? -tabWidth : tabWidth) }],
                            },
                        ]}
                    />
                )}
                <BottomTabBar {...props} />
            </View>
        </View>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <FloatingTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                sceneStyle: styles.screen,
                tabBarShowLabel: false,
                tabBarLabelPosition: 'beside-icon',
                tabBarActiveTintColor: colors.mintDark,
                tabBarInactiveTintColor: colors.muted,
                tabBarIconStyle: styles.iconSlot,
                tabBarStyle: styles.bar,
            }}
        >
            {tabs.map(({ name, title, icon }) => (
                <Tabs.Screen
                    key={name}
                    name={name}
                    options={{
                        title,
                        tabBarAccessibilityLabel: title,
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons aria-hidden name={icon} size={25} color={color} />
                        ),
                    }}
                />
            ))}
        </Tabs>
    );
}

const styles = StyleSheet.create({
    screen: { backgroundColor: colors.canvas },
    overlay: { position: 'absolute', left: 0, right: 0, zIndex: 1, pointerEvents: 'box-none' },
    frame: {
        alignSelf: 'center',
        width: '92%',
        maxWidth: 440,
        borderRadius: 22,
        outlineStyle: 'solid',
        outlineWidth: 1,
        outlineOffset: -1,
        outlineColor: colors.border,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        boxShadow: '0 4px 16px rgba(23, 44, 35, 0.08)',
    },
    bar: {
        height: BAR_HEIGHT,
        paddingTop: 4,
        paddingBottom: 4,
        borderTopWidth: 0,
        backgroundColor: 'transparent',
        elevation: 0,
    },
    iconSlot: { width: '100%', height: INDICATOR_HEIGHT },
    indicator: {
        position: 'absolute',
        top: (BAR_HEIGHT - INDICATOR_HEIGHT) / 2,
        height: INDICATOR_HEIGHT,
        borderRadius: 14,
        backgroundColor: colors.mint,
        pointerEvents: 'none',
    },
});
