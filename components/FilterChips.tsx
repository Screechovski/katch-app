import {StyleSheet, Text, View, Pressable} from 'react-native';
import {getExerciseById} from '@/assets/entity/IExercise';
import {Colors} from '@/constants/Theme';

interface FilterChipsProps {
    filterExerciseIds: number[];
    onRemoveFilter: (exerciseId: number) => void;
}

export function FilterChips({filterExerciseIds, onRemoveFilter}: FilterChipsProps) {
    if (filterExerciseIds.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.chipsContainer}>
                {filterExerciseIds.map((exerciseId) => {
                    const exercise = getExerciseById(exerciseId);
                    return (
                        <Pressable
                            key={exerciseId}
                            style={styles.chip}
                            onPress={() => onRemoveFilter(exerciseId)}>
                            <Text style={styles.chipText}>{exercise?.name}</Text>
                            <Text style={styles.removeIcon}>×</Text>
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
        fontSize: 17,
        fontWeight: 'bold',
        color: Colors.light.i2,
        marginLeft: 3,
    },
});
