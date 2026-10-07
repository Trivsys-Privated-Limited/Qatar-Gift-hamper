import { business, hampers, type Hamper } from "@/config/business";
import type { Occasion } from "./occasions";
import { formatTime, pad2 } from "./dates";

/**
 * Turns whatever the customer typed into digits-only international format for wa.me.
 * Strips spaces, plus signs, dashes, brackets and a leading 00.
 * A bare 8-digit number is treated as a Qatar number and gets the 974 country code.
 */
export function normalizePhone(input: string): string {
  let digits = input.replace(/[\s+\-().]/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (/^\d{8}$/.test(digits)) digits = `974${digits}`;
  return digits;
}

/** Accepts Qatar numbers (8 digits, with or without 974) and other international numbers. */
export function isValidPhone(input: string): boolean {
  const digits = normalizePhone(input);
  if (digits.startsWith("974")) return /^974\d{8}$/.test(digits);
  return /^[1-9]\d{9,14}$/.test(digits);
}

/** "+974 7009 5262" style, for display only. */
export function formatPhone(input: string): string {
  const digits = normalizePhone(input);
  const m = digits.match(/^974(\d{4})(\d{4})$/);
  return m ? `+974 ${m[1]} ${m[2]}` : `+${digits}`;
}

export function waLink(phone: string, text: string): string {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;
}

export function formatPrice(price: number): string {
  return `${business.currency} ${price.toLocaleString("en-US")}`;
}

export function orderMessage(hamper: Hamper): string {
  return `Hi, I'd like to order the ${hamper.name} (${business.currency} ${hamper.price})`;
}

export function orderLink(hamper: Hamper): string {
  return waLink(business.whatsappNumber, orderMessage(hamper));
}

export function occasionLabel(o: Pick<Occasion, "occasionType" | "occasionOther">): string {
  if (o.occasionType === "Other") return o.occasionOther?.trim() || "special day";
  return o.occasionType.toLowerCase();
}

export function bookedHamper(o: Pick<Occasion, "hamperId">): Hamper {
  return hampers.find((h) => h.id === o.hamperId) ?? hampers[0];
}

export function reminderTimeLabel(): string {
  const { hour, minute } = business.reminderTime;
  return formatTime(`${pad2(hour)}:${pad2(minute)}`);
}

/** The 11:50 AM WhatsApp reminder, sent on the occasion day. */
export function reminderMessage(o: Occasion): string {
  const hamper = bookedHamper(o);
  const lines = [
    `Hi ${o.customerName}! Today is ${o.recipientName}'s ${occasionLabel(o)} 🎁`,
    "",
    `Your ${hamper.name} (${formatPrice(hamper.price)}) will be delivered at ${formatTime(o.deliveryTime)} to ${o.deliveryAddress}.`,
  ];
  if (o.cardMessage) lines.push("", `Card message: "${o.cardMessage}"`);
  lines.push("", "Reply here if you'd like to change anything.", business.name);
  return lines.join("\n");
}

/** Lets the customer message the business about a booking. */
export function changeBookingLink(o: Occasion): string {
  return waLink(
    business.whatsappNumber,
    `Hi, I'd like to change my booking for ${o.recipientName}'s ${occasionLabel(o)} (${bookedHamper(o).name}, ${formatTime(o.deliveryTime)}).`,
  );
}
