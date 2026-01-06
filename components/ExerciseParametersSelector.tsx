import { useTheme } from '@/components/ThemeProvider';
import { RepsWeight } from '@/store/currentTrainStore';
import { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { CSlider } from '@/components/ui/CSlider';
import { CButton } from '@/components/ui/CButton';
import { useQuery } from '@tanstack/react-query';
import { Api } from '@/helpers/Api';
import { Storage } from '@/helpers/Storage';
import { TopLastInfo } from '@/components/elements/TopLastInfo';

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
                    fontSize: 16,
                    color: theme?.colors.background.i9,
                },
                button: {
                    marginTop: 10,
                },
                info: {
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 5,
                    marginBottom: 5,
                },
                infoLine: {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                },
                infoCircle: {
                    height: 10,
                    width: 10,
                    borderRadius: '50%',
                },
                infoText: {
                    fontFamily: 'Montserrat',
                },
            }),
        [theme?.theme],
    );

    const { data: history } = useQuery({
        queryKey: ['exerciseHistory', props.exerciseId],
        queryFn: async () => {
            const token = await Storage.getData<string>(Storage.token);
            if (token) {
                return Api.exerciseHistory(token, props.exerciseId);
            }
            return null;
        },
        refetchOnMount: false,
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

            <TopLastInfo
                lastReps={history?.last.reps}
                lastWeight={history?.last.weight}
                topRes={history?.top.reps}
                topWeight={history?.top.weight}
            />

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
                    top={history?.top.reps}
                    last={history?.last.reps}
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
                    top={history?.top.weight}
                    last={history?.last.weight}
                />
            </View>
            <CButton
                style={styles.button}
                variant="success"
                onPress={onComplete}
            >
                сохранить
            </CButton>
        </View>
    );
}
