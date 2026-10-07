import type { Hamper } from "@/config/business";
import { formatPrice, orderLink } from "@/lib/whatsapp";
import { HamperImage } from "./HamperImage";
import { WhatsAppIcon } from "./Icons";

export function HamperCard({ hamper }: { hamper: Hamper }) {
  return (
    <article className="card flex flex-col overflow-hidden">
      <HamperImage hamper={hamper} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg leading-snug">{hamper.name}</h3>
          <p className="shrink-0 whitespace-nowrap rounded-full bg-cream px-3 py-1 text-sm font-semibold text-maroon">
            {formatPrice(hamper.price)}
          </p>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/75">{hamper.description}</p>
        <a
          href={orderLink(hamper)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-5 w-full"
          aria-label={`Order the ${hamper.name} on WhatsApp`}
        >
          <WhatsAppIcon className="h-5 w-5" />
          Order on WhatsApp
        </a>
      </div>
    </article>
  );
}
