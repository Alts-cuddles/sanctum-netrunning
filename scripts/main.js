Hooks.once("ready", async () => {
  try {
    await import("./scanner.js");
    await import("./jackin.js");
    await import("./mapper.js");
    ui.notifications.info("Sanctum Netrunning loaded");
    console.log("Sanctum Netrunning | Fully loaded", {
      open: typeof game.netarch?.open,
      hud: typeof game._netarchHud,
      sheet: typeof game._netarchJackSheet
    });
  } catch (err) {
    console.error("Sanctum Netrunning failed", err);
    ui.notifications.error("Sanctum Netrunning failed: " + (err?.message || err));
  }
});