/** Date helpers for yearly-repeating occasions (day + month only). Months are 1-12. */

export type DayMonth = { day: number; month: number };

const MS_PER_DAY = 86_400_000;

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Days a month can have in any year (February allows 29 so leap-day birthdays can be saved). */
export function maxDaysInMonth(month: number): number {
  return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 31;
}

/** Day count since epoch for a calendar date, immune to time zones and daylight saving. */
function dayIndex(year: number, month: number, day: number): number {
  return Math.round(Date.UTC(year, month - 1, day) / MS_PER_DAY);
}

/** The occasion's date in a given year. 29 February falls back to 28 February in non-leap years. */
function dateInYear({ day, month }: DayMonth, year: number) {
  if (month === 2 && day === 29 && !isLeapYear(year)) return { year, month: 2, day: 28 };
  return { year, month, day };
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Next time this occasion happens (today counts), and how many days away it is. */
export function nextOccurrence(dm: DayMonth, today: Date = new Date()) {
  const todayIdx = dayIndex(today.getFullYear(), today.getMonth() + 1, today.getDate());
  let d = dateInYear(dm, today.getFullYear());
  if (dayIndex(d.year, d.month, d.day) < todayIdx) d = dateInYear(dm, today.getFullYear() + 1);
  return {
    date: new Date(d.year, d.month - 1, d.day),
    daysUntil: dayIndex(d.year, d.month, d.day) - todayIdx,
  };
}

export function countdownLabel(daysUntil: number): string {
  if (daysUntil === 0) return "Today";
  if (daysUntil === 1) return "Tomorrow";
  return `in ${daysUntil} days`;
}

export function formatDayMonth({ day, month }: DayMonth): string {
  return `${day} ${MONTHS[month - 1]}`;
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

/** "15:00" -> "3:00 PM" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}:${pad2(m)} ${h < 12 ? "AM" : "PM"}`;
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Local calendar date as "YYYY-MM-DD". */
export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** The moment on `date` at the given 24-hour time. */
export function atTime(date: Date, hour: number, minute: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute);
}
