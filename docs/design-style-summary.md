# AInspire App Design Style Summary

This document summarizes the current implemented design style across the web app.

## 1. Overall Visual Direction

AInspire currently presents a warm, creative, and approachable visual style:
- Warm cream canvas and soft neutral surfaces
- Coral as the primary interactive/accent color
- Rounded, card-forward UI with soft shadows
- Playful interaction language (swipe, save badges, shoot-to-eliminate effects)
- Mobile-first layouts that expand into spacious desktop grids

Design mood keywords:
- Warm
- Friendly
- Creative
- Tactile
- Dynamic

## 2. Typography

### Font Stack
- Primary UI font: Sora via Next.js font loading
- Secondary/supporting font: Inter (used in selected nav/badge contexts)
- Fallback stack: system sans fonts

### Typographic Character
- Heavy use of semi-bold and bold weights (600-800) for headings and labels
- Compact headings with tighter line-height for impact
- Small uppercase helper labels for metadata sections (for example vibe labels)
- Dense mobile typography that scales up significantly on desktop

### Approximate Type Scale in Use
- Small utility text: 10-14px
- Body/supporting copy: 14-16px
- Section titles: 20-36px depending on screen size

## 3. Color System

## 3.1 Primary Palette in Active UI
- App background cream: #FFF7ED
- Surface cream: #F1EDE5
- Primary accent coral: #FF6B6B
- Primary hover coral: #e85555
- Main text dark brown-charcoal: #2D2A26
- Disabled neutral: #D9D6D3 / #999

## 3.2 Supporting/Decorative Colors
- Header brand gradient includes coral into violet tint (rgba(155, 93, 229, 0.73))
- Profile ring uses strong violet (#7C3AED)
- Preview sample gradients add soft peach, lilac, yellow, and mint tones

## 3.3 Semantic Use Patterns
- Coral is consistently used for:
  - Primary actions
  - Selection states
  - Focused borders
  - Saved badges and progress fills
- Neutral dark is consistently used for:
  - Primary text
  - Icon strokes
  - Secondary controls
- Surfaces maintain low contrast and rely on elevation + border accents for hierarchy

## 4. Layout and Spacing

### Mobile-First Structure
- Core screens are optimized first for phone width
- Grids commonly start at 2 columns on mobile
- Desktop upgrades to 3-4 columns and larger spacing at 1024px+

### Spatial Rhythm
- Frequent spacing increments around 8, 10, 12, 16, 20, 24, 32, 40, 60
- Desktop adds more whitespace and generous breathing room
- Many containers cap around wide desktop max widths (~1400px)

### Shape Language
- Radius system emphasizes pill and rounded cards:
  - Common radii: 10, 12, 16, 20px
  - Pills and circles for chips and badges

## 5. Component Styling Patterns

### Buttons
- Clear variant model (primary, secondary, outline)
- Strong rounded corners
- Lift-on-hover and press-on-active behavior
- Disabled state visibly desaturated

### Cards and Image Tiles
- Card-first UI with rounded containers and soft elevation
- Hover transforms increase depth on desktop
- Borders and shadows jointly define interaction affordance

### Inputs and Dropdowns
- Cream controls with coral outlines
- Subtle hover darkening and clear open-state transitions
- Selected options invert to filled coral with white text

### Navigation
- Sticky top header
- Slide-in mobile sidebar with translucent backdrop
- Home/menu/profile iconography uses minimal line icon style

## 6. Motion and Interaction Language

### Micro-Interactions
- Most interactions use short, smooth easing (about 0.18-0.3s)
- Hover elevation and slight translateY for cards/buttons
- Active states reduce movement or scale slightly for tactility

### High-Engagement Motion
- Swipeable feed cards with directional overlays (SAVE/SKIP)
- Animated progress fill updates
- Shoot-to-eliminate interaction with crosshair and particle explosion

Overall motion style is expressive and playful, but still controlled and readable.

## 7. Responsive Behavior

- Breakpoint strategy strongly centers around 1024px
- Mobile behavior:
  - Tighter typography
  - Compact paddings
  - 2-column grids
- Desktop behavior:
  - Larger type hierarchy
  - Expanded spacing and paddings
  - Wider and denser content grids
  - Enhanced hover transformations

## 8. Design Token Alignment (Current State)

The repo includes a design token file under packages/ui, but active web UI styles are mostly hard-coded in CSS modules and globals.

Observed mismatch examples:
- Token background cream (#F5F3F0) vs active app background (#FFF7ED)
- Token primary coral (#FF7F7F) vs dominant interactive coral (#FF6B6B)
- Token typography default stack uses system sans, while app runtime prefers Sora/Inter

This means your visual style is coherent in the app itself, but token source-of-truth is partially out of sync.

## 9. Brand/Experience Impression

The implemented style communicates:
- Creative confidence (bold accents, playful interactions)
- Accessibility through familiarity (clear contrast and obvious button states)
- Warmth and approachability (cream + coral palette)
- Product energy suited to visual preference learning and design discovery

## 10. Practical Recommendations

1. Consolidate the active palette into shared CSS variables or synchronized tokens.
2. Align packages/ui design tokens with live app values to avoid drift.
3. Keep Sora for display/headline personality and Inter/system for dense utility text if desired.
4. Document interaction standards (hover lift, active press, selection fill) as reusable rules.
5. Add a compact style glossary (color names, spacing scale, motion durations) for design and dev handoff.

---

If useful, this can be extended into a full design system spec with:
- token names and aliases
- component states and anatomy
- accessibility contrast checks
- do/don't examples per component class
