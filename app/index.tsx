import { ICurrentApproach } from '@/assets/entity/ICurrentApproach';
import { CurrentTrainApproaches } from '@/components/CurrentTrainApproaches';
import { CurrentTraintSaveButton } from '@/components/CurrentTraintSaveButton';
import { ExerciseListSearch } from '@/components/elements/ExerciseListSearch';
import { ExerciseParametersSelector } from '@/components/ExerciseParametersSelector';
import { CWrapper } from '@/components/ui/CWrapper';
import { ExercisesServer } from '@/hooks/useExercises';
import { LoadTrains, SaveTrains, Train } from '@/hooks/useTrains';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Alert } from 'react-native';

interface Props {
    approaches: ICurrentApproach[];
    exercises: ExercisesServer[];
    trainsIsLoading: boolean;
    setApproaches: Dispatch<SetStateAction<ICurrentApproach[]>>;
    saveTrains: SaveTrains;
    trainsList: Train[];
    exercisesIsLoading: boolean;
    loadTrains: LoadTrains;
}

export default function HomeScreen(props: Props) {
    const [step, setStep] = useState(0); // 0 select exercise, 1 select parameters
    const [tempExercise, setTempExercise] = useState<null | ExercisesServer>(null);

    function onSelectExercise(exercise: ExercisesServer) {
        setStep(1);
        setTempExercise(exercise);
    }

    function onParametersComplete(params: {
        approach: number;
        repeat: number;
        weight: number;
    }) {
        if (tempExercise) {
            // props.setApproaches((state) => [
            //     ...state,
            //     {
            //         exercise: tempExercise,
            //         approach: params.approach,
            //         weight: params.weight,
            //         repeat: params.repeat,
            //     },
            // ]);
            // setTempExercise(null);
            // setStep(0);
        }
    }

    function onDelete(index: number) {
        props.setApproaches((state) => state.filter((_, i) => i != index));
    }

    function reset() {
        setStep(0);
        setTempExercise(null);
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

    const getPrevTempWeight = useMemo(() => {
        let last = 0;
        let top = 0;

        // TODO плохой код, переделать
        // ищем тренировки в истории с таким же tempExercise.id
        // и выписываем веса из них
        if (tempExercise) {
            props.trainsList.map((train) => {
                train.exercises
                    .filter(({exercise}) => exercise === tempExercise.id)
                    .forEach((finded) => {
                        if (finded) {
                            last = finded.weight;

                            if (finded.weight > top) {
                                top = finded.weight;
                            }
                        }
                    });
            });
        }

        return {
            last,
            top,
        };
    }, [props.trainsList, tempExercise]);

    return (
        <CWrapper style={{flex: 1}}>
            <CurrentTrainApproaches approaches={props.approaches} onDelete={onDelete} />

            {!(tempExercise && step === 1) && (
                <CurrentTraintSaveButton
                    approaches={props.approaches}
                    onSave={saveLocal}
                />
            )}

            {step === 0 && (
                <ExerciseListSearch
                    trainsList={props.trainsList}
                    loading={props.trainsIsLoading || props.exercisesIsLoading}
                    count={3}
                    onSelect={onSelectExercise}
                    exercises={props.exercises}
                />
            )}

            {tempExercise && step === 1 && (
                <ExerciseParametersSelector
                    exercisePhoto={{ uri: `http://localhost:8080/image/exercise/${tempExercise.imageName}` }}
                    exerciseName={tempExercise.name}
                    weight={getPrevTempWeight}
                    onComplete={onParametersComplete}
                />
            )}
        </CWrapper>
    );
}
