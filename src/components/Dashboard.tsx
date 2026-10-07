"use client";

import { useEffect, useMemo, useState } from "react";
import { countdownLabel, formatShortDate, formatTime } from "@/lib/dates";
import { reminderStatus, useNow, useOccasions, withCountdown, type ReminderStatus, type UpcomingOccasion } from "@/lib/occasions";
import { bookedHamper, formatPhone, occasionLabel, reminderMessage, reminderTimeLabel, waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Icons";

export function Dashboard() {
  const { occasions, resetDemo } = useOccasions();
  const now = useNow();
  const upcoming = useMemo(() => (occasions ? withCountdown(occasions, now) : null), [occasions, now]);

  const stats = upcoming && {
    total: upcoming.length,
    week: upcoming.filter((o) => o.daysUntil <= 7).length,
    today: upcoming.filter((o) => o.daysUntil === 0).length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 md:px-6 md:pt-12">
      <div className="rounded-2xl border border-gold bg-gold/15 px-4 py-3 text-sm text-maroon-dark" role="note">
        <strong className="font-semibold">Demo version.</strong> In the live version, reminders are sent automatically at{" "}
        {reminderTimeLabel()} on each occasion day.
      </div>

      <div className="mt-8">
        <p className="kicker">Owner dashboard</p>
        <h1 className="mt-2 text-3xl md:text-4xl">Upcoming deliveries</h1>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">
        <Stat label="Booked dates" value={stats?.total} />
        <Stat label="Deliveries in the next 7 days" value={stats?.week} />
        <Stat label="Deliveries today" hint={`Reminders go out at ${reminderTimeLabel()}`} value={stats?.today} highlight />
      </dl>

      <section className="mt-10" aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading" className="sr-only">Upcoming deliveries</h2>
        {upcoming === null ? (
          <div className="card h-48 animate-pulse" aria-hidden="true" />
        ) : upcoming.length === 0 ? (
          <div className="card p-8 text-center text-ink/70">No booked dates yet.</div>
        ) : (
          <>
            {/* Mobile and tablet: cards */}
            <ul className="grid gap-3 md:grid-cols-2 lg:hidden">
              {upcoming.map((o) => (
                <li key={o.id} className="card flex flex-col p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-heading text-lg text-maroon">{o.recipientName}</p>
                      <p className="text-sm capitalize text-ink/75">
                        {occasionLabel(o)} · {formatShortDate(o.date)}
                      </p>
                    </div>
                    <DaysLeft days={o.daysUntil} />
                  </div>
                  <dl className="mt-3 grid flex-1 grid-cols-[auto_1fr] content-start gap-x-3 gap-y-1 text-sm">
                    <dt className="text-ink/60">Customer</dt>
                    <dd className="min-w-0 truncate font-medium">
                      {o.customerName} {o.sample && <SampleTag />}
                    </dd>
                    <dt className="text-ink/60">WhatsApp</dt>
                    <dd className="font-medium">{formatPhone(o.customerPhone)}</dd>
                    <dt className="text-ink/60">Hamper</dt>
                    <dd className="font-medium">{bookedHamper(o).name}</dd>
                    <dt className="text-ink/60">Deliver</dt>
                    <dd className="min-w-0 break-words font-medium">
                      {formatTime(o.deliveryTime)} · {o.deliveryAddress}
                    </dd>
                    <dt className="text-ink/60">Reminder</dt>
                    <dd><StatusBadge status={reminderStatus(o, now)} /></dd>
                  </dl>
                  <SendButton occasion={o} className="mt-4 w-full" />
                </li>
              ))}
            </ul>

            {/* Desktop: table */}
            <div className="card hidden overflow-hidden lg:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream/70 text-xs uppercase tracking-[0.15em] text-maroon">
                  <tr>
                    <th scope="col" className="px-4 py-3.5 font-semibold">Customer</th>
                    <th scope="col" className="px-4 py-3.5 font-semibold">Recipient</th>
                    <th scope="col" className="px-4 py-3.5 font-semibold">Date</th>
                    <th scope="col" className="px-4 py-3.5 font-semibold">Delivery</th>
                    <th scope="col" className="px-4 py-3.5 font-semibold">Reminder</th>
                    <th scope="col" className="px-4 py-3.5"><span className="sr-only">Action</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10 align-top">
                  {upcoming.map((o) => (
                    <tr key={o.id} className={o.daysUntil === 0 ? "bg-gold/10" : ""}>
                      <td className="px-4 py-4">
                        <p className="font-medium">
                          {o.customerName} {o.sample && <SampleTag />}
                        </p>
                        <p className="whitespace-nowrap text-ink/60">{formatPhone(o.customerPhone)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{o.recipientName} <span className="font-normal text-ink/55">({o.relationship})</span></p>
                        <p className="capitalize text-ink/60">{occasionLabel(o)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="whitespace-nowrap">{formatShortDate(o.date)}</p>
                        <div className="mt-1"><DaysLeft days={o.daysUntil} /></div>
                      </td>
                      <td className="max-w-64 px-4 py-4">
                        <p className="font-medium">{formatTime(o.deliveryTime)} · {bookedHamper(o).name}</p>
                        <p className="break-words text-ink/60">{o.deliveryAddress}</p>
                      </td>
                      <td className="px-4 py-4"><StatusBadge status={reminderStatus(o, now)} /></td>
                      <td className="px-4 py-4 text-right"><SendButton occasion={o} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <div className="mt-12 flex flex-col items-start gap-3 border-t border-gold/50 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/65">Demo data is stored in this browser only.</p>
        <ResetButton onReset={resetDemo} />
      </div>
    </div>
  );
}

function Stat({ label, value, hint, highlight = false }: { label: string; value?: number; hint?: string; highlight?: boolean }) {
  return (
    <div className={`card p-5 ${highlight ? "bg-maroon text-cream" : ""}`}>
      <dt className={`text-xs font-semibold uppercase tracking-[0.15em] ${highlight ? "text-gold" : "text-maroon"}`}>{label}</dt>
      <dd className={`mt-2 font-heading text-4xl ${highlight ? "text-cream" : "text-ink"}`}>{value ?? "–"}</dd>
      {hint && <dd className={`mt-1 text-xs ${highlight ? "text-cream/80" : "text-ink/60"}`}>{hint}</dd>}
    </div>
  );
}

function DaysLeft({ days }: { days: number }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
        days <= 1 ? "bg-maroon text-cream" : days <= 7 ? "bg-gold/40 text-maroon-dark" : "bg-cream text-ink/75"
      }`}
    >
      {days <= 1 ? countdownLabel(days) : `${days} days`}
    </span>
  );
}

function StatusBadge({ status }: { status: ReminderStatus }) {
  const text = { scheduled: `Scheduled, ${reminderTimeLabel()}`, sent: "Sent today", delivered: "Delivered" }[status];
  const tone = status === "scheduled" ? "bg-cream text-ink/75" : "bg-[#DCF8C6] text-[#1f5130]";
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{text}</span>;
}

function SampleTag() {
  return (
    <span className="ml-1 rounded bg-gold/30 px-1.5 py-0.5 align-middle text-[0.6rem] font-semibold uppercase tracking-wider text-maroon-dark">
      Sample
    </span>
  );
}

function SendButton({ occasion, className = "" }: { occasion: UpcomingOccasion; className?: string }) {
  return (
    <a
      href={waLink(occasion.customerPhone, reminderMessage(occasion))}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-primary min-h-10 whitespace-nowrap px-4 py-2 text-[0.8rem] ${className}`}
      aria-label={`Send reminder to ${occasion.customerName} about ${occasion.recipientName}'s ${occasionLabel(occasion)}`}
    >
      <WhatsAppIcon className="h-4 w-4" />
      Send reminder
    </a>
  );
}

function ResetButton({ onReset }: { onReset: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 2500);
    return () => clearTimeout(t);
  }, [done]);

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-ink/75">Replace all data with the samples?</span>
        <button
          type="button"
          className="btn min-h-10 bg-[#b42318] px-4 py-2 text-[0.8rem] text-white hover:bg-[#912018]"
          onClick={() => {
            onReset();
            setConfirming(false);
            setDone(true);
          }}
        >
          Reset
        </button>
        <button type="button" className="text-sm font-medium text-ink/70 hover:text-ink" onClick={() => setConfirming(false)}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {done && <span role="status" className="text-sm text-maroon">Demo data reset.</span>}
      <button type="button" className="btn btn-secondary min-h-10 px-4 py-2 text-[0.8rem]" onClick={() => setConfirming(true)}>
        Reset demo data
      </button>
    </div>
  );
}
