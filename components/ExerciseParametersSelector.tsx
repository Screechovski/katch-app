import { useTheme } from '@/shared/lib/theme';
import { CurrentTrainExercise } from '@/store/currentTrainStore';
import { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { CWheelPicker } from '@/shared/ui/CWheelPicker';
import { CButton } from '@/shared/ui/CButton';
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
    exercisePhoto: { uri: string };
    onComplete: (params: CurrentTrainExercise) => void;
}

const CARDIO_WITH_SPEED_TIME = [91, 92, 98];
const CARDIO_WITH_INCLINE = [91];

export function ExerciseParametersSelector(props: ExerciseParametersSelectorProps) {
    const settingsStore = useSettingsStore();
    const toastStore = useToastStore();
    const theme = useTheme();
    const styles = useMemo(
        () =>
            StyleSheet.create({
                header: {
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    gap: 10,
                    marginBottom: 5,
                },
                imageWrapper: {
                    height: 90,
                    width: 90,
                    minWidth: 90,
                    borderRadius: 5,
                    filter: theme?.theme === 'dark' ? 'invert(1)' : undefined,
                },

                image: {
                    height: '100%',
                    width: '100%',
                },
                exercisesName: {
                    fontSize: 20,
                    color: theme?.colors.background.i9,
                    flex: 1,
                },

                wheels: {
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 4,
                },
                wheel: {
                    width: 70,
                },
                wheelLabel: {
                    fontSize: 14,
                    fontFamily: 'Montserrat',
                    textAlign: 'center',
                    color: theme?.colors.background.i9,
                },

                button: {
                    marginTop: 10,
                },
                hardInfo: {
                    fontSize: 14,
                    lineHeight: 1.4 * 14,
                    height: 1.4 * 14 * 2,
                },
            }),
        [theme?.theme],
    );

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
        if (CARDIO_WITH_SPEED_TIME.includes(props.exerciseId)) {
            res.speed = speedValue;
            res.time = timeValue;
        }
        if (CARDIO_WITH_INCLINE.includes(props.exerciseId)) {
            res.incline = inclineValue;
        }
        if (!CARDIO_WITH_SPEED_TIME.includes(props.exerciseId)) {
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

    const isHrVisible = useMemo(() => {
        return (
            history.data?.history ||
            history.data?.history === null ||
            history.isFetching ||
            history.error
        );
    }, [history.data?.history, history.error, history.isFetching]);

    return (
        <View style={{ width: 300 }}>
            <View style={styles.header}>
                <View style={styles.imageWrapper}>
                    <Image source={props.exercisePhoto} style={styles.image} />
                </View>
                <Text style={styles.exercisesName}>{props.exerciseName}</Text>
            </View>

            <View>
                {history.isFetching && <CLoader />}
                {exerciseEffectiveness && <Text>RM {exerciseEffectiveness.rm}</Text>}
                {exerciseEffectiveness && (
                    <Text style={[styles.hardInfo, { color: exerciseEffectiveness.color }]}>
                        {exerciseEffectiveness.description}
                    </Text>
                )}
            </View>

            {settingsStore.isHistoryInExerciseSelector && (
                <View>
                    {isHrVisible && (
                        <>
                            {!!history.data?.history.length && (
                                <>
                                    <CHr />
                                    <HistoryExercises trains={history.data.history} />
                                </>
                            )}
                            {history.data?.history === null && (
                                <>
                                    <CHr />
                                    <Text style={{ textAlign: 'center' }}>пусто</Text>
                                </>
                            )}
                            {history.isFetching && (
                                <>
                                    <CHr />
                                    <CLoader />
                                </>
                            )}
                            {history.error && (
                                <>
                                    <CHr />
                                    <CInformer message={history.error.message} type="error" />
                                </>
                            )}
                            <CHr />
                        </>
                    )}
                </View>
            )}

            {!CARDIO_WITH_SPEED_TIME.includes(props.exerciseId) && (
                <View style={styles.wheels}>
                    <View style={styles.wheel}>
                        <Text style={styles.wheelLabel}>Подх.</Text>
                        <CWheelPicker
                            value={approachesValue}
                            list={approachesValues}
                            onChange={setApproachesValue}
                        />
                    </View>
                    <View style={styles.wheel}>
                        <Text style={styles.wheelLabel}>Повт.</Text>
                        <CWheelPicker value={repsValue} list={repsValues} onChange={setRepsValue} />
                    </View>
                    <View style={styles.wheel}>
                        <Text style={styles.wheelLabel}>Вес</Text>
                        <CWheelPicker
                            value={weightValue}
                            list={weightValues}
                            onChange={setWeightValue}
                        />
                    </View>
                </View>
            )}
            {CARDIO_WITH_SPEED_TIME.includes(props.exerciseId) && (
                <View style={styles.wheels}>
                    {CARDIO_WITH_INCLINE.includes(props.exerciseId) && (
                        <View style={styles.wheel}>
                            <Text style={styles.wheelLabel}>Уклон</Text>
                            <CWheelPicker
                                value={inclineValue}
                                list={inclineValues}
                                onChange={setInclineValue}
                            />
                        </View>
                    )}
                    <View style={styles.wheel}>
                        <Text style={styles.wheelLabel}>Скор.</Text>
                        <CWheelPicker
                            value={speedValue}
                            list={speedValues}
                            onChange={setSpeedValue}
                        />
                    </View>
                    <View style={styles.wheel}>
                        <Text style={styles.wheelLabel}>Время</Text>
                        <CWheelPicker value={timeValue} list={timeValues} onChange={setTimeValue} />
                    </View>
                </View>
            )}

            <CButton style={styles.button} variant="success" onPress={onComplete}>
                сохранить
            </CButton>
        </View>
    );
}
