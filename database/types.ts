export type IDBRow = Record<string, number | string | null | undefined>;

export type IDB = (
  command: string,
  params?: (string | number)[],
) => Promise<{
  id: number;
  rows: IDBRow[];
}>;

type Nullable<T extends Record<string, number | string>> = {
  [key in keyof T]: T[key] | undefined | null;
};
