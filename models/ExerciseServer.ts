import { Model } from '@/models/Model';

export class ExerciseServer extends Model {
    ID: number;
    name: string;
    imageName: string;
    constructor(payload: any = {}) {
        super();
        this.ID = this.getNumber(payload.ID);
        this.name = this.getString(payload.name);
        this.imageName = this.getString(payload.imageName);
    }
}
