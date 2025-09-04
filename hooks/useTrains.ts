import {useState} from 'react';
import {Storage} from '@/helpers/Storage';

export interface Train {
    date: string;
    weight: number | null;
    exercises: {
        exercise: number;
        weight: number;
        approach: number;
        repeat: number;
    }[];
}

type TrainDayExercise = [number, number, number, number];
type TrainDay = [TrainDayExercise[], number] | [TrainDayExercise[]];

export function useTrains() {
    const [list, setList] = useState<Train[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    async function load() {
        setIsLoading(true);
        const trains = (await Storage.getData<string[]>('trains')) ?? [];
        const _trains: Train[] = [];

        trains.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        for await (const trainKey of trains) {
            const [exercises, weight] = (await Storage.getData<TrainDay>(trainKey)) ?? [];

            const currentTrain: Train = {
                date: trainKey,
                weight: weight ?? null,
                exercises: (exercises ?? []).map(
                    ([exercise, weight, approach, repeat]) => ({
                        exercise,
                        weight,
                        approach,
                        repeat,
                    }),
                ),
            };

            _trains.push(currentTrain);
        }

        setList(_trains);
        setIsLoading(false);
    }

    async function remove(trainDate: string) {
        const trains = (await Storage.getData<string[]>('trains')) ?? [];

        await Storage.saveData(
            'trains',
            trains.filter((_trainDate) => _trainDate !== trainDate),
        );
        await Storage.removeData(trainDate);
        await load();
    }

    async function save(exercises: Train['exercises'], date: string, weight?: number) {
        const prevTrains = (await Storage.getData<string[]>('trains')) || [];

        await Storage.saveData('trains', [...prevTrains, date]);

        const line: ([number, number, number, number][] | number)[] = [
            exercises.map(({exercise, weight, approach, repeat}) => [
                exercise,
                weight,
                approach,
                repeat,
            ]),
        ];

        if (weight) {
            line.push(weight);
        }

        await Storage.saveData(date, line);
    }

    async function clean() {
        const trains = (await Storage.getData<string[]>('trains')) ?? [];

        for await (const trainKey of trains) {
            await Storage.removeData(trainKey);
        }

        await Storage.removeData('trains');
    }

    async function loadBackup(trains: unknown) {
        if (!Array.isArray(trains) || trains.length === 0) {
            return;
        }

        await clean();

        for await (const train of trains) {
            if (typeof train.exercises !== 'object') {
                return;
            }

            if (
                train.exercises &&
                Array.isArray(train.exercises) &&
                train.exercises.length > 0 &&
                train.date &&
                typeof train.date === 'string'
            ) {
                const trainsStorage = (await Storage.getData<string[]>('trains')) ?? [];

                await Storage.saveData('trains', [...trainsStorage, train.date]);
                await Storage.saveData(train.date, train.exercises);
            }
        }

        await load();
    }

    return {
        load,
        remove,
        save,
        loadBackup,
        isLoading,
        list,
    };
}

export type SaveTrains = ReturnType<typeof useTrains>['save'];
export type RemoveTrain = ReturnType<typeof useTrains>['remove'];
export type LoadTrains = ReturnType<typeof useTrains>['load'];
