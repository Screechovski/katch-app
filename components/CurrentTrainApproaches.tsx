import { StyleSheet, Text, View } from 'react-native';
import { IconButton } from '@/shared/ui/Button';
import { Colors } from '@/constants/Theme';
import { CHr } from '@/shared/ui/CHr';
import { CurrentTrainExercise } from '@/store/currentTrainStore';
import { prettySetParams } from '@/helpers/PrettySetParams';

interface CurrentTrainApproachesProps {
    exercises: CurrentTrainExercise[];
    onDelete: (index: number) => void;
}

export function CurrentTrainApproaches({ exercises, onDelete }: CurrentTrainApproachesProps) {
    return (
        <>
            <View style={styles.list}>
                {exercises.map((exercise, index) => (
                    <View key={index} style={styles.approach}>
                        <View style={styles.approachText}>
                            <Text style={styles.name}>{exercise.name}</Text>
                            <Text style={styles.weight}>{prettySetParams(exercise)}</Text>
                        </View>
                        <IconButton
                            onPress={() => onDelete(index)}
                            label={`Удалить подход: ${exercise.name}`}
                            icon="trash-can-outline"
                            variant="secondary"
                        />
                    </View>
                ))}
            </View>
            <CHr />
        </>
    );
}

const styles = StyleSheet.create({
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
    },
    approach: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 5,
        width: '100%',
    },
    approachText: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        flex: 1,
    },
    name: {
        color: Colors.background.i8,
        fontSize: 14,
        lineHeight: 14 * 1.2,
        textAlign: 'left',
        flex: 1,
    },
    weight: {
        color: Colors.background.i8,
        fontSize: 14,
        fontWeight: '600',
    },
});
