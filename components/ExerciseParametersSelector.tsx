import { useTheme } from '@/components/ThemeProvider';
import { CurrentTrainExercise } from '@/store/currentTrainStore';
import { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { CSlider } from '@/components/ui/CSlider';
import { CButton } from '@/components/ui/CButton';
import { useQuery } from '@tanstack/react-query';
import { Storage } from '@/helpers/Storage';
import { CHr } from '@/components/ui/CHr';
import { useSettingsStore } from '@/store/settingsStore';
import { HistoryExercises } from '@/components/HistoryExercise';
import { CLoader } from '@/components/ui/CLoader';
import { CInformer } from '@/components/ui/CInformer';
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
                line: {
                    marginBottom: 5,
                },
                lineTitle: {
                    fontSize: 14,
                    fontFamily: 'Montserrat',
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
        staleTime: 1000,
    });

    const approaches = {
        min: 1,
        max: 6,
    };
    const [approachesValue, setApproachesValue] = useState(approaches.min);

    const incline = {
        min: 0,
        max: 20,
    };
    const [inclineValue, setInclineValue] = useState(incline.min);

    const speed = {
        min: 0,
        max: 12,
    };
    const [speedValue, setSpeedValue] = useState(speed.min);

    const time = {
        min: 4,
        max: 40,
    };
    const [timeValue, setTimeValue] = useState(time.min);

    const weight = useMemo(() => {
        let base = {
            min: 5,
            max: 90,
        };

        switch (props.exerciseId) {
            case 72: // Румынский подъем
                base.min = 40;
                base.max = 120;
                break;
            case 66: // Жим ногами
                base.min = 50;
                base.max = 150;
                break;
            case 65: // Гак-приседания
                base.min = 10;
                base.max = 220;
                break;
            case 6: // Жим гантелей сидя
                base.min = 4;
                base.max = 60;
                break;
            case 34: // Жим гантелей лежа
            case 40: // Сведения рук в тренажере
            case 95: // Подъем EZ-штанги на бицепс на скамье Скотта
            case 19: // Подъем штанги на бицепс обратным хватом
                base.min = 5;
                base.max = 60;
                break;
            case 51: // Подтягивания на перекладине
                base.min = -45;
                base.max = 30;
                break;
            case 14: // Молоток
            case 7: // Жим Арнольда
            case 81: // Сгибания рук в запястьях
                base.min = 5;
                base.max = 40;
            default:
                break;
        }

        return base;
    }, [props.exerciseId]);
    const [weightValue, setWeightValue] = useState(weight.min);

    const repeats = {
        min: 4,
        max: 16,
    };
    const [repeatsValue, setRepeatsValue] = useState(repeats.min);

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
            res.reps = repeatsValue;
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
            return analyzeExerciseLoad({ rm, weightValue, repeatsValue });
        } catch (error) {
            // @ts-ignore
            toastStore.setError(error?.message || 'ошибка при расчетах');
            return null;
        }
    }, [history.data?.oneRepMax, weightValue, repeatsValue]);

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
                            <CHr />
                            {history.data?.history && (
                                <HistoryExercises trains={history.data.history} />
                            )}
                            {history.data?.history === null && (
                                <Text style={{ textAlign: 'center' }}>пусто</Text>
                            )}
                            {history.isFetching && <CLoader />}
                            {history.error && (
                                <CInformer message={history.error.message} type="error" />
                            )}
                            <CHr />
                        </>
                    )}
                </View>
            )}

            {!CARDIO_WITH_SPEED_TIME.includes(props.exerciseId) && (
                <>
                    <View style={styles.line}>
                        <Text style={styles.lineTitle}>Подходы: {approachesValue}</Text>
                        <CSlider
                            value={approachesValue}
                            onChange={setApproachesValue}
                            min={approaches.min}
                            max={approaches.max}
                        />
                    </View>
                    <View style={styles.line}>
                        <Text style={styles.lineTitle}>Повторения: {repeatsValue}</Text>
                        <CSlider
                            value={repeatsValue}
                            onChange={setRepeatsValue}
                            min={repeats.min}
                            max={repeats.max}
                        />
                    </View>
                    <View style={styles.line}>
                        <Text style={styles.lineTitle}>Вес: {weightValue}</Text>
                        <CSlider
                            value={weightValue}
                            step={2.5}
                            onChange={setWeightValue}
                            min={weight.min}
                            max={weight.max}
                        />
                    </View>
                </>
            )}
            {CARDIO_WITH_INCLINE.includes(props.exerciseId) && (
                <View style={styles.line}>
                    <Text style={styles.lineTitle}>Уклон: {inclineValue}°</Text>
                    <CSlider
                        value={inclineValue}
                        step={1}
                        onChange={setInclineValue}
                        min={incline.min}
                        max={incline.max}
                    />
                </View>
            )}
            {CARDIO_WITH_SPEED_TIME.includes(props.exerciseId) && (
                <View style={styles.line}>
                    <Text style={styles.lineTitle}>Скорость: {speedValue}км/ч</Text>
                    <CSlider
                        value={speedValue}
                        step={0.5}
                        onChange={setSpeedValue}
                        min={speed.min}
                        max={speed.max}
                    />
                </View>
            )}
            {CARDIO_WITH_SPEED_TIME.includes(props.exerciseId) && (
                <View style={styles.line}>
                    <Text style={styles.lineTitle}>Время: {timeValue}мин</Text>
                    <CSlider
                        value={timeValue}
                        step={1}
                        onChange={setTimeValue}
                        min={time.min}
                        max={time.max}
                    />
                </View>
            )}

            <CButton style={styles.button} variant="success" onPress={onComplete}>
                сохранить
            </CButton>
        </View>
    );
}
