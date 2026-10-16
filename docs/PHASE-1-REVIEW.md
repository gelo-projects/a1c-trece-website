# Phase 1 review — 15 October 2026

## Built

- New Vite + strict TypeScript project, separate from the original concept and the operations application.
- Static-first Cloudflare Pages output, no required server, paid service, database, cookie, analytics or third-party runtime request.
- Original A1C logo retrieved from the supplied Drive folder and preserved byte-for-byte.
- Crimson, royal blue, sky blue, dirty white and navy tokens; independent dark surfaces with legible logo backing.
- Locally served DM Sans typography and responsive shell.
- Native section routes with browser history and heading focus; keyboard-accessible navigation/settings dialogs.
- Persistent System/Light/Dark theme, Auto/Full/Lite visual preference, system/reduced motion, safe storage failure behavior.
- Typed branch/course configuration and future scene lifecycle boundary.
- Git main baseline, phase-1-foundation branch and phase-1-review tag pushed to the owner-created `gelo-projects/a1c-trece-website` repository; GitHub check workflow and source archive.

## Tested and passed

- `npm test`: **27 tests** (16 routing, 11 preferences).
- `npm run build`: strict TypeScript and Vite static build.
- Chromium screenshots: 1440 desktop light/dark, 390 and 320 phone widths; no horizontal overflow, no page JavaScript errors.
- Official logo loaded at its original 1600px natural width.
- Menu open, Escape, focus return, forward/reverse focus wrapping, radio keyboard operation.
- Saved appearance, Lite Mode and reduced-motion preferences survive reload.
- Operating-system reduced-motion override works; relevant CSS transitions resolve to zero duration.
- Browser Back: 18 repeated traversals across desktop normal/reduced motion and mobile normal motion, with correct scroll position and heading focus.
- Invalid saved JSON, denied localStorage, missing logo response and JavaScript-disabled content.
- No cross-origin trackers or runtime font requests.
- Future vehicle/classroom originals are stored outside public output and are not loaded by Phase 1.

## Failures fixed

- Font import referenced a nonexistent subset stylesheet; corrected to the installed local variable-font stylesheet.
- Initial test command ran before test files existed; the test suite is now present and passing.
- Browser native history restoration raced section scroll/focus; the router now uses manual restoration and a cancellable animation frame after history traversal.
- Reverse Tab from the first modal control could move focus into browser chrome; explicit wrapping now keeps both Tab directions within the open dialog.
- The earlier image attachments were no longer in temporary storage; the originals were recovered through the owner-supplied Drive folder.
- The connection could not create a GitHub repository; the owner created it, and the prepared branches and review tag were successfully pushed.

## Limits and external dependencies

- Tested in emulated Chromium viewports, not on physical Android/iOS devices or Safari. Hardware GPU performance belongs to the 3D/performance phases.
- Phase 1 intentionally contains no 3D intro, vehicle model, paid API, live schedule/promo/review integration, PWA, analytics, enrollment flow or public launch.
- The GitHub check workflow does not deploy. Cloudflare Direct Upload is used for the review branch; production remains reserved for Phase 12 approval.
- Only the supplied regular 8 AM–5 PM schedule is shown; there is no unverified live Open Now claim.
- Address, phone, Google listing and each vehicle's transmission remain unassigned pending verified data.

## Owner review

1. Open the preview on your phone and desktop.
2. Open Menu; test Light/Dark, Lite Mode and Reduce motion. Reload once.
3. Use section navigation and browser Back.
4. Check the logo, colors, typography and overall direction.

Stop here. Phase 2 begins only after explicit Phase 1 approval.
