
import "./scanner.js";
import "./jackin.js";
import "./mapper.js";

Hooks.once("ready", () => {
  if (typeof game._netarchHud !== "function") console.error("Sanctum Netrunning: scanner HUD hook missing");
  if (typeof game._netarchJackSheet !== "function") console.error("Sanctum Netrunning: jack-in hook missing");
  ui.notifications.info("Sanctum Netrunning loaded", { permanent: false });
  console.log("Sanctum Netrunning | Fully loaded");
});