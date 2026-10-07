import Link from "next/link";
import { business, hampers } from "@/config/business";
import { HamperCard } from "@/components/HamperCard";
import { Divider } from "@/components/Divider";
import { BellIcon, CalendarIcon, GiftIcon, TruckIcon } from "@/components/Icons";
import { reminderTimeLabel } from "@/lib/whatsapp";

const STEPS = [
  { icon: GiftIcon, title: "Choose a hamper", text: "Pick the hamper that fits the moment and tap Order on WhatsApp." },
  { icon: CalendarIcon, title: "Tell us the date", text: "Share the delivery date, address and a message for the card." },
  { icon: TruckIcon, title: "We deliver the surprise", text: `We wrap it beautifully and deliver it across ${business.city.split(",")[0]}, same day if you need it.` },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 md:grid-cols-[1.15fr_1fr] md:px-6 md:pb-20 md:pt-16">
          <div>
            <p className="kicker">Surprise hampers · {business.city}</p>
            <h1 className="mt-4 text-[2.15rem] leading-[1.15] sm:text-5xl md:text-[3.4rem]">
              Surprises they&apos;ll remember
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink/80 md:text-lg">
              Same-day surprise hampers, beautifully wrapped and delivered across Doha. Order in a few taps on WhatsApp.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="#hampers" className="btn btn-primary px-7">
                Browse Hampers
              </Link>
              <Link href="/never-miss-a-moment" className="btn btn-secondary px-7">
                <BellIcon className="h-4 w-4" />
                Never Miss a Date
              </Link>
            </div>
          </div>

          {/* Decorative wrapped-gift panel */}
          <div aria-hidden="true" className="relative mx-auto hidden w-full max-w-sm md:block">
            <div className="relative aspect-square rounded-[2rem] bg-maroon shadow-soft">
              <span className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2 bg-gold/80" />
              <span className="absolute inset-x-0 top-1/2 h-6 -translate-y-1/2 bg-gold/80" />
              <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream shadow-soft">
                <GiftIcon className="h-14 w-14 text-maroon" />
              </div>
            </div>
            <div className="absolute -bottom-5 -left-6 rounded-2xl bg-white px-5 py-3 shadow-soft">
              <p className="kicker text-[0.6rem]">Same day</p>
              <p className="font-heading text-maroon">Delivery in Doha</p>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* Hampers */}
      <section id="hampers" className="scroll-mt-24 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="max-w-xl">
            <p className="kicker">Our hampers</p>
            <h2 className="mt-3 text-3xl md:text-4xl">A hamper for every moment</h2>
            <p className="mt-3 text-ink/75">Tap a hamper to order it on WhatsApp. We&apos;ll confirm the details with you.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hampers.map((h) => (
              <HamperCard key={h.id} hamper={h} />
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center">
            <p className="kicker">How it works</p>
            <h2 className="mt-3 text-3xl md:text-4xl">Three simple steps</h2>
          </div>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="card relative p-6 text-center">
                <span className="absolute left-5 top-5 font-heading text-sm text-gold">0{i + 1}</span>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream text-maroon">
                  <step.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Never Miss a Moment */}
      <section className="px-4 md:px-6">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] bg-maroon px-6 py-12 text-cream shadow-soft md:px-14 md:py-16">
          <span aria-hidden="true" className="absolute -right-10 top-0 h-full w-5 rotate-12 bg-gold/25" />
          <span aria-hidden="true" className="absolute -right-2 top-0 h-full w-2 rotate-12 bg-gold/25" />
          <div className="relative max-w-xl">
            <p className="kicker text-gold">Book once, every year</p>
            <h2 className="mt-3 text-3xl text-cream md:text-4xl">Never Miss a Moment</h2>
            <p className="mt-4 leading-relaxed text-cream/90">
              Sign in, save the birthdays and anniversaries that matter, and book the hamper and delivery time once.
              On the day, we&apos;ll message you on WhatsApp at {reminderTimeLabel()} and deliver the surprise right on time.
            </p>
            <Link href="/never-miss-a-moment" className="btn mt-8 bg-gold px-7 text-maroon-dark hover:bg-cream">
              <BellIcon className="h-4 w-4" />
              Book my dates
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
