"use client";

import { Great_Vibes } from "next/font/google";
import { useId, useState } from "react";
import { business } from "@/config/business";
import { chatLink } from "@/lib/whatsapp";
import { BowIcon, WhatsAppIcon } from "./Icons";

const script = Great_Vibes({ subsets: ["latin"], weight: "400", display: "swap" });

const SAMPLE = "To someone who makes every day a little brighter.\nWith love.";
const MAX = 150;

/** Live card preview: type a message, see it on the card, then send it to us on WhatsApp. Nothing is saved. */
export function PersonalCard() {
  const [message, setMessage] = useState("");
  const id = useId();
  const shown = message.trim() || SAMPLE;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
      <div className="reveal">
        <p className="kicker">Personalised cards</p>
        <h2 className="mt-4 text-[2.5rem] leading-[1.05] sm:text-5xl">Make it personal.</h2>
        <p className="mt-5 max-w-md leading-relaxed text-muted">
          Every hamper can include a card with your own message. Write it below to see how it will look, then send it
          to us with your order.
        </p>

        <div className="mt-7 max-w-md">
          <label className="label" htmlFor={`${id}-msg`}>
            Your card message
          </label>
          <textarea
            id={`${id}-msg`}
            className="field min-h-24 resize-y"
            rows={3}
            maxLength={MAX}
            placeholder={SAMPLE.replace("\n", " ")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-describedby={`${id}-count`}
          />
          <p id={`${id}-count`} className="mt-1 text-right text-xs text-muted">
            {message.length}/{MAX}
          </p>
          <a
            href={chatLink(`Hello ${business.name}! I'd like to order a hamper with this card message:\n\n"${shown}"`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-3 w-full sm:w-auto"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Add a Personalised Message
          </a>
        </div>
      </div>

      {/* Card mockup */}
      <div className="reveal relative w-[calc(100%-1rem)] max-w-md sm:w-[calc(100%-1.5rem)] lg:max-w-none" aria-hidden="true">
        <div className="absolute inset-0 translate-x-3 translate-y-3 rotate-2 rounded-sm bg-maroon/90 sm:translate-x-5 sm:translate-y-5" />
        <div className="relative -rotate-1 rounded-sm border border-gold/40 bg-[#fffdf8] px-7 py-10 shadow-lift sm:px-12 sm:py-14">
          <div className="absolute inset-3 rounded-sm border border-gold/35" />
          <BowIcon className="relative mx-auto h-5 w-10 text-gold" />
          <p
            className={`${script.className} relative mt-6 min-h-[7.5rem] whitespace-pre-line break-words text-center text-[1.85rem] leading-snug text-espresso sm:text-[2.2rem]`}
          >
            {shown}
          </p>
          <p className="relative mt-6 text-center text-[0.62rem] uppercase tracking-[0.4em] text-muted">{business.name}</p>
        </div>
      </div>
    </div>
  );
}
