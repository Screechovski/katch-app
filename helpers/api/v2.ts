import { instance } from '@/helpers/api/v1';
import { ExerciseServer } from '@/models/ExerciseServer';
import { AxiosRequestConfig } from 'axios';

export type SetParams = {
    sets: number;
    weight: number;
    reps: number;
    calories: number;
    distance: number;
    duration: number;
    incline: number;
    speed: number;
    time: number;
};

export type TrainV2Exercise = {
    id: number;
    groups: {
        level: number;
        id: number;
    }[];
    imageName: string;
    name: string;
} & Partial<SetParams>;

export type CurrentTrainExercise = {
    name: string;
    exerciseId: number;
} & Partial<SetParams>;

export type TrainV2 = {
    id: number;
    date: string;
    userWeight: number;
    exercises: TrainV2Exercise[];
};

type TrainsV2 = {
    items: TrainV2[];
    page: number;
    count: number;
    total: number;
};

type SaveTrainExercise = {
    id: number;
} & Partial<SetParams>;

type SaveTrain = {
    date: string;
    weight: number;
    exercises: SaveTrainExercise[];
};

export class ApiV2 {
    static async trains(token: string, page: number): Promise<TrainsV2> {
        const response = await instance.get(`/v2/train?page=${page}`, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    }

    static async saveTrain(token: string, train: SaveTrain): Promise<number> {
        const response = await instance.post('/v2/train', train, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    }

    static async removeTrain(token: string, id: number): Promise<number> {
        const response = await instance.delete('/v2/train', {
            params: { id },
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    }

    static async exercises(token?: string, excludeIds?: number[]): Promise<ExerciseServer[]> {
        let config: AxiosRequestConfig = {};
        if (token) {
            config.headers = { Authorization: token };
        }
        if (excludeIds) {
            config.params = { excludeIds };
        }
        const response = await instance.get('/v2/exercises', config);
        return ExerciseServer.fromArray(response.data);
    }

    static checkToken(token: string): Promise<{ isValid: boolean }> {
        return instance.post('/v2/check-token', { token }).then((response) => response.data);
    }

    static getUserWeight(token: string): Promise<{ weight: number }[]> {
        return instance
            .get('/v2/user/weight', { headers: { authorization: token } })
            .then((response) => response.data);
    }

    static exerciseHistory(
        token: string,
        exerciseId: number,
    ): Promise<{
        history: {
            id: number;
            date: string;
            approaches: SetParams[];
        }[];
        oneRepMax: number | null;
    }> {
        return instance
            .get(`/v2/user/exercises/${exerciseId}/history`, { headers: { authorization: token } })
            .then((response) => response.data);
    }
}
