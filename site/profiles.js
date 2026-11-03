import {
  validateSkin,
  thumbnail,
  mountSkinViewer,
} from "./skin-view.js?v=craft-28";
const node = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};
const button = (text, fn, cls = "") => {
  const b = node("button", cls, text);
  b.type = "button";
  b.onclick = fn;
  return b;
};
function labeled(text, input) {
  if (!input.hasAttribute("aria-label")) input.setAttribute("aria-label", text);
  const label = node("label", "profile-field");
  label.append(node("span", "", text), input);
  return label;
}
export function createProfilePage({
  root,
  repo,
  entries,
  onActivate,
  toast,
  saveBlob,
}) {
  let textureURL = null;
  let disposed = false,
    revision = 0,
    lastSkin = [],
    dialog;
  const page = node("div", "page profiles-page");
  page.append(
    node("div", "eyebrow", "ASTRAX / LOCAL IDENTITY"),
    node("h1", "", "Your character. Your space."),
    node(
      "p",
      "profile-intro",
      "Local profiles, a real 3D character, and a little room to make it yours. Nothing is uploaded.",
    ),
  );
  const layout = node("div", "profiles-layout"),
    workspace = node("section", "character-workspace"),
    stage = node("div", "character-stage"),
    caption = node("p", "viewer-status", "Loading local 3D renderer…");
  caption.setAttribute("role", "status");
  const title = node("h2", "character-name");
  workspace.append(title, stage, caption);
  const controls = node("div", "viewer-controls");
  const motion = node("select");
  motion.setAttribute("aria-label", "Character animation");
  for (const [v, t] of [
    ["idle", "Idle"],
    ["walking", "Walk"],
    ["still", "Still"],
  ]) {
    const o = node("option", "", t);
    o.value = v;
    motion.append(o);
  }
  const overlay = node("input");
  overlay.type = "checkbox";
  overlay.checked = true;
  overlay.setAttribute("aria-label", "Outer skin layer");
  const outer = node("label", "overlay-toggle");
  outer.append(overlay, node("span", "", "Outer layer"));
  controls.append(
    labeled("Animation", motion),
    outer,
    button("Reset camera", () => viewer.reset()),
    button("−", () => viewer.zoom(1.1), "zoom-button"),
    button("+", () => viewer.zoom(0.9), "zoom-button"),
  );
  controls
    .querySelectorAll(".zoom-button")[0]
    .setAttribute("aria-label", "Zoom out");
  controls
    .querySelectorAll(".zoom-button")[1]
    .setAttribute("aria-label", "Zoom in");
  workspace.append(
    controls,
    node(
      "small",
      "viewer-hint",
      "Drag 360° · scroll / pinch to zoom · arrow keys to rotate. Motion preferences pause idle and walk.",
    ),
  );
  const panel = node("section", "profile-panel"),
    panelHead = node("div", "profile-panel-head"),
    list = node("div", "profile-cards");
  list.setAttribute("aria-label", "Local profiles");
  panelHead.append(
    node("h2", "", "Your profiles"),
    button("+ New profile", () => edit(), "profile-primary"),
  );
  panel.append(panelHead, list);
  const selected = node("section", "profile-details"),
    identity = node("p", "profile-identity"),
    lastSelected = node("small", "profile-last-selected"),
    actions = node("div", "profile-actions");
  actions.append(
    button("Edit profile", () => edit(repo.active)),
    button("Delete profile", () => remove(), "profile-delete"),
  );
  selected.append(identity, lastSelected, actions);
  const model = node("select");
  model.setAttribute("aria-label", "Arm model");
  for (const [v, t] of [
    ["classic", "Steve / Classic · 4-pixel arms"],
    ["slim", "Alex / Slim · 3-pixel arms"],
  ]) {
    const o = node("option", "", t);
    o.value = v;
    model.append(o);
  }
  selected.append(labeled("Character proportions", model));
  const defaults = node("div", "profile-presets");
  defaults.append(
    button("Classic default", () => preset("classic")),
    button("Slim default", () => preset("slim")),
  );
  selected.append(
    defaults,
    node(
      "small",
      "profile-license",
      "Original Astrax textures; Steve / Alex describe proportions, not official Mojang artwork.",
    ),
  );
  const input = node("input");
  input.type = "file";
  input.accept = "image/png";
  input.setAttribute("aria-label", "Import PNG skin");
  selected.append(
    labeled("Import a skin · PNG, 64×64 or legacy 64×32, up to 2 MiB", input),
  );
  const skinName = node("p", "profile-skin-name"),
    texture = node("img", "texture profile-texture");
  texture.alt = "Current skin texture, nearest-neighbor preview";
  const download = button("Download original PNG", async () => {
    const p = repo.active;
    try {
      if (p.skin) saveBlob(p.skin.blob, p.skin.name);
      else {
        const r = await fetch(`assets/skins/${p.preset}.png`);
        if (!r.ok) throw Error("Default skin unavailable.");
        saveBlob(await r.blob(), `astrax-${p.preset}.png`);
      }
    } catch (e) {
      toast(e.message);
    }
  });
  selected.append(skinName, texture, download);
  const warning = node("p", "notice profile-storage");
  warning.hidden = !repo.temporary;
  warning.textContent =
    "Session-only: profile storage is unavailable or full. Export custom skins before leaving.";
  page.append(warning);
  panel.append(selected);
  layout.append(workspace, panel);
  page.append(
    layout,
    node(
      "p",
      "notice",
      "Launcher-local identity only. No Microsoft / Mojang sign-in, ownership or online verification. These names and skins are not injected into games; import the PNG inside a compatible game. Build and Blob / Popup choices control this launcher only. Profiles do not isolate game saves, worlds or browser databases.",
    ),
  );
  root.replaceChildren(page);
  const viewer = mountSkinViewer(stage, (text) => {
    if (!disposed) caption.textContent = text;
  });
  motion.onchange = () => {
    void repo
      .update(repo.active.id, { animation: motion.value })
      .catch((e) => toast(e.message));
  };
  overlay.onchange = () => {
    void repo
      .update(repo.active.id, { overlay: overlay.checked })
      .catch((e) => toast(e.message));
  };
  async function preset(which) {
    const p = repo.active;
    if (
      p.skin &&
      !confirm(
        "Replace this profile’s imported skin with the original Astrax default? Download the PNG first if needed.",
      )
    )
      return;
    try {
      await repo.update(p.id, { preset: which, model: which, skin: null });
    } catch (e) {
      toast(e.message);
    }
  }
  model.onchange = () => {
    void repo
      .update(repo.active.id, { model: model.value })
      .catch((e) => toast(e.message));
  };
  input.onchange = async () => {
    const file = input.files[0],
      id = repo.active.id,
      name = repo.active.name;
    input.value = "";
    if (!file) return;
    input.disabled = true;
    try {
      const skin = await validateSkin(file);
      if (!repo.state.profiles.some((p) => p.id === id))
        throw Error("The original profile was deleted; skin was not saved.");
      const patch = { skin };
      if (skin.legacy) patch.model = "classic";
      await repo.update(id, patch);
      toast(
        `Skin saved to ${name}${skin.legacy ? " · legacy uses classic arms" : ""}.`,
      );
    } catch (e) {
      toast("Skin import: " + e.message);
    } finally {
      if (!disposed) input.disabled = false;
    }
  };
  function refresh() {
    if (disposed) return;
    const p = repo.active,
      token = ++revision,
      focusId = document.activeElement?.closest(".profile-card")?.dataset.id;
    warning.hidden = !repo.temporary;
    motion.value = p.animation;
    overlay.checked = p.overlay;
    viewer.setAnimation(p.animation);
    viewer.setOverlay(p.overlay);
    title.textContent = p.name;
    identity.textContent = `${p.username} · ${p.mode} launch`;
    lastSelected.textContent =
      "Last selected " + new Date(p.lastSelected).toLocaleString();
    model.value = p.model;
    model.querySelector("option[value=slim]").disabled =
      p.skin?.legacy === true;
    skinName.textContent = p.skin
      ? `${p.skin.name} · ${p.skin.legacy ? "64×32 legacy · classic only" : "64×64 modern"}`
      : "Original Astrax " + p.preset + " default · 64×64";
    actions.querySelector(".profile-delete").disabled =
      repo.state.profiles.length === 1;
    panelHead.querySelector("button").disabled =
      repo.state.profiles.length >= 24;
    const key = [p.id, p.skin?.blob, p.model, p.preset];
    if (key.some((v, i) => lastSkin[i] !== v)) {
      lastSkin = key;
      void viewer.setSkin(p);
      const url = p.skin
        ? URL.createObjectURL(p.skin.blob)
        : `assets/skins/${p.preset}.png`;
      if (textureURL) URL.revokeObjectURL(textureURL);
      textureURL = p.skin ? url : null;
      texture.onload = texture.onerror = () => {
        if (textureURL === url) { URL.revokeObjectURL(url); textureURL = null; }
      };
      texture.src = url;
    }
    list.replaceChildren();
    for (const profile of repo.state.profiles) {
      const active = profile.id === p.id,
        b = button(
          "",
          () => {
            void repo.activate(profile.id).catch((e) => toast(e.message));
            onActivate(repo.active);
          },
          "profile-card" + (active ? " is-current" : ""),
        );
      b.onpointermove = (e) => {
        if (
          e.pointerType === "mouse" &&
          document.documentElement.dataset.motion !== "off"
        ) {
          const r = b.getBoundingClientRect();
          b.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
          b.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
        }
      };
      b.dataset.id = profile.id;
      b.setAttribute("aria-pressed", String(active));
      b.setAttribute(
        "aria-label",
        `${profile.name}${active ? " · current profile" : ""}`,
      );
      const portrait = node("img", "profile-portrait");
      portrait.alt = "";
      const info = node("span", "profile-card-info"),
        build = entries.find((e) => e.id === profile.buildId);
      info.append(
        node("strong", "", profile.name),
        node("small", "", profile.username),
        node(
          "small",
          "",
          profile.buildId
            ? build?.label || "Saved build unavailable"
            : "No build selected",
        ),
      );
      b.append(
        portrait,
        info,
        node("span", "profile-current", active ? "Current" : "Select"),
      );
      list.append(b);
      void thumbnail(profile)
        .then((url) => {
          if (!disposed && token === revision) portrait.src = url;
        })
        .catch(() => {
          portrait.alt = "Preview unavailable";
        });
    }
    if (focusId)
      list
        .querySelector(`[data-id="${CSS.escape(focusId)}"]`)
        ?.focus({ preventScroll: true });
  }
  function closeDialog() {
    dialog?.close();
    dialog?.remove();
    dialog = null;
  }
  function baseDialog(titleText) {
    closeDialog();
    const d = node("dialog", "profile-dialog");
    dialog = d;
    d.setAttribute("aria-labelledby", "profileDialogTitle");
    d.append(node("h2", "", titleText));
    d.firstChild.id = "profileDialogTitle";
    d.addEventListener("close", () => {
      d.remove();
      if (dialog === d) dialog = null;
    });
    d.addEventListener("click", (e) => {
      if (e.target === d) {
        const r = d.getBoundingClientRect();
        if (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
          d.close();
      }
    });
    document.body.append(d);
    return d;
  }
  function edit(profile) {
    const d = baseDialog(
        profile ? "Edit local profile" : "Create local profile",
      ),
      form = node("form", "profile-form");
    const name = node("input"),
      username = node("input"),
      build = node("select"),
      mode = node("select");
    for (const [input, label, value] of [
      [name, "Profile name", profile?.name || ""],
      [
        username,
        "Minecraft username / display label",
        profile?.username || repo.active.username,
      ],
    ]) {
      input.value = value;
      input.required = true;
      input.maxLength = 32;
      form.append(labeled(label, input));
    }
    const none = node("option", "", "Choose a build later");
    none.value = "";
    build.append(none);
    if (profile?.buildId && !entries.some((e) => e.id === profile.buildId)) {
      const missing = node("option", "", "Saved build unavailable");
      missing.value = profile.buildId;
      build.append(missing);
    }
    for (const e of entries.filter((e) => !e.utility || e.id === profile?.buildId)) {
      const o = node("option", "", e.label);
      o.value = e.id;
      build.append(o);
    }
    build.value = profile?.buildId || "";
    for (const v of ["Blob", "Popup"]) mode.append(node("option", "", v));
    mode.value = profile?.mode || repo.active.mode;
    form.append(
      labeled("Preferred build", build),
      labeled("Preferred launch mode", mode),
      node(
        "small",
        "",
        "A local display label, not an authenticated Minecraft account.",
      ),
    );
    const error = node("p", "profile-form-error");
    error.setAttribute("role", "alert");
    form.append(error);
    const row = node("div", "profile-actions"),
      cancel = button("Cancel", () => d.close()),
      submit = node(
        "button",
        "profile-primary",
        profile ? "Save profile" : "Create profile",
      );
    submit.type = "submit";
    row.append(cancel, submit);
    form.append(row);
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (!name.value.trim() || !username.value.trim()) {
        error.textContent = "Enter a profile name and display label.";
        return;
      }
      submit.disabled = true;
      cancel.disabled = true;
      try {
        const fields = {
          name: name.value.trim(),
          username: username.value.trim(),
          buildId: build.value || null,
          mode: mode.value,
        };
        let p;
        if (profile) {
          const pending = repo.update(profile.id, fields);
          if (repo.active.id === profile.id) onActivate(repo.active);
          await pending;
        } else {
          p = await repo.create(fields);
          const pending = repo.activate(p.id);
          onActivate(repo.active);
          await pending;
        }
        d.close();
      } catch (e) {
        error.textContent = e.message;
        submit.disabled = false;
        cancel.disabled = false;
      }
    };
    d.append(form);
    d.showModal();
    name.focus();
  }
  function remove() {
    const p = repo.active,
      d = baseDialog("Delete " + p.name + "?");
    d.append(
      node(
        "p",
        "",
        "Delete this local profile and its saved PNG? This cannot be undone. Game saves and other profiles are not touched.",
      ),
    );
    const row = node("div", "profile-actions");
    row.append(
      button("Keep profile", () => d.close()),
      button(
        "Delete permanently",
        () => {
          try {
            const pending = repo.remove(p.id);
            onActivate(repo.active);
            void pending.catch((e) => toast(e.message));
            d.close();
          } catch (e) {
            toast(e.message);
          }
        },
        "profile-delete",
      ),
    );
    d.append(row);
    d.showModal();
  }
  const unsubscribe = repo.subscribe(refresh);
  refresh();
  return () => {
    disposed = true;
    unsubscribe();
    closeDialog();
    viewer.dispose();
    if (textureURL) URL.revokeObjectURL(textureURL);
  };
}
