import React, {useMemo} from 'react';
import {StyleSheet, View, Text, Pressable, Image, ImagePropsBase} from 'react-native';
import {CIconButton} from '@/components/ui/CIconButton';
import {getExerciseById} from '@/assets/entity/IExercise';
import {Colors} from '@/constants/Theme';

interface HistoryCardProps {
    train: {
        date: string;
        exercises: Array<{
            exercise: number;
            weight: number;
            approach: number;
            repeat: number;
        }>;
    };
    weights: Record<string, number>;
    updateDateTime: (dateString: string) => string;
    addFilter: (id: number) => void;
    removeLocal: (date: string) => void;
}

export function HistoryCard({
    train,
    weights,
    updateDateTime,
    addFilter,
    removeLocal,
}: HistoryCardProps) {
    const trains = useMemo(() => {
        return train.exercises.map((exercise, i) => {
            const _exercise = getExerciseById(exercise.exercise);
            // const prevWeight = train.exercises[i - 1].weight;

            // const isGrow = prevWeight ? +exercise.weight > +prevWeight : null;

            return {
                ...exercise,
                photo: _exercise ? _exercise.photo : null,
                // weight: {
                //     value: exercise.weight,
                //     isGrow,
                // },
            };
        }) as {
            exercise: number;
            // weight: {
            //     value: number;
            //     isGrow: boolean | null;
            // };
            weight: number;
            approach: number;
            repeat: number;
            photo: ImagePropsBase | null;
        }[];
    }, [train.exercises]);
    return (
        <View style={styles.card}>
            <Text style={styles.date}>{updateDateTime(train.date)}</Text>

            {trains.map((exercise, exerciseKey) => (
                <View style={styles.line} key={exerciseKey}>
                    {exercise.photo && (
                        <Image source={exercise.photo} style={styles.image} />
                    )}

                    <Pressable
                        style={styles.exerciseNameWrapper}
                        onPress={() => addFilter(exercise.exercise)}>
                        <Text style={styles.exerciseName}>
                            {getExerciseById(exercise.exercise)?.name}
                        </Text>
                    </Pressable>

                    <Text style={styles.exerciseParams}>
                        {exercise.weight}кг {exercise.approach}x{exercise.repeat}
                    </Text>
                </View>
            ))}

            <View style={styles.footer}>
                {weights[train.date] && (
                    <Text style={styles.weight}>{weights[train.date].toString()}кг</Text>
                )}

                <CIconButton
                    style={{marginLeft: 'auto'}}
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
        borderRadius: 10,
        padding: 3,
        marginBottom: 6,
    },
    date: {
        fontSize: 13,
        fontWeight: 600,
        color: Colors.light.i6,
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
    },
});
