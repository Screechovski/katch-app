import React, { useMemo, useState } from 'react';
import { Alert, Text, FlatList } from 'react-native';
import { CWrapper } from '@/components/ui/CWrapper';
import { HistoryCard } from '@/components/HistoryCard';
import { Storage } from '@/helpers/Storage';
import { RemoveTrainApproveModal } from '@/components/modal/RemoveTrainApproveModal';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ApiV2, TrainV2 } from '@/helpers/api/v2';

export default function HistoryPage() {
    const loadTrains = async (page: number) => {
        const token = await Storage.getData<string>(Storage.token);

        if (token) {
            return ApiV2.trains(token, page);
        } else {
            return null;
        }
    };

    const trains = useInfiniteQuery({
        queryKey: ['trains'],
        initialPageParam: 1,
        queryFn: ({ pageParam = 1 }) => loadTrains(pageParam),
        getNextPageParam: (lastPage) => {
            if (
                lastPage &&
                lastPage.items.length &&
                lastPage.page * lastPage.count < lastPage.total
            ) {
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
                await ApiV2.removeTrain(token, trainForRemove.id);
                setTrainForRemove(null);
                Alert.alert('Успешно');
                trains.refetch();
            }
        } catch (error) {
            Alert.alert('Ошибка', JSON.stringify(error));
        }
    }

    const [trainForRemove, setTrainForRemove] = useState<TrainV2 | null>(null);

    const trainsItems = useMemo(() => {
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
                        <HistoryCard key={item.id} train={item} remove={setTrainForRemove} />
                    )}
                />
            )}

            <RemoveTrainApproveModal
                onClose={() => setTrainForRemove(null)}
                onRemove={removeTrain}
                trainDate={trainForRemove?.date.substring(0, 10)}
                visible={trainForRemove !== null}
            />
        </CWrapper>
    );
}
