import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { CIconButton } from '@/components/ui/CIconButton';
import { Colors } from '@/constants/Theme';
import { TrainServer, TrainServerSet } from '@/models/TrainsServer';
import { Api } from '@/helpers/Api';
import { ExerciseServer } from '@/models/ExerciseServer';
import { SchemeFront } from '@/components/Scheme/SchemeFront';
import { SchemeBack } from '@/components/Scheme/SchemeBack';

interface Props {
    train: TrainServer;
    updateDateTime: (dateString: string) => string;
    remove: (train: TrainServer) => void;
    isControlsVisible: boolean;
    setFilterExercises: (ex: ExerciseServer) => void;
}

export function HistoryCard({
    train,
    updateDateTime,
    remove,
    isControlsVisible,
    setFilterExercises,
}: Props) {
    const [isSchemeVisible, setIsSchemeVisible] = useState(false);

    const sets = useMemo<(TrainServerSet & { sets: number })[]>(() => {
        const exercises: any = {};

        train.Sets.forEach((set) => {
            const key = `${set.exerciseId}_${set.reps}_${set.weight}`;

            if (!exercises[key]) {
                exercises[key] = {
                    ...set,
                    sets: 0,
                };
            }

            exercises[key].sets += 1;
        });

        return Object.values(exercises);
    }, [train.Sets]);

    const musclesIntense = useMemo(() => {
        const sum: Record<number, number> = {};

        train.Sets.forEach((set) => {
            if (!sum[set.Exercise.MuscleGroupID]) {
                sum[set.Exercise.MuscleGroupID] = 0;
            }

            sum[set.Exercise.MuscleGroupID] += 6;

            set.Exercise.SecondaryMuscles.forEach((second) => {
                if (!sum[second.muscleGroupId]) {
                    sum[second.muscleGroupId] = 0;
                }

                sum[second.muscleGroupId] += second.engagementLevel;
            });
        });

        return Object.entries(sum).map(([id, value]) => ({ id: +id, value }));
    }, [train.Sets]);

    return (
        <View style={styles.card}>
            <Text style={styles.date}>{updateDateTime(train.Date)}</Text>

            {sets.map((set) => (
                <View style={styles.line} key={set.ID}>
                    <Image
                        source={{
                            uri: Api.getPhotoUrl(set.Exercise.imageName),
                        }}
                        style={styles.image}
                    />

                    <Pressable
                        style={styles.exerciseNameWrapper}
                        onPress={() =>
                            setFilterExercises({
                                ID: set.exerciseId,
                                name: set.Exercise.name,
                                imageName: set.Exercise.imageName,
                            })
                        }
                    >
                        <Text style={styles.exerciseName}>
                            {set.Exercise.name}
                        </Text>
                    </Pressable>

                    <Text style={styles.exerciseParams}>
                        {set.weight}кг {set.sets}x{set.reps}
                    </Text>
                </View>
            ))}

            {isControlsVisible && (
                <View style={styles.footer}>
                    {train.UserWeight && (
                        <Text style={styles.weight}>
                            {train.UserWeight.toString()}кг
                        </Text>
                    )}

                    <View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
                        <CIconButton
                            size={'s'}
                            variant={'primary'}
                            onPress={() =>
                                setIsSchemeVisible(
                                    (currentValue) => !currentValue,
                                )
                            }
                            name={'schedule'}
                        />

                        <CIconButton
                            style={{ marginLeft: 10 }}
                            size={'s'}
                            variant={'error'}
                            onPress={() => remove(train)}
                            name={'delete'}
                        />
                    </View>
                </View>
            )}

            {isControlsVisible && isSchemeVisible && (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <SchemeFront intence={musclesIntense} />
                    <SchemeBack intence={musclesIntense} />
                </View>
            )}
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
        width: 40,
        height: 40,
        borderRadius: 3,
    },
});
