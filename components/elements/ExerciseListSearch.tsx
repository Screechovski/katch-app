import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {ExerciseList} from './ExerciseList';
import {useMemo, useState} from 'react';
import {getExercises, IExercise} from '@/assets/entity/IExercise';
import {CInput} from '@/components/ui/CInput';

interface Props {
    count: number;

    onSelect(item: IExercise): void;
}

const ExerciseListSearchStyle = StyleSheet.create({
    wrap: {},
    input: {marginBottom: 15},
    emptyText: {
        width: '100%',
        textAlign: 'center',
    },
});

export function ExerciseListSearch(props: Props) {
    const [searchValue, setSearchValue] = useState<string>('');
    const exercises = getExercises();
    const {height} = useWindowDimensions();

    const filteredExercises = useMemo<IExercise[]>(() => {
        // const searchValueLower = searchValue.toLowerCase();

        return exercises;
        // .filter((ex) => {
        //     const nameLower = ex.name.toLowerCase();

        //     return !nameLower.includes(searchValueLower) && searchValueLower !== '';
        // });
    }, [searchValue]);

    return (
        <View style={ExerciseListSearchStyle.wrap}>
            <View style={{borderWidth: 1, borderColor: 'red'}}>
                <CInput
                    style={ExerciseListSearchStyle.input}
                    value={searchValue}
                    onInput={setSearchValue}
                    placeholder="Поиск"
                />
            </View>

            <View style={{height: height - 200, borderWidth: 1, borderColor: 'red'}}>
                {filteredExercises.length > 0 && (
                    <ExerciseList
                        exercises={filteredExercises}
                        count={4}
                        onPress={props.onSelect}
                    />
                )}
            </View>

            {filteredExercises.length === 0 && (
                <Text style={ExerciseListSearchStyle.emptyText}>Пусто</Text>
            )}
        </View>
    );
}
