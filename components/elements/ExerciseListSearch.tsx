import { CInput } from '@/components/ui/CInput';
import { ExercisesServer } from '@/hooks/useExercises';
import { Train } from '@/hooks/useTrains';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExerciseList } from './ExerciseList';

interface Props {
    count: number;
    exercises: ExercisesServer[];
    onSelect(item: ExercisesServer): void;
    trainsList: Train[];
    loading: boolean;
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
});

export function ExerciseListSearch(props: Props) {
    const [searchValue, setSearchValue] = useState<string>('');

    const filteredExercises = useMemo<ExercisesServer[]>(() => {
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
                <ExerciseList
                    trainsList={props.trainsList}
                    loading={props.loading}
                    exercises={filteredExercises}
                    count={4}
                    onPress={props.onSelect}
                />
            </View>
        </View>
    );
}
