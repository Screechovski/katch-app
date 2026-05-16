import { StyleSheet, Text, View } from 'react-native';
import { CIconButton } from '@/components/ui/CIconButton';
import { useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { CHr } from '@/components/ui/CHr';
import { CurrentTrainExercise } from '@/store/currentTrainStore';

interface CurrentTrainApproachesProps {
    exercises: CurrentTrainExercise[];
    onDelete: (index: number) => void;
}

export function CurrentTrainApproaches({ exercises, onDelete }: CurrentTrainApproachesProps) {
    const theme = useTheme();
    const styles = useMemo(
        () =>
            StyleSheet.create({
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
                    gap: 5,
                    flex: 1,
                },
                name: {
                    color: theme?.colors.background.i8,
                    fontSize: 14,
                    lineHeight: 14 * 1.2,
                    textAlign: 'left',
                    flex: 1,
                },
                weight: {
                    color: theme?.colors.background.i8,
                    fontSize: 14,
                    fontWeight: '600',
                },
            }),
        [theme?.theme],
    );
    return (
        <>
            <View style={styles.list}>
                {exercises.map((exercise, index) => (
                    <View key={index} style={styles.approach}>
                        <View style={styles.approachText}>
                            <Text style={styles.name}>{exercise.name}</Text>
                            <Text style={styles.weight}>
                                {exercise.weight}кг {exercise.sets}x{exercise.reps}
                            </Text>
                        </View>
                        <CIconButton
                            onPress={() => onDelete(index)}
                            name="delete"
                            inline
                            variant="error"
                        />
                    </View>
                ))}
            </View>
            <CHr />
        </>
    );
}
