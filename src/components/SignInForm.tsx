"use client";

import { useId, useState } from "react";
import { signIn } from "@/lib/session";
import { isValidPhone, normalizePhone } from "@/lib/whatsapp";

export function SignInForm({ onSignedIn, className = "" }: { onSignedIn?: () => void; className?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const uid = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!phone.trim()) next.phone = "Please enter your WhatsApp number.";
    else if (!isValidPhone(phone)) next.phone = "Enter a valid number, e.g. 5512 3456 or +974 5512 3456.";
    setErrors(next);
    if (next.name) return document.getElementById(`${uid}-name`)?.focus();
    if (next.phone) return document.getElementById(`${uid}-phone`)?.focus();
    signIn({ name: name.trim(), phone: normalizePhone(phone) });
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

      <button type="submit" className="btn btn-primary mt-6 w-full">Continue</button>
      <p className="mt-4 text-center text-xs text-ink/60">
        Demo sign-in. The live version confirms your number with a WhatsApp code.
      </p>
    </form>
  );
}
