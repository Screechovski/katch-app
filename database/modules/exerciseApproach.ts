import { IDBRow } from "../types";
import { DBModule } from "./module";

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

export class ExerciseApproachModule extends DBModule {
  static async createTable() {
    await this.execut(
      "CREATE TABLE IF NOT EXISTS exercise_approach (id integer primary key AUTOINCREMENT,id_approach integer NOT NULL,id_exercise integer NOT NULL,FOREIGN KEY(id) REFERENCES approach(id));",
    );
  }

  static async dropTable() {
    await this.execut("DROP TABLE IF EXISTS exercise_approach;");
  }

  static async insert(data: Omit<ExerciseApproach, "id">): Promise<number> {
    const res = await this.execut(
      "INSERT INTO exercise_approach (id_approach,id_exercise) VALUES (?, ?)",
      [data.idApproach, data.idExercise],
    );

    return res.id;
  }

  static async readSingle(id: number): Promise<ExerciseApproach> {
    const res = await this.execut(
      "SELECT * FROM exercise_approach WHERE id = ?",
      [id],
    );

    return new ExerciseApproach(res.rows[0]);
  }

  static async read(): Promise<ExerciseApproach[]> {
    const res = await this.execut("SELECT * FROM exercise_approach");

    return res.rows.map(
      (row) =>
        new ExerciseApproach({
          id: row.id,
          idApproach: row.idApproach,
          idExercise: row.idExercise,
        }),
    );
  }
}
