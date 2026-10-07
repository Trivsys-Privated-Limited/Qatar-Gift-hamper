"use client";

import { MONTHS, maxDaysInMonth } from "@/lib/dates";

/** A yearly date picked as day + month (no year). Values are "" until chosen. */
export type DayMonthValue = { day: string; month: string };

export const emptyDayMonth: DayMonthValue = { day: "", month: "" };

export function DayMonthField({
  id,
  label,
  value,
  onChange,
  error,
}: {
  /** Base id: the selects get `${id}-day` and `${id}-month`, the error `${id}-error`. */
  id: string;
  label: string;
  value: DayMonthValue;
  onChange: (value: DayMonthValue) => void;
  error?: string;
}) {
  const days = value.month ? maxDaysInMonth(Number(value.month)) : 31;
  const invalidProps = (empty: boolean) => ({
    "aria-invalid": error && empty ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  });

  return (
    <div>
      <p className="label" id={`${id}-label`}>{label}</p>
      <div className="grid grid-cols-[1fr_1.6fr] gap-3" role="group" aria-labelledby={`${id}-label`}>
        <div>
          <label className="sr-only" htmlFor={`${id}-day`}>{label}: day</label>
          <select
            id={`${id}-day`}
            className="field"
            value={value.day}
            onChange={(e) => onChange({ ...value, day: e.target.value })}
            {...invalidProps(!value.day)}
          >
            <option value="" disabled>Day</option>
            {Array.from({ length: days }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="sr-only" htmlFor={`${id}-month`}>{label}: month</label>
          <select
            id={`${id}-month`}
            className="field"
            value={value.month}
            onChange={(e) => {
              const month = e.target.value;
              // Keep the day valid when switching to a shorter month.
              const day = value.day && Number(value.day) > maxDaysInMonth(Number(month)) ? "" : value.day;
              onChange({ day, month });
            }}
            {...invalidProps(!value.month)}
          >
            <option value="" disabled>Month</option>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
        </div>
      </div>
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm text-[#b42318]">{error}</p>}
    </div>
  );
}
