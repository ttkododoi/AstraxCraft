/** Lazy, visibility-aware adapter around locally bundled skinview3d. */
export async function validateSkin(file) {
  if (file.size > 2097152) throw Error("Skin exceeds 2 MiB ceiling.");
  const bytes = new Uint8Array(await file.slice(0, 24).arrayBuffer());
  if (
    bytes.length < 24 ||
    bytes.slice(0, 8).join() !== "137,80,78,71,13,10,26,10"
  )
    throw Error("Not a PNG file.");
  const header = new DataView(bytes.buffer),
    w = header.getUint32(16),
    h = header.getUint32(20);
  if (w !== 64 || ![32, 64].includes(h))
    throw Error("Skin must be 64×32 or 64×64 pixels.");
  const image = await createImageBitmap(file);
  try {
    if (image.width !== 64 || ![32, 64].includes(image.height))
      throw Error("Skin must be 64×32 or 64×64 pixels.");
  } finally {
    image.close();
  }
  return { blob: file, name: file.name, legacy: h === 32 };
}
export async function skinImage(profile) {
  const url = profile.skin
    ? URL.createObjectURL(profile.skin.blob)
    : `assets/skins/${profile.preset || "classic"}.png`;
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return image;
  } finally {
    if (profile.skin) URL.revokeObjectURL(url);
  }
}
export async function thumbnail(profile) {
  const im = await skinImage(profile),
    c = document.createElement("canvas");
  c.width = 32;
  c.height = 40;
  const x = c.getContext("2d");
  x.imageSmoothingEnabled = false;
  const arm = profile.model === "slim" ? 3 : 4;
  const part = (sx, sy, w, h, dx, dy) =>
    x.drawImage(im, sx, sy, w, h, dx, dy, w, h);
  part(8, 8, 8, 8, 12, 2);
  part(40, 8, 8, 8, 12, 2);
  part(20, 20, 8, 12, 12, 10);
  part(44, 20, arm, 12, 12 - arm, 10);
  part(im.height === 64 ? 36 : 44, im.height === 64 ? 52 : 20, arm, 12, 20, 10);
  part(4, 20, 4, 12, 12, 22);
  part(im.height === 64 ? 20 : 4, im.height === 64 ? 52 : 20, 4, 12, 16, 22);
  if (im.height === 64) {
    part(20, 36, 8, 12, 12, 10);
    part(44, 36, arm, 12, 12 - arm, 10);
    part(52, 52, arm, 12, 20, 10);
  }
  return c.toDataURL();
}
export function mountSkinViewer(stage, report = () => {}) {
  let viewer,
    library,
    disposed = false,
    visible = false,
    frame = 0,
    last = 0,
    animation = "idle",
    overlay = true,
    loadSerial = 0,
    latest,
    ready = false,
    contextLost = false;
  let drawn = 0;
  const canvas = document.createElement("canvas");
  canvas.className = "character-canvas";
  canvas.tabIndex = 0;
  canvas.setAttribute(
    "aria-label",
    "3D character. Drag to rotate. Scroll or pinch to zoom. Arrow keys rotate; plus and minus zoom.",
  );
  stage.append(canvas);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const permitted = () =>
    !disposed &&
    visible &&
    !document.hidden &&
    !document.body.matches(".is-preparing,.game-session") &&
    !document.querySelector("dialog[open]") &&
    !stage.closest("[inert]") &&
    stage.isConnected &&
    !contextLost;
  const moving = () =>
    permitted() &&
    ready &&
    animation !== "still" &&
    !reduced.matches &&
    document.documentElement.dataset.motion !== "off";
  function render() {
    if (!viewer || !ready || !permitted()) return;
    viewer.renderer.render(viewer.scene, viewer.camera);
    canvas.dataset.frames = String(++drawn);
    canvas.dataset.yaw = String(viewer.camera.position.x);
    canvas.dataset.distance = String(viewer.camera.position.length());
  }
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    canvas.dataset.running = "false";
  }
  function tick(now) {
    frame = 0;
    if (!moving()) {
      stop();
      return;
    }
    if (!last || now - last >= 1000 / 30) {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      viewer.animation?.update(viewer.playerObject, dt);
      viewer.controls.update();
      render();
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (viewer) viewer.controls.enabled = permitted();
    if (moving()) {
      canvas.dataset.running = "true";
      if (!frame) frame = requestAnimationFrame(tick);
    } else stop();
  }
  function resize() {
    if (!viewer || disposed || !visible) return;
    const box = stage.getBoundingClientRect();
    viewer.setSize(
      Math.max(1, Math.min(720, box.width)),
      Math.max(1, Math.min(520, box.height)),
    );
    render();
  }
  function setAnimation(value) {
    if (viewer && animation === value && viewer.animation) return;
    animation = value;
    if (viewer) {
      viewer.animation =
        value === "walking"
          ? new library.WalkingAnimation()
          : value === "idle"
            ? new library.IdleAnimation()
            : null;
      if (viewer.animation) viewer.animation.speed = 0.75;
      render();
      sync();
    }
  }
  function reset() {
    if (!viewer) return;
    viewer.zoom = 0.9;
    viewer.resetCameraPose();
    viewer.camera.position.x = 18;
    viewer.camera.lookAt(0, 0, 0);
    viewer.controls.target.set(0, 0, 0);
    viewer.controls.update();
    render();
  }
  async function init() {
    try {
      library = await import("./vendor/skinview3d-3.4.2.js");
      if (disposed) return;
      viewer = new library.SkinViewer({
        canvas,
        width: 420,
        height: 400,
        pixelRatio: Math.min(devicePixelRatio || 1, 1.5),
        renderPaused: true,
        enableControls: true,
      });
      viewer.controls.enableDamping = false;
      viewer.controls.minDistance = 30;
      viewer.controls.maxDistance = 110;
      viewer.globalLight.intensity = 2;
      viewer.cameraLight.intensity = 0.6;
      viewer.controls.addEventListener("change", render);
      setAnimation(animation);
      reset();
      resize();
      if (latest) await setSkin(latest);
      report("3D ready · drag to rotate, pinch or scroll to zoom.");
      sync();
    } catch {
      stage.dataset.graphics = "unavailable";
      canvas.hidden = true;
      report(
        "3D graphics unavailable. Skin import, export and the pixel preview still work.",
      );
    }
  }
  async function setSkin(profile) {
    latest = profile;
    const token = ++loadSerial;
    if (!viewer) return;
    try {
      const image = await skinImage(profile);
      if (disposed || token !== loadSerial) return;
      viewer.loadSkin(image, {
        model: profile.model === "slim" ? "slim" : "default",
      });
      viewer.playerObject.skin.setOuterLayerVisible(overlay);
      ready = true;
      canvas.dataset.model = profile.model;
      canvas.dataset.legacy = String(profile.skin?.legacy === true);
      render();
      sync();
    } catch {
      report(
        "Could not display this skin. Choose another PNG; your profile is preserved.",
      );
    }
  }
  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible) {
        resize();
        render();
      }
      sync();
    },
    { root: document.querySelector("#content"), threshold: 0.05 },
  );
  io.observe(stage);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  const observer = new MutationObserver(() => {
    sync();
  });
  observer.observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "open", "inert"],
    childList: true,
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-motion"],
  });
  const visibility = () => {
    sync();
    if (permitted()) render();
  };
  document.addEventListener("visibilitychange", visibility);
  reduced.addEventListener("change", visibility);
  canvas.addEventListener("keydown", (e) => {
    if (!viewer || !permitted()) return;
    const angle = { ArrowLeft: 0.2, ArrowRight: -0.2 }[e.key];
    if (angle) {
      e.preventDefault();
      viewer.camera.position.applyAxisAngle({ x: 0, y: 1, z: 0 }, angle);
      viewer.controls.update();
      render();
    } else if (["+", "=", "-"].includes(e.key)) {
      e.preventDefault();
      viewer.camera.position.multiplyScalar(e.key === "-" ? 1.1 : 0.9);
      viewer.camera.position.clampLength(30, 110);
      viewer.controls.update();
      render();
    }
  });
  canvas.addEventListener("webglcontextlost", () => {
    contextLost = true;
    stop();
    report(
      "3D context lost. Reopen Skins to retry; your PNG and profiles are preserved.",
    );
  });
  canvas.addEventListener("webglcontextrestored", () => {
    contextLost = false;
    resize();
    render();
    sync();
    report("3D graphics restored.");
  });
  void init();
  return {
    setSkin,
    setAnimation,
    setOverlay(value) {
      overlay = value;
      if (viewer) {
        viewer.playerObject.skin.setOuterLayerVisible(value);
        render();
      }
      canvas.dataset.overlay = String(value);
    },
    reset,
    zoom(factor) {
      if (viewer) {
        viewer.camera.position.multiplyScalar(factor).clampLength(30, 110);
        viewer.controls.update();
        render();
      }
    },
    dispose() {
      disposed = true;
      ++loadSerial;
      stop();
      io.disconnect();
      resizeObserver.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", visibility);
      if (viewer) {
        viewer.scene.traverse((o) => {
          o.geometry?.dispose();
          for (const m of Array.isArray(o.material)
            ? o.material
            : o.material
              ? [o.material]
              : [])
            m.dispose();
        });
        viewer.composer.dispose();
        viewer.dispose();
      }
      canvas.remove();
    },
  };
}
