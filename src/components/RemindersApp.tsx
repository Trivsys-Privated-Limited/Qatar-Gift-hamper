"use client";

import { useMemo, useRef, useState } from "react";
import { countdownLabel, formatDayMonth, formatLongDate, formatTime } from "@/lib/dates";
import {
  reminderAt,
  reminderStatus,
  useNow,
  useOccasions,
  withCountdown,
  type Occasion,
  type OccasionInput,
  type UpcomingOccasion,
} from "@/lib/occasions";
import { signOut, useSession } from "@/lib/session";
import { bookedHamper, formatPhone, occasionLabel, reminderTimeLabel } from "@/lib/whatsapp";
import { OccasionForm } from "./OccasionForm";
import { ReminderPreview } from "./ReminderPreview";
import { SignInForm } from "./SignInForm";
import { CheckIcon, GiftIcon } from "./Icons";

export function RemindersApp() {
  const session = useSession();
  const { occasions, add, update, remove } = useOccasions();
  const [editing, setEditing] = useState<Occasion | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const now = useNow();

  const mine = useMemo(() => {
    if (!occasions || !session) return null;
    return withCountdown(
      occasions.filter((o) => o.customerPhone === session.phone),
      now,
    );
  }, [occasions, session, now]);

  if (session === undefined || (session && mine === null)) {
    return (
      <div className="mx-auto max-w-6xl px-4 md:px-6" aria-hidden="true">
        <div className="card h-96 animate-pulse" />
      </div>
    );
  }

  if (!session || !mine) {
    return (
      <div className="mx-auto max-w-md px-4">
        <SignInForm />
      </div>
    );
  }

  const saved = mine.find((o) => o.id === savedId) ?? null;
  const previewing = mine.find((o) => o.id === previewId) ?? null;

  const handleSubmit = (input: OccasionInput) => {
    if (editing) {
      update(editing.id, input);
      setSavedId(editing.id);
      setEditing(null);
    } else {
      setSavedId(add(input).id);
    }
  };

  const startEdit = (o: Occasion) => {
    setSavedId(null);
    setEditing(o);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/60 px-4 py-3 text-sm">
        <p className="min-w-0 text-ink/75">
          Signed in as <strong className="text-ink">{session.name}</strong> · {formatPhone(session.phone)}
        </p>
        <button type="button" onClick={signOut} className="font-semibold text-maroon underline underline-offset-4">
          Sign out
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div ref={formRef} className="scroll-mt-24 space-y-4">
          {saved && (
            <div role="status" className="card flex items-start gap-3 border border-gold/70 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon text-cream">
                <CheckIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-maroon">Booked!</p>
                <p className="mt-0.5 text-sm text-ink/75">{bookingSummary(saved, now)}</p>
                <button type="button" className="mt-2 text-sm font-semibold text-maroon underline underline-offset-4" onClick={() => setPreviewId(saved.id)}>
                  Preview the reminder
                </button>
              </div>
              <button type="button" onClick={() => setSavedId(null)} className="text-sm text-ink/60 hover:text-ink" aria-label="Dismiss message">
                ✕
              </button>
            </div>
          )}
          <OccasionForm session={session} editing={editing} onSubmit={handleSubmit} onCancelEdit={() => setEditing(null)} />
        </div>

        <section aria-labelledby="saved-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="saved-heading" className="text-xl">My dates</h2>
            <p className="text-sm text-ink/60">{mine.length} booked</p>
          </div>

          {mine.length === 0 ? (
            <div className="card mt-4 p-8 text-center">
              <GiftIcon className="mx-auto h-10 w-10 text-gold" />
              <p className="mt-3 font-semibold">No dates yet</p>
              <p className="mt-1 text-sm text-ink/70">
                Add a birthday or anniversary. On the day, we&apos;ll message you at {reminderTimeLabel()} and deliver your surprise.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {mine.map((o) => (
                <OccasionItem
                  key={o.id}
                  occasion={o}
                  now={now}
                  isEditing={editing?.id === o.id}
                  onPreview={() => setPreviewId(o.id)}
                  onEdit={() => startEdit(o)}
                  onDelete={() => {
                    remove(o.id);
                    if (editing?.id === o.id) setEditing(null);
                    if (savedId === o.id) setSavedId(null);
                  }}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      <ReminderPreview occasion={previewing} onClose={() => setPreviewId(null)} />
    </div>
  );
}

function bookingSummary(o: UpcomingOccasion, now: Date): string {
  const delivery = `${o.recipientName}'s ${bookedHamper(o).name} arrives at ${formatTime(o.deliveryTime)}`;
  if (o.daysUntil > 0) return `On ${formatLongDate(o.date)} we'll message you at ${reminderTimeLabel()}, and ${delivery}.`;
  if (now >= reminderAt(o)) return `We've just sent your WhatsApp reminder, and ${delivery} today.`;
  return `Today at ${reminderTimeLabel()} we'll message you, and ${delivery}.`;
}

const STATUS_TEXT = {
  scheduled: () => `Reminder at ${reminderTimeLabel()}`,
  sent: () => "Reminder sent",
  delivered: () => "Delivered",
};

function OccasionItem({
  occasion: o,
  now,
  isEditing,
  onPreview,
  onEdit,
  onDelete,
}: {
  occasion: UpcomingOccasion;
  now: Date;
  isEditing: boolean;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const status = reminderStatus(o, now);
  const soon = o.daysUntil <= 1;

  return (
    <li className={`card p-4 sm:p-5 ${isEditing ? "ring-2 ring-maroon" : ""}`}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-heading text-lg text-maroon">{o.recipientName}</p>
          <p className="text-sm text-ink/75">
            <span className="capitalize">{occasionLabel(o)}</span> · {o.relationship} · {formatDayMonth(o)}
          </p>
        </div>
        <span
          className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
            soon ? "bg-maroon text-cream" : "bg-gold/30 text-maroon-dark"
          }`}
        >
          {countdownLabel(o.daysUntil)}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-xl bg-cream/70 px-3 py-2.5 text-sm">
        <dt className="text-ink/60">Hamper</dt>
        <dd className="font-medium">{bookedHamper(o).name}</dd>
        <dt className="text-ink/60">Delivery</dt>
        <dd className="min-w-0 font-medium">
          {formatTime(o.deliveryTime)} · <span className="break-words">{o.deliveryAddress}</span>
        </dd>
        <dt className="text-ink/60">Status</dt>
        <dd className={`font-medium ${status === "scheduled" ? "" : "text-maroon"}`}>
          {o.daysUntil === 0 && status !== "scheduled" ? `${STATUS_TEXT[status]()} today` : STATUS_TEXT[status]()}
        </dd>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={onPreview} className="btn btn-primary min-h-10 px-4 py-2 text-[0.8rem]">
          Preview reminder
        </button>
        <button type="button" onClick={onEdit} className="btn btn-secondary min-h-10 px-4 py-2 text-[0.8rem]" aria-label={`Edit ${o.recipientName}'s ${occasionLabel(o)}`}>
          Edit
        </button>
        {confirming ? (
          <span className="flex items-center gap-2">
            <button type="button" onClick={onDelete} className="btn min-h-10 bg-[#b42318] px-4 py-2 text-[0.8rem] text-white hover:bg-[#912018]">
              Yes, delete
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="text-sm font-medium text-ink/70 hover:text-ink">
              Keep
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="btn min-h-10 px-3 py-2 text-[0.8rem] text-ink/70 hover:text-[#b42318]"
            aria-label={`Delete ${o.recipientName}'s ${occasionLabel(o)}`}
          >
            Delete
          </button>
        )}
      </div>
    </li>
  );
}
