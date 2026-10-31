# Reference audit — 2026-10-31 UTC

## Retrieval and limits

Direct HTTPS retrieval of https://gx-launcher.github.io/ failed in this sandbox (`SSL_ERROR_SYSCALL`; outbound host allowlist). Therefore **no current desktop screenshot or live GX interactions were observed**. Do not describe this as pixel-perfect visual comparison. The equivalent public files were read as data through GitHub's Contents API at the unchanged repository commit:

`GX-Launcher/GX-Launcher.github.io` / `79f6397399a7578d291daecb516b328a58c3d9fb`.

All requested shell resources were successfully retrieved via GitHub: `index.html`, `styles.css`, `script.js`, `settings.html`, `clients.html`, `otherclients.html`, `servers.html`, `downloads.html`, `downloads-data.js`, `mods.html`, `skins.html`, `news.html`, `nav-visibility.js`. Their requested public URLs are `https://gx-launcher.github.io/` plus each exact filename. `verification/reference-resources.json` records byte counts and SHA-256 of retrieved source text. No GX scripts or build tools were executed. Inspected revision still v2.4.2; no tree difference from the supplied snapshot.

## Source-observed reference behavior (not live-interaction verification)

- CSS: full black shell; title height 36 px, fixed sidebar width 185 px, section strip 38 px. Profile/rule above compact navigation, bottom Settings. Main center is dim artwork, not a large dashboard heading. Footer has small technical text.
- Launch bar uses 9px 16px padding, 10px gaps; selector wrapper max-width 290px. Original dropdown is above launch controls (`bottom: calc(100% + 3px)`), max-height 230px, independently scrolling. Astrax deliberately uses a larger searchable panel with fixed filter controls.
- Reference CSS imports Rajdhani / Share Tech Mono remotely. Astrax uses stable local/system fallbacks (no remote imports, acknowledged typography gap).
- Tokens: #070707 / #0b0b0b / #101010 / #0d0d0d, #2a2a2a rules, #cc0000 accent, #ff2222 bright, #7a0000 dim; #ccc/#eee/#555 text. Astrax starts close with a slightly brighter accent and higher-contrast muted text.
- JS: upward version selection/search, selected label, launch-mode settings; Regular, About, Data URI, Blob and Popup. These are source-observed control paths, not proof the remote games run.
- Client/otherclients/download pages enumerate GX-specific distributions. **None was used as a game source**; Astrax groups only the 140 UserArham HTML paths, preserves exact filenames, and uses an uploaded-file action.
- Mods source opens EF_MODS / filesystem and fetches a separate collection. Shared code identifies EFI compatibility. No equivalent reviewed adapter/source was established for the target files, so no EF_MODS database was opened or changed.
- Skins source enumerates skins/*.png and renders a rotatable block model with arm/model controls. Those PNGs are absent from the target tree. Astrax only implements local texture preview/download; 3D UV/slim/legacy handling is unresolved.
- Servers source includes public cards/query logic and shared script client-option injection. Live endpoints/status were not queried; no permissioned backend/status provenance was established. Astrax implements personal bookmarks with explicit copy instead of inventing online cards.
- WISP source lazy-loads `wisp-bundle.js`, stores `wispcraft_wispurl`, default `wss://anura.pro/`, and injects encoded script. This is an observed string, **not an endpoint endorsement**. Astrax never contacts it.
- Reference news/release claims and visibility script were inspected, not imported. Astrax has its own actual release notes and no Discord link.

## Implemented and deliberately different

Shared shell/navigation, artwork-centered Game page, upward search/category picker, real favorites, persistent selection, compact launch bar/footer, ten themes (including tinted variants), settings scale/name/mode, browser file selection, pinned source details, byte/hash-verified downloads and explicit preparation, server manager and local skin texture workflow. Inline SVG navigation icons, optional scanlines/reduced-motion override. Original SVG replaces `https://gx-launcher.github.io/resources/fixed2.png`; the latter was **not redistributed** because no permission was established.

Astrax browser screenshots were actually captured at 1366×768, 1440×900, 1920×1080, 1024×768, 390×844 and 430×932; overflow/picker positioning assertions pass. Reference desktop screenshot comparison remains unavailable. All unresolved execution/integration/3D/mode gaps are detailed in VERIFICATION.md and README.md.
