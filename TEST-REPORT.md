# CraftCareer canvas and corner update — verification

110 checks: 30 model tests, 11 responsive-layout tests, and 69 browser regression checks.

## New coverage

- Edit and Browse have matching section, cell, component, navigation, and project-card rectangles at 1280, 768 and 390 pixel viewport widths. Editor controls add no page height, padding or grid tracks.
- Four circular handles, linked changes, independent changes, inward/outward dragging, zero and maximum bounds, pointer cancellation, touch input, keyboard controls and retained keyboard focus.
- One undo step per completed drag, redo, live inspector values, reset controls, correct targeting of image borders/cells/backgrounds, section reordering and preserved preview scroll.
- Canvas controls stay within desktop, tablet, phone and small-phone previews. All editing controls disappear in Browse and in exported portfolios.
- Independent corner settings render in exported portfolios at desktop, tablet and mobile widths. Config files, per-device overrides, ZIP export/reimport and legacy scalar-only radii are checked.
- Interactive verification includes actual mouse dragging of an image handle, unlocking corners, changing one corner, and checking the corresponding inspector values.

## Retained coverage

- Inspector first/last fields with all groups expanded and hierarchy resizing, across 1440×900, 1280×720, 1024×600, 768×600, 390×844 and 600×360 editor windows.
- Preview top/bottom reachability across multiple editor sizes and desktop/tablet/mobile previews; the editor workspace uses CSS sizing to avoid a delayed header measurement clipping its bottom.
- Split ownership and nesting, preserved ratios and contents, 2,000 randomized split adjustments, assets and path updates, image borders/blending, portrait fitting, section archives, replacement/swapping, tutorial availability, and export/import compatibility.

## Reproduce

Run `node verification/model.test.js` and `node verification/layout.test.js`. Serve this extracted folder locally and open `verification/index.html` for the browser suite. It creates isolated drafts and generated fixtures. Background browser tabs may slow the tests; keep the test page active until it reports DONE.

This is targeted coverage in the current Chromium browser, not a guarantee for every possible browser and content combination. Network-backed YouTube and Sketchfab embeds retain their existing requirements.
