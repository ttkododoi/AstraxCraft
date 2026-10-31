# Real Minecraft background and local panoramas — AstraxCraft 2.4

## Default: real gameplay, not a generated stand-in

**Minecraft Overworld** displays the real *Minecraft Beta 1.8.1 Gameplay
Screenshot* by **Xbox México**, licensed **CC BY 3.0** on the reviewed
[Wikimedia Commons file page](https://commons.wikimedia.org/wiki/File:Minecraft_Beta_1.8.1_Gameplay_Screenshot.png).
The source is the official Xbox México channel's CC-licensed video, not an
uncredited wallpaper. Creator/license/source/crop notes are visible on Home,
under Sources/About, and in `site/assets/minecraft/CREDITS.md` / `source.json`.

This depiction's CC license permits sharing/adaptation with credit, license
link and disclosure of changes. It is not a license for other Minecraft art,
trademarks, or software and does not mean this launcher is endorsed.

The source JPEG copy is **960×509**, obtained through the pinned GitHub mirror
in `source.json`. The full Commons image is 1494×791. No 1080p source was obtained
and no upscaling is presented as extra detail. WebP derivatives crop version/HUD
text and compress: **960×406**, approximately 45 KiB, and **640×271** mobile,
approximately 22 KiB. Original JPEG is retained for provenance. No generative
fill, painted scenery, AI image generation or synthetic upscaling.

**Not Tiny Takeover:** no baby-animal or official 26.1 panorama is claimed.
Redistribution permission for that exact cubemap was not established. The old
procedural grove, public faces, original SVG landscape and generator are removed,
not relabeled as real Minecraft. A higher-resolution authorized screenshot or
six-face set can replace the current licensed depiction after rights review.
See [DESIGN_RESEARCH.md](DESIGN_RESEARCH.md) for research and rejected sources.

## Settings and movement

- **Minecraft Overworld** (default): real screenshot with a very subtle 60-second
  alternate camera drift, using only CSS transforms. No GPU canvas or render loop.
- **Original Dusk Aurora**: retains the original purple animated alternative.
- **Static Minecraft Scene**: same real screenshot, without camera motion.
- **Background Off**: plain Dusk surface, no scene or panorama rendering.
- **Imported Panorama**: your authorized six PNGs, genuine cubemap projection;
  otherwise the same licensed screenshot fallback, never generated scenery.

Changes apply immediately and persist in existing schema-3 preferences. Old
`Tiny Takeover Panorama` preferences migrate to Imported Panorama, preserving any
local faces. New/default profiles select Minecraft Overworld. No bookmarks,
favorites, launch modes or selected builds are reset.

The photograph uses aspect-preserving `background-size:cover`; portrait displays
crop the scene rather than stretching blocks. A fixed purple gradient balances
text contrast with scenery. Only panels blur the backdrop; the scene itself is
not blurred. The lower-resolution source limits large-screen sharpness.

All ambient motion pauses for hidden tabs, disabled Animated background, reduced
motion, game preparation and running game windows. Interface animation is a
separate preference. Pauses freeze camera time instead of catching up on return.
A token-scoped lifecycle signal covers automatic and explicit local/manual
launches without changing execution consent or treating navigation as readiness.

## Import authorized six-face panoramas

1. Obtain six matching images you own or are authorized to use. Owning Minecraft
   does not automatically grant redistribution permission.
2. In **Launcher Settings → Import six panorama PNGs**, select all six files:

   | File | Direction |
   |---|---|
   | `panorama_0.png` | +Z / forward |
   | `panorama_1.png` | +X / right |
   | `panorama_2.png` | −Z / back |
   | `panorama_3.png` | −X / left |
   | `panorama_4.png` | +Y / up |
   | `panorama_5.png` | −Y / down |

   Normal Minecraft panorama ordering is supported; do not pre-flip the images.
   Generic cubemap exporters may need orientation conversion.
3. Equal square sizes only: 256, 512, 768, 1024 or 2048 px; 8 MiB per face,
   32 MiB total. Decoding succeeds before atomic IndexedDB replacement.
4. Select **Imported Panorama**. The asset-status line identifies local imports,
   not official/authenticated textures. The app cannot verify image licensing.

Nothing is uploaded. Imports persist only in this browser/origin, subject to
private-mode/quota policies, and are not published to other visitors. Invalid
replacement leaves the saved set intact. **Remove imported panorama** restores
the licensed screenshot and does not touch game saves.

The existing import renderer is dependency-free WebGL 1: six-face ray projection,
85° vertical FOV, 10° downward pitch, ~0.3°/second yaw, nearest pixel sampling,
no mouse camera or page-navigation resets. It is an adaptation, not a binary
replica of the current Minecraft renderer. 30 fps desktop / 24 fps under 700px;
DPR capped 1.25 / 1; framebuffer bounded by 1600×1100 with aspect preserved;
texture upload capped at 1024px per face. No depth/antialias buffer, geometry
rebuild, particle loop or animated blur. Graphics loss falls back to the real
screenshot and restoration rebuilds the imported set. App startup never waits
for imagery. If the local photograph fails too, a solid-color safety backing
keeps controls readable; it is not represented as Minecraft scenery.

## Evidence boundaries

`npm run test:panorama` covers the actual default photograph plus imports,
settings, pause behavior, context loss/recovery, responsive coverage, real Quick
Play execution and functional menu actions. Tests use explicitly synthetic
solid-color faces to exercise the importer; **they are test fixtures only**, not
public game imagery. No fake gameplay or procedural panorama ships.

No claim of physical Safari/iPad testing, battery benchmarks, sustained GPU frame
rates or 60/120 FPS on every device. Hidden-tab logic includes simulated
visibility changes. Full game collection hosting/redistribution remains separate
and unresolved; the image license does not change those boundaries.
