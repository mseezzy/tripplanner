# Google Stitch Design System Spec: Out-of-Budget Alert & Near-Budget Alternatives

## 📌 Issue #3 Design Tokens & Component Hierarchy

### 1. Typography & Hierarchy
- **Alert Title**: `Outfit, sans-serif`, `font-bold` (700), `1.125rem` (`text-lg`), line-height `1.5`.
- **Badge / Chips**: `Inter, sans-serif`, `font-semibold` (600), `0.75rem` (`text-xs`), uppercase tracking `0.05em`.
- **Alternative Destination Name**: `Outfit, sans-serif`, `font-bold` (700), `1rem` (`text-base`).
- **Additional Budget Required Amount**: `Inter, sans-serif`, `font-bold` (700), `0.875rem` (`text-sm`), `text-amber-700` (dark mode: `text-amber-400`).

### 2. Semantic Color Palette (WCAG 2.1 AA Compliant, Minimum 4.5:1 Contrast)
- **Warning Alert Background**: `bg-amber-50` (dark: `bg-amber-950/40`), Border: `border-amber-300` (dark: `border-amber-700`).
- **Warning Text**: `text-amber-950` (dark: `text-amber-100`).
- **Warning Icon**: `text-amber-600` (dark: `text-amber-400`).
- **Alternative Card Surface**: `bg-white` (dark: `bg-slate-900`), Border: `border-slate-200` (dark: `border-slate-800`).
- **Budget Difference Pill**: `bg-amber-100 text-amber-900 border-amber-300` (dark: `bg-amber-900/60 text-amber-200 border-amber-600`).
- **Action Button / Upgrade Budget CTA**: `bg-amber-600 text-white hover:bg-amber-700 focus-visible:ring-amber-500`.

### 3. Spacing & Rhythm (8-Point Grid)
- Container Padding: `p-6` (24px) on desktop, `p-4` (16px) on mobile.
- Gap between alternative destination cards: `gap-4` (16px).
- Internal element margins: `mb-2` (8px), `mb-4` (16px).

### 4. Component States Covered
1. **Default State**: Amber alert banner explaining that no destinations fit within the requested budget, followed by a grid of near-budget destinations and the exact additional USD amount needed.
2. **Hover State**: Cards elevate with `shadow-md` and `scale-[1.01]`.
3. **Active / Selected State**: Clicking an alternative adjusts the filter or previews the itinerary.
4. **Focus-Visible State**: High-contrast 2px solid ring (`ring-2 ring-offset-2 ring-amber-500`).
5. **Loading Skeleton State**: Pulsing skeleton boxes matching card dimensions.
6. **Disabled State**: Opacity 50%, non-interactive cursor.
7. **Empty State**: Friendly messaging when even maximum budget expansion cannot find matches.
8. **Error State**: Red banner when API fails to calculate alternative distance/budget.
