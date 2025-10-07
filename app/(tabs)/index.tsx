import { CurrentTrainApproaches } from '@/components/CurrentTrainApproaches';
import { ExerciseListSearch } from '@/components/elements/ExerciseListSearch';
import { CWrapper } from '@/components/ui/CWrapper';
import { useState } from 'react';
import { Alert, useWindowDimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Api } from '@/helpers/Api';
import { ExerciseServer } from '@/types/ExerciseServer';
import { ExerciseParametersSelector } from '@/components/ExerciseParametersSelector';
import { RepsWeight, useCurrentTrainStore } from '@/store/currentTrainStore';
import { CurrentTraintSaveButton } from '@/components/CurrentTraintSaveButton';
import { Storage } from '@/helpers/Storage';

export default function HomeScreen() {
    const STEP = {
        selectExercises: 0,
        selectParameters: 1,
    } as const;

    const { width } = useWindowDimensions();
    const [step, setStep] = useState<(typeof STEP)[keyof typeof STEP]>(
        STEP.selectExercises,
    );

    const exercisesQuery = useQuery({
        queryKey: ['exercises'],
        queryFn: Api.exercises,
    });

    const store = useCurrentTrainStore();

    function onSelectExercise(exercise: ExerciseServer) {
        setStep(STEP.selectParameters);
        store.setSelectedExercise(exercise);
    }

    function onParametersComplete(params: RepsWeight[]) {
        if (store.selectedExercise) {
            store.setSets(params);
            setStep(STEP.selectExercises);
            store.setSelectedExercise(null);
        }
    }

    function onDelete(index: number) {
        // TODO реализовать удаление
        // props.setApproaches((state) => state.filter((_, i) => i != index));
    }

    function getSavePayload(weight: number) {
        const sets: any[] = [];

        store.sets.forEach((exercises) => {
            exercises.sets.forEach((set) => {
                sets.push({
                    exerciseId: exercises.exercises.id,
                    reps: set.reps,
                    weight: set.weight,
                });
            });
        });

        return {
            weight,
            date: new Date(),
            sets,
        };
    }

    async function onSave(weight?: number) {
        try {
            const token = await Storage.getData<string>(Storage.token);

            if (token) {
                await Api.saveTrain(token, getSavePayload(weight ?? 0));
                store.setSets([]);
                Alert.alert('Тренировка сохранена');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <CWrapper style={{ flex: 1 }}>
            <CurrentTrainApproaches
                approaches={store.sets}
                onDelete={onDelete}
            />

            {/* TODO кнопка выводится всегда */}
            {store.selectedExercise === null &&
                step === STEP.selectExercises && (
                    <CurrentTraintSaveButton onSave={onSave} />
                )}

            {step === STEP.selectExercises &&
                exercisesQuery.data &&
                store.selectedExercise === null && (
                    <ExerciseListSearch
                        width={width - 20}
                        loading={exercisesQuery.isFetching}
                        onSelect={onSelectExercise}
                        exercises={exercisesQuery.data}
                        onRefresh={exercisesQuery.refetch}
                    />
                )}

            {store.selectedExercise && step === STEP.selectParameters && (
                <ExerciseParametersSelector
                    exercisePhoto={{
                        uri: `http://localhost:8080/image/exercise/${store.selectedExercise.imageName}`,
                    }}
                    exerciseName={store.selectedExercise.name}
                    weight={{
                        last: -1,
                        top: -1,
                    }}
                    onComplete={onParametersComplete}
                />
            )}
        </CWrapper>
    );
}
