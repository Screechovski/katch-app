import {FlatList, StyleProp, Text, useWindowDimensions} from 'react-native';
import {useEffect, useMemo} from 'react';
import {ExerciseCardVertical} from './ExerciseCardVertical';
import {getSortedExercises, IExercise} from '@/assets/entity/IExercise';
import {useTrains} from '@/hooks/useTrains';
import {CLoader} from '@/components/ui/CLoader';

interface Props {
    count: number;
    exercises: IExercise[];
    onPress(item: IExercise): void;
}

export function ExerciseList(props: Props) {
    const trains = useTrains();
    const {width} = useWindowDimensions();

    const count = useMemo(() => {
        if (props.count) {
            return props.count;
        }

        return 3;
    }, [props.count]);

    function pressHandler(item: IExercise) {
        if ('onPress' in props && typeof props.onPress === 'function') {
            props.onPress(item);
        }
    }

    function sortObjectsByOccurrences<T extends Record<'id', number>>(
        objects: T[],
        ids: number[],
    ): T[] {
        const idCounts = ids.reduce((counts: any, id) => {
            counts[id] = (counts[id] || 0) + 1;
            return counts;
        }, {});

        return objects.sort((a, b) => {
            const countA = idCounts[a.id] || 0;
            const countB = idCounts[b.id] || 0;
            return countB - countA;
        });
    }

    const sortedExercises = useMemo(
        () =>
            sortObjectsByOccurrences(
                props.exercises,
                trains.list.map((item) => item.exercises.map((ex) => ex.exercise)).flat(),
            ),
        [props.exercises, trains.list],
    );

    const itemWidth = width / count; // Вычисляем ширину элемента

    if (trains.isLoading) {
        return <CLoader />;
    }

    return (
        <FlatList
            data={sortedExercises}
            renderItem={({item}) => (
                <ExerciseCardVertical
                    onPress={() => pressHandler(item)}
                    style={{width: itemWidth}}
                    photo={item.photo}
                    name={item.name}
                    id={item.id}
                    count={item.count}
                />
            )}
            numColumns={count}
            keyExtractor={(item) => item.id.toString()}
            columnWrapperStyle={{
                justifyContent: 'space-between',
            }}
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
        />
    );
}
