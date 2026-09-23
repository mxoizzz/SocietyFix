# SocietyFix Resident Dashboard

## Experience
- Build a mobile-first resident app with a warm neutral canvas, deep navy accent, strong typography, restrained status colors, and generous spacing.
- Use a desktop sidebar and compact mobile bottom navigation, plus a shared top bar showing society and resident details.
- Keep the interface text-led with no icons, gradients, glass effects, or decorative clutter.

## Screens
- Society Feed at `/`: all society issues in a realistic reverse-chronological feed with search, status/category filters, newest/most-upvoted sorting, and local one-vote-per-resident behavior.
- Report an Issue at `/report`: touch-friendly form, optional local photo picker, resident flat prefill, validation, and a generated tracking confirmation with a link to My Issues.
- My Issues at `/my-issues`: resident-only issue list with a sliding desktop drawer and full-screen mobile detail view containing description, timeline, secretary notes, and upvotes.
- Profile at `/profile`: a restrained placeholder that confirms the resident details used by the experience.

## Data and Behavior
- Keep 10–15 realistic issue records in a dedicated mock-data module with clear types so API-backed data can replace it later.
- Centralize local issue creation and vote state in a shared resident data provider so changes appear consistently across screens.
- Add skeleton loading, calm empty states, smooth drawer transitions, subtle vote feedback, and gentle list reordering.

## Technical Details
- Extend the semantic Tailwind design tokens in `src/styles.css`; avoid hardcoded component colors.
- Create reusable shell, navigation, status badge, issue card, filter, and detail components.
- Add unique metadata for every content route and preserve TanStack Router conventions.
- Verify the current build signal, then test key desktop and mobile interactions in the live preview.
