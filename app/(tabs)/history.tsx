import React, {useState} from "react";
import {StyleSheet, Alert, View, Text} from "react-native";
import * as Clipboard from "expo-clipboard";

import {CIconButton} from "@/components/ui/CIconButton";
import {CWrapper} from "@/components/ui/CWrapper";
import {useTrains} from "@/hooks/useTrains";
import {getExerciseById} from "@/assets/entity/IExercise";
import {LoadBackupModal} from "@/components/elements/LoadBackupModal";

export default function TabTwoScreen() {
    const trains = useTrains();
    const [loadBackupIsVisible, setLoadBackupIsVisible] = useState(false);

    async function handleCopy() {
        try {
            await Clipboard.setStringAsync(btoa(JSON.stringify(trains.list)));
            Alert.alert("Успешно", "Бэкап скопирован в буфер обмена");
        } catch (error) {
            Alert.alert("Ошибка", JSON.stringify(error));
        }
    }

    function updateDateTime(dateString: string) {
        const date = new Date(dateString);
        const daysOfWeek = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const dayOfWeek = daysOfWeek[date.getDay()];

        return `${day}.${month} ${dayOfWeek.toUpperCase()}`;
    }

    async function removeLocal(date: string) {
        try {
            await trains.remove(date);
            Alert.alert('Успешно');
        } catch (error) {
            Alert.alert('Ошибка', JSON.stringify(error));
        }
    }

    return (
        <CWrapper style={styles.wrapper}>
            <View style={styles.copy}>
                <CIconButton variant={'success'} onPress={trains.load} name={"sync"}/>
                <CIconButton disabled={trains.list.length === 0} onPress={handleCopy} name={"download"}/>
                <CIconButton onPress={() => setLoadBackupIsVisible(true)} name={"upload"}/>
            </View>

            <LoadBackupModal visible={loadBackupIsVisible} onHide={() => setLoadBackupIsVisible(false)}/>

            {trains.list.map((train, trainKey) => (
                <View style={styles.card} key={trainKey}>
                    <View style={styles.headline}>
                        <Text style={styles.title}>Дата: {updateDateTime(train.date)}</Text>
                        <CIconButton
                            size={"s"}
                            variant={"error"}
                            onPress={() => removeLocal(train.date)}
                            name={"delete"}
                        />
                    </View>

                    {train.exercises.map((exercise, exerciseKey) => (
                        <Text style={styles.line} key={exerciseKey}>
                            {exerciseKey + 1} {getExerciseById(exercise.exercise)?.name}:{" "}
                            {exercise.weight}кг {exercise.approach}x{exercise.repeat}
                        </Text>
                    ))}
                </View>
            ))}

            {trains.list.length === 0 && <Text>Пусто.</Text>}
        </CWrapper>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: 40,
    },
    copy: {
        flexDirection: "row",
        gap: 5,
        marginBottom: 20,
    },
    headline: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    titleContainer: {
        flexDirection: "row",
        gap: 8,
    },
    card: {
        flexDirection: "column",
        gap: 5,
        padding: 5,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
    },
    line: {
        fontSize: 16,
    },
});
