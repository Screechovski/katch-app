import { IDB, IDBRow } from "../types";

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

export function createApproachModule(db: IDB) {
  return {
    async createTable() {
      await db(
        "CREATE TABLE IF NOT EXISTS approach (id integer primary key AUTOINCREMENT,approach integer NOT NULL,repetitions integer NOT NULL,weight integer NOT NULL);",
      );
    },
    async dropTable() {
      await db("DROP TABLE IF EXISTS approach;");
    },
    async insert(data: Omit<Approach, "id">): Promise<number> {
      const res = await db(
        "INSERT INTO approach (approach,repetitions,weight) VALUES (?, ?, ?)",
        [data.approach, data.repetitions, data.weight],
      );

      return res.id;
    },
    async readSingle(id: number): Promise<Approach> {
      const res = await db("SELECT * FROM approach WHERE id = ?", [id]);

      return new Approach(res.rows[0]);
    },
    async read(): Promise<Approach[]> {
      const res = await db("SELECT * FROM approach");

      return res.rows.map((row) => new Approach(row));
    },
  };
}

export type IApproachModule = ReturnType<typeof createApproachModule>;
