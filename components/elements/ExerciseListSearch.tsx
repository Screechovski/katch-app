import { Input } from '@/shared/ui/Input';
import { useMemo, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ExerciseList } from './ExerciseList';
import { ExerciseServer } from '@/entities/exercise';
import { IconButton } from '@/shared/ui/Button';
import { useModal } from '@/hooks/useModal';

interface Props {
    style?: StyleProp<ViewStyle>;
    width?: number;
    bottomPadding?: number;
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
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
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
                <Input
                    style={style.input}
                    label="Поиск упражнений"
                    hideLabel
                    type="search"
                    value={searchValue}
                    onChangeText={setSearchValue}
                    placeholder="Поиск"
                />
                <IconButton
                    label="Настроить список упражнений"
                    icon="tune-variant"
                    variant="secondary"
                    onPress={() => modal.open({})}
                />
            </View>

            <View style={style.listContainer}>
                <ExerciseList
                    width={props.width}
                    bottomPadding={props.bottomPadding}
                    loading={props.loading}
                    exercises={filteredExercises}
                    onPress={props.onSelect}
                    onRefresh={props.onRefresh}
                />
            </View>
        </View>
    );
}
