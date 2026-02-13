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
                            <HistoryExercises trains={history.data} />
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
