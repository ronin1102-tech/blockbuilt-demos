# Teardown — getartcraft.com (ArtCraft)

Read 27 Oct 2026. Reference: https://getartcraft.com/ — marketing home page for a
desktop/browser AI image-and-video studio.

**Bright line for this note:** layout structure, spacing rhythm, type hierarchy,
color *roles*, component patterns and motion feel transfer. Their logo, wordmark
glyph, imagery, video, copy and blue are theirs — any build off this survives on
its own words and assets. Not a same-town competitor, so there is no palette
collision to fix, but the expression still gets rebuilt, not re-skinned.

---

## 1. Structure map, in order

| # | Section | What it does |
|---|---------|--------------|
| — | Nav, 48px, sticky | Mono labels, vertical rules between items, black "Launch App" block pinned to the right edge |
| 1 | Hero | The **wordmark is the hero image**. Small headline underneath, lede, two CTAs, three faint meta links. Exactly one viewport tall |
| 2 | Marquee | One line of model/tool names, mono, 36s loop, blue diamond separators |
| 3 | `01 / Crafting features` | H2 + lede, then an 8-card feature grid (2-up desktop), each card = rail (label + index) / 16:9 auto-playing demo / title + one paragraph |
| 4 | `02 / Ownership` | H2 + lede, then three flat cards A/B/C: open source, yours forever, no middleman |
| 5 | `03 / Proof` | H2, then three community film tiles (thumbnail only, fake-out to YouTube) |
| 6 | Start | Kicker "Free to start · No subscription", oversized H2, two CTAs |
| 7 | Footer | 5-column hairline grid: mark + blurb + email, then Product / Craft Apps / Resources / Community link columns, one sign-off line |

Everything after the hero is the same shape: sticky numbered eyebrow → heading
block → flush grid of cards. The page is four verses of one template, which is
why it reads calm rather than long.

**First screen, concretely:** 48px nav, then a centred stack — wordmark ~120px
tall, h1 at 30–36px, 18px lede capped at 448px, two 48px buttons, 11px meta row —
vertically centred in `calc(100svh - 3rem)`. No photograph, no illustration, no
product screenshot above the fold. The type is the picture. Nothing is clipped or
hidden; the whole offer is legible without scrolling.

## 2. Grid and rhythm

- Container `1280px`, centred, with **1px vertical rules down both edges** that
  run the full page height. The page reads as a sheet of paper on a table.
- Gutters: 24px mobile, 40px desktop. Section padding 56px mobile / 80px desktop
  (112px for the final CTA).
- Cards are a CSS grid with `gap: 1px` over a line-colored parent, each card
  filled with the page background. **The lines are the gaps.** No card borders,
  no shadows, no radii anywhere on the site — `rounded-none` on every button,
  card and frame.
- Sections are separated by a full-bleed hairline plus **11px crosshair
  registration ticks** at the corners where the rules meet. That single detail is
  what makes it look drafted rather than decorated.
- Interior padding inside cards: 24px mobile / 32–40px desktop. Card media is
  always 16:9 and edge-to-edge inside its card.
- Density: airy above the fold, tight inside the grids. The contrast between the
  two is the rhythm.

## 3. Type system

Four families, four jobs, no overlap:

| Role | Family | Size / treatment |
|------|--------|------------------|
| Display (headlines, wordmark) | Archivo, width axis opened to ~118%, weight ~620 | 36 → 48 → 60px (72px for the closing CTA), leading 1.02, tracking −0.035em |
| Accent word inside headlines | Instrument Serif, **italic**, weight 400 | same size as the headline |
| Body | Inter | 16–18px, leading 1.6–1.75, muted ink |
| Annotation | Geist Mono, 500 | 11px, uppercase, tracking 0.15em |

Only four size *steps* actually appear: 11 / 16–18 / 24 / 36–60 (plus the
wordmark at ~120px, which is a picture, not a text style). Headline-to-body ratio is about
2.5:1 inside sections and 6:1 for the wordmark. Weight contrast is low — the
headlines are medium, not bold; the *width* axis and tight tracking do the
shouting instead of weight.

**The signature typographic move:** every headline is a grotesk sentence with
**one italic serif word dropped into the middle** — "Capable tools *for artists.*",
"the control that mere *words* cannot buy", "Stop *renting* from websites", "Made
*with* ArtCraft", "Start *crafting*." Five headlines, five serif words, always one
per heading, never a whole line. In the hero the serif word is also knocked back
to muted ink, so the italic reads as a whisper rather than a highlight.

Mono labels are used as *spec annotations*: `01 / CRAFTING FEATURES`,
`REAL FOOTAGE — CAPTURED IN ARTCRAFT`, `FREE TO START · NO SUBSCRIPTION`. They
label the drawing, they don't sell.

## 4. Color roles

Warm paper, near-black ink, and one blue that is almost never used.

| Role | Observed | Where it is allowed |
|------|----------|---------------------|
| Page | `#f2f1ee` warm paper | Everything |
| Raised / sunken | `#faf9f7` / `#e9e8e4` | Media wells behind video, subtle fills |
| Ink | `#101014` | Headlines, body, rules at 16–40% alpha |
| Muted / faint | ink at 62% / 42% | Body copy, labels, meta |
| Lines | ink at 10% (hairline) and 40% (structural) | Every divider and rule on the page |
| Invert | ink block, paper text | **All primary actions** |
| Accent | `#2d81ff` | The marquee diamonds (18 of them) and nothing else on the home page |

The discipline worth stealing: **the accent is a detail, not a button color.**
Primary action = inverted ink block. Secondary = 1px outline that fills with ink
on hover. Every link on the page is muted ink that darkens on hover; the only
saturated pixel anywhere above the footer is the ▪ before a marquee word. That
is the entire budget.

Dark mode is a role remap, not an inversion: bg drops to `#121316`, ink goes to
warm white, the invert block flips to white-on-black, accent lightens one step.
Grid lines stay at the same relative alphas so the drafting still reads.

## 5. Components

- **Nav** — 48px tall, sticky, `bg/95` + small blur. The left cell is the mark,
  divided by a vertical rule; each nav item is a mono label padding itself into
  an inverted black chip on hover (and permanently when it is the current page).
  The right cell is a full-height black CTA. Mobile collapses to 48px-wide icon
  cells separated by the same rules.
- **Buttons** — 48px tall, 24px sides, mono 11px bold uppercase, square corners.
  Primary: ink fill, hover = 80% opacity. Secondary: 1px strong border, hover =
  fill with ink and flip the text. No transforms, no shadows. Small variant is
  12px/6px padding with the same rules.
- **Cards** — flush in a 1px-gap grid; header rail (label left, index right,
  separated by a rule) then media then text. The rail is what makes eight cards
  feel like eight entries in a spec sheet.
- **Sticky eyebrow** — 1px rule above and below, 60% background with blur, index
  and label left, one-line descriptor right, pinned at 48px so it docks directly
  under the nav for the whole section.
- **Ticks** — 11px crosshairs (two hairlines) at section-rule intersections.
- **Footer** — hairline 5-column grid (`2fr` + 4×`1fr`), mono column headings,
  16px link rows with 10px gaps, sign-off line on the right.
- **Marquee** — duplicated track, `translateX(-100%)` over 36s linear, pauses for
  nothing, no hover interaction.

## 6. Motion

All JS-driven, all short, all one-directional. Their motion script is minified,
so read the distances and durations below as observed feel rather than spec:

- **Intro:** the seven wordmark letters are opacity-0 in CSS until JS staggers
  them in — a two-second mechanical arrival, not a float. Letters carry layered
  text-shadows in the page color so they sit *in* the haze behind them rather
  than on top of it.
- **Draw-on rules:** section hairlines scale from the left on entry, and the
  corner ticks draw with them. This is the most characterful motion on the page
  and it costs almost nothing.
- **Reveal:** heading blocks and card groups fade/rise on scroll in a group
  stagger. Restrained — small travel, no spring, no parallax.
- **Hover:** color inversion only, 120–150ms linear. Nothing scales, nothing
  lifts.
- `prefers-reduced-motion` kills durations globally; the marquee is the only
  thing that would still need a manual override.
- Nothing moves on the hero once it lands. The page gets quieter as you scroll,
  not louder.

## 7. The one trick (and its cousins)

**The trick: the brand name is the hero image.** The wordmark is set at
`17.8cqw` inside a container-query container — so it always spans the column
exactly, at any width — with the A replaced by the brand glyph, the whole thing
backed by a masked blur band and a paper-colored radial glow. The headline below
is deliberately *small*. Hierarchy is inverted: name at 120px, promise at 30px.
That inversion is the entire first impression, and it works because the name is
one word and the promise is one line.

Two supporting moves worth naming separately:

1. **The drafting sheet.** Edge rules + gap-as-divider grids + registration ticks
   + numbered sticky eyebrows + mono spec labels. Engineering-drawing grammar
   applied to a marketing page. It makes flat cards feel considered.
2. **The serif word inside the sans headline.** One italic word per heading, same
   size, different voice. A whole identity delivered by one span.

## 8. What to take, what to leave

**Take:** the inverted hierarchy for a short brand name; hairline edge rules and
gap-dividers instead of card shadows; the 11px mono annotation layer; numbered
sticky section eyebrows; sharp corners; primary action as an ink block with the
accent reserved for one detail; one italic serif word per headline; draw-on rules
and ticks as the only "flash".

**Leave:** their blue, their Archivo/Instrument/Geist trio as a set (pick a
different width-axis grotesk or a different serif — same job, different voice);
their glyph-A wordmark; the eight-identical-cards grid (see below); the marquee
of model names, which means nothing without a product catalogue.

**Known weaknesses to not inherit:**
- Eight feature cards with the same shape and length is a wall. For a five-service
  trade page, three or four cards with *different* weights (one wide, one tall,
  one text-only) carries the same drafting language without the monotony.
- Feature videos ship with `preload="none"` and no poster, so every media well is
  an empty grey rectangle until it plays. A local-business version should have a
  poster frame or a still image in every slot — a blank box reads as broken on a
  phone in front of a customer.
- Three "community film" tiles that only open YouTube are the weakest proof on
  the page: no names, no outcomes, no numbers. Proof for a trade client should be
  a quote with a name and a street, a before/after, or a job spec line — not a
  thumbnail wall.
- No price anywhere on the home page. A $450 offer cannot afford that omission.

## 9. If this is adapted for a Blockbuilt trade page

The grammar survives contact with a local business better than the surface does:

- Keep the paper sheet, the 1px edges, the gap dividers, the ticks, the mono
  labels, the sharp corners, the ink-block primary, and the italic serif word.
- Use the wordmark-as-hero only where the shop name is short enough to set on one
  line at 17.8cqw. `VOSS & SONS` or `FULTON ROAD` fit; a long name does not, and
  forcing it produces the exact opposite of the intended effect — try the shop's
  street name instead.
- Swap the palette family and the type voice rather than reusing theirs: a trade
  page wants the drafting logic in its *own* materials (a barber's version might
  be chalk-white and ink with a red stamp; a builder's, concrete and iron with
  rust). That is the skill's rule: same quality bar, different expression.
- Replace the feature grid with three service blocks that carry a price band and
  a duration, and keep the sticky numbered eyebrow — it is the cheapest way to
  make a one-pager feel structured on a phone.
