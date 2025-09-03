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
import {ICurrentApproach} from '@/assets/entity/ICurrentApproach';
import {getExercises, IExercise} from '@/assets/entity/IExercise';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();

    const [page, setPage] = useState('home');

    const [exercises, setExercises] = useState<IExercise[]>([]);
    const [approaches, setApproaches] = useState<ICurrentApproach[]>([]);

    SplashScreen.hideAsync();

    useEffect(() => {
        setExercises(getExercises());
    }, []);

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootLayoutBase
                tabs={[
                    {
                        id: 'home',
                        iconName: 'plussquare',
                        title: 'добавить',
                        component: (
                            <HomeScreen
                                exercises={exercises}
                                approaches={approaches}
                                setApproaches={setApproaches}
                            />
                        ),
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
