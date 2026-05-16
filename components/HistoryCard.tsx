import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { CIconButton } from '@/components/ui/CIconButton';
import { Api } from '@/helpers/api/v1';
import { SchemeFront } from '@/components/Scheme/SchemeFront';
import { SchemeBack } from '@/components/Scheme/SchemeBack';
import { useTheme } from '@/components/ThemeProvider';
import { prettyDate } from '@/helpers/PrettyDate';
import { TrainV2 } from '@/helpers/api/v2';

interface Props {
    train: TrainV2;
    remove: (train: TrainV2) => void;
}

export function HistoryCard({ train, remove }: Props) {
    const theme = useTheme();
    const styles = useMemo(
        () =>
            StyleSheet.create({
                card: {
                    flexDirection: 'column',
                    backgroundColor: theme?.colors.background.i3,
                    borderRadius: 10,
                    padding: 3,
                    marginBottom: 6,
                },
                date: {
                    fontSize: 13,
                    fontWeight: 600,
                    color: theme?.colors.background.i7,
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
                    color: theme?.colors.background.i7,
                },
                exerciseParams: {
                    fontSize: 14,
                    marginLeft: 'auto',
                    color: theme?.colors.background.i7,
                    minWidth: 80,
                    textAlign: 'right',
                },
                footer: {
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    gap: 8,
                },
                weight: {
                    fontSize: 14,
                    color: theme?.colors.background.i8,
                    fontWeight: 600,
                },
                imageWrapper: {
                    filter: theme?.theme === 'dark' ? 'invert(1)' : undefined,
                },
                image: {
                    width: 40,
                    height: 40,
                    borderRadius: 3,
                },
            }),
        [theme?.theme],
    );

    const [isSchemeVisible, setIsSchemeVisible] = useState(false);

    const musclesIntense = useMemo(() => {
        const sum: Record<number, number> = {};

        train.exercises.forEach((ex) => {
            ex.groups.forEach((group) => {
                if (!sum[group.id]) {
                    sum[group.id] = 0;
                }
                sum[group.id] += group.level;
            });
        });

        return Object.entries(sum).map(([id, value]) => ({ id: +id, value }));
    }, [train]);

    return (
        <View style={styles.card}>
            <Text style={styles.date}>{prettyDate(train.date)}</Text>

            {train.exercises.map((exercise) => (
                <View
                    style={styles.line}
                    key={`${exercise.id}_${exercise.weight}_${exercise.reps}_${exercise.sets}`}
                >
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{
                                uri: Api.getPhotoUrl(exercise.imageName),
                            }}
                            style={styles.image}
                        />
                    </View>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>

                    <Text style={styles.exerciseParams}>
                        {`${exercise.weight}кг ${exercise.sets}x${exercise.reps}`}
                    </Text>
                </View>
            ))}

            <View style={styles.footer}>
                {!!train.userWeight && (
                    <Text style={styles.weight}>Вес: {train.userWeight.toString()}кг</Text>
                )}

                <View style={{ flexDirection: 'row', marginLeft: 'auto' }}>
                    <CIconButton
                        onPress={() => setIsSchemeVisible((currentValue) => !currentValue)}
                        name="schedule"
                    />

                    <CIconButton
                        style={{ marginLeft: 10 }}
                        variant="error"
                        onPress={() => remove(train)}
                        name="delete"
                    />
                </View>
            </View>

            {isSchemeVisible && (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    <SchemeFront intence={musclesIntense} />
                    <SchemeBack intence={musclesIntense} />
                </View>
            )}
        </View>
    );
}
