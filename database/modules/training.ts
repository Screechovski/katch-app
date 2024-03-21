import { IDB, IDBRow } from "../types";

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

export function createTrainingModule(db: IDB) {
  return {
    async createTable() {
      await db(
        "CREATE TABLE IF NOT EXISTS training (id integer primary key AUTOINCREMENT,date text NOT NULL,name text NOT NULL);",
      );
    },
    async dropTable() {
      await db("DROP TABLE IF EXISTS training;");
    },
    async insert(data: Omit<Training, "id">): Promise<number> {
      const res = await db("INSERT INTO training (date,name ) VALUES (?, ?)", [
        data.date.toISOString(),
        data.name,
      ]);

      return res.id;
    },
    async readSingle(id: number): Promise<Training> {
      const res = await db("SELECT * FROM training WHERE id = ?;", [id]);

      return new Training(res.rows[0]);
    },
    async read(): Promise<Training[]> {
      const res = await db("SELECT * FROM training");

      return res.rows.map((row) => new Training(row));
    },
  };
}

export type ITrainingModule = ReturnType<typeof createTrainingModule>;
