# Google Stitch Design System Specification: Budget Range Input
**User Story #1**: Allow users to enter a budget range for a trip

---

## 1. Design System Tokens

### A. Semantic Color Palette
- `--surface-primary`: `#FFFFFF` (Dark: `#1E293B`)
- `--surface-card`: `#F8FAFC` (Dark: `#0F172A`)
- `--surface-border`: `#E2E8F0` (Dark: `#334155`)
- `--text-primary`: `#0F172A` (Dark: `#F8FAFC`)
- `--text-secondary`: `#64748B` (Dark: `#94A3B8`)
- `--primary-accent`: `#2563EB` (Focus/Active: `#1D4ED8`)
- `--success`: `#10B981`
- `--error`: `#EF4444`
- `--error-surface`: `#FEF2F2` (Dark: `#450A0A`)

### B. Typography
- **Heading (Section Label)**: `Inter`, 14px (0.875rem), Weight: `600`, Line-height: `1.25`
- **Body & Inputs**: `Inter`, 16px (1.0rem), Weight: `400` / `500` (prevents iOS auto-zoom on mobile inputs)
- **Helper & Error Caption**: `Inter`, 12px (0.75rem), Line-height: `1.4`

### C. 8-Point Spatial Grid
- Field padding: `12px` vertical, `16px` horizontal
- Gap between Min and Max inputs: `16px`
- Component margin bottom: `24px`
- Border Radius: `8px` (`rounded-lg`)

---

## 2. Component Anatomy & Layout

```text
┌────────────────────────────────────────────────────────────────────────┐
│  Budget Mode Selection:  [🔘 Custom Budget Range ($)]  [⚪ Preset Tiers]│
├────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────┐    ┌───────────────────────────┐        │
│  │ Minimum Budget ($)        │    │ Maximum Budget ($)        │        │
│  │ [$] 1,500                 │    │ [$] 4,000                 │        │
│  └───────────────────────────┘    └───────────────────────────┘        │
│  ℹ️ Leave either blank for open lower or upper bounds (e.g. up to $4k)  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. The 8 Component States

1. **Default**: Border `#E2E8F0`, clean numeric input with leading `$` icon.
2. **Hover**: Border `#CBD5E1`, smooth 150ms transition.
3. **Active/Focus**: High-contrast 2px focus ring `#2563EB` with 2px offset (`focus-visible:ring-2`).
4. **Loading Skeleton**: Shimmer block with matching height `56px` to prevent layout shift.
5. **Filled / Valid**: Clean formatted number display with live badge showing range span (e.g., `$1,500 – $4,000`).
6. **Disabled**: Opacity 50%, cursor not allowed, helper text explaining disabled reason.
7. **Empty**: Clear placeholders `e.g. 1000` (Min) and `e.g. 5000` (Max).
8. **Error (Min > Max)**: High-contrast red border `#EF4444`, red alert text with clear remediation message: *"Minimum budget cannot exceed maximum budget"*.
