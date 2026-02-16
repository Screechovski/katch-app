import { useTheme } from '@/components/ThemeProvider';
import { RepsWeight } from '@/store/currentTrainStore';
import { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { CSlider } from '@/components/ui/CSlider';
import { CButton } from '@/components/ui/CButton';
import { useQuery } from '@tanstack/react-query';
import { Api } from '@/helpers/Api';
import { Storage } from '@/helpers/Storage';
import { CHr } from '@/components/ui/CHr';
import { useSettingsStore } from '@/store/settingsStore';
import { HistoryExercises } from '@/components/HistoryExercise';
import { CLoader } from '@/components/ui/CLoader';
import { CInformer } from '@/components/ui/CInformer';

interface ExerciseParametersSelectorProps {
    exerciseName: string;
    exerciseId: number;
    exercisePhoto: { uri: string };
    weight: {
        last: number;
        top: number;
    };
    onComplete: (params: RepsWeight[]) => void;
}

export function ExerciseParametersSelector(
    props: ExerciseParametersSelectorProps,
) {
    const settingsStore = useSettingsStore();
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
                return Api.exerciseHistory(token, props.exerciseId);
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

    const repeats = {
        min: 4,
        max: 16,
    };
    const [repeatsValue, setRepeatsValue] = useState(repeats.min);

    const weight = useMemo(
        () => ({
            min: [66, 65].includes(props.exerciseId) ? 40 : 5,
            max: [66, 65].includes(props.exerciseId) ? 130 : 90,
        }),
        [props.exerciseId],
    );
    const [weightValue, setWeightValue] = useState(weight.min);

    const onComplete = () => {
        props.onComplete(
            Array.from({ length: approachesValue }).map(() => ({
                reps: repeatsValue,
                weight: weightValue,
            })),
        );
    };

    const exerciseEffectiveness = useMemo(() => {
        const rm = history.data?.rm;
        if (!rm) {
            return null;
        }

        interface ExerciseInput {
            rm: number; // Текущий 1RM пользователя из БД
            weightValue: number; // Выбранный вес
            repeatsValue: number; // Выбранные повторения
            approachesValue: number; // Количество подходов
        }

        interface ExerciseAnalysis {
            score: number; // Баллы сложности (объем * интенсивность)
            intensityPercent: number; // % от старого максимума
            label: string; // Заголовок для UI
            color: string; // Цвет для индикации
            description: string; // Текст подсказки
            isNewRecord: boolean; // Флаг рекорда
            suggestedNewRm?: number; // Рекомендация нового RM
            growthPercent?: number; // На сколько % вырос результат
        }

        /**
         * Рассчитывает сложность и эффективность тренировочного подхода
         */
        const analyzeExerciseLoad = ({
            rm,
            weightValue,
            repeatsValue,
            approachesValue,
        }: ExerciseInput): ExerciseAnalysis => {
            // 1. Считаем текущую интенсивность относительно старого RM
            const intensity = weightValue / (rm || 1);
            const intensityPercent = Math.round(intensity * 100);

            // 2. Считаем потенциальный 1RM текущего подхода (по Бржицки)
            // Формула: weight / (1.0278 - 0.0278 * reps)
            // Ограничиваем reps до 36, чтобы знаменатель не стал <= 0
            const safeReps = Math.min(repeatsValue, 36);
            const currentPerformanceRm =
                weightValue / (1.0278 - 0.0278 * safeReps);

            // 3. Расчет баллов (Load Score)
            const score = Math.round(
                weightValue * repeatsValue * approachesValue * intensity,
            );

            // 4. Проверка на рекорд
            const isNewRecord = currentPerformanceRm > rm;
            const growthPercent = isNewRecord
                ? ((currentPerformanceRm - rm) / rm) * 100
                : 0;

            // 5. Определение "сложности" через RIR (Reps in Reserve)
            // Сколько МОГ БЫ сделать при старом RM
            let maxPossibleReps = (1.0278 - Math.min(intensity, 1.02)) / 0.0278;
            if (maxPossibleReps < 1) maxPossibleReps = 1;

            const efficiencyRatio = repeatsValue / maxPossibleReps;

            // Базовый объект результата
            const result: ExerciseAnalysis = {
                score,
                intensityPercent,
                isNewRecord,
                label: 'Умеренно',
                color: '#4CAF50',
                description: 'Хорошая нагрузка для поддержания тонуса.',
            };

            if (isNewRecord) {
                result.label = 'Личный рекорд!';
                result.color = '#9C27B0';
                result.description = `Ваш потенциал вырос на ${growthPercent.toFixed(
                    1,
                )}%! Рекомендуем обновить максимум.`;
                result.suggestedNewRm =
                    Math.round(currentPerformanceRm * 10) / 10;
            } else if (efficiencyRatio >= 0.65 && efficiencyRatio <= 0.9) {
                result.label = 'Оптимально';
                result.color = '#FF9800';
                result.description =
                    'Идеальная зона для роста мышц и прогресса.';
            } else if (efficiencyRatio > 0.9) {
                result.label = 'Предельно';
                result.color = '#F44336';
                result.description =
                    'Работа на грани отказа. Будьте осторожны!';
            } else {
                result.label = 'Легко';
                result.color = '#A0A0A0';
                result.description =
                    'Нагрузка мала. Попробуйте увеличить вес или повторы.';
            }

            return result;
        };

        return analyzeExerciseLoad({
            rm,
            weightValue,
            repeatsValue,
            approachesValue,
        });
    }, [history.data?.rm, weightValue, repeatsValue, approachesValue]);

    return (
        <View style={{ width: 300 }}>
            <View style={styles.header}>
                <View style={styles.imageWrapper}>
                    <Image source={props.exercisePhoto} style={styles.image} />
                </View>
                <Text style={styles.exercisesName}>{props.exerciseName}</Text>
            </View>

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
            {history.data && exerciseEffectiveness && (
                <View>
                    <Text>
                        RM {history.data.rm}/Score {exerciseEffectiveness.score}
                    </Text>
                    <Text
                        style={[
                            styles.hardInfo,
                            { color: exerciseEffectiveness.color },
                        ]}
                    >
                        {exerciseEffectiveness.description}
                    </Text>
                </View>
            )}
            <CButton
                style={styles.button}
                variant="success"
                onPress={onComplete}
            >
                сохранить
            </CButton>
            {settingsStore.isHistoryInExerciseSelector && (
                <View style={{ height: 205 }}>
                    {history.data && (
                        <>
                            <CHr />
                            <HistoryExercises trains={history.data.trains} />
                        </>
                    )}
                    {history.isFetching && <CLoader />}
                    {history.error && (
                        <CInformer
                            message={history.error.message}
                            type="error"
                        />
                    )}
                </View>
            )}
        </View>
    );
}
