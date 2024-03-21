import { IDB, IDBRow } from "../types";

export class TrainingExerciseApproach {
  id: number;
  idTraining: number;
  idExerciseApproach: number;
  constructor(options: IDBRow) {
    this.id = +(options.id ?? -1);
    this.idTraining = +(options.idTraining ?? -1);
    this.idExerciseApproach = +(options.idExerciseApproach ?? -1);
  }
}

export function createTrainingExerciseApproachModule(db: IDB) {
  return {
    async createTable() {
      await db("DROP TABLE IF EXISTS training_exercise_approach;");
    },
    async dropTable() {
      await db(
        "CREATE TABLE IF NOT EXISTS training_exercise_approach (id integer primary key AUTOINCREMENT,id_training integer NOT NULL,id_exercise_approach integer NOT NULL,FOREIGN KEY(id_training) REFERENCES training(id),FOREIGN KEY(id_exercise_approach) REFERENCES exercise_approach(id));",
      );
    },
    async insert(data: Omit<TrainingExerciseApproach, "id">): Promise<number> {
      const res = await db(
        "INSERT INTO training_exercise_approach (id_training,id_exercise_approach) VALUES (?, ?)",
        [data.idTraining, data.idExerciseApproach],
      );

      return res.id;
    },
    async readSingle(id: number): Promise<TrainingExerciseApproach> {
      const res = await db(
        "SELECT * FROM training_exercise_approach WHERE id = ?",
        [id]
      );

      return new TrainingExerciseApproach(res.rows[0]);
    },
    async read(): Promise<TrainingExerciseApproach[]> {
      const res = await db("SELECT * FROM training_exercise_approach");

      return res.rows.map((row) => new TrainingExerciseApproach(row));
    },
  };
}

export type ITrainingExerciseApproachModule = ReturnType<
  typeof createTrainingExerciseApproachModule
>;
