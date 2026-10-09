// CP RED - Netarch Jack In
// Paste into its own Foundry macro. Empty that box first.
// DONE 2026-10-07k: Jack In asks normal or stealth, not which access point.
//
// Run the mapper macro once this session. This button jacks the actor into a scanner access point and opens the mapper.

const SETTING_KEY = "cyberpunk-netarchs";
const POSITION_KEY = "cyberpunk-netarch-positions";
const ACCESS_FLAG = "netarchAccess";
const SOCKET_EVENT = "system.cyberpunk-red-core";

function loadNetarchs() {
  if (!game.bfNetarchs) {
    try { game.bfNetarchs = game.settings.get("world", SETTING_KEY) || {}; } catch { game.bfNetarchs = {}; }
  }
  return game.bfNetarchs;
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
    game.socket.emit(SOCKET_EVENT, { type: "netarch-positions-broadcast", data });
  } else game.socket.emit(SOCKET_EVENT, { type: "netarch-save-positions", data });
}

const INTERFACE_ABILITIES = ["Scanner", "Backdoor", "Cloak", "Control", "Eye-Dee", "Pathfinder", "Slide", "Virus", "Zap"];
function pickNetActor() {
  const tokenActor = canvas.tokens?.controlled?.[0]?.actor;
  if (tokenActor) return tokenActor;
  if (game.user?.character) return game.user.character;
  return game.actors.find(a => a.isOwner && ["character", "mook"].includes(a.type)) || null;
}
function getNetRole(actor) {
  const activeId = actor.system?.roleInfo?.activeNetRole;
  if (activeId) {
    const byId = actor.items.get(activeId) || actor.itemTypes?.role?.find(r => r.id === activeId);
    if (byId) return byId;
  }
  return actor.itemTypes?.role?.find(r => /netrunner|interface/i.test(`${r.name} ${r.system?.mainRoleAbility || ""}`)) || null;
}
function getInterfaceRank(role) {
  if (!role) return 0;
  const abilities = role.system?.abilities || [];
  const iface = abilities.find(a => /interface/i.test(`${a.name || ""} ${a.key || ""}`));
  const rank = Number(iface?.rank ?? iface?.value ?? role.system?.rank ?? 0);
  return Number.isFinite(rank) ? rank : 0;
}
function getCyberdeck(actor) {
  if (typeof actor.getEquippedCyberdeck === "function") {
    const deck = actor.getEquippedCyberdeck();
    if (deck) return deck;
  }
  const decks = actor.itemTypes?.cyberdeck || actor.items.filter(i => i.type === "cyberdeck");
  return decks[0] || null;
}
function readProgram(item) {
  const s = item.system || {};
  return {
    id: item.id, name: item.name, class: s.class || "unknown", isRezzed: !!s.isRezzed,
    per: Number(s.per || 0), spd: Number(s.spd || 0), atk: Number(s.atk || 0), def: Number(s.def || 0),
    rez: Number(s.rez?.value ?? s.rez ?? 0), rezMax: Number(s.rez?.max ?? s.rez ?? 0)
  };
}
function pullNetSheet(actor) {
  if (!actor) return null;
  const role = getNetRole(actor);
  const interfaceRank = getInterfaceRank(role);
  const deck = getCyberdeck(actor);
  let programs = [];
  if (deck && typeof deck.getInstalledItems === "function") programs = deck.getInstalledItems("program") || [];
  if (!programs.length) programs = actor.itemTypes?.program || [];
  const data = {
    actorId: actor.id, actorName: actor.name, roleName: role?.name || "None",
    interfaceRank, netActions: interfaceRank, interfaceAbilities: INTERFACE_ABILITIES,
    deckId: deck?.id || null, deckName: deck?.name || "No cyberdeck",
    programs: programs.map(readProgram),
    rezzed: programs.filter(p => p.system?.isRezzed).map(readProgram)
  };
  game.bfNetSheet = data;
  return data;
}
function accessPoints() {
  const out = [];
  for (const scene of game.scenes?.contents || []) {
    for (const doc of scene.tokens?.contents || []) {
      const link = doc.getFlag("world", ACCESS_FLAG);
      if (!link?.netarchId) continue;
      out.push({ tokenName: doc.name, sceneName: scene.name, netarchId: link.netarchId, sceneId: scene.id, tokenId: doc.id });
    }
  }
  return out;
}
async function jackInto(netarchId, mode) {
  const arch = loadNetarchs()[netarchId];
  if (!arch?.entryNodeId) { ui.notifications.warn("That architecture has no entry."); return; }
  const positions = loadPositions();
  const key = arch.id + "::" + game.user.id;
  const prev = positions[key] || {};
  const actor = pickNetActor();
  pullNetSheet(actor);
  const cost = mode === "stealth" ? 2 : 1;
  positions[key] = Object.assign({}, prev, { currentNodeId: arch.entryNodeId, visitedNodeIds: [arch.entryNodeId], pathfindered: false, companions: prev.companions || [], actorId: actor?.id || null, jackMode: mode || "normal", actionsUsed: cost });
  await savePositions(positions);
  if (game.user?.isGM) {
    const app = Object.values(ui.windows).find(w => w.id === "netarch-mapper");
    if (app?.populateArchIce) await app.populateArchIce(arch);
  } else game.socket.emit(SOCKET_EVENT, { type: "netarch-populate-ice", data: { id: arch.id } });
  game.netarchPendingJack = { id: arch.id, actionsUsed: cost, jackMode: mode || "normal" };
  if (typeof game.netarchOpen === "function") await game.netarchOpen(arch.id);
  else {
    const macro = game.macros?.find(m => /Netarch Mapper ORTHO|class NetarchApp/.test(m.command || ""));
    if (macro) await macro.execute();
    else ui.notifications.warn("Mapper macro was not found. Save the mapper macro in this world once.");
  }
  ui.notifications.info((mode === "stealth" ? "Stealth" : "Normal") + " jack in to " + arch.name + ". " + cost + " NET action" + (cost === 1 ? "" : "s") + ".");
}
function nearestAccess() {
  const points = accessPoints();
  const actor = pickNetActor();
  const origin = canvas.tokens?.placeables.find(t => t.actor?.id === actor?.id);
  if (!origin || points.length < 2) return points[0] || null;
  const here = origin.center || { x: origin.x, y: origin.y };
  let best = points[0];
  let bestDist = Infinity;
  for (const point of points) {
    const token = canvas.tokens?.get(point.tokenId);
    if (!token) continue;
    const spot = token.center || { x: token.x, y: token.y };
    const dist = Math.hypot(spot.x - here.x, spot.y - here.y);
    if (dist < bestDist) { best = point; bestDist = dist; }
  }
  return best;
}
function chooseAccess() {
  const point = nearestAccess();
  if (!point) { ui.notifications.warn("No scanner access points yet."); return; }
  new Dialog({
    title: "Jack in",
    content: "<p>Normal uses 1 NET Action. Stealth uses 2.</p>",
    buttons: {
      normal: { label: "Normal (1)", callback: () => jackInto(point.netarchId, "normal") },
      stealth: { label: "Stealth (2)", callback: () => jackInto(point.netarchId, "stealth") }
    }
  }).render(true);
}
function findSpeed(root) {
  const nodes = [...root.querySelectorAll("a, button, li, label, span, div, h3, h4")];
  const hits = nodes.filter(el => /^speed$/i.test((el.textContent || "").replace(/\s+/g, " ").trim()));
  return hits.sort((a, b) => a.textContent.length - b.textContent.length)[0] || null;
}
function addJackButton(root) {
  if (!root?.querySelector || root.querySelector(".na-jack-in")) return;
  const speed = findSpeed(root);
  if (!speed) return;
  const row = speed.parentElement || speed;
  const jack = document.createElement(row.tagName || "div");
  jack.className = row.className;
  jack.classList.add("na-jack-in");
  jack.textContent = "Jack in";
  jack.style.display = "block";
  jack.style.width = "100%";
  jack.style.margin = "0";
  jack.style.padding = "0";
  jack.style.textAlign = "left";
  jack.style.cursor = "pointer";
  jack.style.color = getComputedStyle(speed).color;
  jack.style.font = getComputedStyle(speed).font;
  jack.addEventListener("click", ev => { ev.preventDefault(); ev.stopPropagation(); chooseAccess(); });
  const rule = document.createElement("div");
  rule.className = "na-jack-rule";
  rule.style.cssText = "height:0;border-top:1px solid #3d8ea3;margin:8px 0;";
  row.insertAdjacentElement("afterend", rule);
  rule.insertAdjacentElement("afterend", jack);
}
if (game._netarchJackSheet) Hooks.off("renderActorSheet", game._netarchJackSheet);
game._netarchJackSheet = (app, html) => {
  const root = html?.[0] || html || app?.element?.[0] || app?.element;
  addJackButton(root);
  setTimeout(() => addJackButton(root), 200);
};
Hooks.on("renderActorSheet", game._netarchJackSheet);
Hooks.on("renderApplication", game._netarchJackSheet);
for (const app of Object.values(ui.windows)) {
  if (app.actor) addJackButton(app.element?.[0] || app.element);
}
console.log("Netarch Jack In ready");