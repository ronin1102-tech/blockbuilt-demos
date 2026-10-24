# Blockbuilt demos

One site holding the trade mocks as pages. Each mock is a fictional Cleveland
business, built as if it were that shop's real website, and the whole thing is
one deploy and one link you can text a prospect.

Plain HTML, CSS and one small script. No build step, no framework, no
dependencies, no backend. Same approach as the main Blockbuilt site.

## What's here

```
index.html                     the Demos index — one card per mock
css/demos.css                  container styles (Blockbuilt's own design language)
demos/barbershop/index.html    mock 1: barbershop, styled as the shop's own site
demos/barbershop/style.css     the shop's identity — green, brass, cream
demos/barbershop/book.js       the demo booking flow, client-side only
fonts/                         self-hosted WOFF2, latin subset, OFL licences
img/                           photos, compressed WebP, credits in img/CREDITS.md
```

Repo root is the container, so the URLs fall out of the folders:
`/` is the index and `/demos/barbershop/` is the barbershop. Any static host
serves this without configuration.

Build order from the scope: barbershop, then salon, then contractor. Only
pages that exist get a card on the index, so a demo link never dead-ends.

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

## Adding the next mock

1. Copy `demos/barbershop/` to `demos/salon/` and change the content.
2. Give it its own `:root` palette and its own type pairing. The range is the
   pitch — two mocks that look like each other waste one of them.
3. Give the page exactly one footer line:
   `Demo website built by Blockbuilt — $450 flat, done in a week.`
   No Blockbuilt navigation, no links back to the container.
4. Add a card to `index.html` with a 4:3 WebP at `img/`.
5. Keep it mobile-first and keep the page under ~1 MB.

## Rules the mocks follow

- **The container stays off the mock pages.** A mock is the shop's site, not a
  Blockbuilt page. The footer line is the only branding.
- **Fictional businesses, real craft.** `Fulton Road Barber Co.` is invented.
  Address, staff, reviews and hours are invented too. The phone number uses the
  `555-01XX` range reserved for fiction so nobody's real line gets called.
  Every mock page is `noindex` so these businesses never turn up in search.
- **Nothing the demo can't do.** The booking flow is client-side: it generates
  real open slots from the shop's hours, greys out times that look taken, and
  ends on a confirmation that says plainly it's a demo and nothing was booked.
  No fake claims, no fake software account, no server.
- **No third-party requests.** Fonts and photos are served from this repo. The
  only external link is the buttons a person chooses to tap (call, directions).
  An embedded map or a stock-photo CDN would be a request on a phone,
  mid-conversation, in front of a prospect.
- **Prices match the offer.** The $450 site is five pages; the demo is one page
  condensed to make the point in thirty seconds. The footer says so.

## Photos

Placeholder stock, licensed for commercial use with no attribution required.
Details and source links in [img/CREDITS.md](img/CREDITS.md). For a real client
build these are replaced by the shop's own photos — the layout is built to take
them at the same crops (hero 4:5, gallery 4:5, card 4:3).
