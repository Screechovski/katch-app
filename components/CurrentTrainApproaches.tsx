import {StyleSheet, Text, View} from 'react-native';
import {IExercise} from '@/assets/entity/IExercise';
import {CIconButton} from '@/components/ui/CIconButton';
import {Colors} from '@/constants/Theme';

interface Approach {
    exercise: IExercise;
    approach: number;
    repeat: number;
    weight: number;
}

interface CurrentTrainApproachesProps {
    approaches: Approach[];
    onDelete: (index: number) => void;
}

export function CurrentTrainApproaches({
    approaches,
    onDelete,
}: CurrentTrainApproachesProps) {
    if (approaches.length === 0) {
        return null;
    }

    return (
        <>
            <View style={styles.list}>
                {approaches.map((approache, index) => (
                    <View key={index} style={styles.approach}>
                        <View style={styles.approachText}>
                            <Text style={styles.counter}>{index + 1}</Text>
                            <Text style={styles.name}>{approache.exercise.name}</Text>
                            <Text style={styles.weight}>
                                {approache.weight}кг {approache.approach}x
                                {approache.repeat}
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
            <View style={styles.hr} />
        </>
    );
}

const styles = StyleSheet.create({
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
    },
    hr: {
        height: 2,
        marginBottom: 20,
        marginTop: 20,
        backgroundColor: Colors.primary.i80,
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
    counter: {
        fontSize: 14,
    },
    name: {
        fontSize: 14,
        lineHeight: 14 * 1.2,
        textAlign: 'left',
        flex: 1,
    },
    weight: {
        fontSize: 14,
        fontWeight: '600',
    },
});
