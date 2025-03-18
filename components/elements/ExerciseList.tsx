import {Dimensions, FlatList, SafeAreaView, StyleProp} from "react-native";
import {useMemo} from "react";
import {ExerciseCardVertical} from "./ExerciseCardVertical";
import {getSortedExercises, IExercise} from "@/assets/entity/IExercise";
import { useTrains } from "@/hooks/useTrains";

const {width} = Dimensions.get("window");

interface Props {
    count?: number;
    exercises?: IExercise[];
    style?: StyleProp<FlatList>;
    onPress?(item: IExercise): void;
}

export function ExerciseList(props: Props) {
    const {list} = useTrains();

    const style = useMemo(() => {
        if (props.style) {
            return props.style;
        }
        return {};
    }, [props.style]);

    const count = useMemo(() => {
        if ("count" in props && typeof props.count === "number") {
            return props.count;
        }
        return 3;
    }, [props.count]);

    function pressHandler(item: IExercise) {
        if ("onPress" in props && typeof props.onPress === "function") {
            props.onPress(item);
        }
    }

    const exercises = useMemo(() => {
        if (props.exercises) {
            return props.exercises;
        }
        return getSortedExercises();
    }, [props.exercises, list]);

    function sortObjectsByOccurrences<T extends Record<'id', number>>(objects: T[], ids: number[]): T[] {
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

    const sortedExercises = useMemo(() => {
        return sortObjectsByOccurrences(
            exercises,
            list.map(item => item.exercises.map(ex => ex.exercise)).flat()
        )
    }, [exercises, list])


    const itemWidth = (width - 30) / count;

    return (
        <SafeAreaView style={{flex: 1}}>
            <FlatList
                data={sortedExercises}
                style={style}
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
                key={count}
            />
        </SafeAreaView>
    );
}
