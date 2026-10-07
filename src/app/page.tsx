import Image from "next/image";
import Link from "next/link";
import { business } from "@/config/business";
import { HamperCollection } from "@/components/HamperCollection";
import { HeroVisual } from "@/components/HeroVisual";
import { PersonalCard } from "@/components/PersonalCard";
import { ArrowRightIcon, BellIcon, CardIcon, ChatIcon, DeliveryIcon, RibbonIcon, WhatsAppIcon } from "@/components/Icons";
import { formatTime } from "@/lib/dates";
import { chatLink, reminderTimeLabel } from "@/lib/whatsapp";

const CITY = business.city.split(",")[0];

const TRUST = [
  { icon: DeliveryIcon, label: `Same-day ${CITY} delivery` },
  { icon: RibbonIcon, label: "Beautifully wrapped" },
  { icon: CardIcon, label: "Personalised cards" },
  { icon: ChatIcon, label: "Order via WhatsApp" },
];

const STEPS = [
  { title: "Choose your hamper", text: "Pick the perfect surprise for the moment." },
  { title: "Tell us where & when", text: "Share the delivery date, address and card message." },
  { title: "We deliver the surprise", text: `Beautifully wrapped and delivered across ${CITY}.` },
];

/** Demo values for the "Never miss" preview. */
const SAMPLE_DATES = [
  { label: "My birthday", day: "12", month: "May" },
  { label: "Wife's birthday", day: "24", month: "Aug" },
  { label: "Mother's birthday", day: "03", month: "Nov" },
];

/** Sample reviews for the demo. Replace with real customer reviews before launch. */
const TESTIMONIALS = [
  { quote: "The hamper was beautifully presented and arrived exactly when we needed it.", by: "Doha customer" },
  { quote: "My mother loved the flowers and the card. It felt personal, not like a delivery.", by: "Doha customer" },
  { quote: "Ordering on WhatsApp took two minutes, and the surprise landed right on time.", by: "Doha customer" },
];

const slots = business.deliverySlots;

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-8 md:px-6 md:pt-12 lg:grid-cols-[1fr_1.12fr] lg:gap-14 lg:pb-20 lg:pt-14">
          <div className="animate-fade-up">
            <p className="kicker">Doha&apos;s curated gifting experience</p>
            <h1 className="mt-5 text-[2.6rem] leading-[1.02] min-[400px]:text-5xl sm:text-6xl lg:text-[4.4rem]">
              Surprises
              <br />
              <em className="italic text-maroon">they&apos;ll remember.</em>
            </h1>
            <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-muted">
              Thoughtfully curated gift hampers, beautifully wrapped and delivered across {CITY}, for birthdays,
              anniversaries, new arrivals and every moment worth celebrating.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start xl:flex-row">
              <Link href="#hampers" className="btn btn-primary whitespace-nowrap px-8">
                Browse Hampers
              </Link>
              <a href={chatLink()} target="_blank" rel="noopener noreferrer" className="btn btn-secondary whitespace-nowrap px-8">
                <WhatsAppIcon className="h-4 w-4" />
                Order on WhatsApp
              </a>
            </div>
            <p className="mt-8 flex flex-wrap gap-x-3 gap-y-1 text-[0.7rem] uppercase tracking-[0.2em] text-muted">
              <span>Same-day delivery · {CITY}</span>
              <span aria-hidden="true" className="text-gold">
                ✦
              </span>
              <span>Beautifully wrapped · Personalised card</span>
            </p>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* Trust strip */}
      <section aria-label="Why order with us" className="border-y border-gold/30 bg-sand/70">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-5 px-4 py-6 md:grid-cols-4 md:px-6 md:py-7">
          {TRUST.map((t) => (
            <li key={t.label} className="flex items-center gap-3 md:justify-center">
              <t.icon className="h-6 w-6 shrink-0 text-maroon" />
              <span className="text-[0.68rem] font-medium uppercase leading-snug tracking-[0.18em] text-espresso">{t.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Hampers */}
      <section id="hampers" className="scroll-mt-20 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="reveal flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="kicker">Our hampers</p>
              <h2 className="mt-4 text-[2.5rem] leading-[1.05] sm:text-5xl">For every moment worth remembering.</h2>
              <p className="mt-4 leading-relaxed text-muted">
                From birthdays and anniversaries to new arrivals and heartfelt thank-yous, choose a beautifully curated
                surprise.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <HamperCollection />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 bg-sand py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="reveal mx-auto max-w-2xl text-center">
            <p className="kicker">How it works</p>
            <h2 className="mt-4 text-[2.3rem] leading-[1.08] sm:text-5xl">From choosing to surprising, it&apos;s that simple.</h2>
          </div>
          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="reveal border-t border-gold/60 pt-6">
                <span aria-hidden="true" className="font-heading text-5xl italic text-maroon">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[1.65rem] leading-tight">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Delivery */}
      <section className="py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="reveal relative aspect-[4/3] overflow-hidden rounded-lg bg-sand lg:aspect-[4/4.4]">
            <Image
              src={business.deliveryImage.src}
              alt={business.deliveryImage.alt}
              fill
              sizes="(min-width: 1024px) 540px, 100vw"
              className="object-cover object-[70%_40%]"
            />
          </div>
          <div className="reveal">
            <p className="kicker">Across {CITY}</p>
            <h2 className="mt-4 text-[2.4rem] leading-[1.05] sm:text-5xl">
              Delivered across {CITY}.
              <br />
              <em className="italic text-maroon">Made to feel personal.</em>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-muted">
              From West Bay to The Pearl, Lusail and beyond, your surprise is carefully prepared and delivered with
              attention to every detail.
            </p>
            <dl className="mt-8 grid max-w-md grid-cols-2 gap-6 border-t border-ink/10 pt-6">
              <div>
                <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-muted">Delivery</dt>
                <dd className="mt-1 font-heading text-2xl text-espresso">Same day</dd>
              </div>
              <div>
                <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-muted">Time slots</dt>
                <dd className="mt-1 font-heading text-2xl text-espresso">
                  {formatTime(slots[0])} – {formatTime(slots[slots.length - 1])}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Personalisation */}
      <section className="border-t border-gold/30 bg-sand/60 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <PersonalCard />
        </div>
      </section>

      {/* Never miss a moment */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="reveal relative overflow-hidden rounded-lg bg-espresso px-6 py-12 text-cream sm:px-10 md:px-14 md:py-16">
            <span aria-hidden="true" className="absolute inset-4 rounded border border-gold/20" />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <p className="kicker text-gold-soft">Never miss a moment</p>
                <h2 className="mt-4 text-[2.4rem] leading-[1.05] text-cream sm:text-5xl">
                  Never miss
                  <br />
                  <em className="italic text-gold-soft">the moments that matter.</em>
                </h2>
                <p className="mt-5 max-w-md leading-relaxed text-cream/80">
                  Save important birthdays and anniversaries once, then make every year easier. On the day, we&apos;ll
                  message you on WhatsApp at {reminderTimeLabel()}.
                </p>
                <Link href="/never-miss-a-moment" className="btn btn-light mt-8 px-8">
                  <BellIcon className="h-4 w-4" />
                  Save My Dates
                </Link>
              </div>

              <div>
                <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {SAMPLE_DATES.map((d) => (
                    <li
                      key={d.label}
                      className="flex items-center justify-between gap-4 rounded-md border border-gold/30 bg-cream/[0.06] px-5 py-4 sm:block sm:py-6 lg:flex lg:py-4"
                    >
                      <p className="text-[0.62rem] uppercase tracking-[0.22em] text-cream/70">{d.label}</p>
                      <p className="shrink-0 font-heading text-cream sm:mt-2 lg:mt-0">
                        <span className="text-4xl sm:text-5xl lg:text-4xl">{d.day}</span>{" "}
                        <span className="text-xl uppercase tracking-[0.12em] text-gold-soft">{d.month}</span>
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-cream/60">Example dates. In this demo, your dates are kept in your browser.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section aria-labelledby="reviews-heading" className="pb-16 md:pb-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="reveal text-center">
            <p className="kicker">Kind words</p>
            <h2 id="reviews-heading" className="mt-4 text-[2.3rem] leading-[1.08] sm:text-5xl">
              Made for meaningful moments.
            </h2>
          </div>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <li key={t.quote} className="reveal">
                <figure className="flex h-full flex-col border-t border-gold/60 pt-6">
                  <span aria-hidden="true" className="font-heading text-5xl leading-none text-gold">
                    &ldquo;
                  </span>
                  <blockquote className="mt-1 flex-1 font-heading text-[1.4rem] italic leading-snug text-espresso">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-5 text-[0.68rem] uppercase tracking-[0.2em] text-muted">
                    {t.by} · Sample review
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-xs text-muted">Sample reviews shown for this demo.</p>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="relative overflow-hidden bg-maroon text-cream">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gold/50" />
        <div className="reveal relative mx-auto max-w-3xl px-4 py-16 text-center md:px-6 md:py-24">
          <p className="kicker text-gold-soft">We&apos;re here to help</p>
          <h2 className="mt-4 text-[2.4rem] leading-[1.05] text-cream sm:text-5xl">Have a special moment in mind?</h2>
          <p className="mx-auto mt-5 max-w-lg leading-relaxed text-cream/80">
            Tell us who you&apos;re celebrating. We&apos;ll help you choose the perfect surprise.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={chatLink()} target="_blank" rel="noopener noreferrer" className="btn btn-light px-8">
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <Link href="#hampers" className="btn btn-outline-light px-8">
              Browse Hampers
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
