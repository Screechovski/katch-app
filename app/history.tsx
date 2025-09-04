import React, {useEffect, useState, useMemo} from 'react';
import {StyleSheet, Alert, View, Text, ScrollView, Pressable} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {CIconButton} from '@/components/ui/CIconButton';
import {CWrapper} from '@/components/ui/CWrapper';
import {CLoader} from '@/components/ui/CLoader';
import {RemoveTrain, Train} from '@/hooks/useTrains';
import {LoadBackupModal} from '@/components/elements/LoadBackupModal';
import {FilterChips} from '@/components/FilterChips';
import {HistoryCard} from '@/components/HistoryCard';

interface Props {
    trainsList: Train[];
    removeTrain: RemoveTrain;
    isLoading: boolean;
}
export default function HistoryPage(props: Props) {
    const [loadBackupIsVisible, setLoadBackupIsVisible] = useState(false);
    const [filterExerciseIds, setFilterExerciseIds] = useState<number[]>([]);

    async function handleCopy() {
        try {
            await Clipboard.setStringAsync(btoa(JSON.stringify(props.trainsList)));
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
            await props.removeTrain(date);
            Alert.alert('Успешно');
        } catch (error) {
            Alert.alert('Ошибка', JSON.stringify(error));
        }
    }

    const filteredTrains = useMemo(() => {
        if (filterExerciseIds.length === 0) {
            return props.trainsList;
        }

        return props.trainsList
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
    }, [props.trainsList, filterExerciseIds]);

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
            <CIconButton
                style={styles.copy}
                size={'s'}
                disabled={props.trainsList.length === 0}
                onPress={handleCopy}
                name={'download'}
            />

            <LoadBackupModal
                visible={loadBackupIsVisible}
                onHide={() => setLoadBackupIsVisible(false)}
            />

            <FilterChips
                filterExerciseIds={filterExerciseIds}
                onRemoveFilter={removeFilter}
            />

            {props.isLoading && <CLoader />}

            {!props.isLoading && (
                <ScrollView>
                    {filteredTrains.map((train, trainKey) => (
                        <HistoryCard
                            key={trainKey}
                            train={train}
                            updateDateTime={updateDateTime}
                            addFilter={addFilter}
                            removeLocal={removeLocal}
                        />
                    ))}
                </ScrollView>
            )}

            {!props.isLoading && props.trainsList.length === 0 && <Text>Пусто.</Text>}
        </CWrapper>
    );
}

const styles = StyleSheet.create({
    copy: {
        marginBottom: 10,
        marginLeft: 'auto',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
