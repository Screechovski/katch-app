import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { CIconButton } from '@/shared/ui/CIconButton';
import { Api } from '@/helpers/api/v1';
import { SchemeBack, SchemeFront } from '@/entities/muscle';
import { useTheme } from '@/shared/lib/theme';
import { prettyDate } from '@/helpers/PrettyDate';
import { TrainV2 } from '@/helpers/api/v2';
import type { TrainDifficulty } from '@/helpers/api/v2';
import { prettySetParams } from '@/helpers/PrettySetParams';
import { CBadge } from '@/shared/ui/CBadge';
import { Colors } from '@/constants/Theme';

const DIFFICULTY_LABELS: Record<TrainDifficulty, string> = {
    easy: 'Легко',
    normal: 'Средне',
    hard: 'Тяжело',
};
const DIFFICULTY_COLORS: Record<TrainDifficulty, string> = {
    easy: Colors.success.i7,
    normal: Colors.warning.i8,
    hard: Colors.danger.i6,
};

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
                    borderRadius: 16,
                    padding: 6,
                    marginBottom: 6,
                },
                dateRow: {
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 5,
                    marginBottom: 4,
                },
                date: {
                    fontSize: 13,
                    fontWeight: 600,
                    color: theme?.colors.background.i7,
                    textAlign: 'center',
                    marginLeft: 'auto',
                    marginRight: 6,
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
                    marginLeft: 6,
                },
                difficulty: {
                    fontSize: 14,
                    color: theme?.colors.background.i8,
                },
                imageWrapper: {
                    filter: theme?.theme === 'dark' ? 'invert(1)' : undefined,
                },
                image: {
                    width: 30,
                    height: 30,
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

    const formatedExercises = useMemo(() => {
        return train.exercises.map((exercise, i) => {
            return {
                ...exercise,
                key: `${train.id}_${exercise.id}_${i}`,
                params: prettySetParams(exercise),
            };
        });
    }, [train]);

    return (
        <View style={styles.card}>
            <View style={styles.dateRow}>
                {!!train.difficulty && (
                    <CBadge color={DIFFICULTY_COLORS[train.difficulty]}>
                        {DIFFICULTY_LABELS[train.difficulty]}
                    </CBadge>
                )}
                <Text style={styles.date}>{prettyDate(train.date)}</Text>
            </View>

            {formatedExercises.map((exercise) => (
                <View style={styles.line} key={exercise.key}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{
                                uri: Api.getPhotoUrl(exercise.imageName),
                            }}
                            style={styles.image}
                        />
                    </View>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseParams}>{exercise.params}</Text>
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
