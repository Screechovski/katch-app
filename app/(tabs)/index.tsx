import { CurrentTrainApproaches } from '@/components/CurrentTrainApproaches';
import { CurrentTraintSaveButton } from '@/components/CurrentTraintSaveButton';
import { ExerciseListSearch } from '@/components/elements/ExerciseListSearch';
import { CWrapper } from '@/components/ui/CWrapper';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Api } from '@/helpers/Api';
import { ExerciseServer } from '@/types/ExerciseServer';
import { ExerciseParametersSelector } from '@/components/ExerciseParametersSelector';
import { RepsWeight, useCurrentTrainStore } from '@/store/currentTrainStore';
import { ExerciseCardVertical } from '@/components/elements/ExerciseCardVertical';

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
        // props.setApproaches((state) => state.filter((_, i) => i != index));
    }

    const testArr = [
        {
            id: 24,
            name: 'Французский жим лежа',
            imageName: '24.jpg',
        },
        {
            id: 25,
            name: 'Французский жим EZ-штанги сидя',
            imageName: '25.jpg',
        },
        {
            id: 26,
            name: 'Французский жим в тренажере сидя',
            imageName: '26.jpg',
        },
        {
            id: 26,
            name: 'Французский жим в тренажере сидя',
            imageName: '26.jpg',
        },
        {
            id: 26,
            name: 'Французский жим в тренажере сидя',
            imageName: '26.jpg',
        },
        {
            id: 26,
            name: 'Французский жим в тренажере сидя',
            imageName: '26.jpg',
        },
        {
            id: 26,
            name: 'Французский жим в тренажере сидя',
            imageName: '26.jpg',
        },
        {
            id: 26,
            name: 'Французский жим в тренажере сидя',
            imageName: '26.jpg',
        },
        {
            id: 26,
            name: 'Французский жим в тренажере сидя',
            imageName: '26.jpg',
        },
        {
            id: 26,
            name: 'Французский жим в тренажере сидя',
            imageName: '26.jpg',
        },
        {
            id: 26,
            name: 'Французский жим в тренажере сидя',
            imageName: '26.jpg',
        },
        {
            id: 26,
            name: 'Французский жим в тренажере сидя',
            imageName: '26.jpg',
        },
        {
            id: 26,
            name: 'Французский жим в тренажере сидя',
            imageName: '26.jpg',
        },
        {
            id: 26,
            name: 'Французский жим в тренажере сидя',
            imageName: '26.jpg',
        },
    ];

    return (
        <CWrapper style={{ flex: 1 }}>
            {/* <Text>store.selectedExercise</Text>
            <Text>{JSON.stringify(store.selectedExercise)}</Text>
            <Text>store.sets</Text>
            <Text>{JSON.stringify(store.sets)}</Text> */}

            <CurrentTrainApproaches
                approaches={store.sets}
                onDelete={onDelete}
            />

            {/* {store.selectedExercise && step === STEP.selectParameters && (
                <CurrentTraintSaveButton
                    approaches={props.approaches}
                    onSave={saveLocal}
                />
            )} */}

            {step === STEP.selectExercises &&
                exercisesQuery.data &&
                store.selectedExercise === null && (
                    <ExerciseListSearch
                        width={width - 20}
                        loading={exercisesQuery.isFetching}
                        onSelect={onSelectExercise}
                        exercises={exercisesQuery.data}
                    />
                )}

            {/* <ScrollView>
                <View
                    style={{
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    {exercisesQuery.data?.map((item, i) => {
                        return (
                            <ExerciseCardVertical
                                key={i}
                                style={{ width: (width - 20 - 20) / 3 }}
                                name={item.name}
                                id={item.id}
                                photo={{
                                    uri: `http://localhost:8080/image/exercise/${item.imageName}`,
                                }}
                                onPress={() => onSelectExercise(item)}
                            />
                        );
                    })}
                </View>
            </ScrollView> */}

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
