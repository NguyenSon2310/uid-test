export function diffInDays(date1, date2) {
  date1 = new Date(date1);
  date2 = new Date(date2);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function toYYYYMMDD(date: string) {
  return date.slice(0, 10);
}
