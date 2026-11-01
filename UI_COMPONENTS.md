# AstraxCraft 2.7 — actual component integration report

## What changed

The existing HTML/CSS/JavaScript launcher, purple identity, genuine Tiny Takeover
panorama, profiles and verified launch pipeline remain. There is no React/Tailwind
migration, new UI framework, external runtime asset/CDN request or fake loading.
New code is in `site/components.js` / `site/components.css`, integrated directly
with `site/app.js`, `site/motion.js`, `site/index.html` and `site/runner.html`.

## Specific sources, actual adaptations and access limits

| Source inspected | Integrated code / behavior |
| --- | --- |
| [Uiverse — cssbuttons-io gradient frame](https://uiverse.io/cssbuttons-io/wonderful-baboon-62) | Gradient border / inner-surface treatment adapted for Play and profile primary buttons; retained native focus, disabled and press states; restrained purple rather than rainbow. |
| [Uiverse — adamgiebl material checkbox](https://uiverse.io/adamgiebl/new-dingo-22) | Layered inset material and checked-state surface adapted into actual settings inputs. Original hides the input; our port deliberately keeps a native keyboard-operable checkbox. |
| [Uiverse — Pradeepsaranbishnoi dimensional switch](https://uiverse.io/Pradeepsaranbishnoi/honest-penguin-58) | Switch surface/shadow/indicator transitions scaled to a 46×28 native control with a moving thumb. Removed legacy IE filters, offscreen hidden input and huge margins. |
| [Uiverse — alexruix input group](https://uiverse.io/alexruix/plastic-shrimp-54) | Actual icon/input group, inset padding, rounded focus material and transitions ported to version search. Added functional Clear, retained associated label, live result count and synchronous filtering. |
| [Uiverse — boryanakrasteva check stroke](https://uiverse.io/boryanakrasteva/calm-lionfish-10) | Checked-stroke appearance/opacity/rotation adapted to the outer-layer checkbox; same checked-state treatment informs native SVG favorite buttons. Removed green glow and oversized pulse. Favorites still update real persisted state. |
| [Uiverse — alexruix voxel loader](https://uiverse.io/alexruix/white-cat-50) | Square, quarter-turn and shadow construction adapted into a small Minecraft-like loader on real startup/runner work. Removed bouncing and full-size movement. Loader disappears with actual work; reduced motion freezes it. Measured progress remains separate and truthful. |
| [60fps — Tactile Button Interaction](https://60fps.design/snippets/tactile-button-interaction) | Public SwiftUI press/release structure and described material-depth behavior implemented in native CSS/WAAPI: pointer/keyboard compression, release spring, cancel-on-interruption. No native-haptics claim. |
| [60fps — Dropdown Expand Morph](https://60fps.design/snippets/dropdown-menu-expand-morph-interaction) | Public menu state, source/target expansion and reduced-motion model adapted to spring-opening version picker and interruptible arrival/exit. Hit-testing disables immediately on close; state and real results never wait for animation. |
| [Glass3D generator](https://glass3d.dev/) | Actual generator CSS inspected: copied/adapted multi-scale directional shadow and inset edge construction, filtered/tinted surface layers. Applied to picker, Play card, profile studio and dialogs. Pointer edge lighting now reaches studio panels too. Desktop blur capped at 18px, mobile 10px. No external noise/fish image, animated displacement filter or literal optical-refraction claim. |
| [21st — ibelick Animated Tabs](https://21st.dev/@ibelick/components/animated-tabs) / [live preview](https://cdn.21st.dev/bundled/1115.html) | Adapted the actual MIT upstream AnimatedBackground implementation into a native shared-surface All builds / Hosted here control. `activeId` maps to selected button, `data-checked` survives, `onValueChange` maps to immediate filtering, Motion layoutId maps to a persistent geometry-tracked span with native WAAPI springs. Keyboard arrows/Home/End, pressed semantics, resize and motion-Off cancellation added. |

### Licensing and code access

Uiverse component pages expose full CSS and state MIT. Existing full license:
`site/assets/licenses/Uiverse-MIT.txt`; original authors are credited above.

21st's own component-source tab requires an account. Rather than pretending to
access it, we followed its linked Motion Primitives library to the public source:
https://github.com/ibelick/motion-primitives/blob/120f64f6ca60348e251f929e9c81f11ccbe45eda/components/core/animated-background.tsx
The complete source and MIT license were retrieved and inspected. Full copyright
notice: `site/assets/licenses/Motion-Primitives-MIT.txt` (2024 ibelick). No copied
React runtime, lucide-react icons or Motion library dependency is needed by the port.
The public 21st live preview was opened and its usage code inspected; this is not a
claim of frame-by-frame interactive testing of its hosted React demo.

60fps exposes public descriptions and partial SwiftUI; remaining implementation
is PRO-gated. No paid source was accessed or copied. Video playback/frame-by-frame
inspection could not be verified in the available browsing tools. Our independent
native implementations use only the visible state/gesture/spring techniques and
public code structure. This limitation is explicit, not an invented source claim.

Glass3D exposes its full copyable generator CSS. Only that generated CSS technique
is adapted, not its site implementation or example artwork. A first attempted
Uiverse URL `adamgiebl/rotten-horse-24` returned 404 and was not used.

## Performance, lifecycle and accessibility

- Damped physical spring response is sampled once into 25 WAAPI keyframes; the
  browser interpolates transform/scale/opacity. No permanent JS animation loop
  for UI controls. Springs are damped, brief and interruptible, not random bounce.
- Existing FLIP navigation, cancellable page/picker transitions and stable home
  selection remain. Filtering all 140 entries is synchronous with no per-row
  stagger. Clear and hosted filters operate immediately.
- Glass light interpolation is event-driven and stops when settled, hidden or
  preparing/running a game. Background and 3D skin rendering keep their separate
  visibility/reduced-motion/launch lifecycle controls.
- Native buttons, inputs and dialogs retain keyboard, focus, disabled, labels,
  checkbox semantics and destructive confirmations. No inaccessible fake switches.
- Device reduced motion and Interface Off cancel spring animations, disable loader
  rotation and retain instantaneous functional state. Mobile effects are cheaper.
- This is designed toward smooth 60 Hz UI motion; **physical-device 60 FPS, Safari,
  native haptics and optical liquid-glass refraction are not certified**. Headless
  Chromium/SwiftShader can stall under simultaneous browser suites; affected tests
  were rerun separately rather than reporting those failed runs as passes.

## Verification and related hosting change

`npm run test:premium` checks real filter counts/shared-surface alignment, keyboard
selection, search/Clear/focus, persistent SVG favorites, native switch persistence,
reduced motion, phone/tablet/desktop at 150%, no errors and clean new axe scans.
Existing browser/motion/profile/panorama/launch/error/import suites also rerun.
Reports: `verification/premium-results.json`, `verification/featured-results.json`,
other reports in `verification/`.

Hosting expanded first: **60 builds**, including all 18 catalogued client entries,
899,778,235 compressed game bytes, approximately 907.5 MB assembled site. All 60
round-trip to original pinned Git blobs; browser tests fetch/decompress/verify all
60 with upstream blocked. Only representative 4K execution is claimed, not all-
client/game boot compatibility. Remaining 80 HTML entries stay on upstream.

52 additions are actual assets in the GitHub release:
https://github.com/ttkododoi/AstraxCraft/releases/tag/astrax-games-2026-11-01
GitHub normalizes asset-name spaces to dots; the manifest records each actual
`releaseAsset` name and deployment restores the exact original path before use.
Pages downloads and verifies them at deployment, not in the user's browser.
This keeps huge generated game bytes out of Git source/history and portable ZIP.
See `FEATURED_HOSTING.md` for limits and rights; all permission claims remain
administrator-confirmed, not an independent legal audit or blanket license.

## Modified files (main changes)

- Runtime: `site/app.js`, `site/motion.js`, `site/components.js`,
  `site/components.css`, `site/index.html`, `site/runner.html`;
  `site/runner.js` and `site/profiles.js` cache-version references.
- Hosting: `site/hosting.json`, `site/featured-games.json`, `.gitignore`,
  `.github/workflows/pages.yml`, `.github/workflows/expanded-games.yml`,
  `tools/expand-hosting.py`, `tools/release-expansion.py`, `tools/assemble-games.py`.
- Licenses: `site/assets/licenses/Motion-Primitives-MIT.txt`; this report and
  `THIRD_PARTY_NOTICES.md` preserve component credits.
- Tests: `tests/premium.mjs`, `tests/featured.mjs`, `tests/featured.test.js`,
  package scripts/lock; verification reports updated.
- Docs/packaging: `README.md`, `FEATURED_HOSTING.md`, `DESIGN_RESEARCH.md`,
  `VERIFICATION.md`, `tools/package.py`, refreshed portable source ZIP.
