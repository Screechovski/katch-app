import { useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '@/shared/ui/Button';
import { CLoader } from '@/shared/ui/CLoader';
import { TAB_CONTENT_PADDING } from '@/constants/App';
import { useTabContentBottomPadding } from '@/hooks/useTabContentBottomPadding';
import { workoutColors as colors, workoutFonts as fonts } from '@/shared/ui/workout/theme';
import { HistoryCard } from '@/entities/train';
import { Storage } from '@/helpers/Storage';
import { RemoveTrainApproveModal } from '@/components/modal/RemoveTrainApproveModal';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ApiV2, TrainV2 } from '@/helpers/api/v2';

export default function HistoryPage() {
    const bottomPadding = useTabContentBottomPadding();
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
        return trains.data?.pages.flatMap((page) => page?.items ?? []) ?? [];
    }, [trains.data]);

    const emptyMessage = trains.data?.pages[0] === null
        ? 'История доступна после входа'
        : 'Тренировок пока нет';

    return (
        <>
            <FlatList
                contentContainerStyle={[styles.list, { paddingBottom: bottomPadding }]}
                refreshing={trains.isRefetching}
                onRefresh={() => void trains.refetch()}
                onEndReached={() => {
                    if (trains.hasNextPage && !trains.isFetching) void trains.fetchNextPage();
                }}
                onEndReachedThreshold={0.4}
                data={trainsItems}
                keyExtractor={(item) => String(item.id)}
                ItemSeparatorComponent={HistorySeparator}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <View style={styles.icon}>
                            <MaterialCommunityIcons aria-hidden name="history" size={24} color={colors.mintDark} />
                        </View>
                        <Text accessibilityRole="header" style={styles.title}>История тренировок</Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        {trains.isPending && <CLoader color={colors.accentFill} />}
                        <Text accessibilityLiveRegion="polite" style={styles.message}>
                            {trains.isPending ? 'Загружаем тренировки' : trains.isError ? 'Не удалось загрузить историю' : emptyMessage}
                        </Text>
                        {trains.isError && (
                            <Button variant="secondary" onPress={() => void trains.refetch()}>Повторить</Button>
                        )}
                    </View>
                }
                ListFooterComponent={trains.isFetchingNextPage ? (
                    <View style={styles.loader}><CLoader color={colors.accentFill} /></View>
                ) : null}
                renderItem={({ item }) => <HistoryCard train={item} remove={setTrainForRemove} />}
            />

            <RemoveTrainApproveModal
                onClose={() => setTrainForRemove(null)}
                onRemove={removeTrain}
                trainDate={trainForRemove?.date.substring(0, 10)}
                visible={trainForRemove !== null}
            />
        </>
    );
}

function HistorySeparator() {
    return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
    list: TAB_CONTENT_PADDING,
    header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    icon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: colors.mint,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: { fontFamily: fonts.semibold, fontSize: 23, lineHeight: 29, color: colors.ink, flexShrink: 1 },
    separator: { height: 12 },
    empty: {
        alignItems: 'center',
        gap: 12,
        padding: 24,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    message: { fontFamily: fonts.medium, fontSize: 14, color: colors.muted, textAlign: 'center' },
    loader: { paddingTop: 16 },
});
