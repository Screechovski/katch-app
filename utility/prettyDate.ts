export function getPrettyDate(date: Date) {
  let hh: string | number = date.getHours();
  let mm: string | number = date.getMinutes();
  let d: string | number = date.getDate();
  let m: string | number = date.getMonth() + 1;
  const y = date.getFullYear();

  if (d < 10) {
    d = "0" + d;
  }

  if (m < 10) {
    m = "0" + m;
  }

  if (hh < 10) {
    hh = "0" + hh;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  return `${d}.${m}.${y} ${hh}:${mm}`;
}
