import { IDB } from "../types";

export type ITrainingExerciseApproach = {
  id: number;
  idTraining: number;
  idExerciseApproach: number;
};

export function createTrainingExerciseApproachModule(db: IDB) {
  return {
    async createTable() {},
    async dropTable() {},
    async insert(
      data: Omit<ITrainingExerciseApproach, "id">,
    ): Promise<number> {},
    async readSingle(id: number): Promise<ITrainingExerciseApproach> {},
    async read(): Promise<ITrainingExerciseApproach[]> {},
  };
}

export type ITrainingExerciseApproachModule = ReturnType<
  typeof createTrainingExerciseApproachModule
>;
