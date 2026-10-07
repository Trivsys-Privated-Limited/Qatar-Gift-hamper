# Image brief: Qatar Surprise Hamper

The site already looks for these files. Until a file exists, the page shows the
branded placeholder (hamper cards) or the gift-box illustration (hero), so
nothing breaks. Drop a file in with the exact name below and it appears on the
next page load. No code change is needed.

Paths and alt text live in `src/config/business.ts`.

| File (in `public/`) | Used on | Size / ratio |
| --- | --- | --- |
| `images/hero/hero-luxury-hamper.webp` | Homepage hero (beside the headline on desktop, below the buttons on phones) | 1200 × 800, landscape |
| `images/hampers/birthday/birthday-hamper.webp` | "Birthday Hamper" card, reminder preview | 1200 × 900, 4:3 |
| `images/hampers/anniversary/anniversary-hamper.webp` | "Anniversary Hamper" card, reminder preview | 1200 × 900, 4:3 |
| `images/hampers/baby-arrival/baby-arrival-hamper.webp` | "Baby Arrival Hamper" card, reminder preview | 1200 × 900, 4:3 |
| `images/hampers/get-well-soon/get-well-soon-hamper.webp` | "Get Well Soon Hamper" card, reminder preview | 1200 × 900, 4:3 |
| `images/hampers/thank-you/thank-you-hamper.webp` | "Thank You Hamper" card, reminder preview | 1200 × 900, 4:3 |
| `images/hampers/romantic/romantic-hamper.webp` | "Romantic Hamper" card, reminder preview | 1200 × 900, 4:3 |

Cards crop with `object-fit: cover`, and the reminder preview crops the same
photo to 16:9, so keep the hamper centred with some space around it.

## Export settings

- WebP, quality about 80. Aim for under 200 KB per hamper photo and under 250 KB for the hero.
- sRGB, no watermark, no text, no logos.

## Shared style (add to every prompt)

> Professional commercial product photography for a premium Doha gift-hamper
> brand. Warm, soft natural window light from the left, gentle shadows. Palette
> of cream, ivory, deep burgundy, champagne gold and warm neutrals. Plain cream
> linen or warm off-white plaster background, uncluttered. Shot on a full-frame
> camera, 50mm lens, shallow depth of field, crisp focus on the hamper. Elegant,
> calm, luxurious. No people, no hands, no text, no logos, no watermark, no
> brand names on packaging, no oversaturated colours.

## Prompts

**Hero (`hero-luxury-hamper`, 3:2 landscape)**
A deep burgundy rigid luxury gift box with its lid resting beside it, tied with a
wide champagne-gold satin ribbon and bow. Inside and around it: a small posy of
ivory and blush roses, a few gold-wrapped chocolates, and Medjool dates in a small
brass dish. Subtle Arabic-inspired detail: a brass dallah coffee pot softly out of
focus in the background. The arrangement sits in the lower two-thirds and is
centred, with generous empty cream space above and around it.

**Birthday (`birthday-hamper`, 4:3)**
A cream gift box with a gold bow, holding fine chocolates and a small round
cake-for-two with simple cream frosting. Two or three champagne and burgundy
balloons rise softly behind it, partly cropped. A few loose ivory petals on the
surface. Festive but refined.

**Anniversary (`anniversary-hamper`, 4:3)**
A burgundy gift box with a champagne ribbon, filled with fresh deep-red and
blush roses and a row of fine chocolates. A blank folded cream card with a gold
edge leans against the box. Romantic, elegant.

**Baby Arrival (`baby-arrival-hamper`, 4:3)**
A woven cream basket lined with an ivory knitted baby blanket, holding soft
neutral baby essentials (folded muslin, a small plush toy, wooden rattle) and a
few wrapped sweets for the parents, tied with a pale champagne ribbon. Soft,
gentle and warm. Keep to cream, ivory and soft gold; no bright pastels.

**Get Well Soon (`get-well-soon-hamper`, 4:3)**
A cream gift box holding fresh fruit (green grapes, pears, oranges), a glass jar
of golden honey with a wooden dipper, and loose-leaf herbal tea in small tins
without labels. A sprig of white flowers. Fresh, comforting, bright but warm.

**Thank You (`thank-you-hamper`, 4:3)**
A burgundy and gold tray-style hamper with a brass dallah Arabic coffee pot,
small finjan cups, premium Medjool dates in a brass bowl, and a few pieces of
Arabic sweets. A champagne ribbon across the corner. Generous and hospitable.

**Romantic (`romantic-hamper`, 4:3)**
A deep burgundy round hat box overflowing with red roses, next to two lit
cream pillar candles and an open box of luxury chocolates. Gold ribbon. Warm
candle glow mixed with soft daylight. Intimate and luxurious.

## Notes

- Generate all seven in one session with the same model and shared style so they
  look like one photo shoot.
- Reject any image with warped boxes, melted ribbons, odd hands, or extra text.
- The brief that came with this task also listed Mother, Congratulations and
  General Surprise hampers. Those are not on the site yet. If they are added to
  `hampers` in `src/config/business.ts`, give them a folder and photo the same way.
