import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

export const instance = axios.create({
    baseURL: API_BASE_URL + '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 3000,
});

export class Api {
    static getPhotoUrl(photoName: string) {
        return `${API_BASE_URL}/image/exercise/${photoName}`;
    }
}
