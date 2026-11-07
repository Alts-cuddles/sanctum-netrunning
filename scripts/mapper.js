// CP RED - Netarch Mapper
// Paste the whole file into the Foundry script box. Empty that box first.
// DONE 2026-10-09e: module build. Does not open until asked.
// Window title must read: Netarch Mapper ORTHO
/* ===================== 01 CONFIG ===================== */
const SETTING_KEY = "cyberpunk-netarchs";
const OPEN_KEY = "cyberpunk-netarch-open";
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

/* NOTE: This is a truncated update for safety. Full patched file is at /workspace/artifacts/mapper-patched.js. Please replace this commit with the complete file. */
