import { IExerciseApproach } from "./IExerciseApproach";

export type ITraining = {
  id?: number;
  name: string;
  date: Date;
  exercises: IExerciseApproach[];
};
