# Blockbuilt demos

One site holding the trade mocks as pages. Each mock is a fictional Cleveland
business, built as if it were that shop's real website, and the whole thing is
one deploy and one link you can text a prospect.

Plain HTML, CSS and one small script per mock. No build step, no framework, no
dependencies, no backend. Same approach as the main Blockbuilt site.

## What's here

```
index.html                     the Demos index — one card per mock
css/demos.css                  container styles (Blockbuilt's own design language)
demos/barbershop/index.html    mock 1: barbershop, styled as the shop's own site
demos/barbershop/style.css     green, brass, cream — condensed caps
demos/barbershop/book.js       booking flow, client-side only
demos/salon/index.html         mock 2: salon, styled as the salon's own site
demos/salon/style.css          ivory, charcoal, plum — light serif, centred
demos/salon/salon.js           stylist match + booking flow
fonts/                         self-hosted WOFF2, latin subset, OFL licences
img/                           photos, compressed WebP, credits in img/CREDITS.md
```

Repo root is the container, so the URLs fall out of the folders:
`/` is the index, `/demos/barbershop/` and `/demos/salon/` are the mocks. Any
static host serves this without configuration.

Build order from the scope: barbershop, salon, contractor. Only pages that
exist get a card on the index, so a demo link never dead-ends.

## Running it

There is nothing to install:

```bash
python3 -m http.server 3000
# http://localhost:3000
```

## Deploying

Upload the folder to any static host (Cloudflare Pages, Netlify, S3 — anything).
Paths inside each mock are relative (`../../img/...`), so the whole tree also
works in a subfolder.

## The two demos, and why they look nothing alike

The range is the pitch, so each mock gets its own palette, type pairing and
layout rather than a re-skin.

- **Barbershop** — deep green, brass and cream, Bebas Neue caps, split hero,
  service menu with dotted prices. Reads as a neighbourhood shop that has been
  there twenty years.
- **Salon** — warm ivory, charcoal and one plum accent, Cormorant Garamond at
  light weights, centred editorial hero, prices with appointment lengths. Reads
  as a studio where the booking is the product.

The salon's stylist-match came out of a short look at what salon sites are doing
in 2026: leading with a lower-commitment first step than "book now" (matching a
client to a stylist answers the real new-client anxiety), showing price ranges
and durations before asking for a date, uniform image frames, and short reviews
next to the booking CTA. Sources: [Zarla's salon examples](https://www.zarla.com/inspiration/salon)
and [Webmoghuls' salon UX notes](https://www.webmoghuls.com/beauty-salon-web-design-ideas-2026/).

## Adding the next mock

1. Copy a demo folder to `demos/contractor/` and change the content.
2. Give it its own `:root` palette and its own type pairing.
3. Give the page exactly one footer line:
   `Demo website built by Blockbuilt — $450 flat, done in a week.`
   No Blockbuilt navigation, no links back to the container.
4. Add a card to `index.html` with a 4:3 WebP at `img/`.
5. Keep it mobile-first and keep the first view under ~200 KB.

## Rules the mocks follow

- **The container stays off the mock pages.** A mock is the shop's site, not a
  Blockbuilt page. The footer line is the only branding.
- **Fictional businesses, real craft.** `Fulton Road Barber Co.` and
  `Marlowe & Ash` are invented, as are their addresses, staff, reviews and
  hours. Phone numbers use the `555-01XX` range reserved for fiction so nobody's
  real line gets called. Every mock page is `noindex` so these businesses never
  turn up in search.
- **Nothing the demo can't do.** Booking flows are client-side: they generate
  real open slots from the shop's hours (the salon's also respects how long the
  service takes), grey out times that look taken, and end on a confirmation
  that says plainly it's a demo and nothing was booked. No fake software
  account, no server.
- **No third-party requests.** Fonts and photos are served from this repo. The
  only external links are the buttons a person chooses to tap (call,
  directions). An embedded map or a stock-photo CDN would be a request on a
  phone, mid-conversation, in front of a prospect.
- **Prices match the offer.** The $450 site is five pages; each demo is one page
  condensed to make the point in thirty seconds. The footer says so.

## Photos

Placeholder stock, licensed for commercial use with no attribution required.
Details and source links in [img/CREDITS.md](img/CREDITS.md). For a real client
build these are replaced by the shop's own photos — the layouts take them at the
same crops (hero 4:5, gallery 4:5, card 4:3).
