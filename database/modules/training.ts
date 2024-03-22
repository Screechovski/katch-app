import { IDBRow } from "../types";
import { DBModule } from "./module";

export class Training {
  id: number;
  name: string;
  date: Date;
  constructor(options: IDBRow) {
    this.id = +(options.id ?? -1);
    this.name = (options.name ?? "").toString();
    this.date = options.date ? new Date(options.date) : new Date();
  }
}

export class TrainingModule extends DBModule {
  static async createTable() {
    await this.execut(
      "CREATE TABLE IF NOT EXISTS training (id integer primary key AUTOINCREMENT,date text NOT NULL,name text NOT NULL);",
    );
  }

  static async dropTable() {
    await this.execut("DROP TABLE IF EXISTS training;");
  }

  static async insert(data: Omit<Training, "id">): Promise<number> {
    const res = await this.execut(
      "INSERT INTO training (date,name ) VALUES (?, ?)",
      [data.date.toISOString(), data.name],
    );

    return res.id;
  }

  static async readSingle(id: number): Promise<Training> {
    const res = await this.execut("SELECT * FROM training WHERE id = ?;", [id]);

    return new Training(res.rows[0]);
  }

  static async read(): Promise<Training[]> {
    const res = await this.execut("SELECT * FROM training");

    return res.rows.map((row) => new Training(row));
  }
}
