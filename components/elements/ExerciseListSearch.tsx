import { CInput } from '@/components/ui/CInput';
import { useMemo, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ExerciseList } from './ExerciseList';
import { ExerciseServer } from '@/models/ExerciseServer';
import { CIconButton } from '@/components/ui/CIconButton';
import { useModal } from '@/hooks/useModal';

interface Props {
    style?: StyleProp<ViewStyle>;
    width?: number;
    loading: boolean;
    exercises: ExerciseServer[];
    onSelect(item: ExerciseServer): void;
    onRefresh?: () => void;
}

const style = StyleSheet.create({
    wrap: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        flex: 1,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 10,
        gap: 10,
    },
    settingsIcon: {
        height: 50,
        width: 50,
    },
    listContainer: {
        flex: 1,
        minHeight: 0,
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

    const modal = useModal('settingsHideExercises');

    return (
        <View style={[props.style, style.wrap]}>
            <View style={style.header}>
                <CInput
                    style={style.input}
                    value={searchValue}
                    onInput={setSearchValue}
                    placeholder="Поиск"
                />
                <CIconButton
                    style={style.settingsIcon}
                    name="setting"
                    onPress={() => modal.open({})}
                />
            </View>

            <View style={style.listContainer}>
                <ExerciseList
                    width={props.width}
                    loading={props.loading}
                    exercises={filteredExercises}
                    onPress={props.onSelect}
                    onRefresh={props.onRefresh}
                />
            </View>
        </View>
    );
}
