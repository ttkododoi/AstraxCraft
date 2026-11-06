import test from "node:test";
import assert from "node:assert/strict";
import {
  cleanProfile,
  createProfiles,
  PROFILE_LIMIT,
} from "../site/profile-store.js";
test("profile validation limits metadata and preserves PNG Blobs without data URLs", () => {
  const blob = new Blob(["png"], { type: "image/png" }),
    p = cleanProfile({
      name: "x".repeat(100),
      username: " Local ",
      mode: "OAuth",
      model: "slim",
      preset: "other",
      skin: { blob, name: "skin.png", legacy: true },
      animation: "not-animation",
      overlay: false,
    });
  assert.equal(p.name.length, 32);
  assert.equal(p.username, "Local");
  assert.equal(p.mode, "Blob");
  assert.equal(p.preset, "classic");
  assert.equal(p.skin.blob, blob);
  assert.equal(p.animation, "idle");
  assert.equal(p.overlay, false);
  assert.equal(
    cleanProfile({ skin: { blob: new Blob([new Uint8Array(2097153)]) } }).skin,
    null,
  );
  assert.equal(cleanProfile({ buildId: "local" }).buildId, null);
});
test("denied database remains honest and functional, with bounds and active deletion safety", async () => {
  const warnings = [],
    r = createProfiles({ onWarning: (s) => warnings.push(s) });
  await r.load({ name: "Existing player", selected: "build", mode: "Popup" });
  assert.equal(r.active.username, "Existing player");
  assert.equal(r.active.buildId, "build");
  assert.equal(r.active.mode, "Popup");
  assert(r.temporary);
  const first = r.active.id;
  let events = 0;
  const unsub = r.subscribe(() => events++);
  const second = await r.create({
    name: "Second",
    buildId: "another",
    mode: "Blob",
  });
  await r.activate(second.id);
  r.sync({ name: "Renamed", selected: "updated", mode: "Popup" });
  await r.flush();
  assert.equal(r.active.username, "Renamed");
  assert.equal(r.active.buildId, "updated");
  assert.equal(r.state.profiles.find((p) => p.id === first).buildId, "build");
  await r.remove(second.id);
  assert.equal(r.active.id, first);
  await assert.rejects(r.remove(first), /at least one/);
  await assert.rejects(r.update("missing", {}), /no longer exists/);
  assert(events > 0);
  unsub();
  for (let i = 1; i < PROFILE_LIMIT; i++)
    await r.create({ name: "Player " + i });
  await assert.rejects(r.create({ name: "Overflow" }), /limit/);
  assert.equal(r.state.profiles.length, 24);
  assert(warnings.some((s) => s.includes("session-only")));
});
