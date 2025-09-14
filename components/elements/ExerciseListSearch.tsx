import {StyleSheet, Text, View} from 'react-native';
import {ExerciseList} from './ExerciseList';
import {useMemo, useState} from 'react';
import {IExercise} from '@/assets/entity/IExercise';
import {CInput} from '@/components/ui/CInput';
import {Train} from '@/hooks/useTrains';

interface Props {
    count: number;
    exercises: IExercise[];
    onSelect(item: IExercise): void;
    trainsList: Train[];
    trainsIsLoading: boolean;
}

const ExerciseListSearchStyle = StyleSheet.create({
    wrap: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    input: {marginBottom: 15},
    listContainer: {
        flex: 1,
        minHeight: 0, // Важно для правильной работы flex
    },
    emptyText: {
        width: '100%',
        textAlign: 'center',
    },
});

export function ExerciseListSearch(props: Props) {
    const [searchValue, setSearchValue] = useState<string>('');

    const filteredExercises = useMemo<IExercise[]>(() => {
        const searchValueLower = searchValue.toLowerCase();

        return props.exercises.filter((ex) => {
            const nameLower = ex.name.toLowerCase();

            if (searchValueLower.trim() === '') {
                return true;
            }

            return nameLower.includes(searchValueLower);
        });
    }, [props.exercises, searchValue]);

    return (
        <View style={ExerciseListSearchStyle.wrap}>
            <CInput
                style={ExerciseListSearchStyle.input}
                value={searchValue}
                onInput={setSearchValue}
                placeholder="Поиск"
            />

            <View style={[ExerciseListSearchStyle.listContainer]}>
                {filteredExercises.length > 0 && (
                    <ExerciseList
                        trainsList={props.trainsList}
                        trainsIsLoading={props.trainsIsLoading}
                        exercises={filteredExercises}
                        count={4}
                        onPress={props.onSelect}
                    />
                )}

                {filteredExercises.length === 0 && (
                    <Text style={ExerciseListSearchStyle.emptyText}>Пусто</Text>
                )}
            </View>
        </View>
    );
}
