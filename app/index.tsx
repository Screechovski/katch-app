import {Alert, View} from 'react-native';
import {Dispatch, SetStateAction, useState} from 'react';

import {CWrapper} from '@/components/ui/CWrapper';
import {ExerciseListSearch} from '@/components/elements/ExerciseListSearch';
import {IExercise} from '@/assets/entity/IExercise';
import {LoadTrains, SaveTrains, Train} from '@/hooks/useTrains';
import {CurrentTrainApproaches} from '@/components/CurrentTrainApproaches';
import {CurrentTraintSaveButton} from '@/components/CurrentTraintSaveButton';
import {ExerciseParametersSelector} from '@/components/ExerciseParametersSelector';
import {ICurrentApproach} from '@/assets/entity/ICurrentApproach';

interface Props {
    approaches: ICurrentApproach[];
    exercises: IExercise[];
    setApproaches: Dispatch<SetStateAction<ICurrentApproach[]>>;
    saveTrains: SaveTrains;
    trainsList: Train[];
    trainsIsLoading: boolean;
    loadTrains: LoadTrains;
}

export default function HomeScreen(props: Props) {
    const [step, setStep] = useState(0); // 0 select exercise, 1 select parameters

    const [tempExercises, setTempExercises] = useState<null | IExercise>(null);

    function onSelectExercise(exercise: IExercise) {
        setStep(1);
        setTempExercises(exercise);
    }

    function onParametersComplete(params: {
        approach: number;
        repeat: number;
        weight: number;
    }) {
        if (tempExercises) {
            props.setApproaches((state) => [
                ...state,
                {
                    exercise: tempExercises,
                    approach: params.approach,
                    weight: params.weight,
                    repeat: params.repeat,
                },
            ]);
            setTempExercises(null);
            setStep(0);
        }
    }

    function onDelete(index: number) {
        props.setApproaches((state) => state.filter((_, i) => i != index));
    }

    function reset() {
        setStep(0);
        setTempExercises(null);
        props.setApproaches([]);
    }

    async function saveLocal(weight?: number) {
        try {
            const date = new Date().toISOString();

            await props.saveTrains(
                props.approaches.map((approach) => ({
                    ...approach,
                    exercise: approach.exercise.id,
                })),
                date,
                weight,
            );

            reset();
            props.loadTrains();
        } catch (e) {
            Alert.alert('Ошибка', JSON.stringify(e));
        }
    }

    return (
        <CWrapper style={{flex: 1}}>
            <CurrentTrainApproaches approaches={props.approaches} onDelete={onDelete} />

            <CurrentTraintSaveButton approaches={props.approaches} onSave={saveLocal} />

            {step === 0 && (
                <View style={{flex: 1, minHeight: 0}}>
                    <ExerciseListSearch
                        trainsList={props.trainsList}
                        trainsIsLoading={props.trainsIsLoading}
                        count={3}
                        onSelect={onSelectExercise}
                        exercises={props.exercises}
                    />
                </View>
            )}

            {tempExercises && step === 1 && (
                <ExerciseParametersSelector
                    exerciseName={tempExercises.name}
                    onComplete={onParametersComplete}
                />
            )}
        </CWrapper>
    );
}
