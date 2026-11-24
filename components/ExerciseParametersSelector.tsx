import { workoutColors as colors, workoutFonts as fonts } from '@/shared/ui/workout/theme';
import { CurrentTrainExercise } from '@/store/currentTrainStore';
import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { CWheelPicker } from '@/shared/ui/CWheelPicker';
import { Button } from '@/shared/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { Storage } from '@/helpers/Storage';
import { CHr } from '@/shared/ui/CHr';
import { useSettingsStore } from '@/store/settingsStore';
import { HistoryExercises } from '@/entities/train';
import { CLoader } from '@/shared/ui/CLoader';
import { CInformer } from '@/shared/ui/CInformer';
import { useToastStore } from '@/store/toastStore';
import { ApiV2 } from '@/helpers/api/v2';

interface ExerciseParametersSelectorProps {
    exerciseName: string;
    exerciseId: number;
    exercisePhoto: ImageSourcePropType;
    onComplete: (params: CurrentTrainExercise) => void;
}

const CARDIO_WITH_SPEED_TIME = [91, 92, 98];
const CARDIO_WITH_INCLINE = [91];

export function ExerciseParametersSelector(props: ExerciseParametersSelectorProps) {
    const settingsStore = useSettingsStore();
    const toastStore = useToastStore();
    const isCardio = CARDIO_WITH_SPEED_TIME.includes(props.exerciseId);
    const hasIncline = CARDIO_WITH_INCLINE.includes(props.exerciseId);
    const approachesValues = [1, 2, 3, 4, 5, 6, 7];
    const [approachesValue, setApproachesValue] = useState(approachesValues[0]);

    const repsValues = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20];
    const [repsValue, setRepsValue] = useState(repsValues[0]);

    const weightValues = (() => {
        const res: number[] = [];
        for (let i = 0; i <= 11; i++) {
            res.push(i);
        }

        for (let i = 12.5; i <= 60; i += 2.5) {
            res.push(i);
        }

        for (let i = 65; i <= 130; i += 5) {
            res.push(i);
        }

        for (let i = 140; i <= 300; i += 10) {
            res.push(i);
        }
        return res;
    })();
    const [weightValue, setWeightValue] = useState(weightValues[0]);

    const inclineValues = Array.from({ length: 21 }, (_, i) => i); // 0..20°
    const [inclineValue, setInclineValue] = useState(inclineValues[0]);

    const speedValues = Array.from({ length: 39 }, (_, i) => 1 + i * 0.5); // 1..20 км/ч
    const [speedValue, setSpeedValue] = useState(speedValues[0]);

    // 3-10 (шаг 1), 12-28 (шаг 2), 30-90 (шаг 5)
    const timeValues = [
        3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 35, 40, 45, 50, 55, 60,
        65, 70, 75, 80, 85, 90,
    ];
    const [timeValue, setTimeValue] = useState(timeValues[0]);

    const history = useQuery({
        queryKey: ['exerciseHistory', props.exerciseId],
        queryFn: async () => {
            const token = await Storage.getData<string>(Storage.token);
            if (token) {
                return ApiV2.exerciseHistory(token, props.exerciseId);
            }
            return null;
        },
        refetchOnMount: false,
    });
    useMemo(() => {
        if (!history.data?.history?.[0]) return;
        const { approaches } = history.data?.history?.[0];
        if (!approaches[0]) return;
        const { reps, sets, weight, speed, time, incline } = approaches[0];
        if (approachesValues.includes(sets) && sets !== approachesValue) {
            setApproachesValue(sets);
        }
        if (repsValues.includes(reps) && reps !== repsValue) {
            setRepsValue(reps);
        }
        if (weightValues.includes(weight) && weight !== weightValue) {
            setWeightValue(weight);
        }
        if (speedValues.includes(speed) && speed !== speedValue) {
            setSpeedValue(speed);
        }
        if (timeValues.includes(time) && time !== timeValue) {
            setTimeValue(time);
        }
        if (inclineValues.includes(incline) && incline !== inclineValue) {
            setInclineValue(incline);
        }
    }, [history.data?.history]);

    const onComplete = () => {
        const res: Partial<{
            speed: number;
            time: number;
            incline: number;
            sets: number;
            reps: number;
            weight: number;
        }> = {};
        if (isCardio) {
            res.speed = speedValue;
            res.time = timeValue;
        }
        if (hasIncline) {
            res.incline = inclineValue;
        }
        if (!isCardio) {
            res.sets = approachesValue;
            res.reps = repsValue;
            res.weight = weightValue;
        }
        props.onComplete({
            ...res,
            exerciseId: props.exerciseId,
            name: props.exerciseName,
        });
    };

    const exerciseEffectiveness = useMemo(() => {
        const rm = history.data?.oneRepMax;

        if (!rm) {
            return null;
        }

        interface ExerciseInput {
            rm: number;
            weightValue: number;
            repeatsValue: number;
        }

        interface ExerciseAnalysis {
            description: string;
            color: string;
            rm: string;
        }

        const analyzeExerciseLoad = ({
            rm,
            weightValue,
            repeatsValue,
        }: ExerciseInput): ExerciseAnalysis => {
            const intensity = weightValue / (rm || 1);
            const safeReps = Math.min(repeatsValue, 36);
            const currentPerformanceRm = weightValue / (1.0278 - 0.0278 * safeReps);
            const isNewRecord = currentPerformanceRm > rm;
            let growthPercent = '0';
            if (isNewRecord) {
                growthPercent = (((currentPerformanceRm - rm) / rm) * 100).toFixed(1);
            }

            let maxPossibleReps = (1.0278 - Math.min(intensity, 1.02)) / 0.0278;
            if (maxPossibleReps < 1) {
                maxPossibleReps = 1;
            }
            const efficiencyRatio = repeatsValue / maxPossibleReps;

            let description = 'Нагрузка мала. Попробуйте увеличить вес или повторы.';
            let color = '#A0A0A0';
            if (isNewRecord) {
                description = `Ваш потенциал вырос на ${growthPercent}%! Рекомендуем обновить максимум.`;
                color = '#9C27B0';
            } else if (efficiencyRatio >= 0.75 && efficiencyRatio <= 0.95) {
                description = 'Идеальная зона для роста мышц и прогресса.';
                color = '#FF9800';
            } else if (efficiencyRatio > 0.95) {
                description = 'Работа на грани отказа. Будьте осторожны!';
                color = '#F44336';
            }

            return {
                description,
                color,
                rm: rm.toFixed(0),
            };
        };

        try {
            return analyzeExerciseLoad({ rm, weightValue, repeatsValue: repsValue });
        } catch (error) {
            // @ts-ignore
            toastStore.setError(error?.message || 'ошибка при расчетах');
            return null;
        }
    }, [history.data?.oneRepMax, weightValue, repsValue]);

    const wheels = isCardio
        ? [
            ...(hasIncline ? [{ label: 'Уклон, °', value: inclineValue, list: inclineValues, onChange: setInclineValue }] : []),
            { label: 'Скорость, км/ч', value: speedValue, list: speedValues, onChange: setSpeedValue },
            { label: 'Время, мин', value: timeValue, list: timeValues, onChange: setTimeValue },
        ]
        : [
            { label: 'Подходы', value: approachesValue, list: approachesValues, onChange: setApproachesValue },
            { label: 'Повторы', value: repsValue, list: repsValues, onChange: setRepsValue },
            { label: 'Вес, кг', value: weightValue, list: weightValues, onChange: setWeightValue },
        ];
    const showHistory = settingsStore.isHistoryInExerciseSelector
        && (history.data != null || history.isFetching || history.isError);

    return (
        <View style={styles.form}>
            <View style={styles.header}>
                <Image source={props.exercisePhoto} style={styles.image} resizeMode="contain" />
                <Text accessibilityRole="header" style={styles.exerciseName}>{props.exerciseName}</Text>
            </View>

            <View style={styles.wheels}>
                {wheels.map(({ label, ...wheel }) => (
                    <View style={styles.wheel} key={label}>
                        <Text style={styles.wheelLabel}>{label}</Text>
                        <CWheelPicker variant="workout" {...wheel} />
                    </View>
                ))}
            </View>

            {(exerciseEffectiveness || showHistory || history.isFetching) && (
                <ScrollView style={styles.details} contentContainerStyle={styles.detailsContent} nestedScrollEnabled>
                    {exerciseEffectiveness && (
                        <View style={[styles.analysis, { borderLeftColor: exerciseEffectiveness.color }]}>
                            <Text style={styles.sectionTitle}>Расчётный максимум · {exerciseEffectiveness.rm} кг</Text>
                            <Text style={styles.detail}>{exerciseEffectiveness.description}</Text>
                        </View>
                    )}
                    {showHistory && (
                        <View style={styles.history}>
                            {exerciseEffectiveness && <CHr />}
                            <Text accessibilityRole="header" style={styles.sectionTitle}>История упражнения</Text>
                            {!!history.data?.history?.length && <HistoryExercises trains={history.data.history} />}
                            {history.data && !history.data.history?.length && !history.isFetching && !history.isError && (
                                <Text style={styles.detail}>Подходов пока нет</Text>
                            )}
                            {history.isError && <CInformer message={history.error.message} type="error" />}
                        </View>
                    )}
                    {history.isFetching && <CLoader color={colors.accentFill} />}
                </ScrollView>
            )}

            <Button onPress={onComplete}>Сохранить</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    form: { flexShrink: 1, gap: 14 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderRadius: 16,
        backgroundColor: colors.canvas,
        padding: 8,
    },
    image: { width: 72, height: 72, borderRadius: 10, backgroundColor: colors.surface },
    exerciseName: { flex: 1, fontFamily: fonts.semibold, fontSize: 18, lineHeight: 24, color: colors.ink },
    wheels: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
    wheel: { flex: 1, minWidth: 0, gap: 7 },
    wheelLabel: { fontFamily: fonts.semibold, fontSize: 12, textAlign: 'center', color: colors.ink },
    details: { flexGrow: 0, flexShrink: 1, maxHeight: 156 },
    detailsContent: { gap: 8 },
    history: { gap: 6 },
    analysis: { padding: 10, borderRadius: 12, borderLeftWidth: 3, backgroundColor: colors.canvas, gap: 4 },
    sectionTitle: { fontFamily: fonts.semibold, fontSize: 13, color: colors.ink },
    detail: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 17, color: colors.muted },
});
