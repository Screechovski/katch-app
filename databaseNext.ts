import * as SQLite from "expo-sqlite/next";

const dbExecuterNext = async (
  command: string,
  params: (string | number | null)[] = [],
) => {
  const db = await SQLite.openDatabaseAsync("primary");

  const res = await db.runAsync(command, params);

  await db.closeAsync();

  return res;
};
