"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { business } from "@/config/business";
import { addDays, atTime, nextOccurrence } from "./dates";

export const RELATIONSHIPS = ["Wife", "Husband", "Mother", "Father", "Child", "Friend", "Colleague", "Other"] as const;
export const OCCASION_TYPES = ["Birthday", "Anniversary", "Other"] as const;

export type Relationship = (typeof RELATIONSHIPS)[number];
export type OccasionType = (typeof OCCASION_TYPES)[number];

/** A yearly occasion with a pre-booked hamper delivery. */
export type Occasion = {
  id: string;
  customerName: string;
  /** Digits only, international format (e.g. 97455551234). Links the occasion to the signed-in customer. */
  customerPhone: string;
  recipientName: string;
  relationship: Relationship;
  occasionType: OccasionType;
  occasionOther?: string;
  day: number;
  month: number;
  hamperId: string;
  /** 24-hour "HH:MM", one of business.deliverySlots. */
  deliveryTime: string;
  deliveryAddress: string;
  cardMessage?: string;
  /** True for the demo entries added on first load. */
  sample?: boolean;
  createdAt: number;
};

export type OccasionInput = Omit<Occasion, "id" | "createdAt" | "sample">;

// v2: occasions now carry a booked hamper, delivery time and address.
const STORAGE_KEY = "qsh:occasions:v2";

let state: Occasion[] | null = null;
const listeners = new Set<() => void>();

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Four sample bookings relative to today: tomorrow, in 3 days, in 2 weeks, in 2 months. */
function seedOccasions(): Occasion[] {
  const today = new Date();
  const at = (days: number) => {
    const d = addDays(today, days);
    return { day: d.getDate(), month: d.getMonth() + 1 };
  };
  const base = { sample: true, createdAt: Date.now() };
  return [
    { ...base, id: newId(), customerName: "Aisha", customerPhone: "97455500101", recipientName: "Khalid", relationship: "Husband", occasionType: "Anniversary", ...at(1), hamperId: "romantic", deliveryTime: "19:00", deliveryAddress: "Villa 12, Street 840, Al Waab", cardMessage: "Happy anniversary, my love." },
    { ...base, id: newId(), customerName: "Mohammed", customerPhone: "97455500102", recipientName: "Fatima", relationship: "Mother", occasionType: "Birthday", ...at(3), hamperId: "birthday", deliveryTime: "16:00", deliveryAddress: "Building 5, Al Sadd" },
    { ...base, id: newId(), customerName: "Sarah", customerPhone: "97455500103", recipientName: "Omar", relationship: "Friend", occasionType: "Birthday", ...at(14), hamperId: "birthday", deliveryTime: "13:00", deliveryAddress: "Tower 3, West Bay" },
    { ...base, id: newId(), customerName: "Yousef", customerPhone: "97455500104", recipientName: "Maryam", relationship: "Wife", occasionType: "Anniversary", ...at(60), hamperId: "anniversary", deliveryTime: "20:00", deliveryAddress: "Porto Arabia, The Pearl" },
  ];
}

function read(): Occasion[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      const seeded = seedOccasions();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return seedOccasions();
  }
}

function write(next: Occasion[]) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked (e.g. private mode): keep working in memory.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      state = read();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Occasion[] {
  if (state === null) state = read();
  return state;
}

const getServerSnapshot = () => null;

/** All saved occasions. `occasions` is null until loaded in the browser. */
export function useOccasions() {
  const occasions = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { occasions, add, update, remove, resetDemo };
}

export function add(input: OccasionInput): Occasion {
  const occasion: Occasion = { ...input, id: newId(), createdAt: Date.now() };
  write([...getSnapshot(), occasion]);
  return occasion;
}

export function update(id: string, input: OccasionInput) {
  write(getSnapshot().map((o) => (o.id === id ? { ...o, ...input, sample: false } : o)));
}

export function remove(id: string) {
  write(getSnapshot().filter((o) => o.id !== id));
}

export function resetDemo() {
  write(seedOccasions());
}

export type UpcomingOccasion = Occasion & { date: Date; daysUntil: number };

export function withCountdown(list: Occasion[], now = new Date()): UpcomingOccasion[] {
  return list
    .map((o) => {
      const next = nextOccurrence(o, now);
      // Booked today after today's delivery slot had passed: the first delivery is next year.
      if (next.daysUntil === 0 && o.createdAt > deliveryAt({ ...o, ...next }).getTime()) {
        const later = nextOccurrence(o, addDays(now, 1));
        return { ...o, date: later.date, daysUntil: later.daysUntil + 1 };
      }
      return { ...o, ...next };
    })
    .sort(
      (a, b) =>
        a.daysUntil - b.daysUntil ||
        a.deliveryTime.localeCompare(b.deliveryTime) ||
        a.recipientName.localeCompare(b.recipientName),
    );
}

/** When the reminder for this occurrence goes out: 11:50 AM on the occasion day. */
export function reminderAt(o: UpcomingOccasion): Date {
  return atTime(o.date, business.reminderTime.hour, business.reminderTime.minute);
}

export function deliveryAt(o: Pick<UpcomingOccasion, "date" | "deliveryTime">): Date {
  const [h, m] = o.deliveryTime.split(":").map(Number);
  return atTime(o.date, h, m);
}

export type ReminderStatus = "scheduled" | "sent" | "delivered";

export function reminderStatus(o: UpcomingOccasion, now = new Date()): ReminderStatus {
  if (o.daysUntil > 0) return "scheduled";
  if (now >= deliveryAt(o)) return "delivered";
  if (now >= reminderAt(o)) return "sent";
  return "scheduled";
}

/** Current time, refreshed every 30 seconds so countdowns and statuses stay live. */
export function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
