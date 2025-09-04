import {useEffect, useState} from 'react';
import {Storage} from '@/helpers/Storage';

export interface Train {
    date: string;
    exercises: {
        exercise: number;
        weight: number;
        approach: number;
        repeat: number;
    }[];
}

export function useTrains() {
    const [list, setList] = useState<Train[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        setIsLoading(true);
        const trains = (await Storage.getData<string[]>('trains')) ?? [];
        const _trains: Train[] = [];

        trains.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        for await (const trainKey of trains) {
            const exercises = (await Storage.getData<Train['exercises']>(trainKey)) ?? [];

            _trains.push({
                date: trainKey,
                exercises,
            });
        }

        setList(_trains);
        setIsLoading(false);
    }

    async function remove(id: string) {
        const trains = (await Storage.getData<string[]>('trains')) ?? [];

        await Storage.saveData(
            'trains',
            trains.filter((trainId) => trainId !== id),
        );
        await Storage.removeData(id);
        await load();
    }

    async function save(exercises: Train['exercises'], date: string) {
        const prevTrains = (await Storage.getData<string[]>('trains')) || [];

        await Storage.saveData('trains', [...prevTrains, date]);
        await Storage.saveData(date, exercises);
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
