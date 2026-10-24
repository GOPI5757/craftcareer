# CraftCareer sizing and blending update — verification

152 checks: 30 model tests, 11 responsive-layout tests, and 111 browser regression checks.


## New sizing and blending coverage

- Standalone Website settings/Undo/Redo header actions; always-visible button dimensions and Fit checkbox.
- Canvas resizing for all 13 content component types (Navigation bar remains a section), flexible sections and content subsection grids. Cell bounds and fixed section heights remain intact.
- Button content-sized minimum, unchanged label font, custom width/height, Fit restoration, real mouse edge drag, cancellation and one Undo/Redo step per completed drag.
- Four distinct corner handles on 20×1, 1×12 and 1×1 rem components.
- Third-child hover exposes parent split controls; every adjacent pair has a blend toggle; toggle Undo and configurable blend width.
- Row/column blends, desktop/tablet/mobile rendering, hidden-child matching, inert snapshots, preserved snapshot geometry, and suppression of stretched foreground text.
- Configuration export/reimport and copied-page blend ID remapping. The same resources are embedded in preview and exported websites.
- Visual inspection of image/color transitions and foreground labels. Blend load events from inert copies are ignored to prevent repeated redraws.

## Clean canvas coverage

- Hidden idle tools, faint hover controls, selected controls at full opacity, outside clicks and Escape to clear selection.
- Compact split labels with ownership tooltips; 12px corner handles do not overlap the centered Split button.
- Section actions outside the website frame, remove confirmation, insertion after the selected section, zero padding on new sections, and preservation of configured padding on reimport.
- Full view fills the window width and height, uses unscaled rendering and follows actual responsive breakpoints; exit restores the editing device/mode. Resize coverage includes 1600, 768 and 390 CSS pixels.
- Button hover and pressed text/background colors, shared list button states, Undo/Redo and configuration export/reimport.
- Real pointer verification confirms the exact hover, held/pressed and released colors in the published renderer.

## Retained corner coverage

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
