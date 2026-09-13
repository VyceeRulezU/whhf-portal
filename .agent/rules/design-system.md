# Design System

This is the single source of truth for every visual decision on the WHHF
portal. If a value you need isn't defined here or in `/tokens/`, add it to
the tokens — don't invent it inline in a component.

**The palette is derived from the WHHF logo (`assets/brand/logo.jpg`), not
from a generic template.** The logo is a black background with a candle/bulb
mark rendered in warm gold and cool silver, holding a heart and an
uplifted human figure, under a hand-lettered script wordmark ("William &
Helen") and a small-caps serif lockup ("HERITAGE FOUNDATION"). Everything
below reads directly off that mark. The reference layout (image supplied
separately — a light "Brightaid" NGO homepage) is a **pattern reference for
component shape and rhythm only** (pill buttons, stat-card-over-image,
badge pills, logo strip) — its color story does not apply here. WHHF is
dark-themed; Brightaid is not.

## Why dark theme

The logo only reads correctly on black — the gold and silver linework loses
all contrast on a light background, and the brand has no "light" lockup.
Rather than fight that with a white site and a boxed dark logo, the site
takes the black field as its own: near-black surfaces, warm gold as the one
accent that's allowed to be loud, and silver/warm-white for hierarchy in
between. This also happens to suit an NGO built around a memorial legacy —
gold-on-black reads as commemorative and dignified rather than corporate.

## Color

| Token | Hex | Use |
|---|---|---|
| `--color-bg-canvas` | `#0A0A0A` | Page background |
| `--color-bg-surface` | `#141414` | Cards, panels, raised surfaces |
| `--color-bg-surface-raised` | `#1D1D1D` | Modals, popovers, hover surface |
| `--color-bg-true-black` | `#000000` | Hero/brand blocks, matches logo plate exactly |
| `--color-border` | `rgba(255,255,255,0.08)` | Default hairline border |
| `--color-border-strong` | `rgba(255,255,255,0.16)` | Focus-adjacent / emphasized border |
| `--color-gold` | `#D4A64C` | Primary accent — CTAs, links, active states, icon fill |
| `--color-gold-hover` | `#E8C06A` | Hover/lighter state of gold |
| `--color-gold-muted` | `#8A6A2C` | Gold at low emphasis (borders, disabled accents) |
| `--color-silver` | `#A8ADB4` | Secondary accent, matches bulb outline in logo |
| `--color-text-primary` | `#F5F3EF` | Warm off-white, primary text on dark |
| `--color-text-secondary` | `#B8B6B2` | Secondary text, captions |
| `--color-text-muted` | `#7C7A76` | Placeholder text, disabled text |
| `--color-text-on-gold` | `#141414` | Text placed on a gold-filled surface |
| `--color-success` | `#5CA97A` | Successful donation, confirmations |
| `--color-error` | `#E2574C` | Form errors, failed transactions |
| `--color-focus-ring` | `#D4A64C` | Keyboard focus outline (always visible, never suppressed) |

Do not introduce a second accent hue (no blue links, no green "fintech"
accent beyond the semantic success color). Gold carries all emphasis.

## Typography

Two families, clearly distinct roles — never used interchangeably:

- **Display/heading — a warm editorial serif** (e.g. Fraunces, or Freight
  Display as a fallback). Used for H1–H3, pull quotes, and the "impact
  number" treatment (e.g. "₦1.5M raised for cancer care"). This is what
  carries the "heritage" feeling from the wordmark without literally trying
  to reuse the script logotype in body contexts.
- **UI/body — a clean humanist sans** (e.g. Inter, or General Sans). Used for
  body copy, forms, navigation, buttons, and all admin-dashboard UI.
- The script/calligraphy face in the logo (`William & Helen`) is **never**
  reused as a live text font anywhere else on the site — it only exists
  inside the logo lockup image/SVG. Trying to hand-letter headings in a
  matching script will read as a knockoff of the mark, not an extension of
  it.

Type scale (rem, 16px root):

| Token | Size | Line-height | Use |
|---|---|---|---|
| `--font-size-display` | 3.5rem | 1.05 | Hero H1 |
| `--font-size-h1` | 2.5rem | 1.1 | Page H1 |
| `--font-size-h2` | 1.875rem | 1.2 | Section headings |
| `--font-size-h3` | 1.375rem | 1.3 | Card/subsection headings |
| `--font-size-body-lg` | 1.125rem | 1.6 | Intro paragraphs |
| `--font-size-body` | 1rem | 1.6 | Default body |
| `--font-size-sm` | 0.875rem | 1.5 | Captions, form hints |
| `--font-size-xs` | 0.75rem | 1.4 | Legal/fine print |

Line length: cap body text at ~70ch. No uppercase eyebrow labels, no
tracked-out all-caps section tags — use the serif at a smaller size as a
label instead if a section needs one.

## Spacing & radius

8px base unit. `--space-1` through `--space-12` = 4, 8, 12, 16, 24, 32, 40,
48, 64, 80, 96, 128px (see `tokens/design-tokens.json` for the full scale).

Radius is deliberately restrained and NOT the "rounded card kit" default:
- `--radius-sm` (6px) — inputs, small tags
- `--radius-md` (12px) — cards, images
- `--radius-pill` (999px) — buttons and badges only (this is the one place
  full pill radius is used, echoing the reference layout's button shape)

## Components

### Buttons

Modeled on the reference layout's pill buttons (fully rounded, bold label,
generous horizontal padding, optional trailing circular icon chip), rebuilt
in the WHHF palette:

- **Primary** — gold fill (`--color-gold`), text `--color-text-on-gold`,
  weight 600, `padding: 14px 28px`, `border-radius: var(--radius-pill)`.
  Hover: `--color-gold-hover` + subtle lift (`transform: translateY(-1px)`).
  This is the "Donate Now" button — it should appear once per view as the
  clear primary action, never doubled up with a second gold button visible
  at the same time.
- **Secondary (outline)** — transparent fill, 1.5px border in
  `--color-border-strong`, text `--color-text-primary`. Hover: border
  becomes `--color-gold`, text becomes `--color-gold`.
  Use for "Learn More", "Our Team", secondary nav actions.
  Do not put outline and primary buttons in the same visual weight class —
  outline is always visually quieter.
- **Ghost/text link** — no fill, no border, `--color-text-secondary`,
  underline on hover, `--color-gold` on hover for text color too.
- **Icon chip** (optional, inside a button, on the trailing edge) — a small
  circle (32px) in `--color-bg-true-black` with a right-arrow glyph in gold,
  matching the reference's rounded arrow badge. Only pair this with the
  primary button, not with outline/ghost.
- All buttons: minimum 44×44px hit target, visible focus ring
  (`box-shadow: 0 0 0 3px var(--color-focus-ring)` offset from the border,
  never `outline: none` without a replacement).
- Disabled state: `opacity: 0.5`, `cursor: not-allowed`, no hover transform.

See `tokens/tokens.css` for the exact custom properties and
`.agent/skills/component-builder/skill.md` for how to scaffold the actual
`Button.tsx` + `Button.module.css` pair.

### Cards

`--color-bg-surface` fill, `--radius-md`, 1px `--color-border`. A "stat
overlay card" (donation total over a photo, as in the reference layout) uses
`--color-bg-true-black` at 70% opacity as a scrim behind white/gold text —
never place text directly on an unscrimmed photo.

### Badges / pills

Used for tags like "Transparent", "Emergency Relief" in the reference layout.
On WHHF: `--color-bg-surface-raised` fill, `--color-text-secondary` text,
`--radius-pill`, `padding: 6px 14px`, `font-size: var(--font-size-sm)`. One
badge per view may use the gold-outline variant to mark the "active" filter
or featured tag — don't gold-outline every badge or the emphasis is lost.

### Forms (donation flow especially)

Inputs: `--color-bg-surface` fill, 1px `--color-border`, `--radius-sm`,
`--color-text-primary` value text, `--color-text-muted` placeholder. Focus:
border becomes `--color-gold`, plus the standard focus ring. Error state:
border `--color-error`, helper text in `--color-error` below the field —
never color alone (also show an inline icon) to convey error state.

## Imagery

Photography of real programme activity (beneficiaries, events) should be
warm-toned and never desaturated/blue-graded — it should sit comfortably
against the black/gold field, not fight it. Avoid stock imagery that reads
as generic "charity stock photo" (overly staged smiling-child close-ups with
no context) — prefer documentary-style photos of actual WHHF activity once
available; use clearly-labeled placeholders until then.

## Accessibility floor

- Text on `--color-bg-canvas`/`--color-bg-surface` must hit WCAG AA (4.5:1
  body text, 3:1 large text). Gold-on-black and off-white-on-black both pass;
  double check any new color pairing against this before shipping it.
  `--color-gold` on `--color-bg-canvas` is for accents/links/large text, not
  small body copy at low weight — verify contrast if used for body text.
- Never convey status by color alone (see form errors above).
- Respect `prefers-reduced-motion`.
