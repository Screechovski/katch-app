export type IDBRow = Record<string, number | string | null | undefined>;

export type IDB = (
  command: string,
  params?: (string | number)[],
) => Promise<{
  id: number;
  rows: IDBRow[];
}>;
