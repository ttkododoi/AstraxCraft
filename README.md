# Astrax Launcher

A real, buildless browser launcher for Astrax Interactive, featuring the **Aurora purple glass UI**, grouped navigation, searchable builds, favorites and verified HTML preparation. Originally inspired by GX's compact desktop composition, now styled with translucent panels and reduced-motion-aware transitions. **Only UserArham/version provides game files.** This is an independent implementation, not an official GX fork or a claim that every build works.

## Downloads and documentation

- [Portable source ZIP](downloads/Astrax-Launcher-source.zip) — unzip and follow the startup command below.
- [Complete machine-readable inventory](site/catalog.json) — all 143 tracked upstream files and 140 HTML entries, with exact filenames, sizes and Git blob hashes.
- [Verification report](VERIFICATION.md) — actual tests, execution boundaries and remaining features.
- [Reference audit](REFERENCE_AUDIT.md) and [credits / third-party notices](THIRD_PARTY_NOTICES.md).
- [GitHub pull request](https://github.com/ttkododoi/AstraxCraft/pull/1) — current launcher changes awaiting merge.

All launcher source, public assets, tools, tests, documentation and the portable ZIP are included in this repository. The upstream game collection is catalogued, not bundled; use the mirror command below to obtain it. GitHub Pages activation still requires administrator setup; this README does not claim a permanent deployed site.

## Run immediately

Python 3.11+ (no pip packages):

```sh
python -m http.server 8080 --bind 0.0.0.0 --directory site
```

Open http://localhost:8080. Do not open `index.html` using `file://`: the catalog must be fetched over HTTP. Production preparation needs HTTPS because integrity verification uses Web Crypto. A localhost development origin is supported. All shell URLs are relative, including catalog and runner; subpath hosting works without an SPA fallback.

1. Open **Select a version**, search the actual filenames, optionally star a build, then select it.
2. **Launch** opens a preparation tab synchronously. The pinned original HTML is streamed, size checked and Git-blob SHA-1 checked. No game code is executed during selection or preparation.
3. In the preparation tab, **Start Game** asks for confirmation before navigating to a Blob document. Tab opened / bytes ready are not game readiness.
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
- `site/store.js`: validated schema-1 metadata storage with safe defaults/session fallback. Future incompatible migrations must be reviewed; no game databases are inspected or reset.
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
node tests/extended.mjs
# Optional: executes the two larger third-party game files in isolated test browser contexts:
node tests/execution.mjs
```

The locked @sparticuz/chromium package supplies the Linux x64 test browser and libraries, unpacked under `/tmp`. Other platforms: set `PLAYWRIGHT_EXECUTABLE_PATH` to a compatible local Chromium. Browser tests intercept the pinned raw request with **real hash-verified upstream bytes** because the sandbox cannot reach raw.githubusercontent.com. This tests the browser pipeline, not live raw-host CORS/service availability. Normal users' browsers need access to that raw host. There is no silent third-party mirror fallback. See VERIFICATION.md.

## Hosting and GitHub

This repository was already public. No visibility change was made. The small shell, source, catalog, tests, reports and `downloads/Astrax-Launcher-source.zip` are intended for this GitHub repository. **All game builds remain in the specified upstream GitHub repository**; they have not been duplicated into this checkout.

A GitHub Pages Actions deployment is provided in `.github/workflows/pages.yml`, targeting the session branch. Automatic Pages creation failed with HTTP 403 `Resource not accessible by integration`; no permanent Pages deployment is claimed. A repository administrator can open **Settings → Pages → Build and deployment → GitHub Actions**, then rerun **Deploy Astrax Launcher**. Use the URL produced by the successful deployment, and verify assets/preparation there. Do not assume a predicted URL works. The running Arena preview is separate and temporary.

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
- Ten themes include tinted backgrounds; scale/profile/settings persist. Uses local system fonts rather than packaged Rajdhani/Share Tech Mono. Original dim block landscape replaces GX's image; not pixel-identical artwork.
- Profile is a local display label, not login. Connectivity reflects navigator.onLine, not an authenticated account.
- No service worker/offline cache, bulk offline archive, cloud saves, automatic world migration or fake hardware controls.
- Full Firefox/Safari/iPad/touch-game testing has not occurred. A responsive launcher does not make games touch-compatible. WebAssembly presence is not GC/SIMD/thread support; source filenames are not proof of those capabilities.

**Active HTML and worlds:** Blob HTML can inherit the launcher origin, so execute only trusted files on a dedicated origin without credentials. The launcher does not inject a `<base>`, proxies, server options or a username. Resource resolution and worlds/storage may differ from a regular dedicated HTML host. In-game export/import is the reliable migration path. Reset only affects the small `astrax-v1` metadata key and never clears IndexedDB/world databases.

To finish source-dependent parity, provide an authorized WISP bundle + supported-client list, an EF_MODS-compatible runtime/mod source + license, and (if desired) a permitted skin collection. Existing functionality does not depend on those additions.

## Aurora visual update

The current UI defaults to **Purple**, with translucent glass panels, tinted depth, grouped Play / Tools & Content / Launcher navigation, and refined spacing. Eleven theme choices remain available, including the original red Default theme. Existing explicit theme preferences are preserved; choose Purple in Launcher Settings to switch an older saved profile. Scanlines are off for new profiles. Panel entrances, artwork reveal and launch-button sheen are finite or interaction-triggered, never continuous background effects. All transitions/entrances honor reduced motion. Glass effects have solid-color fallbacks where backdrop filtering is unavailable.
