import { chromium } from "playwright";
import { options } from "../tools/browser-runtime.mjs";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
const browser = await chromium.launch(await options()),
  context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
  }),
  page = await context.newPage(),
  checks = [],
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const pass = (t) => {
  checks.push(t);
  console.log("PASS", t);
};
const open = async () => {
  await page.locator("#profileSwitch").click();
  await page.locator(".profiles-page").waitFor();
};
const boot = async () => {
  await page.goto("http://localhost:8080");
  await page.locator("#startup").waitFor({ state: "detached" });
};
const settle = () =>
  page.evaluate(async () => {
    const db = await new Promise((r) => {
      const q = indexedDB.open("astrax-profiles", 1);
      q.onsuccess = () => r(q.result);
    });
    await new Promise((r) => {
      const t = db.transaction("state");
      t.objectStore("state").get("profiles");
      t.oncomplete = r;
    });
    db.close();
  });
try {
  const requests = [];
  page.on("request", (r) => requests.push(r.url()));
  await boot();
  assert(!requests.some((u) => u.includes("skinview3d-")));
  await open();
  await page.waitForFunction(
    () => document.querySelector(".character-canvas")?.dataset.frames > 0,
  );
  assert.match(await page.locator(".viewer-status").textContent(), /3D ready/);
  pass("renderer is lazy/local and renders genuine WebGL geometry");
  const canvas = page.locator(".character-canvas"),
    box = await canvas.boundingBox(),
    yaw = await canvas.getAttribute("data-yaw");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width / 2 + 90,
    box.y + box.height / 2 + 20,
    { steps: 8 },
  );
  await page.mouse.up();
  assert.notEqual(await canvas.getAttribute("data-yaw"), yaw);
  const distance = Number(await canvas.getAttribute("data-distance"));
  await page.mouse.wheel(0, -150);
  await page.waitForFunction(
    (d) =>
      Number(document.querySelector(".character-canvas").dataset.distance) !==
      d,
    distance,
  );
  await page.getByRole("button", { name: "Reset camera", exact: true }).click();
  pass("drag rotates actual camera; wheel zoom and camera reset work");
  await page
    .getByLabel("Character animation", { exact: true })
    .selectOption("walking");
  assert.equal(await canvas.getAttribute("data-running"), "true");
  await page.getByLabel("Outer skin layer", { exact: true }).uncheck();
  assert.equal(await canvas.getAttribute("data-overlay"), "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(
    () =>
      document.querySelector(".character-canvas").dataset.running === "false",
  );
  const before = await canvas.getAttribute("data-frames");
  await page.waitForTimeout(180);
  assert.equal(await canvas.getAttribute("data-frames"), before);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  pass(
    "walking/overlay controls work; reduced motion stops all continuous 3D frames",
  );
  await page
    .getByRole("button", { name: "+ New profile", exact: true })
    .click();
  await page.getByLabel("Profile name", { exact: true }).fill("Alex studio");
  await page
    .getByLabel("Minecraft username / display label", { exact: true })
    .fill("LocalAlex");
  const build = await page
    .getByLabel("Preferred build", { exact: true })
    .locator("option")
    .nth(1)
    .getAttribute("value");
  await page.getByLabel("Preferred build", { exact: true }).selectOption(build);
  await page
    .getByLabel("Preferred launch mode", { exact: true })
    .selectOption("Popup");
  await page
    .getByRole("button", { name: "Create profile", exact: true })
    .click();
  await page.locator("dialog").waitFor({ state: "detached" });
  assert.equal(await page.locator(".profile-card").count(), 2);
  assert.equal(await page.locator("#profileName").textContent(), "Alex studio");
  assert.equal(await page.locator("#modeBadge").textContent(), "POPUP");
  assert(await page.locator("#launch").isEnabled());
  pass(
    "native create dialog activates profile and applies real build/mode to launch dock",
  );
  await page.getByRole("button", { name: "Slim default", exact: true }).click();
  await page.waitForFunction(
    () => document.querySelector(".character-canvas").dataset.model === "slim",
  );
  await page
    .getByLabel("Import PNG skin", { exact: true })
    .setInputFiles("site/assets/skins/slim.png");
  await page.waitForFunction(() =>
    document
      .querySelector(".profile-skin-name")
      ?.textContent.includes("slim.png"),
  );
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page
      .getByRole("button", { name: "Download original PNG", exact: true })
      .click(),
  ]);
  assert.equal(download.suggestedFilename(), "slim.png");
  const path = await download.path();
  assert.deepEqual(
    await fs.readFile(path),
    await fs.readFile("site/assets/skins/slim.png"),
  );
  pass("slim geometry, custom PNG Blob import and byte-identical export");
  await settle();
  await page.reload();
  await page.locator("#startup").waitFor({ state: "detached" });
  assert.equal(await page.locator("#profileName").textContent(), "Alex studio");
  await open();
  await page.waitForFunction(
    () => document.querySelector(".character-canvas")?.dataset.model === "slim",
  );
  assert.match(
    await page.locator(".profile-skin-name").textContent(),
    /slim.png/,
  );
  assert.equal(await page.locator(".profile-card").count(), 2);
  pass(
    "active profile, imported PNG, model and profile build/mode survive reload",
  );
  await page
    .getByRole("button", { name: "Player", exact: false })
    .filter({ has: page.locator(".profile-card-info") })
    .click();
  await page.waitForFunction(
    () =>
      document.querySelector(".character-canvas").dataset.model === "classic",
  );
  assert.equal(await page.locator("#profileName").textContent(), "Player");
  assert.equal(await page.locator("#modeBadge").textContent(), "BLOB");
  assert(await page.locator("#launch").isDisabled());
  assert.equal(
    await page.getByLabel("Character animation", { exact: true }).inputValue(),
    "walking",
  );
  assert.equal(
    await page.getByLabel("Outer skin layer", { exact: true }).isChecked(),
    false,
  );
  pass(
    "profile selection isolates skin/model/build/mode and viewer preferences",
  );
  const legacy = await page.evaluate(() => {
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 32;
    c.getContext("2d").fillRect(0, 0, 64, 32);
    return c.toDataURL().split(",")[1];
  });
  await page
    .getByLabel("Import PNG skin", { exact: true })
    .setInputFiles({
      name: "legacy.png",
      mimeType: "image/png",
      buffer: Buffer.from(legacy, "base64"),
    });
  await page.waitForFunction(
    () => document.querySelector(".character-canvas").dataset.legacy === "true",
  );
  assert.equal(
    await page
      .getByLabel("Arm model", { exact: true })
      .locator("[value=slim]")
      .evaluate((n) => n.disabled),
    true,
  );
  await page
    .getByLabel("Import PNG skin", { exact: true })
    .setInputFiles({
      name: "bad.png",
      mimeType: "image/png",
      buffer: Buffer.from("not a png"),
    });
  await page.waitForFunction(() =>
    document.querySelector("#toast").textContent.includes("Not a PNG"),
  );
  assert.match(
    await page.locator(".profile-skin-name").textContent(),
    /legacy.png/,
  );
  const huge = Buffer.alloc(2097153);
  await page
    .getByLabel("Import PNG skin", { exact: true })
    .setInputFiles({ name: "huge.png", mimeType: "image/png", buffer: huge });
  await page.waitForFunction(() =>
    document.querySelector("#toast").textContent.includes("2 MiB"),
  );
  pass(
    "64×32 legacy conversion/classic enforcement, signature and 2 MiB rejection preserve previous skin",
  );
  await page.evaluate(() => {
    document.body.classList.add("is-preparing");
  });
  await page.waitForFunction(
    () =>
      document.querySelector(".character-canvas").dataset.running === "false",
  );
  await page.evaluate(() => {
    document.body.classList.remove("is-preparing");
    document.body.classList.add("game-session");
  });
  assert.equal(await canvas.getAttribute("data-running"), "false");
  await page.evaluate(() => {
    document.body.classList.remove("game-session");
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  assert.equal(await canvas.getAttribute("data-running"), "false");
  const hiddenFrames = await canvas.getAttribute("data-frames");
  await page.waitForTimeout(160);
  assert.equal(await canvas.getAttribute("data-frames"), hiddenFrames);
  await page.evaluate(() => {
    delete document.hidden;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  pass(
    "preparation, running-game and hidden-tab states stop scheduled character frames",
  );
  await page.getByRole("button", { name: "Edit profile", exact: true }).click();
  assert.equal(await canvas.getAttribute("data-running"), "false");
  await page.getByLabel("Profile name", { exact: true }).fill("Renamed local");
  await page.getByRole("button", { name: "Save profile", exact: true }).click();
  await page.locator("dialog").waitFor({ state: "detached" });
  assert.equal(
    await page.locator("#profileName").textContent(),
    "Renamed local",
  );
  await page
    .getByRole("button", { name: "Delete profile", exact: true })
    .click();
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".profile-card").count(), 2);
  await page
    .getByRole("button", { name: "Delete profile", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Delete permanently", exact: true })
    .click();
  assert.equal(await page.locator(".profile-card").count(), 1);
  assert.equal(await page.locator("#profileName").textContent(), "Alex studio");
  assert(
    await page
      .getByRole("button", { name: "Delete profile", exact: true })
      .isDisabled(),
  );
  pass(
    "edit, modal rendering pause, Escape/cancel and confirmed delete retain one profile and game data",
  );
  const a11y = await new AxeBuilder({ page }).analyze();
  assert.deepEqual(
    a11y.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
    [],
  );
  await page.getByRole("button", { name: "Edit profile", exact: true }).click();
  const dialogA11y = await new AxeBuilder({ page }).analyze();
  assert.deepEqual(
    dialogA11y.violations.map((v) => v.id),
    [],
  );
  await page.keyboard.press("Escape");
  pass("axe: character page and modal have no violations");
  for (const width of [390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator("#settingsNav").click();
    await page.getByLabel("UI scale", { exact: true }).selectOption("1.5");
    await open();
    await page
      .getByLabel("Import PNG skin", { exact: true })
      .scrollIntoViewIfNeeded();
    assert(
      await page.getByLabel("Import PNG skin", { exact: true }).isVisible(),
    );
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await page
      .getByRole("button", { name: "+ New profile", exact: true })
      .click();
    const rect = await page.locator("dialog").boundingBox();
    assert(
      rect.x >= 0 &&
        rect.x + rect.width <= width + 1 &&
        rect.y >= 0 &&
        rect.y + rect.height <= 901,
    );
    await page.keyboard.press("Escape");
  }
  pass(
    "phone/tablet/desktop at 150%: no horizontal overflow, imports and dialogs reachable",
  );
  await page
    .locator("#nav")
    .getByRole("button", { name: "Game", exact: true })
    .click();
  await page.locator(".profiles-page").waitFor({ state: "detached" });
  assert.equal(await page.locator(".character-canvas").count(), 0);
  pass("navigation disposes renderer and removes its canvas");
  const fallback = await browser.newContext(),
    fp = await fallback.newPage();
  await fp.route("**/vendor/skinview3d-3.4.2.js", (r) => r.abort());
  await fp.goto("http://localhost:8080");
  await fp.locator("#startup").waitFor({ state: "detached" });
  await fp.locator("#profileSwitch").click();
  await fp.locator("[data-graphics=unavailable]").waitFor();
  assert(await fp.getByLabel("Import PNG skin", { exact: true }).isEnabled());
  assert(
    await fp
      .getByRole("button", { name: "Download original PNG", exact: true })
      .isEnabled(),
  );
  await fallback.close();
  pass(
    "failed renderer load leaves honest graphics fallback and working skin/profile controls",
  );
  const denied = await browser.newContext();
  await denied.addInitScript(() => {
    Object.defineProperty(window, "indexedDB", {
      get() {
        throw new DOMException("Denied", "SecurityError");
      },
    });
  });
  const d = await denied.newPage();
  await d.goto("http://localhost:8080");
  await d.locator("#startup").waitFor({ state: "detached" });
  await d.locator("#profileSwitch").click();
  await d.locator(".profile-storage").waitFor({ state: "visible" });
  assert(
    await d
      .getByRole("button", { name: "+ New profile", exact: true })
      .isEnabled(),
  );
  await denied.close();
  pass(
    "denied IndexedDB has honest session-only warning and functional profile UI",
  );
  assert.deepEqual(errors, []);
  pass("no application page errors");
} finally {
  await fs.writeFile(
    "verification/profiles-results.json",
    JSON.stringify({ checks, errors }, null, 2),
  );
  await browser.close();
}
