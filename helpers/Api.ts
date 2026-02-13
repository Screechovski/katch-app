import axios from 'axios';
import { ExerciseServer } from '@/models/ExerciseServer';
import { TrainServer } from '@/models/TrainsServer';
import { Model } from '@/models/Model';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 3000,
});

export class Api {
    static getPhotoUrl(photoName: string) {
        return `${API_BASE_URL}/image/exercise/${photoName}`;
    }

    static async exercises(token?: string): Promise<ExerciseServer[]> {
        const response = await instance.get('/api/exercises', {
            headers: token
                ? {
                      Authorization: token,
                  }
                : undefined,
        });
        return Model.toTypedArray(response.data, ExerciseServer);
    }

    static async exerciseHistory(
        token: string,
        exerciseId: number,
    ): Promise<
        {
            trainDate: string;
            trainId: number;
            approaches: {
                reps: number;
                weight: number;
                sets: number;
            }[];
        }[]
    > {
        const response = await instance.get(
            `/api/exercise/history/${exerciseId}`,
            {
                headers: {
                    Authorization: token,
                },
            },
        );
        return response.data;
    }

    static async trains(token: string): Promise<TrainServer[]> {
        const response = await instance.get('/api/train', {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    }

    static async saveTrain(token: string, train: any): Promise<TrainServer[]> {
        const response = await instance.post('/api/train', train, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    }

    static async removeTrain(token: string, id: number): Promise<void> {
        const response = await instance.delete('/api/train', {
            params: { id },
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    }

    static checkToken(token: string): Promise<{ isValid: boolean }> {
        return instance
            .post('/api/check-token', { token })
            .then((response) => response.data);
    }
}
