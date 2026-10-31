# AstraxCraft 2.4 — inspected references and implementation audit

Inspected 31 October 2026. These are concrete public pages actually retrieved,
not a claim that proprietary source or every embedded animation was accessible.
No paid account, videos, logos, screenshots or textures from these design sites
are included in the launcher. All implementation remains buildless HTML/CSS/JS.

| Resource / inspected example | Publicly accessible material | Adaptation in this release |
|---|---|---|
| [Uiverse — cssbuttons-io, wonderful-baboon-62](https://uiverse.io/cssbuttons-io/wonderful-baboon-62) | Full HTML/CSS, MIT label: gradient outer surface, nested dark face, press scaling, hover color reveal | `style.css`: Play's two-layer gradient edge, restrained hover sheen and tactile depth. Reduced compression from the example's .9 to the existing .978/.982; preserved keyboard focus and disabled controls. No copied component DOM or `transition:all`. Credit retained, Uiverse MIT notice in `site/assets/licenses/`. |
| [60fps — Tactile Button Interaction](https://60fps.design/snippets/tactile-button-interaction) | Interaction description and partial SwiftUI code. Dark lower key edge disappears on press; release restores it. Remaining source gated behind PRO. | `style.css`: a short downstroke collapses the Play key's lower shadow; soft spring-inspired CSS `linear()` release with a cubic-bezier fallback, using the existing single pointer/keyboard press controller. No iOS haptics claimed. |
| [60fps — Dropdown Menu Expand Morph](https://60fps.design/snippets/dropdown-menu-expand-morph-interaction) | Description and partial SwiftUI: same surface expands, children stage in, cancellable transition state, reduced-motion handling; full code gated | `motion.js`: picker origin now follows the real version trigger geometry. Existing serialized open/close and capped child staging retained; no artificial action delay or blocking overlay. This is a restrained adaptation, not an exact shape-morph clone. |
| [Glass3D generator](https://glass3d.dev/) | Controls and generated CSS: blur/brightness/saturation, translucent tint, progressively larger outer shadows, directional inset highlights, noninteractive edge layers | `style.css`: original multi-scale shadow stack, violet transmission and thin inner light edges on card/sidebar/dock; backdrop filtering only on glass, never on scenery. No copied background/texture, animated blur or remote texture dependency. Original CSS, not wholesale generator output. |
| [21st.dev — Limelight Nav by Hossain Jahed](https://21st.dev/@jahed/components/limelight-nav) (linked through EaseMize) | Component preview, behavior description and React usage example. Actual component implementation requires a free account. | `style.css` adds a restrained edge-light beam to the existing single FLIP indicator; `motion.js` adds one reusable focus/hover tooltip for real menu actions. No gated code, React, Tailwind or Lucide dependency copied. Pattern-level original implementation; no claim of access to gated source. |

The 60fps pages returned media controls/descriptions and partial code. Full video
playback/frame-by-frame motion was **not** verified through the retrieval tool.
The 21st preview image/description and usage were available; its component source
was not. Glass3D's generator CSS and Uiverse's example CSS were directly readable.

## Real Minecraft asset research

- Reviewed [Mojang Usage Guidelines](https://www.minecraft.net/en-us/usage-guidelines),
  including screenshots, essential rules and non-endorsement. These are not a
  blanket redistribution license for official title-screen texture files.
- Official 26.1 Tiny Takeover art remained unlicensed for this repository; no
  official panorama has been bundled or hotlinked. Authorized local import stays.
- Search found `Un paysage de Minecraft.png` with an indexed CC BY-SA result, but
  the [actual Commons page](https://commons.wikimedia.org/wiki/File:Un_paysage_de_Minecraft.png)
  records deletion for copyright violation on 13 August 2026. **Rejected**; the
  stale search summary was not treated as a license.
- Selected [Minecraft Beta 1.8.1 Gameplay Screenshot](https://commons.wikimedia.org/wiki/File:Minecraft_Beta_1.8.1_Gameplay_Screenshot.png):
  live file page explicitly identifies Xbox México, CC BY 3.0, the source video,
  and the rightsholder release. Reviewed both the license and file history/
  non-free-Xbox-work explanation. This permission applies to this depiction,
  not arbitrary Minecraft artwork or game files.
- Locally stored source JPEG was retrieved through the pinned GitHub mirror
  recorded in `site/assets/minecraft/source.json`; compared visually with the
  documented scene. 960×509 source copy, 960×406 cropped WebP and 640px mobile
  derivative. No generated scenery or AI upscaling. All changes credited.
- The old procedural grove, its public assets and generator were removed, not
  quietly relabeled as Minecraft. The default is real game photography, not a
  generated cubemap. No suitable licensed Tiny Takeover/baby-animal set or 1080p
  source was obtained. This limitation is explicit in UI/help and final report.

## Functional boundaries

Quick Play calls the existing synchronous launch function, retaining the same
popup/verification/consent paths. Multiplayer opens actual personal WebSocket
bookmarks, not a fabricated server browser or automated game connection. Skins
opens the existing PNG preview tool, not a claimed in-game installer. Versions
opens the actual 140-entry picker; Settings opens existing controls. No new
placeholder actions, live counts, gameplay preview or simulated readiness.

The snapshot research does not certify legal compliance of the game collection,
physical-device performance, native haptics, or 60/120 FPS on every device.

## 2.5 profile studio research and actual application

All four were revisited for the profile task, not just the earlier homepage work:

- **Uiverse** — https://uiverse.io/cssbuttons-io/wonderful-baboon-62 : public full
  gradient-frame/inner-surface CSS, MIT. Restrained highlighted primary buttons,
  pressed feedback, touch targets and explicit keyboard focus adapt that pattern;
  existing Uiverse-derived launch controls remain. License already shipped.
- **60fps** — https://60fps.design/snippets/selection-to-illustration-animation :
  public selection feedback description and partial SwiftUI snippet inspected;
  remaining 128 lines are PRO-gated. Adapted selected-card/character state linkage,
  restrained transitions and modal entry. No inaccessible code/video copied; full
  playback/frame-by-frame inspection is not claimed. All work remains tied to real
  state, without invented loading delays or reduced-motion overrides.
- **Glass3D** — https://glass3d.dev/ : generator CSS inspected again: directional
  inset light, tint, blur and layered shadows adapted for the studio and dialogs.
  No external generator example art/noise/fish assets are bundled. Original CSS
  uses existing Dusk theme tokens and preserves the real screenshot backdrop.
- **21st.dev** — https://21st.dev/@jahed/components/spotlight-card : public preview,
  description and usage inspected. Full implementation requires a free account;
  not copied. Independently implemented CSS-variable pointer spotlight, responsive
  selected profile cards, native dialog UI and focus restoration. No React,
  Tailwind, inaccessible component source or paid template is introduced.

The 3D model itself is licensed skinview3d geometry, not artwork borrowed from
these design sites and not an AI model. See `PROFILES.md` and runtime licenses.
The earlier statement that Skins is only a 2D tool is superseded by release 2.5.
