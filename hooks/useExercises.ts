import { Api } from '@/helpers/Api';
import { useEffect, useState } from 'react';

export interface ExercisesServer {
    id: number
    name: string
    imageName: string
}

export function useExercises(){
    const [data, setData] = useState<ExercisesServer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const load = async () => {
        try {
            setLoading(true);

            const res = await Api.exercises();

            setData(res);
        } catch (error) {
            if (
                error &&
                typeof error === 'object' &&
                'message' in error &&
                typeof error.message === 'string'
            ) {
                setError(error.message)
            } else {
                setError('Ошибка при загрузке упражнений')
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load()
    }, [])

    return {
        data,
        loading,
        error,
    }
}