interface TrainServerSetExerciseMuscleGroup {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    Name: string;
}

interface TrainServerSetExerciseSecondaryMuscles {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    exerciseId: number;
    muscleGroupId: number;
    MuscleGroup: TrainServerSetExerciseMuscleGroup;
    engagementLevel: number;
}

export interface TrainServerSetExercise {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    name: string;
    imageName: string;
    MuscleGroupID: number;
    MuscleGroup: TrainServerSetExerciseMuscleGroup;
    SecondaryMuscles: TrainServerSetExerciseSecondaryMuscles[];
}

export interface TrainServerSet {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    reps: number;
    weight: number;
    trainId: number;
    exerciseId: number;
    Exercise: TrainServerSetExercise;
}

export interface TrainServer {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    Date: string;
    UserWeight: number;
    UserID: number;
    Sets: TrainServerSet[];
}
