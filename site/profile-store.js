/** Local-only profile repository. Metadata + PNG Blobs commit atomically in IndexedDB. */
export const PROFILE_LIMIT = 24;
export function cleanProfile(raw = {}, fallback = {}) {
  const text = (v, d) =>
    typeof v === "string" && v.trim() ? v.trim().slice(0, 32) : d;
  return {
    id: typeof raw.id === "string" ? raw.id : crypto.randomUUID(),
    name: text(raw.name, "Player"),
    username: text(raw.username, fallback.name || "Player"),
    buildId:
      typeof raw.buildId === "string" && raw.buildId !== "local"
        ? raw.buildId
        : null,
    mode: ["Blob", "Popup"].includes(raw.mode)
      ? raw.mode
      : fallback.mode || "Blob",
    model: raw.model === "slim" ? "slim" : "classic",
    preset: raw.preset === "slim" ? "slim" : "classic",
    overlay: raw.overlay !== false,
    animation: ["idle", "walking", "still"].includes(raw.animation)
      ? raw.animation
      : "idle",
    skin:
      raw.skin?.blob instanceof Blob && raw.skin.blob.size <= 2097152
        ? {
            blob: raw.skin.blob,
            name:
              typeof raw.skin.name === "string"
                ? raw.skin.name.slice(0, 128)
                : "skin.png",
            legacy: raw.skin.legacy === true,
          }
        : null,
    lastSelected:
      Number.isFinite(raw.lastSelected) && raw.lastSelected > 0
        ? raw.lastSelected
        : Date.now(),
  };
}
function openDB() {
  return new Promise((resolve, reject) => {
    let done = false,
      request;
    const timer = setTimeout(() => {
      done = true;
      reject(Error("Profile storage timed out."));
    }, 2500);
    try {
      request = indexedDB.open("astrax-profiles", 1);
    } catch (e) {
      clearTimeout(timer);
      reject(e);
      return;
    }
    request.onupgradeneeded = () => request.result.createObjectStore("state");
    request.onsuccess = () => {
      clearTimeout(timer);
      if (done) {
        request.result.close();
        return;
      }
      done = true;
      resolve(request.result);
    };
    request.onerror = () => {
      clearTimeout(timer);
      reject(request.error);
    };
    request.onblocked = () => {
      clearTimeout(timer);
      done = true;
      reject(Error("Close other launcher tabs to update profile storage."));
    };
  });
}
async function database(value) {
  const db = await openDB();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction("state", value ? "readwrite" : "readonly"),
        store = tx.objectStore("state");
      let result;
      const req = value ? store.put(value, "profiles") : store.get("profiles");
      req.onsuccess = () => {
        result = req.result;
      };
      const timer = setTimeout(() => {
        try {
          tx.abort();
        } catch {}
        reject(Error("Profile storage timed out."));
      }, 2500);
      tx.oncomplete = () => {
        clearTimeout(timer);
        resolve(result);
      };
      tx.onabort = tx.onerror = () => {
        clearTimeout(timer);
        reject(tx.error || Error("Profile storage unavailable."));
      };
    });
  } finally {
    db.close();
  }
}
export function createProfiles({ onWarning = () => {} } = {}) {
  let state,
    chain = Promise.resolve(),
    temporary = false;
  const listeners = new Set();
  const emit = () => listeners.forEach((f) => f(state));
  const save = () => {
    try {
      localStorage.setItem("astrax-profile-active", state.activeId);
    } catch {}
    emit();
    const snapshot = structuredClone(state);
    chain = chain
      .then(() => database(snapshot))
      .catch(() => {
        temporary = true;
        onWarning(
          "Profiles are session-only: browser storage is unavailable or full. Export custom skins before leaving.",
        );
      });
    return chain;
  };
  return {
    async load(prefs) {
      let value;
      try {
        value = await database();
      } catch {
        temporary = true;
        onWarning("Profile storage unavailable; using a session-only profile.");
      }
      const profiles = Array.isArray(value?.profiles)
        ? value.profiles
            .slice(0, PROFILE_LIMIT)
            .map((p) => cleanProfile(p, prefs))
        : [];
      const seen = new Set();
      state = {
        schema: 1,
        activeId: null,
        profiles: profiles.filter((p) => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        }),
      };
      if (!state.profiles.length)
        state.profiles = [
          cleanProfile(
            {
              name: prefs.name || "Player",
              username: prefs.name,
              buildId: prefs.selected,
              mode: prefs.mode,
            },
            prefs,
          ),
        ];
      let checkpoint,
        hasPrefs = false;
      try {
        checkpoint = localStorage.getItem("astrax-profile-active");
        hasPrefs = !!JSON.parse(localStorage.getItem("astrax-v1"));
      } catch {}
      const wanted = checkpoint || value?.activeId;
      state.activeId = state.profiles.some((p) => p.id === wanted)
        ? wanted
        : state.profiles[0].id;
      // Launcher preferences are a synchronous journal for name/build/mode changes.
      // Reconcile them before a reload can replace a just-selected build with an older IDB write.
      if (hasPrefs && (!checkpoint || checkpoint === state.activeId)) {
        const p = state.profiles.find((p) => p.id === state.activeId);
        Object.assign(p, {
          username: prefs.name,
          buildId: prefs.selected === "local" ? p.buildId : prefs.selected,
          mode: prefs.mode,
        });
      }
      if (!value && !temporary) await save();
      return state;
    },
    get state() {
      return state;
    },
    get temporary() {
      return temporary;
    },
    get active() {
      return state?.profiles.find((p) => p.id === state.activeId);
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    async create(fields) {
      if (state.profiles.length >= PROFILE_LIMIT)
        throw Error("24-profile limit reached.");
      const profile = cleanProfile({
        ...fields,
        id: crypto.randomUUID(),
        lastSelected: Date.now(),
      });
      state.profiles.push(profile);
      await save();
      return profile;
    },
    async update(id, fields) {
      const p = state.profiles.find((p) => p.id === id);
      if (!p) throw Error("This profile no longer exists.");
      Object.assign(p, cleanProfile({ ...p, ...fields, id: p.id }));
      await save();
      return p;
    },
    async activate(id) {
      const p = state.profiles.find((p) => p.id === id);
      if (!p) throw Error("This profile no longer exists.");
      state.activeId = id;
      p.lastSelected = Date.now();
      await save();
      return p;
    },
    async remove(id) {
      if (state.profiles.length <= 1)
        throw Error("Keep at least one local profile.");
      state.profiles = state.profiles.filter((p) => p.id !== id);
      if (state.activeId === id) {
        state.activeId = state.profiles[0].id;
        state.profiles[0].lastSelected = Date.now();
      }
      await save();
      return this.active;
    },
    sync(prefs) {
      const p = this.active;
      if (!p) return;
      const buildId =
        prefs.selected && prefs.selected !== "local" ? prefs.selected : null;
      if (
        p.username === prefs.name &&
        p.buildId === buildId &&
        p.mode === prefs.mode
      )
        return;
      Object.assign(p, {
        username: prefs.name || "Player",
        buildId,
        mode: prefs.mode,
      });
      void save();
    },
    flush() {
      return chain;
    },
  };
}
