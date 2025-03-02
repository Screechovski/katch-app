import {Alert, StyleSheet, Text, View} from 'react-native';
import {useMemo, useState} from "react";

import { CWrapper } from "@/components/ui/CWrapper";
import {ExerciseListSearch} from "@/components/elements/ExerciseListSearch";
import {IExercise} from "@/assets/entity/IExercise";
import {Colors} from "@/constants/Theme";
import {HorizontalButtons} from "@/components/ui/СHorizontalButtons";
import {CIconButton} from "@/components/ui/CIconButton";
import {CButton} from "@/components/ui/CButton";
import {Storage} from "@/helpers/Storage";

export default function HomeScreen() {
    const [step, setStep] = useState(0); // 0 select exerce, select count, select weight

    const [tempExercises, setTempExercises] = useState<null | IExercise>(null);

    const podh = [1,2,3,4,5,6];
    const [tempPodh, setTempPodh] = useState<number>(0);


    const weight = [10,15,20,25,30,35,40,45,50,55,60,65];
    const [tempWeight, setTempWeight] = useState<number>(0);

    const [approaches, setApproaches] = useState<{
        exercise: IExercise;
        repeat: number;
        weight: number;
    }[]>([])


    function onSelectExercise(exercise: IExercise){
        setStep(1);
        setTempExercises(exercise);
    }

    function onSelectPodh(num: number){
        setStep(3);
        setTempPodh(num);
    }

    function onSelectWeight(num: number){
        setStep(3);
        setTempWeight(num);
    }

    useMemo(() => {
        if (tempPodh && tempWeight && tempExercises) {
            setApproaches((state) => [
                ...state,
                {
                    exercise: tempExercises,
                    repeat: tempPodh,
                    weight: tempWeight,
                }
            ])
            setTempExercises(null);
            setTempPodh(0);
            setTempWeight(0);
            setStep(0);
        }
    }, [tempPodh && tempWeight && tempExercises]);

    function onDelete(){ }

    function reset(){
        setTempPodh(0);
        setTempWeight(0);
        setStep(0);
        setTempExercises(null);
        setApproaches([]);
    }

    async function save() {
        const date = new Date().toISOString();

        const prevTrains = (await Storage.getData<string[]>('trains')) || [];

        try {
            await Storage.saveData('trains', [
                ...prevTrains,
                date
            ])
            await Storage.saveData(date, approaches.map(approach => ({
                exercise: approach.exercise.id,
                weight: approach.weight,
                repeat: approach.repeat,
            })))
            Alert.alert('Успешно', 'Данные сохранены');

            reset()
        } catch (e) {
            Alert.alert('Ошибка', JSON.stringify(e));
        }
    }

    return (
        <CWrapper style={styles.wrapper}>
            {approaches.length > 0 && (
                <CButton variant={'success'} style={styles.save} onPress={save}>Сохранить</CButton>
            )}

            {approaches.length > 0 && approaches.map((approache, index) => (
                <View style={styles.approach}>
                    <Text style={styles.approachText}>{index + 1}. {approache.exercise.name} {approache.repeat}x{approache.weight}</Text>
                    <CIconButton variant={'error'} onPress={onDelete} name={'delete'} />
                </View>
            ))}

            {approaches.length > 0 && (<View style={styles.hr} />)}

            {tempExercises && <Text>{tempExercises.name}</Text>}

            {step !== 0 && <View style={styles.hr} />}

            {step === 0 && (<ExerciseListSearch
                count={3}
                onSelect={onSelectExercise}
            />)}

            {step !== 0 && (<HorizontalButtons
                selected={tempPodh}
                options={podh}
                onSelect={onSelectPodh}
            />)}

            {step !== 0 && (<HorizontalButtons
                selected={tempWeight}
                options={weight}
                onSelect={onSelectWeight}
            />)}

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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    approachText: {
        fontSize: 20,
    }
});
