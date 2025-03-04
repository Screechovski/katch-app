import {Alert, StyleSheet, Text, View} from "react-native";
import {useEffect, useState} from "react";

import {CWrapper} from "@/components/ui/CWrapper";
import {ExerciseListSearch} from "@/components/elements/ExerciseListSearch";
import {IExercise} from "@/assets/entity/IExercise";
import {Colors} from "@/constants/Theme";
import {HorizontalButtons} from "@/components/ui/СHorizontalButtons";
import {CIconButton} from "@/components/ui/CIconButton";
import {CButton} from "@/components/ui/CButton";
import {useTrains} from "@/hooks/useTrains";

export default function HomeScreen() {
    const [step, setStep] = useState(0); // 0 select exerce, select count, select weight

    const [tempExercises, setTempExercises] = useState<null | IExercise>(null);

    const podh = [1, 2, 3, 4, 5, 6];
    const [tempApproach, setTempApproach] = useState<number>(0);

    const weight = [
        4, 5, 6, 7, 8, 9, 10, 13, 15, 17, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65,
        70, 75, 80,
    ];
    const [tempWeight, setTempWeight] = useState<number>(0);

    const repeats = [4, 6, 8, 10, 12, 15];
    const [tempRepeats, setTempRepeats] = useState<number>(0);

    const [approaches, setApproaches] = useState<
        {
            exercise: IExercise;
            approach: number;
            repeat: number;
            weight: number;
        }[]
    >([]);

    const trains = useTrains();

    function onSelectExercise(exercise: IExercise) {
        setStep(1);
        setTempExercises(exercise);
    }

    function onSelectApproach(num: number) {
        setStep(3);
        setTempApproach(num);
    }

    function onSelectWeight(num: number) {
        setStep(3);
        setTempWeight(num);
    }

    function onSelectRepeats(num: number) {
        setStep(3);
        setTempRepeats(num);
    }

    function onDelete(index: number) {
        setApproaches((state) => state.filter((_, i) => i != index));
    }

    function reset() {
        setStep(0);
        setTempApproach(0);
        setTempRepeats(0);
        setTempWeight(0);
        setTempExercises(null);
        setApproaches([]);
    }

    useEffect(() => {
        if (tempExercises && tempApproach && tempWeight && tempRepeats) {
            setApproaches((state) => [
                ...state,
                {
                    exercise: tempExercises,
                    approach: tempApproach,
                    weight: tempWeight,
                    repeat: tempRepeats,
                },
            ]);
            setTempExercises(null);
            setTempApproach(0);
            setTempWeight(0);
            setTempRepeats(0);
            setStep(0);
        }
    }, [tempExercises, tempApproach, tempWeight, tempRepeats]);

    async function saveLocal() {
        try {
            await trains.save(
                approaches.map((approach) => ({
                    ...approach,
                    exercise: approach.exercise.id,
                }))
            );
            Alert.alert("Успешно", "Данные сохранены");
            reset();
        } catch (e) {
            Alert.alert("Ошибка", JSON.stringify(e));
        }
    }

    return (
        <CWrapper style={styles.wrapper}>
            {approaches.length > 0 && (
                <CButton variant={"success"} style={styles.save} onPress={saveLocal}>
                    Сохранить
                </CButton>
            )}

            {approaches.length > 0 &&
                approaches.map((approache, index) => (
                    <View key={index} style={styles.approach}>
                        <Text style={styles.approachText}>
                            {index + 1} {approache.exercise.name} {approache.weight}кг{" "}
                            {approache.approach}x{approache.repeat}
                        </Text>
                        <CIconButton
                            variant={"error"}
                            onPress={() => onDelete(index)}
                            name={"delete"}
                        />
                    </View>
                ))}

            {approaches.length > 0 && <View style={styles.hr}/>}

            {tempExercises && (
                <Text style={styles.exercisesName}>{tempExercises.name}</Text>
            )}

            {step === 0 && (
                <ExerciseListSearch count={3} onSelect={onSelectExercise}/>
            )}

            {step !== 0 && (
                <View>
                    <View style={styles.line}>
                        <Text style={styles.lineTitle}>Подходы</Text>
                        <HorizontalButtons
                            selected={tempApproach}
                            options={podh}
                            onSelect={onSelectApproach}
                        />
                    </View>
                    <View style={styles.line}>
                        <Text style={styles.lineTitle}>Повторения</Text>
                        <HorizontalButtons
                            selected={tempRepeats}
                            options={repeats}
                            onSelect={onSelectRepeats}
                        />
                    </View>
                    <View style={styles.line}>
                        <Text style={styles.lineTitle}>Вес</Text>
                        <HorizontalButtons
                            selected={tempWeight}
                            options={weight}
                            onSelect={onSelectWeight}
                        />
                    </View>
                </View>
            )}
        </CWrapper>
    );
}

const styles = StyleSheet.create({
    save: {
        marginBottom: 10,
    },
    wrapper: {
        paddingTop: 40,
    },
    hr: {
        height: 2,
        marginBottom: 20,
        marginTop: 20,
        backgroundColor: Colors.primary.i80,
    },
    approach: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    approachText: {
        fontSize: 20,
        marginRight: 5,
        maxWidth: 310,
    },
    exercisesName: {
        fontSize: 20,
        marginBottom: 5,
    },
    line: {
        marginBottom: 5,
    },
    lineTitle: {
        fontSize: 16,
        marginBottom: 2,
    },
});
