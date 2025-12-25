import { CurrentTrainApproaches } from '@/components/CurrentTrainApproaches';
import { ExerciseListSearch } from '@/components/elements/ExerciseListSearch';
import { CWrapper } from '@/components/ui/CWrapper';
import { useEffect, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Api } from '@/helpers/Api';
import { ExerciseServer } from '@/models/ExerciseServer';
import { ExerciseParametersSelector } from '@/components/ExerciseParametersSelector';
import { RepsWeight, useCurrentTrainStore } from '@/store/currentTrainStore';
import { CurrentTraintSaveButton } from '@/components/CurrentTraintSaveButton';
import { Storage } from '@/helpers/Storage';
import { useSystemStore } from '@/store/systemStore';
import { useToastStore } from '@/store/toastStore';
import { CModal } from '@/components/ui/CModal';

export default function HomeScreen() {
    const STEP = {
        selectExercises: 0,
        selectParameters: 1,
    } as const;

    const { width } = useWindowDimensions();
    const [step, setStep] = useState<(typeof STEP)[keyof typeof STEP]>(
        STEP.selectExercises,
    );
    const systemStore = useSystemStore();
    const toastStore = useToastStore();

    let queryFn;
    if (systemStore.isOffline) {
        queryFn = async () => {
            const data = await Storage.getData<ExerciseServer[]>(
                Storage.exercises,
            );
            return data ?? [];
        };
    } else {
        queryFn = async () => {
            const token = await Storage.getData<string>(Storage.token);
            return Api.exercises(token ?? undefined);
        };
    }

    const exercisesQuery = useQuery({
        queryKey: ['exercises'],
        queryFn,
    });

    useEffect(() => {
        if (!systemStore.isOffline && exercisesQuery.data) {
            Storage.saveData(Storage.exercises, exercisesQuery.data);
        }
    }, [exercisesQuery.isFetched]);

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

    function onCancelSelection() {
        setStep(STEP.selectExercises);
        store.setSelectedExercise(null);
    }

    function getSavePayload(weight: number) {
        const sets: any[] = [];

        store.sets.forEach((exercises) => {
            exercises.sets.forEach((set) => {
                sets.push({
                    exerciseId: exercises.exercises.ID,
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

    const saveOffline = async (weight: number) => {
        try {
            let trains = await Storage.getData<unknown[]>(Storage.trains);
            if (!trains) {
                trains = [];
            }
            Storage.saveData(Storage.trains, [
                ...trains,
                getSavePayload(weight),
            ]);
            store.clearSets();
            toastStore.setSuccess('Тренировка сохранена локально');
        } catch (error) {
            toastStore.setError('Ошибка при сохранении тренировки: ' + error);
        }
    };

    const saveOnline = async (weight: number) => {
        try {
            const token = await Storage.getData<string>(Storage.token);

            if (token) {
                await Api.saveTrain(token, getSavePayload(weight));
                store.clearSets();
                toastStore.setSuccess('Тренировка сохранена');
            }
        } catch (error) {
            toastStore.setError('Ошибка при сохранении тренировки: ' + error);
        }
    };

    async function onSave(weight?: number) {
        if (systemStore.isOffline) {
            saveOffline(weight ?? 0);
        } else {
            saveOnline(weight ?? 0);
        }
    }

    const isParametersExerciseVisible = useMemo(
        () => !!store.selectedExercise && step === STEP.selectParameters,
        [store.selectedExercise, step],
    );

    return (
        <CWrapper style={{ flex: 1 }}>
            {store.sets.length !== 0 && (
                <CurrentTrainApproaches
                    approaches={store.sets}
                    onDelete={store.removeSet}
                />
            )}

            {store.sets.length !== 0 && (
                <CurrentTraintSaveButton onSave={onSave} />
            )}

            {exercisesQuery.data && (
                <ExerciseListSearch
                    width={width - 20}
                    loading={exercisesQuery.isFetching}
                    onSelect={onSelectExercise}
                    exercises={exercisesQuery.data}
                    onRefresh={exercisesQuery.refetch}
                />
            )}

            <CModal
                visible={isParametersExerciseVisible}
                onHide={onCancelSelection}
            >
                {isParametersExerciseVisible && (
                    <ExerciseParametersSelector
                        exercisePhoto={{
                            uri: Api.getPhotoUrl(
                                store.selectedExercise!.imageName,
                            ),
                        }}
                        exerciseId={store.selectedExercise!.ID}
                        exerciseName={store.selectedExercise!.name}
                        weight={{
                            last: -1,
                            top: -1,
                        }}
                        onComplete={onParametersComplete}
                    />
                )}
            </CModal>
        </CWrapper>
    );
}
