import axios from 'axios';
import { ExerciseServer } from '@/types/ExerciseServer';
import { TrainServer } from '@/types/TrainsServer';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// instance.interceptors.response.use(
//     (success) => success,
//     (error) => {
//         if (error?.status === 403) {
//             Storage.removeData(Storage.token);
//         }
//     },
// );

export class Api {
    static getPhotoUrl(photoName: string) {
        return `${API_BASE_URL}/image/exercise/${photoName}`;
    }

    static async exercises(): Promise<ExerciseServer[]> {
        const response = await instance.get('/api/exercises');
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

    static async checkToken(token: string): Promise<{ isValid: boolean }> {
        const response = await instance.post('/api/check-token', { token });
        return response.data;
    }
}
