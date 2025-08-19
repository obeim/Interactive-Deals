# Delivery Notes

## Implemented Interactions

- Sticky table header and horizontal scrolling across many columns
- Inline editing:
  - Click Status/Priority chips to open a selector
  - Double-click other cells to edit inline
- Row interactions: expandable row reveals details and recent activities
- Sorting:
  - Single-column toggle (asc/desc/none)
  - Multi-column sorting with Shift+Click and indicators (↑/↓)
- Filtering:
  - Toolbar search
  - Slide-over panel for Status, Owner, Amount range, and Close Date range
- Context menus:
  - Right-click column headers/rows (Hide column, Sort asc/desc; row actions are placeholders)
  - Accessible roles and Esc to close
- Column controls: show/hide, drag-and-drop reorder (via Column Manager), column resize handles
- Selection:
  - Select-all, individual selection
  - Additive selection via Shift/Ctrl/Cmd
- Status chips: color-coded pills for statuses and priorities
- Tooltips: title-based tooltips on headers, values, and totals (keyboard-accessible via focus)
- Totals bar: count, sum of Amount, average Probability
- Keyboard navigation: arrow keys move cell focus; Enter to edit; Esc to cancel
- Persistence to localStorage: sort, filters, and column layout

## Known Issues / Trade-offs

- Column header drag-to-reorder not supported; drag-and-drop reordering is available in the Column Manager modal.
- Selection does not support range selection between anchor and current row
- Row context menu actions are placeholders (static data only)
- Context menu uses basic roles and Esc to close, not a full roving-tabindex menu
