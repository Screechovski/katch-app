import { IDB, IDBRow } from "../types";

export class ExerciseApproach {
  id: number;
  idApproach: number;
  idExercise: number;

  constructor(options: IDBRow) {
    this.id = +(options.id ?? -1);
    this.idApproach = +(options.idApproach ?? -1);
    this.idExercise = +(options.idExercise ?? -1);
  }
}

export function createExerciseApproachModule(db: IDB) {
  return {
    async createTable() {
      await db(
        "CREATE TABLE IF NOT EXISTS exercise_approach (id integer primary key AUTOINCREMENT,id_approach integer NOT NULL,id_exercise integer NOT NULL,FOREIGN KEY(id) REFERENCES approach(id));",
      );
    },
    async dropTable() {
      await db("DROP TABLE IF EXISTS exercise_approach;");
    },
    async insert(data: Omit<ExerciseApproach, "id">): Promise<number> {
      const res = await db(
        "INSERT INTO exercise_approach (id_approach,id_exercise) VALUES (?, ?)",
        [data.idApproach, data.idExercise],
      );

      return res.id;
    },
    async readSingle(id: number): Promise<ExerciseApproach> {
      const res = await db("SELECT * FROM exercise_approach WHERE id = ?", [
        id,
      ]);

      return new ExerciseApproach(res.rows[0]);
    },
    async read(): Promise<ExerciseApproach[]> {
      const res = await db("SELECT * FROM exercise_approach");

      return res.rows.map(
        (row) =>
          new ExerciseApproach({
            id: row.id,
            idApproach: row.idApproach,
            idExercise: row.idExercise,
          }),
      );
    },
  };
}

export type IExerciseApproachModule = ReturnType<
  typeof createExerciseApproachModule
>;
