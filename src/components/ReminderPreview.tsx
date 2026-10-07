"use client";

import { useEffect, useRef, useState } from "react";
import { business } from "@/config/business";
import { formatLongDate, formatShortDate, formatTime } from "@/lib/dates";
import type { UpcomingOccasion } from "@/lib/occasions";
import { bookedHamper, changeBookingLink, formatPrice, reminderMessage, reminderTimeLabel } from "@/lib/whatsapp";
import { HamperImage } from "./HamperImage";
import { BellIcon, CloseIcon, GiftIcon } from "./Icons";

/** A WhatsApp-style mock of the reminder the customer receives at 11:50 AM on the occasion day. */
export function ReminderPreview({ occasion, onClose }: { occasion: UpcomingOccasion | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [demo, setDemo] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (occasion && !dialog.open) {
      setDemo(false);
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!occasion && dialog.open) {
      dialog.close();
    }
  }, [occasion]);

  useEffect(() => {
    if (!demo) return;
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 1100);
    return () => clearTimeout(t);
  }, [demo]);

  useEffect(() => () => void (document.body.style.overflow = ""), []);

  const reminderDate = occasion?.date ?? null;
  const hamper = occasion ? bookedHamper(occasion) : null;

  return (
    <dialog
      ref={dialogRef}
      onClose={() => {
        document.body.style.overflow = "";
        onClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      aria-labelledby="preview-title"
      className="m-auto h-[100dvh] max-h-[100dvh] w-full max-w-full bg-transparent p-0 sm:h-[min(880px,94dvh)] sm:max-h-[94dvh] sm:max-w-md"
    >
      {occasion && reminderDate && hamper && (
        <div className="flex h-full flex-col overflow-hidden bg-cream sm:rounded-3xl sm:shadow-2xl">
          {/* Toolbar */}
          <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">
            <div className="min-w-0">
              <p className="kicker text-[0.62rem]">Reminder preview</p>
              <h2 id="preview-title" className="mt-1 truncate text-lg">
                {occasion.recipientName}&apos;s {occasion.occasionType === "Other" ? occasion.occasionOther : occasion.occasionType}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-maroon hover:bg-gold/20"
              aria-label="Close preview"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="px-4 pb-3">
            <button
              type="button"
              role="switch"
              aria-checked={demo}
              onClick={() => setDemo((v) => !v)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-gold/70 bg-white px-4 py-3 text-left"
            >
              <span>
                <span className="block text-sm font-semibold text-ink">Demo mode: jump to {reminderTimeLabel()} on the day</span>
                <span className="block text-xs text-ink/65">
                  {demo ? `Simulating ${formatLongDate(reminderDate)}, ${reminderTimeLabel()}` : "See the reminder arrive as the customer would"}
                </span>
              </span>
              <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${demo ? "bg-maroon" : "bg-ink/20"}`} aria-hidden="true">
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${demo ? "left-6" : "left-1"}`} />
              </span>
            </button>
          </div>

          {/* Phone */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-t border-black/10">
            <div className="flex items-center gap-3 bg-[#075E54] px-3 py-2.5 text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <AvatarLogo />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.95rem] font-semibold">{business.name}</span>
                <span className="block text-xs text-white/80">{demo && typing ? "typing…" : "Business account"}</span>
              </span>
            </div>

            <div
              className="min-h-0 flex-1 overflow-y-auto px-3 py-4"
              style={{
                backgroundColor: "#EFE7DD",
                backgroundImage: "radial-gradient(rgba(0,0,0,0.035) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            >
              <div className="mb-4 flex justify-center">
                <span className="rounded-lg bg-[#E1F2FB] px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-[#4a5a63] shadow-sm">
                  {demo ? "Today" : formatShortDate(reminderDate)}
                </span>
              </div>

              {!demo && (
                <div className="mb-4 flex justify-center">
                  <p className="flex max-w-[85%] items-center gap-2 rounded-lg bg-[#FFF5C4] px-3 py-2 text-center text-xs text-[#54471a] shadow-sm">
                    <BellIcon className="h-4 w-4 shrink-0" />
                    Scheduled for {formatLongDate(reminderDate)} at {reminderTimeLabel()}, on the day.
                  </p>
                </div>
              )}

              {demo && typing ? (
                <div className="animate-bubble inline-flex gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm" aria-label="Typing">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="animate-typing h-2 w-2 rounded-full bg-[#8696a0]" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              ) : (
                <div className={`space-y-2 ${demo ? "" : "opacity-70"}`} aria-live="polite">
                  <Bubble delay={0} first>
                    <p className="whitespace-pre-line text-[0.92rem] leading-snug text-[#111b21]">
                      {reminderMessage(occasion)}
                    </p>
                  </Bubble>
                  <Bubble delay={demo ? 300 : 0}>
                    <div className="-mx-1.5 -mt-1 overflow-hidden rounded-lg">
                      <HamperImage hamper={hamper} compact aspect="aspect-[16/9]" />
                    </div>
                    <div className="mt-2 flex items-baseline justify-between gap-2">
                      <p className="text-[0.92rem] font-semibold text-[#111b21]">{hamper.name}</p>
                      <p className="shrink-0 text-sm font-semibold text-[#075E54]">{formatPrice(hamper.price)}</p>
                    </div>
                    <p className="mt-0.5 text-xs leading-snug text-[#54656f]">
                      Arriving at {formatTime(occasion.deliveryTime)} · {occasion.deliveryAddress}
                    </p>
                    <a
                      href={changeBookingLink(occasion)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="-mx-1.5 mt-2 block border-t border-black/10 pt-2 text-center text-sm font-semibold text-[#027EB5] hover:underline"
                    >
                      Change booking
                    </a>
                  </Bubble>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 bg-[#F0F2F5] px-3 py-2" aria-hidden="true">
              <span className="flex-1 rounded-full bg-white px-4 py-2 text-sm text-[#8696a0]">Message</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00A884] text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M3 20.5 21 12 3 3.5 3 10l12 2-12 2z" /></svg>
              </span>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

function Bubble({ children, delay, first = false }: { children: React.ReactNode; delay: number; first?: boolean }) {
  return (
    <div
      className={`animate-bubble relative max-w-[88%] rounded-xl bg-white px-3 pb-1.5 pt-2 shadow-sm ${first ? "rounded-tl-sm" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
      <p className="mt-1 text-right text-[0.65rem] text-[#667781]">{reminderTimeLabel()}</p>
    </div>
  );
}

function AvatarLogo() {
  const [failed, setFailed] = useState(false);
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cream text-maroon">
      {failed || !business.logo ? (
        <GiftIcon className="h-6 w-6" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={business.logo} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      )}
    </span>
  );
}
