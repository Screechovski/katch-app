import { IDBRow } from "../types";
import { DBModule } from "./module";

export class Approach {
  id: number;
  weight: number;
  repetitions: number;
  approaches: number;

  constructor(options: IDBRow) {
    this.id = +(options.id ?? -1);
    this.weight = +(options.weight ?? -1);
    this.repetitions = +(options.repetitions ?? -1);
    this.approaches = +(options.approaches ?? -1);
  }
}

export class ApproachModule extends DBModule {
  static async createTable() {
    await this.execut(
      "CREATE TABLE IF NOT EXISTS approach (id integer primary key AUTOINCREMENT,approach integer NOT NULL,repetitions integer NOT NULL,weight integer NOT NULL);",
    );
  }

  static async dropTable() {
    await this.execut("DROP TABLE IF EXISTS approach;");
  }

  static async insert(data: Omit<Approach, "id">): Promise<number> {
    const res = await this.execut(
      "INSERT INTO approach (approach,repetitions,weight) VALUES (?, ?, ?)",
      [data.approaches, data.repetitions, data.weight],
    );

    return res.id;
  }

  static async readSingle(id: number): Promise<Approach> {
    const res = await this.execut("SELECT * FROM approach WHERE id = ?", [id]);

    return new Approach(res.rows[0]);
  }

  static async read(): Promise<Approach[]> {
    const res = await this.execut("SELECT * FROM approach");

    return res.rows.map((row) => new Approach(row));
  }
}
