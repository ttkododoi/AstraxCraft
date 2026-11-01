# Verification report — 31 October 2026 UTC

## Current release: Premium Components / Expanded Hosting 2.7

**109 grouped checks pass:** core 13; premium 10; featured 8 (now all 60 hosted
files); profiles 16; browser 15; Dusk 7; motion 14; panorama 13; extended 8; UI 5.
21 accessibility state/theme scans are clean (17 original, 2 profile/modal,
2 new picker/settings scans). Exact component sources, actual source adaptation,
licenses, inaccessible-source limits and file list: `UI_COMPONENTS.md`.

Hosting: 60 entries / 899,778,235 compressed game bytes / ~907.5 MB assembled
site. All 52 additional archives were actually published through completed
workflow 41341506668 to `astrax-games-2026-11-01`. Local/browser checks verify
all 60 against pinned original bytes with upstream blocked; real 4K launch and
original HTML export still pass. This does not establish all-game engine boots.

New component checks exercise real shared-surface hosted filtering, keyboard
selection, Clear/search focus, native material switch persistence, SVG favorites,
interface Off/reduced motion, 150% responsive geometry and axe scans. Test fixes
addressed actual CSS specificity and indicator box sizing. Heavy simultaneous
SwiftShader suites caused timing/context-recovery failures and tool time limits;
those suites were rerun separately to successful completion. Earlier preparatory
branch pushes intentionally did not publish the incomplete expanded manifest;
the final deployment assembles and verifies all assets before core tests/upload.

No physical-device 60 FPS certification, Safari/iPad gameplay, full 140-build
hosting, runtime authentication or identity injection is asserted.

## Previous release: Tiny Takeover / Featured GitHub Hosting 2.6

**Implemented:** genuine 26.1 Tiny Takeover six-face default, original source/hash
metadata, static genuine fallback, recorded administrator-confirmed permission;
eight approved games on same-origin GitHub Pages as deterministic gzip originals.
156,831,960 original bytes / 89,119,740 hosted bytes. Remaining catalog paths use
upstream. No full-collection, offline-cache, all-game boot or popularity-stat claim.

**99 grouped checks passed this release:** Node/core 13; featured browser 8; profiles 16; browser 15;
Dusk 7; motion 14; classic/import panorama 13; extended 8; UI polish 5. All 17
existing state/theme axe scans and both profile-page/dialog axe scans are clean.
`verification/featured-results.json` records real local HTTP tests: all eight
compressed files decompressed and pinned-hash verified with upstream blocked;
4K Play reached the actual game canvas; Save HTML matched original bytes; Tiny
Takeover rotated, stopped for reduced motion/running game, persisted through
reload and recovered from a real WebGL context loss with a genuine static image.

Original upstream failure/cancel tests now explicitly disable partial hosting in
their fixtures. A separate production-config suite verifies same-origin hosting;
this avoids accidentally testing a mocked upstream response instead of real local
archives. Dusk fixture cleanup removes only its temporary uncompressed file, never
the committed game archive directory. An initial parallel browser extraction raced
with ETXTBSY; after extraction completed, affected suites were rerun and passed.

Tiny Takeover assets and game permissions are administrator-confirmed, not an
independent legal audit or a grant to third parties. Current source ZIP excludes
large game archives. Physical Safari/iPad, all-client engine boots and production
CDN bandwidth capacity are not asserted.

## Previous release: Player Profiles / Real 3D Skin Studio 2.5

The unchanged 2.4 background and launch behavior described below remain intact.
New renderer: locally bundled MIT skinview3d 3.4.2 + skinview-utils 0.7.1 +
Three.js 0.156.1, lazy loaded only on Skins. Original licensed pixel defaults,
not official Mojang Steve/Alex textures. See `PROFILES.md` for exact persistence,
lifecycle, compatibility and identity boundaries.

### 2.5 completed verification

**87 grouped checks passed:** core 9; existing browser 15; extended 8; Dusk 7;
motion 14; panorama 13; UI polish 5; new profiles 16. Existing axe checks for four
launcher states and 13 themes are clean; new profile-page and native-dialog axe
scans also have no violations. The browser harness uses headless Chromium with
SwiftShader, not a physical-device or Safari certification.

New checks exercise actual WebGL drawing/camera changes; wheel/reset; walking and
outer layers; zero continuous frames under reduced motion, preparation, running
game and simulated hidden-tab states; create/activate/edit/delete; profile build
and mode controlling the real dock; reload persistence of multiple profiles and
PNG Blobs; byte-identical skin export; slim/classic and real legacy conversion;
signature/size rejection retaining the prior PNG; 150% phone/tablet/desktop layouts;
renderer cleanup on navigation; renderer-load failure fallback; denied storage;
and no application page errors. Node tests also exercise metadata validation,
24-profile bounds and denied-database mutation/deletion safety.

An existing regression caught immediate reload racing an asynchronous profile
metadata write. Fixed with a synchronous active-profile checkpoint and existing
launcher preferences reconciliation; the original browser suite now passes.
One parallel test batch exceeded its tool wait limit during panorama testing;
panorama was then run separately to completion (all 13 checks). No failed suite
is counted as passed. Reports are in `verification/` (original browser report
also remains under ignored `artifacts/` as in previous releases).

Limits: physical touch/pinch/iPad/Safari, cross-tab conflict resolution, exact
physical-device FPS and all-game compatibility are not asserted. Idle/Walk updates
are capped at 30 Hz with a 1.5 pixel-ratio cap; only active visible rendering runs.
There is no authenticated account service or verified per-build identity adapter,
and no claim that launcher names/skins appear inside a game.

## Previous release: Real Minecraft / Purple Glass 2.4

This supersedes older background descriptions below. Default is an actual Minecraft
Beta gameplay screenshot by Xbox México, CC BY 3.0, stored locally with visible
credit/license and source/change metadata. Original JPEG copy 960×509; WebP crop
960×406 plus 640px mobile derivative. **Not Tiny Takeover, not 1080p.** No image
synthesis/upscaling. Procedural grove assets, generator and legacy SVG landscape
removed. Authorized local panorama import remains; no official 26.1 textures
redistributed. `DESIGN_RESEARCH.md` records actual source/license checks, including
rejection of a stale search result whose Commons file was deleted for infringement.

### Implemented and checked

- Original logo/yellow splash and compact Quick Play; versions/bookmarks/skins/
  settings actions are real. Quick Play delegates directly to the synchronous
  existing launch function; busy/disabled state mirrors the dock.
- Glass3D-inspired original multi-layer shadow/inner-edge CSS with lower-opacity
  purple transmission; Uiverse-inspired gradient-edge Play; 60fps-inspired tactile
  press/release and real-trigger picker origin; 21st Limelight-inspired active edge
  and reusable accessible menu tooltip. Research/partial/gated-source boundaries
  documented; no copied paid source or new runtime packages.
- Core **7**; main browser **15**; extended **8**; Dusk **7**; motion **14**;
  background/Quick Play **13**; UI polish **5** groups. Motion's no-hero-replay check
  excludes only the explicitly persistent CSS splash, not entrance animations.
- New background checks cover real local source, no default canvas, photo movement,
  persistent layers, independent pause preferences, live choices, import storage/
  rejection, synthetic test-only cubemap rotation, real graphics loss/recovery,
  simulated hidden visibility, phone/tablet/desktop cropping, actual verified 4K
  Quick Play launch and functional Multiplayer/Skins actions. See current
  `verification/panorama-results.json` (older version overwritten intentionally).
- UI checks cover original mark/splash/disclaimer, honest disabled Quick Play,
  keyboard tooltip lifecycle, real picker/Escape restoration, independent motion
  settings, reduced motion and 150% home-action reachability with persistent dock.
- Axe: zero reported scoped violations on 4 tested states; contrast: zero reported
  scoped issues on 13 tested homepage themes. No full/manual WCAG certification.
- Desktop/mobile screenshots inspected. Chromium software graphics only; no
  native GPU, physical Safari/iPad, battery or sustained 60/120 FPS benchmarks.

The reference screenshot license does not establish rights for the game tree.
Full 2.88 GB hosting, all-game compatibility and origin-safety limits remain
unchanged. Package contains source/credited screenshot, not game blobs or secrets.

---

## Historical release: Panorama 2.3 (procedural scenery removed in 2.4)

The current background supersedes the older default-aurora statements below.
**Official Tiny Takeover art is not bundled.** Reference study found the 26.1
cherry-grove/baby-animal panorama; redistribution permission was not established.
The default Tiny Takeover Panorama setting therefore uses an explicitly labeled,
original procedural Grove cubemap, with six-face authorized local import support.
See `PANORAMA.md` for reference URLs, original asset license, provenance,
orientation, rendering limits, privacy and setup.

### Checks performed for 2.3

- Core: **7 cases**, including two new groups for background preference validation,
  asset SHA-256 hashes and all twelve cubemap edges. Edge tolerance is mean RGB
  difference below 2/255, allowing raster rounding; not a pixel-identical claim.
- Panorama browser suite: **15 groups** in `verification/panorama-results.json`:
  genuine rendered rotation, one persistent canvas, pause settings/reduced motion,
  loading/game states, simulated hidden visibility, live/persisted choices,
  atomic local import and reload, invalid imports/removal, responsive/DPR limits,
  actual hash-verified 4K and explicit local/manual launch with pause/resume, real WebGL context loss and
  restoration, unavailable graphics, missing faces, and Off without texture fetches.
- Existing main, motion, Dusk and extended browser regressions remain applicable.
  Dusk's aurora-specific checks now explicitly select Original Dusk Aurora; the
  new suite checks the actual default. Source fixtures are the same three pinned
  originals, obtained through API transport into ignored `mirror/`, never bundled.
- Automated accessibility and contrast scans remain scoped evidence, not manual
  certification. No physical iPad/Safari, native GPU, battery, all-game world-boot
  or sustained-frame-rate claim. Viewport and hidden-visibility emulations are
  not hardware validation.

Existing launch/transfer logic and full-hosting limitations are unchanged. No
full collection mirroring, new remote panorama provider or bulk redistribution.

---

## Previous release: Dusk Motion 2.2

Animation/interactions extend the existing Dusk workspace; no layout/framework rewrite or charts. `site/motion.js` owns keyed, cancelable Web Animations, serialized page/picker transitions, FLIP navigation, startup/page staggering, scoped selection/favorite feedback and toast lifetimes. Selection retains the existing hero/card DOM. Button compression is delegated on pointer/key down with CSS release feedback, replacing the former generic click spring rather than stacking another one.

- Standard/Subtle/Off interface animation is an optional schema-3 field, independent of the background flag. OS reduced motion takes precedence. Turning motion off mid-navigation flushes pending content once.
- Startup exit follows actual catalog/font completion and immediately unlocks the shell. No minimum wait or fake percentage. Catalog and module failures retain a working Retry.
- Byte progress uses actual counts; the integrity-check phase is genuinely indeterminate. A delayed SHA-1 test verifies no success/ready state is shown before validation. No animation waits before game navigation.
- Picker closing immediately removes hit-testing and makes its contents inert; Escape restores focus. Interrupted page/popover/toast animations continue from current visual values rather than resetting their opacity.
- The aurora uses transform/opacity, not animated blur/video/WebGL. Panel reflections use a short-lived interpolator, not an idle frame loop. Existing hidden/loading/game/background/reduced-motion pauses remain.

### Actual checks for 2.2

- Core: **5 grouped cases passed**, including interface-motion defaults/validation and legacy preference migration.
- Main browser regressions: **15 groups passed**, including search, real-byte preparation/downloads, persistent settings/bookmarks, local import, denied storage, six viewport sizes and 150% scale. Tests now await the committed destination instead of asserting counts on outgoing inert content.
- Extended: **8 groups passed**. Dusk/default one-click launch: **7 groups passed**, including actual hash-verified 4K execution and representative local same-origin hosting (not full collection hosting).
- New motion suite: **14 groups passed**. See `verification/motion-results.json` for exact checks and one measured synchronous search update (not a device-wide performance benchmark). Rapid navigation, interrupted picker/toasts, pointer-down scale, stable home/card nodes, live favorites, Cancel/dock geometry, Off/reduced-motion persistence, pending-transition flush, real delayed startup, catalog/module Retry and delayed validation are covered.
- Axe: **4 tested states** with zero reported scoped A/AA violations; contrast: **13 homepage themes** with zero reported scoped issues. Not full/manual WCAG certification.
- Desktop/mobile screenshots reviewed locally. Software-keyboard bounds are simulated via reduced `visualViewport.height`, **not** verified on a physical phone/iPad. No Firefox/Safari, native desktop, frame-rate, GPU/memory or all-game compatibility claims.

The existing game-hosting and origin-safety limitations below are unchanged: `baseUrl:null`, full 2.88 GB tree not deployed, upstream redistribution rights unresolved. Source ZIP includes launcher code/tests/evidence, not games or browser binaries. Former reports below are historical, not current animation descriptions.

---

## Previous release: Dusk Edition 2.1

This section supersedes the older chart/light-theme/autostart descriptions below. Historical reports are retained, not represented as current UI.

- All chart generation, chart UI, metric tiles and category cards have been removed. Home is a single smoked-glass selection card with optional favorites. Informational mods/release notes moved under About.
- Default theme is Dusk, migrated from older Pearl/Purple/Light profiles without resetting bookmarks or favorites. The original CSS aurora has genuinely changing transforms, verified over time—not a static image described as animated. Backdrop filtering and reflective edging are active. Reduced-motion and a persisted background setting work. Ambient motion pauses for hidden tabs, loading, and launched game tabs.
- One Play click on a repository build opens the loading page synchronously, verifies the bytes, then automatically navigates to its HTML Blob. There is no manual installation, file-save or second Start button on that default path. No readiness is inferred from document navigation. Local HTML and optional prepare-only mode retain explicit confirmation. Some clients retain their own sound/input gesture requirements.
- `site/hosting.json` explicitly selects the source. Production remains **baseUrl=null: pinned upstream raw bytes**. Full 2.88 GB self-hosting is **not deployed**, nor is the whole collection downloaded. GitHub Pages' 1 GB published-site ceiling prevents packaging the complete tree into this Pages site. A separately authorized, size-capable host is required for this approach. No additional public repository or host was silently created.
- `tools/configure-host.py` validates/stages all original files and configures a pinned game URL; it does not upload or pretend to verify a remote origin. Its tested incomplete-tree refusal reports **140 missing files** (three originals previously mirrored). See `verification/host-staging-check.json`.

### Actual tests for 2.1

- `npm test`: **5 grouped cases passed**; includes schema-3 preference migration, optional auto-start/background state, exact hosted-path encoding, revision mismatch and unsafe URL rejection.
- Main browser regression: **15 groups passed**, including 150% scaling. These tests explicitly choose prepare-only mode so preparation/no-execution assertions remain meaningful.
- Extended browser checks: **8 groups passed**, also in prepare-only mode.
- `tests/dusk.mjs`: **7 groups passed**: no charts/tiles; actual aurora motion plus computed glass filtering; real 4K automatic single-Play execution; non-automatic local-import execution; motion toggle/persistence/reduced motion; six viewport sizes; and representative real same-origin hosting.
- For the hosting test, the real, hash-verified 66,325-byte `Eaglercraft-4k-JS.html` was temporarily served by the local HTTP server under a commit-pinned game path. Browser configuration was pointed to that path and raw upstream requests were blocked. It reached the `Minecraft 4k` document automatically. The staged test file was removed afterward. **This does not prove the full collection is hosted or that all games boot.**
- Axe automated scans: zero reported A/AA violations on the tested home, settings, downloads and picker views; separate homepage contrast checks passed **13 themes**. Not a manual/full WCAG certification.
- Desktop and phone screenshots were captured; no external animated asset license or network dependency was introduced.

Current evidence: `verification/dusk-results.json`, main/extended results, accessibility/contrast results and staging check. Former Glass/Orbit evidence is historical; obsolete chart-specific test scripts were removed. The old game smoke-test boundaries below still apply, with no additional all-game compatibility claim.

---

## Historical report follows

## Historical Glass Edition 2.0

This section supersedes the earlier visual, font, schema and Pages-activation status below; the initial report remains as historical evidence. The original source/integrity and game-compatibility limits are unchanged.

- **Typography/provenance:** local Inter variable WOFF2 (352,240 bytes), checked against its pinned upstream Git blob and SHA-256. Full SIL OFL 1.1 license/provenance are bundled in `site/assets/fonts/`. No remote font service is used. Catalog startup waits for the font with a bounded 2.5-second system-font fallback.
- **Light glass:** Pearl default and pastel-lavender/blue canvas, transparent panels, actual CSS backdrop blur/saturation, layered edge lighting and a pointer-driven specular layer. This is real browser translucency/backdrop filtering, **not** a physical-fluid simulation or Apple-native Liquid Glass implementation. A readable opaque fallback is supplied when backdrop filtering is unsupported; Safari-specific rendering has not been verified.
- **Charts:** runtime filename-label donut totals 140 (51 WASM-named / 38 JS-named / 51 Unspecified); category counts, exact source-size profiles, saved-favorite proportion, picker/library/selection size meters, and real cumulative download-byte graphs. Source profiles follow catalog order, not time or release chronology. Graphs do not claim FPS, RAM, latency, benchmark or gameplay performance. Hover/focus and Left/Right/Home/End inspect exact source byte values. Live transfer plots are bounded to 64 real samples and redraw at most approximately ten times/second; they are not keyboard-scrubbable while being replaced.
- **Loading:** actual pending catalog/typeface tasks, indeterminate progress, no random percentages or minimum artificial delay. 15-second catalog abort boundary; failed catalog/module loading exposes a tested Retry action. Font failure uses system fallbacks instead of a blank or permanently locked screen. Preparation remains separate from execution.
- **Motion:** finite chart drawing, short eased panel arrivals and spring-based press feedback replace the earlier large ripples/parallax. No decorative perpetual loop remains after startup. All decorative motion honors reduced motion. The loading indicator stops when loading ends.
- **Persistence:** schema 2 migrates the old schema-1 Purple default to Pearl once, keeping favorites, bookmarks, selection and launch preferences. Explicit schema-2 themes are preserved. No game database is changed.

### Current actual checks

`npm test`: **5/5 grouped cases passed**, including new chart-total and schema-migration assertions.

Current browser suites passed: **15 main regression groups**, **6 home/keyboard groups**, **8 extended transfer/import/skin groups**, and **12 Glass groups** (41 recorded groups total). See `verification/browser-results.json`, `orbit-results.json`, `extended-results.json`, and `glass-results.json`.

The new Glass checks specifically cover an intentionally delayed catalog and inert loading screen; actual local font/backdrop-filter activation; factual runtime and size plots; exact keyboard chart values; live favorites/selection; a real hash-verified 66,325-byte upstream fixture driving progress; reduced motion; six viewport sizes; catalog Retry; metadata-preserving migration; font-request failure; and module-request failure with Retry. Existing regressions also exercise 150% scaling at phone/tablet/desktop sizes. Browser downloads use real hash-verified local upstream fixtures because the sandbox cannot reach raw.githubusercontent.com; this does not verify current raw-host behavior on the deployed origin.

Axe-core 4.10.2 automated WCAG 2 A/AA + 2.1 AA scans reported **zero violations on the tested home, settings, downloads and expanded picker views**. Separate homepage color-contrast scans reported zero violations across **12 themes**. Evidence: `verification/accessibility-results.json` and `verification/theme-contrast-results.json`. These are automated checks on these states, **not a complete WCAG certification, all-panel audit or manual screen-reader review**. Desktop/loading/phone screenshots were actually captured and inspected.

GitHub Pages is now enabled at https://ttkododoi.github.io/AstraxCraft/ (initial activation was later completed by the repository administrator). The earlier Orbit release was reported successfully deployed by GitHub Actions. The deployment workflow now gates publication on catalog/core-test success. Direct github.io HTTP/browser access is still blocked in this sandbox: deployment status is checked through GitHub APIs/Actions, not misrepresented as deployed-origin response-header or full browser testing. JS/CSS module URLs are release-versioned for the new visual update.

Chromium 141/Linux remains the tested browser. No new Safari/iPad/Firefox game compatibility or all-game boot claim follows from this redesign. The later historical sections retain the exact game execution smoke-test outcomes and source-dependent parity gaps.

---

## Historical initial report

## Executive result

Working static launcher, portable source, exact catalog and verified mirroring tools delivered. **Not full GX feature parity; not all games tested; not an offline archive.** No permanent GitHub Pages deployment verified: enabling Pages returned HTTP 403 `Resource not accessible by integration`. The local HTTP/Arena preview runs on port 8080. The repository was already public; visibility was not changed.

## Upstream facts rechecked today

GitHub repository API: UserArham/version, main, has_pages=false, license=null. Resolved commit `3fda1220656f4d4d7b6c1fb53272cae52faf29b3`. Recursive tree untruncated, 144 tree objects (one directory), **143 blobs / 140 HTML files / 2,877,361,421 blob bytes**. This agrees with the supplied baseline. File-byte sum is not GitHub's historical repository-size statistic. `site/catalog.json` includes tree SHA, every path/size/blob ID, stable path-derived IDs, utility flag and duplicate-content paths. Similar names are not merged. Exact spaces and case are preserved. No invented 26.3.

`python tools/verify-catalog.py` passed. `npm test`: **4/4 grouped test cases passed**; validates all inventory mappings, unique path-derived IDs, duplicate relationships, exact URL encoding, storage/schema boundaries, server schemes/credentials, actual Git blob algorithm, HTML/LFS/size/hash errors, streamed success/progress, 403/404, wrong MIME, simulated CORS failure and cancellation. Mock failures test code paths, not real upstream status behavior.

## Actual downloads (never executed by mirror tool)

| Exact path | Bytes | Acquisition | Integrity |
|---|---:|---|---|
| Eaglercraft-4k-JS.html | 66,325 | GitHub Git Blobs API raw transport | size + Git blob SHA-1 verified |
| Aero Client JS.html | 41,608,092 | same | size + Git blob SHA-1 verified |
| EaglercraftX_1.8_WASM-GC.html | 15,135,451 | same | size + Git blob SHA-1 verified |

Total acquired: **56,809,868 bytes**, not 2.88 GB. The 4K rerun printed `verified-skip`; machine-readable reports are under `verification/`. Mirrors/temporary game downloads are ignored, not in Git or ZIP. Entire 143-file mirroring, its aggregate failure/retry behavior under real outages, and all-file hashes have **not** been exercised. Single-file success and skip were exercised. Mirror streams bytes to disk and computes `SHA1("blob " + length + NUL + bytes)`, not ordinary file SHA-1. Browser path independently implements this same algorithm with Web Crypto; it is stronger than the original prototype's size-only check, but no SHA-256 content manifest is claimed. ID SHA-256 is a path identity, not content integrity.

## Real browser checks

Linux x64, Chromium 141 (locked @sparticuz/chromium 141.0.0), Playwright 1.56.1, Node 22.22.3. Browser arguments used for tests do **not** disable web security. Browser executed the actual static app, not a rendered screenshot substitute. Standard Playwright browser download was blocked by the host allowlist; the npm-packaged browser and supplied Linux libraries were used instead.

`npm run test:browser` passed all **15 recorded interaction groups**; `node tests/extended.mjs` passed **8 additional groups**. See JSON evidence (not invented logs).

- Actual startup with local static catalog; no API request required at startup.
- Mixed-case exact-filename search (including trailing space before `.html`), empty/no-match state, Beta category isolation, selection and reload.
- Star toggling leaves picker open, favorites-only view and selected state. Stable IDs and selection persist.
- Escape closes/restores focus. Controls are native buttons/inputs/selects, not a falsely labeled listbox.
- Name, Light theme, Popup mode and 150% scale persist after reload.
- Server scheme rejection, add, persist, remove. URL parser/unit tests reject embedded credentials. No address ping occurs on save. Deduplication and clipboard failure branches are implemented but **not directly automated in browser**.
- Popup-blocked case simulated by `window.open = () => null`: recoverable error, no success claim.
- Verified real 4K bytes streamed into preparation page; no game code executed before Start Game. Original-file browser download had correct filename and 66,325-byte size.
- Real JS and WASM fixtures separately prepared, sized and Git-blob verified in browser. Network interception supplies **unaltered, hash-verified upstream bytes** from the local mirror. This does not prove live raw.githubusercontent.com accessibility/CORS on the user's network.
- Cancel during delayed transfer restores controls; retry 404 surfaces exact HTTP error without reporting success. Subsequent successful preparation works.
- Local HTML selection and repeat selection, extension rejection and no execution on selection. Too-large, external-dependency, concurrent/superseded local-file stress scenarios are **not fully browser-tested**. Local files are memory-only; no localStorage base64.
- Valid 64×64 PNG decode/preview; invalid dimensions and signature rejected. Decode exceptions are caught. Legacy 64×32 acceptance, alpha round-trip, corrupt-PNG decode and 3D UV/legacy conversion have **not** been automated; no 3D converter exists.
- Malformed localStorage and storage denied entirely: application still opens. Store schema validation is unit tested.
- 1366×768, 1440×900, 1920×1080, 1024×768, 390×844 and 430×932: actual viewport resizing, no body overflow, picker bounds inside viewport, Launch visible. 150% scale also tested at 390×844, 1024×768 and 1366×768 with settings controls reachable. Does not establish game touch support.
- Reduced-motion CSS disables scanline overlay. No continuously animated background.
- No application `pageerror` events in main browser suite. App errors and game errors are captured separately.

No formal WCAG audit, full screen-reader walkthrough, all-theme contrast matrix, keyboard-only traversal of every secondary action or Safari/Firefox/iPad A16 test occurred. Higher-contrast muted text was chosen over GX's #555. Launch text uses dark color on brighter accents.

## Explicit game execution smoke tests

Execution was separate from preparation and used Start Game + confirmation in fresh test contexts without credentials. Third-party files were not patched.

- **Eaglercraft-4k-JS.html**: Blob document title `Minecraft 4k`, one canvas, no page errors; screenshot visibly showed a rendered textured block scene. No movement/world-save/multiplayer assertion.
- **Aero Client JS.html**: after pressing Space through its sound prompt, one canvas/no captured page errors/no failed requests; screenshot showed the Mojang Studios loading screen. **Not a verified completed menu/world boot.**
- **EaglercraftX_1.8_WASM-GC.html**: initial sound prompt was visible; after Space one canvas/no captured page errors/no failed requests. Subsequent screenshot timed out (5s limit; earlier attempt also timed out at 30s). **No verified playable boot.** A canvas/load event is not readiness. See `verification/execution-smoke.json`.

Do not extrapolate these checks to 140 games, WASM GC/threads/SIMD compatibility, multiplayer/proxy authentication, worlds, save persistence or frame rates. The browser capability panel reports availability only. No COOP/COEP headers are globally forced, and threads-required games may not work. Self-contained Blob behavior differs from multi-file resources and origin-dependent games.

## Reference, hosting and portability boundaries

- GX public live host was inaccessible; requested source files were retrieved through GitHub at unchanged shell commit. This is a source audit, **not** a current live visual/interactions audit. See REFERENCE_AUDIT.md and resource digests.
- Shell requests on local HTTP returned correct JS/CSS/JSON/HTML MIME types (Python server). Relative URLs also support repository subpaths; production response headers and user-network fetch behavior remain unverified.
- Browser direct raw network calls were intercepted for reproducibility because raw.githubusercontent.com is outside sandbox's outbound allowlist. No claim that real public CORS, current upstream HTTP errors, remote mirror or raw.githack is tested. No unverified mirror link is offered.
- GitHub docs source rechecked: Pages 1 GB published site ceiling excludes the 2.88 GB tree; upstream has no detected license. Full game duplication on GitHub is intentionally not done without resolving those constraints. All launcher deliverables are small and GitHub-ready.
- ZIP is created from an explicit source allowlist, excluding `.git`, credentials, node_modules, fetched game files, screenshots, caches and private deployment manifests. `tools/package.py` scans entry names and text-like content for credential signatures. Archive opens and catalog counts are checked.

## Concrete remaining parity gaps

1. Missing authorized/compatible EF_MODS runtime adapter + mod collection. Mods is an information page, not a fake installer.
2. No WISP injection bundle/adapter/license. No automatic proxy contact or authentication bypass. Four WISP-named upstream paths are preserved.
3. Local 2D PNG skin texture workflow only: no 3D model, slim/classic UVs, rotating gallery or auto-application. A collection requires authorized extra assets; local 3D preview itself remains an engineering gap.
4. Regular requires verified HTML host; About:blank/Data URI unimplemented/disabled, not advertised as completed.
5. Original geometric artwork and system typography replace GX imagery/fonts. No live pixel-parity comparison.
6. No public server status backend/client injection, offline service-worker cache, world migration, cloud saves or full offline archive.
7. Permanent Pages activation blocked by integration permissions; deployment is supplied but not claimed successful. Administrator action required.

These are disclosed limitations, not a claim of complete GX equivalence.

## Aurora UI follow-up

Purple was added as the new-profile default without discarding existing theme choices. Glass panels, grouped sidebar navigation, refined settings/library rows, and finite entrance/hover motion replace the earlier squared red treatment at the user's request. Existing theme preferences remain intact. Scanlines default off for new profiles. `npm test` (4/4) and `npm run test:browser` (15 recorded groups) were rerun after this change and passed, including six viewport sizes and mobile/tablet/desktop 150% scale checks. This update changes the user's requested visual direction; the earlier GX pixel-parity constraints are no longer the target for the new glass treatment. No additional game compatibility is claimed.

## Orbit Edition follow-up

The user explicitly requested a unique design rather than GX resemblance. The home, visual identity, shell spacing, floating navigation/dock, category shortcuts and library layout now follow the original Orbit direction. Finite staggered arrivals, native Web Animations click ripples, selection feedback and event-driven artwork parallax were added. No perpetual animation or new network service is introduced. The original launcher source/integrity boundaries remain unchanged.

`npm test` passed 4 grouped cases. The existing browser regression passed 15 groups after the layout and outside-pointer handling change. `node tests/orbit.mjs` passed 6 new groups: original home/category rendering, Explore + Ctrl K, category/favorites/selection synchronization, selected source details, reduced-motion suppression, and phone dock/body bounds. Evidence is in `verification/orbit-results.json`. Real desktop and phone screenshots were captured and visually inspected; no current GX screenshot comparison is claimed or targeted. No new game compatibility claim follows from this visual redesign.
