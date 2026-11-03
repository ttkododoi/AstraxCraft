# Astrax Launcher

A real, buildless browser launcher for Astrax Interactive, featuring the **Dusk Edition minimal smoked-glass workspace**, horizontal navigation, searchable builds, favorites and verified HTML preparation. The current design is a purple-glass Minecraft-inspired workspace with an original AstraxCraft mark, asymmetric play hub and same-page hosted Play. The default background is the genuine Minecraft Java 26.1 Tiny Takeover six-face panorama, served locally with Mojang/Microsoft attribution and recorded administrator-confirmed permission. The older CC BY 3.0 Xbox México scene remains optional. No procedural/generated scenery ships; authorized local cubemap import remains available. No charts or dashboard counters. **Only UserArham/version provides game files.** This is an independent implementation, not an official GX fork or a claim that every build works.

## Same-page Play and a new hub · 2.8

Hosted **Play opens a full-viewport player on this page immediately**, rather than
opening a preparation tab. The original file still downloads/decompresses and
passes size/hash checks before execution; the engine itself may take time to boot.
Back, Fullscreen, Open separately, failure Retry and preparation-only Start/Save
are available. Upstream/local builds retain the existing runner; local imports
never execute automatically.

Previously verified files can be reused from a bounded memory-only LRU (96 MiB,
48 MiB at initial phone widths). No startup prefetch, persistent game caching or
offline promise. The compatible same-origin iframe is not a security boundary:
run only trusted builds. The redesigned hub includes top navigation, a large
selected-build card and six hosted shortcuts. Existing settings, profiles and
3D skins are preserved. See [actual tests and limits](VERIFICATION.md).

## Premium native components and expanded hosting · 2.7

60 builds now load from this GitHub Pages site; remaining entries use pinned upstream.
52 additions are verified GitHub release assets assembled at deployment. New native
components include spring shared-surface filters, search/Clear, material switches,
SVG favorites, work-bound voxel loaders and dimensional purple glass.
[Exact component/source links, implementation mapping and limitations](UI_COMPONENTS.md).

## Player profiles and real 3D skins · 2.5

Open **Skins** or the top profile switcher for multiple persistent browser-local
profiles, a real drag/zoom 3D Minecraft skin viewer, classic/slim models, walk/idle,
outer layers, PNG import/export, and per-profile build/Blob/Popup preferences.
Licensed skinview3d is bundled locally and lazy-loaded. Original Astrax default
textures use Steve/Alex proportions, not unlicensed Mojang default artwork.
No account authentication or in-game username/skin injection is claimed.

## Downloads and documentation

- [Portable source ZIP](downloads/Astrax-Launcher-source.zip) — unzip and follow the startup command below.
- [Complete machine-readable inventory](site/catalog.json) — all 143 tracked upstream files and 140 HTML entries, with exact filenames, sizes and Git blob hashes.
- [Inspected design resources and adaptations](DESIGN_RESEARCH.md).
- [Panorama setup, asset rights and performance](PANORAMA.md).
- [Player profiles, 3D controls, privacy and renderer rebuild](PROFILES.md).
- [Hosted games, compression, authorization and exact manifest](FEATURED_HOSTING.md).
- [Verification report](VERIFICATION.md) — actual tests, execution boundaries and remaining features.
- [Reference audit](REFERENCE_AUDIT.md) and [credits / third-party notices](THIRD_PARTY_NOTICES.md).
- [GitHub pull request](https://github.com/ttkododoi/AstraxCraft/pull/1) — development history and review.

All launcher source, public assets, tools, tests, documentation and the portable ZIP are included in this repository. Sixty approved game originals are hosted here in gzip form; the remaining catalog uses pinned upstream. The portable source ZIP excludes game archives and defaults to upstream fetching; use the mirror/staging tools to obtain and enable the local subset separately. GitHub Pages is enabled at https://ttkododoi.github.io/AstraxCraft/; the included workflow publishes pushes to the current default branch. See the verification report for browser and deployment-check boundaries.

## Run immediately

Python 3.11+ (no pip packages):

```sh
python -m http.server 8080 --bind 0.0.0.0 --directory site
```

Open http://localhost:8080. Do not open `index.html` using `file://`: the catalog must be fetched over HTTP. Production preparation needs HTTPS because integrity verification uses Web Crypto. A localhost development origin is supported. All shell URLs are relative, including catalog and runner; subpath hosting works without an SPA fallback.

1. Open **Select a version**, search the actual filenames, optionally star a build, then select it.
2. **Play** opens a loading tab synchronously. The pinned original HTML is streamed, sized and Git-blob SHA-1 checked. Selection itself never executes a game. No installation or manual file-save step is required.
3. Repository builds **automatically open after validation**, because Play is the explicit execution action. Optional preparation-only mode and local imports still wait for Start Game. Some games require a subsequent in-game gesture for sound/input. A document opening is not proof that a playable world has booted.
4. **Save HTML** downloads the verified original using its exact filename. No popup is needed. If your platform ignores downloads, use the pinned GitHub source from Details or the mirror command below.
5. Local HTML stays in memory until replacement/reload, is never uploaded, and must be self-contained. Sibling JS/WASM/EPK files are not resolved/imported. Basic HTML validation is not a safety audit.

The picker uses normal buttons, not an incomplete ARIA listbox. Tab reaches search/filters/results/stars; Enter activates; Escape closes and returns focus. On phones the labeled navigation becomes an accessible icon rail. Settings/content scroll independently.

## Exact full collection mirror

```sh
python tools/mirror.py --all
# Exact filename, including the space before .html:
python tools/mirror.py --file 'Eaglercraft 1.8.8 .html'
# Restricted environments that permit api.github.com but not raw.githubusercontent.com:
python tools/mirror.py --all --transport api
```

Default destination: `mirror/` (ignored by Git), preserving every upstream path, including `.gitattributes`, `.github/CODEOWNERS` and `README.md`. Three concurrent workers by default; bounded retries, streamed `.part` files, exact byte count + Git blob SHA-1 verification, atomic rename, verified skip on rerun. Failure report: `mirror-report.json`; any failed item makes the command exit nonzero. No fetched file is executed. API transport is unauthenticated and can hit rate limits; lower workers/wait and rerun. Browser code contains no credentials.

Allow **at least 3 GB free plus temporary headroom** for the pinned tree. It contains **143 blobs, 140 HTML entries, 2,877,361,421 bytes** at commit `3fda1220656f4d4d7b6c1fb53272cae52faf29b3`. Future trees may be larger. Runtime memory is substantially greater than source bytes. The launcher does not eagerly download 2.88 GB and has a 160 MiB per-file browser ceiling.

**This delivery did not download all 143 files.** Three files totaling 56,809,868 bytes were fetched and verified. The portable ZIP contains launcher source/tools/inventory, not an offline game collection. The complete byte-exact machine-readable inventory and launch catalog are in [`site/catalog.json`](site/catalog.json), including duplicate-blob relationships and full paths. IDs are SHA-256(path) prefixes and survive content updates. Runtime/category/label are filename-derived, not compatibility certifications. `injector.html` is download-only. No 26.3 entry is invented.

## Source layout

- `site/`: complete static public application, original SVG artwork/favicon, no build step or third-party runtime dependency.
- `site/transfer.js`: streamed fetch, size/HTML/LFS/MIME/integrity validation and original downloads.
- `site/store.js`: validated schema-3 metadata storage (with earlier-schema migrations) with safe defaults/session fallback. Future incompatible migrations must be reviewed; no game databases are inspected or reset.
- `site/runner.*`: explicit preparation/execution boundary, channel handshake, progress and cancellation.
- `tools/sync-catalog.py`: fetch current metadata, resolve main to a commit, generate reviewable catalog. Refuses truncated recursive trees; if a future tree truncates, add subtree enumeration before publishing. Run deliberately; never called on page load.
- `tools/verify-catalog.py`: offline checks for this pinned release.
- `tools/mirror.py`: verified acquisition, all blobs or exact single filename.
- `tests/`, `verification/`: reproducible tests and factual test results.
- `REFERENCE_AUDIT.md`, `VERIFICATION.md`, `THIRD_PARTY_NOTICES.md`: observed facts, gaps and provenance.

## Testing

Runtime used: Python 3.11.2, Node 22.22.3, Playwright 1.56.1 and Chromium 141. Dependencies are dev-only and locked in package-lock.json.

```sh
python tools/verify-catalog.py
npm ci --ignore-scripts
npm test
# Start the server above in a separate terminal, obtain these real fixtures first:
python tools/mirror.py --file Eaglercraft-4k-JS.html --transport api
python tools/mirror.py --file 'Aero Client JS.html' --transport api
python tools/mirror.py --file EaglercraftX_1.8_WASM-GC.html --transport api
npm run test:browser
npm run test:extended
npm run test:dusk
npm run test:motion
npm run test:a11y
npm run test:panorama
npm run test:ui
node tests/extended.mjs
# Optional: executes the two larger third-party game files in isolated test browser contexts:
node tests/execution.mjs
```

Additional current-release checks: `node tests/dusk.mjs`, `node tests/accessibility.mjs`, and `node tests/theme-contrast.mjs`.

The locked @sparticuz/chromium package supplies the Linux x64 test browser and libraries, unpacked under `/tmp`. Other platforms: set `PLAYWRIGHT_EXECUTABLE_PATH` to a compatible local Chromium. Browser tests intercept the pinned raw request with **real hash-verified upstream bytes** because the sandbox cannot reach raw.githubusercontent.com. This tests the browser pipeline, not live raw-host CORS/service availability. Normal users' browsers need access to that raw host. There is no silent third-party mirror fallback. See VERIFICATION.md.

## Hosting and GitHub

This repository was already public. No visibility change was made. The small shell, source, catalog, tests, reports and `downloads/Astrax-Launcher-source.zip` are intended for this GitHub repository. **All game builds remain in the specified upstream GitHub repository**; they have not been duplicated into this checkout.

The live GitHub Pages address is **https://ttkododoi.github.io/AstraxCraft/**. The Actions workflow in `.github/workflows/pages.yml` publishes `site/` after a push to `arena/fd59a27d-astraxcraft` (now the repository default). Pages activation initially failed, but an administrator subsequently enabled it and GitHub reported a successful Orbit deployment. This environment cannot directly fetch github.io hosts, so deployment completion is checked through the GitHub API/Actions rather than claiming a deployed-origin browser test. The Arena preview is separate and temporary. Versioned JS/CSS URLs avoid reusing the old Orbit assets for the Glass release.

The 2026-10-31 GitHub documentation source states a **1 GB maximum published Pages site**, recommended source repository limit 1 GB, soft bandwidth limit 100 GB/month. Thus **the 2.88 GB game tree cannot be published as one Pages site**. GitHub regular-file and Git/LFS/release limits also differ: recheck your plan before uploading games. Largest indexed file is ~84 MB; that alone does not make the full tree suitable for Pages. Sources:
- https://github.com/github/docs/blob/main/content/pages/getting-started-with-github-pages/github-pages-limits.md
- https://github.com/github/docs/blob/main/content/repositories/working-with-files/managing-large-files/about-large-files-on-github.md

Also, upstream has **no detected license**. Publicly accessible source is not blanket redistribution permission. Obtain permission before republishing the collection, then choose a size-capable separate game origin. Use commit-pinned immutable paths, real HTML/JS/WASM/EPK MIME types, appropriate CORS and reviewed COOP/COEP only for clients that need it. Test actual large files and avoid an HTML fallback for missing assets. Regular mode requires a verified HTML-serving origin; raw source navigation is not a substitute.

## Honest parity / safety boundaries

- Blob and Popup preparation are implemented. Regular / About:blank / Data URI are intentionally unavailable, with reasons in Settings. No unverified raw.githack link is used.
- Mods page is compatibility information and lists the two Forge-named builds, **not** an EF_MODS installer. A reviewed compatible runtime/adapter and authorized mod source are still required.
- Skins supports original PNG import, signature/decode/dimension validation, crisp 2D texture preview and original-byte download. **No 3D model, gallery, slim conversion or automatic game application.** Local 3D preview remains a technical parity gap, not a licensing blocker.
- WISP-named files are listed; no injection bundle, default endpoint, authenticated-server bypass or unreviewed server adapter is supplied.
- Personal server bookmarks work. No fabricated live directory, player counts, TCP ping or automatic client mutation.
- Thirteen theme choices include a new soft Dusk default, opt-in light themes and dark tinted variants. Inter is hosted locally under OFL 1.1 with system fallbacks. The Dusk home removes graphs and uses original CSS aurora artwork, not GX imagery. Scale/profile/settings persist.
- Profile is a local display label, not login. Connectivity reflects navigator.onLine, not an authenticated account.
- No service worker/offline cache, bulk offline archive, cloud saves, automatic world migration or fake hardware controls.
- Full Firefox/Safari/iPad/touch-game testing has not occurred. A responsive launcher does not make games touch-compatible. WebAssembly presence is not GC/SIMD/thread support; source filenames are not proof of those capabilities.

**Active HTML and worlds:** Blob HTML can inherit the launcher origin, so execute only trusted files on a dedicated origin without credentials. The launcher does not inject a `<base>`, proxies, server options or a username. Resource resolution and worlds/storage may differ from a regular dedicated HTML host. In-game export/import is the reliable migration path. Reset only affects the small `astrax-v1` metadata key and never clears IndexedDB/world databases.

To finish source-dependent parity, provide an authorized WISP bundle + supported-client list, an EF_MODS-compatible runtime/mod source + license, and (if desired) a permitted skin collection. Existing functionality does not depend on those additions.

## Historical Aurora visual update

The current UI defaults to **Purple**, with translucent glass panels, tinted depth, grouped Play / Tools & Content / Launcher navigation, and refined spacing. Eleven theme choices remain available, including the original red Default theme. Existing explicit theme preferences are preserved; choose Purple in Launcher Settings to switch an older saved profile. Scanlines are off for new profiles. Panel entrances, artwork reveal and launch-button sheen are finite or interaction-triggered, never continuous background effects. All transitions/entrances honor reduced motion. Glass effects have solid-color fallbacks where backdrop filtering is unavailable.

## Historical Orbit Edition · 1.2

The new home replaces the GX-style artwork screen with an original orbital identity. It includes four catalog-backed category shortcuts, real category counts, an on-device favorites shortlist, selected-build/source details, and a floating launch dock. **Ctrl/Command K** opens and focuses the searchable library. Import, selection, preparation, saving and source details use the original working pipeline—no fake launch animation.

Motion includes staggered content arrivals, spring-like hover lifts, click ripples, selection feedback, launch-button sheen and pointer-responsive orbital artwork. There are no endless animation loops. Reduced motion disables decorative entrances, ripples, hover transforms and parallax. The home scrolls independently while the launch dock remains available, including on phones.

Additional interaction test: `node tests/dusk.mjs` (requires the local server). The existing launcher browser regression suite also remains available.

## Historical Glass Edition · 2.0 (superseded by Dusk 2.1)

- **Readable local Inter variable font**, bundled with its OFL license and pinned provenance in `site/assets/fonts/`. No Google Fonts or external CSS request. Startup waits for the local typeface, with a 2.5-second system-font fallback if it stalls.
- **Light Pearl and lavender surfaces** with real `backdrop-filter` blur/saturation, translucent fills, layered edge reflections and pointer-responsive specular highlights. This is a web glass treatment, not a claim of Apple system-level optical refraction. Unsupported browsers receive opaque readable fallbacks.
- **Real data charts**: runtime-label donut; category mixture; original file-size profiles; favorites fraction; selected-file, picker and download-list size meters; and measured cumulative byte-transfer plots. Hover/focus a source-size graph or use Left/Right/Home/End to inspect actual values. Sparklines follow pinned catalog order, **not dates, FPS, latency or benchmark results**.
- **Actual startup screen**: waits for catalog/font tasks, has no fabricated progress/minimum delay, and provides Retry on failure. Catalog requests have a 15-second abort boundary. Loading and preparation never execute third-party game HTML.
- **Quieter animation system**: restrained finite chart draws, eased panel arrivals, spring-based press feedback, small hover lifts and local light reflections. No giant click ripples, background rotation loop or parallax wobble. The loading indicator only animates while loading. Reduced motion disables decorative movement.
- A schema-2 migration converts the old Purple default to Pearl once, preserving favorites, bookmarks, selection and launch preferences. Explicit schema-2 theme choices remain intact.

Charts are included where there is meaningful data; identity/settings/skins do not invent metrics just to fill a graph. Download validation and all previously disclosed game/mod/WISP/skin compatibility limitations remain unchanged.

## Real Minecraft / Purple Glass · 2.4 (current)

- Real Minecraft Overworld screenshot from Xbox México under CC BY 3.0, with
  visible attribution and local optimized WebP files. **Not Tiny Takeover, not
  1080p**: the accessible source copy is 960×509. No AI upscaling or fake scenery.
- Procedural grove faces, original landscape and generator removed. Dusk Aurora
  remains an alternative. Imported Panorama still supports your authorized set.
- Original AstraxCraft mark, yellow splash, compact selected-build Quick Play and
  real Versions/Multiplayer bookmarks/Skins/Settings shortcuts. Quick Play uses
  the same synchronous popup, original bytes, validation and launch code.
- Directional violet glass edges and layered soft shadows, restrained gradient
  Play key, spring-inspired release, trigger-anchored picker, active-tab edge light,
  and one keyboard-accessible tooltip. All extend the existing motion system.
- [Research report](DESIGN_RESEARCH.md) documents actual Uiverse, 60fps, Glass3D
  and 21st examples inspected, code-access limitations, license treatment and
  file-level adaptations. No React, engine or extra runtime dependency.

Current evidence: 7 core cases, 15 main / 8 extended / 7 Dusk / 14 motion browser
checks, 13 background/Quick Play checks and 5 UI/keyboard/scaling checks. Axe scans
4 states and 13 theme contrast checks; not full/manual certification or physical
GPU/device benchmarks. See [VERIFICATION.md](VERIFICATION.md).

## Tiny Takeover-ready Panorama · 2.3 (historical; procedural art removed in 2.4)

A persistent six-face cubemap rotates slowly behind the existing purple glass,
with correct perspective and crisp pixel textures. **The default is the original
Grove fallback, not Mojang’s official panorama.** The 26.1 cherry-grove/baby-animal
reference was studied; no right to redistribute its official textures was
established, so those assets are not bundled or hotlinked.

Settings offers **Tiny Takeover Panorama**, **Original Dusk Aurora**, **Static
Minecraft Scene**, and **Background Off**, with live changes and local
persistence. Import six authorized `panorama_0.png` … `panorama_5.png` files to use
them locally. The status explicitly distinguishes imported assets from the
original fallback. Full instructions, provenance, limits and optional original
art regeneration are in [PANORAMA.md](PANORAMA.md).

The panorama pauses for hidden tabs, reduced motion, disabled background
animation, game loading and running games. Mobile rendering/DPR and texture
resolution are capped. No engine or runtime dependency was added. Failed graphics
or images do not prevent launching; a static original scene is the fallback.

`npm run test:panorama` covers 15 groups including real 4K launch/pause/resume,
import persistence, live settings, graphics loss/recovery, failure handling and
responsive/DPR limits. `npm test` checks original asset hashes and all twelve
cubemap edges. This does not certify mobile GPU/battery performance.

## Dusk Edition · 2.2 (previous)

### Premium motion, same focused workspace

The dependency-free motion controller coordinates real startup completion, accessible line-by-line hero entrances, interruption-safe page changes, a single moving navigation highlight, upward picker transitions, stable in-place selection updates, button press/release feedback, favorites and notifications. Pointer reflections gently interpolate across the selection card and dock; the original aurora remains slow and restrained. No framework, charts, artificial loading delay or animation dependency was added.

**Interface animation: Standard / Subtle / Off** is separate from **Animated background**, persists with existing schema-3 preferences and honors device reduced motion. Real byte progress smoothly interpolates; integrity checking has its own unknown-duration phase and never implies validated readiness early. Cancel has a reserved dock slot. Play still opens its window synchronously and animation never delays game navigation.

`npm run test:motion` adds 14 regression groups covering interruptions, focus, stable DOM, dock geometry, genuine startup/errors/Retry, progress validation and motion preferences. Keyboard containment is tested with a simulated visual-viewport reduction; physical software keyboards and Safari/iOS hardware were not tested.


The user requested removal of the charts and bright dashboard. The current UI contains **no charts, metrics tiles, category cards, or data graphs**. It uses one focused selection card, a quieter seven-item navigation, a persistent Play dock, and optional favorites. Informational mod/release notes moved under Sources/About.

The original aurora background really moves using CSS transforms. Smoked panels blur/saturate the moving backdrop and add layered specular borders. No externally hosted video/animation is required. This is a web glass effect, not Apple-native physical optics. Motion is visible by default but respects device reduced-motion; **Animated background** can be disabled in settings. It pauses when the tab is hidden, while loading, or while a launched repository game tab remains open.

**Auto-start repository games after validation** is enabled by default. Local imported active content keeps a separate confirmation. You can turn automatic starting off to restore preparation-only mode. Main/extended regression tests deliberately turn it off to test the preparation boundary; `tests/dusk.mjs` tests default one-click automatic execution separately.

### Partial self-hosting deployed; full collection not deployed

The collection is **2,877,361,421 bytes**, whereas a published GitHub Pages site may be no larger than **1 GB**. Putting all game HTML under `site/` would make this Pages deployment invalid. A Git repository and a Pages site have different limits; storing GBs outside the site would still add large repository/history and bandwidth costs and would not turn raw URLs into directly HTML-serving pages. No GB-scale game copy was committed or silently republished. Upstream still has no detected repository license, so review redistribution rights before publishing elsewhere.

**Current production configuration (2.6):** `site/hosting.json` routes 60 approved games to same-origin gzip archives, with streaming decompression and original integrity checks. Other paths use pinned upstream. See `FEATURED_HOSTING.md`. This is still **not a full self-hosted collection**, and transfer/validation are not instantaneous.

For an authorized, size-capable separate static host:

```sh
# Acquire all 143 original files (not executed):
python tools/mirror.py --all
# Verify every file, then stage unmodified originals outside the Pages site:
python tools/configure-host.py --prepare --confirm-redistribution-rights
# Upload game-host/COMMIT/ to your chosen host, preserving exact filenames.
# Only AFTER deployment and MIME/CORS checks, configure its real pinned URL:
python tools/configure-host.py --base-url 'https://YOUR-GAME-HOST/COMMIT/' --confirm-redistribution-rights
```

Replace both placeholders with the real deployed host and catalog commit. Staging needs roughly **6 GB plus headroom** if retaining both mirror and staged copies. Correct MIME types, CORS for the launcher origin and immutable caching must be configured on the game host. The `configure-host.py` script does **not** upload or test the remote origin. Browser integrity checks remain mandatory and there is no silent fallback if a configured host fails. Never serve an SPA index fallback for missing game files.

A representative 4K file was actually loaded from a local same-origin HTTP game path with upstream raw access blocked. The complete 143-file mirror was not obtained, staged, or deployed. A staging failure test confirmed that the current incomplete mirror is refused rather than presented as ready. A chosen host and permission to republish are still needed for full self-hosting.
