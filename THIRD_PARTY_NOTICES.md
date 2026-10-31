# Credits and third-party boundaries

- **Astrax Launcher**, Astrax Interactive: original shell implementation, inline SVG icons, favicon, AstraxCraft mark and original CSS orbital/aurora artwork. The current animated aurora uses no downloaded video, copied online animation or extra third-party art dependency. No claim to Mojang/Microsoft affiliation. No GX landscape is used.
- **Real Minecraft scene — Xbox México**: *Minecraft Beta 1.8.1 Gameplay Screenshot*, source video [Xbox Masterclass](https://www.youtube.com/watch?v=T1Ua2SVUhYw&t=74s), licensed **CC BY 3.0** as documented on [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Minecraft_Beta_1.8.1_Gameplay_Screenshot.png). Local JPEG source copy and cropped/compressed WebP derivatives; mobile resized. Credit/license/source/change notice in `site/assets/minecraft/CREDITS.md`, hashes in `source.json`, visible Home/About credit. Not Tiny Takeover or a grant to redistribute game files. Official 26.1 panorama redistribution permission was not established; user imports remain local. Old procedural scenery is removed.
- **Design references**: Uiverse cssbuttons-io's MIT gradient button; root Uiverse MIT notice in `site/assets/licenses/Uiverse-MIT.txt`. 60fps Tactile Button / Dropdown Menu Morph public descriptions and partial code, Glass3D generator CSS, 21st.dev Limelight Nav preview/usage. Original pattern-level HTML/CSS/JS adaptations, not copied gated code, videos or site assets. Full URLs, access limits and implementation mapping in `DESIGN_RESEARCH.md`.
- **GX Launcher**, https://github.com/GX-Launcher/GX-Launcher.github.io : visual/behavioral reference, inspected revision `79f6397399a7578d291daecb516b328a58c3d9fb`, displayed v2.4.2. Its shell was read as data, not executed or bundled wholesale. No GX logos, game files, skins, WISP bundle or mod collection are shipped. `resources/fixed2.png` is the declared reference-image provenance, not a licensed Astrax asset.
- **UserArham/version**, https://github.com/UserArham/version : sole source for catalogued third-party game files. Pinned commit `3fda1220656f4d4d7b6c1fb53272cae52faf29b3`. Repository API reports license=null; no detected repository license, so no blanket redistribution right is asserted. Builds can contain third-party notices and restrictions; retain the exact originals and review them before redistribution. File names, source links, blob hashes and sizes are factual inventory data, not authorship/compatibility claims.
- **Minecraft / Eaglercraft / named clients**: names identify upstream entries only. Credits/permissions for embedded assets and client code remain with their respective authors. Game files are fetched only when explicitly requested; selection and mirroring never execute them.
- **Inter**, Rasmus Andersson / The Inter Project Authors, https://github.com/rsms/inter: locally bundled `InterVariable.woff2` under the **SIL Open Font License 1.1**. Full license in `site/assets/fonts/OFL.txt`; pinned upstream commit, Git blob identity and SHA-256 in `site/assets/fonts/source.json`. The font is served from the launcher origin, not a remote font service. System fonts remain fallbacks.
- Dev dependencies (not shipped as launcher runtime): Playwright/@playwright/test and @axe-core/playwright (Apache-2.0) and @sparticuz/chromium (MIT package wrapper; Chromium includes its own BSD-style and third-party notices). Install from the pinned package lock for tests; consult installed LICENSE files and Chromium notices for browser redistribution. Portable source does not include node_modules or browser binaries.

No additional license for third-party game code is granted by this repository. The absence of a bundled upstream license is a dependency to resolve before copying the full collection onto another public host.

## 2.5 local 3D profile studio

- **skinview3d 3.4.2**, Kent Rasmussen, Haowei Wen, Sean Boult and contributors,
  https://github.com/bs-community/skinview3d — MIT. Actual Minecraft skin geometry,
  model UVs, legacy conversion and animations. **skinview-utils 0.7.1** — MIT.
- **Three.js 0.156.1**, Three.js Authors, https://github.com/mrdoob/three.js — MIT;
  renderer and OrbitControls. These three are locally bundled runtime code, even
  though npm lists them as development inputs for the committed static bundle.
  All full licenses and extracted legal comments are in `site/vendor/`.
- **esbuild 0.25.12**, Evan Wallace — MIT, development bundler only; not runtime.
- **Original Astrax classic/slim PNGs**: independently scripted pixel textures,
  not Mojang Steve/Alex artwork. Permission in `site/assets/skins/LICENSE.txt`;
  source in `tools/default-skins.py`. No AI-generated model or skin pack.
- Profile-specific Uiverse/60fps/Glass3D/21st research and access restrictions are
  recorded in `DESIGN_RESEARCH.md`. Only licensed CSS/pattern adaptations and
  independent implementations are used; no gated source is redistributed.
