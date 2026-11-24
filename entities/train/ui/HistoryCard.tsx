import { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View, Text, Image } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { IconButton } from '@/shared/ui/Button';
import { CHr } from '@/shared/ui/CHr';
import { workoutColors as colors, workoutFonts as fonts } from '@/shared/ui/workout/theme';
import { Api } from '@/helpers/api/v1';
import { SchemeBack, SchemeFront } from '@/entities/muscle';
import { prettyDate } from '@/helpers/PrettyDate';
import { prettySetParams } from '@/helpers/PrettySetParams';
import type { TrainDifficulty, TrainV2 } from '@/helpers/api/v2';

const DIFFICULTY_LABELS: Record<TrainDifficulty, string> = {
    easy: 'Легко',
    normal: 'Средне',
    hard: 'Тяжело',
};

interface Props {
    train: TrainV2;
    remove: (train: TrainV2) => void;
    photoSource?: (imageName: string) => ImageSourcePropType | undefined;
}

export function HistoryCard({ train, remove, photoSource }: Props) {
    const [isSchemeVisible, setIsSchemeVisible] = useState(false);

    const musclesIntensity = useMemo(() => {
        const sum: Record<number, number> = {};

        for (const exercise of train.exercises) {
            for (const group of exercise.groups) {
                sum[group.id] = (sum[group.id] ?? 0) + group.level;
            }
        }

        return Object.entries(sum).map(([id, value]) => ({ id: Number(id), value }));
    }, [train.exercises]);

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.dateIcon}>
                    <MaterialCommunityIcons aria-hidden name="calendar-blank-outline" size={21} color={colors.mintDark} />
                </View>
                <View style={styles.summary}>
                    <Text accessibilityRole="header" style={styles.date}>{prettyDate(train.date)}</Text>
                    <View style={styles.meta}>
                        {!!train.difficulty && (
                            <Text style={styles.difficulty}>{DIFFICULTY_LABELS[train.difficulty]}</Text>
                        )}
                        {!!train.userWeight && <Text style={styles.detail}>Вес: {train.userWeight} кг</Text>}
                    </View>
                </View>
                <View style={styles.actions}>
                    <IconButton
                        label={isSchemeVisible ? 'Скрыть схему мышц' : 'Показать схему мышц'}
                        icon="human"
                        variant={isSchemeVisible ? 'primary' : 'secondary'}
                        onPress={() => setIsSchemeVisible((visible) => !visible)}
                    />
                    <IconButton
                        label="Удалить тренировку"
                        icon="trash-can-outline"
                        variant="secondary"
                        onPress={() => remove(train)}
                    />
                </View>
            </View>

            {train.exercises.length > 0 && (
                <View style={styles.exercises}>
                    {train.exercises.map((exercise, index) => {
                        const params = prettySetParams(exercise);

                        return (
                            <View style={styles.exercise} key={`${exercise.id}_${index}`}>
                                <Image
                                    source={photoSource?.(exercise.imageName) ?? { uri: Api.getPhotoUrl(exercise.imageName) }}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                                <View style={styles.exerciseCopy}>
                                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                                    {params !== '' && <Text style={styles.detail}>{params}</Text>}
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}

            {isSchemeVisible && (
                <View style={styles.scheme}>
                    <CHr style={styles.schemeDivider} />
                    <Text accessibilityRole="header" style={styles.exerciseName}>Нагрузка на мышцы</Text>
                    <View style={styles.schemeImages}>
                        <SchemeFront intence={musclesIntensity} />
                        <SchemeBack intence={musclesIntensity} />
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        gap: 14,
    },
    header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    dateIcon: {
        width: 40,
        height: 40,
        borderRadius: 13,
        backgroundColor: colors.mint,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summary: { flex: 1, minWidth: 0, gap: 4 },
    date: { fontFamily: fonts.semibold, fontSize: 17, color: colors.ink },
    meta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
    difficulty: {
        backgroundColor: colors.mint,
        color: colors.mintDark,
        fontFamily: fonts.semibold,
        fontSize: 11,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
        overflow: 'hidden',
    },
    detail: { fontFamily: fonts.medium, color: colors.muted, fontSize: 12, lineHeight: 17 },
    actions: { flexDirection: 'row', gap: 8 },
    exercises: { gap: 6 },
    exercise: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: colors.canvas,
        borderRadius: 14,
        padding: 6,
    },
    image: { width: 48, height: 48, borderRadius: 9, backgroundColor: colors.surface },
    exerciseCopy: { flex: 1, minWidth: 0, gap: 3, paddingRight: 4 },
    exerciseName: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 19, color: colors.ink },
    scheme: { gap: 12 },
    schemeDivider: { marginTop: 0, marginBottom: 2 },
    schemeImages: { flexDirection: 'row', justifyContent: 'center' },
});
