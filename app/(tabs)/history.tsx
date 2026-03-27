import React, { useState } from 'react';
import { Alert, Text, FlatList } from 'react-native';
import { CWrapper } from '@/components/ui/CWrapper';
import { HistoryCard } from '@/components/HistoryCard';
import { Storage } from '@/helpers/Storage';
import { Api } from '@/helpers/Api';
import { useQuery } from '@tanstack/react-query';
import { RemoveTrainApproveModal } from '@/components/RemoveTrainApproveModal';
import { TrainServer } from '@/models/TrainsServer';

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

    const [trainForRemove, setTrainForRemove] = useState<TrainServer | null>(null);

    return (
        <CWrapper>
            {trains.data && (
                <FlatList
                    refreshing={trains.isFetching}
                    onRefresh={trains.refetch}
                    data={trains.data?.items || []}
                    ListEmptyComponent={<Text>Пусто.</Text>}
                    renderItem={({ item }) => (
                        <HistoryCard key={item.ID} train={item} remove={setTrainForRemove} />
                    )}
                />
            )}

            <RemoveTrainApproveModal
                onClose={() => setTrainForRemove(null)}
                onRemove={removeTrain}
                trainDate={trainForRemove?.Date}
                visible={trainForRemove !== null}
            />
        </CWrapper>
    );
}
