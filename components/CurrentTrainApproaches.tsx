import { StyleSheet, Text, View } from 'react-native';
import { CIconButton } from '@/components/ui/CIconButton';
import { Set } from '@/store/currentTrainStore';
import { useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { CHr } from '@/components/ui/CHr';

interface CurrentTrainApproachesProps {
    approaches: Set[];
    onDelete: (index: number) => void;
}

export function CurrentTrainApproaches({
    approaches,
    onDelete,
}: CurrentTrainApproachesProps) {
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
                {approaches.map((approache, index) => (
                    <View key={index} style={styles.approach}>
                        <View style={styles.approachText}>
                            <Text style={styles.name}>
                                {approache.exercises.name}
                            </Text>
                            <Text style={styles.weight}>
                                {approache.sets[0].weight}кг{' '}
                                {approache.sets.length}x{approache.sets[0].reps}
                            </Text>
                        </View>
                        <CIconButton
                            size="m"
                            variant={'error'}
                            onPress={() => onDelete(index)}
                            name={'delete'}
                        />
                    </View>
                ))}
            </View>
            <CHr />
        </>
    );
}
