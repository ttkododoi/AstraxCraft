# Featured games hosted on GitHub Pages — 2.6

The repository administrator confirmed redistribution permission in this session
on 1 November 2026. That confirmation is recorded here; it is not an independent
legal audit or a new license for third-party code. UserArham/version still declares
no repository-wide license. Preserve all notices in the original game documents.

## Actual eight-file subset

All files come only from UserArham/version commit
`3fda1220656f4d4d7b6c1fb53272cae52faf29b3`:

- `Eaglercraft 1.8.8 .html` (including its original filename spaces)
- `Eaglercraft-1.12.html`
- `Eaglercraft-1.5.2.html`
- `Eaglercraft-4k-JS.html`
- `Aero Client JS.html`
- `PixelClient 1.8.8 JS.html`
- `Koneclient-1.8.8.html`
- `Precision.html`

This is the eight-build shortlist proposed to and approved by the administrator,
not an independently measured popularity ranking. The remaining 132 HTML catalog
entries remain available from pinned upstream; they are not silently removed or
misrepresented as hosted here. No invented builds or alternate game sources.

Original total: **156,831,960 bytes**. Hosted gzip total: **89,119,740 bytes**.
Exact per-file sizes, original Git blob hashes and compressed SHA-256 values are
in `site/featured-games.json`. Each compressed file is below 24 MB. The full
2,877,361,421-byte upstream inventory is NOT copied into Pages.

GitHub's current published Pages limit is 1 GB, with a recommended 1 GB source
repository, soft 100 GB/month bandwidth limit and possible rate limiting:
https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
The subset plus launcher/panorama is comfortably below the size limits. This does
not promise unlimited bandwidth or availability. No Git LFS pointers or releases
with CORS-dependent fetches are used.

## Serving and integrity

Files in `site/games/COMMIT/` are deterministic `.html.gz` transport archives of
**unchanged original HTML**. This keeps the repo and network transfer smaller.
`site/hosting.json` has the exact eight-path allowlist, pinned revision, relative
same-origin base URL and `compression: "gzip"`. Unlisted files resolve to upstream,
not to nonexistent local paths. The version picker/dock labels local files
**Hosted here**.

The existing transfer path fetches the gzip stream, decompresses with the browser's
`DecompressionStream`, bounds decoded byte counts, checks exact original length
and Git blob SHA-1, then produces the original HTML Blob. No script patching,
identity injection, proxy injection, recompression of downloaded HTML, or automatic
execution on selection. Play still creates its runner synchronously; local imports
and preparation-only preferences retain explicit execution consent. Save HTML
exports the original filename and bytes, not the `.gz` container.

During gzip transfer, progress counts **decoded original HTML bytes**, not wire
bytes or fabricated game readiness. This is labeled in the launcher and runner.
Browsers without `DecompressionStream` receive an explicit unsupported-browser
error; no fake success or unbounded decompression fallback. This is not an offline
cache/service worker or a promise that all eight games boot on every device.

## Reproduce

Download each exact file with the existing bounded mirror tool:

```sh
python tools/mirror.py --file 'Eaglercraft 1.8.8 .html' --transport api
# Repeat --file for the other seven exact names listed above.
python tools/prepare-featured.py --confirm-redistribution-rights
npm test
npm run test:featured
```

The staging helper verifies the mirror's original size/blob hash, uses streaming
compression with fixed mtime/no embedded filename, checks decompressed bytes again,
and atomically replaces each archive. It never executes games. The source ZIP
explicitly excludes `site/games/` archives: obtain game bytes separately with the
mirror tools and appropriate authorization. The ZIP receives an explicit null-host configuration so it still runs immediately
using upstream rather than requesting excluded local archives. Staging regenerates
the production subset configuration. The deployed Pages artifact includes all eight archives. Ordinary temporary `.html` game-test fixtures stay ignored;
only pinned `.html.gz` artifacts are allowed into Git.

## Verification boundaries

Node tests round-trip all eight committed archives to pinned originals and check
manifest/routing, corrupt/oversized gzip rejection and hash mismatches. Browser
checks fetch, decompress and hash-verify **all eight** over actual local HTTP with
upstream blocked. Real 4K HTML is then executed through the same-origin Play flow;
Save HTML is byte-identical to the original. Preparing the other seven does not
prove their engines boot; gameplay, mobile memory and all-client boot compatibility
are not claimed. Existing upstream network/error/cancel tests remain upstream
fixture tests via an explicit null-host configuration; new subset tests exercise
the production host configuration separately.
