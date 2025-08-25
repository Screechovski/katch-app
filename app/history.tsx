import React, {useEffect, useState, useMemo} from 'react';
import {StyleSheet, Alert, View, Text, ScrollView, Pressable} from 'react-native';
import * as Clipboard from 'expo-clipboard';

import {CIconButton} from '@/components/ui/CIconButton';
import {CWrapper} from '@/components/ui/CWrapper';
import {useTrains} from '@/hooks/useTrains';
import {getExerciseById, IExercise} from '@/assets/entity/IExercise';
import {LoadBackupModal} from '@/components/elements/LoadBackupModal';
import {useWeight} from '@/hooks/useWeight';
import {FilterChips} from '@/components/FilterChips';
import {HistoryCard} from '@/components/HistoryCard';
import {Colors} from '@/constants/Theme';

export default function TabTwoScreen() {
    const trains = useTrains();
    const weightStorage = useWeight();

    const [loadBackupIsVisible, setLoadBackupIsVisible] = useState(false);
    const [filterExerciseIds, setFilterExerciseIds] = useState<number[]>([]);

    async function handleCopy() {
        try {
            await Clipboard.setStringAsync(btoa(JSON.stringify(trains.list)));
            Alert.alert('Успешно', 'Бэкап скопирован в буфер обмена');
        } catch (error) {
            Alert.alert('Ошибка', JSON.stringify(error));
        }
    }

    function updateDateTime(dateString: string) {
        const date = new Date(dateString);
        const daysOfWeek = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dayOfWeek = daysOfWeek[date.getDay()];

        return `${dayOfWeek} ${day}.${month}`;
    }

    async function removeLocal(date: string) {
        try {
            await trains.remove(date);
            Alert.alert('Успешно');
        } catch (error) {
            Alert.alert('Ошибка', JSON.stringify(error));
        }
    }

    const [weights, setWeights] = useState<Record<string, number>>({});

    useEffect(() => {
        (async () => {
            const weights = await weightStorage.get();

            let sum: Record<string, number> = {};

            for (const w of weights) {
                sum[w.date] = w.weight;
            }

            setWeights(sum);
        })();
    }, []);

    const filteredTrains = useMemo(() => {
        if (filterExerciseIds.length === 0) {
            return trains.list;
        }

        return trains.list
            .filter((train) => {
                return train.exercises.some((exercise) =>
                    filterExerciseIds.includes(exercise.exercise),
                );
            })
            .map((train) => ({
                ...train,
                exercises: train.exercises.filter((exercise) =>
                    filterExerciseIds.includes(exercise.exercise),
                ),
            }));
    }, [trains.list, filterExerciseIds]);

    function addFilter(id: number) {
        if (filterExerciseIds.includes(id)) {
            return;
        }

        setFilterExerciseIds((prev) => [...prev, id]);
    }

    function removeFilter(exerciseId: number) {
        setFilterExerciseIds((prev) => prev.filter((id) => id !== exerciseId));
    }

    return (
        <CWrapper>
            <View style={styles.copy}>
                <CIconButton variant={'success'} onPress={trains.load} name={'sync'} />
                <CIconButton
                    disabled={trains.list.length === 0}
                    onPress={handleCopy}
                    name={'download'}
                />
                <CIconButton
                    onPress={() => setLoadBackupIsVisible(true)}
                    name={'upload'}
                />
            </View>

            <LoadBackupModal
                visible={loadBackupIsVisible}
                onHide={() => setLoadBackupIsVisible(false)}
            />

            <FilterChips
                filterExerciseIds={filterExerciseIds}
                onRemoveFilter={removeFilter}
            />

            <ScrollView>
                {filteredTrains.map((train, trainKey) => (
                    <HistoryCard
                        key={trainKey}
                        train={train}
                        weights={weights}
                        updateDateTime={updateDateTime}
                        addFilter={addFilter}
                        removeLocal={removeLocal}
                    />
                ))}
            </ScrollView>

            {trains.list.length === 0 && <Text>Пусто.</Text>}
        </CWrapper>
    );
}

const styles = StyleSheet.create({
    copy: {
        flexDirection: 'row',
        gap: 5,
        marginBottom: 20,
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
