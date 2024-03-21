import { IApproach } from "./IApproach";
import { IExercise, exercises } from "./IExercise";

export class IExerciseApproach {
  id: number;
  exercise: IExercise;
  approaches: IApproach[];

  constructor(options: {
    id?: number;
    exercise: IExercise;
    approaches: IApproach[];
  }) {
    this.id = options.id ?? new Date().getTime();
    this.exercise = options.exercise ?? exercises[0];
    this.approaches = options.approaches ?? [];
  }
}
