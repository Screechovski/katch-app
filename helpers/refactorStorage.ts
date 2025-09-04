import {Storage} from '@/helpers/Storage';
import {Train} from '@/hooks/useTrains';

async function getTrainDates() {
    return (await Storage.getData<string[]>('trains')) ?? [];
}

async function getWeights() {
    return (await Storage.getData<Weight[]>('weight')) ?? [];
}

export async function refactorStorageData() {
    const trainDates = await getTrainDates();
    const weights = await getWeights();
    const weightsMap: Record<string, number> = {};

    try {
        weights.forEach(({date, weight}) => (weightsMap[date] = weight));

        for (const trainDate of trainDates) {
            const train = await Storage.getData<Train['exercises']>(trainDate);

            if (!train) {
                return;
            }

            if (Array.isArray(train[0])) {
                return;
            }

            const line: ([number, number, number, number][] | number)[] = [
                train.map(({exercise, weight, approach, repeat}) => [
                    exercise,
                    weight,
                    approach,
                    repeat,
                ]),
            ];

            if (weightsMap[trainDate]) {
                line.push(weightsMap[trainDate]);
            }

            await Storage.saveData(trainDate, line);
        }

        // await Storage.removeData('weight');
    } catch (error) {}
}
