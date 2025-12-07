import { CLoader } from '@/components/ui/CLoader';
import {
    FlatList,
    StyleProp,
    Text,
    useWindowDimensions,
    View,
    ViewStyle,
} from 'react-native';
import { ExerciseCardVertical } from './ExerciseCardVertical';
import { ExerciseServer } from '@/models/ExerciseServer';
import { Api } from '@/helpers/Api';
import { useMemo } from 'react';

interface Props {
    width?: number;
    exercises: ExerciseServer[];
    loading: boolean;
    style?: StyleProp<ViewStyle>;
    onPress(item: ExerciseServer): void;
    onRefresh?: () => void;
}

export function ExerciseList(props: Props) {
    const count = 3;
    const { width } = useWindowDimensions();

    const itemWidth = useMemo(() => {
        const parentWidth = props.width ?? width;

        return parentWidth / count;
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
                <View style={{ width: itemWidth, padding: 2, borderRadius: 6 }}>
                    <ExerciseCardVertical
                        onPress={() => props.onPress(item)}
                        photo={{
                            uri: Api.getPhotoUrl(item.imageName),
                        }}
                        name={item.name}
                        id={item.ID}
                    />
                </View>
            )}
            maxToRenderPerBatch={15}
            numColumns={count}
            keyExtractor={(item) => item.ID.toString()}
            columnWrapperStyle={{
                justifyContent: 'space-between',
            }}
            showsVerticalScrollIndicator={false}
            onRefresh={onRefresh}
            refreshing={props.loading}
        />
    );
}
