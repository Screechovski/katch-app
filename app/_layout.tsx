import React from 'react';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import 'react-native-reanimated';
import {useEffect, useState} from 'react';
import {useColorScheme} from '@/hooks/useColorScheme';
import HomeScreen from '@/app/index';
import HistoryPage from '@/app/history';
import {RootLayout as RootLayoutBase} from '@/components/RootLayout';
import {ICurrentApproach} from '@/assets/entity/ICurrentApproach';
import {getExercises, IExercise} from '@/assets/entity/IExercise';
import {useTrains} from '@/hooks/useTrains';
import {refactorStorageData} from '@/helpers/refactorStorage';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const trains = useTrains();

    const [page, setPage] = useState('home');

    const [exercises, setExercises] = useState<IExercise[]>([]);
    const [approaches, setApproaches] = useState<ICurrentApproach[]>([]);

    useEffect(() => {
        setExercises(getExercises());
        trains.load();
    }, []);
    const setApproachesProxy: React.Dispatch<React.SetStateAction<ICurrentApproach[]>> = (
        approaches,
    ) => {
        setApproaches(approaches);
    };

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
                                trainsList={trains.list}
                                trainsIsLoading={trains.isLoading}
                                exercises={exercises}
                                approaches={approaches}
                                setApproaches={setApproachesProxy}
                                saveTrains={trains.save}
                                loadTrains={trains.load}
                            />
                        ),
                    },
                    {
                        id: 'history',
                        iconName: 'leftsquare',
                        title: 'история',
                        component: (
                            <HistoryPage
                                trainsList={trains.list}
                                removeTrain={trains.remove}
                                isLoading={trains.isLoading}
                            />
                        ),
                    },
                ]}
                activeTabId={page}
                onChangeActiveTabId={setPage}
            />
        </ThemeProvider>
    );
}
