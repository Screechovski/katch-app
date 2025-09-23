
export class Api {
    private static _base = 'http://localhost:8080/';

    static async exercises(): Promise<{
        id: number
        name: string
        imageName: string
    }[]>{
        const res = await fetch(Api._base + 'api/exercises')
        return res.json();
    }
}