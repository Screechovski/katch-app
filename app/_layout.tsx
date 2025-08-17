import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import 'react-native-reanimated';
import {useFonts} from 'expo-font';
import {useEffect, useState} from 'react';
import {useColorScheme} from '@/hooks/useColorScheme';
import HomeScreen from '@/app/index';
import TabTwoScreen from '@/app/history';
import {RootLayout as RootLayoutBase} from '@/components/RootLayout';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const [page, setPage] = useState('home');

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootLayoutBase
                tabs={[
                    {
                        id: 'home',
                        iconName: 'plussquare',
                        title: 'добавить',
                        component: <HomeScreen />,
                    },
                    {
                        id: 'history',
                        iconName: 'leftsquare',
                        title: 'история',
                        component: <TabTwoScreen />,
                    },
                ]}
                activeTabId={page}
                onChangeActiveTabId={setPage}
            />
        </ThemeProvider>
    );
}
