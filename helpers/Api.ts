import { ExerciseServer } from '@/types/ExerciseServer';
import { TrainServer } from '@/types/TrainsServer';

const CLOUD_API_BASE_URL = process.env.API_PATH;

const withBase = (path: string) => `${CLOUD_API_BASE_URL}/${path}`;

export class Api {
    static getPhotoUrl(photoName: string) {
        return withBase(`image/exercise/${photoName}`);
    }

    static async exercises(): Promise<ExerciseServer[]> {
        return fetch(withBase(`api/exercises`)).then((d) => d.json());
    }

    static async trains(token: string): Promise<TrainServer[]> {
        return fetch(withBase('api/train'), {
            method: 'GET',
            headers: {
                Authorization: token,
            },
        }).then((d) => d.json());
    }

    static async checkToken(token: string): Promise<{ isValid: boolean }> {
        return fetch(withBase('api/check-token'), {
            method: 'POST',
            body: JSON.stringify({ token }),
        }).then((d) => d.json());
    }
}
