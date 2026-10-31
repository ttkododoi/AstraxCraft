# Panorama background — AstraxCraft 2.3

## What ships (and what does not)

The default **Tiny Takeover Panorama** setting is a real, continuously rotating,
six-face panorama renderer. **Official Minecraft Tiny Takeover textures are NOT
bundled.** Until authorized faces are imported, it displays **Original Grove**:
an original, code-rendered block landscape with cherry-colored trees, pink ground
cover and small cuboid animals. It is not a Mojang screenshot, a promo poster,
a downloaded wallpaper or an image-generator output.

The fallback's geometry and 16-pixel surface patterns are generated from scratch
by `tools/render-grove.py`. Its seven images have an explicit permissive license
in `site/assets/panorama/LICENSE.txt` and SHA-256 provenance in `source.json`.
There are no third-party image inputs. Static Minecraft Scene uses a perspective
view of this same original grove; it is not the official title-screen image.

## Reference study and rights boundary

- Mojang's [Java Edition 26.1 release notes](https://www.minecraft.net/en-us/article/minecraft-java-edition-26-1)
  announce Tiny Takeover's baby-animal changes and a changed main-menu panorama.
- The actual 26.1 six-face asset set was inspected through the public
  [Minecraft assets index](https://github.com/InventivetalentDev/minecraft-assets/tree/1a751e5f4f158777313d1df6909f63a60c3964bf/assets/minecraft/textures/gui/title/background).
  Face 0 shows cherry trees, pink petals, grass and baby animals. Reference face
  Git blob: `a2d4773cb9923460ea8e018b6b7f522017af4f05`. Reference downloads are
  ignored development files, NOT included in the website, repository or ZIP.
- No redistribution license for those official images was established. A public
  asset mirror is not a license grant. No hotlinking or runtime third-party asset
  fetches substitute for permission.
- Six-face orientation, perspective and slow-yaw behavior were also studied in
  a [historical Java CubeMap implementation](https://github.com/mahtomedi/minecraft/blob/6facde2d8c924ebd1ec6902f13289880c2e6ab33/src/main/java/net/minecraft/client/renderer/CubeMap.java)
  and its adjacent PanoramaRenderer. This is a historical geometric reference,
  **not verified 26.1 renderer source**. No code from that implementation is
  bundled. AstraxCraft independently projects viewing rays onto six textures.

## Import authorized Tiny Takeover faces

1. Obtain six matching panorama PNGs from an asset set you own or are authorized
   to use. Owning Minecraft does not automatically grant redistribution rights.
2. Open **Launcher Settings → Import six panorama PNGs**.
3. Select all six files together, with their exact names:

   | File | Direction in this renderer |
   |---|---|
   | `panorama_0.png` | Forward / +Z |
   | `panorama_1.png` | Right / +X |
   | `panorama_2.png` | Back / −Z |
   | `panorama_3.png` | Left / −X |
   | `panorama_4.png` | Up / +Y |
   | `panorama_5.png` | Down / −Y |

   Minecraft's normal panorama ordering is supported; do not pre-flip images.
   A generic cubemap exporter may use different orientation and must be converted.
4. Each PNG must be square, all six equally sized: 256, 512, 768, 1024 or 2048 px.
   Limits: 8 MiB per file, 32 MiB total. Original 26.1 faces are 1024 px.
5. Choose **Tiny Takeover Panorama**. The asset-status line changes to **Imported
   panorama**. Import does not verify whether an image is official or licensed.

Files are decoded/validated before an atomic IndexedDB replacement. Failed
imports leave the old saved set intact. Nothing is uploaded. Imports persist
only in this browser/origin, subject to browser quota/private-mode policies;
they are not published to other visitors. **Remove imported panorama** deletes
this local set and restores Original Grove. It does not touch game saves.

For an authorized deployment-wide replacement, replace the six PNGs under
`site/assets/panorama/` in the same orientation, retaining an appropriate license
and updating provenance/hashes and the original-only asset test. Do not replace
those originals with Mojang assets without redistribution permission.

## Rendering and performance

- A single persistent full-screen WebGL 1 shader samples the six cubemap faces.
  Correct aspect-ratio perspective, 85° vertical field of view, 10° downward
  pitch; no mouse tracking, UV panning, stretched wallpaper or rotation reset on
  page navigation. Yaw is approximately 0.3°/second (one turn in 20 minutes).
  This is a deliberately calm adaptation, not a byte-for-byte renderer replica.
- Pixel textures use nearest filtering and clamp-to-edge. All original faces
  share the same camera/scene; tests check all twelve corresponding edges.
- One background pass; no depth buffer, antialias buffer, engine, animated blur,
  geometry rebuilding or particle loop. Subtle fixed purple shading and existing
  glass keep labels readable while the actual scene stays visible.
- Rendering is capped at 30 fps desktop / 24 fps below 700 CSS px. DPR is capped
  at 1.25 / 1 on mobile, framebuffer at 1600 × 1100 (preserving aspect), texture
  uploads at 1024 px per face. Higher-resolution imports are reduced for upload.
- No scheduled frames while hidden, background animation is disabled, reduced
  motion is requested, preparation is active or a launched game remains open.
  Time is frozen across pauses, so returning does not jump the camera forward.
  A separate token-scoped lifecycle signal covers manual/local game execution as
  well as automatic repository launches, without changing the execution consent.
- **Original Dusk Aurora**, **Static Minecraft Scene**, and **Background Off**
  apply immediately and persist in existing schema-3 preferences. Interface
  animation remains independent. Background Off on fresh load makes no cubemap
  requests and creates no WebGL context.
- Graphics/image failure shows the static original view or solid-color safety
  fallback. Startup, filtering, Play, validation and navigation never await the
  panorama. A lost graphics context falls back; restoration rebuilds it.

## Reproduce the original art (optional development only)

```sh
python -m venv .venv
.venv/bin/pip install numpy pillow
.venv/bin/python tools/render-grove.py
npm test
```

No Python packages, image generation, bundler or build step are needed to run the
website. The generated original images are checked in. Actual mobile GPUs,
Safari/iPad hardware, battery use and sustained frame-rate were not benchmarked.
The tests use Chromium software graphics; hidden-tab logic is additionally
checked with a simulated visibility change.
