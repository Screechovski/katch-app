import HistoryPage from '@/app/history';
import HomeScreen from '@/app/index';
import { ICurrentApproach } from '@/assets/entity/ICurrentApproach';
import { getExercises, IExercise } from '@/assets/entity/IExercise';
import { RootLayout as RootLayoutBase } from '@/components/RootLayout';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useExercises } from '@/hooks/useExercises';
import { useTrains } from '@/hooks/useTrains';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const trains = useTrains();

    const [page, setPage] = useState('home');

    const [exercises, setExercises] = useState<IExercise[]>([]);
    const [approaches, setApproaches] = useState<ICurrentApproach[]>([]);

    const ex = useExercises();

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
                        iconName: 'plus-circle',
                        title: 'добавить',
                        component: (
                            <HomeScreen
                                trainsList={trains.list}
                                trainsIsLoading={trains.isLoading}
                                exercisesIsLoading={ex.loading}
                                exercises={ex.data}
                                approaches={approaches}
                                setApproaches={setApproachesProxy}
                                saveTrains={trains.save}
                                loadTrains={trains.load}
                            />
                        ),
                    },
                    {
                        id: 'history',
                        iconName: 'history',
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
