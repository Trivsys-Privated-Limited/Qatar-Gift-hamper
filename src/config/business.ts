/**
 * All business settings live here. Change these values to update the whole site.
 */

export type Hamper = {
  /** Unique id, used in saved reminders. Don't change it once customers have saved reminders. */
  id: string;
  name: string;
  description: string;
  /** Price in the business currency (whole numbers). */
  price: number;
  /**
   * Optional photo, e.g. "/hampers/birthday.jpg" (put the file in /public/hampers).
   * Leave undefined to show the branded placeholder with a "SAMPLE" badge.
   */
  image?: string;
  /** Placeholder background colour used while there is no photo. */
  placeholder: "maroon" | "cream";
};

export const business = {
  name: "Qatar Surprise Hamper",
  city: "Doha, Qatar",
  /** International format, digits only (no +, no spaces). */
  whatsappNumber: "97470095262",
  currency: "QAR",
  /** The WhatsApp reminder is sent at this time (24-hour clock) on the occasion day itself. */
  reminderTime: { hour: 11, minute: 50 },
  /**
   * Delivery times customers can choose, 24-hour "HH:MM". They start after the
   * reminder so the customer hears from us before the hamper arrives.
   */
  deliverySlots: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"],
  logo: "/logo.jpg",
};

export const hampers: Hamper[] = [
  {
    id: "birthday",
    name: "Birthday Hamper",
    description: "Balloons, chocolates and a cake-for-two, wrapped with a gold bow.",
    price: 250,
    placeholder: "maroon",
  },
  {
    id: "anniversary",
    name: "Anniversary Hamper",
    description: "Fresh roses, fine chocolates and a keepsake card for the two of you.",
    price: 395,
    placeholder: "cream",
  },
  {
    id: "baby-arrival",
    name: "Baby Arrival Hamper",
    description: "Soft blanket, baby essentials and treats for the new parents.",
    price: 320,
    placeholder: "cream",
  },
  {
    id: "get-well-soon",
    name: "Get Well Soon Hamper",
    description: "Fresh fruit, herbal teas and honey to lift their spirits.",
    price: 220,
    placeholder: "maroon",
  },
  {
    id: "thank-you",
    name: "Thank You Hamper",
    description: "Arabic coffee, premium dates and sweets to say thank you.",
    price: 180,
    placeholder: "cream",
  },
  {
    id: "romantic",
    name: "Romantic Hamper",
    description: "Red roses, scented candles and luxury chocolates for someone special.",
    price: 450,
    placeholder: "maroon",
  },
];
