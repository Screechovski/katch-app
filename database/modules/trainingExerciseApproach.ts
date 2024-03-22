import { IDBRow } from "../types";
import { DBModule } from "./module";

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

export class TrainingExerciseApproachModule extends DBModule {
  static async createTable() {
    await this.execut(
      "CREATE TABLE IF NOT EXISTS training_exercise_approach (id integer primary key AUTOINCREMENT,id_training integer NOT NULL,id_exercise_approach integer NOT NULL,FOREIGN KEY(id_training) REFERENCES training(id),FOREIGN KEY(id_exercise_approach) REFERENCES exercise_approach(id));",
    );
  }

  static async dropTable() {
    await this.execut("DROP TABLE IF EXISTS training_exercise_approach;");
  }

  static async insert(
    data: Omit<TrainingExerciseApproach, "id">,
  ): Promise<number> {
    const res = await this.execut(
      "INSERT INTO training_exercise_approach (id_training,id_exercise_approach) VALUES (?, ?)",
      [data.idTraining, data.idExerciseApproach],
    );

    return res.id;
  }

  static async readSingle(id: number): Promise<TrainingExerciseApproach> {
    const res = await this.execut(
      "SELECT * FROM training_exercise_approach WHERE id = ?",
      [id],
    );

    return new TrainingExerciseApproach(res.rows[0]);
  }

  static async read(): Promise<TrainingExerciseApproach[]> {
    const res = await this.execut("SELECT * FROM training_exercise_approach");

    return res.rows.map((row) => new TrainingExerciseApproach(row));
  }
}
