import { CInput } from '@/components/ui/CInput';
import { useMemo, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ExerciseList } from './ExerciseList';
import { ExerciseServer } from '@/types/ExerciseServer';

interface Props {
    style?: StyleProp<ViewStyle>;
    width?: number;
    loading: boolean;
    exercises: ExerciseServer[];
    onSelect(item: ExerciseServer): void;
}

const style = StyleSheet.create({
    wrap: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    input: { marginBottom: 15 },
    listContainer: {
        flex: 1,
        minHeight: 0, // Важно для правильной работы flex
    },
});

export function ExerciseListSearch(props: Props) {
    const [searchValue, setSearchValue] = useState('');

    const filteredExercises = useMemo<ExerciseServer[]>(() => {
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
        <View style={[props.style, style.wrap]}>
            <CInput
                style={style.input}
                value={searchValue}
                onInput={setSearchValue}
                placeholder="Поиск"
            />

            <View style={style.listContainer}>
                <ExerciseList
                    width={props.width}
                    loading={props.loading}
                    exercises={filteredExercises}
                    onPress={props.onSelect}
                />
            </View>
        </View>
    );
}
