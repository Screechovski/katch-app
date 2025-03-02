import { IApproach } from "./IApproach";
import { IExercise } from "./IExercise";

export type IExerciseApproach = {
  id: number;
  exercise: IExercise;
  approaches: IApproach[];
};
