export function getDateFromPrettyDate(dateStr: string): Date | null {
  const cleanDate = dateStr.replace(/\D/g, "");

  const d: string = cleanDate.substring(0, 2);
  const m: string = cleanDate.substring(2, 4);
  const y: string = cleanDate.substring(4, 8);
  const hh: string = cleanDate.substring(8, 10);
  const mm: string = cleanDate.substring(10, 12);

  if (d && m && y && y.length === 4) {
    if (hh && mm && mm.length === 2) {
      return new Date(+y, +m - 1, +d, +hh, +mm);
    }
    return new Date(+y, +m - 1, +d);
  }
  return null;
}
