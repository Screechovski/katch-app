import { IApproach } from "./Approach";
import { IPhysicalExercise } from "./PhysicalExercise";

export interface ITraining {
  date: Date;
  name: string;
  exercises: ITrainingExecise[];
}

export type ITrainingExecise = IPhysicalExercise & {
  approuch: IApproach[];
  trainingExeciseId: number;
};
