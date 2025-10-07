import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { CIconButton } from '@/components/ui/CIconButton';
import { Colors } from '@/constants/Theme';
import { TrainServer } from '@/types/TrainsServer';
import { Api } from '@/helpers/Api';
import { ExerciseServer } from '@/types/ExerciseServer';

interface Props {
    train: TrainServer;
    updateDateTime: (dateString: string) => string;
    remove: (date: string) => void;
    filterExercises: ExerciseServer[];
    setFilterExercises: (ex: ExerciseServer) => void;
}

export function HistoryCard({
    train,
    updateDateTime,
    remove,
    filterExercises,
    setFilterExercises,
}: Props) {
    const filteredSets = useMemo(() => {
        return train.sets.filter((set) => {
            if (filterExercises.length) {
                return !!filterExercises.find((ex) => ex.id === set.exerciseId);
            }

            return true;
        });
    }, [train.sets, filterExercises]);

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

        filteredSets.forEach((set) => {
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
    }, [filteredSets]);

    const removeLocal = (date: string) => {
        // TODO сделать подтверждение операции,
        // например попросить ввести вес или дату на тренировке,
        // которую хотим удалить
        // remove()
    };

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

                    <Pressable
                        style={styles.exerciseNameWrapper}
                        onPress={() =>
                            setFilterExercises({
                                id: set.exerciseId,
                                name: set.exerciseName,
                                imageName: set.exerciseImageName,
                            })
                        }
                    >
                        <Text style={styles.exerciseName}>
                            {set.exerciseName}
                        </Text>
                    </Pressable>

                    <Text style={styles.exerciseParams}>
                        {set.weight}кг {set.sets}x{set.reps}
                    </Text>
                </View>
            ))}

            {filterExercises.length === 0 && (
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
        width: 30,
        height: 30,
        borderRadius: 3,
    },
});
