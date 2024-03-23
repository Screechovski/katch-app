export function dateMask(date: string) {
  const cleanDate = date.replace(/\D/g, "");

  let d: number | string = cleanDate.substring(0, 2);
  let m: number | string = cleanDate.substring(2, 4);
  let y: number | string = cleanDate.substring(4, 8);
  let hh: number | string = cleanDate.substring(8, 10);
  let mm: number | string = cleanDate.substring(10, 12);

  if (mm) {
    return `${d}.${m}.${y} ${hh}:${mm}`;
  }
  if (hh) {
    return `${d}.${m}.${y} ${hh}`;
  }
  if (y) {
    return `${d}.${m}.${y}`;
  }
  if (m) {
    // if (+m > 12) {
    //   m = 12;
    // }

    // if (+m > 1 && +m < 10) {
    //   m = "0" + m;
    // }
    return `${d}.${m}`;
  }
  // if (d !== "" && +d > 3 && +d < 10) {
  //   d = "0" + d;
  // }
  return d;
}
