# Qatar Surprise Hamper (demo)

A mobile-first demo site for a surprise gift hamper business in Doha, built with Next.js (App Router), TypeScript and Tailwind CSS.
There is no backend. Sign-in and booked dates are stored in the visitor's browser (`localStorage`).

| Page | What it does |
| --- | --- |
| `/` | Hero, hamper grid with "Order on WhatsApp" buttons, how it works, intro to reminders |
| `/login` | Demo sign-in with name and WhatsApp number |
| `/never-miss-a-moment` | Signed-in customers book dates: who it's for, occasion, date, hamper, delivery time, address, card message. Edit, delete, preview the WhatsApp reminder |
| `/dashboard` | Owner view: stats, all upcoming deliveries with reminder status, "Send reminder" buttons, reset demo data |

## How booking and reminders work

1. The customer signs in with their name and WhatsApp number. In the demo, the number is the account and no code is checked.
2. They add a date and pre-book a hamper, a delivery time and an address. The date repeats every year.
3. At **11:50 AM on the occasion day**, the reminder goes out: "Hi Mariam! Today is Hessa's birthday 🎁 Your Birthday Hamper will be delivered at 4:00 PM to …"
4. The hamper is delivered at the chosen time.

In the demo, step 3 shows up as a WhatsApp-style pop-up inside the site, but only while the customer has the site open at or after 11:50 AM on the day. The **Preview reminder** button and its "jump to 11:50 AM" toggle show the message at any time.

If someone books a date for *today* after that day's delivery time has passed, the first delivery is next year.

On first load, four sample bookings from other customers are added (due tomorrow, in 3 days, in 2 weeks and in 2 months) so the dashboard has data straight away. Their phone numbers are placeholders. **Reset demo data** on the dashboard brings them back.

## Run it locally

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Change the business details

Everything lives in **`src/config/business.ts`**:

- `business.name`, `business.city`, `business.currency`
- `business.whatsappNumber`: digits only, with the country code (e.g. `97470095262`)
- `business.reminderTime`: when the reminder is sent on the occasion day (default 11:50)
- `business.deliverySlots`: the delivery times customers can choose (default 12:00 to 21:00, hourly)
- `hampers`: the hamper list. Add, remove or edit entries here. Each hamper has:
  - `id`: keep it stable once customers have saved reminders that use it
  - `name`, `description`, `price`
  - `placeholder`: `"maroon"` or `"cream"`, the colour of the sample image
  - `image`: optional photo path (see below)

## Replace the sample hamper images

1. Put the photos in `public/hampers/`, e.g. `public/hampers/birthday.jpg`. A 4:3 landscape shape works best.
2. In `src/config/business.ts`, add `image: "/hampers/birthday.jpg"` to that hamper.

When a hamper has an `image`, the photo replaces the placeholder and the "SAMPLE" badge disappears.

## Replace the logo

Save the logo as **`public/logo.jpg`** (keep that file name, or change `business.logo` in the config).
It appears in the header, the footer, the WhatsApp preview avatar, and as the browser tab icon.
If the file is missing, a text wordmark is shown instead.

The header and footer use the cream colour `#F8F3EC` so that a logo with a cream background blends in.

## Brand colours and fonts

The colours are defined as Tailwind theme colours in `src/app/globals.css` (`maroon`, `maroon-dark`, `gold`, `cream`, `ink`), so you can use classes like `bg-maroon` and `text-gold`.
The fonts are Cinzel for headings and Montserrat for body text, loaded in `src/app/layout.tsx`.

## Deploy to Vercel

**Option A, with GitHub (recommended)**

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com/new, import the repository, and click **Deploy**. No settings are needed.

**Option B, from your computer**

```bash
npm i -g vercel
vercel          # first time: log in and accept the defaults
vercel --prod   # publish to the production URL
```

## How dates work

- Occasions store only a day and a month, and repeat every year.
- If this year's date has already passed, the countdown goes to next year's date.
- 29 February is used in leap years. In other years the reminder and delivery are on 28 February.

## Going live (next steps)

The demo stores data per browser, so the owner's dashboard only sees bookings made in the same browser. A live version would need:

- real customer sign-in (e.g. a one-time code sent on WhatsApp) and a login for the owner's dashboard
- a database for bookings, shared between customers and the owner
- a scheduled job (e.g. a Vercel Cron Job) that runs at 11:50 AM Doha time and sends the reminders through the WhatsApp Business API, using a message template approved by Meta
- payment and delivery confirmation
