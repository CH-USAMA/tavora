# UI & UX Rules (Tavora)

## Core Philosophy
- **Less but Better:** Every pixel must have a purpose.
- **Whitespace is a Feature:** Do not cram content. Let products breathe.
- **Products are the Hero:** The UI should disappear so the watches become the focus.
- **No Generic Feel:** Must feel like a premium DTC brand (Rolex, Apple, Aesop), NOT a basic Shopify store.

## Component Rules
- **Buttons:** Sharp or slightly rounded corners (`rounded-md` max). Never pill-shaped. Hover states should be subtle color shifts, not massive scale jumps.
- **Images:** High quality only. Must support lazy loading (`loading="lazy"` or `next/image`). Use cinematic aspect ratios where appropriate.
- **Navigation:** Clean, unobtrusive. Sticky header that transitions from transparent (over hero image) to solid.
- **Forms:** Minimalist inputs. Floating labels or clean underline styling preferred over bulky bordered boxes.

## Performance Requirements
- Lighthouse Accessibility > 95
- Lighthouse Performance > 95
- Core Web Vitals strictly green.
