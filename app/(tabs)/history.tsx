import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Text, FlatList } from 'react-native';
import { CWrapper } from '@/components/ui/CWrapper';
import { HistoryCard } from '@/components/HistoryCard';
import { Storage } from '@/helpers/Storage';
import { Api } from '@/helpers/Api';
import { RemoveTrainApproveModal } from '@/components/RemoveTrainApproveModal';
import { TrainServer } from '@/models/TrainsServer';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function HistoryPage() {
    const loadTrains = async (page: number) => {
        const token = await Storage.getData<string>(Storage.token);

        if (token) {
            return Api.trains(token, page);
        } else {
            return null;
        }
    };

    const trains = useInfiniteQuery({
        queryKey: ['trains'],
        initialPageParam: 1,
        queryFn: ({ pageParam = 1 }) => loadTrains(pageParam),
        getNextPageParam: (lastPage) => {
            if (lastPage && lastPage.page * lastPage.limit < lastPage.total) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        getPreviousPageParam: (_, __, firstPageParam) => {
            if (firstPageParam <= 1) {
                return undefined;
            }
            return firstPageParam - 1;
        },
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

    const trainsItems = useMemo<TrainServer[]>(() => {
        if (!trains.data) {
            return [];
        }

        return trains.data.pages
            .filter((page) => page)
            .map((page) => page!.items)
            .flat();
    }, [trains.data]);

    return (
        <CWrapper>
            {trains.data && (
                <FlatList
                    refreshing={trains.isFetching}
                    onRefresh={trains.refetch}
                    onEndReached={() => trains.hasNextPage && trains.fetchNextPage()}
                    onEndReachedThreshold={0.4}
                    data={trainsItems}
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
