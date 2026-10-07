/**
 * All business settings live here. Change these values to update the whole site.
 */

/** Occasion filters above the hamper grid. `label` is the chip text, `tag` the small label on each card. */
export const HAMPER_CATEGORIES = [
  { id: "birthday", label: "Birthday", tag: "Birthday" },
  { id: "anniversary", label: "Anniversary", tag: "Anniversary" },
  { id: "romantic", label: "Romantic", tag: "Romance" },
  { id: "baby", label: "Baby", tag: "New arrival" },
  { id: "get-well", label: "Get Well", tag: "Get well" },
  { id: "thank-you", label: "Thank You", tag: "Thank you" },
] as const;

export type HamperCategory = (typeof HAMPER_CATEGORIES)[number]["id"];

export type Hamper = {
  /** Unique id, used in saved reminders. Don't change it once customers have saved reminders. */
  id: string;
  category: HamperCategory;
  name: string;
  description: string;
  /** Price in the business currency (whole numbers). */
  price: number;
  /** "What's included" list in the hamper details. */
  items: string[];
  /**
   * Optional photo in /public, e.g. "/images/hampers/birthday/birthday-hamper.webp" (4:3, about 1200x900).
   * Leave undefined, or leave the file missing, to show the branded placeholder with a "SAMPLE" badge.
   */
  image?: string;
  /** Describes the photo for screen readers. */
  imageAlt?: string;
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
  /**
   * The owner's logo. Put the file in /public (e.g. /public/logo.jpg) and set this to "/logo.jpg".
   * While it is null, the site shows the text wordmark.
   */
  logo: null as string | null,
  /** Homepage hero photo (landscape, about 1200x800). The gift-box illustration shows until the file exists. */
  heroImage: {
    src: "/images/hero/hero-luxury-hamper.webp",
    alt: "Burgundy gift box tied with a champagne ribbon, with roses, chocolates and dates",
  },
  /** Photo beside "Delivered across Doha". */
  deliveryImage: {
    src: "/images/hampers/thank-you/thank-you-hamper.webp",
    alt: "Gift hamper of dates, Arabic coffee and sweets in front of the Doha skyline",
  },
};

export const hampers: Hamper[] = [
  {
    id: "birthday",
    category: "birthday",
    name: "Birthday Hamper",
    description: "Balloons, chocolates and a cake-for-two, wrapped with a gold bow.",
    price: 250,
    items: ["Balloons", "Premium chocolates", "Cake for two", "Gold ribbon presentation"],
    image: "/images/hampers/birthday/birthday-hamper.webp",
    imageAlt: "Birthday surprise hamper with balloons, chocolates and a cake for two, tied with a gold bow",
    placeholder: "maroon",
  },
  {
    id: "anniversary",
    category: "anniversary",
    name: "Anniversary Hamper",
    description: "Fresh roses, fine chocolates and a keepsake card for the two of you.",
    price: 395,
    items: ["Fresh roses", "Fine chocolates", "Keepsake card", "Signature gift box"],
    image: "/images/hampers/anniversary/anniversary-hamper.webp",
    imageAlt: "Anniversary gift hamper with fresh roses, fine chocolates and a keepsake card",
    placeholder: "cream",
  },
  {
    id: "baby-arrival",
    category: "baby",
    name: "Baby Arrival Hamper",
    description: "Soft blanket, baby essentials and treats for the new parents.",
    price: 320,
    items: ["Soft baby blanket", "Baby essentials", "Treats for the new parents"],
    image: "/images/hampers/baby-arrival/baby-arrival-hamper.webp",
    imageAlt: "New baby gift hamper with a soft blanket, baby essentials and treats",
    placeholder: "cream",
  },
  {
    id: "get-well-soon",
    category: "get-well",
    name: "Get Well Soon Hamper",
    description: "Fresh fruit, herbal teas and honey to lift their spirits.",
    price: 220,
    items: ["Fresh fruit", "Herbal teas", "Honey"],
    image: "/images/hampers/get-well-soon/get-well-soon-hamper.webp",
    imageAlt: "Get well soon hamper with fresh fruit, herbal teas and honey",
    placeholder: "maroon",
  },
  {
    id: "thank-you",
    category: "thank-you",
    name: "Thank You Hamper",
    description: "Arabic coffee, premium dates and sweets to say thank you.",
    price: 180,
    items: ["Arabic coffee", "Premium dates", "Sweets"],
    image: "/images/hampers/thank-you/thank-you-hamper.webp",
    imageAlt: "Thank you hamper with Arabic coffee, premium dates and sweets",
    placeholder: "cream",
  },
  {
    id: "romantic",
    category: "romantic",
    name: "Romantic Hamper",
    description: "Red roses, scented candles and luxury chocolates for someone special.",
    price: 450,
    items: ["Red roses", "Scented candles", "Luxury chocolates"],
    image: "/images/hampers/romantic/romantic-hamper.webp",
    imageAlt: "Romantic burgundy gift hamper with red roses, candles and chocolates",
    placeholder: "maroon",
  },
];
