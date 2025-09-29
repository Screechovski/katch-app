export interface TrainSetServer {
    id: number;
    exerciseId: number;
    exerciseImageName: string;
    exerciseName: string;
    reps: number;
    weight: number;
}

export interface TrainServer {
    id: number;
    date: string;
    userWeight: number;
    sets: TrainSetServer[];
}
