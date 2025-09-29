import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { CIconButton } from '@/components/ui/CIconButton';
import { Colors } from '@/constants/Theme';
import { TrainServer } from '@/types/TrainsServer';
import { Api } from '@/helpers/Api';

interface Props {
    train: TrainServer;
    updateDateTime: (dateString: string) => string;
    addFilter: (id: number) => void;
    removeLocal: (date: string) => void;
}

export function HistoryCard({ train, updateDateTime, removeLocal }: Props) {
    const sets = useMemo(() => {
        const exercises: Record<
            string,
            {
                id: number;
                exerciseId: number;
                exerciseImageName: string;
                exerciseName: string;
                reps: number;
                weight: number;
            } & { sets: number }
        > = {};

        train.sets.forEach((set) => {
            const key = `${set.exerciseId}_${set.reps}_${set.weight}`;

            if (!exercises[set.exerciseId]) {
                exercises[key] = {
                    ...set,
                    sets: 0,
                };
            }

            exercises[key].sets += 1;
        });

        return Object.values(exercises);
    }, [train.sets]);

    return (
        <View style={styles.card}>
            <Text style={styles.date}>{updateDateTime(train.date)}</Text>

            {sets.map((set) => (
                <View style={styles.line} key={set.id}>
                    <Image
                        source={{
                            uri: Api.getPhotoUrl(set.exerciseImageName),
                        }}
                        style={styles.image}
                    />

                    {/* <Pressable
                        style={styles.exerciseNameWrapper}
                        onPress={() => addFilter(exercise.exercise)}
                    > */}
                    <Text style={styles.exerciseName}>{set.exerciseName}</Text>
                    {/* </Pressable> */}

                    <Text style={styles.exerciseParams}>
                        {set.weight}кг {set.reps}x{set.sets}
                    </Text>
                </View>
            ))}

            <View style={styles.footer}>
                {train.userWeight && (
                    <Text style={styles.weight}>
                        {train.userWeight.toString()}кг
                    </Text>
                )}

                <CIconButton
                    style={{ marginLeft: 'auto' }}
                    size={'s'}
                    variant={'error'}
                    onPress={() => removeLocal(train.date)}
                    name={'delete'}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'column',
        borderWidth: 3,
        borderColor: Colors.light.i4,
        backgroundColor: Colors.light.i2,
        borderRadius: 10,
        padding: 3,
        marginBottom: 6,
    },
    date: {
        fontSize: 13,
        fontWeight: 600,
        color: Colors.light.i5,
        textAlign: 'center',
        marginBottom: 2,
    },
    line: {
        fontSize: 16,
        flexDirection: 'row',
        gap: 4,
        marginBottom: 3,
    },
    exerciseName: {
        fontSize: 16,
    },
    exerciseNameWrapper: {
        flex: 1,
    },
    exerciseParams: {
        fontSize: 14,
        marginLeft: 'auto',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingLeft: 34,
    },
    weight: {
        fontSize: 14,
        fontWeight: 600,
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 3,
    },
});
