import { Model } from '@/models/Model';

export class ExerciseServer extends Model {
    id: number;
    name: string;
    imageName: string;

    constructor(payload: any = {}) {
        super();
        this.id = this.getNumber(payload.id);
        this.name = this.getString(payload.name);
        this.imageName = this.getString(payload.imageName);
    }

    static fromArray(arr: any): ExerciseServer[] {
        return (Array.isArray(arr) ? arr : []).map((item) => new ExerciseServer(item));
    }
}
