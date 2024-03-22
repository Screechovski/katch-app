import * as SQLite from "expo-sqlite";
import { IDBRow } from "../types";

const db = SQLite.openDatabase("primary.db");

export class DBModule {
  constructor() {}

  static execut<T extends IDBRow = IDBRow>(
    command: string,
    params: (string | number)[] = [],
  ) {
    return new Promise<{
      id: number;
      rows: T[];
    }>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          command,
          params,
          (_, result) => {
            resolve({
              id: result.insertId ?? -1,
              rows: result.rows._array,
            });
          },
          (_, error) => {
            reject(error);
            return false;
          },
        );
      });
    });
  }
}
