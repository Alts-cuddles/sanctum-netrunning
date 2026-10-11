// CP RED - Netarch Mapper
// Paste the whole file into the Foundry script box. Empty that box first.
// DONE 2026-10-09e: module build. Does not open until asked.
// Window title must read: Netarch Mapper ORTHO
/* ===================== 01 CONFIG ===================== */
const SETTING_KEY = "cyberpunk-netarchs";
const POSITION_KEY = "cyberpunk-netarch-positions";
const AVATAR_KEY = "cyberpunk-netarch-avatars";
const SOCKET_EVENT = "system.cyberpunk-red-core";
const MODULE_SOCKET = "module.sanctum-netrunning";
function emitBoth(type, data) {
  game.socket.emit(SOCKET_EVENT, { type, data });
  game.socket.emit(MODULE_SOCKET, { type, data });
}
const NETARCH_BG = "systems/cyberpunk-red-core/tiles/netarch/S0L-BlankNetMap-VTT.webm";
const TILE_VIDEOS = {
  "Black ICE": "systems/cyberpunk-red-core/tiles/netarch/WebM/BlackIce.webm",
  "Control Node": "systems/cyberpunk-red-core/tiles/netarch/WebM/ControlNode.webm",
  Demon: "systems/cyberpunk-red-core/tiles/netarch/WebM/Demon.webm",
  File: "systems/cyberpunk-red-core/tiles/netarch/WebM/File.webm",
  Password: "systems/cyberpunk-red-core/tiles/netarch/WebM/Password.webm",
  Root: "systems/cyberpunk-red-core/tiles/netarch/WebM/Root.webm",
  "Short Distance Link": "systems/cyberpunk-red-core/tiles/netarch/WebM/ControlNode.webm",
  "Long Distance Link": "systems/cyberpunk-red-core/tiles/netarch/WebM/ControlNode.webm"
};
const NODE_TYPES = ["Lobby", "Password", "Black ICE", "Control Node", "File", "Root", "Demon", "Short Distance Link", "Long Distance Link"];
const NODE_COLORS = {
  "Lobby":        { bg: "#1a2a1a", border: "#39ff14", text: "#39ff14" },
  "Password":     { bg: "#2a2a0a", border: "#ffff00", text: "#ffff00" },
  "Black ICE":    { bg: "#2a0a0a", border: "#ff073a", text: "#ff073a" },
  "Control Node": { bg: "#0a1a2a", border: "#42d3ea", text: "#42d3ea" },
  "File":         { bg: "#0a2a1a", border: "#39ff14", text: "#39ff14" },
  "Root":         { bg: "#2a0a2a", border: "#ff00ff", text: "#ff00ff" },
  "Demon":        { bg: "#2a1018", border: "#ff6600", text: "#ff6600" },
  "Short Distance Link": { bg: "#102030", border: "#7dff8a", text: "#7dff8a" },
  "Long Distance Link":  { bg: "#201030", border: "#c080ff", text: "#c080ff" },
  "Unknown":      { bg: "#111",    border: "#444",    text: "#888" }
};
const USER_COLORS = ["#ff073a","#42d3ea","#39ff14","#ff00ff","#ffff00","#ff6600","#00ffff","#ff69b4"];
const NODE_W = 240, NODE_H = 200, GRID = 20;
const TOKEN_PX = 48;
const FLOOR_GAP_Y = 64;
const FLOOR_GAP_X = 72;
const isGM = () => !!game.user?.isGM;
function viewUserId(app) {
  return isGM() && app?._previewUserId ? app._previewUserId : game.user.id;
}
function showArchHp(app) {
  return isGM() && !app?._previewUserId;
}

/* ===================== 02 CATALOG BLACK ICE ===================== */
const ICE_PACK_ID = "world.black-ice";
const ICE_ACTOR_PACK_ID = "world.b14ck-1c3";
const BLACK_ICE = {
  Asp:        { name: "Asp",        kind: "ice", cls: "Anti-Personnel",  per: 4, spd: 6, atk: 2, def: 2, rez: 15, cost: 100,  dmgStd: "1d6", dmgIce: "",   packId: "eGtqlmQAxM7G06TG", effect: "Destroys a single Program installed on the enemy Netrunner's Cyberdeck at random." },
  Giant:      { name: "Giant",      kind: "ice", cls: "Anti-Personnel",  per: 2, spd: 2, atk: 8, def: 4, rez: 25, cost: 1000, dmgStd: "3d6", dmgIce: "",   packId: "NjkeaDfMpXu4zqdE", effect: "3d6 brain. Forcibly and unsafely Jacked Out." },
  Hellhound:  { name: "Hellhound",  kind: "ice", cls: "Anti-Personnel",  per: 6, spd: 6, atk: 6, def: 2, rez: 20, cost: 500,  dmgStd: "2d6", dmgIce: "",   packId: "wFjQwuPO3IvSdjXU", effect: "2d6 brain. Cyberdeck and clothing catch fire unless insulated." },
  Killer:     { name: "Killer",     kind: "ice", cls: "Anti-Program",    per: 4, spd: 8, atk: 6, def: 2, rez: 20, cost: 500,  dmgStd: "1d6", dmgIce: "4d6", packId: "t8DBKxIoWF5mIypS", effect: "4d6 to a Program. Enough to Derezz instead Destroys it." },
  Kraken:     { name: "Kraken",     kind: "ice", cls: "Anti-Personnel",  per: 6, spd: 2, atk: 8, def: 4, rez: 30, cost: 1000, dmgStd: "3d6", dmgIce: "",   packId: "3PGjBP3mePhQG0Sz", effect: "3d6 brain. Cannot go deeper or safely Jack Out until end of next Turn." },
  Liche:      { name: "Liche",      kind: "ice", cls: "Anti-Personnel",  per: 8, spd: 2, atk: 6, def: 2, rez: 25, cost: 500,  dmgStd: "1d6", dmgIce: "",   packId: "49a3YCjXQXADzGsj", effect: "INT, REF, and DEX each -1d6 for 1 hour (min 1)." },
  Raven:      { name: "Raven",      kind: "ice", cls: "Anti-Personnel",  per: 6, spd: 4, atk: 4, def: 2, rez: 15, cost: 50,   dmgStd: "1d6", dmgIce: "",   packId: "oExmifKXSxJlMdI7", effect: "Derezzes one Rezzed Defender at random, then 1d6 brain." },
  Sabertooth: { name: "Sabertooth", kind: "ice", cls: "Anti-Program",    per: 8, spd: 6, atk: 6, def: 2, rez: 25, cost: 1000, dmgStd: "1d6", dmgIce: "6d6", packId: "kqvge2tXtgNRNaxr", effect: "6d6 to a Program. Enough to Derezz instead Destroys it." },
  Scorpion:   { name: "Scorpion",   kind: "ice", cls: "Anti-Personnel",  per: 2, spd: 6, atk: 2, def: 2, rez: 15, cost: 100,  dmgStd: "1d6", dmgIce: "",   packId: "T3tGzizEzmg6DGw0", effect: "MOVE -1d6 for 1 hour (min 1)." },
  Skunk:      { name: "Skunk",      kind: "ice", cls: "Anti-Personnel",  per: 2, spd: 4, atk: 4, def: 2, rez: 10, cost: 500,  dmgStd: "1d6", dmgIce: "",   packId: "akETgj2EbIVgEsvv", effect: "Slide Checks -2 until this ICE is Derezzed. Stacks." },
  Wisp:       { name: "Wisp",       kind: "ice", cls: "Anti-Personnel",  per: 4, spd: 4, atk: 4, def: 2, rez: 15, cost: 50,   dmgStd: "1d6", dmgIce: "",   packId: "fNpUViGHtpinkGO8", effect: "1d6 brain. Next Turn NET Actions -1 (min 2)." },
  Dragon:     { name: "Dragon",     kind: "ice", cls: "Anti-Program",    per: 6, spd: 4, atk: 6, def: 6, rez: 30, cost: 1000, dmgStd: "1d6", dmgIce: "6d6", packId: "yMdBcgnO3AJA5Qfh", effect: "6d6 to a Program. Enough to Derezz instead Destroys it." }
};

/* ===================== 03 CATALOG DEMONS ===================== */
const DEMONS = {
  Imp:    { name: "Imp",    kind: "demon", cls: "Demon", per: 3, spd: 10, atk: 3, def: 3, rez: 15, iface: 3, netActions: 2, combat: 14, cost: 1000,  dmgStd: "1d6", packId: "7EXIzlezIuvDwfzl", effect: "Interface 3. Can Zap. Combat Number 14." },
  Efreet: { name: "Efreet", kind: "demon", cls: "Demon", per: 4, spd: 10, atk: 4, def: 4, rez: 25, iface: 4, netActions: 3, combat: 14, cost: 5000,  dmgStd: "1d6", packId: "Wko4aZLrQ2UZ5Smb", effect: "Interface 4. Three NET Actions. Combat Number 14." },
  Balron: { name: "Balron", kind: "demon", cls: "Demon", per: 7, spd: 10, atk: 7, def: 7, rez: 30, iface: 7, netActions: 4, combat: 14, cost: 10000, dmgStd: "1d6", packId: "v2g5O0cAPIIWVyOC", effect: "Interface 7. Four NET Actions. Combat Number 14." }
};

/* ===================== 04 GENERATOR TABLES ===================== */
const FEATURE_COST = { 6: 500, 8: 1000, 10: 5000, 12: 10000 };
const LOBBY_TABLE = {
  1: ["File:6"],
  2: ["Password:6"],
  3: ["Password:8"],
  4: ["Skunk"],
  5: ["Wisp"],
  6: ["Killer"]
};
const BODY_TABLE = {
  3:  { Basic: ["Hellhound"],              Standard: ["Hellhound","Hellhound"],     Uncommon: ["Kraken"],                 Advanced: ["Hellhound","Hellhound","Hellhound"] },
  4:  { Basic: ["Sabertooth"],             Standard: ["Hellhound","Killer"],        Uncommon: ["Hellhound","Scorpion"],   Advanced: ["Asp","Asp"] },
  5:  { Basic: ["Raven","Raven"],          Standard: ["Skunk","Skunk"],             Uncommon: ["Hellhound","Killer"],     Advanced: ["Hellhound","Liche"] },
  6:  { Basic: ["Hellhound"],              Standard: ["Sabertooth"],                Uncommon: ["Raven","Raven"],          Advanced: ["Wisp","Wisp","Wisp"] },
  7:  { Basic: ["Wisp"],                   Standard: ["Scorpion"],                  Uncommon: ["Sabertooth"],             Advanced: ["Hellhound","Sabertooth"] },
  8:  { Basic: ["Raven"],                  Standard: ["Hellhound"],                 Uncommon: ["Hellhound"],              Advanced: ["Kraken"] },
  9:  { Basic: ["Password:6"],             Standard: ["Password:8"],                Uncommon: ["Password:10"],            Advanced: ["Password:12"] },
  10: { Basic: ["File:6"],                 Standard: ["File:8"],                    Uncommon: ["File:10"],                Advanced: ["File:12"] },
  11: { Basic: ["Control:6"],              Standard: ["Control:8"],                 Uncommon: ["Control:10"],             Advanced: ["Control:12"] },
  12: { Basic: ["Password:6"],             Standard: ["Password:8"],                Uncommon: ["Password:10"],            Advanced: ["Password:12"] },
  13: { Basic: ["Skunk"],                  Standard: ["Asp"],                       Uncommon: ["Killer"],                 Advanced: ["Giant"] },
  14: { Basic: ["Asp"],                    Standard: ["Scorpion"],                  Uncommon: ["Liche"],                  Advanced: ["Dragon"] },
  15: { Basic: ["Killer"],                 Standard: ["Killer","Skunk"],            Uncommon: ["Asp"],                    Advanced: ["Killer","Scorpion"] },
  16: { Basic: ["Wisp","Wisp","Wisp"],     Standard: ["Liche"],                     Uncommon: ["Asp","Raven"],            Advanced: ["Dragon"] },
  17: { Basic: ["Liche"],                  Standard: ["Raven","Raven","Raven"],     Uncommon: ["Dragon","Wisp"],          Advanced: ["Giant"] },
  18: { Basic: ["Liche","Raven"],          Standard: ["Giant"],                     Uncommon: ["Kraken"],                 Advanced: ["Dragon","Dragon"] }
};

/* ===================== 05 SOCKET AND WINDOW HELPERS ===================== */
function emitNetarch(type, data) { emitBoth(type, data); }
function findMapperApp() { return Object.values(ui.windows).find(w => w.id === "netarch-mapper") || null; }
function refreshOpenMapper({ full = false } = {}) {
  const app = findMapperApp();
  if (!app) return;
  app._drawMap?.();
  if (full) app._refreshLive?.();
}
function startLiveSync() {
  if (game._netarchLive) clearInterval(game._netarchLive);
  game._netarchLive = setInterval(async () => {
    if (!findMapperApp()) return;
    try {
      const arch = game.settings.get("world", SETTING_KEY);
      const pos = game.settings.get("world", POSITION_KEY);
      const archChanged = JSON.stringify(arch || {}) !== JSON.stringify(game.bfNetarchs || {});
      const posChanged = JSON.stringify(pos || {}) !== JSON.stringify(game.bfNetarchPos || {});
      if (archChanged) game.bfNetarchs = arch || {};
      if (posChanged) game.bfNetarchPos = pos || {};
      if (archChanged || posChanged) refreshOpenMapper({ full: true });
    } catch (err) {}
  }, 2000);
}
/* ===================== 06 DICE AND CATALOG HELPERS ===================== */
function randomId() { return Math.random().toString(36).slice(2, 10); }
function rollDie(sides) { return Math.floor(Math.random() * sides) + 1; }
function roll3d6() { return rollDie(6) + rollDie(6) + rollDie(6); }
function catalogEntry(name) { return BLACK_ICE[name] || DEMONS[name] || null; }
function iceInstance(name) {
  const src = catalogEntry(name);
  if (!src) return { name, atk: 0, def: 0, hp: 10, per: 0, spd: 0, cost: 0, kind: "ice" };
  return {
    name: src.name, atk: src.atk || 0, def: src.def || 0, hp: src.rez || 10,
    per: src.per || 0, spd: src.spd || 0, cost: src.cost || 0,
    kind: src.kind, cls: src.cls || "Demon", packId: src.packId || "",
    dmgStd: src.dmgStd || "", dmgIce: src.dmgIce || "", effect: src.effect || "",
    img: src.img || "", uid: randomId()
  };
}
function stripHtml(html) { return String(html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }
function iceTypeLabel(t) {
  if (t === "antiprogram") return "Anti-Program";
  if (t === "antipersonnel") return "Anti-Personnel";
  if (t === "other") return "Demon";
  return t || "Black ICE";
}
function isWorldBlackIceProgram(i) {
  return !!i && i.type === "program" && String(i.system?.class || "").toLowerCase() === "blackice";
}
function applyProgramItem(d) {
  if (!d) return;
  const s = d.system || {};
  const kind = /^(imp|efreet|balron)$/i.test(d.name) || s.blackIceType === "other" ? "demon" : "ice";
  const effect = stripHtml(s.description?.value || s.notes || s.effect || "");
  const entry = {
    name: d.name, kind, cls: iceTypeLabel(s.blackIceType || s.class),
    per: Number(s.per || 0), spd: Number(s.spd || 0), atk: Number(s.atk || 0), def: Number(s.def || 0),
    rez: Number(s.rez?.max ?? s.rez ?? 10), cost: Number(s.price?.market || s.cost || 0),
    dmgStd: s.damage?.standard || "", dmgIce: s.damage?.blackIce || "",
    itemId: d.id, uuid: d.uuid, img: d.img, effect,
    folder: d.folder?.name || ""
  };
  if (kind === "demon") {
    const ifaceMatch = effect.match(/interface\s+(\d+)/i);
    const iface = Number(ifaceMatch?.[1] || s.interface || 0);
    DEMONS[d.name] = Object.assign(entry, { iface, netActions: iface <= 3 ? 2 : iface <= 6 ? 3 : iface <= 9 ? 4 : 5, combat: 14 });
  } else BLACK_ICE[d.name] = entry;
}
async function loadIcePack() {
  const worldPrograms = game.items.filter(isWorldBlackIceProgram);
  worldPrograms.forEach(applyProgramItem);
  console.log("Netarch: loaded", worldPrograms.length, "world Black ICE program items");
  const applyActor = (d) => {
    if (!d || d.type !== "blackIce") return;
    if (BLACK_ICE[d.name] || DEMONS[d.name]) return;
    const s = d.system || {};
    const st = s.stats || s;
    const kind = /^(imp|efreet|balron)$/i.test(d.name) || s.class === "other" ? "demon" : "ice";
    const effect = stripHtml(s.notes || s.effect || "");
    const entry = {
      name: d.name, kind, cls: iceTypeLabel(s.class || s.blackIceType),
      per: Number(st.per || 0), spd: Number(st.spd || 0), atk: Number(st.atk || 0), def: Number(st.def || 0),
      rez: Number(st.rez?.max ?? st.rez ?? s.rez ?? 10), cost: Number(s.cost || 0),
      actorId: d.id, actorUuid: d.uuid, img: d.img, effect
    };
    if (kind === "demon") {
      const ifaceMatch = effect.match(/interface\s+(\d+)/i);
      const iface = Number(ifaceMatch?.[1] || 0);
      DEMONS[d.name] = Object.assign(entry, { iface, netActions: iface <= 3 ? 2 : iface <= 6 ? 3 : iface <= 9 ? 4 : 5, combat: 14 });
    } else BLACK_ICE[d.name] = entry;
  };
  for (const a of game.actors.contents) applyActor(a);
  const actorPack = game.packs.get(ICE_ACTOR_PACK_ID) || [...game.packs].find(p => p.documentName === "Actor" && /b14ck|black.?ice/i.test(`${p.collection} ${p.title}`));
  if (actorPack) {
    const docs = await actorPack.getDocuments();
    docs.forEach(applyActor);
  }
  const itemPack = game.packs.get(ICE_PACK_ID);
  if (itemPack) {
    const docs = await itemPack.getDocuments();
    for (const d of docs) {
      if (BLACK_ICE[d.name] || DEMONS[d.name]) continue;
      applyProgramItem(d);
    }
  }
}
function iceImage(name, stored) {
  if (stored) return stored;
  const cat = catalogEntry(name);
  if (cat?.img) return cat.img;
  const item = findIceProgram(name);
  if (item?.img) return item.img;
  return "";
}
function findIceProgram(name) {
  const n = String(name || "").toLowerCase();
  if (!n) return null;
  return game.items.find(i => isWorldBlackIceProgram(i) && i.name.toLowerCase() === n)
    || game.items.find(i => i.type === "program" && i.name.toLowerCase() === n)
    || null;
}
function findIceActorByName(name) {
  const n = String(name || "").toLowerCase();
  if (!n) return null;
  const named = (a) => a && String(a.name || "").toLowerCase() === n;
  const blackIce = (a) => named(a) && a.type === "blackIce";
  return game.actors.find(blackIce)
    || canvas.tokens?.placeables?.map(t => t.actor).find(blackIce)
    || game.actors.find(named)
    || canvas.tokens?.placeables?.map(t => t.actor).find(named)
    || null;
}
function tokenPlaceable(token) {
  if (!token) return null;
  if (typeof token.setTarget === "function") return token;
  return token.object || canvas.tokens?.get(token.id) || null;
}
function tokenForActor(actor) {
  if (!actor) return null;
  return canvas.tokens?.placeables?.find(t => t.actor?.id === actor.id) || null;
}
function tokensForIceName(name) {
  const n = String(name || "").toLowerCase();
  if (!n) return [];
  const app = findMapperApp();
  if (!app) return (canvas.tokens?.placeables || []).filter(t => String(t.actor?.name || t.name || "").toLowerCase() === n);
  app._iceTokenCache = app._iceTokenCache || new Map();
  if (app._iceTokenCache.has(n)) return app._iceTokenCache.get(n);
  const list = (canvas.tokens?.placeables || []).filter(t => String(t.actor?.name || t.name || "").toLowerCase() === n);
  app._iceTokenCache.set(n, list);
  return list;
}
function tokenForIceInstance(name, occurrence) {
  const list = tokensForIceName(name);
  return list[Math.max(0, occurrence || 0)] || null;
}
function aimFoundryHover(token) {
  const obj = tokenPlaceable(token);
  if (!obj || !canvas.tokens) return null;
  if (canvas.tokens.hover !== obj) {
    const prev = canvas.tokens.hover;
    if (prev && prev !== obj) {
      try { prev._onHoverOut(new Event("mouseleave")); } catch (err) {}
    }
    canvas.tokens.hover = obj;
    if (obj.visible) {
      try { obj._onHoverIn(new Event("mouseenter")); } catch (err) {}
    }
    if (canvas.tokens.hover !== obj) canvas.tokens.hover = obj;
  }
  return obj;
}
function clearFoundryHover(token) {
  const obj = tokenPlaceable(token);
  if (!obj || !canvas.tokens || canvas.tokens.hover !== obj) return;
  try { obj._onHoverOut(new Event("mouseleave")); } catch (err) {}
  if (canvas.tokens.hover === obj) canvas.tokens.hover = null;
}
function foundryTargetHovered(shift) {
  const token = tokenPlaceable(canvas.tokens?.hover);
  if (!token) return false;
  const next = !token.isTargeted;
  const releaseOthers = !shift;
  const action = game.keybindings?.actions?.get("core.target");
  if (typeof action?.onDown === "function") {
    try {
      const handled = action.onDown({ key: "KeyT", isShift: !!shift, isCtrl: false, isAlt: false, isMeta: false, repeat: false });
      if (handled !== false && game.user?.targets?.has(token) === next) return true;
    } catch (err) { console.warn("Netarch core.target", err); }
  }
  try {
    if (typeof token.setTarget === "function") {
      const result = token.setTarget(next, { releaseOthers });
      if (result?.then) result.catch(err => console.warn("Netarch setTarget", err));
      return true;
    }
  } catch (err) { console.warn("Netarch setTarget", err); }
  try {
    if (typeof canvas.tokens?.setTargets === "function") {
      const ids = new Set(releaseOthers ? [] : Array.from(game.user?.targets || []).map(t => t.id));
      if (next) ids.add(token.id);
      else ids.delete(token.id);
      canvas.tokens.setTargets([...ids]);
      return true;
    }
  } catch (err) { console.warn("Netarch setTargets", err); }
  return false;
}
function canvasView() {
  if (!canvas?.ready || !canvas.stage) return null;
  return { x: canvas.stage.pivot.x, y: canvas.stage.pivot.y, scale: canvas.stage.scale.x };
}
function restoreCanvasView(view) {
  if (!view || typeof canvas?.pan !== "function") return;
  canvas.pan({ x: view.x, y: view.y, scale: view.scale });
}
async function hideMapperToken(token) {
  const doc = token?.document;
  if (!doc || doc.hidden || !game.user?.isGM) return token;
  const view = canvasView();
  try { await doc.update({ hidden: true }); } catch (err) { console.warn("Netarch hide", err); }
  restoreCanvasView(view);
  return token;
}
async function linkIceProgram(token, name) {
  const doc = token?.document;
  if (!doc) return;
  const flag = doc.getFlag?.("cyberpunk-red-core", "programUUID");
  if (flag) return;
  const actor = token.actor;
  const n = String(name || actor?.name || "").toLowerCase();
  const embedded = actor?.items?.find(i => i.type === "program" && String(i.name || "").toLowerCase() === n && /Actor\./.test(i.uuid || ""));
  const item = embedded || findIceProgram(name);
  if (!item?.uuid || !/Actor\./.test(item.uuid)) return;
  try { await doc.setFlag("cyberpunk-red-core", "programUUID", item.uuid); }
  catch (err) { console.warn("Netarch program link", err); }
}
function releaseIceSelection(token) {
  if (!token?.controlled || typeof token.release !== "function") return;
  try { token.release(); } catch (err) {}
}
function iceUid(ice, node, index) {
  if (ice?.uid) return ice.uid;
  ice.uid = (node?.id || "ice") + "-" + index + "-" + Math.random().toString(36).slice(2, 8);
  return ice.uid;
}
function tokenForIceUid(uid) {
  if (!uid) return null;
  return (canvas.tokens?.placeables || []).find(t => t.document?.getFlag?.("world", "netarchIceUid") === uid) || null;
}
async function ensureSceneToken(actor, label, occurrence, uid) {
  if (!actor || !canvas.scene) return null;
  if (uid) {
    const owned = tokenForIceUid(uid);
    if (owned) return owned;
  }
  const n = Math.max(0, occurrence || 0);
  let list = uid ? [] : tokensForIceName(label).filter(t => t.actor?.id === actor.id);
  if (!uid && list[n]) return list[n];
  if (!game.user?.isGM) return null;
  const view = canvasView();
  const proto = await actor.getTokenDocument({ name: label, hidden: true, x: view?.x || 0, y: view?.y || 0 });
  const base = proto.toObject();
  base.hidden = true;
  base.x = view?.x || 0;
  base.y = view?.y || 0;
  while (list.length <= n) {
    const data = foundry.utils.duplicate(base);
    if (uid) data.flags = Object.assign({}, data.flags, { world: Object.assign({}, data.flags?.world, { netarchIceUid: uid }) });
    const [doc] = await canvas.scene.createEmbeddedDocuments("Token", [data]);
    if (uid) { try { await doc.setFlag("world", "netarchIceUid", uid); } catch (err) {} }
    const app = findMapperApp();
    if (app?._iceTokenCache) app._iceTokenCache.clear();
    const made = canvas.tokens.get(doc.id);
    list = tokensForIceName(label).filter(t => t.actor?.id === actor.id);
    if (!made) break;
    if (list.length === 0) list = [made];
  }
  restoreCanvasView(view);
  requestAnimationFrame(() => restoreCanvasView(view));
  return list[n] || null;
}

async function populateArchIce(netarch) {
  if (!game.user?.isGM || !netarch || !canvas.scene) return;
  const view = canvasView();
  const size = canvas.scene.grid?.size || 100;
  const dims = canvas.dimensions || canvas.scene.dimensions || {};
  const rect = dims.sceneRect || {};
  const originX = rect.x ?? dims.sceneX ?? 0;
  const originY = rect.y ?? dims.sceneY ?? 0;
  let x = originX;
  for (const node of netarch.nodes || []) {
    for (let index = 0; index < (node.blackIce || []).length; index++) {
      const ice = node.blackIce[index];
      const uid = iceUid(ice, node, index);
      const actor = findIceActorByName(ice.name);
      const token = await ensureSceneToken(actor, ice.name, index, uid);
      if (!token) continue;
      const span = Math.max(1, token.document.width || 1) * size;
      try { await token.document.update({ x, y: originY, hidden: true }); } catch (err) { console.warn("Netarch corner", err); }
      ice.tokenId = token.id;
      x += span;
    }
  }
  await saveNetarchs(loadNetarchs());
  restoreCanvasView(view);
  requestAnimationFrame(() => restoreCanvasView(view));
}
function tokenRez(token) {
  const actor = token?.actor;
  if (!actor) return null;
  const rez = actor.system?.stats?.rez;
  if (rez && typeof rez === "object" && rez.value != null) return { cur: Number(rez.value), max: Number(rez.max ?? rez.value) };
  const hp = actor.system?.derivedStats?.hp;
  if (hp && hp.value != null) return { cur: Number(hp.value), max: Number(hp.max ?? hp.value) };
  return null;
}

async function showDerezzed(token, down) {
  const doc = token?.document;
  if (!doc || !game.user?.isGM) return;
  const stored = doc.getFlag("world", "iceName");
  const base = stored || String(doc.name || "").replace(/ — Derezzed$/, "");
  if (!stored) await doc.setFlag("world", "iceName", base);
  try {
    await doc.update({ hidden: !down, displayName: down ? 50 : 0, name: down ? base + " — Derezzed" : base });
  } catch (err) { console.warn("Netarch derezz", err); }
}
async function syncMapperFromToken(token) {
  const app = findMapperApp();
  if (!app?._netarchId || !token) return;
  const live = tokenRez(token);
  if (!live) return;
  const all = loadNetarchs();
  const netarch = all[app._netarchId];
  if (!netarch) return;
  const name = String(token.actor?.name || token.name || "").toLowerCase();
  const matches = [];
  for (const node of netarch.nodes || []) {
    for (const ice of node.blackIce || []) {
      if (ice.tokenId === token.id || String(ice.name || "").toLowerCase() === name) matches.push(ice);
    }
  }
  const linked = matches.filter(ice => ice.tokenId === token.id);
  const ice = linked[0] || (matches.length === 1 ? matches[0] : null);
  if (!ice || (ice.hp === live.cur && ice.maxHp === live.max)) { app._drawMap?.(); return; }
  ice.tokenId = token.id;
  ice.maxHp = live.max;
  ice.hp = live.cur;
  ice.derezzed = live.cur <= 0;
  await showDerezzed(token, ice.derezzed);
  await saveNetarchs(all);
  app._drawMap?.();
}

function iceMaxRez(ice) {
  return Number(ice?.maxHp || ice?.rez || catalogEntry(ice?.name)?.rez || 10);
}
async function writeIceRez(ice, token) {
  const max = iceMaxRez(ice);
  ice.maxHp = max;
  ice.hp = max;
  ice.derezzed = false;
  delete ice.rezzed;
  const sceneToken = token || (ice.tokenId ? canvas.tokens?.get(ice.tokenId) : null) || tokenForIceInstance(ice.name, 0);
  await showDerezzed(sceneToken, false);
  const actor = sceneToken?.actor;
  const rez = actor?.system?.stats?.rez;
  if (rez && typeof rez === "object") {
    try { await actor.update({ "system.stats.rez.value": max, "system.stats.rez.max": Number(rez.max || max) }); }
    catch (err) { console.warn("Netarch rerez", err); }
  }
  return sceneToken;
}
async function rerezArchitecture(netarch) {
  for (const node of netarch?.nodes || []) {
    for (const ice of node.blackIce || []) await writeIceRez(ice);
  }
}
function runnersStillIn(netarchId) {
  return Object.values(getAllPositions(netarchId)).some(p => p?.currentNodeId);
}
async function rerezIfEmpty(netarchId) {
  if (runnersStillIn(netarchId)) return false;
  const all = loadNetarchs();
  const arch = all[netarchId];
  if (!arch) return false;
  await rerezArchitecture(arch);
  arch.budget = computeBudget(arch);
  await saveNetarchs(all);
  ui.notifications.info("All runners jacked out. Architecture ICE HP restored.");
  return true;
}
async function destroyRunnerProgram(actor, itemId) {
  const item = actor?.items?.get(itemId);
  if (!item) return false;
  const deck = equippedDeck(actor);
  if (deck) {
    const list = [...(deck.system?.installedItems?.list || [])].filter(id => id !== item.id);
    try {
      await deck.update({ "system.installedItems.list": list, "system.installedItems.usedSlots": list.length });
    } catch (err) { console.warn("Netarch deck uninstall", err); }
  }
  await item.delete();
  return true;
}
function iceDialogActor(name) {
  return findIceActorByName(name)
    || canvas.tokens?.controlled?.[0]?.actor
    || game.user?.character
    || game.actors.find(a => a.type === "character")
    || null;
}
async function loadCprRolls() {
  const paths = [
    `/systems/${game.system.id}/modules/rolls/cpr-rolls.js`,
    `/systems/cyberpunk-red-core/modules/rolls/cpr-rolls.js`
  ];
  for (const p of paths) {
    try {
      const mod = await import(p);
      return Object.assign({}, mod, mod.default || {});
    } catch (err) {
      console.warn("Netarch roll import failed", p, err);
    }
  }
  return {};
}
async function rollIceProgramStat(ice, stat) {
  const item = findIceProgram(ice?.name || ice);
  if (!item) {
    ui.notifications.warn("No Black ICE program item named " + (ice?.name || ice) + " in world Items.");
    return null;
  }
  const value = Number(item.system?.[stat] ?? item.system?.stats?.[stat] ?? ice?.[stat] ?? 0);
  const title = item.name + " " + String(stat || "").toUpperCase();
  const actor = iceDialogActor(item.name);
  if (!actor) {
    ui.notifications.warn("Select the " + item.name + " token (or any actor) so the CPR roll dialog has a sheet.");
    return null;
  }
  let cprRoll = null;
  if (typeof actor.createStatRoll === "function") {
    try {
      cprRoll = actor.createStatRoll(stat);
      if (cprRoll?.then) cprRoll = await cprRoll;
    } catch (err) { console.warn("Netarch actor.createStatRoll", err); }
  }
  if (!cprRoll) {
    const ns = await loadCprRolls();
    const Cls = ns.CPRProgramStatRoll || ns.CPRStatRoll;
    if (Cls) cprRoll = typeof Cls.create === "function" ? Cls.create(title, value) : new Cls(title, value);
  }
  if (!cprRoll) {
    ui.notifications.error("Could not build a CPR program roll.");
    return null;
  }
  cprRoll.statName = String(stat || "").toUpperCase();
  cprRoll.statValue = value;
  cprRoll.rollTitle = title;
  if (typeof cprRoll.setNetCombat === "function") cprRoll.setNetCombat(title);
  cprRoll.rollCardExtraArgs = Object.assign({}, cprRoll.rollCardExtraArgs, { program: item });
  const ev = { shiftKey: false, ctrlKey: false, preventDefault() {}, stopPropagation() {} };
  if (typeof cprRoll.handleRollDialog === "function") {
    const keep = await cprRoll.handleRollDialog(ev, actor, item);
    if (keep === false) return { cancelled: true };
  }
  if (typeof cprRoll.roll === "function") await cprRoll.roll();
  cprRoll.entityData = { actor: actor.id, item: item.id, token: actor.token?.id || canvas.tokens?.controlled?.[0]?.id || null };
  const posted = await renderCprRollCard(cprRoll);
  if (posted) return cprRoll;
  const render = foundry?.applications?.handlebars?.renderTemplate || globalThis.renderTemplate;
  const html = await render(cprRoll.rollCard || `systems/${game.system.id}/templates/chat/cpr-program-stat-rollcard.hbs`, cprRoll);
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: html });
  return cprRoll;
}
async function rollIceProgramDamage(ice) {
  const item = findIceProgram(ice?.name || ice);
  if (!item) {
    ui.notifications.warn("No Black ICE program item named " + (ice?.name || ice) + " in world Items.");
    return null;
  }
  const actor = iceDialogActor(item.name);
  if (!actor) {
    ui.notifications.warn("Select the " + item.name + " token so the CPR damage dialog has a sheet.");
    return null;
  }
  const formula = item.system?.damage?.standard || item.system?.damage?.blackIce || "1d6";
  let cprRoll = null;
  if (typeof actor.createDamageRoll === "function") {
    try { cprRoll = actor.createDamageRoll(item.uuid); if (cprRoll?.then) cprRoll = await cprRoll; } catch (err) { console.warn(err); }
  }
  if (!cprRoll) {
    const ns = await loadCprRolls();
    if (typeof ns.CPRDamageRoll?.create === "function") cprRoll = ns.CPRDamageRoll.create(item.name, formula, "program");
    else if (ns.CPRDamageRoll) cprRoll = new ns.CPRDamageRoll(item.name, formula, "program");
  }
  if (!cprRoll) {
    const raw = await new Roll(formula).evaluate({ async: true });
    await raw.toMessage({ speaker: ChatMessage.getSpeaker({ actor }), flavor: item.name + " Damage" });
    rememberDamage(raw.total, item.name);
    return raw;
  }
  if (typeof cprRoll.setNetCombat === "function") cprRoll.setNetCombat(item.name);
  cprRoll.rollCardExtraArgs = Object.assign({}, cprRoll.rollCardExtraArgs, { program: item });
  const ev = { shiftKey: false, ctrlKey: false, preventDefault() {}, stopPropagation() {} };
  if (typeof cprRoll.handleRollDialog === "function") {
    const keep = await cprRoll.handleRollDialog(ev, actor, item);
    if (keep === false) return { cancelled: true };
  }
  if (typeof cprRoll.roll === "function") await cprRoll.roll();
  rememberDamage(cprRoll.total || cprRoll.roll?._total, item.name);
  const posted = await renderCprRollCard(cprRoll);
  if (!posted) {
    const render = foundry?.applications?.handlebars?.renderTemplate || globalThis.renderTemplate;
    const html = await render(cprRoll.rollCard || `systems/${game.system.id}/templates/chat/cpr-program-damage-rollcard.hbs`, cprRoll);
    await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: html });
  }
  return cprRoll;
}
function rememberDamage(total, label) {
  const n = Number(total);
  if (!Number.isFinite(n) || n <= 0) return;
  game.bfNetLastDamage = { total: n, label: label || "Damage" };
}
function chatDamageTotal(el) {
  const msg = el?.closest?.(".chat-message, .message");
  if (!msg) return 0;
  const text = msg.querySelector(".dice-total, .dice-total span, .total")?.textContent || "";
  return Number(String(text).replace(/[^\d.-]/g, "")) || 0;
}
async function renderCprRollCard(cprRoll) {
  try {
    const mod = await import(`/systems/${game.system.id}/modules/chat/cpr-chat.js`);
    const CPRChat = mod.default || mod.CPRChat || mod;
    if (typeof CPRChat.RenderRollCard === "function") {
      await CPRChat.RenderRollCard(cprRoll);
      return true;
    }
  } catch (err) { console.warn("Netarch CPRChat import", err); }
  return false;
}
async function rollIceActorStat(ice, stat) {
  return rollIceProgramStat(ice, stat);
}
async function postIceRollCard(ice, stat) {
  return rollIceProgramStat(ice, stat);
}
/* ===================== 07 BUDGET ===================== */
function floorBaseCost(floors) {
  if (floors <= 6) return 1000;
  if (floors <= 12) return 5000;
  return 10000;
}
function maxControlNodes(floors) {
  if (floors <= 6) return 2;
  if (floors <= 12) return 3;
  return 99;
}
function computeBudget(netarch) {
  const floors = netarch.nodes.length;
  const base = floorBaseCost(floors) * floors;
  let features = 0;
  let ice = 0;
  let demons = 0;
  const iceByNode = {};
  for (const node of netarch.nodes) {
    if (["Password", "File", "Control Node"].includes(node.type)) features += FEATURE_COST[node.dv] || 0;
    const list = node.blackIce || [];
    const iceOnly = list.filter(b => (catalogEntry(b.name)?.kind || b.kind) !== "demon");
    const demonOnly = list.filter(b => (catalogEntry(b.name)?.kind || b.kind) === "demon");
    if (node.type === "Demon") demonOnly.push({ name: node.name });
    const mult = iceOnly.length >= 3 ? 3 : iceOnly.length === 2 ? 2 : 1;
    for (const b of iceOnly) ice += (catalogEntry(b.name)?.cost || b.cost || 0) * mult;
    for (const b of demonOnly) demons += catalogEntry(b.name)?.cost || b.cost || 0;
    iceByNode[node.id] = { ice: iceOnly.length, demons: demonOnly.length, mult };
  }
  return { floors, floorCost: base, featureCost: features, iceCost: ice, demonCost: demons, total: base + features + ice + demons, iceByNode };
}
function formatEb(n) { return `${Number(n || 0).toLocaleString()}eb`; }

/* ===================== 08 RANDOM GENERATOR ===================== */
function parseFloorTokens(tokens) {
  const ice = [];
  let type = "Black ICE";
  let name = "";
  let dv = 6;
  for (const raw of tokens) {
    if (raw.startsWith("Password:")) { type = "Password"; dv = parseInt(raw.split(":")[1]); name = `Password DV${dv}`; }
    else if (raw.startsWith("File:")) { type = "File"; dv = parseInt(raw.split(":")[1]); name = `File DV${dv}`; }
    else if (raw.startsWith("Control:")) { type = "Control Node"; dv = parseInt(raw.split(":")[1]); name = `Control Node DV${dv}`; }
    else {
      ice.push(iceInstance(raw));
      name = name ? `${name}, ${raw}` : raw;
      type = catalogEntry(raw)?.kind === "demon" ? "Demon" : "Black ICE";
    }
  }
  if (!name) name = type;
  return { type, name, dv, ice };
}


function difficultyProfile(difficulty) {
  if (difficulty === "Basic") return { min: 3, max: 6, dv: 6, branch: 9 };
  if (difficulty === "Uncommon") return { min: 8, max: 12, dv: 10, branch: 7 };
  if (difficulty === "Advanced") return { min: 12, max: 18, dv: 12, branch: 6 };
  return { min: 5, max: 8, dv: 8, branch: 8 };
}
function generateNetarch(difficulty, forcedFloors = 0) {
  const profile = difficultyProfile(difficulty);
  let floors = forcedFloors || (profile.min + rollDie(profile.max - profile.min + 1) - 1);
  floors = Math.max(3, Math.min(18, floors));
  let branches = 0;
  const branchCap = difficulty === "Basic" ? 1 : difficulty === "Advanced" ? 4 : 2;
  while (rollDie(10) >= profile.branch && branches < branchCap) branches++;
  const mainMin = 2;
  let mainCount = Math.max(mainMin, floors - branches);
  const branchSizes = [];
  let leftover = floors - mainCount;
  for (let i = 0; i < branches; i++) {
    const take = leftover > 0 ? Math.max(1, Math.floor(leftover / (branches - i))) : 0;
    branchSizes.push(take);
    leftover -= take;
  }
  if (leftover > 0) mainCount += leftover;

  const usedLobby = new Set();
  const usedBody = new Set();
  const pickLobby = () => {
    let n = rollDie(6);
    let guard = 0;
    while (usedLobby.has(n) && ["Password", "File"].some(() => true) && guard++ < 8) n = rollDie(6);
    usedLobby.add(n);
    return LOBBY_TABLE[n];
  };
  const pickBody = () => {
    let n = roll3d6();
    let guard = 0;
    const key = BODY_TABLE[n][difficulty].join("|");
    while (usedBody.has(key) && guard++ < 12) n = roll3d6();
    usedBody.add(BODY_TABLE[n][difficulty].join("|"));
    return BODY_TABLE[n][difficulty];
  };

  const nodes = [];
  const connections = [];
  const makeNode = (x, y, tokens, floorLabel) => {
    const parsed = parseFloorTokens(tokens);
    const dv = ["Password", "File", "Control Node"].includes(parsed.type) ? profile.dv : parsed.dv;
    const node = {
      id: randomId(), x, y, type: parsed.type, name: parsed.name, dv: dv,
      notes: `Floor ${floorLabel}`, blackIce: parsed.ice, revealed: false
    };
    if (["Password", "File", "Control Node"].includes(node.type)) node.name = node.type + " DV" + dv;
    nodes.push(node);
    return node;
  };

  const main = [];
  for (let i = 0; i < mainCount; i++) {
    const tokens = i < 2 ? pickLobby() : pickBody();
    const node = makeNode(80, 40 + i * (NODE_H + FLOOR_GAP_Y), tokens, `M${i + 1}`);
    if (i === 0) { node.type = node.type === "Black ICE" ? node.type : node.type; }
    if (i > 0) connections.push({ id: randomId(), from: main[i - 1].id, to: node.id });
    main.push(node);
  }

  branchSizes.forEach((size, b) => {
    if (size <= 0) return;
    const attachAt = Math.min(main.length - 1, Math.max(2, 2 + rollDie(Math.max(1, main.length - 2)) - 1));
    let prev = main[attachAt];
    for (let i = 0; i < size; i++) {
      const node = makeNode(80 + (b + 1) * (NODE_W + FLOOR_GAP_X), 40 + (attachAt + 1 + i) * (NODE_H + FLOOR_GAP_Y), pickBody(), `B${b + 1}.${i + 1}`);
      connections.push({ id: randomId(), from: prev.id, to: node.id });
      prev = node;
    }
  });

  const rolledDemon = difficulty === "Advanced" ? "Balron" : difficulty === "Uncommon" ? "Efreet" : difficulty === "Standard" ? "Imp" : null;

  const arch = {
    id: randomId(),
    name: `${difficulty} Netarch (${nodes.length} floors)`,
    nodes,
    connections,
    entryNodeId: main[0].id,
    createdBy: game.user.id,
    createdAt: Date.now(),
    difficulty,
    generated: true
  };
  const first = nodes.find(n => n.id === arch.entryNodeId);
  if (first) first.revealed = true;
  ensureRoot(arch);
  arch.connections = (arch.connections || []).filter(c => {
    const a = arch.nodes.find(n => n.id === c.from);
    const b = arch.nodes.find(n => n.id === c.to);
    const pair = [a?.type, b?.type];
    return !(pair.includes("Lobby") && pair.includes("Root"));
  });
  keepIceOffRestricted(arch);
  if (rolledDemon && arch.nodes.length >= 6 && rollDie(10) >= 7) placeDemonFloor(arch, rolledDemon);
  arch.budget = computeBudget(arch);
  return arch;
}


function blankCount(value) {
  if (value == null || String(value).trim() === "") return null;
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? Math.max(0, n) : null;
}
function ensureRoot(arch) {
  if ((arch.nodes || []).some(n => n.type === "Root")) return;
  const target = arch.nodes[arch.nodes.length - 1];
  if (!target) return;
  target.type = "Root";
  target.name = "Root";
  target.dv = 0;
}
function iceForbidden(node) {
  return ["File", "Control Node", "Password", "Root"].includes(node?.type);
}
function iceHost(arch) {
  return (arch.nodes || []).find(n => !iceForbidden(n) && n.type !== "Demon") || null;
}
function keepIceOffRestricted(arch) {
  const banned = (arch.nodes || []).filter(iceForbidden);
  const loose = [];
  for (const node of banned) {
    loose.push(...(node.blackIce || []));
    node.blackIce = [];
  }
  if (!loose.length) return;
  let host = iceHost(arch);
  if (!host) {
    host = { id: randomId(), x: 40, y: 40, type: "Black ICE", name: "Black ICE", dv: 0, notes: "ICE floor", blackIce: [], revealed: false };
    arch.nodes.push(host);
  }
  for (const item of loose) {
    if ((catalogEntry(item.name)?.kind || item.kind) === "demon") placeDemonFloor(arch, item.name);
    else host.blackIce.push(item);
  }
}
function placeDemonFloor(arch, demonName) {
  const root = (arch.nodes || []).find(n => n.type === "Root");
  const host = [...arch.nodes].reverse().find(n => n !== root && n.type !== "Root" && n.type !== "Demon") || arch.nodes[0];
  const node = {
    id: randomId(),
    x: (host?.x || 80) + NODE_W + FLOOR_GAP_X,
    y: host?.y || 40,
    type: "Demon",
    name: demonName,
    dv: 0,
    notes: "Demon floor",
    blackIce: [iceInstance(demonName)],
    revealed: false
  };
  arch.nodes.push(node);
  if (host) arch.connections.push({ id: randomId(), from: host.id, to: node.id });
  return node;
}
function applyGenerateChoices(arch, choices) {
  choices = choices || {};
  ensureRoot(arch);
  const floors = arch.nodes.length;
  const demonCap = Math.floor(floors / 6);
  const controlCap = maxControlNodes(floors);
  const entry = arch.nodes.find(n => n.id === arch.entryNodeId) || arch.nodes[0];
  const root = [...arch.nodes].reverse().find(n => n.type === "Root") || arch.nodes[arch.nodes.length - 1];
  const pool = arch.nodes.filter(n => n !== entry && n !== root);
  const assign = (type, count, dv) => {
    if (count == null) return;
    const wanted = Math.min(count, pool.length);
    pool.forEach((node, i) => {
      if (i < wanted && (node.type === "Black ICE" || node.type === "Lobby" || node._shaped)) {
        node.type = type;
        node.dv = dv;
        node.name = type + " DV" + dv;
        node._shaped = true;
      }
    });
    let have = arch.nodes.filter(n => n.type === type).length;
    for (const node of pool) {
      if (have >= wanted) break;
      if (node === root || node.type === "Root") continue;
      if (node.type === type) continue;
      node.type = type;
      node.dv = dv;
      node.name = type + " DV" + dv;
      node._shaped = true;
      have++;
    }
  };
  const dv = difficultyProfile(arch.difficulty).dv;
  assign("Password", choices.passwords, dv);
  assign("Control Node", choices.controls == null ? null : Math.min(choices.controls, controlCap), dv);
  assign("File", choices.files, dv);
  for (const node of arch.nodes) {
    if (["Password", "File", "Control Node"].includes(node.type)) {
      node.dv = dv;
      node.name = node.type + " DV" + dv;
    }
  }
  if (choices.ice != null) {
    for (const node of arch.nodes) node.blackIce = (node.blackIce || []).filter(b => (catalogEntry(b.name)?.kind || b.kind) === "demon");
    const names = Object.keys(BLACK_ICE);
    let left = choices.ice;
    const hosts = arch.nodes.filter(n => !iceForbidden(n));
    let guard = 0;
    while (left > 0 && hosts.length && guard++ < 200) {
      const node = hosts[guard % hosts.length];
      node.blackIce = node.blackIce || [];
      node.blackIce.push(iceInstance(names[guard % names.length]));
      left--;
    }
  }
  if (choices.demons != null) {
    const wanted = Math.min(choices.demons, demonCap);
    for (const node of arch.nodes) {
      if (node.type === "Demon") node.blackIce = [];
      else node.blackIce = (node.blackIce || []).filter(b => (catalogEntry(b.name)?.kind || b.kind) !== "demon");
    }
    arch.nodes = arch.nodes.filter(n => n.type !== "Demon");
    const demonName = arch.difficulty === "Advanced" ? "Balron" : arch.difficulty === "Uncommon" ? "Efreet" : "Imp";
    for (let i = 0; i < wanted; i++) placeDemonFloor(arch, demonName);
    if (choices.demons > demonCap) ui.notifications.warn("Demon count capped at 1 per 6 floors.");
  }
  if (choices.budget != null) {
    let guard = 0;
    while (computeBudget(arch).total > choices.budget && guard++ < 200) {
      const node = [...arch.nodes].reverse().find(n => (n.blackIce || []).some(b => (catalogEntry(b.name)?.kind || b.kind) !== "demon"));
      if (!node) break;
      const idx = node.blackIce.findIndex(b => (catalogEntry(b.name)?.kind || b.kind) !== "demon");
      if (idx < 0) break;
      node.blackIce.splice(idx, 1);
    }
  }
  for (const node of arch.nodes) delete node._shaped;
  ensureRoot(arch);
  keepIceOffRestricted(arch);
  arch.budget = computeBudget(arch);
  return arch;
}
/* ===================== 09 PERSISTENCE ===================== */
async function ensureSettings() {
  if (!game.settings.settings.get(`world.${SETTING_KEY}`)) {
    game.settings.register("world", SETTING_KEY, { name: "Cyberpunk Netarchs", scope: "world", config: false, type: Object, default: {} });
  }
  if (!game.settings.settings.get(`world.${POSITION_KEY}`)) {
    game.settings.register("world", POSITION_KEY, { name: "Cyberpunk Netarch Positions", scope: "world", config: false, type: Object, default: {} });
  }
  if (!game.settings.settings.get(`world.${AVATAR_KEY}`)) {
    game.settings.register("world", AVATAR_KEY, { name: "Cyberpunk Netarch Avatars", scope: "world", config: false, type: Object, default: {} });
  }
}
function loadNetarchs() {
  if (!game.bfNetarchs) {
    try { game.bfNetarchs = game.settings.get("world", SETTING_KEY) || {}; } catch { game.bfNetarchs = {}; }
  }
  return game.bfNetarchs;
}
async function saveNetarchs(data) {
  game.bfNetarchs = data;
  if (game.user?.isGM) {
    await game.settings.set("world", SETTING_KEY, data);
    emitNetarch("netarch-broadcast", data);
  } else emitNetarch("netarch-save", data);
}
function loadPositions() {
  if (!game.bfNetarchPos) {
    try { game.bfNetarchPos = game.settings.get("world", POSITION_KEY) || {}; } catch { game.bfNetarchPos = {}; }
  }
  return game.bfNetarchPos;
}
async function savePositions(data) {
  game.bfNetarchPos = data;
  if (game.user?.isGM) {
    await game.settings.set("world", POSITION_KEY, data);
    emitNetarch("netarch-positions-broadcast", data);
  } else emitNetarch("netarch-save-positions", data);
}
/* ===================== 10 VISIBILITY AND POSITIONS ===================== */
function getVisibility(netarchId, userId) {
  return loadPositions()[`${netarchId}::${userId}`] || { currentNodeId: null, visitedNodeIds: [], pathfindered: false };
}
async function setVisibility(netarchId, userId, data) {
  const positions = loadPositions();
  const key = `${netarchId}::${userId}`;
  const prev = positions[key] || {};
  const seat = Object.assign({}, prev, data, { userId, companions: data.companions || prev.companions || [] });
  positions[key] = seat;
  await savePositions(positions);
  emitBoth("netarch-seat", { id: netarchId, key, seat });
  if (userId === game.user.id) {
    try { await game.user.setFlag("world", "netarchSeat", { id: netarchId, key, seat, at: Date.now() }); } catch (err) {}
  }
}
function getAllPositions(netarchId) {
  const result = {};
  for (const [key, val] of Object.entries(loadPositions())) {
    const parts = key.split("::");
    if (parts[0] === netarchId && (parts.length === 2 || parts[1] === "actor")) result[key] = val;
  }
  return result;
}
/* ===================== 11 DATA FACTORIES ===================== */
function newNetarch(name) {
  return { id: randomId(), name, nodes: [], connections: [], entryNodeId: null, createdBy: game.user.id, createdAt: Date.now() };
}

async function setTokenOwner(uuid, userId, grant) {
  const doc = await fromUuid(uuid);
  if (!doc || doc.documentName !== "Token" || !game.user?.isGM) return null;
  const actor = doc.actor;
  if (!actor) return null;
  if (grant) {
    const prior = actor.ownership?.[userId] ?? 0;
    await doc.setFlag("world", "netarchPriorOwner", { userId, level: prior });
    await actor.update({ ["ownership." + userId]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER });
    if (doc.hidden) await doc.update({ hidden: false });
  } else {
    const prior = doc.getFlag("world", "netarchPriorOwner");
    const level = prior?.userId === userId ? prior.level : 0;
    await actor.update({ ["ownership." + userId]: level });
    await doc.unsetFlag("world", "netarchPriorOwner");
  }
  return doc;
}
function controlTokenIds(uuids) {
  return (uuids || []).map(uuid => String(uuid).split(".").pop());
}
async function claimControlFlag() {
  const flag = game.user?.getFlag("world", "netarchControl");
  if (!flag?.uuids?.length) return;
  for (const uuid of flag.uuids) {
    const doc = await fromUuid(uuid);
    const token = doc?.object || canvas.tokens?.get(doc?.id);
    if (token && !token.controlled) token.control({ releaseOthers: false });
  }
}
function takeLocalTokens(uuids) {
  for (const id of controlTokenIds(uuids)) canvas.tokens?.get(id)?.control({ releaseOthers: false });
  claimControlFlag();
}
function releaseLocalTokens(uuids) {
  for (const id of controlTokenIds(uuids)) canvas.tokens?.get(id)?.release();
}
async function handControlNode(archId, nodeId, userId) {
  if (!game.user?.isGM) { ui.notifications.warn("Only the GM can give control."); return; }
  const all = loadNetarchs();
  const node = all[archId]?.nodes?.find(n => n.id === nodeId);
  if (!node) { ui.notifications.warn("Control node not found."); return; }
  const tokens = node.controlTokens || [];
  const uuids = tokens.map(t => t.uuid).filter(Boolean);
  if (userId && !uuids.length) { ui.notifications.warn("No scene tokens are assigned to this Control Node. Right-click a token, Assign control node, first."); return; }
  if (node.controllerUserId && node.controllerUserId !== userId) {
    for (const uuid of uuids) await setTokenOwner(uuid, node.controllerUserId, false);
    emitNetarch("netarch-release-tokens", { userId: node.controllerUserId, uuids });
  }
  const previous = node.controllerUserId;
  node.controllerUserId = userId || null;
  if (userId) {
    for (const uuid of uuids) await setTokenOwner(uuid, userId, true);
    const player = game.users.get(userId);
    if (player) await player.setFlag("world", "netarchControl", { uuids, at: Date.now() });
    emitNetarch("netarch-take-tokens", { userId, uuids });
  } else if (previous) {
    const player = game.users.get(previous);
    if (player) await player.unsetFlag("world", "netarchControl");
    emitNetarch("netarch-release-tokens", { userId: previous, uuids });
  }
  await saveNetarchs(all);
  const who = userId ? game.users.get(userId)?.name : "no one";
  ui.notifications.info((node.name || "Control Node") + " is now with " + who + ".");
  refreshOpenMapper({ full: true });
}

function actorPresenceKey(netarchId, actorId) { return netarchId + "::actor::" + actorId; }
function listRunners(netarchId) {
  const out = [];
  const all = loadPositions();
  for (const [key, data] of Object.entries(all)) {
    if (!key.startsWith(netarchId + "::")) continue;
    if (!data?.currentNodeId) continue;
    const parts = key.split("::");
    if (parts[1] === "actor") out.push({ key, userId: data.userId || game.user.id, actorId: parts[2], data });
    else out.push({ key, userId: parts[1], actorId: data.actorId || null, data });
  }
  return out;
}
async function setActorPresence(netarchId, actorId, data) {
  const positions = loadPositions();
  const key = actorPresenceKey(netarchId, actorId);
  const prev = positions[key] || {};
  positions[key] = Object.assign({}, prev, data, { actorId, companions: data.companions || prev.companions || [] });
  await savePositions(positions);
}
async function clearActorPresence(netarchId, actorId) {
  const positions = loadPositions();
  delete positions[actorPresenceKey(netarchId, actorId)];
  await savePositions(positions);
}
function floorTokenCount(node, netarch) {
  const ice = node?.blackIce?.length || 0;
  let people = 0;
  if (netarch && node) {
    for (const p of Object.values(getAllPositions(netarch.id))) {
      if (p?.currentNodeId === node.id) people += 1;
      people += (p?.companions || []).filter(c => (c.nodeId || p.currentNodeId) === node.id).length;
    }
  }
  return Math.max(1, ice + people);
}
function floorSize(node, netarch) {
  const count = floorTokenCount(node, netarch);
  return {
    w: Math.max(NODE_W, 36 + count * (TOKEN_PX + 12)),
    h: Math.max(NODE_H, 96 + TOKEN_PX + 36)
  };
}
function spreadOverlappingFloors(netarch) {
  const nodes = netarch?.nodes || [];
  if (!nodes.length) return false;
  const cols = new Map();
  for (const n of nodes) {
    const key = Math.round((n.x || 0) / 80) * 80;
    if (!cols.has(key)) cols.set(key, []);
    cols.get(key).push(n);
  }
  let moved = false;
  for (const list of cols.values()) {
    list.sort((a, b) => a.y - b.y);
    for (let i = 1; i < list.length; i++) {
      const minY = list[i - 1].y + floorSize(list[i - 1], netarch).h + FLOOR_GAP_Y;
      if (list[i].y < minY) {
        list[i].y = minY;
        moved = true;
      }
    }
  }
  const ordered = [...cols.keys()].sort((a, b) => a - b);
  for (let c = 1; c < ordered.length; c++) {
    const prevMax = Math.max(...cols.get(ordered[c - 1]).map(n => n.x + floorSize(n, netarch).w));
    const minX = prevMax + FLOOR_GAP_X;
    for (const n of cols.get(ordered[c])) {
      if (n.x < minX) {
        n.x = minX;
        moved = true;
      }
    }
  }
  return moved;
}
function newNode(x, y) {
  return { id: randomId(), x, y, type: "Black ICE", name: "", dv: 6, notes: "", blackIce: [], revealed: false };
}
function passwallBlocks(netarch, fromId) {
  const from = netarch?.nodes?.find(n => n.id === fromId);
  return from?.type === "Password" && !from.unlocked;
}
function getAdjacentIds(netarch, nodeId) {
  return netarch.connections.filter(c => c.from === nodeId || c.to === nodeId).map(c => c.from === nodeId ? c.to : c.from);
}
function getUserColor(userId) {
  const idx = game.users.contents.findIndex(u => u.id === userId);
  return USER_COLORS[idx % USER_COLORS.length] || "#fff";
}

/* ===================== 11B NET SHEET AND COMBAT ===================== */
const INTERFACE_ABILITIES = ["Scanner", "Backdoor", "Cloak", "Control", "Eye-Dee", "Pathfinder", "Slide", "Virus", "Zap"];
const IFACE_KEY = {
  Scanner: "scanner", Backdoor: "backdoor", Cloak: "cloak", Control: "control",
  "Eye-Dee": "eyedee", Pathfinder: "pathfinder", Slide: "slide", Virus: "virus", Zap: "zap"
};
function netActionsFromInterface(rank) {
  const n = Number(rank) || 0;
  if (n <= 0) return 0;
  if (n <= 3) return 2;
  if (n <= 6) return 3;
  if (n <= 9) return 4;
  return 5;
}
function programClass(item) {
  return String(item?.system?.class || item?.system?.blackIceType || "").toLowerCase();
}
function isAttackerProgram(item) {
  return /attacker/i.test(programClass(item));
}
function isBlackIceProgram(item) {
  const c = programClass(item);
  return c.includes("blackice") || c.includes("black ice");
}
function needsRezToAct(item) {
  const c = programClass(item);
  return c.includes("booster") || c.includes("defender") || isBlackIceProgram(item);
}
function hasInterface(actor) {
  if (!actor) return false;
  const roles = actor.itemTypes?.role || actor.items.filter(i => i.type === "role");
  return roles.some(r => r.system?.mainRoleAbility === "Interface" || (r.system?.abilities || []).some(a => /interface/i.test(`${a.name || ""} ${a.key || ""} ${a.bonusName || ""}`)));
}
function netRoleItem(actor) {
  if (!actor) return null;
  return actor.items.get(actor.system?.roleInfo?.activeNetRole)
    || actor.itemTypes?.role?.find(r => r.system?.mainRoleAbility === "Interface")
    || actor.items.find(i => i.type === "role" && (i.name === actor.system?.roleInfo?.activeRole || /netrunner/i.test(i.name)))
    || null;
}
function equippedDeck(actor) {
  if (!actor) return null;
  if (typeof actor.getEquippedCyberdeck === "function") return actor.getEquippedCyberdeck();
  return actor.items.find(i => i.type === "cyberdeck" && i.system?.equipped === "equipped") || null;
}
function actorForUser(user) {
  return user?.character || canvas.tokens?.controlled?.[0]?.actor || null;
}
const NET_AVATAR_FLAG = "netAvatar";
function actorForAvatar(user) {
  return user?.character || null;
}
function loadAvatars() {
  if (!game.bfNetAvatars) {
    try { game.bfNetAvatars = game.settings.get("world", AVATAR_KEY) || {}; } catch { game.bfNetAvatars = {}; }
  }
  return game.bfNetAvatars;
}
async function saveAvatars(data) {
  game.bfNetAvatars = data;
  if (game.user?.isGM) {
    await game.settings.set("world", AVATAR_KEY, data);
    emitNetarch("netarch-avatars-broadcast", data);
  } else emitNetarch("netarch-save-avatars", data);
}
function netAvatarPath(actor) {
  if (!actor) return "";
  return actor.getFlag?.("world", "netarchAvatar") || loadAvatars()[actor.id] || "";
}
function netAvatarSrc(path) {
  if (!path) return "";
  if (/^(https?:|data:|\/)/.test(path)) return path;
  return "/" + path;
}
function uploadPath(result) {
  if (!result) return "";
  if (typeof result === "string") return result;
  return result.path || result.url || "";
}
async function setNetAvatar(actor, path) {
  if (!actor) return;
  const all = Object.assign({}, loadAvatars());
  if (!path) delete all[actor.id];
  else all[actor.id] = path;
  await saveAvatars(all);
  if (actor.isOwner || game.user?.isGM) {
    if (path) await actor.setFlag("world", "netarchAvatar", path);
    else await actor.unsetFlag("world", "netarchAvatar");
  }
  const app = findMapperApp();
  if (app) app._avatarCache = {};
  refreshOpenMapper({ full: true });
}
function avatarFolder() {
  const world = game.world?.id || "world";
  return "worlds/" + world + "/netarch-avatars";
}
async function uploadNetAvatar(actor, file) {
  const safe = String(file.name || "avatar.png").replace(/[^\w.\-]+/g, "_");
  const named = new File([file], actor.id + "-" + Date.now() + "-" + safe, { type: file.type });
  const folder = avatarFolder();
  try { await FilePicker.createDirectory("data", "worlds/" + (game.world?.id || "world"), {}); } catch (err) {}
  try { await FilePicker.createDirectory("data", folder, {}); } catch (err) {}
  let result;
  try {
    result = await FilePicker.upload("data", folder, named, {}, { notify: false });
  } catch (err) {
    ui.notifications.error("Net avatar upload failed: " + err.message);
    return null;
  }
  const path = uploadPath(result) || (result?.path) || "";
  if (!path) {
    ui.notifications.error("Upload finished but Foundry did not return a file path.");
    return null;
  }
  await setNetAvatar(actor, path);
  return path;
}
function jackLinkFor(actor) {
  if (!actor) return "physical";
  const flagged = actor.getFlag?.("world", "netarchJackLink");
  if (flagged === "virtual" || flagged === "physical") return flagged;
  const app = findMapperApp();
  const positions = loadPositions();
  const archId = app?._netarchId;
  if (archId) {
    const seat = positions[archId + "::" + game.user.id];
    if (seat?.jackLink) return seat.jackLink;
  }
  const seat = Object.values(positions).find(s => s?.actorId === actor.id && s.jackLink);
  return seat?.jackLink || "physical";
}
function extraNetAction(actor, deck) {
  if (jackLinkFor(actor) === "virtual") return 0;
  const discs = (actor?.itemTypes?.cyberware || actor?.items?.filter(i => i.type === "cyberware") || [])
    .filter(i => /ex-?dis[ck]/i.test(i.name || "")).length;
  const elysia = /elysia/i.test(deck?.name || "");
  return discs >= 2 || elysia ? 1 : 0;
}
function hasRezzedArmor(actor) {
  if (!actor) return false;
  return (actor.items || []).some(i => i.type === "program" && /^armor$/i.test(i.name || "") && /defender/i.test(i.system?.class || "") && i.system?.isRezzed);
}
function armorSoak(actor) { return hasRezzedArmor(actor) ? 4 : 0; }
function currentDamageTarget() {
  const app = findMapperApp();
  return game.actors.get(app?._mapperTarget?.actorId) || game.user?.targets?.first()?.actor || null;
}
function readNetSheet(actor) {
  if (!actor) return null;
  const role = netRoleItem(actor);
  const deck = equippedDeck(actor);
  const interfaceRank = Number(role?.system?.rank || actor.getFlag?.("world", `interfaceValue_${actor.id}`) || 0);
  const bonuses = actor.bonuses || actor.system?.bonuses || {};
  const installIds = deck?.system?.installedItems?.list || [];
  const programs = installIds.map(id => actor.items.get(id)).filter(i => i && i.type === "program");
  return {
    actorId: actor.id, actorName: actor.name,
    fightState: actor.getFlag?.(game.system.id, "fightState") || "unknown",
    roleName: role?.name || "None", interfaceRank,
    netActions: netActionsFromInterface(interfaceRank) + extraNetAction(actor, deck),
    speedBonus: Number(bonuses.speed || 0),
    defenseBonus: Number(bonuses.defense || 0),
    attackBonus: Number(bonuses.attack || 0),
    deckName: deck?.name || "No deck", deckId: deck?.id || null,
    slotsUsed: deck?.system?.installedItems?.usedSlots ?? programs.length,
    slotsMax: deck?.system?.installedItems?.slots ?? 0,
    programs
  };
}
function sheetForUser(user) { return readNetSheet(actorForUser(user)); }
function makeSheetRollEvent(attrs) {
  const el = document.createElement("a");
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === "") continue;
    el.setAttribute(k, String(v));
  }
  return { currentTarget: el, target: el, shiftKey: false, ctrlKey: false, preventDefault() {}, stopPropagation() {} };
}
async function callSheetNetRoll(actor, extra) {
  if (!actor) return null;
  const deck = equippedDeck(actor);
  const role = netRoleItem(actor);
  if (role && actor.system?.roleInfo?.activeNetRole !== role.id) {
    try { await actor.update({ "system.roleInfo.activeNetRole": role.id }); } catch {}
  }
  try { await actor.setFlag(game.system.id, "fightState", "Netspace"); } catch {}
  const rollType = extra.programId && extra.executionType ? "cyberdeckProgram" : "interfaceAbility";
  const attrs = extra.programId && extra.executionType
    ? { "data-roll-type": rollType, "data-cyberdeck-id": deck?.id, "data-program-id": extra.programId, "data-execution-type": extra.executionType }
    : { "data-roll-type": rollType, "data-interface-ability": extra.interfaceAbility, "data-cyberdeck-id": deck?.id };
  const ev = makeSheetRollEvent(attrs);
  const sheet = actor.sheet;
  if (sheet && typeof sheet._onRoll === "function") {
    try { await sheet._onRoll(ev); return { via: "sheet._onRoll" }; }
    catch (err) { console.error("Netarch sheet._onRoll error", err); }
  }
  if (!deck || typeof deck.createRoll !== "function") {
    ui.notifications.warn("No equipped cyberdeck to roll from the sheet.");
    return null;
  }
  try {
    let cprRoll = deck.createRoll(rollType, actor, {
      interfaceAbility: extra.interfaceAbility, cyberdeck: deck, cyberdeckId: deck.id,
      programId: extra.programId, executionType: extra.executionType, netRoleItem: role
    });
    if (cprRoll?.then) cprRoll = await cprRoll;
    if (!cprRoll) return null;
    if (typeof cprRoll.handleRollDialog === "function") {
      const keep = await cprRoll.handleRollDialog(ev, actor, deck);
      if (keep === false) return { cancelled: true };
    }
    if (typeof deck.confirmRoll === "function") cprRoll = await deck.confirmRoll(cprRoll);
    if (typeof cprRoll.roll === "function") await cprRoll.roll();
    cprRoll.entityData = { actor: actor.id, item: deck.id };
    const posted = await renderCprRollCard(cprRoll);
    if (!posted) {
      const render = foundry?.applications?.handlebars?.renderTemplate || globalThis.renderTemplate;
      const html = await render(cprRoll.rollCard || `systems/${game.system.id}/templates/chat/cpr-cyberdeck-rollcard.hbs`, cprRoll);
      await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: html });
    }
    return cprRoll;
  } catch (err) {
    console.error("Netarch createRoll path error", err);
    ui.notifications.error(`Sheet roll failed: ${err.message}`);
    return null;
  }
}
async function rollNd10Plus(bonus, label, actor) {
  const roll = await new Roll("1d10 + @b", { b: Number(bonus || 0) }).evaluate({ async: true });
  await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor }), flavor: label });
  return roll.total;
}

/* ===================== 12 APP SHELL ===================== */
class NetarchApp extends Application {
  constructor() {
    super();
    this._netarchId = null;
    this._mode = "list";
    this._editMode = false;
    this._dragging = null;
    this._connecting = null;
    this._canvas = null;
    this._ctx = null;
    this._scrollX = 0;
    this._scrollY = 0;
    this._isPanning = false;
    this._panStart = null;
    this._selectedNode = null;
    this._deleteMode = false;
    this._ro = null;
    this._zoom = 1;
    this._panelTab = "floors";
    this._listQuery = "";
    this._fitOnce = false;
    this._actionsUsed = 0;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: "Netarch Mapper ORTHO", id: "netarch-mapper", template: null, width: 1120, height: 720, resizable: true, classes: ["netarch-mapper"]
    });
  }
  get template() { return null; }
  async _renderInner() {
    const div = document.createElement("div");
    div.innerHTML = this._buildHTML();
    return $(div.firstElementChild);
  }
  _buildHTML() {
    return `<div id="netarch-root" style="display:flex;flex-direction:column;height:100%;background:#0a0a14;color:#fff;font-family:'Courier New',monospace;overflow:hidden;">
      ${this._buildStyles()}
      <div id="netarch-content" style="flex:1;overflow:hidden;display:flex;flex-direction:column;">
        ${this._mode === "sheet" ? this._buildCheatSheet() : this._mode === "list" ? this._buildListView() : this._buildMapView()}
      </div>
    </div>`;
  }
  /* ----- 13 UI STYLES ----- */
  _buildStyles() {
    return `<style>
      .netarch-mapper .window-content { padding:0 !important; background:#07070f !important; }
      #netarch-root { font-family: "Trebuchet MS", "Segoe UI", sans-serif; }
      .na-btn { padding:7px 12px; background:#12182a; border:1px solid #2a6d82; color:#9be7f5; font-size:12px; cursor:pointer; border-radius:6px; letter-spacing:.02em; }
      .na-sheet { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:14px; overflow:auto; }
      .na-sheet h3 { margin:0 0 6px; color:#9be7f5; font-size:14px; }
      .na-sheet p, .na-sheet li { color:#d5e7ee; font-size:13px; line-height:1.45; }
      .na-note { grid-column:1 / -1; color:#8aa; font-size:11px; }
      .na-btn:hover { background:#1b2c3d; color:#fff; border-color:#42d3ea; }
      .na-btn.red { border-color:#8a2038; color:#ff8aa0; }
      .na-btn.green { border-color:#2a7a32; color:#7dff8a; }
      .na-btn.purple { border-color:#7a2a7a; color:#f6a0ff; }
      .na-btn.orange { border-color:#8a4a12; color:#ffb070; }
      .na-btn.active { background:#16384a; color:#fff; box-shadow:inset 0 0 0 1px #42d3ea; }
      .na-input, .na-select { padding:6px 8px; background:#0c101c; border:1px solid #2a6d82; color:#fff; font-size:11px; border-radius:4px; width:100%; box-sizing:border-box; }
      .na-topbar { display:flex; align-items:center; gap:8px; padding:8px 12px; background:linear-gradient(#121624,#0a0d18); border-bottom:1px solid #1e3a48; }
      .na-crumb { color:#6a8; font-size:11px; }
      .na-title { color:#42d3ea; font-weight:700; font-size:15px; text-shadow:0 0 8px rgba(66,211,234,.35); }
      .na-card { background:rgba(12,16,30,.92); border:1px solid #1e3a48; border-radius:8px; padding:12px; margin-bottom:8px; }
      .na-card:hover { border-color:#42d3ea; }
      .na-badge { display:inline-block; padding:2px 7px; border-radius:10px; font-size:10px; margin-right:4px; }
      .na-tools { position:absolute; top:10px; left:10px; z-index:12; display:flex; flex-direction:column; gap:6px; background:rgba(8,10,20,.92); border:1px solid #1e3a48; border-radius:8px; padding:8px; width:148px; }
      .na-nav { position:absolute; bottom:10px; left:10px; z-index:12; display:flex; gap:6px; background:rgba(8,10,20,.92); border:1px solid #1e3a48; border-radius:8px; padding:6px; }
      .na-hint { position:absolute; bottom:10px; left:180px; right:270px; z-index:12; color:#9ad; font-size:11px; text-shadow:0 0 6px #000; pointer-events:none; }
      .na-side { width:268px; background:rgba(8,10,18,.94); border-left:1px solid #1e3a48; display:flex; flex-direction:column; }
      .na-tabs { display:flex; border-bottom:1px solid #1e3a48; }
      .na-tab { flex:1; padding:8px 4px; background:transparent; border:0; color:#7aa; cursor:pointer; font-size:11px; }
      .na-tab.active { color:#42d3ea; border-bottom:2px solid #42d3ea; background:#101624; }
      .na-floor { display:block; width:100%; text-align:left; padding:6px 8px; margin-bottom:4px; background:#101624; border:1px solid #1e3a48; color:#d8f6ff; cursor:pointer; border-radius:4px; font-size:11px; }
      .na-floor:hover, .na-floor.active { border-color:#42d3ea; }
      #netarch-canvas { cursor:grab; display:block; position:relative; z-index:1; background:transparent; }
      #netarch-bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; pointer-events:none; z-index:0; opacity:.85; }
    </style>`;
  }

  /* ----- 14 UI LIST VIEW ----- */
  _buildListView() {
    const q = (this._listQuery || "").toLowerCase();
    const sceneId = canvas.scene?.id;
    const list = Object.values(loadNetarchs()).filter(n => (!q || `${n.name} ${n.difficulty || ""}`.toLowerCase().includes(q)) && (!n.sceneId || n.sceneId === sceneId || isGM()));
    const cards = list.map(n => {
      const bud = n.budget || computeBudget(n);
      const connected = !!getVisibility(n.id, game.user.id).currentNodeId;
      const diff = n.difficulty || "Custom";
      return `<div class="na-card">
        <div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:8px;">
          <div>
            <div style="color:#42d3ea;font-size:15px;font-weight:700;">${n.name}</div>
            <div style="margin-top:5px;">
              <span class="na-badge" style="background:#132;color:#7dff8a;">${n.nodes.length} floors</span>
              <span class="na-badge" style="background:#321;color:#ffb070;">${formatEb(bud.total)}</span>
              <span class="na-badge" style="background:#123;color:#9be7f5;">${diff}</span> ${n.sceneId ? `<span class="na-badge" style="background:#222;color:#aaa;">${game.scenes.get(n.sceneId)?.name || "scene"}</span>` : ""}
              ${n.entryNodeId ? `<span class="na-badge" style="background:#132;color:#7dff8a;">Entry ready</span>` : `<span class="na-badge" style="background:#311;color:#ff8aa0;">No entry</span>`}
              ${connected ? `<span class="na-badge" style="background:#132;color:#7dff8a;">Jacked in</span>` : ""}
            </div>
          </div>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button class="na-btn na-open-map" data-id="${n.id}">Open map</button>
          ${n.entryNodeId ? `<button class="na-btn green na-connect-arch" data-id="${n.id}">Jack in</button>` : ""}
          ${connected ? `<button class="na-btn red na-disconnect-arch" data-id="${n.id}">Jack out</button>` : ""}
          ${isGM() || n.createdBy === game.user.id ? `<button class="na-btn red na-delete-arch" data-id="${n.id}">Delete</button>` : ""}
        </div>
      </div>`;
    }).join("") || `<div class="na-card" style="text-align:center;color:#7aa;padding:28px;">No architectures yet. GM can Generate one from the CPR tables or start a blank map.</div>`;
    return `<div style="display:flex;flex-direction:column;height:100%;">
      <div class="na-topbar">
        <div style="flex:1;">
          <div class="na-crumb">NETRUNNING / ARCHITECTURES</div>
          <div class="na-title">Netarch Mapper</div>
        </div>
        <input class="na-input" id="na-search" placeholder="Search architectures..." value="${this._listQuery || ""}" style="width:220px;">
        <button class="na-btn" id="na-sheet">Cheat sheet</button>
        ${isGM() ? `<button class="na-btn orange" id="na-generate">Generate from tables</button>` : ""}
        ${isGM() ? `<button class="na-btn green" id="na-new-arch">Blank map</button>` : ""}
      </div>
      <div style="flex:1;overflow-y:auto;padding:12px;">${cards}</div>
    </div>`;
  }


  _rulesBody() {
    const gm = isGM() ? `<section class="na-card"><h3>GM: using this mapper</h3><ul>
      <li>Blank map or Generate from tables. Edit map, Add floor, Link floors, set the entry.</li>
      <li>Jack in drops that architecture's Black ICE in a line at the scene top-left. The camera does not move.</li>
      <li>Hover a portrait, press T to target. Shift+T adds. Re Rez restores ICE HP. Destroy removes floor ICE, or deletes a runner program from the sheet and deck.</li>
      <li>Player preview is what that player sees. Unvisited and unrevealed floors stay gray, with no names. Reveal a floor to show its clip.</li>
      <li>Rules stays open on the side while the map is up. The scanner macro is separate.</li>
    </ul></section>` : "";
    return `<p class="na-note">Core book steps, broken into chunks. Not a copy of the page.</p>
      <section class="na-card"><h3>1. Your turn</h3><ul>
        <li>Take one Meat Action, or take NET Actions equal to your Interface. Not both.</li>
        <li>You still get your Move, as long as you stay in range of the access point.</li>
        <li>Jack in at an access point. You start on the entry floor.</li>
      </ul></section>
      <section class="na-card"><h3>2. Floors</h3><ul>
        <li>Deal with the floor you are on before you leave it.</li>
        <li>Move one floor along a link: 1 NET Action.</li>
        <li>Password, File, Control Node: Interface + 1d10 against the floor DV.</li>
        <li>Password success lets you pass. File success copies it. Control Node success lets you operate the linked device.</li>
      </ul></section>
      <section class="na-card"><h3>3. First sight of Black ICE</h3><ul>
        <li>Interface + any Speed bonus + 1d10 against the ICE Speed + 1d10.</li>
        <li>If the ICE wins, you take its effect immediately.</li>
        <li>Anti-personnel hits your body. Anti-program hits one of your programs.</li>
      </ul></section>
      <section class="na-card"><h3>4. The clash</h3><ul>
        <li>Your attack: Interface + Program ATK + 1d10 against ICE DEF + 1d10.</li>
        <li>ICE attack: ICE ATK + 1d10 against Interface + Program DEF + 1d10.</li>
        <li>A hit applies that program or ICE effect. A class only works on its own target type.</li>
        <li>Damage comes off REZ. At 0 REZ that program or ICE is derezzed.</li>
        <li>Zap is the deck's basic attack: Interface + 1d10 against DEF + 1d10, then 1d6 REZ.</li>
        <li>A program can be run once per round. One copy per deck slot.</li>
      </ul></section>
      <section class="na-card"><h3>5. Interface abilities</h3><ul>
        <li>Backdoor lowers a Password DV. Virus lowers a Control Node DV.</li>
        <li>Slide: Interface + 1d10 against the ICE Perception + 1d10 to leave without fighting.</li>
        <li>Cloak makes you harder to perceive. Eye-Dee identifies what you are looking at.</li>
        <li>Pathfinder reveals the layout. Scanner searches meatspace for access points. Control uses a node you already took.</li>
      </ul></section>
      <section class="na-card"><h3>6. Getting out</h3><ul>
        <li>Jack out from the entry floor to leave cleanly.</li>
        <li>Being forced out, or leaving from deeper in, is unsafe.</li>
        <li>When every runner is out, this mapper restores architecture ICE HP.</li>
      </ul></section>
      ${gm}`
  }
  _buildCheatSheet() {
    return `<div style="display:flex;flex-direction:column;height:100%;">
      <div class="na-topbar">
        <div style="flex:1;"><div class="na-crumb">NETRUNNING / RULES</div><div class="na-title">Net combat</div></div>
        <button class="na-btn" id="na-sheet-back">Back</button>
      </div>
      <div class="na-sheet">${this._rulesBody()}</div>
    </div>`;
  }
  /* ----- 15 UI MAP VIEW ----- */
  _buildMapView() {
    const netarch = loadNetarchs()[this._netarchId];
    if (!netarch) return this._buildListView();
    const canEdit = isGM() || netarch.createdBy === game.user.id;
    const bud = computeBudget(netarch);
    netarch.budget = bud;
    const vis = getVisibility(netarch.id, viewUserId(this));
    const jacked = !!getVisibility(netarch.id, game.user.id).currentNodeId;
    const previewOpts = isGM() ? [`<option value="">GM view</option>`].concat(game.users.contents.filter(u => u.active).map(u => `<option value="${u.id}" ${this._previewUserId === u.id ? "selected" : ""}>${u.name}</option>`)).join("") : "";
    const allowed = isGM() ? ["floors", "rules", "combat", "budget", "runners", "edit"] : ["rules", "combat", "runners"];
    const tab = allowed.includes(this._panelTab) ? this._panelTab : (isGM() ? "floors" : "combat");
    this._panelTab = tab;
    const tools = canEdit ? `<div class="na-tools">
      <button class="na-btn ${this._editMode ? "active" : ""}" id="na-toggle-edit">${this._editMode ? "Editing on" : "Edit map"}</button>
      ${this._editMode ? `
        <button class="na-btn green" id="na-add-node">Add floor</button>
        <button class="na-btn ${this._connecting ? "active purple" : "purple"}" id="na-connect-mode">${this._connecting ? "Connecting..." : "Link floors"}</button>
        <button class="na-btn ${this._deleteMode ? "active red" : "red"}" id="na-delete-mode">${this._deleteMode ? "Click a floor" : "Delete floor"}</button>
        <button class="na-btn na-unlink" id="na-unlink-floor">Unlink floor</button>
        <button class="na-btn" id="na-unlink-all">Unlink all</button>
        <button class="na-btn purple" id="na-reveal-all">Reveal all</button>
        <button class="na-btn red" id="na-hide-all">Hide all</button>
      ` : `<div style="color:#6a8;font-size:10px;">Turn on Edit to place floors, link them, and set the entry.</div>`}
    </div>` : "";
    const sideBody = tab === "budget" ? this._buildBudgetPanel(netarch, bud)
      : tab === "runners" ? this._buildRunnerPanel(netarch)
      : tab === "combat" ? this._buildCombatPanel(netarch)
      : tab === "edit" ? (this._editMode ? this._buildNodeEditPanel(netarch) : `<div style="color:#7aa;font-size:12px;">Turn on Edit map to change a floor.</div>`)
      : tab === "rules" ? `<div style="color:#d5e7ee;font-size:13px;line-height:1.45;">${this._rulesBody()}</div>`
      : this._buildFloorList(netarch, vis);
    return `<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;">
      <div class="na-topbar">
        ${isGM() ? `<button class="na-btn" id="na-back">All architectures</button>` : ""}
        <div style="flex:1;min-width:0;">
          <div class="na-crumb">MAPPER / ${netarch.difficulty || "CUSTOM"}</div>
          <div class="na-title" style="font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${netarch.name}</div>
        </div>
        <span class="na-badge" style="background:#321;color:#ffb070;">${formatEb(bud.total)}</span>
        <span class="na-badge" style="background:#123;color:#9be7f5;">${bud.floors} floors</span>
        ${jacked ? `<span class="na-badge" style="background:#132;color:#7dff8a;">Jacked in</span>` : `<span class="na-badge" style="background:#311;color:#ff8aa0;">Not jacked in</span>`}
        ${netarch.entryNodeId ? `<button class="na-btn green na-connect-arch" data-id="${netarch.id}">Jack in</button>` : ""}
        ${jacked ? `<button class="na-btn red na-disconnect-arch" data-id="${netarch.id}">Jack out</button>` : ""}
        ${isGM() ? `<select class="na-select" id="na-preview" style="width:140px;">${previewOpts}</select>` : ""}
        <button class="na-btn" id="na-rules">Rules</button>
      </div>
      <div style="display:flex;flex:1;overflow:hidden;">
        <div style="flex:1;overflow:hidden;position:relative;">
          <video id="netarch-bg" src="${NETARCH_BG}" autoplay loop muted playsinline></video>
          <canvas id="netarch-canvas"></canvas>
          ${tools}
          <div class="na-nav">
            <button class="na-btn" id="na-zoom-out">-</button>
            <button class="na-btn" id="na-zoom-fit">Fit</button>
            <button class="na-btn" id="na-zoom-in">+</button>
          </div>
          <div class="na-hint">${this._editMode
            ? "Drag floors to move them. Empty-drag or middle-mouse pans. Right-click a floor for Reveal / Entry. Mouse wheel zooms."
            : (isGM() ? "Click a floor to select it. Drag ICE or a runner. T targets. Drag empty space to pan." : "Jack in first. Click an adjacent floor to move. Hover a portrait and press T to target it. Shift+T adds. Drag empty space to pan.")}</div>
        </div>
        <div class="na-side">
          <div class="na-tabs">
            ${isGM() ? `<button class="na-tab ${tab === "floors" ? "active" : ""}" data-tab="floors">Floors</button>` : ""}
            <button class="na-tab ${tab === "rules" ? "active" : ""}" data-tab="rules">Rules</button>
            <button class="na-tab ${tab === "combat" ? "active" : ""}" data-tab="combat">Combat</button>
            ${isGM() ? `<button class="na-tab ${tab === "budget" ? "active" : ""}" data-tab="budget">Budget</button>` : ""}
            <button class="na-tab ${tab === "runners" ? "active" : ""}" data-tab="runners">Runners</button>
            ${isGM() ? `<button class="na-tab ${tab === "edit" ? "active" : ""}" data-tab="edit">Edit</button>` : ""}
          </div>
          <div id="na-side-body" style="flex:1;overflow-y:auto;padding:8px;">${sideBody}</div>
        </div>
      </div>
    </div>`;
  }

  _buildFloorList(netarch, vis) {
    const visited = new Set(vis.visitedNodeIds || []);
    const rows = netarch.nodes.map((node, i) => {
      const hidden = !isGM() && !node.revealed && !visited.has(node.id);
      const label = hidden ? `Floor ${i + 1}  ?` : `${i + 1}. ${node.name || node.type}`;
      const mark = netarch.entryNodeId === node.id ? " ENTRY" : "";
      const here = vis.currentNodeId === node.id ? " YOU" : "";
      const drag = isGM() && this._editMode ? `draggable="true" class="na-floor-row"` : `class="na-floor-row"`;
      return `<div ${drag} data-node="${node.id}" style="display:flex;gap:4px;align-items:center;margin-bottom:4px;cursor:${isGM() && this._editMode ? "grab" : "default"};"><button class="na-floor ${this._selectedNode === node.id ? "active" : ""}" data-node="${node.id}" style="flex:1;">${label}${mark}${here}</button></div>`;
    }).join("") || `<div style="color:#7aa;font-size:12px;">No floors yet.</div>`;
    const selected = netarch.nodes.find(n => n.id === this._selectedNode);
    const give = isGM() && selected?.type === "Control Node"
      ? `<button class="na-btn green na-give-control" data-node="${selected.id}" style="width:100%;margin-top:8px;">Give control</button><div style="color:#888;font-size:10px;margin-top:4px;">${game.users.get(selected.controllerUserId)?.name || "No player"} has ${(selected.controlTokens || []).map(t => t.name).join(", ") || "no tokens"}</div>`
      : "";
    const pass = isGM() && selected?.type === "Password"
      ? `<button class="na-btn ${selected.unlocked ? "red" : "green"} na-pass-lock" data-node="${selected.id}" style="width:100%;margin-top:8px;">${selected.unlocked ? "Lock Password" : "Unlock Password"}</button>`
      : "";
    return `<div style="color:#9be7f5;font-size:11px;font-weight:700;margin-bottom:6px;">Jump to floor</div>${rows}${pass}${give}`;
  }

  /* ----- 16 UI SIDE PANELS ----- */
  _buildBudgetPanel(netarch, bud) {
    return `<div style="font-size:11px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid rgba(66,211,234,0.2);">
      <div style="color:#ff6600;font-weight:bold;margin-bottom:4px;">Architecture Budget</div>
      <div style="color:#aaa;">Floors (${bud.floors} x ${formatEb(floorBaseCost(bud.floors))}): <span style="color:#fff;">${formatEb(bud.floorCost)}</span></div>
      <div style="color:#aaa;">Pass/File/Control: <span style="color:#fff;">${formatEb(bud.featureCost)}</span></div>
      <div style="color:#aaa;">Black ICE (stack priced): <span style="color:#fff;">${formatEb(bud.iceCost)}</span></div>
      <div style="color:#aaa;">Demons: <span style="color:#fff;">${formatEb(bud.demonCost)}</span></div>
      <div style="color:#ff6600;margin-top:4px;">Total ${formatEb(bud.total)}</div>
      <div style="color:#555;font-size:10px;margin-top:4px;">2 ICE on a floor = 2x each. 3 ICE = 3x each. 1 Demon / 6 floors.</div>
    </div>`;
  }

  _buildRunnerPanel(netarch) {
    const positions = getAllPositions(netarch.id);
    const rows = [];
    const seen = new Set();
    const pushUser = (u) => {
      if (!u || seen.has(u.id)) return;
      seen.add(u.id);
      const data = positions[`${netarch.id}::${u.id}`];
      const actor = game.actors.get(data?.actorId) || actorForAvatar(u);
      const node = data?.currentNodeId ? netarch.nodes.find(n => n.id === data.currentNodeId) : null;
      const path = netAvatarPath(actor);
      const canEdit = actor && (isGM() || u.id === game.user.id);
      const img = path
        ? `<img src="${netAvatarSrc(path)}" alt="" style="width:28px;height:28px;object-fit:cover;border-radius:50%;border:1px solid #42d3ea;">`
        : `<span style="display:inline-block;width:28px;height:28px;border-radius:50%;background:${getUserColor(u.id)};color:#000;text-align:center;line-height:28px;font-weight:700;">${(u.name || "?")[0].toUpperCase()}</span>`;
      const buttons = canEdit
        ? `<button class="na-btn na-avatar-upload" data-actor="${actor.id}">Upload NET avatar</button><button class="na-btn na-avatar-clear" data-actor="${actor.id}">Clear</button>`
        : "";
      rows.push(`<div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;font-size:11px;">
        ${img}
        <div>
          <div style="color:#fff;">${actor?.name || u.name}</div>
          <div style="color:#555;">${node ? (node.name || node.type) : "not jacked in"}</div>
          ${buttons}
        </div>
      </div>`);
    };
    pushUser(game.user);
    for (const u of game.users.contents.filter(u => u.active)) pushUser(u);
    for (const seat of listRunners(netarch.id).filter(s => s.key.includes("::actor::"))) {
      const actor = game.actors.get(seat.actorId);
      if (!actor || seen.has(actor.id)) continue;
      seen.add(actor.id);
      const node = netarch.nodes.find(n => n.id === seat.data.currentNodeId);
      const path = netAvatarPath(actor);
      const img = path
        ? `<img src="${netAvatarSrc(path)}" alt="" style="width:28px;height:28px;object-fit:cover;border-radius:50%;border:1px solid #42d3ea;">`
        : `<span style="display:inline-block;width:28px;height:28px;border-radius:50%;background:#42d3ea;color:#000;text-align:center;line-height:28px;font-weight:700;">${(actor.name || "?")[0].toUpperCase()}</span>`;
      rows.push(`<div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;font-size:11px;">
        ${img}
        <div>
          <div style="color:#fff;">${actor.name}</div>
          <div style="color:#555;">${node ? (node.name || node.type) : "added"}</div>
          ${isGM() ? `<button class="na-btn red na-remove-actor" data-actor="${actor.id}">Remove</button>` : ""}
        </div>
      </div>`);
    }
    return `<div style="font-size:11px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid rgba(66,211,234,0.2);">
      <div style="color:#42d3ea;font-weight:bold;margin-bottom:4px;">Active Netrunners</div>
      ${isGM() ? `<button class="na-btn" id="na-add-actor" style="width:100%;margin-bottom:6px;">Add actor</button>` : ""}
      <div style="color:#555;font-size:10px;margin-bottom:6px;">NET avatar is stored in the mapper world setting, keyed to the actor id. The actor document and battle-map token are not updated.</div>
      ${rows.join("") || '<div style="color:#555;">None connected.</div>'}
    </div>`;
  }

  _combatActor() {
    return game.actors.get(this._controlledActorId) || actorForUser(game.user);
  }
  _actionsFor(actor) {
    this._actionsByActor = this._actionsByActor || {};
    if (!actor?.id) return 0;
    if (this._actionsByActor[actor.id] == null) {
      const seat = Object.values(loadPositions()).find(s => s?.actorId === actor.id && s.actionsUsed);
      this._actionsByActor[actor.id] = Number(seat?.actionsUsed || 0);
    }
    return this._actionsByActor[actor.id] || 0;
  }
  _spendActions(actor, cost) {
    if (!actor?.id) return;
    this._actionsByActor = this._actionsByActor || {};
    this._actionsByActor[actor.id] = (this._actionsByActor[actor.id] || 0) + Number(cost || 0);
  }

  _buildCombatPanel(netarch) {
    const actor = this._combatActor();
    const sheet = readNetSheet(actor);
    const gm = isGM();
    const node = netarch.nodes.find(n => n.id === this._selectedNode) || netarch.nodes.find(n => n.id === getVisibility(netarch.id, game.user.id).currentNodeId);
    if (!sheet && !gm) {
      return `<div style="color:#7aa;font-size:12px;">Assign a character to this user (or select their token) to use Combat.</div>`;
    }
    const left = sheet ? Math.max(0, sheet.netActions - this._actionsFor(actor)) : 0;
    const ifaceBtns = INTERFACE_ABILITIES.map(a => `<button class="na-btn na-iface" data-ability="${a}" style="margin:2px 2px 0 0;">${a}</button>`).join("");
    const ordered = (sheet?.programs || []).slice().sort((a, b) => {
      const rank = item => isAttackerProgram(item) ? 0 : /defender/i.test(programClass(item)) ? 1 : /booster/i.test(programClass(item)) ? 2 : isBlackIceProgram(item) ? 3 : 4;
      const byRank = rank(a) - rank(b);
      if (byRank) return byRank;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
    let lastRank = -1;
    const progRows = ordered.map(p => {
      const rank = isAttackerProgram(p) ? 0 : /defender/i.test(programClass(p)) ? 1 : /booster/i.test(programClass(p)) ? 2 : isBlackIceProgram(p) ? 3 : 4;
      const heads = ["Attackers", "Defenders", "Boosters", "Black ICE", "Other"];
      const head = rank !== lastRank ? `<div style="color:#9be7f5;font-weight:700;margin:8px 0 4px;">${heads[rank]}</div>` : "";
      lastRank = rank;
      const rez = !!p.system?.isRezzed;
      const attacker = isAttackerProgram(p);
      const ice = isBlackIceProgram(p);
      const rezGate = !attacker && needsRezToAct(p);
      const cls = p.system?.class || "";
      const stats = attacker
        ? `ATK ${p.system?.atk || 0}`
        : `ATK ${p.system?.atk || 0} DEF ${p.system?.def || 0} PER ${p.system?.per || 0} SPD ${p.system?.spd || 0} REZ ${p.system?.rez?.value ?? "?"}/${p.system?.rez?.max ?? "?"}`;
      const iceBtns = (ice && rez)
        ? `<div style="margin-top:4px;">
            <button class="na-btn red na-prog-stat" data-pid="${p.id}" data-stat="atk">Attack</button>
            <button class="na-btn orange na-prog-stat" data-pid="${p.id}" data-stat="def">Defend</button>
            <button class="na-btn na-prog-stat" data-pid="${p.id}" data-stat="per">Perception</button>
            <button class="na-btn na-prog-stat" data-pid="${p.id}" data-stat="spd">Speed</button>
            <button class="na-btn red na-prog-dmg" data-pid="${p.id}">Damage</button>
          </div>`
        : "";
      return head + `<div style="border:1px solid #1e3a48;border-radius:4px;padding:6px;margin-bottom:4px;font-size:11px;">
        <div style="color:#fff;">${p.name} <span style="color:#668;">${cls}</span></div>
        <div style="color:#889;">${stats}</div>
        ${rezGate ? `<button class="na-btn ${rez ? "green" : ""} na-toggle-rez" data-pid="${p.id}">${rez ? "De-rez" : "Rez"}</button>` : ""}
        ${attacker ? `<button class="na-btn red na-prog-atk" data-pid="${p.id}">ATK</button>` : ""}
        ${attacker ? `<button class="na-btn red na-prog-dmg" data-pid="${p.id}">Damage</button>` : ""}
        ${iceBtns}
        <button class="na-btn red na-prog-destroy" data-pid="${p.id}" style="margin-top:4px;">Destroy</button>
      </div>`;
    }).join("") || `<div style="color:#555;">No programs installed.</div>`;
    const iceRows = (node?.blackIce || []).map((b, i) => `
      <div style="border:1px solid #3a1a1a;border-radius:4px;padding:6px;margin-bottom:4px;font-size:11px;">
        <div style="color:#ff8aa0;">${b.name}</div>
        <div style="color:#889;">PER ${b.per || 0} SPD ${b.spd || 0} ATK ${b.atk || 0} DEF ${b.def || 0} REZ ${b.hp ?? b.rez ?? "?"}</div>
        <div style="margin-top:4px;">
          <button class="na-btn red na-ice-atk" data-idx="${i}">Attack</button>
          <button class="na-btn orange na-ice-def" data-idx="${i}">Defend</button>
          <button class="na-btn na-ice-per" data-idx="${i}">Perception</button>
          <button class="na-btn na-ice-spd" data-idx="${i}">Speed</button>
          <button class="na-btn red na-ice-dmg" data-idx="${i}">Damage</button>
          ${gm ? `<button class="na-btn green na-ice-rerez" data-idx="${i}">Re Rez</button>` : ""}
          ${gm ? `<button class="na-btn red na-ice-destroy" data-idx="${i}">Destroy</button>` : ""}
        </div>
      </div>`).join("") || `<div style="color:#555;">Select a floor with ICE.</div>`;
    return `<div style="font-size:11px;">
      ${sheet ? `<div style="color:#ffb070;font-weight:700;margin-bottom:6px;">${sheet.actorName}</div>
      <div style="color:#fff;font-weight:700;margin-bottom:4px;">${sheet.actorName}</div>
      <div style="color:#889;margin-bottom:4px;">${sheet.roleName} | Interface ${sheet.interfaceRank} → ${sheet.netActions} NET Actions</div>
      <div style="color:#889;margin-bottom:4px;">${sheet.deckName} ${sheet.slotsUsed}/${sheet.slotsMax}</div>
      <div style="color:#889;margin-bottom:6px;">Speed ${sheet.speedBonus >= 0 ? "+" : ""}${sheet.speedBonus} | Defense ${sheet.defenseBonus >= 0 ? "+" : ""}${sheet.defenseBonus}</div>
      <div style="margin-bottom:8px;">NET Actions left: <b style="color:#7dff8a;">${left}</b> / ${sheet.netActions}
        <button class="na-btn" id="na-reset-actions">New turn</button></div>
      <div style="color:#9be7f5;font-weight:700;margin:8px 0 4px;">Your rolls (separate)</div>
      <button class="na-btn orange" id="na-roll-speed">Your Speed</button>
      <button class="na-btn orange" id="na-roll-def">Your Defense</button>
      <div style="margin-top:6px;">${ifaceBtns}</div>
      <div style="color:#555;font-size:10px;margin:6px 0;">ICE Attack never rolls Your Defense.</div>
      <div style="color:#9be7f5;font-weight:700;margin:10px 0 4px;">Programs</div>
      <div style="color:#555;font-size:10px;margin-bottom:4px;">Rezzed Black ICE shows Attack, Defend, Perception, Speed.</div>
      ${progRows}` : `<div style="color:#7aa;font-size:12px;margin-bottom:8px;">GM view. Select a runner token to see their programs. Floor ICE buttons are below.</div>`}
      <div style="color:#ff8aa0;font-weight:700;margin:10px 0 4px;">Floor ICE ${node ? `(${node.name || node.type})` : ""}</div>
      <div style="color:#555;font-size:10px;margin-bottom:4px;">Architecture ICE does not need Rez. Re Rez only restores HP.</div>
      ${gm ? `<button class="na-btn green" id="na-rerez-all" style="margin-bottom:6px;">Re Rez all ICE</button>` : ""}
      ${iceRows}
    </div>`;
  }

  _buildCatalogPanel() {
    if (!this._editMode) return "";
    const iceOpts = Object.keys(BLACK_ICE).map(n => `<option value="${n}">${n} (${formatEb(BLACK_ICE[n].cost)})</option>`).join("");
    const demonOpts = Object.keys(DEMONS).map(n => `<option value="${n}">${n} (${formatEb(DEMONS[n].cost)})</option>`).join("");
    return `<div style="font-size:11px;">
      <div style="color:#ff073a;font-weight:bold;margin-bottom:4px;">Premade Black ICE</div>
      <div style="color:#666;font-size:10px;margin-bottom:6px;">Select a node, then add from this list.</div>
      <select class="na-select" id="na-ice-pick" style="width:100%;margin-bottom:4px;">${iceOpts}</select>
      <div style="color:#ff6600;font-weight:bold;margin:8px 0 4px;">Demons</div>
      <select class="na-select" id="na-demon-pick" style="width:100%;">${demonOpts}</select>
    </div>`;
  }

  _buildNodeEditPanel(netarch) {
    const node = netarch.nodes.find(n => n.id === this._selectedNode);
    if (!node) return this._buildCatalogPanel();
    const typeOpts = NODE_TYPES.map(t => `<option value="${t}" ${node.type === t ? "selected" : ""}>${t}</option>`).join("");
    const iceRows = (node.blackIce || []).map((b, i) => {
      const src = catalogEntry(b.name);
      return `<div style="margin-bottom:4px;padding:4px;border:1px solid #333;">
        <div style="display:flex;justify-content:space-between;"><span style="color:#ff073a;">${b.name}</span>
        <button class="na-btn red na-remove-ice" data-idx="${i}" style="padding:0 5px;">x</button></div>
        <div style="color:#888;font-size:10px;">ATK ${b.atk} DEF ${b.def} REZ ${b.hp}${src ? ` PER ${src.per || "-"} SPD ${src.spd || "-"}` : ""} ${formatEb(src?.cost || b.cost || 0)}</div>
        ${src?.effect ? `<div style="color:#666;font-size:10px;">${src.effect}</div>` : ""}
      </div>`;
    }).join("");
    const iceOpts = Object.keys(BLACK_ICE).map(n => `<option value="${n}">${n}</option>`).join("");
    const demonOpts = Object.keys(DEMONS).map(n => `<option value="${n}">${n}</option>`).join("");
    return `<div style="font-size:11px;">
      <div style="color:#42d3ea;font-weight:bold;margin-bottom:8px;">Edit Node</div>
      <label style="color:#aaa;display:block;">Type</label>
      <select class="na-select" id="ne-type" style="width:100%;margin-bottom:6px;">${typeOpts}</select>
      <label style="color:#aaa;display:block;">Name</label>
      <input class="na-input" id="ne-name" value="${node.name}" style="width:100%;margin-bottom:6px;box-sizing:border-box;">
      ${["Password","File","Control Node"].includes(node.type)
        ? `<label style="color:#aaa;display:block;">DV</label><input class="na-input" id="ne-dv" type="number" value="${node.dv}" style="width:60px;margin-bottom:6px;">`
        : `<input type="hidden" id="ne-dv" value="${node.dv}">`}
      <label style="color:#aaa;display:block;">Notes</label>
      <textarea class="na-input" id="ne-notes" rows="2" style="width:100%;box-sizing:border-box;margin-bottom:6px;">${node.notes}</textarea>
      <label style="color:#aaa;display:flex;align-items:center;gap:4px;margin-bottom:6px;"><input type="checkbox" id="ne-revealed" ${node.revealed ? "checked" : ""}> Revealed</label>
      ${node.type === "Password" ? `<button class="na-btn ${node.unlocked ? "red" : "green"} na-pass-lock" data-node="${node.id}" style="width:100%;margin-bottom:8px;">${node.unlocked ? "Lock Password" : "Unlock Password"}</button>` : ""}
      ${/Link$/.test(node.type) ? `<label style="color:#aaa;display:block;">Linked architecture</label><select class="na-select" id="ne-link-arch" style="width:100%;margin-bottom:6px;">${Object.values(loadNetarchs()).filter(a => a.id !== netarch.id).map(a => `<option value="${a.id}" ${node.linkArchId === a.id ? "selected" : ""}>${a.name}</option>`).join("")}</select>` : ""}
      ${node.type === "Control Node" ? `<div style="color:#9be7f5;margin-bottom:6px;">Linked tokens: ${(node.controlTokens || []).map(t => t.name).join(", ") || "none"}</div><div style="color:#aaa;margin-bottom:6px;">Controller: ${game.users.get(node.controllerUserId)?.name || "none"}</div><button class="na-btn green na-give-control" data-node="${node.id}" style="width:100%;margin-bottom:8px;">Give control</button>` : ""}
      <button class="na-btn green" id="ne-save" style="width:100%;margin-bottom:8px;">Save Node</button>
      <button class="na-btn na-unlink" data-node="${node.id}" style="width:100%;margin-bottom:8px;">Unlink floor</button>
      <div style="color:#ff073a;font-weight:bold;">Black ICE / Demons</div>
      <div>${iceRows || '<div style="color:#555;">None.</div>'}</div>
      <select class="na-select" id="na-ice-pick" style="width:100%;margin-top:4px;">${iceOpts}</select>
      <button class="na-btn red" id="ne-add-picked-ice" style="width:100%;margin-top:4px;">Add Black ICE</button>
      <select class="na-select" id="na-demon-pick" style="width:100%;margin-top:6px;">${demonOpts}</select>
      <button class="na-btn orange" id="ne-add-picked-demon" style="width:100%;margin-top:4px;">Add Demon</button>
      <button class="na-btn red" id="ne-delete-node" style="width:100%;margin-top:8px;">Delete Node</button>
    </div>`;
  }

  /* ----- 17 CANVAS DRAW ----- */
  _sx(x) { return x * (this._zoom || 1) + this._scrollX; }
  _sy(y) { return y * (this._zoom || 1) + this._scrollY; }
  _snw(node) { return floorSize(node, loadNetarchs()[this._netarchId]).w * (this._zoom || 1); }
  _snh(node) { return floorSize(node, loadNetarchs()[this._netarchId]).h * (this._zoom || 1); }
  _centerOnNode(node) {
    if (!node || !this._canvas) return;
    this._scrollX = this._canvas.width / 2 - (node.x + NODE_W / 2) * this._zoom;
    this._scrollY = this._canvas.height / 2 - (node.y + NODE_H / 2) * this._zoom;
    this._drawMap();
  }
  _fitView() {
    const netarch = loadNetarchs()[this._netarchId];
    if (!netarch?.nodes.length || !this._canvas) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of netarch.nodes) {
      minX = Math.min(minX, n.x); minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + floorSize(n, netarch).w);
      maxY = Math.max(maxY, n.y + floorSize(n, netarch).h);
    }
    const pad = 80;
    const zoom = Math.max(0.4, Math.min(1.6, Math.min((this._canvas.width - pad) / Math.max(1, maxX - minX), (this._canvas.height - pad) / Math.max(1, maxY - minY))));
    this._zoom = zoom;
    this._scrollX = (this._canvas.width - (maxX + minX) * zoom) / 2;
    this._scrollY = (this._canvas.height - (maxY + minY) * zoom) / 2;
    this._drawMap();
  }
  _bumpZoom(dir, cx, cy) {
    const old = this._zoom || 1;
    const next = Math.max(0.4, Math.min(2.2, old + dir * 0.15));
    if (!this._canvas) { this._zoom = next; return; }
    const x = cx ?? this._canvas.width / 2;
    const y = cy ?? this._canvas.height / 2;
    const wx = (x - this._scrollX) / old;
    const wy = (y - this._scrollY) / old;
    this._zoom = next;
    this._scrollX = x - wx * next;
    this._scrollY = y - wy * next;
    this._drawMap();
  }


  _tileVideo(type) {
    const path = TILE_VIDEOS[type];
    if (!path) return null;
    this._tileClips = this._tileClips || {};
    if (!this._tileClips[path]) {
      const video = document.createElement("video");
      video.src = path;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.play().catch(() => {});
      this._tileClips[path] = video;
    }
    return this._tileClips[path];
  }
  _scheduleDraw() {
    if (this._drawQueued) return;
    this._drawQueued = true;
    requestAnimationFrame(() => {
      this._drawQueued = false;
      if (this.rendered && this._mode === "map") this._drawMap();
    });
  }
  _startTileLoop() {
    if (this._tileTimer) { clearTimeout(this._tileTimer); this._tileTimer = null; }
  }
  _syncTileLayers() {
    const host = this._canvas?.parentElement;
    if (!host) return;
    let layer = host.querySelector(".na-tile-layer");
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "na-tile-layer";
      host.appendChild(layer);
    }
    layer.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0;";
    const slots = this._tileSlots || [];
    while (layer.children.length < slots.length) {
      const video = document.createElement("video");
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = true;
      video.style.position = "absolute";
      video.style.objectFit = "cover";
      layer.appendChild(video);
    }
    for (let i = 0; i < layer.children.length; i++) {
      const video = layer.children[i];
      const slot = slots[i];
      if (!slot) { video.style.display = "none"; continue; }
      if (video.src !== new URL(slot.src, document.baseURI).href) video.src = slot.src;
      video.style.display = "block";
      video.style.left = slot.x + "px";
      video.style.top = slot.y + "px";
      video.style.width = slot.w + "px";
      video.style.height = slot.h + "px";
      const c = slot.ch;
      video.style.clipPath = `polygon(${c}px 0, ${slot.w - c}px 0, 100% ${c}px, 100% ${slot.h - c}px, ${slot.w - c}px 100%, ${c}px 100%, 0 ${slot.h - c}px, 0 ${c}px)`;
      if (video.paused) video.play().catch(() => {});
    }
  }
  _initCanvas() {
    const canvas = document.getElementById("netarch-canvas");
    if (!canvas) return;
    this._canvas = canvas;
    this._ctx = canvas.getContext("2d");
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    this._drawMap();
    this._startTileLoop();
    this._bindCanvasEvents();
    this._bindResizeObserver(container);
    if (!this._fitOnce) {
      this._fitOnce = true;
      const all = loadNetarchs();
      const arch = all[this._netarchId];
      if (arch && spreadOverlappingFloors(arch)) saveNetarchs(all);
      if (arch?.view) { this._scrollX = arch.view.x; this._scrollY = arch.view.y; this._zoom = arch.view.zoom || 1; }
      else this._fitView();
    }
    const vid = document.getElementById("netarch-bg");
    if (vid) {
      vid.muted = true;
      const play = () => vid.play().catch(() => {});
      if (vid.readyState >= 2) play();
      else vid.addEventListener("canplay", play, { once: true });
    }
  }
  _bindResizeObserver(container) {
    this._ro?.disconnect();
    this._ro = null;
    if (!container) return;
    this._ro = new ResizeObserver(() => {
      if (!this._canvas || !container.isConnected) return;
      this._canvas.width = container.clientWidth;
      this._canvas.height = container.clientHeight;
      this._drawMap();
    });
    this._ro.observe(container);
  }
  _drawMap() {
    if (!this._canvas || !this._ctx) return;
    const ctx = this._ctx;
    const netarch = loadNetarchs()[this._netarchId];
    if (!netarch) return;
    this._tileSlots = [];
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    ctx.strokeStyle = "rgba(66,211,234,0.08)";
    ctx.lineWidth = 1;
    for (let x = (this._scrollX % GRID); x < this._canvas.width; x += GRID) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this._canvas.height); ctx.stroke(); }
    for (let y = (this._scrollY % GRID); y < this._canvas.height; y += GRID) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(this._canvas.width, y); ctx.stroke(); }
    const vis = getVisibility(netarch.id, viewUserId(this));
    const visited = new Set(vis.visitedNodeIds || []);
    const pathfindered = vis.pathfindered || false;
    for (const conn of netarch.connections) {
      const fromNode = netarch.nodes.find(n => n.id === conn.from);
      const toNode = netarch.nodes.find(n => n.id === conn.to);
      if (!fromNode || !toNode) continue;
      const fx = this._sx(fromNode.x + floorSize(fromNode, netarch).w / 2);
      const fy = this._sy(fromNode.y + floorSize(fromNode, netarch).h);
      const tx = this._sx(toNode.x + floorSize(toNode, netarch).w / 2);
      const ty = this._sy(toNode.y);
      const connVis = isGM() || pathfindered || visited.has(fromNode.id) || visited.has(toNode.id) || fromNode.revealed || toNode.revealed;
      ctx.strokeStyle = connVis ? "rgba(66,211,234,0.5)" : "rgba(66,211,234,0.1)";
      ctx.lineWidth = connVis ? 2 : 1;
      ctx.lineJoin = "miter";
      ctx.lineCap = "butt";
      // 17 CANVAS DRAW — orthogonal only. No bezierCurveTo.
      ctx.setLineDash(connVis ? [] : [4, 4]);
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      if (Math.abs(fx - tx) < 1) {
        ctx.lineTo(tx, ty);
      } else if (Math.abs(fy - ty) < 1) {
        ctx.lineTo(tx, ty);
      } else {
        const midY = (fy + ty) / 2;
        ctx.lineTo(fx, midY);
        ctx.lineTo(tx, midY);
        ctx.lineTo(tx, ty);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
    for (const node of netarch.nodes) this._drawNode(ctx, node, netarch, visited, pathfindered);
    if (this._connecting && this._connecting !== "pending" && this._mousePos) {
      const fromNode = netarch.nodes.find(n => n.id === this._connecting);
      if (fromNode) {
        const px = this._sx(fromNode.x + NODE_W / 2);
        const py = this._sy(fromNode.y + NODE_H / 2);
        const mx = this._mousePos.x;
        const my = this._mousePos.y;
        ctx.strokeStyle = "#ff00ff"; ctx.lineWidth = 2; ctx.lineJoin = "miter"; ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(px, py);
        if (Math.abs(px - mx) < 1 || Math.abs(py - my) < 1) ctx.lineTo(mx, my);
        else { const midY = (py + my) / 2; ctx.lineTo(px, midY); ctx.lineTo(mx, midY); ctx.lineTo(mx, my); }
        ctx.stroke(); ctx.setLineDash([]);
      }
    }
    const runners = listRunners(netarch.id);
    for (const seat of runners) {
      const data = seat.data;
      const u = game.users.get(seat.userId) || game.user;
      const node = netarch.nodes.find(n => n.id === data.currentNodeId);
      if (!node) continue;
      const dragged = this._tokenDrag && this._tokenDrag.kind === "runner" && this._tokenDrag.actorId === seat.actorId;
      const point = dragged ? this._tokenDrag : this._tokenPoint(node, seat.key);
      this._drawRunnerToken(ctx, u, point.x, point.y, seat.actorId, seat.key);
      (data.companions || []).forEach((c, i) => {
        if (this._tokenDrag && this._tokenDrag.kind === "companion" && this._tokenDrag.pid === c.pid && this._tokenDrag.userId === u.id) return;
        const home = netarch.nodes.find(n => n.id === (c.nodeId || data.currentNodeId));
        if (!home) return;
        const spot = this._companionPoint(home, u.id, i);
        this._drawCompanionToken(ctx, c, spot.x, spot.y);
      });
    }
    if (this._tokenDrag && this._tokenDrag.kind === "companion") {
      this._drawCompanionToken(ctx, this._tokenDrag.ice, this._tokenDrag.x, this._tokenDrag.y);
    }
    if (this._tokenDrag && this._tokenDrag.kind === "ice") {
      const size = TOKEN_PX * (this._zoom || 1);
      this._paintIceToken(ctx, null, this._tokenDrag.ice, this._tokenDrag.index, this._tokenDrag.x - size / 2, this._tokenDrag.y - size / 2, size);
    }
    this._syncTileLayers();
  }
  _companionPoint(node, userId, index) {
    const size = this._tokenSize();
    const runners = game.users.contents.filter(u => u.active && getVisibility(loadNetarchs()[this._netarchId]?.id, u.id).currentNodeId === node.id).length;
    return {
      x: this._sx(node.x) + 10 * (this._zoom || 1) + size / 2 + (runners + index) * (size + 4),
      y: this._sy(node.y) + 58 * (this._zoom || 1) + size / 2
    };
  }
  _companionRez(ice) {
    const token = ice.tokenId ? canvas.tokens?.get(ice.tokenId) : null;
    const live = tokenRez(token);
    if (live) return live;
    const owner = game.users.get(ice.ownerId);
    const item = actorForAvatar(owner)?.items?.get(ice.pid);
    const rez = item?.system?.rez;
    if (rez && typeof rez === "object") return { cur: Number(rez.value ?? 0), max: Number(rez.max ?? rez.value ?? 0) };
    const cat = catalogEntry(ice.name);
    return { cur: Number(cat?.rez || 0), max: Number(cat?.rez || 0) };
  }
  _drawCompanionToken(ctx, ice, x, y) {
    const size = this._tokenSize();
    const ix = x - size / 2;
    const iy = y - size / 2;
    const src = iceImage(ice.name, ice.img);
    const img = src ? this._avatarImg(src) : null;
    ctx.fillStyle = "#05060a";
    ctx.fillRect(ix, iy, size, size);
    if (img && img.complete && img.naturalWidth) ctx.drawImage(img, ix, iy, size, size);
    else {
      ctx.fillStyle = "#ff073a";
      ctx.fillRect(ix, iy, size, size);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px Trebuchet MS";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText((ice.name || "?")[0].toUpperCase(), x, y);
    }
    ctx.strokeStyle = "#ff073a";
    ctx.lineWidth = 2;
    ctx.strokeRect(ix, iy, size, size);
    const rez = this._companionRez(ice);
    if (rez.max > 0) this._paintHpBar(ctx, ix, iy, size, rez.cur, rez.max);
    ctx.fillStyle = "#ff8aa0";
    ctx.font = `${Math.round(10 * (this._zoom || 1))}px Trebuchet MS`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText((ice.name || "").slice(0, 10), x, iy + size + 2);
  }
  _hitCompanion(px, py) {
    const netarch = loadNetarchs()[this._netarchId];
    if (!netarch) return null;
    const positions = getAllPositions(netarch.id);
    for (const u of game.users.contents.filter(u => u.active)) {
      const data = positions[`${netarch.id}::${u.id}`];
      if (!data?.currentNodeId) continue;
      const list = data.companions || [];
      for (let i = list.length - 1; i >= 0; i--) {
        const node = netarch.nodes.find(n => n.id === (list[i].nodeId || data.currentNodeId));
        if (!node) continue;
        const point = this._companionPoint(node, u.id, i);
        if (Math.abs(px - point.x) <= this._tokenSize() / 2 && Math.abs(py - point.y) <= this._tokenSize() / 2) {
          return { user: u, node, ice: list[i], index: i };
        }
      }
    }
    return null;
  }
  _tokenPoint(node, seatKey) {
    const netarch = loadNetarchs()[this._netarchId];
    const seats = listRunners(netarch?.id).filter(s => s.data.currentNodeId === node.id);
    const idx = Math.max(0, seats.findIndex(s => s.key === seatKey));
    const size = this._tokenSize();
    return {
      x: this._sx(node.x) + 10 * (this._zoom || 1) + size / 2 + idx * (size + 4),
      y: this._sy(node.y) + 18 * (this._zoom || 1) + size / 2
    };
  }
  _tokenSize() {
    return Math.round(TOKEN_PX * (this._zoom || 1));
  }
  _paintHpBar(ctx, ix, iy, size, cur, max) {
    const barW = size - 8;
    ctx.fillStyle = "#111";
    ctx.fillRect(ix + 4, iy + size - 8, barW, 5);
    ctx.fillStyle = cur <= 0 ? "#555" : cur / max < 0.34 ? "#ff073a" : "#39ff14";
    ctx.fillRect(ix + 4, iy + size - 8, Math.max(0, barW * (cur / Math.max(1, max))), 5);
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${Math.round(9 * (this._zoom || 1))}px Trebuchet MS`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(cur <= 0 ? "DEREZZED" : String(cur), ix + size / 2, iy + size - 8);
  }
  _drawRunnerToken(ctx, user, x, y, actorId, seatKey) {
    const actor = game.actors.get(actorId) || actorForAvatar(user);
    const avatar = netAvatarPath(actor) || actor?.img || "";
    const img = avatar ? this._avatarImg(avatar) : null;
    const size = this._tokenSize();
    const ix = x - size / 2;
    const iy = y - size / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(ix, iy, size, size);
    ctx.clip();
    if (img && img.complete && img.naturalWidth) ctx.drawImage(img, ix, iy, size, size);
    else {
      ctx.fillStyle = getUserColor(user.id);
      ctx.fillRect(ix, iy, size, size);
      ctx.fillStyle = "#000";
      ctx.font = "bold 11px Trebuchet MS";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText((actor?.name || user.name || "?")[0].toUpperCase(), x, y);
    }
    ctx.restore();
    const selected = actor?.id && actor.id === this._controlledActorId;
    ctx.strokeStyle = selected ? "#7dff8a" : (user?.isGM ? "#ffd36a" : "#42d3ea");
    ctx.lineWidth = selected ? 3 : 2;
    ctx.strokeRect(ix, iy, size, size);
    if (!(img && img.complete && img.naturalWidth)) {
      ctx.fillStyle = user?.isGM ? "#ffd36a" : "#42d3ea";
      ctx.fillRect(ix + 2, iy + 2, size - 4, size - 4);
    }
    ctx.fillStyle = "#fff";
    ctx.font = `bold ${Math.round(11 * (this._zoom || 1))}px Trebuchet MS`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(actor?.name || "Runner", x, iy + size + 3);
    const sceneToken = tokenForActor(actor);
    const targeted = this._mapperTarget?.key === ("runner:" + (seatKey || user.id)) || (sceneToken && game.user?.targets?.has(sceneToken));
    if (targeted) {
      ctx.strokeStyle = "#ff3b3b";
      ctx.lineWidth = 3;
      ctx.strokeRect(ix - 4, iy - 4, size + 6, size + 6);
    }
  }
  _hitRunnerToken(px, py) {
    const netarch = loadNetarchs()[this._netarchId];
    if (!netarch) return null;
    const hits = [];
    for (const seat of listRunners(netarch.id)) {
      const node = netarch.nodes.find(n => n.id === seat.data.currentNodeId);
      if (!node) continue;
      const point = this._tokenPoint(node, seat.key);
      if (Math.abs(px - point.x) <= this._tokenSize() / 2 && Math.abs(py - point.y) <= this._tokenSize() / 2) {
        hits.push({ user: game.users.get(seat.userId) || game.user, node, actorId: seat.actorId, key: seat.key });
      }
    }
    if (!hits.length) return null;
    hits.sort((a, b) => {
      const pa = this._tokenPoint(a.node, a.key);
      const pb = this._tokenPoint(b.node, b.key);
      return Math.hypot(px - pa.x, py - pa.y) - Math.hypot(px - pb.x, py - pb.y);
    });
    return hits[0];
  }
  _selectRunner(hit) {
    const actor = game.actors.get(hit?.actorId) || actorForAvatar(hit?.user);
    if (!actor) return;
    if (!isGM() && hit.user?.id !== game.user.id && !actor.isOwner) return;
    this._controlledActorId = actor.id;
    this._panelTab = "combat";
    this._reRender();
  }
  _avatarImg(path) {
    this._avatarCache = this._avatarCache || {};
    const src = netAvatarSrc(path);
    if (!this._avatarCache[src]) {
      const img = new Image();
      img.onload = () => this._drawMap?.();
      img.src = src;
      this._avatarCache[src] = img;
    }
    return this._avatarCache[src];
  }
  _drawNode(ctx, node, netarch, visited, pathfindered) {
    const x = this._sx(node.x);
    const y = this._sy(node.y);
    const w = this._snw(node);
    const h = this._snh(node);
    const canSeeAll = showArchHp(this) || pathfindered;
    const isVisited = visited.has(node.id);
    const isAdjacent = !canSeeAll && !isVisited && !node.revealed && netarch.connections.some(c =>
      (c.from === node.id && visited.has(c.to)) || (c.to === node.id && visited.has(c.from))
    );
    const known = showArchHp(this) || isVisited || node.revealed;
    const isVisible = canSeeAll || known;
    if (!isVisible && !isAdjacent) return;
    const vis = getVisibility(netarch.id, viewUserId(this));
    const isCurrent = isVisited && vis?.currentNodeId === node.id;
    const isSelected = this._selectedNode === node.id;
    const c = known ? (NODE_COLORS[node.type] || NODE_COLORS.Unknown) : NODE_COLORS.Unknown;
    ctx.fillStyle = c.bg;
    ctx.strokeStyle = isSelected ? "#fff" : c.border;
    ctx.lineWidth = isSelected ? 3 : isCurrent ? 2 : 1;
    const ch = 8 * (this._zoom || 1);
    ctx.beginPath();
    ctx.moveTo(x + ch, y); ctx.lineTo(x + w - ch, y); ctx.lineTo(x + w, y + ch);
    ctx.lineTo(x + w, y + h - ch); ctx.lineTo(x + w - ch, y + h);
    ctx.lineTo(x + ch, y + h); ctx.lineTo(x, y + h - ch); ctx.lineTo(x, y + ch);
    ctx.closePath();
    if (!(known && TILE_VIDEOS[node.type])) ctx.fill();
    ctx.stroke();
    const clip = new Path2D();
    clip.moveTo(x + ch, y); clip.lineTo(x + w - ch, y); clip.lineTo(x + w, y + ch);
    clip.lineTo(x + w, y + h - ch); clip.lineTo(x + w - ch, y + h);
    clip.lineTo(x + ch, y + h); clip.lineTo(x, y + h - ch); clip.lineTo(x, y + ch);
    clip.closePath();
    const tileSrc = known ? TILE_VIDEOS[node.type] : null;
    if (tileSrc) this._tileSlots.push({ src: tileSrc, x, y, w, h, ch });
    if (!known) {
      ctx.save();
      ctx.clip(clip);
      ctx.fillStyle = "#2a2a2a";
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    }
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    if (!known) {
      ctx.fillStyle = "#9ad"; ctx.font = `bold ${Math.round(28 * this._zoom)}px Trebuchet MS`;
      ctx.fillText("?", x + w / 2, y + h / 2);
    } else if (showArchHp(this)) {
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(x + 6, y + 6, w - 12, 42 * (this._zoom || 1));
      ctx.fillStyle = c.text; ctx.font = `bold ${Math.round(13 * this._zoom)}px Trebuchet MS`;
      ctx.fillText(node.type.toUpperCase(), x + w / 2, y + 20 * this._zoom);
      ctx.fillStyle = "#fff"; ctx.font = `${Math.round(15 * this._zoom)}px Trebuchet MS`;
      ctx.fillText((node.name || "Floor").slice(0, 22), x + w / 2, y + 40 * this._zoom);
    }
    if (known && node.blackIce?.length) this._drawFloorIce(ctx, node, x, y, w, h);
  }
  _iceSize(count, width) {
    return Math.round(TOKEN_PX * (this._zoom || 1));
  }
  _drawFloorIce(ctx, node, x, y, w, h) {
    const list = node.blackIce || [];
    const size = this._iceSize(list.length, w);
    const gap = 6 * (this._zoom || 1);
    const total = list.length * size + Math.max(0, list.length - 1) * gap;
    let ix = x + (w - total) / 2;
    const iy = y + h - size - 10 * (this._zoom || 1);
    list.forEach((ice, i) => {
      if (ice.hiddenFromPlayers && !showArchHp(this)) return;
      if (this._tokenDrag && this._tokenDrag.kind === "ice" && this._tokenDrag.nodeId === node.id && this._tokenDrag.index === i) return;
      this._paintIceToken(ctx, node, ice, i, ix, iy, size);
      ix += size + gap;
    });
  }
  _iceSpot(node, index) {
    const list = node.blackIce || [];
    const size = this._iceSize(list.length, this._snw(node));
    const gap = 6 * (this._zoom || 1);
    const total = list.length * size + Math.max(0, list.length - 1) * gap;
    const x = this._sx(node.x) + (this._snw(node) - total) / 2 + index * (size + gap);
    const y = this._sy(node.y) + this._snh(node) - size - 8 * (this._zoom || 1);
    return { x, y, size };
  }
  _paintIceToken(ctx, node, ice, i, ix, iy, size) {
    const src = iceImage(ice.name, ice.img);
    const img = src ? this._avatarImg(src) : null;
    const demon = (ice.kind || catalogEntry(ice.name)?.kind) === "demon";
    ctx.fillStyle = "#05060a";
    ctx.fillRect(ix, iy, size, size);
    if (img && img.complete && img.naturalWidth) ctx.drawImage(img, ix, iy, size, size);
    else {
      ctx.fillStyle = demon ? "#ff6600" : "#ff073a";
      ctx.font = `bold ${Math.round(16 * (this._zoom || 1))}px Trebuchet MS`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText((ice.name || String(i + 1)).slice(0, 6), ix + size / 2, iy + size / 2);
    }
    ctx.strokeStyle = ice.hiddenFromPlayers ? "#888" : (demon ? "#ff6600" : "#ff073a");
    ctx.lineWidth = 2;
    if (ice.hiddenFromPlayers) ctx.setLineDash([4, 3]);
    ctx.strokeRect(ix, iy, size, size);
    ctx.setLineDash([]);
    if (ice.hiddenFromPlayers && showArchHp(this)) {
      ctx.fillStyle = "#888";
      ctx.fillText("hidden", ix + size / 2, iy - 2);
    }
    const token = node ? this._sceneTokenForIce(node, i) : tokenForIceInstance(ice.name, i);
    const live = tokenRez(token);
    const max = Number(live?.max || ice.maxHp || ice.rez || catalogEntry(ice.name)?.rez || ice.hp || 0);
    const cur = Number(live?.cur ?? ice.hp ?? max);
    const friendly = !!ice.ownerId && ice.ownerId === game.user.id;
    const dead = !!(ice.derezzed || (max > 0 && cur <= 0));
    ctx.fillStyle = isGM() || friendly ? "#ffffff" : "#ff073a";
    ctx.font = `${Math.round(11 * (this._zoom || 1))}px Trebuchet MS`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(dead && !isGM() && !friendly ? "Derezzed" : (ice.name || "").slice(0, 12), ix + size / 2, iy + size + 2);
    if (max > 0 && showArchHp(this)) this._paintHpBar(ctx, ix, iy, size, cur, max);
    const iceKey = "ice:" + (node?.id || "") + ":" + i;
    if (this._mapperTarget?.key === iceKey || (token && game.user?.targets?.has(token))) {
      ctx.strokeStyle = "#ff3b3b";
      ctx.lineWidth = 3;
      ctx.strokeRect(ix - 4, iy - 4, size + 8, size + 8);
    }
  }
  _hitFloorIce(px, py, anyUser) {
    const netarch = loadNetarchs()[this._netarchId];
    if (!netarch || !(anyUser || isGM() || this._editMode)) return null;
    for (let n = netarch.nodes.length - 1; n >= 0; n--) {
      const node = netarch.nodes[n];
      const list = node.blackIce || [];
      for (let i = list.length - 1; i >= 0; i--) {
        const spot = this._iceSpot(node, i);
        if (px >= spot.x && px <= spot.x + spot.size && py >= spot.y && py <= spot.y + spot.size) {
          return { node, index: i, ice: list[i] };
        }
      }
    }
    return null;
  }

  /* ----- 18 CANVAS INPUT ----- */
  _bindCanvasEvents() {
    const canvas = this._canvas;
    if (!canvas || canvas.dataset.naBound === "1") return;
    canvas.dataset.naBound = "1";
    canvas.addEventListener("mousedown", e => this._onCanvasMouseDown(e));
    canvas.addEventListener("mousemove", e => this._onCanvasMouseMove(e));
    canvas.addEventListener("mouseup", e => this._onCanvasMouseUp(e));
    canvas.addEventListener("wheel", e => this._onCanvasWheel(e), { passive: false });
    canvas.addEventListener("contextmenu", e => { e.preventDefault(); this._onCanvasRightClick(e); });
    canvas.addEventListener("mouseleave", () => this._syncFoundryHover(null));
  }
  _portraitHit(pos) {
    const iceHit = this._hitFloorIce(pos.x, pos.y, true);
    if (iceHit) return { kind: "ice", key: "ice:" + iceHit.node.id + ":" + iceHit.index, node: iceHit.node, index: iceHit.index, ice: iceHit.ice };
    const comp = this._hitCompanion(pos.x, pos.y);
    if (comp) return { kind: "ice", key: "comp:" + comp.ice.pid, node: comp.node, index: 0, ice: comp.ice };
    const runner = this._hitRunnerToken(pos.x, pos.y);
    if (runner) return { kind: "runner", key: "runner:" + (runner.key || runner.user.id), user: runner.user, actorId: runner.actorId, seatKey: runner.key };
    return null;
  }
  _iceOccurrence(node, index) {
    const netarch = loadNetarchs()[this._netarchId];
    const ice = node?.blackIce?.[index];
    if (!netarch || !ice) return 0;
    let n = 0;
    for (const nd of netarch.nodes) {
      const list = nd.blackIce || [];
      for (let i = 0; i < list.length; i++) {
        if (nd.id === node.id && i === index) return n;
        if (list[i].name === ice.name) n++;
      }
    }
    return n;
  }
  _sceneTokenForIce(node, index) {
    const ice = node?.blackIce?.[index];
    if (!ice) return null;
    if (ice.tokenId) {
      const byId = canvas.tokens?.get(ice.tokenId);
      if (byId) return byId;
    }
    return tokenForIceInstance(ice.name, this._iceOccurrence(node, index));
  }
  _syncFoundryHover(pos) {
    const hit = pos ? this._portraitHit(pos) : null;
    const key = hit ? hit.key : "";
    if (key === this._hoverKey && (this._hoverToken || this._ensuring)) return;
    clearFoundryHover(this._hoverToken);
    this._hoverToken = null;
    this._hoverKey = key;
    this._hoverHit = hit;
    this._ensuring = null;
    if (!hit) return;
    if (hit.kind === "runner") {
      const token = tokenForActor(actorForAvatar(hit.user));
      this._hoverToken = token ? aimFoundryHover(token) : null;
      return;
    }
    const token = this._sceneTokenForIce(hit.node, hit.index);
    if (token) {
      hit.ice.tokenId = token.id;
      this._hoverToken = aimFoundryHover(token);
      return;
    }
    this._ensureIceHover(hit);
  }
  _ensureIceHover(hit) {
    if (this._ensuring === hit.key) return;
    this._ensuring = hit.key;
    const occurrence = this._iceOccurrence(hit.node, hit.index);
    ensureSceneToken(findIceActorByName(hit.ice.name), hit.ice.name, occurrence, iceUid(hit.ice, hit.node, hit.index)).then(token => {
      if (this._ensuring === hit.key) this._ensuring = null;
      if (this._hoverKey !== hit.key || !token) return;
      hit.ice.tokenId = token.id;
      this._hoverToken = aimFoundryHover(token);
    }).catch(err => {
      if (this._ensuring === hit.key) this._ensuring = null;
      console.warn("Netarch token", err);
    });
  }
  _onTargetKey(event) {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.code !== "KeyT" && event.key !== "t" && event.key !== "T") return;
    const tag = event.target?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || event.target?.isContentEditable) return;
    if (!this._hoverHit && this._mousePos) this._syncFoundryHover(this._mousePos);
    const hit = this._hoverHit;
    if (!hit) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this._targetHovered(event.shiftKey);
  }
  _setMapperTarget(hit) {
    if (!hit) return;
    if (this._mapperTarget?.key && this._mapperTarget.key === hit.key) {
      this._mapperTarget = null;
      this._drawMap?.();
      return;
    }
    const actor = game.actors.get(hit.actorId);
    const name = actor?.name || hit.ice?.name || hit.user?.name || "Target";
    this._mapperTarget = { kind: hit.kind, name, actorId: hit.actorId || actor?.id || null, key: hit.key || null, nodeId: hit.node?.id || null, index: hit.index };
    this._drawMap?.();
  }
  async _targetHovered(shift) {
    const hit = this._hoverHit;
    if (!hit) return;
    this._setMapperTarget(hit);
    let token = this._hoverToken;
    if (!token && hit.kind === "ice") token = this._sceneTokenForIce(hit.node, hit.index);
    if (!token && hit.kind === "runner") token = tokenForActor(game.actors.get(hit.actorId));
    if (!token) return;
    const view = canvasView();
    this._hoverToken = aimFoundryHover(token);
    foundryTargetHovered(shift);
    restoreCanvasView(view);
  }
  _canvasPos(e) {
    const rect = this._canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
  _getNodeAt(px, py) {
    const netarch = loadNetarchs()[this._netarchId];
    if (!netarch) return null;
    for (let i = netarch.nodes.length - 1; i >= 0; i--) {
      const n = netarch.nodes[i];
      const nx = this._sx(n.x), ny = this._sy(n.y);
      if (px >= nx && px <= nx + this._snw(n) && py >= ny && py <= ny + this._snh(n)) return n;
    }
    return null;
  }
  async _onCanvasMouseDown(e) {
    const pos = this._canvasPos(e);
    const node = this._getNodeAt(pos.x, pos.y);
    if (e.button === 1) { this._isPanning = true; this._panStart = { x: e.clientX - this._scrollX, y: e.clientY - this._scrollY }; return; }
    if (e.button !== 0) return;
    if (this._connecting) {
      if (this._connecting === "pending") {
        if (node) { this._connecting = node.id; this._drawMap(); }
        else { this._connecting = null; this._reRender(); }
      } else if (node && node.id !== this._connecting) {
        await this._addConnection(this._connecting, node.id);
        this._connecting = null; this._reRender();
      } else if (!node) { this._connecting = null; this._reRender(); }
      return;
    }
    if (this._deleteMode && node) { this._deleteMode = false; await this._deleteNode(node.id); this._reRender(); return; }
    const iceHit = this._hitFloorIce(pos.x, pos.y);
    if (iceHit) {
      this._tokenDrag = { kind: "ice", nodeId: iceHit.node.id, index: iceHit.index, ice: iceHit.ice, x: pos.x, y: pos.y };
      this._canvas.style.cursor = "grabbing";
      this._scheduleDraw();
      return;
    }
    const compHit = !this._editMode ? this._hitCompanion(pos.x, pos.y) : null;
    if (compHit && (compHit.user.id === game.user.id || isGM())) {
      this._tokenDrag = { kind: "companion", userId: compHit.user.id, pid: compHit.ice.pid, ice: compHit.ice, x: pos.x, y: pos.y, fromId: compHit.node.id };
      this._canvas.style.cursor = "grabbing";
      return;
    }
    const tokenHit = !this._editMode ? this._hitRunnerToken(pos.x, pos.y) : null;
    const own = tokenHit && (tokenHit.user?.id === game.user.id || tokenHit.actorId && game.actors.get(tokenHit.actorId)?.isOwner);
    if (tokenHit && (isGM() || own)) {
      this._tokenDrag = { kind: "runner", userId: tokenHit.user.id, actorId: tokenHit.actorId, key: tokenHit.key, x: pos.x, y: pos.y, startX: pos.x, startY: pos.y, fromId: tokenHit.node.id };
      this._canvas.style.cursor = "grabbing";
      return;
    }
    if (node) {
      if (this._editMode) {
        this._selectedNode = node.id;
        this._dragging = { nodeId: node.id, startX: pos.x, startY: pos.y, origX: node.x, origY: node.y };
        this._reRender();
      } else await this._onPlayerClickNode(node);
    } else {
      this._isPanning = true;
      this._panStart = { x: e.clientX - this._scrollX, y: e.clientY - this._scrollY };
      if (this._editMode && this._selectedNode) { this._selectedNode = null; this._reRender(); }
    }
  }
  _onCanvasMouseMove(e) {
    const pos = this._canvasPos(e);
    this._mousePos = pos;
    if (this._isPanning) { this._scrollX = e.clientX - this._panStart.x; this._scrollY = e.clientY - this._panStart.y; this._scheduleDraw(); return; }
    if (this._tokenDrag) {
      this._tokenDrag.x = pos.x;
      this._tokenDrag.y = pos.y;
      this._canvas.style.cursor = "grabbing";
      this._scheduleDraw();
      return;
    }
    if (this._dragging) {
      const node = loadNetarchs()[this._netarchId]?.nodes.find(n => n.id === this._dragging.nodeId);
      if (node) {
        const z = this._zoom || 1;
        node.x = Math.round((this._dragging.origX + (pos.x - this._dragging.startX) / z) / GRID) * GRID;
        node.y = Math.round((this._dragging.origY + (pos.y - this._dragging.startY) / z) / GRID) * GRID;
        this._scheduleDraw();
      }
      return;
    }
    if (this._connecting) this._scheduleDraw();
    this._canvas.style.cursor = this._tokenDrag ? "grabbing" : (this._hitFloorIce(pos.x, pos.y) || this._hitCompanion(pos.x, pos.y) || this._hitRunnerToken(pos.x, pos.y) ? "grab" : (this._getNodeAt(pos.x, pos.y) ? "pointer" : "grab"));
    this._syncFoundryHover(pos);
  }
  async _onCanvasMouseUp(e) {
    this._isPanning = false;
    if (this._tokenDrag) {
      const drag = this._tokenDrag;
      this._tokenDrag = null;
      const pos = this._canvasPos(e);
      const node = this._getNodeAt(pos.x, pos.y);
      if (drag.kind === "ice") await this._dropIceToken(drag, node);
      else if (drag.kind === "companion") await this._dropCompanionToken(drag, node);
      else {
        const moved = Math.hypot((pos.x - (drag.startX || pos.x)), (pos.y - (drag.startY || pos.y)));
        if (moved < 6) this._selectRunner(drag);
        else await this._dropRunnerToken(drag, node);
      }
      this._drawMap();
      return;
    }
    if (this._dragging) {
      const netarchs = loadNetarchs();
      if (netarchs[this._netarchId]) await saveNetarchs(netarchs);
      this._dragging = null; this._drawMap();
    }
  }
  _onCanvasWheel(e) {
    e.preventDefault();
    const pos = this._canvasPos(e);
    this._bumpZoom(e.deltaY > 0 ? -1 : 1, pos.x, pos.y);
  }
  _onCanvasRightClick(e) {
    const pos = this._canvasPos(e);
    const runner = this._hitRunnerToken(pos.x, pos.y);
    if (isGM()) {
      const iceHit = this._hitFloorIce(pos.x, pos.y, true);
      if (iceHit) {
        document.getElementById("na-ctx-menu")?.remove();
        const menu = document.createElement("div");
        menu.id = "na-ctx-menu";
        menu.style.cssText = `position:fixed;z-index:9999;left:${e.clientX}px;top:${e.clientY}px;background:#0a0a14;border:1px solid #42d3ea;padding:8px;min-width:160px;font-family:monospace;`;
        menu.innerHTML = `<div style="color:#42d3ea;font-size:11px;font-weight:bold;margin-bottom:6px;">${iceHit.ice.name}</div>
          <button id="na-ctx-hide-ice" style="width:100%;padding:3px;background:transparent;border:1px solid #ff073a;color:#ff073a;cursor:pointer;">${iceHit.ice.hiddenFromPlayers ? "Show to players" : "Hide from players"}</button>`;
        document.body.appendChild(menu);
        menu.querySelector("#na-ctx-hide-ice").addEventListener("click", async () => {
          menu.remove();
          const all = loadNetarchs();
          const node = all[this._netarchId]?.nodes.find(n => n.id === iceHit.node.id);
          const ice = node?.blackIce?.[iceHit.index];
          if (!ice) return;
          ice.hiddenFromPlayers = !ice.hiddenFromPlayers;
          await saveNetarchs(all);
          this._drawMap();
        });
        setTimeout(() => document.addEventListener("click", () => menu.remove(), { once: true }), 0);
        return;
      }
    }
    if (runner && (isGM() || runner.user?.id === game.user.id)) {
      const actor = game.actors.get(runner.actorId) || actorForAvatar(runner.user);
      if (!actor) return;
      document.getElementById("na-ctx-menu")?.remove();
      const menu = document.createElement("div");
      menu.id = "na-ctx-menu";
      menu.style.cssText = `position:fixed;z-index:9999;left:${e.clientX}px;top:${e.clientY}px;background:#0a0a14;border:1px solid #42d3ea;padding:8px;min-width:160px;font-family:monospace;`;
      menu.innerHTML = `<div style="color:#42d3ea;font-size:11px;font-weight:bold;margin-bottom:6px;">${actor.name}</div>
        <button id="na-ctx-avatar" style="width:100%;margin-bottom:4px;padding:3px;background:transparent;border:1px solid #39ff14;color:#39ff14;cursor:pointer;">Change portrait</button>
        <button id="na-ctx-clear" style="width:100%;padding:3px;background:transparent;border:1px solid #ff073a;color:#ff073a;cursor:pointer;">Clear portrait</button>`;
      document.body.appendChild(menu);
      menu.querySelector("#na-ctx-avatar").addEventListener("click", () => { menu.remove(); this._uploadAvatar(actor.id); });
      menu.querySelector("#na-ctx-clear").addEventListener("click", () => { menu.remove(); this._clearAvatar(actor.id); });
      setTimeout(() => document.addEventListener("click", () => menu.remove(), { once: true }), 0);
      return;
    }
    const hit = this._getNodeAt(pos.x, pos.y);
    if (!hit) return;
    if (!this._editMode && !(isGM() && hit.type === "Password")) return;
    document.getElementById("na-ctx-menu")?.remove();
    const menu = document.createElement("div");
    menu.id = "na-ctx-menu";
    menu.style.cssText = `position:fixed;z-index:9999;left:${e.clientX}px;top:${e.clientY}px;background:#0a0a14;border:1px solid #42d3ea;padding:8px;min-width:160px;font-family:monospace;`;
    menu.innerHTML = `<div style="color:#42d3ea;font-size:11px;font-weight:bold;margin-bottom:6px;">${hit.name || hit.type}</div>
      <button id="na-ctx-reveal" style="width:100%;margin-bottom:4px;padding:3px;background:transparent;border:1px solid #39ff14;color:#39ff14;cursor:pointer;">${hit.revealed ? "Hide Node" : "Reveal Node"}</button>
      ${hit.type === "Password" ? `<button id="na-ctx-pass" style="width:100%;margin-bottom:4px;padding:3px;background:transparent;border:1px solid #ffff00;color:#ffff00;cursor:pointer;">${hit.unlocked ? "Lock Password" : "Unlock Password"}</button>` : ""}
      <button id="na-ctx-entry" style="width:100%;padding:3px;background:transparent;border:1px solid #39ff14;color:#39ff14;cursor:pointer;">Set as Entry Node</button>`;
    document.body.appendChild(menu);
    menu.querySelector("#na-ctx-reveal").addEventListener("click", async () => { menu.remove(); await this._toggleReveal(hit.id); });
    menu.querySelector("#na-ctx-pass")?.addEventListener("click", async () => {
      menu.remove();
      const all = loadNetarchs();
      const node = all[this._netarchId]?.nodes?.find(n => n.id === hit.id);
      if (!node) return;
      node.unlocked = !node.unlocked;
      await saveNetarchs(all);
      ui.notifications.info((node.name || "Password") + (node.unlocked ? " unlocked." : " locked."));
      this._refreshLive();
    });
    menu.querySelector("#na-ctx-entry").addEventListener("click", async () => {
      menu.remove();
      const netarchs = loadNetarchs();
      const arch = netarchs[this._netarchId];
      if (!arch) return;
      arch.entryNodeId = hit.id;
      const entryNode = arch.nodes.find(n => n.id === hit.id);
      if (entryNode) entryNode.revealed = true;
      await saveNetarchs(netarchs);
      ui.notifications.info("Entry node set to: " + (hit.name || hit.type));
      this._reRender();
    });
    const closeMenu = ev => { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener("mousedown", closeMenu); } };
    setTimeout(() => document.addEventListener("mousedown", closeMenu), 50);
  }
  /* ----- 19 PLAYER MOVEMENT ----- */
  async _maybeTraverse(node, drag) {
    if (!/Link$/.test(node?.type) || !node.linkArchId) return;
    const dest = loadNetarchs()[node.linkArchId];
    if (!dest?.entryNodeId) { ui.notifications.warn("That link has no destination entry."); return; }
    const userId = drag?.userId || game.user.id;
    const actorId = drag?.actorId || this._controlledActorId;
    const seat = { currentNodeId: dest.entryNodeId, visitedNodeIds: [dest.entryNodeId], pathfindered: false, companions: [], actorId, userId, jackLink: "physical" };
    const positions = loadPositions();
    positions[dest.id + "::" + userId] = seat;
    await savePositions(positions);
    emitBoth("netarch-seat", { id: dest.id, key: dest.id + "::" + userId, seat });
    this._netarchId = dest.id;
    ui.notifications.info((node.type) + " to " + dest.name + ".");
  }
  async _onPlayerClickNode(node) {
    const netarch = loadNetarchs()[this._netarchId];
    if (!netarch) return;
    const vis = getVisibility(netarch.id, game.user.id);
    if (!vis.currentNodeId) {
      if (isGM()) { this._selectedNode = node.id; this._refreshLive(); return; }
      ui.notifications.warn("Jack in first using the Jack in button.");
      return;
    }
    if (node.id === vis.currentNodeId) return;
    if (passwallBlocks(netarch, vis.currentNodeId)) { ui.notifications.warn("That Password is still locked."); return; }
    if (!getAdjacentIds(netarch, vis.currentNodeId).includes(node.id)) { ui.notifications.warn("You can only move to adjacent nodes."); return; }
    await setVisibility(netarch.id, game.user.id, {
      currentNodeId: node.id,
      visitedNodeIds: [...new Set([...(vis.visitedNodeIds || []), node.id])],
      pathfindered: vis.pathfindered
    });
    this._selectedNode = node.id;
    await this._maybeTraverse(node);
    this._reRender();
  }
  async _dropRunnerToken(drag, node) {
    const netarch = loadNetarchs()[this._netarchId];
    if (!netarch || !node) return;
    const actor = game.actors.get(drag.actorId);
    if (!isGM() && drag.userId !== game.user.id && !actor?.isOwner) return;
    const positions = loadPositions();
    const seat = positions[drag.key] || getVisibility(netarch.id, drag.userId);
    if (!seat?.currentNodeId) { ui.notifications.warn("Jack in first."); return; }
    if (node.id === seat.currentNodeId) return;
    if (!isGM() && passwallBlocks(netarch, seat.currentNodeId)) { ui.notifications.warn("That Password is still locked."); return; }
    if (!getAdjacentIds(netarch, seat.currentNodeId).includes(node.id)) {
      ui.notifications.warn("Drop the token on a connected floor.");
      return;
    }
    const next = {
      currentNodeId: node.id,
      visitedNodeIds: [...new Set([...(seat.visitedNodeIds || []), node.id])],
      pathfindered: seat.pathfindered,
      companions: seat.companions || [],
      actorId: drag.actorId || seat.actorId || null,
      userId: drag.userId
    };
    if (String(drag.key || "").includes("::actor::")) await setActorPresence(netarch.id, drag.actorId, next);
    else await setVisibility(netarch.id, drag.userId, next);
    this._selectedNode = node.id;
    this._controlledActorId = drag.actorId || this._controlledActorId;
    await this._maybeTraverse(node, drag);
    this._reRender();
  }
  async _dropCompanionToken(drag, node) {
    const netarch = loadNetarchs()[this._netarchId];
    if (!netarch || !node) return;
    if (drag.userId !== game.user.id && !isGM()) return;
    const vis = getVisibility(netarch.id, drag.userId);
    if (!vis.currentNodeId && !isGM()) { ui.notifications.warn("Jack in first."); return; }
    const companions = [...(vis.companions || [])];
    const ice = companions.find(c => c.pid === drag.pid);
    if (!ice) return;
    const fromId = ice.nodeId || vis.currentNodeId;
    if (node.id === fromId) return;
    if (!getAdjacentIds(netarch, fromId).includes(node.id)) {
      ui.notifications.warn("Drop the ICE on a connected floor.");
      return;
    }
    ice.nodeId = node.id;
    await setVisibility(netarch.id, drag.userId, {
      currentNodeId: vis.currentNodeId,
      visitedNodeIds: vis.visitedNodeIds || [],
      pathfindered: vis.pathfindered,
      companions
    });
    this._drawMap?.();
  }
  async _dropIceToken(drag, node) {
    const netarchs = loadNetarchs();
    const netarch = netarchs[this._netarchId];
    if (!netarch || !node) return;
    const from = netarch.nodes.find(n => n.id === drag.nodeId);
    if (!from || !from.blackIce || node.id === from.id) return;
    const ice = from.blackIce[drag.index];
    if (!ice) return;
    const demon = (ice.kind || catalogEntry(ice.name)?.kind) === "demon";
    if (demon && (node.blackIce || []).some(b => (b.kind || catalogEntry(b.name)?.kind) === "demon")) {
      ui.notifications.warn("Only 1 Demon per floor.");
      return;
    }
    from.blackIce.splice(drag.index, 1);
    node.blackIce = node.blackIce || [];
    node.blackIce.push(ice);
    netarch.budget = computeBudget(netarch);
    await saveNetarchs(netarchs);
    this._selectedNode = node.id;
    this._reRender();
  }
  /* ----- 20 NODE EDIT ACTIONS ----- */
  async _addNode() {
    const netarchs = loadNetarchs();
    const netarch = netarchs[this._netarchId];
    if (!netarch) return;
    const z = this._zoom || 1;
    const x = Math.round(((this._canvas.width / 2 - this._scrollX) / z - NODE_W / 2) / GRID) * GRID;
    const y = Math.round(((this._canvas.height / 2 - this._scrollY) / z - NODE_H / 2) / GRID) * GRID;
    const node = newNode(x, y);
    netarch.nodes.push(node);
    netarch.budget = computeBudget(netarch);
    await saveNetarchs(netarchs);
    this._selectedNode = node.id;
    this._reRender();
  }
  async _addConnection(fromId, toId) {
    const netarchs = loadNetarchs();
    const netarch = netarchs[this._netarchId];
    if (!netarch) return;
    const exists = netarch.connections.some(c => (c.from === fromId && c.to === toId) || (c.from === toId && c.to === fromId));
    if (exists) return;
    netarch.connections.push({ id: randomId(), from: fromId, to: toId });
    await saveNetarchs(netarchs);
  }
  async _deleteNode(nodeId) {
    const netarchs = loadNetarchs();
    const netarch = netarchs[this._netarchId];
    if (!netarch) return;
    netarch.nodes = netarch.nodes.filter(n => n.id !== nodeId);
    netarch.connections = netarch.connections.filter(c => c.from !== nodeId && c.to !== nodeId);
    if (this._selectedNode === nodeId) this._selectedNode = null;
    netarch.budget = computeBudget(netarch);
    await saveNetarchs(netarchs);
    this._reRender();
  }
  async _saveNodeEdit() {
    const netarchs = loadNetarchs();
    const node = netarchs[this._netarchId]?.nodes.find(n => n.id === this._selectedNode);
    if (!node) return;
    node.type = document.getElementById("ne-type")?.value || node.type;
    node.name = document.getElementById("ne-name")?.value || "";
    node.dv = parseInt(document.getElementById("ne-dv")?.value) || 6;
    node.notes = document.getElementById("ne-notes")?.value || "";
    node.revealed = document.getElementById("ne-revealed")?.checked ?? false;
    node.linkArchId = document.getElementById("ne-link-arch")?.value || node.linkArchId || null;
    netarchs[this._netarchId].budget = computeBudget(netarchs[this._netarchId]);
    await saveNetarchs(netarchs);
    this._reRender();
  }
  async _addPicked(kind) {
    const netarchs = loadNetarchs();
    const node = netarchs[this._netarchId]?.nodes.find(n => n.id === this._selectedNode);
    if (!node) { ui.notifications.warn("Select a node first."); return; }
    if (iceForbidden(node)) { ui.notifications.warn("Black ICE and Demons cannot go on Files, Control Nodes, Passwalls, or Root."); return; }
    const sel = document.getElementById(kind === "demon" ? "na-demon-pick" : "na-ice-pick");
    const name = sel?.value;
    if (!name) return;
    node.blackIce = node.blackIce || [];
    if (kind === "demon") {
      const floors = netarchs[this._netarchId].nodes.length;
      const demonCount = netarchs[this._netarchId].nodes.reduce((n, nd) => n + (nd.blackIce || []).filter(b => catalogEntry(b.name)?.kind === "demon").length, 0);
      if (demonCount >= Math.max(1, Math.floor(floors / 6))) {
        ui.notifications.warn("Only 1 Demon per 6 floors.");
        return;
      }
      if ((node.blackIce || []).some(b => catalogEntry(b.name)?.kind === "demon")) {
        ui.notifications.warn("Only 1 Demon per floor.");
        return;
      }
    }
    node.blackIce.push(iceInstance(name));
    if (kind === "demon" && node.type !== "Demon") node.type = node.type;
    netarchs[this._netarchId].budget = computeBudget(netarchs[this._netarchId]);
    await saveNetarchs(netarchs);
    this._reRender();
  }
  _stripVisited(ids) {
    const positions = loadPositions();
    const drop = new Set(ids);
    for (const seat of Object.values(positions)) {
      if (!seat?.visitedNodeIds) continue;
      seat.visitedNodeIds = seat.visitedNodeIds.filter(id => !drop.has(id));
    }
    return savePositions(positions);
  }
  async _toggleReveal(nodeId) {
    const netarchs = loadNetarchs();
    const node = netarchs[this._netarchId]?.nodes.find(n => n.id === nodeId);
    if (!node) return;
    node.revealed = !node.revealed;
    await saveNetarchs(netarchs);
    if (!node.revealed) await this._stripVisited([nodeId]);
    this._drawMap();
    this._refreshLive();
  }
  async _revealAll() {
    const netarchs = loadNetarchs();
    netarchs[this._netarchId]?.nodes.forEach(n => { n.revealed = true; });
    await saveNetarchs(netarchs); this._reRender();
  }
  async _hideAll() {
    const netarchs = loadNetarchs();
    const arch = netarchs[this._netarchId];
    if (!arch) return;
    arch.nodes.forEach(n => { n.revealed = false; });
    await saveNetarchs(netarchs);
    await this._stripVisited(arch.nodes.map(n => n.id));
    this._reRender();
  }

  async _spendAction() {
    const actor = this._combatActor();
    const sheet = readNetSheet(actor);
    if (!sheet) return false;
    this._actionsByActor = this._actionsByActor || {};
    const used = this._actionsByActor[actor.id] || 0;
    if (used >= sheet.netActions) { ui.notifications.warn("No NET Actions left this turn."); return false; }
    this._actionsByActor[actor.id] = used + 1;
    const positions = loadPositions();
    const key = Object.keys(positions).find(k => k.endsWith("::" + actor.id) || positions[k]?.actorId === actor.id);
    if (key) {
      positions[key].actionsUsed = this._actionsByActor[actor.id];
      savePositions(positions);
    }
    return true;
  }
  async _rollInterface(ability) {
    const actor = this._combatActor();
    if (!actor) { ui.notifications.warn("No character assigned to this user."); return; }
    if (ability !== "Scanner" && !(await this._spendAction())) return;
    if (ability === "Scanner") ui.notifications.info("Scanner is a Meat Action, not a NET Action.");
    const official = await callSheetNetRoll(actor, { interfaceAbility: IFACE_KEY[ability] || ability.toLowerCase() });
    if (official?.cancelled && ability !== "Scanner") this._actionsUsed = Math.max(0, (this._actionsUsed || 1) - 1);
    this._refreshLive();
  }
  async _rollSpeed() {
    const actor = this._combatActor();
    if (!actor) return;
    const official = await callSheetNetRoll(actor, { interfaceAbility: "speed" });
    if (!official) ui.notifications.warn("Speed must roll from the character sheet.");
    this._refreshLive();
  }
  async _rollDefense() {
    const actor = this._combatActor();
    if (!actor) return;
    const official = await callSheetNetRoll(actor, { interfaceAbility: "defense" });
    if (!official) ui.notifications.warn("Defense must roll from the character sheet.");
    this._refreshLive();
  }
  async _toggleRez(pid) {
    const actor = this._combatActor();
    const item = actor?.items.get(pid);
    if (!item) return;
    if (isAttackerProgram(item)) {
      ui.notifications.info(`${item.name} is an attacker. It has no Rez.`);
      return;
    }
    if (!needsRezToAct(item)) return;
    if (!(await this._spendAction())) return;
    const rezzed = !item.system.isRezzed;
    try { await item.update({ "system.isRezzed": rezzed }); }
    catch (err) { ui.notifications.error(err.message); this._actionsUsed = Math.max(0, this._actionsUsed - 1); return; }
    if (isBlackIceProgram(item)) await this._syncCompanion(item, rezzed);
    this._refreshLive();
  }
  async _syncCompanion(item, rezzed) {
    const netarch = loadNetarchs()[this._netarchId];
    if (!netarch) { ui.notifications.warn("Open the architecture before rezzing ICE."); return; }
    const vis = getVisibility(netarch.id, game.user.id);
    const companions = [...(vis.companions || [])].filter(c => c.pid !== item.id);
    if (rezzed) {
      const view = canvasView();
      const actor = findIceActorByName(item.name);
      const token = actor ? await ensureSceneToken(actor, item.name, companions.length) : null;
      restoreCanvasView(view);
      requestAnimationFrame(() => restoreCanvasView(view));
      companions.push({ pid: item.id, name: item.name, img: item.img || iceImage(item.name, ""), tokenId: token?.id || null, ownerId: game.user.id, nodeId: vis.currentNodeId });
      ui.notifications.info(item.name + " is on your floor. Drag that token on its own.");
    }
    await setVisibility(netarch.id, game.user.id, {
      currentNodeId: vis.currentNodeId,
      visitedNodeIds: vis.visitedNodeIds || [],
      pathfindered: vis.pathfindered,
      companions
    });
    this._drawMap?.();
  }
  async _toggleFloorRez(idx) {
    const all = loadNetarchs();
    const netarch = all[this._netarchId];
    const node = netarch?.nodes.find(n => n.id === this._selectedNode);
    const ice = node?.blackIce?.[Number(idx)];
    if (!ice) return;
    ice.rezzed = !ice.rezzed;
    await saveNetarchs(all);
    this._refreshLive();
  }
  async _programAttack(pid) {
    const actor = this._combatActor();
    const item = actor?.items.get(pid);
    if (!item) return;
    if (!isAttackerProgram(item)) {
      ui.notifications.warn("Only attacker programs use ATK only.");
      return;
    }
    if (!(await this._spendAction())) return;
    const official = await callSheetNetRoll(actor, { programId: item.id, executionType: "atk" });
    if (official?.cancelled) this._actionsUsed = Math.max(0, (this._actionsUsed || 1) - 1);
    else if (!official) ui.notifications.warn(`${item.name} ATK must roll from the cyberdeck sheet.`);
    this._refreshLive();
  }
  async _iceStat(idx, stat) {
    const netarch = loadNetarchs()[this._netarchId];
    const node = netarch?.nodes.find(n => n.id === this._selectedNode);
    const ice = node?.blackIce?.[Number(idx)];
    if (!ice) { ui.notifications.warn("Select a floor that has ICE."); return; }
    await rollIceProgramStat(ice, stat);
    this._refreshLive();
  }
  async _iceDamage(idx) {
    const netarch = loadNetarchs()[this._netarchId];
    const node = netarch?.nodes.find(n => n.id === this._selectedNode);
    const ice = node?.blackIce?.[Number(idx)];
    if (!ice) { ui.notifications.warn("Select a floor that has ICE."); return; }
    await rollIceProgramDamage(ice);
    this._refreshLive();
  }
  async _programStat(pid, stat) {
    const actor = this._combatActor();
    const item = actor?.items.get(pid);
    if (!item) return;
    if (isBlackIceProgram(item) && !item.system?.isRezzed) {
      ui.notifications.warn(`${item.name} must be Rezzed first.`);
      return;
    }
    const official = await callSheetNetRoll(actor, { programId: item.id, executionType: stat });
    if (!official) ui.notifications.warn(`${item.name} ${stat} must roll from the cyberdeck sheet.`);
    this._refreshLive();
  }
  async _programDamage(pid) {
    const actor = this._combatActor();
    const item = actor?.items.get(pid);
    if (!item) return;
    if (isBlackIceProgram(item) && !item.system?.isRezzed) {
      ui.notifications.warn(`${item.name} must be Rezzed first.`);
      return;
    }
    const target = currentDamageTarget();
    const soak = armorSoak(target);
    const official = await callSheetNetRoll(actor, { programId: item.id, executionType: "damage" });
    if (!official) ui.notifications.warn(`${item.name} damage must roll from the cyberdeck sheet.`);
    this._refreshLive();
  }

  async _rerezFloorIce(idx) {
    if (!isGM()) return;
    const all = loadNetarchs();
    const netarch = all[this._netarchId];
    const node = netarch?.nodes.find(n => n.id === this._selectedNode) || netarch?.nodes.find(n => n.id === getVisibility(netarch.id, game.user.id).currentNodeId);
    const ice = node?.blackIce?.[Number(idx)];
    if (!ice) { ui.notifications.warn("Select a floor that has ICE."); return; }
    await writeIceRez(ice);
    netarch.budget = computeBudget(netarch);
    await saveNetarchs(all);
    ui.notifications.info(ice.name + " HP restored.");
    this._refreshLive();
  }
  async _rerezAllIce() {
    if (!isGM()) return;
    const all = loadNetarchs();
    const netarch = all[this._netarchId];
    if (!netarch) return;
    await rerezArchitecture(netarch);
    netarch.budget = computeBudget(netarch);
    await saveNetarchs(all);
    ui.notifications.info("Architecture ICE HP restored.");
    this._refreshLive();
  }
  async _destroyFloorIce(idx) {
    if (!isGM()) return;
    const all = loadNetarchs();
    const netarch = all[this._netarchId];
    const node = netarch?.nodes.find(n => n.id === this._selectedNode) || netarch?.nodes.find(n => n.id === getVisibility(netarch.id, game.user.id).currentNodeId);
    const ice = node?.blackIce?.[Number(idx)];
    if (!ice) return;
    if (!confirm("Destroy " + ice.name + " on this floor?")) return;
    const token = ice.tokenId ? canvas.tokens?.get(ice.tokenId) : null;
    if (token?.document?.hidden) {
      try { await token.document.delete(); } catch (err) { console.warn("Netarch token delete", err); }
    }
    node.blackIce.splice(Number(idx), 1);
    netarch.budget = computeBudget(netarch);
    await saveNetarchs(all);
    ui.notifications.info(ice.name + " destroyed.");
    this._refreshLive();
  }
  async _destroyProgram(pid) {
    const actor = this._combatActor();
    const item = actor?.items?.get(pid);
    if (!item) return;
    if (!confirm("Destroy " + item.name + "? This deletes it from the sheet and cyberdeck.")) return;
    const ok = await destroyRunnerProgram(actor, pid);
    if (ok) ui.notifications.info(item.name + " destroyed.");
    this._refreshLive();
  }
  async _reRender() {
    if (this._mode === "map" && this.element?.[0]?.querySelector("#na-side-body")) {
      this._refreshLive();
      return;
    }
    await this.render(true);
  }
  _refreshLive() {
    const netarch = loadNetarchs()[this._netarchId];
    if (!netarch) { this.render(true); return; }
    const allowed = isGM() ? ["floors", "rules", "combat", "budget", "runners", "edit"] : ["rules", "combat", "runners"];
    const tab = allowed.includes(this._panelTab) ? this._panelTab : (isGM() ? "floors" : "combat");
    this._panelTab = tab;
    const bud = computeBudget(netarch);
    netarch.budget = bud;
    const vis = getVisibility(netarch.id, game.user.id);
    const body = this.element?.[0]?.querySelector("#na-side-body");
    if (body) {
      body.innerHTML = tab === "budget" ? this._buildBudgetPanel(netarch, bud)
        : tab === "runners" ? this._buildRunnerPanel(netarch)
        : tab === "combat" ? this._buildCombatPanel(netarch)
        : tab === "rules" ? `<div style="color:#d5e7ee;font-size:13px;line-height:1.45;">${this._rulesBody()}</div>`
        : tab === "edit" ? (this._editMode ? this._buildNodeEditPanel(netarch) : `<div style="color:#7aa;font-size:12px;">Turn on Edit map to change a floor.</div>`)
        : this._buildFloorList(netarch, vis);
      this._bindSideBody(body);
    }
    this.element?.[0]?.querySelectorAll(".na-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tab));
    this._drawMap?.();
  }
  _bindSideBody(root) {
    let dragId = null;
    root.querySelectorAll(".na-floor-row").forEach(row => {
      row.addEventListener("dragstart", ev => { dragId = row.dataset.node; ev.dataTransfer?.setData("text/plain", dragId); });
      row.addEventListener("dragover", ev => { ev.preventDefault(); row.style.outline = "1px dashed #42d3ea"; });
      row.addEventListener("dragleave", () => { row.style.outline = ""; });
      row.addEventListener("drop", async ev => {
        ev.preventDefault();
        row.style.outline = "";
        const fromId = dragId || ev.dataTransfer?.getData("text/plain");
        const toId = row.dataset.node;
        if (!fromId || fromId === toId) return;
        const all = loadNetarchs();
        const arch = all[this._netarchId];
        if (!arch) return;
        const from = arch.nodes.findIndex(n => n.id === fromId);
        const to = arch.nodes.findIndex(n => n.id === toId);
        if (from < 0 || to < 0) return;
        const [node] = arch.nodes.splice(from, 1);
        arch.nodes.splice(to, 0, node);
        await saveNetarchs(all);
        this._refreshLive();
      });
    });
    root.querySelectorAll(".na-unlink").forEach(btn => btn.addEventListener("click", async ev => {
      ev.preventDefault();
      const all = loadNetarchs();
      const arch = all[this._netarchId];
      if (!arch) return;
      const before = arch.connections.length;
      arch.connections = arch.connections.filter(c => c.from !== btn.dataset.node && c.to !== btn.dataset.node);
      await saveNetarchs(all);
      ui.notifications.info("Unlinked " + (before - arch.connections.length) + " connection(s).");
      this._drawMap?.();
    }));
    root.querySelectorAll(".na-give-control").forEach(btn => btn.addEventListener("click", ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const netarch = loadNetarchs()[this._netarchId];
      const node = netarch?.nodes.find(n => n.id === (btn.dataset.node || this._selectedNode));
      if (!node) { ui.notifications.warn("Select a Control Node first."); return; }
      const options = game.users.contents.filter(u => u.active && !u.isGM).map(u => `<option value="${u.id}">${u.name}</option>`).join("");
      new Dialog({
        title: "Give control",
        content: `<p>Linked: ${(node.controlTokens || []).map(t => t.name).join(", ") || "none. Assign tokens from the token HUD first."}</p><select id="na-control-user" style="width:100%">${options || "<option value=''>No players</option>"}</select>`,
        buttons: {
          give: { label: "Give", callback: html => handControlNode(netarch.id, node.id, html.find("#na-control-user").val() || html[0]?.querySelector("#na-control-user")?.value || null) },
          revoke: { label: "Take back", callback: () => handControlNode(netarch.id, node.id, null) }
        }
      }).render(true);
    }));
    root.querySelector("#na-add-actor")?.addEventListener("click", () => this._addActor());
    root.querySelectorAll(".na-remove-actor").forEach(btn => btn.addEventListener("click", async () => {
      await clearActorPresence(this._netarchId, btn.dataset.actor);
      this._reRender();
    }));
    root.querySelectorAll(".na-floor").forEach(btn => btn.addEventListener("click", () => {
      const node = loadNetarchs()[this._netarchId]?.nodes.find(n => n.id === btn.dataset.node);
      if (!node) return;
      this._selectedNode = node.id;
      if (this._canvas) this._centerOnNode(node);
      this._refreshLive();
    }));
    root.querySelector("#ne-save")?.addEventListener("click", () => this._saveNodeEdit());
    root.querySelector("#ne-delete-node")?.addEventListener("click", () => { if (this._selectedNode) this._deleteNode(this._selectedNode); });
    root.querySelector("#ne-add-picked-ice")?.addEventListener("click", () => this._addPicked("ice"));
    root.querySelector("#ne-add-picked-demon")?.addEventListener("click", () => this._addPicked("demon"));
    root.querySelectorAll(".na-remove-ice").forEach(btn => btn.addEventListener("click", async () => {
      const netarchs = loadNetarchs(), node = netarchs[this._netarchId]?.nodes.find(n => n.id === this._selectedNode);
      if (!node) return;
      node.blackIce.splice(parseInt(btn.dataset.idx), 1);
      netarchs[this._netarchId].budget = computeBudget(netarchs[this._netarchId]);
      await saveNetarchs(netarchs);
      this._refreshLive();
    }));
    root.querySelector("#na-reset-actions")?.addEventListener("click", () => {
      const actor = this._combatActor();
      if (actor) { this._actionsByActor = this._actionsByActor || {}; this._actionsByActor[actor.id] = 0; }
      this._refreshLive();
    });
    root.querySelector("#na-roll-speed")?.addEventListener("click", () => this._rollSpeed());
    root.querySelector("#na-roll-def")?.addEventListener("click", () => this._rollDefense());
    root.querySelectorAll(".na-iface").forEach(btn => btn.addEventListener("click", () => this._rollInterface(btn.dataset.ability)));
    root.querySelectorAll(".na-toggle-rez").forEach(btn => btn.addEventListener("click", () => this._toggleRez(btn.dataset.pid)));
    root.querySelectorAll(".na-prog-atk").forEach(btn => btn.addEventListener("click", () => this._programAttack(btn.dataset.pid)));
    root.querySelectorAll(".na-prog-dmg").forEach(btn => btn.addEventListener("click", () => this._programDamage(btn.dataset.pid)));
    root.querySelectorAll(".na-prog-stat").forEach(btn => btn.addEventListener("click", () => this._programStat(btn.dataset.pid, btn.dataset.stat)));
    root.querySelectorAll(".na-ice-atk").forEach(btn => btn.addEventListener("click", () => this._iceStat(btn.dataset.idx, "atk")));
    root.querySelectorAll(".na-ice-def").forEach(btn => btn.addEventListener("click", () => this._iceStat(btn.dataset.idx, "def")));
    root.querySelectorAll(".na-ice-per").forEach(btn => btn.addEventListener("click", () => this._iceStat(btn.dataset.idx, "per")));
    root.querySelectorAll(".na-ice-spd").forEach(btn => btn.addEventListener("click", () => this._iceStat(btn.dataset.idx, "spd")));
    root.querySelectorAll(".na-ice-dmg").forEach(btn => btn.addEventListener("click", () => this._iceDamage(btn.dataset.idx)));
    root.querySelectorAll(".na-ice-rerez").forEach(btn => btn.addEventListener("click", () => this._rerezFloorIce(btn.dataset.idx)));
    root.querySelectorAll(".na-ice-destroy").forEach(btn => btn.addEventListener("click", () => this._destroyFloorIce(btn.dataset.idx)));
    root.querySelectorAll(".na-prog-destroy").forEach(btn => btn.addEventListener("click", () => this._destroyProgram(btn.dataset.pid)));
    root.querySelector("#na-rerez-all")?.addEventListener("click", () => this._rerezAllIce());
    root.querySelectorAll(".na-avatar-upload").forEach(btn => btn.addEventListener("click", () => this._uploadAvatar(btn.dataset.actor)));
    root.querySelectorAll(".na-avatar-clear").forEach(btn => btn.addEventListener("click", () => this._clearAvatar(btn.dataset.actor)));
  }
  async _uploadAvatar(actorId) {
    const actor = game.actors.get(actorId);
    if (!actor) { ui.notifications.warn("Assign a character to this user first."); return; }
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const path = await uploadNetAvatar(actor, file);
      if (!path) return;
      ui.notifications.info(actor.name + " NET avatar saved. Battle map token was not changed.");
      this._refreshLive();
    };
    input.click();
  }
  async _clearAvatar(actorId) {
    const actor = game.actors.get(actorId);
    if (!actor) return;
    await setNetAvatar(actor, "");
    this._refreshLive();
  }

  _addActor() {
    const netarch = loadNetarchs()[this._netarchId];
    if (!netarch?.entryNodeId) { ui.notifications.warn("Set an entry first."); return; }
    const sceneActors = new Map();
    for (const token of canvas.tokens?.placeables || []) {
      if (token.actor && hasInterface(token.actor)) sceneActors.set(token.actor.id, token.actor);
    }
    const options = [...sceneActors.values()].map(a => `<option value="${a.id}">${a.name}</option>`).join("");
    if (!options) { ui.notifications.warn("No scene actors with Interface."); return; }
    new Dialog({
      title: "Add actor",
      content: `<p>This actor stays in the netarch until you remove them.</p><select id="na-extra-actor" style="width:100%">${options}</select>`,
      buttons: { add: { label: "Add", callback: async html => {
        const actorId = html.find("#na-extra-actor").val();
        const actor = game.actors.get(actorId);
        if (!hasInterface(actor)) { ui.notifications.warn((actor?.name || "That actor") + " has no Interface ability."); return; }
        const floor = this._selectedNode || netarch.entryNodeId;
        await setActorPresence(netarch.id, actorId, { currentNodeId: floor, visitedNodeIds: [floor], userId: game.user.id });
        this._reRender();
      } } }
    }).render(true);
  }
  async _jackFromMapper(netarch, mode, link) {
    const actor = canvas.tokens?.controlled?.[0]?.actor || game.user?.character || game.actors.find(a => a.isOwner);
    const cost = mode === "stealth" ? 2 : 1;
    const key = netarch.id + "::" + game.user.id;
    const seat = { currentNodeId: netarch.entryNodeId, visitedNodeIds: [netarch.entryNodeId], pathfindered: false, companions: [], actorId: actor?.id || null, userId: game.user.id, jackMode: mode, jackLink: link || "physical", actionsUsed: cost };
    const positions = loadPositions();
    positions[key] = Object.assign({}, positions[key], seat);
    await savePositions(positions);
    emitBoth("netarch-seat", { id: netarch.id, key, seat });
    try { await game.user.setFlag("world", "netarchSeat", { id: netarch.id, key, seat, at: Date.now() }); } catch (err) { console.warn("Netarch seat flag", err); }
    if (game.user?.isGM) await populateArchIce(netarch);
    else emitBoth("netarch-populate-ice", { id: netarch.id });
    this._netarchId = netarch.id;
    this._mode = "map";
    this._actionsUsed = cost;
    this._spendActions(actor, cost);
    this._controlledActorId = actor?.id || this._controlledActorId;
    if (actor) actor.setFlag("world", "netarchJackLink", link || "physical").catch(() => {});
    this._reRender();
    ui.notifications.info((mode === "stealth" ? "Stealth" : "Normal") + " jack in. " + cost + " NET action" + (cost === 1 ? "" : "s") + ".");
  }
  async _saveView() {
    const all = loadNetarchs();
    const arch = all[this._netarchId];
    if (!arch) return;
    arch.view = { x: this._scrollX || 0, y: this._scrollY || 0, zoom: this._zoom || 1 };
    await saveNetarchs(all);
  }
  async close(options) {
    await this._saveView();
    if (this._keyBound) window.removeEventListener("keydown", this._keyBound, true);
    this._keyBound = null;
    clearFoundryHover(this._hoverToken);
    this._hoverToken = null;
    this._hoverKey = "";
    this._hoverHit = null;
    this._ro?.disconnect(); this._ro = null; this._canvas = null; this._ctx = null;
    document.getElementById("na-ctx-menu")?.remove();
    return super.close(options);
  }

  /* ----- 21 GENERATE DIALOG ----- */
  _openGenerateDialog() {
    new Dialog({
      title: "Generate NET Architecture",
      content: `<form style="font-family:monospace;">
        <p>Uses CPR lobby + body tables, then prices floors, features, stacked ICE, and Demons.</p>
        <div style="margin:8px 0;"><label>Difficulty</label>
          <select name="diff" style="width:100%;">
            <option>Basic</option><option selected>Standard</option><option>Uncommon</option><option>Advanced</option>
          </select>
        </div>
        <div style="margin:8px 0;"><label>Floors (blank rolls 3d6)</label>
          <input type="number" name="floors" min="3" max="18" style="width:100%;">
        </div>
        <div style="margin:8px 0;"><label>Budget in eb (blank keeps the roll)</label>
          <input type="number" name="budget" min="0" style="width:100%;">
        </div>
        <div style="margin:8px 0;"><label>Black ICE (blank keeps the roll)</label>
          <input type="number" name="ice" min="0" style="width:100%;">
        </div>
        <div style="margin:8px 0;"><label>Control nodes (blank keeps the roll)</label>
          <input type="number" name="controls" min="0" style="width:100%;">
        </div>
        <div style="margin:8px 0;"><label>Passwalls (blank keeps the roll)</label>
          <input type="number" name="passwords" min="0" style="width:100%;">
        </div>
        <div style="margin:8px 0;"><label>Files (blank keeps the roll)</label>
          <input type="number" name="files" min="0" style="width:100%;">
        </div>
        <div style="margin:8px 0;"><label>Demons (blank keeps the roll, max 1 per 6 floors)</label>
          <input type="number" name="demons" min="0" style="width:100%;">
        </div>
      </form>`,
      buttons: {
        ok: {
          label: "Generate",
          callback: async html => {
            const diff = html.find("[name=diff]").val();
            const floors = blankCount(html.find("[name=floors]").val()) || 0;
            const arch = applyGenerateChoices(generateNetarch(diff, floors), {
              budget: blankCount(html.find("[name=budget]").val()),
              ice: blankCount(html.find("[name=ice]").val()),
              controls: blankCount(html.find("[name=controls]").val()),
              passwords: blankCount(html.find("[name=passwords]").val()),
              files: blankCount(html.find("[name=files]").val()),
              demons: blankCount(html.find("[name=demons]").val())
            });
            const all = loadNetarchs();
            arch.sceneId = canvas.scene?.id || null;
            all[arch.id] = arch;
            await saveNetarchs(all);
            this._netarchId = arch.id;
            this._mode = "map";
            this._editMode = isGM();
            this._panelTab = "floors";
            this._selectedNode = arch.entryNodeId;
            this._fitOnce = false;
            ui.notifications.info(`${arch.name} generated. Budget ${formatEb(arch.budget.total)}.`);
            this._reRender();
          }
        },
        cancel: { label: "Cancel" }
      }
    }).render(true);
  }

  /* ----- 22 LISTENERS ----- */
  activateListeners(html) {
    super.activateListeners(html);
    const root = html[0];
    root.querySelectorAll(".na-open-map").forEach(btn => btn.addEventListener("click", () => {
      this._netarchId = btn.dataset.id; this._mode = "map"; this._editMode = false; this._selectedNode = null; this._fitOnce = false; this._reRender();
    }));
    root.querySelectorAll(".na-delete-arch").forEach(btn => btn.addEventListener("click", async () => {
      if (!confirm("Delete this netarch?")) return;
      const netarchs = loadNetarchs();
      delete netarchs[btn.dataset.id];
      await saveNetarchs(netarchs);
      if (this._netarchId === btn.dataset.id) { this._netarchId = null; this._mode = "list"; }
      this._reRender();
    }));
    root.querySelectorAll(".na-connect-arch").forEach(btn => btn.addEventListener("click", () => {
      const netarch = loadNetarchs()[btn.dataset.id];
      if (!netarch?.entryNodeId) { ui.notifications.warn("No entry node set."); return; }
      const askMode = link => new Dialog({
        title: "Jack in",
        content: "<p>Normal uses 1 NET Action. Stealth uses 2.</p>",
        buttons: {
          normal: { label: "Normal (1)", callback: () => this._jackFromMapper(netarch, "normal", link) },
          stealth: { label: "Stealth (2)", callback: () => this._jackFromMapper(netarch, "stealth", link) }
        }
      }).render(true);
      new Dialog({
        title: "Jack in",
        content: "<p>Physical keeps Ex-Disk and Elysia. Virtual does not.</p>",
        buttons: {
          physical: { label: "Physical", callback: () => askMode("physical") },
          virtual: { label: "Virtual", callback: () => askMode("virtual") }
        }
      }).render(true);
    }));
    root.querySelectorAll(".na-disconnect-arch").forEach(btn => btn.addEventListener("click", async () => {
      await setVisibility(btn.dataset.id, game.user.id, { currentNodeId: null, visitedNodeIds: [], pathfindered: false });
      await rerezIfEmpty(btn.dataset.id);
      this._reRender();
    }));
    root.querySelector("#na-search")?.addEventListener("input", ev => {
      this._listQuery = ev.currentTarget.value || "";
      this._reRender();
    });
    root.querySelectorAll(".na-tab").forEach(btn => btn.addEventListener("click", () => {
      this._panelTab = btn.dataset.tab;
      this._reRender();
    }));
    root.querySelectorAll(".na-floor").forEach(btn => btn.addEventListener("click", () => {
      const netarch = loadNetarchs()[this._netarchId];
      const node = netarch?.nodes.find(n => n.id === btn.dataset.node);
      if (!node) return;
      this._selectedNode = node.id;
      if (this._canvas) this._centerOnNode(node);
      else this._reRender();
    }));
    root.querySelector("#na-zoom-in")?.addEventListener("click", () => this._bumpZoom(1));
    root.querySelector("#na-zoom-out")?.addEventListener("click", () => this._bumpZoom(-1));
    root.querySelector("#na-zoom-fit")?.addEventListener("click", () => this._fitView());
    root.querySelector("#na-new-arch")?.addEventListener("click", () => {
      new Dialog({
        title: "Blank netarch",
        content: `<label>Name</label><input id="na-blank-name" type="text" value="New Netarch" style="width:100%">`,
        buttons: {
          save: { label: "Create", callback: html => {
            const name = String(html.find("#na-blank-name").val() || "").trim();
            if (!name) return;
            const arch = newNetarch(name);
            arch.sceneId = canvas.scene?.id || null;
            const lobby = { id: randomId(), type: "Lobby", name: "Lobby", x: 40, y: 40, dv: 0, notes: "Floor 1", blackIce: [], revealed: false };
            const root = { id: randomId(), type: "Root", name: "Root", x: 40, y: 40 + NODE_H + FLOOR_GAP_Y, dv: 0, notes: "Floor 2", blackIce: [], revealed: false };
            arch.nodes = [lobby, root];
            arch.connections = [];
            arch.entryNodeId = lobby.id;
            const all = loadNetarchs();
            all[arch.id] = arch;
            saveNetarchs(all).then(() => { this._netarchId = arch.id; this._mode = "map"; this._editMode = isGM(); this._panelTab = "floors"; this._reRender(); });
          }}
        },
        default: "save"
      }).render(true);
    });
    root.querySelector("#na-generate")?.addEventListener("click", () => this._openGenerateDialog());
    root.querySelector("#na-back")?.addEventListener("click", () => { this._mode = "list"; this._reRender(); });
    root.querySelector("#na-sheet")?.addEventListener("click", () => { this._sheetFrom = this._mode; this._mode = "sheet"; this._reRender(); });
    root.querySelector("#na-sheet-back")?.addEventListener("click", () => { this._mode = this._sheetFrom === "map" ? "map" : "list"; this._reRender(); });
    root.querySelector("#na-rules")?.addEventListener("click", () => { this._panelTab = "rules"; this._reRender(); });
    root.querySelector("#na-toggle-edit")?.addEventListener("click", () => { this._editMode = !this._editMode; this._connecting = null; this._deleteMode = false; this.render(true); });
    root.querySelectorAll(".na-pass-lock").forEach(btn => btn.addEventListener("click", async () => {
      const all = loadNetarchs();
      const node = all[this._netarchId]?.nodes?.find(n => n.id === btn.dataset.node);
      if (!node) return;
      node.unlocked = !node.unlocked;
      await saveNetarchs(all);
      ui.notifications.info((node.name || "Password") + (node.unlocked ? " unlocked." : " locked."));
      this._refreshLive();
    }));
    root.querySelector("#na-unlink-floor")?.addEventListener("click", async () => {
      const all = loadNetarchs();
      const arch = all[this._netarchId];
      const id = this._selectedNode;
      if (!arch || !id) { ui.notifications.warn("Select a floor first."); return; }
      const before = arch.connections.length;
      arch.connections = arch.connections.filter(c => c.from !== id && c.to !== id);
      await saveNetarchs(all);
      ui.notifications.info("Unlinked " + (before - arch.connections.length) + " connection(s).");
      this._drawMap?.();
    });
    root.querySelector("#na-unlink-all")?.addEventListener("click", async () => {
      const all = loadNetarchs();
      const arch = all[this._netarchId];
      if (!arch) return;
      const n = arch.connections.length;
      arch.connections = [];
      await saveNetarchs(all);
      ui.notifications.info("Unlinked all " + n + " connection(s).");
      this._drawMap?.();
    });
    root.querySelector("#na-add-node")?.addEventListener("click", () => this._addNode());
    root.querySelector("#na-connect-mode")?.addEventListener("click", () => { this._connecting = this._connecting ? null : "pending"; this._deleteMode = false; this._reRender(); });
    root.querySelector("#na-delete-mode")?.addEventListener("click", () => { this._deleteMode = !this._deleteMode; this._connecting = null; this._reRender(); });
    root.querySelector("#na-reveal-all")?.addEventListener("click", () => this._revealAll());
    root.querySelector("#na-hide-all")?.addEventListener("click", () => this._hideAll());
    root.querySelector("#na-add-actor")?.addEventListener("click", () => this._addActor());
    root.querySelectorAll(".na-give-control").forEach(btn => btn.addEventListener("click", () => {
      const netarch = loadNetarchs()[this._netarchId];
      const node = netarch?.nodes.find(n => n.id === (btn.dataset.node || this._selectedNode));
      if (!node) return;
      const options = game.users.contents.filter(u => u.active && !u.isGM).map(u => `<option value="${u.id}">${u.name}</option>`).join("");
      new Dialog({
        title: "Give control",
        content: `<p>Pick the player who gets temporary control of ${(node.controlTokens || []).map(t => t.name).join(", ") || "the linked tokens"}.</p><select id="na-control-user" style="width:100%">${options || "<option value=\"\">No players</option>"}</select>`,
        buttons: {
          give: { label: "Give", callback: html => {
            const picked = html.find("#na-control-user").val() || html[0]?.querySelector("#na-control-user")?.value || null;
            handControlNode(netarch.id, node.id, picked);
          } },
          revoke: { label: "Take back", callback: () => handControlNode(netarch.id, node.id, null) }
        }
      }).render(true);
    }));
    root.querySelector("#na-preview")?.addEventListener("change", ev => {
      this._previewUserId = ev.currentTarget.value || "";
      this._reRender();
    });
    root.querySelector("#ne-save")?.addEventListener("click", () => this._saveNodeEdit());
    root.querySelector("#ne-delete-node")?.addEventListener("click", () => { if (this._selectedNode) this._deleteNode(this._selectedNode); });
    root.querySelector("#ne-add-picked-ice")?.addEventListener("click", () => this._addPicked("ice"));
    root.querySelector("#ne-add-picked-demon")?.addEventListener("click", () => this._addPicked("demon"));
    root.querySelectorAll(".na-remove-ice").forEach(btn => btn.addEventListener("click", async () => {
      const netarchs = loadNetarchs();
      const node = netarchs[this._netarchId]?.nodes.find(n => n.id === this._selectedNode);
      if (!node) return;
      node.blackIce.splice(parseInt(btn.dataset.idx), 1);
      netarchs[this._netarchId].budget = computeBudget(netarchs[this._netarchId]);
      await saveNetarchs(netarchs);
      this._reRender();
    }));
    const side = root.querySelector("#na-side-body");
    if (side) this._bindSideBody(side);
    if (!this._keyBound) {
      this._keyBound = (event) => this._onTargetKey(event);
      window.addEventListener("keydown", this._keyBound, true);
    }
    if (this._mode === "map") requestAnimationFrame(() => this._initCanvas());
  }
}

/* ===================== 23 LAUNCH ===================== */
if (game._netarchDamageRelease) Hooks.off("preUpdateActor", game._netarchDamageRelease);
game._netarchDamageRelease = (actor, data) => {
  if (actor?.type !== "blackIce") return;
  if (data?.system?.stats?.rez == null && data?.system?.stats?.rez?.value == null) return;
  for (const token of canvas.tokens?.placeables || []) {
    if (token.actor?.id === actor.id) releaseIceSelection(token);
  }
};
Hooks.on("preUpdateActor", game._netarchDamageRelease);

function redrawMapperFromActor(actor) {
  const app = findMapperApp();
  if (!app) return;
  if (app._iceTokenCache) app._iceTokenCache.clear();
  const tokens = (canvas.tokens?.placeables || []).filter(t => !actor || t.actor?.id === actor.id);
  const token = tokens.find(t => game.user?.targets?.has(t)) || app._hoverToken || tokens[0];
  if (token) syncMapperFromToken(token);
  else app._drawMap?.();
}
if (game._netarchActorRefresh) Hooks.off("updateActor", game._netarchActorRefresh);
if (game._netarchDamageChat) Hooks.off("createChatMessage", game._netarchDamageChat);
if (game._netarchTargetDraw) Hooks.off("targetToken", game._netarchTargetDraw);
if (game._netarchTokenDraw) Hooks.off("updateToken", game._netarchTokenDraw);
game._netarchActorRefresh = actor => redrawMapperFromActor(actor);
game._netarchDamageChat = msg => {
  if (!/Damage Dealt|REZ|applied/i.test(msg.content || "")) return;
  const app = findMapperApp();
  const token = Array.from(game.user?.targets || [])[0] || app?._hoverToken;
  if (token) syncMapperFromToken(token);
  else app?._drawMap?.();
};
game._netarchTargetDraw = () => findMapperApp()?._drawMap?.();
game._netarchTokenDraw = doc => redrawMapperFromActor(doc?.actor || canvas.tokens?.get(doc?.id)?.actor);
Hooks.on("updateActor", game._netarchActorRefresh);
Hooks.on("createChatMessage", game._netarchDamageChat);
Hooks.on("targetToken", game._netarchTargetDraw);
Hooks.on("updateToken", game._netarchTokenDraw);
if (game._netarchUserSeat) Hooks.off("updateUser", game._netarchUserSeat);
game._netarchUserSeat = () => { pullSeatsFromUsers(); claimControlFlag(); };
Hooks.on("updateUser", game._netarchUserSeat);


async function pullSeatsFromUsers() {
  const all = Object.assign({}, loadPositions());
  let changed = false;
  for (const user of game.users.contents) {
    const flag = user.getFlag("world", "netarchSeat");
    if (!flag?.key || !flag?.seat?.currentNodeId) continue;
    const prev = all[flag.key] || {};
    if (prev.currentNodeId === flag.seat.currentNodeId && prev.actorId === flag.seat.actorId) continue;
    all[flag.key] = Object.assign({}, prev, flag.seat);
    changed = true;
  }
  if (!changed) return all;
  game.bfNetarchPos = all;
  if (game.user?.isGM) {
    await game.settings.set("world", POSITION_KEY, all);
    emitNetarch("netarch-positions-broadcast", all);
  }
  refreshOpenMapper({ full: true });
  return all;
}

function reduceArmorCard(root) {
  if (!root || root.dataset?.naArmor) return;
  const soak = armorSoak(currentDamageTarget());
  if (!soak) return;
  root.dataset.naArmor = "1";
  const input = root.querySelector("input[type='number'], input.damage, input[name='damage']");
  if (input) input.value = String(Math.max(0, Number(input.value || 0) - soak));
  for (const el of root.querySelectorAll("[data-damage], [data-amount], .damage-total, .dice-total")) {
    const n = Number(el.dataset.damage || el.dataset.amount || el.textContent);
    if (!Number.isFinite(n)) continue;
    const next = Math.max(0, n - soak);
    if (el.dataset.damage) el.dataset.damage = String(next);
    if (el.dataset.amount) el.dataset.amount = String(next);
    if (/^\d+$/.test((el.textContent || "").trim())) el.textContent = String(next);
  }
}
if (game._netarchArmorCard) Hooks.off("renderChatMessage", game._netarchArmorCard);
game._netarchArmorCard = (msg, html) => reduceArmorCard(html?.[0] || html);
Hooks.on("renderChatMessage", game._netarchArmorCard);
if (game._netarchArmorClick) document.body.removeEventListener("click", game._netarchArmorClick, true);
game._netarchArmorClick = ev => {
  const btn = ev.target?.closest?.("button, a");
  if (!btn) return;
  const label = (btn.textContent || btn.getAttribute("data-action") || "").toLowerCase();
  if (!/damage|apply/.test(label) && !/damage|apply/.test(btn.className || "")) return;
  const card = btn.closest(".message, .chat-message, .cpr-block") || btn.parentElement;
  const soak = armorSoak(currentDamageTarget());
  if (!soak || !card || card.dataset.naArmorApplied) return;
  card.dataset.naArmorApplied = "1";
  const input = card.querySelector("input[type='number'], input.damage, input[name='damage']");
  if (input) input.value = String(Math.max(0, Number(input.value || 0) - soak));
  for (const key of ["damage", "amount", "value"]) {
    if (btn.dataset[key]) btn.dataset[key] = String(Math.max(0, Number(btn.dataset[key]) - soak));
  }
};
document.body.addEventListener("click", game._netarchArmorClick, true);
async function bootNetarch() {
  await ensureSettings();
  try { game.bfNetarchPos = game.settings.get("world", POSITION_KEY) || game.bfNetarchPos || {}; } catch (err) {}
  await pullSeatsFromUsers();
  await loadIcePack();
if (game._netarchMapperHandler) game.socket.off(SOCKET_EVENT, game._netarchMapperHandler);
game._netarchMapperListener = true;
game._netarchMapperHandler = async payload => {
    const type = payload?.type;
    const data = payload?.data;
    if (!type) return;
    if (type === "netarch-save" && game.user?.isGM) {
      game.bfNetarchs = data || {};
      await game.settings.set("world", SETTING_KEY, game.bfNetarchs);
      emitNetarch("netarch-broadcast", game.bfNetarchs);
      return;
    }
    if (type === "netarch-broadcast") { game.bfNetarchs = data || {}; refreshOpenMapper({ full: true }); return; }
    if (type === "netarch-save-positions" && game.user?.isGM) {
      game.bfNetarchPos = data || {};
      await game.settings.set("world", POSITION_KEY, game.bfNetarchPos);
      emitNetarch("netarch-positions-broadcast", game.bfNetarchPos);
      return;
    }
    if (type === "netarch-positions-broadcast") { game.bfNetarchPos = data || {}; refreshOpenMapper({ full: true }); return; }
    if (type === "netarch-seat" && data?.key && data?.seat) {
      const all = Object.assign({}, loadPositions());
      all[data.key] = Object.assign({}, all[data.key], data.seat);
      if (game.user?.isGM) {
        game.bfNetarchPos = all;
        await game.settings.set("world", POSITION_KEY, all);
        emitNetarch("netarch-positions-broadcast", all);
      } else {
        game.bfNetarchPos = all;
        refreshOpenMapper({ full: true });
      }
      return;
    }
    if (type === "netarch-live") { game.bfNetarchs = data?.arch || game.bfNetarchs; game.bfNetarchPos = data?.pos || game.bfNetarchPos; refreshOpenMapper({ full: true }); return; }
    if (type === "netarch-save-avatars" && game.user?.isGM) {
      game.bfNetAvatars = data || {};
      await game.settings.set("world", AVATAR_KEY, game.bfNetAvatars);
      emitNetarch("netarch-avatars-broadcast", game.bfNetAvatars);
      return;
    }
    if (type === "netarch-avatars-broadcast") { game.bfNetAvatars = data || {}; const app = findMapperApp(); if (app) app._avatarCache = {}; refreshOpenMapper({ full: true }); return; }
    if (type === "netarch-populate-ice" && game.user?.isGM) await populateArchIce(loadNetarchs()[data?.id]);
    if (type === "netarch-take-tokens" && data?.userId === game.user.id) takeLocalTokens(data.uuids);
    if (type === "netarch-release-tokens" && data?.userId === game.user.id) releaseLocalTokens(data.uuids);
};
game.socket.on(SOCKET_EVENT, game._netarchMapperHandler);
game.socket.on(MODULE_SOCKET, game._netarchMapperHandler);
game.netarchOpen = async function(netarchId) {
  await pullSeatsFromUsers();
  const existingMapper = findMapperApp();
  if (existingMapper) await existingMapper.close();
  const app = new NetarchApp();
  const arch = loadNetarchs()[netarchId];
  if (arch?.entryNodeId) {
    app._netarchId = arch.id;
    app._mode = "map";
    app._editMode = false;
    app._fitOnce = false;
    app._actionsUsed = game.netarchPendingJack?.actionsUsed || 0;
    const pendingActor = game.actors.get(game.netarchPendingJack?.actorId);
    if (pendingActor) app._spendActions(pendingActor, app._actionsUsed);
    if (game.user?.isGM) await populateArchIce(arch);
  }
  await app.render(true);
  startLiveSync();
  return app;
};
  startLiveSync();
  game.netarch = game.netarch || {};
  game.netarch.open = game.netarchOpen;
  const pending = game.netarchPendingJack;
  if (pending?.id) {
    game.netarchPendingJack = null;
    await game.netarchOpen(pending.id);
  }
}
if (game.ready) bootNetarch();
else Hooks.once("ready", () => { bootNetarch(); });