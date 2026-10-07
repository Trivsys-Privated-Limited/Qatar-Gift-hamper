import type { Metadata } from "next";
import { RemindersApp } from "@/components/RemindersApp";
import { Divider } from "@/components/Divider";
import { reminderTimeLabel } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Never Miss a Moment",
  description: "Book a hamper for every birthday and anniversary. We remind you on WhatsApp and deliver on the day.",
};

export default function NeverMissAMomentPage() {
  return (
    <div className="pb-20 md:pb-28">
      <section className="mx-auto max-w-3xl px-4 pb-8 pt-10 text-center md:px-6 md:pt-14">
        <p className="kicker">Book once, every year</p>
        <h1 className="mt-3 text-3xl leading-tight sm:text-4xl md:text-5xl">Never Miss a Moment</h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink/80">
          Save the dates that matter and book the hamper once. On the day, we&apos;ll message you on WhatsApp at{" "}
          {reminderTimeLabel()} and deliver the surprise at the time you chose.
        </p>
      </section>
      <Divider className="mb-10" />
      <RemindersApp />
    </div>
  );
}
