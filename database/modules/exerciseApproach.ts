import { IDB } from "../types";

export type IExerciseApproach = {
  id: number;
  idApproach: number;
  idExercise: number;
};

export function createExerciseApproachModule(db: IDB) {
  return {
    async createTable() {},
    async dropTable() {},
    async insert(data: Omit<IExerciseApproach, "id">): Promise<number> {},
    async readSingle(id: number): Promise<IExerciseApproach> {},
    async read(): Promise<IExerciseApproach[]> {},
  };
}

export type IExerciseApproachModule = ReturnType<
  typeof createExerciseApproachModule
>;
