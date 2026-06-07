import { CurrentTrainApproaches } from '@/components/CurrentTrainApproaches';
import { ExerciseListSearch } from '@/components/elements/ExerciseListSearch';
import { CWrapper } from '@/components/ui/CWrapper';
import { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ExerciseServer } from '@/models/ExerciseServer';
import { CurrentTrainExercise, useCurrentTrainStore } from '@/store/currentTrainStore';
import { CurrentTraintSaveButton } from '@/components/CurrentTraintSaveButton';
import { Storage } from '@/helpers/Storage';
import { useSystemStore } from '@/store/systemStore';
import { useToastStore } from '@/store/toastStore';
import { ApiV2 } from '@/helpers/api/v2';
import { useModal } from '@/hooks/useModal';

export default function HomeScreen() {
    const queryClient = useQueryClient();
    const { width } = useWindowDimensions();
    const systemStore = useSystemStore();
    const toastStore = useToastStore();
    const weightInputModal = useModal('weightInput');
    const exerciseParametersSelectorModal = useModal('exerciseParametersSelector');

    const exercisesQuery = useQuery({
        queryKey: ['excluded_exercises'],
        queryFn: async () => {
            if (systemStore.isOffline) {
                const data = await Storage.getData<ExerciseServer[]>(Storage.exercises);
                return data ?? [];
            } else {
                const token = await Storage.getData<string>(Storage.token);
                const excludedIds = await Storage.getData<number[]>(
                    Storage.settingsHiddenExercises,
                );
                return ApiV2.exercises(token ?? undefined, excludedIds ?? undefined);
            }
        },
    });

    useEffect(() => {
        if (!systemStore.isOffline && exercisesQuery.data) {
            Storage.saveData(Storage.exercises, exercisesQuery.data);
        }
    }, [exercisesQuery.isFetched]);

    const currentTrainStore = useCurrentTrainStore();
    function onSelectExercise(exercise: ExerciseServer) {
        exerciseParametersSelectorModal.open({
            imageName: exercise.imageName,
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            onComplete: onParametersComplete,
        });
    }

    function onParametersComplete(params: CurrentTrainExercise) {
        currentTrainStore.appendExercise(params);
        exerciseParametersSelectorModal.close();
    }

    type Payload = {
        weight: number;
        date: string;
        exercises: ({
            id: number;
        } & Partial<{
            speed: number;
            time: number;
            incline: number;
            sets: number;
            reps: number;
            weight: number;
        }>)[];
    };
    function getSavePayload(weight: number): Payload {
        const exercises: Payload['exercises'] = [];

        currentTrainStore.train.exercises.forEach((_exercises) => {
            exercises.push({
                ..._exercises,
                id: _exercises.exerciseId,
            });
        });

        return {
            weight,
            date: new Date().toISOString(),
            exercises,
        };
    }
    const saveOffline = async (weight: number) => {
        let trains = await Storage.getData<unknown[]>(Storage.trains);
        if (!trains) {
            trains = [];
        }
        Storage.saveData(Storage.trains, [...trains, getSavePayload(weight)]);
        currentTrainStore.clearExercises();
        toastStore.setSuccess('Тренировка сохранена локально');
    };

    const saveOnline = async (weight: number) => {
        const token = await Storage.getData<string>(Storage.token);

        if (token) {
            await ApiV2.saveTrain(token, getSavePayload(weight));
            currentTrainStore.clearExercises();
            toastStore.setSuccess('Тренировка сохранена');
            queryClient.invalidateQueries({ queryKey: ['trains'] });
        }
    };

    async function onSave(weight: number) {
        try {
            if (systemStore.isOffline) {
                await saveOffline(weight);
                weightInputModal.close();
                return;
            }
            await saveOnline(weight);
            weightInputModal.close();
        } catch (error) {
            toastStore.setError('Ошибка при сохранении тренировки: ' + error);
        }
    }

    return (
        <CWrapper style={{ flex: 1 }}>
            {currentTrainStore.train.exercises.length !== 0 && (
                <CurrentTrainApproaches
                    exercises={currentTrainStore.train.exercises}
                    onDelete={currentTrainStore.removeExercise}
                />
            )}

            {currentTrainStore.train.exercises.length !== 0 && (
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
        </CWrapper>
    );
}
