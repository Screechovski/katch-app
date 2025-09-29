import React, { useState } from 'react';
import { Alert, Text, ScrollView } from 'react-native';
import { CWrapper } from '@/components/ui/CWrapper';
import { CLoader } from '@/components/ui/CLoader';
import { LoadBackupModal } from '@/components/elements/LoadBackupModal';
import { FilterChips } from '@/components/FilterChips';
import { HistoryCard } from '@/components/HistoryCard';
import { Storage } from '@/helpers/Storage';
import { Api } from '@/helpers/Api';
import { useQuery } from '@tanstack/react-query';

export default function HistoryPage() {
    const [loadBackupIsVisible, setLoadBackupIsVisible] = useState(false);
    const [filterExerciseIds, setFilterExerciseIds] = useState<number[]>([]);

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
            // TODO await props.removeTrain(date);
            Alert.alert('Успешно');
        } catch (error) {
            Alert.alert('Ошибка', JSON.stringify(error));
        }
    }

    function addFilter(id: number) {
        if (filterExerciseIds.includes(id)) {
            return;
        }

        setFilterExerciseIds((prev) => [...prev, id]);
    }

    function removeFilter(exerciseId: number) {
        setFilterExerciseIds((prev) => prev.filter((id) => id !== exerciseId));
    }

    const loadTrains = async () => {
        const token = await Storage.getData<string>(Storage.token);
        console.log('loadTrains', token);

        if (token) {
            return Api.trains(token);
        } else {
            return null;
        }
    };

    const trains = useQuery({
        queryKey: ['trains'],
        queryFn: loadTrains,
    });

    return (
        <CWrapper>
            <LoadBackupModal
                visible={loadBackupIsVisible}
                onHide={() => setLoadBackupIsVisible(false)}
            />

            <FilterChips
                filterExerciseIds={filterExerciseIds}
                onRemoveFilter={removeFilter}
            />

            {trains.isFetching && <CLoader />}

            {trains.data && (
                <ScrollView>
                    {trains.data.map((train) => (
                        <HistoryCard
                            key={train.id}
                            train={train}
                            updateDateTime={updateDateTime}
                            addFilter={addFilter}
                            removeLocal={removeLocal}
                        />
                    ))}
                </ScrollView>
            )}

            {!trains.isFetching && trains.data?.length === 0 && (
                <Text>Пусто.</Text>
            )}
        </CWrapper>
    );
}
