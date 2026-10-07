"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { business } from "@/config/business";
import { dateKey } from "@/lib/dates";
import { reminderStatus, useNow, useOccasions, withCountdown, type UpcomingOccasion } from "@/lib/occasions";
import { useSession } from "@/lib/session";
import { reminderMessage } from "@/lib/whatsapp";
import { CloseIcon, WhatsAppIcon } from "./Icons";

const NOTIFIED_KEY = "qsh:notified:v1";

function readNotified(): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(NOTIFIED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function markNotified(key: string) {
  try {
    window.localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...readNotified(), key].slice(-200)));
  } catch {
    // Without storage the toast may show again on reload, which is harmless in a demo.
  }
}

/**
 * Stands in for the real WhatsApp message in the demo: once it is 11:50 AM on one of the
 * signed-in customer's dates, a WhatsApp-style notification pops up inside the site.
 */
export function ReminderNotifier() {
  const session = useSession();
  const { occasions } = useOccasions();
  const now = useNow(15_000);
  const [queue, setQueue] = useState<UpcomingOccasion[]>([]);

  useEffect(() => {
    if (!session || !occasions) return;
    const notified = new Set(readNotified());
    const due = withCountdown(
      occasions.filter((o) => o.customerPhone === session.phone),
      now,
    ).filter((o) => reminderStatus(o, now) === "sent" && !notified.has(`${o.id}:${dateKey(o.date)}`));
    if (due.length === 0) return;
    due.forEach((o) => markNotified(`${o.id}:${dateKey(o.date)}`));
    setQueue((q) => [...q, ...due]);
  }, [session, occasions, now]);

  const current = queue[0];
  if (!current) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-bubble fixed inset-x-3 bottom-3 z-50 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-96"
    >
      <div className="flex items-center gap-2 bg-[#075E54] px-4 py-2 text-xs text-white">
        <WhatsAppIcon className="h-4 w-4" />
        <span className="font-semibold">WhatsApp</span>
        <span className="text-white/75">· now</span>
        <button
          type="button"
          onClick={() => setQueue((q) => q.slice(1))}
          className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/15"
          aria-label="Dismiss notification"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="px-4 pb-4 pt-3">
        <p className="text-sm font-semibold text-[#111b21]">{business.name}</p>
        <p className="mt-1 line-clamp-6 whitespace-pre-line text-sm leading-snug text-[#3b4a54]">{reminderMessage(current)}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-ink/55">Demo: in the live version this arrives on WhatsApp.</p>
          <Link
            href="/never-miss-a-moment"
            onClick={() => setQueue((q) => q.slice(1))}
            className="shrink-0 text-sm font-semibold text-[#027EB5] hover:underline"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
