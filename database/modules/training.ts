import { IDB } from "../types";

export type ITraining = {
  id: number;
  name: number;
  date: Date;
};

export function createTrainingModule(db: IDB) {
  return {
    async createTable() {},
    async dropTable() {},
    async insert(data: Omit<ITraining, "id">): Promise<number> {},
    async readSingle(id: number): Promise<ITraining> {},
    async read(): Promise<ITraining[]> {},
  };
}

export type ITrainingModule = ReturnType<typeof createTrainingModule>;
