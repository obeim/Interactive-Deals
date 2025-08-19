## Monday.com-style Deals Table (Static)

Interactive, accessible, and performant web UI that mimics Monday.com's Deals report using static data (no server calls). Built with Next.js, React, TypeScript, and Tailwind CSS.

### Tech Stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4 (no heavy UI kits)

### How to Run

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

### Implemented Features

- Sticky table header and horizontal scrolling for many columns.
- Rich cell interactions:
  - Click Status/Priority chip → inline dropdown selector.
  - Double-click other cells → inline editor.
- Row interactions: expandable details with recent activities.
- Sorting: single and multi-column (Shift+Click), with ↑/↓ indicators.
- Filtering: toolbar search, slide-over panel for Status/Owner/Amount range/Close Date range.
- Context menus: right-click on headers/rows with actions; accessible roles and Esc-to-close.
- Column controls: show/hide, drag-and-drop reorder (via Column Manager), resize via header handles.
- Selection: select-all, per-row selection, additive selection via Shift/Ctrl/Cmd, bulk actions toolbar.
- Inline status chips: color-coded for Stage/Status/Priority.
- Tooltips: headers, values, totals (keyboard accessible via focus/title).
- Totals bar: count, sum of Amount, average Probability.
- Keyboard navigation: arrow keys move focus, Enter to edit, Esc to cancel.
- Persistence: sort/filter/column layout saved to localStorage.

### Known Issues / Trade-offs

- Context menu is accessible with roles and Esc, but not fully roving-tabindex menu (kept lightweight).
- Column header drag-and-drop reordering not implemented (reorder via Column Manager modal instead).
- Selection supports additive toggling with Shift/Ctrl/Cmd; range selection between anchors is not implemented.
- Row actions in the context menu are placeholders (no-op for static data).

### Project Structure

- `app/page.tsx` – mounts the Deals table with static data.
- `components/DealsTable.tsx` – main table UI and interactions.
- `components/FilterPanel.tsx` – slide-over filters.
- `components/ColumnManager.tsx` – manage column visibility and order.
- `hooks/useTableState.ts` – state, filtering, multi-sort, selection, expansion, persistence.
- `lib/data.ts` – static dataset and helpers.
- `lib/types.ts` – TypeScript types.

### Notes

- Fully static; no server calls or external state.
- Designed for responsive layouts and keyboard accessibility.
