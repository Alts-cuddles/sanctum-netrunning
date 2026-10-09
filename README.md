# Sanctum Netrunning

Foundry VTT module for Cyberpunk RED. Mapper, scanner access points, and the sheet Jack In button.

## File structure

```text
sanctum-netrunning/
  module.json
  scripts/
    main.js
    mapper.js
    scanner.js
    jackin.js
```

## What each script does

- `main.js` — the only file Foundry loads. It imports the other three, then shows the load notice.
- `mapper.js` — the netarch map, generator, combat panel, rules, and runners.
- `scanner.js` — right-click a token to make it an access point. A Scanner roll pulses tokens in range.
- `jackin.js` — adds Jack In under Speed. Normal spends 1 NET Action. Stealth spends 2.

## Open the mapper

GM macro:

```javascript
if (!game.user?.isGM) {
  ui.notifications.warn("Only the GM can open the mapper from this macro.");
} else if (typeof game.netarch?.open !== "function") {
  ui.notifications.warn("Enable Sanctum Netrunning, then try again.");
} else {
  await game.netarch.open();
}
```

Scanner and Jack In start with the world. The panel does not open until the GM runs the macro, or a player uses Jack In.
