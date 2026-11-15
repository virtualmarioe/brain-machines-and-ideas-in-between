# World map navigation refinement

The existing map already preserved geographic coordinates, clustered crowded cities, exposed research-site details, and linked discoveries to the reading panel. Its main navigation gaps were the long city selector, zoom behavior anchored to the selected discovery rather than the current viewport, and the lack of explicit keyboard panning and cluster expansion.

## Changes

- Search city and institution names with case-insensitive, accent-insensitive matching. Results show discovery counts and center the chosen city at 3× zoom without changing the selected historical discovery.
- Keep the geographic point at the viewport center fixed when using zoom controls. Disable controls at the 1× and 12× limits and show the current magnification.
- Locate the selected discovery with one action; disable that action when coordinates are unavailable.
- Expand a multi-city cluster explicitly, centering it and doubling zoom within the existing limit.
- Focus the map to pan with arrow keys, zoom with +/−, and reset with Home. Marker keyboard interactions retain their existing behavior.
- Provide localized labels and guidance in English, German, and Spanish, plus a clear search empty state.

Existing evidence, geographic caveats, connection animation, scientific colors, and city/discovery modes remain intact. No new dependencies or scientific relationships were added. Searching locations does not filter out discoveries or invent geographic coordinates.

## Validation

Content validation, 140 unit tests, TypeScript, lint, and the production build passed. Browser coverage includes desktop and phone search, keyboard panning, reset, locating a discovery, numerical verification of viewport-center preservation, cluster expansion, synchronized selection, label collision checks, and accessibility scans. The new mobile test waits for the compact layout to hydrate before opening the map, matching the existing map tests. Desktop and phone screenshots were visually inspected.

The local production preview was rebuilt and restarted on port 3001. No commit or push was performed for this refinement.

## Visual and direct-interaction refinement

The next refinement groups display controls into one compact toolbar, adds a pale ocean surface with projected latitude/longitude lines and defined coastlines, and uses an explicit halo for the chosen city. Location details use a bounded reading surface. A city-mode key explains discovery counts and chosen-location rings.

Regional shortcuts provide reproducible views of the world, Europe, the Americas, and East Asia. Double-clicking the map centers and doubles magnification at the chosen point. Buttons and keyboard zoom remain available as alternatives. Regional labels and gesture guidance are translated into all three interface languages.

Validation: 140 unit tests, content validation, TypeScript, lint, and production build passed. Twenty desktop/phone map browser tests passed, including animation, label collisions, region shortcuts, direct zoom, cluster selection, search, and accessibility scans. Desktop and phone screenshots were inspected. No geographic source or scientific content was changed.
