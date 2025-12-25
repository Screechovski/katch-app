import { useTheme } from '@/components/ThemeProvider';
import { RepsWeight } from '@/store/currentTrainStore';
import { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { CSlider } from '@/components/ui/CSlider';
import { CButton } from '@/components/ui/CButton';

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
                    marginBottom: 5,
                    color: theme?.colors.background.i9,
                    flex: 1,
                },
                line: {
                    marginBottom: 20,
                },
                lineTitle: {
                    fontSize: 16,
                    color: theme?.colors.background.i9,
                },
                button: {
                    marginTop: 10,
                },
            }),
        [theme?.theme],
    );

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
            min: 4,
            max: [66, 65].includes(props.exerciseId) ? 140 : 86,
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
                <Text style={styles.lineTitle}>Подходы</Text>
                <CSlider
                    value={approachesValue}
                    onChange={setApproachesValue}
                    min={approaches.min}
                    max={approaches.max}
                    renderStep={2}
                />
            </View>
            <View style={styles.line}>
                <Text style={styles.lineTitle}>Повторения</Text>
                <CSlider
                    value={repeatsValue}
                    onChange={setRepeatsValue}
                    min={repeats.min}
                    max={repeats.max}
                    renderStep={2}
                />
            </View>
            <View style={styles.line}>
                <Text style={styles.lineTitle}>Вес</Text>
                <CSlider
                    value={weightValue}
                    step={2}
                    onChange={setWeightValue}
                    min={weight.min}
                    renderStep={20}
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
        </View>
    );
}
