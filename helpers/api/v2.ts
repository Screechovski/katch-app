import { instance } from '@/helpers/api/v1';
import { ExerciseServer } from '@/models/ExerciseServer';
import { AxiosRequestConfig } from 'axios';

type TrainV2Exercise = {
    id: number;
    sets: number;
    weight: number;
    reps: number;
    groups: {
        level: number;
        id: number;
    }[];
    imageName: string;
    name: string;
};

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
    sets: number;
    reps: number;
    weight: number;
};

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

    static async exercises(token?: string): Promise<ExerciseServer[]> {
        let config: AxiosRequestConfig = {};
        if (token) {
            config.headers = { Authorization: token };
        }
        const response = await instance.get('/v2/exercises', config);
        return ExerciseServer.fromArray(response.data);
    }
}
