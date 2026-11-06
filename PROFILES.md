# Local player profiles and 3D skins — 2.5

Open **Skins**, or the sidebar **local profile / switch** button. Create up to 24
profiles, name them, set a Minecraft username/display label, and choose a catalog
build and Blob/Popup launch mode. Cards show the actual skin's pixel portrait,
current selection and saved build. Edit/delete dialogs support keyboard, Escape,
validation and explicit destructive confirmation. The final profile cannot be
deleted. The active profile displays its last-selected local date/time.

## Real 3D, not a mock-up

The established MIT-licensed [skinview3d](https://github.com/bs-community/skinview3d)
3.4.2 renderer, skinview-utils 0.7.1 and Three.js 0.156.1 are bundled locally.
Geometry and UVs come from this library, **not an AI-generated character model**.
Drag the character to rotate, wheel or pinch to zoom, or focus the canvas and use
arrow keys / plus / minus. There are touch-friendly zoom buttons, camera reset,
Idle/Walk/Still, classic four-pixel or slim three-pixel arms and an outer-layer
switch. Texture min/mag filtering is nearest-neighbor; the adapter renders the
actual scene directly, without FXAA softening the pixels.

The two defaults are **original Astrax pixel textures**, described as Steve/classic
and Alex/slim *proportions*, not official Mojang Steve/Alex artwork. They are drawn
by the explicit, reproducible `tools/default-skins.py`; permission in
`site/assets/skins/LICENSE.txt`. No unlicensed default skin pack is redistributed.

Import PNG files up to 2 MiB, 64×64 or legacy 64×32. Signature and dimensions are
checked before decoding and decoded dimensions are checked again. Legacy imports
use the library's real legacy conversion and are locked to classic arms. Invalid
imports leave the previous skin intact. The original imported PNG bytes can be
exported, without re-encoding. Switching defaults explicitly confirms replacement
of an imported skin. Existing launcher preferences migrate into the first profile.
The previous 2D preview had no persistent PNG storage to migrate.

## Persistence and boundaries

- IndexedDB database `astrax-profiles`, store `state`, key `profiles`: atomic
  schema-1 snapshot including metadata and individual PNG Blobs; writes are queued.
- `astrax-v1` keeps the existing global preference schema. A small
  `astrax-profile-active` localStorage checkpoint and synchronous preferences
  reconcile an immediate reload before a pending IndexedDB metadata write finishes.
- Profile-specific: name, display label, build, supported launch mode, skin, model,
  default choice, animation, outer layer and last selection. Theme, scale,
  background, bookmarks, favorites and launcher consent settings remain global.
- PNG decode captures its destination profile ID, so switching profiles while an
  import is pending cannot attach it to another profile. Deleted targets fail.
- Storage denial, quota errors or a blocked database produce an honest session-only
  warning, not a claim that changes were saved. Save operations may take time;
  don't close the tab during an import or a saving dialog. Browser site-data
  clearing/private browsing can remove profiles. Export important custom PNGs.
- Reset launcher preferences does not delete profiles or their PNGs; it resets the
  active profile's launcher-facing name/build/mode along with global preferences.
- Profile selection uses the real catalog selection and existing Play pipeline.
  Unknown saved builds cannot launch or silently substitute a different game.
  Local HTML imports remain session-only, never auto-execute on selection, and
  are not persisted as catalog builds. Utilities stay download-only.
- **No Microsoft/Mojang authentication, ownership check, account verification,
  remote upload or automatic username/skin injection.** Import the exported PNG
  inside a compatible game. Profiles do not isolate games' databases/worlds;
  deleting a profile never removes game worlds.
- Launcher Blob games inherit hosting-origin storage access; profiles are not an
  origin-security boundary. Use a dedicated launcher origin and trusted imports.
- No cross-device synchronization or cross-tab conflict resolution is claimed;
  for concurrent editing in multiple tabs the last completed write wins.

## Lifecycle and performance

The 524 KB ESM renderer is lazy-loaded only when opening Skins, never a runtime CDN.
Exactly one WebGL skin context is used; all cards use tiny 2D pixel portraits.
Pixel ratio is capped at 1.5; active animation updates are capped at 30 Hz rather
than promising 60 FPS on all devices. The adapter cancels rendering off-screen,
in hidden tabs, during game preparation/execution, while a modal covers it, and
for Still/interface Off/device reduced motion. Drag/zoom still renders on demand
under reduced motion. There is no elapsed-time jump after a pause. Page exit
removes observers/listeners, cancels frames and disposes Three resources and the
viewer. Imported PNG object URLs are revoked. Graphics/context failures retain
profile controls and original texture preview/download.

## Reproduce and test

The site still serves directly without a build step. To rebuild the committed
renderer from the pinned development dependencies:

```sh
npm ci
npm run vendor:skins
# optional texture regeneration, requires Pillow:
python tools/default-skins.py
python -m http.server 8080 --bind 0.0.0.0 --directory site
# in another terminal:
npm test
npm run test:profiles
```

Full license texts for the three runtime libraries accompany the vendor file in
`site/vendor/`. Esbuild is only a development bundler (MIT). The bundled name-tag
API is unused: no external Minecraft font/default skin asset is requested.
See `verification/profiles-results.json` and `VERIFICATION.md` for actual checks.
Touch/pinch is supplied by OrbitControls; physical iPad/Safari testing, full game
compatibility and measured physical-device frame rates are not asserted.
