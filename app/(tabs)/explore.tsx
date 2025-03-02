import {StyleSheet, Alert, View, Text} from 'react-native';
import * as Clipboard from "expo-clipboard";

import {CIconButton} from "@/components/ui/CIconButton";
import {CWrapper} from "@/components/ui/CWrapper";
import {Storage} from "@/helpers/Storage";
import {useEffect, useState} from "react";
import {getExerciseById} from "@/assets/entity/IExercise";

interface Train {
    date: string;
    exercises: {
        exercise: number, weight: number, repeat: number
    }[]
}

export default function TabTwoScreen() {
    const [trains, setTrains] = useState<Train[]>([]);

    useEffect(() => {
        load()
    }, [])

    async function load() {
        const trains = (await Storage.getData<string[]>('trains')) ?? [];
        setTrains([]);

        for await (const trainKey of trains) {
            const exercises = (await Storage.getData<Train['exercises']>(trainKey)) ?? [];

            setTrains((state) => [
                ...state,
                {
                    date: trainKey,
                    exercises
                }
            ])
        }
    }

    async function handleCopy() {
        try {
            await Clipboard.setStringAsync(JSON.stringify(trains));

            Alert.alert('Успешно', 'Бэкап сохранён');
        } catch (error) {
            Alert.alert('Ошибка', JSON.stringify(error));
        }
    }

    function updateDateTime(dateString: string) {
        const date = new Date(dateString);
        const daysOfWeek = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const dayOfWeek = daysOfWeek[date.getDay()];

        return `${day}.${month} ${dayOfWeek.toUpperCase()}`;
    }

    async function remove(id: string) {
        const trains = (await Storage.getData<string[]>('trains')) ?? [];

        try {
            await Storage.saveData('trains', trains.filter(trainId => trainId !== id));
            await Storage.removeData(id)
            load();
            Alert.alert('Успешно');
        } catch (error) {
            Alert.alert('Ошибка', JSON.stringify(error));
        }
    }

    return (
        <CWrapper style={styles.wrapper}>
            <View style={styles.copy}>
                <CIconButton onPress={handleCopy} name={'copy1'}/>
                <CIconButton onPress={load} name={'reload1'}/>
            </View>

            {trains.map((train, trainKey) => (
                <View style={styles.card} key={trainKey}>
                    <View style={styles.headline}>
                        <Text style={styles.title}>Дата: {updateDateTime(train.date)}</Text>
                        <CIconButton size={'s'} variant={'error'} onPress={() => remove(train.date)} name={'delete'}/>
                    </View>

                    {train.exercises.map((exercise, exerciseKey) => (
                        <Text style={styles.line} key={exerciseKey}>
                            {exerciseKey + 1}. {getExerciseById(exercise.exercise)?.name}: {exercise.repeat}x{exercise.weight}
                        </Text>
                    ))}

                </View>
            ))}

            {trains.length === 0 && <Text>Пусто.</Text>}
        </CWrapper>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: 40,
    },
    copy: {
        flexDirection: 'row',
        gap: 5,
        marginBottom: 20,
    },
    headline: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    card: {
        flexDirection: 'column',
        gap: 5,
        padding: 5,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
    },
    line: {
        fontSize: 16,
    }
});
