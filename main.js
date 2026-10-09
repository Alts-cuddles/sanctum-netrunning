import "./mapper.js";
import "./scanner.js";
import "./jackin.js";

Hooks.once("ready", () => {
  ui.notifications.info("Sanctum Netrunning loaded", { permanent: false });
  console.log("Sanctum Netrunning | Fully loaded");
});
