"use client";

import { useEffect, useId, useState } from "react";
import { business, hampers } from "@/config/business";
import { MONTHS, formatTime, maxDaysInMonth } from "@/lib/dates";
import { OCCASION_TYPES, RELATIONSHIPS, type Occasion, type OccasionInput, type OccasionType, type Relationship } from "@/lib/occasions";
import type { Session } from "@/lib/session";
import { formatPrice, reminderTimeLabel } from "@/lib/whatsapp";

type FormState = {
  recipientName: string;
  relationship: Relationship | "";
  occasionType: OccasionType | "";
  occasionOther: string;
  day: string;
  month: string;
  hamperId: string;
  deliveryTime: string;
  deliveryAddress: string;
  cardMessage: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const CARD_MAX = 150;

const empty: FormState = {
  recipientName: "",
  relationship: "",
  occasionType: "",
  occasionOther: "",
  day: "",
  month: "",
  hamperId: "",
  deliveryTime: "",
  deliveryAddress: "",
  cardMessage: "",
};

function fromOccasion(o: Occasion): FormState {
  return {
    recipientName: o.recipientName,
    relationship: o.relationship,
    occasionType: o.occasionType,
    occasionOther: o.occasionOther ?? "",
    day: String(o.day),
    month: String(o.month),
    hamperId: o.hamperId,
    deliveryTime: o.deliveryTime,
    deliveryAddress: o.deliveryAddress,
    cardMessage: o.cardMessage ?? "",
  };
}

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.recipientName.trim()) e.recipientName = "Who is the surprise for?";
  if (!f.relationship) e.relationship = "Please choose a relationship.";
  if (!f.occasionType) e.occasionType = "Please choose an occasion.";
  if (f.occasionType === "Other" && !f.occasionOther.trim()) e.occasionOther = "Tell us what the occasion is.";
  if (!f.day) e.day = "Choose a day.";
  if (!f.month) e.month = "Choose a month.";
  if (!f.hamperId) e.hamperId = "Choose the hamper to deliver.";
  if (!f.deliveryTime) e.deliveryTime = "Choose a delivery time.";
  if (!f.deliveryAddress.trim()) e.deliveryAddress = "Where should we deliver it?";
  return e;
}

export function OccasionForm({
  session,
  editing,
  onSubmit,
  onCancelEdit,
}: {
  session: Session;
  editing: Occasion | null;
  onSubmit: (input: OccasionInput) => void;
  onCancelEdit: () => void;
}) {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  useEffect(() => {
    setForm(editing ? fromOccasion(editing) : empty);
    setErrors({});
  }, [editing]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Keep the day valid when switching to a shorter month.
      if (key === "month" && next.day && Number(next.day) > maxDaysInMonth(Number(value))) next.day = "";
      return next;
    });
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    const firstError = Object.keys(e)[0];
    if (firstError) {
      document.getElementById(id(firstError))?.focus();
      return;
    }
    onSubmit({
      customerName: session.name,
      customerPhone: session.phone,
      recipientName: form.recipientName.trim(),
      relationship: form.relationship as Relationship,
      occasionType: form.occasionType as OccasionType,
      occasionOther: form.occasionType === "Other" ? form.occasionOther.trim() : undefined,
      day: Number(form.day),
      month: Number(form.month),
      hamperId: form.hamperId,
      deliveryTime: form.deliveryTime,
      deliveryAddress: form.deliveryAddress.trim(),
      cardMessage: form.cardMessage.trim() || undefined,
    });
    if (!editing) setForm(empty);
  };

  const days = form.month ? maxDaysInMonth(Number(form.month)) : 31;

  const fieldProps = (name: keyof FormState) => ({
    id: id(name),
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? id(`${name}-error`) : undefined,
  });

  const errorText = (name: keyof FormState) =>
    errors[name] ? (
      <p id={id(`${name}-error`)} className="mt-1.5 text-sm text-[#b42318]">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="card p-5 sm:p-7">
      <h2 className="text-xl">{editing ? `Edit ${editing.recipientName}'s date` : "Add a date"}</h2>
      <p className="mt-1 text-sm text-ink/70">
        On the day, we&apos;ll message you on WhatsApp at {reminderTimeLabel()} and deliver the hamper at the time you choose.
      </p>

      <fieldset className="mt-6">
        <legend className="kicker mb-3">The occasion</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor={id("recipientName")}>Who it&apos;s for</label>
            <input {...fieldProps("recipientName")} className="field" placeholder="Their name" value={form.recipientName} onChange={(e) => set("recipientName", e.target.value)} />
            {errorText("recipientName")}
          </div>
          <div>
            <label className="label" htmlFor={id("relationship")}>Relationship</label>
            <select {...fieldProps("relationship")} className="field" value={form.relationship} onChange={(e) => set("relationship", e.target.value as Relationship)}>
              <option value="" disabled>Choose…</option>
              {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {errorText("relationship")}
          </div>
          <div className={form.occasionType === "Other" ? "" : "sm:col-span-2"}>
            <label className="label" htmlFor={id("occasionType")}>Occasion</label>
            <select {...fieldProps("occasionType")} className="field" value={form.occasionType} onChange={(e) => set("occasionType", e.target.value as OccasionType)}>
              <option value="" disabled>Choose…</option>
              {OCCASION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errorText("occasionType")}
          </div>
          {form.occasionType === "Other" && (
            <div>
              <label className="label" htmlFor={id("occasionOther")}>What&apos;s the occasion?</label>
              <input {...fieldProps("occasionOther")} className="field" placeholder="e.g. Graduation day" value={form.occasionOther} onChange={(e) => set("occasionOther", e.target.value)} />
              {errorText("occasionOther")}
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="label" id={id("date-label")}>Date <span className="font-normal text-ink/60">(repeats every year)</span></p>
          <div className="grid grid-cols-[1fr_1.6fr] gap-3" role="group" aria-labelledby={id("date-label")}>
            <div>
              <label className="sr-only" htmlFor={id("day")}>Day</label>
              <select {...fieldProps("day")} className="field" value={form.day} onChange={(e) => set("day", e.target.value)}>
                <option value="" disabled>Day</option>
                {Array.from({ length: days }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errorText("day")}
            </div>
            <div>
              <label className="sr-only" htmlFor={id("month")}>Month</label>
              <select {...fieldProps("month")} className="field" value={form.month} onChange={(e) => set("month", e.target.value)}>
                <option value="" disabled>Month</option>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
              {errorText("month")}
            </div>
          </div>
          {form.month === "2" && form.day === "29" && (
            <p className="mt-1.5 text-xs text-ink/65">In years without 29 February, we&apos;ll deliver on 28 February.</p>
          )}
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="kicker mb-3">The surprise</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor={id("hamperId")}>Hamper to deliver</label>
            <select {...fieldProps("hamperId")} className="field" value={form.hamperId} onChange={(e) => set("hamperId", e.target.value)}>
              <option value="" disabled>Choose a hamper…</option>
              {hampers.map((h) => <option key={h.id} value={h.id}>{h.name} ({formatPrice(h.price)})</option>)}
            </select>
            {errorText("hamperId")}
          </div>
          <div>
            <label className="label" htmlFor={id("deliveryTime")}>Delivery time</label>
            <select {...fieldProps("deliveryTime")} className="field" value={form.deliveryTime} onChange={(e) => set("deliveryTime", e.target.value)}>
              <option value="" disabled>Choose a time…</option>
              {business.deliverySlots.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
            </select>
            {errorText("deliveryTime")}
          </div>
          <div>
            <label className="label" htmlFor={id("deliveryAddress")}>Delivery address in Doha</label>
            <input
              {...fieldProps("deliveryAddress")}
              className="field"
              autoComplete="street-address"
              placeholder="e.g. Villa 12, Street 840, Al Waab"
              value={form.deliveryAddress}
              onChange={(e) => set("deliveryAddress", e.target.value)}
            />
            {errorText("deliveryAddress")}
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor={id("cardMessage")}>
              Card message <span className="font-normal text-ink/60">(optional)</span>
            </label>
            <textarea
              {...fieldProps("cardMessage")}
              className="field min-h-20 resize-y"
              maxLength={CARD_MAX}
              rows={2}
              placeholder="Happy birthday! With love…"
              value={form.cardMessage}
              onChange={(e) => set("cardMessage", e.target.value)}
            />
            <p className="mt-1 text-right text-xs text-ink/55">{form.cardMessage.length}/{CARD_MAX}</p>
          </div>
        </div>
      </fieldset>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn btn-primary sm:px-8">
          {editing ? "Save changes" : "Book this date"}
        </button>
        {editing && (
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
