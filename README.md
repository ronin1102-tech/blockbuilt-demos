# Blockbuilt demos

One site holding the trade mocks as pages. Each mock is a fictional Cleveland
business, built as if it were that shop's real website, and the whole thing is
one deploy and one link you can text a prospect.

Plain HTML, CSS and one small script per mock. No build step, no framework, no
dependencies, no backend. Same approach as the main Blockbuilt site.

## What's here

```
index.html                       the Demos index — one card per mock
css/demos.css                    container styles (Blockbuilt's own design language)
demos/barbershop/index.html      mock 1: barbershop, styled as the shop's own site
demos/barbershop/style.css       green, brass, cream — condensed caps
demos/barbershop/book.js         booking flow, client-side only
demos/salon/index.html           mock 2: salon, styled as the salon's own site
demos/salon/style.css            ivory, charcoal, plum — light serif, centred
demos/salon/salon.js             stylist match + booking flow
demos/contractor/index.html      mock 3: building company, styled as the builder's site
demos/contractor/style.css       concrete, iron, rust — grotesk over mono labels
demos/contractor/contractor.js   cost estimator, ZIP check, walkthrough request
fonts/                           self-hosted WOFF2, latin subset, OFL licences
img/                             photos, compressed WebP, credits in img/CREDITS.md
```

Repo root is the container, so the URLs fall out of the folders:
`/` is the index, `/demos/barbershop/`, `/demos/salon/` and
`/demos/contractor/` are the mocks. Any static host serves this without
configuration.

All three trades in the scope are built, and each has a card on the index, so a
demo link never dead-ends.

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

## The three demos, and why they look nothing alike

The range is the pitch, so each mock gets its own palette, type pairing and
layout rather than a re-skin.

- **Barbershop** — deep green, brass and cream, Bebas Neue caps, split hero,
  service menu with dotted prices. Reads as a neighbourhood shop that has been
  there twenty years.
- **Salon** — warm ivory, charcoal and one plum accent, Cormorant Garamond at
  light weights, centred editorial hero, prices with appointment lengths. Reads
  as a studio where the booking is the product.
- **Contractor** — concrete paper, iron ink and a single rust accent, Archivo
  headlines over IBM Plex Mono specification labels, a photo hero with a
  specification strip pulled up over it. Reads as a builder who keeps a job
  file, not a showroom.

Each mock also does a different useful thing, which is the honest way to show
range: the barbershop books a chair, the salon matches you to a stylist and
then books, and the contractor gives you a budget band and checks whether your
ZIP is inside the service area before it takes a request.

### What shaped the salon

A short look at what salon sites are doing in 2026: leading with a
lower-commitment first step than "book now" (matching a client to a stylist
answers the real new-client anxiety), showing price ranges and durations before
asking for a date, uniform image frames, and short reviews next to the booking
CTA. Sources: [Zarla's salon examples](https://www.zarla.com/inspiration/salon)
and [Webmoghuls' salon UX notes](https://www.webmoghuls.com/beauty-salon-web-design-ideas-2026/).

### What shaped the contractor

Two trade-specific write-ups, both about the same thing: a homeowner is
comparing two licensed shops on a phone and wants the proof before the pretty
picture.

- **Phone and estimate on the first screen, licence and insurance where a
  thumb finds them, and jobs tagged with the town and the scope** — from
  [PxlPeak's contractor teardown](https://pxlpeak.com/blog/web-design/best-contractor-website-designs-2026).
  Hence the specification strip directly under the hero, and gallery captions
  that read "Kitchen gut · Ohio City · 9 weeks".
- **A multi-step estimate form that qualifies the lead and says plainly what
  happens after it's sent** — from
  [AQ Marketing's remodeler guide](https://aqmarketing.com/best-home-renovation-design-websites/).
  Hence the three-step walkthrough request (project → address → contact), the
  ZIP check that turns away work the shop can't service, and the "Then what?"
  panel: call in one business day, free walkthrough, written proposal in 7–10
  days.

The planning bands in the estimator are demo content. They are plausible for a
1920s–1950s Cleveland house, but they are invented, not market data — swap them
for the client's own bands before this is used as a real site.

## Adding the next mock

1. Copy a demo folder to `demos/<trade>/` and change the content.
2. Give it its own `:root` palette and its own type pairing.
3. Give the page exactly one footer line:
   `Demo website built by Blockbuilt — $450 flat, done in a week.`
   No Blockbuilt navigation, no links back to the container.
4. Add a card to `index.html` with a 4:3 WebP at `img/`.
5. Keep it mobile-first and keep the first view under ~200 KB.

## Rules the mocks follow

- **The container stays off the mock pages.** A mock is the shop's site, not a
  Blockbuilt page. The footer line is the only branding.
- **Fictional businesses, real craft.** `Fulton Road Barber Co.`, `Marlowe & Ash`
  and `Voss & Sons Building Co.` are invented, as are their addresses, staff,
  reviews, hours, registration numbers and budget bands. Phone numbers use the
  `555-01XX` range reserved for fiction so nobody's real line gets called, and
  the contractor's email is on the reserved `.example` domain. Every mock page is
  `noindex` so these businesses never turn up in search.
- **Nothing the demo can't do.** Booking flows are client-side: they generate
  real open slots from the shop's hours (the salon's also respects how long the
  service takes), grey out times that look taken, and end on a confirmation that
  says plainly it's a demo and nothing was booked. The contractor's estimator
  does arithmetic, not market research, and its request form checks the ZIP
  against a real list and ends by saying nothing was sent. No fake software
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
same crops (hero 4:5, contractor hero 16:9, galleries 4:5 and 1:1, cards 4:3).
