# SocietyFix Secretary Dashboard

## Goal
Add a production-style secretary workspace at `/dashboard` while keeping the existing landing page unchanged. The dashboard will use the same warm neutral palette, green accent, DM Sans body type, and Newsreader display type.

## Build
- Create a responsive dashboard shell with a fixed desktop sidebar, mobile menu drawer, society header, secretary identity, and live formatted date.
- Add working navigation states for Overview and All Issues, with calm placeholder views for Residents and Settings.
- Structure 18 realistic mock issues in a separate data module, including descriptions, reporters, locations, votes, dates, notes, and status histories.
- Build summary metrics and a minimal category bar breakdown derived from the current issue data.
- Build a dense desktop issue table and a mobile stacked issue list from the same data source.
- Add search, status/category filters, sortable upvote/date columns, and a prominent most-upvoted control.
- Add skeleton loading placeholders and a clear no-results state.
- Add an issue detail experience: right-side drawer on desktop and full-screen sheet on mobile, with full details, timeline, notes, editable status, and note composer.
- Keep all updates in local React state. Saving an update will revise the issue, append timeline/note data where needed, and show an in-page success confirmation.
- Add restrained transitions for menu/drawer movement, row reordering, hover, and status changes, with reduced-motion support.

## Technical details
- Add a `/dashboard` route with unique page metadata.
- Split reusable dashboard UI and mock records into focused files so a future API layer can replace the mock state without rewriting the views.
- Extend existing semantic theme tokens for dashboard status colors and surfaces; no hardcoded component colors, icons, gradients, or glass effects.
- Use native accessible controls and dialog semantics, including focus handling, Escape-to-close, and body scroll locking for open overlays.

## Validation
- Verify the landing page remains intact.
- Check dashboard behavior at desktop and mobile widths, including menu opening, filtering, sorting, empty results, issue selection, status changes, note saving, and overlay closing.
- Confirm no overlaps or horizontal scrolling and review browser console output.
