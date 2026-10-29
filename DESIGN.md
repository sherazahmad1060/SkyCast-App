---
name: Atmospheric Glass
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bdc8d1'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#87929a'
  outline-variant: '#3e484f'
  surface-tint: '#7bd0ff'
  primary: '#8ed5ff'
  on-primary: '#00354a'
  primary-container: '#38bdf8'
  on-primary-container: '#004965'
  inverse-primary: '#00668a'
  secondary: '#bdc2ff'
  on-secondary: '#131e8c'
  secondary-container: '#2f3aa3'
  on-secondary-container: '#a8afff'
  tertiary: '#ffc174'
  on-tertiary: '#472a00'
  tertiary-container: '#f59e0b'
  on-tertiary-container: '#613b00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c4e7ff'
  primary-fixed-dim: '#7bd0ff'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#004c69'
  secondary-fixed: '#e0e0ff'
  secondary-fixed-dim: '#bdc2ff'
  on-secondary-fixed: '#000767'
  on-secondary-fixed-variant: '#2f3aa3'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-hero:
    fontFamily: Outfit
    fontSize: 88px
    fontWeight: '300'
    lineHeight: 92px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Outfit
    fontSize: 56px
    fontWeight: '300'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Outfit
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  stat-value:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  label-uppercase:
    fontFamily: Outfit
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-badge:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.25rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 2rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies an evocative, cinematic weather observatory. It captures atmospheric moods dynamically—ranging from brilliant azure daylight to moody storm violets and crystalline midnight indigos. The visual language merges high-end Glassmorphism with deep, ambient lighting and razor-sharp typographic clarity.

The target audience encompasses everyday explorers, travel planners, outdoor athletes, and design purists who demand immediate meteorological precision wrapped in an immersive, tactile aesthetic. Surfaces feel tangible yet ethereal: ultra-thin specular borders, rich multi-layered frosted glass backdrops, dynamic radial illumination nodes, and luminous weather condition indicators that immediately communicate shifts in climate.

## Colors

The core palette is anchored in a dark-mode first, atmospheric foundation where backdrops shift fluidly according to the current weather condition:
- **Primary (`#38BDF8` - Azure Sky):** Used for focal telemetry highlights, primary active states, precipitation volume meters, and key temporal readouts.
- **Secondary (`#818CF8` - Twilight Indigo):** Drives secondary interactions, graph gradients, nocturnal iconography, and atmospheric depth accents.
- **Tertiary (`#F59E0B` - Solar Amber):** Deployed selectively for solar metrics (UV index, golden hour curves, intense heat warnings).
- **Neutral (`#0F172A` - Midnight Slate):** Serves as the deep base canvas beneath translucent panels, tinted across slate, violet, and deep navy tones depending on active weather profiles.

### Atmospheric Gradients & Condition Modifiers
- **Clear Daylight:** Linear blend from `#0284C7` (Sky 600) into `#0369A1` (Sky 700) with soft amber ambient glows.
- **Clear Night:** Radial shift from `#1E1B4B` (Indigo 950) to `#0F172A` (Slate 900) with crisp cyan starlight accents.
- **Storm & Lightning:** Moody gradient from `#31104B` (Deep Violet) to `#0F172A` accented by vibrant electric-violet flashes (`#C084FC`).
- **Rain & Mist:** Calibrated slate-blue gradient from `#1E293B` to `#0F172A` paired with pale cyan mist accents (`#7DD3FC`).

## Typography

The type scale balances the geometric, modern character of Outfit for numerical data and headlines with the rigorous legibility of Inter for continuous data points and telemetry readouts.

Hero temperatures utilize an ultra-light weight (`300`) with tight negative tracking to deliver an editorial feel without visual bulk. Data card values rely on Outfit Semibold (`600`) for instant scannability against blurry surfaces. Overline captions and stat labels are set in uppercase Outfit with wide letter spacing (`0.08em`), evoking precision cockpit instrumentation.

## Layout & Spacing

The design system operates on an 8pt base grid rhythm with a responsive 12-column fluid grid on desktop, 8 columns on tablet, and 4 columns on mobile. 

- **Desktop (1024px+):** Fluid two-column split layout. The left column (4–5 cols) hosts the hero location, current temperature, atmospheric status, and interactive search. The right column (7–8 cols) houses the interactive 24-hour temperature chart, 8-stat grid (2 rows of 4), and the 7-day outlook.
- **Tablet (768px - 1023px):** Stacks the hero banner above the interactive timeline, rendering the 8-stat telemetry module as a 4x2 grid with `gutter-md` separation.
- **Mobile (< 768px):** Single vertical stack with sticky top conditions, horizontal scroll carousel for the 24-hour hourly outlook, a 2-column compact grid for the 8 telemetry tiles, and a unified vertical stack for the 7-day forecast. Canvas margins pull in tightly to `margin` (16px) to maximize screen real estate.

## Elevation & Depth

Visual hierarchy does not rely on opaque cast shadows; instead, it utilizes physical glass refraction, luminescence, and backdrop blur tiers:

- **Tier 1 (Base Panels / Card Deck):** Background fill of `rgba(255, 255, 255, 0.04)` to `rgba(255, 255, 255, 0.07)`, paired with a `backdrop-filter: blur(16px)` and an ultra-thin specular top stroke: `1px solid rgba(255, 255, 255, 0.12)`.
- **Tier 2 (Elevated & Active Items - Current Hour Card / Modals):** Background fill of `rgba(255, 255, 255, 0.12)`, `backdrop-filter: blur(24px)`, with a diffused ambient glow matching the ambient weather tone (e.g., `0 8px 32px -4px rgba(56, 189, 248, 0.25)`).
- **Tier 3 (Floating Controls & Popovers):** Background fill of `rgba(15, 23, 42, 0.75)`, `backdrop-filter: blur(32px)`, bordered with `1px solid rgba(255, 255, 255, 0.18)` and an ambient drop shadow: `0 20px 40px -10px rgba(0, 0, 0, 0.5)`.
- **Specular Highlighting:** Panels feature a pseudo-element subtle linear top gradient border (`rgba(255, 255, 255, 0.25)` fading to transparent at the bottom) to simulate a physical edge catch-light.

## Shapes

The interface embraces calibrated rounded forms (`roundedness: 2` / base 8px, default cards 16px, structural outer containers 24px) that feel organic, sleek, and comfortable. 

Pill forms (`rounded-full`) are reserved strictly for high-visibility weather accent badges, segmented control sliders, search inputs, and current-condition tags. Internal graph cursor pins and small telemetry glyph backgrounds adopt uniform `rounded-lg` (12px) geometry for clean symmetry.

## Components

### Glass Weather Cards (Stat Grid & Containers)
- Base style: 16px roundedness (`rounded-lg`), `backdrop-filter: blur(16px)`, `rgba(255, 255, 255, 0.05)` fill, and a `1px` crisp border in `rgba(255, 255, 255, 0.1)`.
- 8-Stat Grid Tiles: Display UV index, wind velocity & direction compass, humidity, visibility, pressure, air quality index, dew point, and sunrise/sunset times. Each tile contains an uppercase overline label, primary metric in `stat-value` styling, and a dynamic contextual mini-indicator (e.g., a mini circular arc for UV, animated compass arrow for wind).

### Hourly Forecast Strip & Cards
- Horizontal scroll container with scroll-snap alignment.
- Each pill/card displays the time, animated atmospheric mini-icon, rain probability pill (if >0%), and temperature.
- Active (current hour) state features an azure glow ring, `rgba(56, 189, 248, 0.15)` internal fill, and high-contrast white text.

### Interactive Area Temperature Chart
- Crisp spline line with a 2px stroke in `#38BDF8`.
- Beneath the curve, a vertical gradient transitioning from `rgba(56, 189, 248, 0.35)` to `rgba(56, 189, 248, 0.0)`.
- Interactive tooltip: Floating glass pill (`backdrop-filter: blur(20px)`) displaying timestamp, exact degree, and precipitation probability pinned along a luminous vertical hairline cursor.

### 7-Day Outlook List
- Row-based layout separated by translucent hairline dividers (`rgba(255, 255, 255, 0.06)`).
- Structure: Day name (left-aligned, 3-letter abbreviation or full name), condition icon + label, horizontal min/max temperature gradient bar showing the day's span relative to the weekly extremes, and numeric Min / Max readouts (right-aligned).

### Badges & Condition Chips
- Pill-shaped chips with subtle tint fills corresponding to warning levels:
  - *Normal/Favorable:* Pale cyan fill `rgba(56, 189, 248, 0.15)` with `#38BDF8` text.
  - *UV Warning/High Heat:* Amber fill `rgba(245, 158, 11, 0.15)` with `#F59E0B` text.
  - *Severe Storm/Frost:* Violet fill `rgba(192, 132, 252, 0.15)` with `#C084FC` text.

### Form Inputs & Search Bar
- Omnibox location search field featuring `rounded-full` curvature, inset search icon, frosted glass backdrop (`rgba(255, 255, 255, 0.08)`), and an animated glow focus ring in `#38BDF8` with zero-offset border transition.