import { FlatList, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { ExerciseCardVertical, ExerciseServer } from '@/entities/exercise';
import { Api } from '@/helpers/api/v1';
import { useMemo } from 'react';
import { useScreenSize } from '@/hooks/useScreenWidth';

const COLUMN_GAP = 8;

interface Props {
    width?: number;
    bottomPadding?: number;
    exercises: ExerciseServer[];
    loading: boolean;
    style?: StyleProp<ViewStyle>;
    onPress(item: ExerciseServer): void;
    onRefresh?: () => void;
}

export function ExerciseList(props: Props) {
    const count = 3;
    const { width } = useScreenSize();
    const itemWidth = useMemo(() => {
        const parentWidth = props.width ?? width;

        return (parentWidth - COLUMN_GAP * (count - 1)) / count;
    }, [width, props.width]);

    const onRefresh = () => {
        if (props.onRefresh) {
            props.onRefresh();
        }
    };

    if (props.exercises.length === 0) {
        return (
            <Text
                style={{
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                Пусто
            </Text>
        );
    }

    return (
        <FlatList
            style={props.style}
            data={props.exercises}
            renderItem={({ item }) => (
                <ExerciseCardVertical
                    style={{ width: itemWidth }}
                    onPress={() => props.onPress(item)}
                    photo={{ uri: Api.getPhotoUrl(item.imageName) }}
                    name={item.name}
                    id={item.id}
                />
            )}
            maxToRenderPerBatch={15}
            numColumns={count}
            keyExtractor={(item) => item.id.toString()}
            columnWrapperStyle={styles.row}
            contentContainerStyle={[styles.grid, { paddingBottom: props.bottomPadding }]}
            showsVerticalScrollIndicator={false}
            onRefresh={onRefresh}
            refreshing={props.loading}
        />
    );
}

const styles = StyleSheet.create({
    grid: { gap: COLUMN_GAP },
    row: { gap: COLUMN_GAP },
});
