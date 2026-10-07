"use client";

import { useId, useState } from "react";
import { signIn, type Birthdays } from "@/lib/session";
import { isValidPhone, normalizePhone } from "@/lib/whatsapp";
import { DayMonthField, emptyDayMonth, type DayMonthValue } from "./DayMonthField";

type BirthdayKey = keyof Birthdays;

const BIRTHDAYS: { key: BirthdayKey; label: string; error: string }[] = [
  { key: "self", label: "My Birthday", error: "Please select your birthday." },
  { key: "wife", label: "Wife's Birthday", error: "Please select your wife's birthday." },
  { key: "mother", label: "Mother's Birthday", error: "Please select your mother's birthday." },
];

type Errors = { name?: string; phone?: string } & Partial<Record<BirthdayKey, string>>;

export function SignInForm({ onSignedIn, className = "" }: { onSignedIn?: () => void; className?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdays, setBirthdays] = useState<Record<BirthdayKey, DayMonthValue>>({
    self: emptyDayMonth,
    wife: emptyDayMonth,
    mother: emptyDayMonth,
  });
  const [errors, setErrors] = useState<Errors>({});
  const uid = useId();

  const setBirthday = (key: BirthdayKey, value: DayMonthValue) => {
    setBirthdays((b) => ({ ...b, [key]: value }));
    if (errors[key] && value.day && value.month) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!phone.trim()) next.phone = "Please enter your WhatsApp number.";
    else if (!isValidPhone(phone)) next.phone = "Enter a valid number, e.g. 5512 3456 or +974 5512 3456.";
    for (const b of BIRTHDAYS) {
      if (!birthdays[b.key].day || !birthdays[b.key].month) next[b.key] = b.error;
    }
    setErrors(next);
    if (next.name) return document.getElementById(`${uid}-name`)?.focus();
    if (next.phone) return document.getElementById(`${uid}-phone`)?.focus();
    const missing = BIRTHDAYS.find((b) => next[b.key]);
    if (missing) {
      const part = birthdays[missing.key].day ? "month" : "day";
      return document.getElementById(`${uid}-${missing.key}-${part}`)?.focus();
    }
    const toDayMonth = (v: DayMonthValue) => ({ day: Number(v.day), month: Number(v.month) });
    signIn({
      name: name.trim(),
      phone: normalizePhone(phone),
      birthdays: {
        self: toDayMonth(birthdays.self),
        wife: toDayMonth(birthdays.wife),
        mother: toDayMonth(birthdays.mother),
      },
    });
    onSignedIn?.();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={`card p-6 sm:p-8 ${className}`}>
      <h2 className="text-xl">Sign in</h2>
      <p className="mt-1 text-sm text-ink/70">Use your WhatsApp number. That&apos;s where your reminders will arrive.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor={`${uid}-name`}>Your name</label>
          <input
            id={`${uid}-name`}
            className="field"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${uid}-name-error` : undefined}
          />
          {errors.name && <p id={`${uid}-name-error`} className="mt-1.5 text-sm text-[#b42318]">{errors.name}</p>}
        </div>
        <div>
          <label className="label" htmlFor={`${uid}-phone`}>Your WhatsApp number</label>
          <input
            id={`${uid}-phone`}
            className="field"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+974 5512 3456"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
          />
          {errors.phone && <p id={`${uid}-phone-error`} className="mt-1.5 text-sm text-[#b42318]">{errors.phone}</p>}
        </div>
      </div>

      <fieldset className="mt-7">
        <legend className="kicker">Birthday reminders</legend>
        <p className="mt-2 text-sm text-ink/70">Save the important dates you&apos;d like us to remember.</p>
        <div className="mt-4 space-y-4">
          {BIRTHDAYS.map((b) => (
            <DayMonthField
              key={b.key}
              id={`${uid}-${b.key}`}
              label={b.label}
              value={birthdays[b.key]}
              onChange={(v) => setBirthday(b.key, v)}
              error={errors[b.key]}
            />
          ))}
        </div>
      </fieldset>

      <button type="submit" className="btn btn-primary mt-6 w-full">Continue</button>
      <p className="mt-4 text-center text-xs text-ink/60">
        Demo sign-in. The live version confirms your number with a WhatsApp code.
      </p>
    </form>
  );
}
