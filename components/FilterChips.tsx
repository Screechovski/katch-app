import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Colors } from '@/constants/Theme';
import { MaterialIcons } from '@expo/vector-icons';
import { ExerciseServer } from '@/types/ExerciseServer';

interface FilterChipsProps {
    filterExercises: ExerciseServer[];
    onRemoveFilter: (exerciseId: number) => void;
}

export function FilterChips({
    filterExercises,
    onRemoveFilter,
}: FilterChipsProps) {
    if (filterExercises.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.chipsContainer}>
                {filterExercises.map((ex) => {
                    return (
                        <Pressable
                            key={ex.id}
                            style={styles.chip}
                            onPress={() => onRemoveFilter(ex.id)}
                        >
                            <Text style={styles.chipText}>{ex.name}</Text>

                            <MaterialIcons
                                style={styles.removeIcon}
                                name={'close'}
                                size={14}
                                color={styles.removeIcon.color}
                            />
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.info.i6,
        paddingHorizontal: 3,
        borderRadius: 8,
        borderWidth: 3,
        borderColor: Colors.info.i7,
    },
    chipText: {
        fontSize: 14,
        color: Colors.light.i2,
    },
    removeIcon: {
        fontWeight: 'bold',
        color: Colors.light.i2,
        marginLeft: 3,
    },
});
