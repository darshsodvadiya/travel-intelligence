# Design Brief

## Direction

Travel Intelligence — a premium global travel-tech platform turning crowded hotspots into smarter, data-driven destinations.

## Tone

Refined, minimal, and precise — a cool ocean-blue intelligence accent on airy off-white, engineered to feel like a serious travel-tech product, not a warm travel blog.

## Differentiation

The "intelligence data" motif — JetBrains Mono readouts (Travel Intelligence Score, crowd levels, weather metrics) woven into editorial destination cards give the brand a precise, analytical signature.

## Color Palette

| Token      | OKLCH            | Role                              |
| ---------- | ---------------- | --------------------------------- |
| background | 0.98 0.008 230   | cool off-white canvas             |
| foreground | 0.18 0.015 230   | primary ink                        |
| card       | 1.0 0.004 230    | elevated surfaces                  |
| primary    | 0.42 0.14 240    | deep ocean-blue accent / CTAs      |
| accent     | 0.6 0.15 170     | cool teal secondary highlight      |
| muted      | 0.94 0.01 230    | subtle section / footer surfaces   |
| success    | 0.6 0.16 150     | low-crowd / good-weather signals   |
| warning    | 0.72 0.15 85     | medium-crowd / caution signals     |

## Typography

- Display: Space Grotesk — headlines, hero, destination names
- Body: DM Sans — paragraphs, UI labels, navigation
- Mono: JetBrains Mono — scores, crowd levels, weather data readouts
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base text-lg`

## Elevation & Depth

Layered card surfaces on a flat background with a two-tier shadow system (subtle for resting cards, elevated on hover) and a subtle blue-tinted gradient for primary buttons and text accents.

## Structural Zones

| Zone    | Background  | Border   | Notes                              |
| ------- | ----------- | -------- | ---------------------------------- |
| Header  | bg-card/80  | border-b | glassmorphic, sticky, blurred      |
| Content | bg-background | —      | alternate bg-muted/30 per section  |
| Footer  | bg-muted/40 | border-t | muted, quiet, informative          |

## Spacing & Rhythm

Spacious section gaps (py-20 md:py-28), generous card padding (p-6 p-8), tight micro-spacing for data readouts, and a consistent 8px base grid.

## Component Patterns

- Buttons: primary gradient (`bg-gradient-primary`) rounded-xl, hover lift + shadow-elevated; secondary outline for secondary actions
- Cards: rounded-xl, bg-card, border-border, shadow-subtle, hover shadow-elevated + image scale
- Badges: rounded-full pills with mono labels; green/amber/red for crowd levels

## Motion

- Entrance: fade-up staggered on hero and sections (0.6s cubic-bezier)
- Hover: card lift + image zoom (0.3s), button shadow transition
- Decorative: subtle float on hero imagery and map markers

## Constraints

- Light-first design; dark mode tuned with intentional cool undertones
- Use semantic tokens only — no raw hex/rgb in components
- Clearly label mock/demo data (weather, AI planner, crowd map) until live APIs connect
- High-quality destination imagery is the hero — keep UI chrome minimal around it

## Signature Detail

Mono-font "intelligence" data readouts on every destination card — the Travel Intelligence Score gauge and crowd-level pills that make the product feel analytical and precise rather than blog-like.
