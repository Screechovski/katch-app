import {Storage} from '@/helpers/Storage';

interface Weight {
    date: string;
    weight: number;
}

export function useWeight() {
    const save = async (weight: number, date: string) => {
        try {
            const weights = (await Storage.getData<Weight[]>('weight')) ?? [];
            await Storage.saveData('weight', [
                ...weights,
                {
                    date,
                    weight,
                },
            ]);
        } catch (error) {
            console.error(error);
        }
    };

    const get = async () => {
        return (await Storage.getData<Weight[]>('weight')) ?? [];
    };

    return {
        save,
        get,
    };
}
