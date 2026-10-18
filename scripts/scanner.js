/*
 * CP RED - Netarch Scanner
 * Paste into its own Foundry macro. Empty that box first.
 * DONE 2026-10-07c: scan chat is the actor, and only the roller posts it.
 * Window title is not used. This macro has no window.
 *
 * Right-click a token, Set access point, pick an architecture and a pulse.
 * Assign to Control Node stores the targeted scene tokens on that floor.
 * A Scanner roll reveals access points within twice that total, in scene ruler units, around the actor who rolled.
 * Consistent keeps the token and name showing through walls. 12 times pulses, then removes them.
 * Unassign ends the pulse. No template.
 */

const SETTING_KEY = "cyberpunk-netarchs";
const ACCESS_FLAG = "netarchAccess";
const SOCKET_EVENT = "system.cyberpunk-red-core";

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
    game.socket.emit(SOCKET_EVENT, { type: "netarch-broadcast", data });
  } else game.socket.emit(SOCKET_EVENT, { type: "netarch-save", data });
}
function scannerRollTotal(msg) {
  const html = msg?.content || "";
  const text = html.replace(/<[^>]+>/g, " ");
  if (!/scanner/i.test(text)) return null;
  const box = html.match(/d10-number-div[\s\S]*?>(\d+)</i);
  if (box) return Number(box[1]);
  const rollTotal = msg.rolls?.[0]?.total;
  if (rollTotal != null) return Number(rollTotal);
  return null;
}
function pointOf(token) {
  return token?.center || { x: (token?.x || 0) + (token?.w || 0) / 2, y: (token?.y || 0) + (token?.h || 0) / 2 };
}
function sceneDistance(a, b) {
  const pa = pointOf(a);
  const pb = pointOf(b);
  const grid = canvas.grid;
  if (grid?.measurePath) return Number(grid.measurePath([pa, pb], { gridSpaces: false }).distance) || 0;
  if (grid?.measureDistance) return Number(grid.measureDistance(pa, pb, { gridSpaces: false })) || 0;
  const size = canvas.scene?.grid?.size || 100;
  const step = canvas.scene?.grid?.distance || 1;
  return Math.hypot(pa.x - pb.x, pa.y - pb.y) / size * step;
}
function netrunEffect() {
  return (CONFIG.statusEffects || []).find(e => /netrun/i.test(e.id || "") || /netrun/i.test(e.name || "") || /netrun/i.test(e.label || ""));
}
function pulseHosts() {
  return [canvas?.interface, canvas?.controls].filter(Boolean);
}
function pulseLayer() {
  const host = canvas?.interface || canvas?.controls;
  if (!host) return null;
  if (!host._netarchPulse) {
    const layer = new PIXI.Container();
    layer.name = "netarch-pulse";
    layer.eventMode = "none";
    layer.interactiveChildren = false;
    host.addChild(layer);
    host._netarchPulse = layer;
  }
  host._netarchPulse.zIndex = 9999;
  return host._netarchPulse;
}
function stopOutline(tokenId) {
  game._netarchPulseTimers = game._netarchPulseTimers || {};
  game._netarchPulseDead = game._netarchPulseDead || {};
  game._netarchPulseDead[tokenId] = true;
  if (game._netarchPulseTimers[tokenId]) clearInterval(game._netarchPulseTimers[tokenId]);
  delete game._netarchPulseTimers[tokenId];
  for (const host of pulseHosts()) {
    const layer = host._netarchPulse;
    if (!layer) continue;
    for (const child of [...layer.children]) {
      if (!tokenId || child._netarchTokenId === tokenId) child.destroy();
    }
  }
  const token = canvas.tokens?.get(tokenId);
  const effect = netrunEffect();
  if (token && effect) token.toggleEffect(effect, { active: false, overlay: true });
}
function drawOutline(tokenId, times, stay) {
  const token = canvas.tokens?.get(tokenId);
  const layer = pulseLayer();
  if (!token || !layer || typeof PIXI === "undefined") return;
  game._netarchPulseDead = game._netarchPulseDead || {};
  game._netarchPulseDead[tokenId] = false;
  stopOutline(tokenId);
  game._netarchPulseDead[tokenId] = false;
  const holder = new PIXI.Container();
  holder._netarchTokenId = tokenId;
  holder.eventMode = "none";
  holder.interactive = false;
  holder.interactiveChildren = false;
  layer.addChild(holder);
  const ring = new PIXI.Graphics();
  const texture = token.texture || token.mesh?.texture;
  const sprite = texture ? new PIXI.Sprite(texture) : new PIXI.Graphics();
  if (sprite instanceof PIXI.Sprite) {
    sprite.anchor.set(0.5);
    sprite.width = token.w;
    sprite.height = token.h;
  }
  const label = new PIXI.Text(token.name || token.document?.name || "", { fontFamily: "Trebuchet MS", fontSize: 16, fill: "#ffffff", stroke: "#000000", strokeThickness: 4, align: "center" });
  label.anchor.set(0.5, 0);
  holder.addChild(ring);
  holder.addChild(sprite);
  holder.addChild(label);
  let n = 0;
  const flashes = stay ? 0 : Math.max(1, Number(times) || 12);
  const endsAt = stay ? 0 : Date.now() + flashes * 1000;
  game._netarchPulseTimers[tokenId] = setInterval(() => {
    if (game._netarchPulseDead[tokenId]) { stopOutline(tokenId); return; }
    const live = canvas.tokens?.get(tokenId);
    if (!live) { stopOutline(tokenId); return; }
    n += 1;
    const wave = 0.55 + Math.abs(Math.sin(n / 2)) * 0.45;
    const spot = pointOf(live);
    holder.position.set(spot.x, spot.y);
    holder.alpha = 1;
    const rx = live.w / 2 + 10 + wave * 8;
    const ry = live.h / 2 + 10 + wave * 8;
    ring.clear();
    ring.lineStyle(7, 0xb44dff, 0.35 + wave * 0.5);
    ring.drawEllipse(0, 0, rx, ry);
    ring.lineStyle(3, 0xe7c6ff, wave);
    ring.drawEllipse(0, 0, rx - 6, ry - 6);
    if (!(sprite instanceof PIXI.Sprite)) {
      sprite.clear();
      sprite.beginFill(0xb44dff, 0.25);
      sprite.drawEllipse(0, 0, live.w / 2, live.h / 2);
      sprite.endFill();
    }
    label.y = ry + 4;
    label.text = live.name || live.document?.name || "";
    if (!stay && Date.now() >= endsAt) stopOutline(tokenId);
  }, 120);
}
function emitPulse(tokenId, times, stay, userId) {
  game.socket.emit(SOCKET_EVENT, { type: "netarch-pulse", data: { tokenId, times, stay, userId } });
  if (game.user.id === userId) drawOutline(tokenId, times, stay);
}
function emitStop(tokenId) {
  stopOutline(tokenId);
  game.socket.emit(SOCKET_EVENT, { type: "netarch-pulse-stop", data: { tokenId } });
}
async function setAccessPoint(token) {
  if (!game.user?.isGM) return;
  const archs = Object.values(loadNetarchs());
  if (!archs.length) { ui.notifications.warn("No architectures yet."); return; }
  const current = token.document.getFlag("world", ACCESS_FLAG);
  const options = archs.map(a => `<option value="${a.id}" ${current?.netarchId === a.id ? "selected" : ""}>${a.name}</option>`).join("");
  const pulse = current?.pulse === "12" ? "12" : "consistent";
  new Dialog({
    title: "Access point",
    content: `<p>Assign the pulse for ${token.name}.</p><label>Architecture</label><select id="na-ap-arch" style="width:100%">${options}</select><label>Pulse</label><select id="na-ap-pulse" style="width:100%"><option value="consistent" ${pulse === "consistent" ? "selected" : ""}>Consistent</option><option value="12" ${pulse === "12" ? "selected" : ""}>12 times</option><option value="unassign">Unassign</option></select>`,
    buttons: {
      save: { label: "Save", callback: async html => {
        const mode = html.find("#na-ap-pulse").val();
        if (mode === "unassign") {
          await token.document.unsetFlag("world", ACCESS_FLAG);
          emitStop(token.id);
          ui.notifications.info("Pulse stopped for " + token.name + ".");
          return;
        }
        const id = html.find("#na-ap-arch").val();
        const arch = loadNetarchs()[id];
        await token.document.setFlag("world", ACCESS_FLAG, { netarchId: id, name: arch?.name || "", pulse: mode });
        ui.notifications.info(token.name + " pulses " + (mode === "12" ? "12 times" : "consistent") + " for " + (arch?.name || "architecture") + ".");
      }}
    }
  }).render(true);
}

async function assignControlTokens(token) {
  if (!game.user?.isGM) return;
  const archs = Object.values(loadNetarchs());
  if (!archs.length) { ui.notifications.warn("No architectures yet."); return; }
  const targeted = Array.from(game.user?.targets || []);
  const tokens = targeted.length ? targeted : (token ? [token] : []);
  if (!tokens.length) { ui.notifications.warn("Right-click a token, or target the tokens, then assign."); return; }
  const archOptions = archs.map(a => `<option value="${a.id}">${a.name}</option>`).join("");
  new Dialog({
    title: "Assign to Control Node",
    content: `<p>Targeted tokens are added. If nothing is targeted, the right-clicked token is added.</p><label>Architecture</label><select id="na-cn-arch" style="width:100%">${archOptions}</select><label>Control Node</label><select id="na-cn-node" style="width:100%"></select>`,
    buttons: {
      save: { label: "Assign", callback: async html => {
        const all = loadNetarchs();
        const arch = all[html.find("#na-cn-arch").val()];
        const node = arch?.nodes?.find(n => n.id === html.find("#na-cn-node").val());
        if (!node) { ui.notifications.warn("Pick a Control Node."); return; }
        node.controlTokens = node.controlTokens || [];
        for (const t of tokens) {
          const uuid = t.document?.uuid;
          if (!uuid || uuid.indexOf("Token.") === -1) { ui.notifications.warn("That is not a scene token."); continue; }
          if (node.controlTokens.some(x => x.uuid === uuid)) continue;
          node.controlTokens.push({ uuid: uuid, id: t.id, name: t.name, actorId: t.actor?.id || null });
        }
        await saveNetarchs(all);
        ui.notifications.info("Assigned " + tokens.map(t => t.name).join(", ") + ". Node has " + node.controlTokens.length + ".");
      }},
      remove: { label: "Remove", callback: async html => {
        const all = loadNetarchs();
        const arch = all[html.find("#na-cn-arch").val()];
        const node = arch?.nodes?.find(n => n.id === html.find("#na-cn-node").val());
        if (!node) { ui.notifications.warn("Pick a Control Node."); return; }
        const ids = new Set(tokens.map(t => t.document?.uuid).filter(Boolean));
        const before = (node.controlTokens || []).length;
        node.controlTokens = (node.controlTokens || []).filter(x => !ids.has(x.uuid));
        await saveNetarchs(all);
        ui.notifications.info("Removed " + (before - node.controlTokens.length) + ". Node has " + node.controlTokens.length + ".");
      }}
    },
    render: html => {
      const fill = () => {
        const arch = loadNetarchs()[html.find("#na-cn-arch").val()];
        const nodes = (arch?.nodes || []).filter(n => n.type === "Control Node");
        html.find("#na-cn-node").html(nodes.map(n => `<option value="${n.id}">${n.name || "Control Node"}</option>`).join("") || `<option value="">No Control Node</option>`);
      };
      html.find("#na-cn-arch").on("change", fill);
      fill();
    }
  }).render(true);
}
async function revealScannedAccess(msg) {
  if (msg.getFlag?.("world", "netarchScanResult") || msg.getFlag?.("world", "netarchScanClaimed")) return;
  const total = scannerRollTotal(msg);
  if (total == null || !canvas?.tokens) return;
  const rollerId = msg.user?.id || msg.author?.id;
  if (rollerId !== game.user.id) return;
  await msg.setFlag("world", "netarchScanClaimed", game.user.id);
  const actor = game.actors.get(msg.speaker?.actor);
  const origin = canvas.tokens.get(msg.speaker?.token) || canvas.tokens.placeables.find(t => t.actor?.id === actor?.id);
  if (!origin) return;
  const range = total;
  const units = canvas.scene?.grid?.units || "m";
  const found = [];
  for (const token of canvas.tokens.placeables) {
    const link = token.document.getFlag("world", ACCESS_FLAG);
    if (!link?.netarchId) continue;
    const away = sceneDistance(origin, token);
    if (away > range) continue;
    found.push({ token, link, away });
    drawOutline(token.id, 12, link.pulse !== "12");
  }
  const who = actor?.name || origin.name || "Scanner";
  const lines = found.length
    ? found.map(f => f.token.name + " " + Math.round(f.away) + units).join(", ")
    : "nothing";
  ChatMessage.create({
    speaker: { scene: null, actor: actor?.id || null, token: null, alias: who },
    content: `<div class="cpr-block" style="padding:10px;background:#102018;">${who} scanned ${total}. Range ${range}${units} from ${who}. Found ${lines}.</div>`,
    flags: { world: { netarchScanResult: true } }
  }, { chatBubble: false });
}
function bootScanner() {
  if (!game.socket) { console.error("Netarch Scanner: socket missing"); return; }
if (game._netarchScanChat) Hooks.off("createChatMessage", game._netarchScanChat);
game._netarchScanChat = msg => revealScannedAccess(msg);
Hooks.on("createChatMessage", game._netarchScanChat);
if (game._netarchPulseHandler) game.socket.off(SOCKET_EVENT, game._netarchPulseHandler);
game._netarchPulseHandler = payload => {
  if (payload?.type === "netarch-pulse-stop") stopOutline(payload.data?.tokenId);
  if (payload?.type !== "netarch-pulse") return;
  if (payload.data?.userId !== game.user.id) return;
  drawOutline(payload.data?.tokenId, payload.data?.times || 12, !!payload.data?.stay);
};
game.socket.on(SOCKET_EVENT, game._netarchPulseHandler);
if (game._netarchHud) Hooks.off("renderTokenHUD", game._netarchHud);
game._netarchHud = (hud, html) => {
  if (!game.user?.isGM) return;
  const root = html?.[0] || html;
  if (!root?.querySelector || root.querySelector(".na-access-point")) return;
  const col = root.querySelector(".col.right") || root;
  const btn = document.createElement("div");
  btn.className = "control-icon na-access-point";
  btn.title = "Set access point";
  btn.innerHTML = '<i class="fas fa-network-wired"></i>';
  btn.addEventListener("click", ev => { ev.preventDefault(); setAccessPoint(hud.object); });
  col.appendChild(btn);
  const assign = document.createElement("div");
  assign.className = "control-icon na-control-assign";
  assign.title = "Assign targeted tokens to a Control Node";
  assign.innerHTML = '<i class="fas fa-link"></i>';
  assign.addEventListener("click", ev => { ev.preventDefault(); assignControlTokens(hud.object); });
  col.appendChild(assign);
};
Hooks.on("renderTokenHUD", game._netarchHud);
console.log("Netarch Scanner ready");

}
if (game.ready) bootScanner();
else Hooks.once("ready", bootScanner);