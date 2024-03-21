import { IExerciseApproach } from "./IExerciseApproach";

export class ITraining {
  name: string;
  date: Date;
  exercises: IExerciseApproach[];

  constructor(options: {
    name: string;
    date: Date;
    exercises: IExerciseApproach[];
  }) {
    this.date = options.date ?? new Date();
    this.name = options.name ?? `Train_${this.date}`;
    this.exercises = options.exercises ?? [];
  }
}
