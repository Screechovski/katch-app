import { ExerciseServer } from '@/types/ExerciseServer';
import { TrainServer } from '@/types/TrainsServer';

const CLOUD_API_BASE_URL = process.env.API_PATH;

export class Api {
    private static _base = CLOUD_API_BASE_URL;

    static getPhotoUrl(photoName: string) {
        return `${this._base}/image/exercise/${photoName}`;
    }

    static async exercises(): Promise<ExerciseServer[]> {
        return fetch(Api._base + 'api/exercises').then((d) => d.json());
    }

    static async trains(token: string): Promise<TrainServer[]> {
        return fetch(Api._base + 'api/train', {
            method: 'GET',
            headers: {
                Authorization: token,
            },
        }).then((d) => d.json());
    }

    static async checkToken(token: string): Promise<{ isValid: boolean }> {
        return fetch(Api._base + 'api/check-token', {
            method: 'POST',
            body: JSON.stringify({ token }),
        }).then((d) => d.json());
    }
}
