import React, { useMemo, useState } from 'react';
import { Alert, Text, ScrollView, FlatList } from 'react-native';
import { CWrapper } from '@/components/ui/CWrapper';
import { CLoader } from '@/components/ui/CLoader';
import { LoadBackupModal } from '@/components/elements/LoadBackupModal';
import { FilterChips } from '@/components/FilterChips';
import { HistoryCard } from '@/components/HistoryCard';
import { Storage } from '@/helpers/Storage';
import { Api } from '@/helpers/Api';
import { useQuery } from '@tanstack/react-query';
import { ExerciseServer } from '@/types/ExerciseServer';
import { RemoveTrainApproveModal } from '@/components/RemoveTrainApproveModal';
import { TrainServer } from '@/types/TrainsServer';

export default function HistoryPage() {
    const loadTrains = async () => {
        const token = await Storage.getData<string>(Storage.token);

        if (token) {
            return Api.trains(token);
        } else {
            return null;
        }
    };

    const trains = useQuery({
        queryKey: ['trains'],
        queryFn: loadTrains,
        refetchOnMount: 'always',
    });

    const [loadBackupIsVisible, setLoadBackupIsVisible] = useState(false);
    const [filterExercises, setFilterExercises] =
        useState<ExerciseServer | null>(null);

    function updateDateTime(dateString: string) {
        const date = new Date(dateString);
        const daysOfWeek = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dayOfWeek = daysOfWeek[date.getDay()];

        return `${dayOfWeek} ${day}.${month}`;
    }

    async function removeTrain() {
        if (!trainForRemove) {
            return;
        }

        try {
            const token = await Storage.getData<string>(Storage.token);

            if (token) {
                await Api.removeTrain(token, trainForRemove.ID);
                setTrainForRemove(null);
                Alert.alert('Успешно');
                trains.refetch();
            }
        } catch (error) {
            Alert.alert('Ошибка', JSON.stringify(error));
        }
    }

    function addFilter(_ex: ExerciseServer) {
        if (filterExercises?.ID === _ex.ID) {
            return;
        }

        setFilterExercises(_ex);
    }

    const [trainForRemove, setTrainForRemove] = useState<TrainServer | null>(
        null,
    );

    const filteredTrains = useMemo(() => {
        if (filterExercises === null) {
            return trains.data;
        }

        return (trains.data || [])
            .map((train) => ({
                ...train,
                Sets: train.Sets.filter((set) => {
                    return set.exerciseId === filterExercises.ID;
                }),
            }))
            .filter((train) => {
                return !!train.Sets.length;
            });
    }, [trains.data, filterExercises]);

    return (
        <CWrapper>
            {filterExercises && (
                <FilterChips
                    name={filterExercises.name}
                    onRemoveFilter={() => setFilterExercises(null)}
                />
            )}

            {trains.data && (
                <FlatList
                    refreshing={trains.isFetching}
                    onRefresh={trains.refetch}
                    data={filteredTrains}
                    ListEmptyComponent={<Text>Пусто.</Text>}
                    renderItem={({ item }) => (
                        <HistoryCard
                            key={item.ID}
                            train={item}
                            updateDateTime={updateDateTime}
                            setFilterExercises={addFilter}
                            isControlsVisible={filterExercises === null}
                            remove={setTrainForRemove}
                        />
                    )}
                />
            )}

            <RemoveTrainApproveModal
                onClose={() => setTrainForRemove(null)}
                onRemove={removeTrain}
                trainWeight={trainForRemove?.UserWeight}
                visible={trainForRemove !== null}
            />

            <LoadBackupModal
                visible={loadBackupIsVisible}
                onHide={() => setLoadBackupIsVisible(false)}
            />
        </CWrapper>
    );
}
