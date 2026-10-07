import Link from "next/link";
import { business } from "@/config/business";
import { formatPhone, waLink } from "@/lib/whatsapp";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gold/60 bg-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <Logo className="h-16 md:h-20" />
          <p className="mt-3 max-w-xs text-sm text-ink/75">
            Surprise gift hampers, beautifully wrapped and delivered across {business.city}.
          </p>
        </div>

        <div>
          <p className="kicker">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-maroon" href="/#hampers">Hampers</Link></li>
            <li><Link className="hover:text-maroon" href="/never-miss-a-moment">Never Miss a Moment</Link></li>
            <li><Link className="hover:text-maroon" href="/dashboard">Owner dashboard (demo)</Link></li>
          </ul>
        </div>

        <div>
          <p className="kicker">Order on WhatsApp</p>
          <a
            href={waLink(business.whatsappNumber, `Hi ${business.name}, I'd like to order a hamper.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-maroon hover:underline"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {formatPhone(business.whatsappNumber)}
          </a>
          <p className="mt-2 text-sm text-ink/75">{business.city}</p>
        </div>
      </div>
      <div className="border-t border-gold/40">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-ink/60 md:px-6">
          © {new Date().getFullYear()} {business.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
