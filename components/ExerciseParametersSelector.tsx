import { useTheme } from '@/components/ThemeProvider';
import { CIconButton } from '@/components/ui/CIconButton';
import { HorizontalButtons } from '@/components/ui/СHorizontalButtons';
import { RepsWeight } from '@/store/currentTrainStore';
import { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface ExerciseParametersSelectorProps {
    exerciseName: string;
    exercisePhoto: { uri: string };
    weight: {
        last: number;
        top: number;
    };
    onComplete: (params: RepsWeight[]) => void;
    onCancel: () => void;
}

const APPROACHES_VALUES = [1, 2, 3, 4, 5, 6];
const WEIGHT_VALUES = [
    4, 5, 6, 7, 8, 9, 10, 13, 15, 17, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65,
    70, 75, 80, 85, 90, 95, 100,
];
const REPEATS_VALUES = [4, 5, 6, 8, 10, 12, 15];

export function ExerciseParametersSelector(
    props: ExerciseParametersSelectorProps,
) {
    const theme = useTheme();
    const styles = useMemo(
        () =>
            StyleSheet.create({
                header: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                },
                back: {},
                image: {
                    height: 40,
                    width: 40,
                    minWidth: 40,
                    borderRadius: 5,
                },
                exercisesName: {
                    fontSize: 20,
                    marginBottom: 5,
                    color: theme?.colors.background.i9,
                    flex: 1,
                },
                line: {
                    marginBottom: 5,
                },
                lineTitle: {
                    fontSize: 16,
                    color: theme?.colors.background.i9,
                    marginBottom: 2,
                },
            }),
        [theme?.theme],
    );
    const [selectedApproach, setSelectedApproach] = useState<number>(0);
    const approachesValues = useMemo(
        () =>
            APPROACHES_VALUES.map((value) => ({
                value,
                isSelected: selectedApproach === value,
            })),
        [selectedApproach],
    );

    const [selectedWeight, setSelectedWeight] = useState<number>(0);
    const weightValues = useMemo(
        () =>
            WEIGHT_VALUES.map((value) => ({
                value,
                isTop: props.weight.top === value,
                isSelected: selectedWeight === value,
                isLast: props.weight.last === value,
            })),
        [selectedWeight, props.weight.top, props.weight.last],
    );

    const [selectedRepeats, setSelectedRepeats] = useState<number>(0);
    const repeatsValues = useMemo(
        () =>
            REPEATS_VALUES.map((value, i) => ({
                value,
                isSelected: selectedRepeats === value,
            })),
        [selectedRepeats],
    );

    function onSelectApproach(num: number) {
        setSelectedApproach(num);
    }

    function onSelectWeight(num: number) {
        setSelectedWeight(num);
    }

    function onSelectRepeats(num: number) {
        setSelectedRepeats(num);
    }

    useEffect(() => {
        if (selectedApproach && selectedWeight && selectedRepeats) {
            const result: RepsWeight[] = [];

            Array.from({ length: selectedApproach }).forEach(() => {
                result.push({
                    reps: selectedRepeats,
                    weight: selectedWeight,
                });
            });

            props.onComplete(result);
        }
    }, [selectedApproach, selectedWeight, selectedRepeats]);

    return (
        <View>
            <View style={styles.header}>
                <CIconButton
                    variant="error"
                    name="caret-left"
                    onPress={props.onCancel}
                />
                <Image source={props.exercisePhoto} style={styles.image} />
                <Text style={styles.exercisesName}>{props.exerciseName}</Text>
            </View>
            <View style={styles.line}>
                <Text style={styles.lineTitle}>Подходы</Text>
                <HorizontalButtons
                    options={approachesValues}
                    onSelect={onSelectApproach}
                />
            </View>
            <View style={styles.line}>
                <Text style={styles.lineTitle}>Повторения</Text>
                <HorizontalButtons
                    options={repeatsValues}
                    onSelect={onSelectRepeats}
                />
            </View>
            <View style={styles.line}>
                <Text style={styles.lineTitle}>Вес</Text>
                <HorizontalButtons
                    options={weightValues}
                    onSelect={onSelectWeight}
                />
            </View>
        </View>
    );
}
