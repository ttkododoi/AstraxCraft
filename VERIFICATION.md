# Verification report — 31 October 2026 UTC

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
