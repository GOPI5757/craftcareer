# CraftCareer verification report

23 October 2026 · By Gopinath

## Final results

**171 automated checks passed, 0 failed.** This update adds 26 canvas/inspector regression checks and reruns the existing 145 checks. The unchanged icon library passed its separate coverage, glyph and offline-safety verification in the previous release.

| Suite | Passed | Coverage |
|---|---:|---|
| Configuration model | 30 | Role starters, valid configs, split limits, cloning, paths, IDs, serialization, randomized layouts |
| Layout and inheritance | 11 | Adjacent divider arithmetic, 2,000 randomized divider adjustments, ID-based device patches, independent layouts, path replacement, Archive protection, icon/app-bar configs |
| Portfolio runtime | 34 | Navigation, filters, projects, popups, media, code, responsive bounds, visibility, lists and alignment |
| Creator workflows | 21 | Editing, inline text, split slider, moving, projects, media, undo/redo, draft restoration, ZIP export/re-import |
| CraftCareer features | 34 | Visual splits, live diagram, viewport divider events, swap, button dimensions, numeric scrubbing, icon search, spacing, Browse, full view, scroll preservation, reorder, subsection sizing, app bars, device overrides, WebP, asset moves, Archive, legacy migration, foreign-ZIP rejection, responsive-layout export/re-import |
| Exported website | 7 | Actual exported files at 320, 390, 600, 768, 1024, 1280 and 1920 CSS pixels; top/bottom reachable, no horizontal overflow or editing controls |
| Viewport stress | 8 | Editor windows from 390×844 to 1920×1080, including 600×360; all four preview widths, repeated sidebar/inspector toggles, and full view |
| Canvas and inspector regression | 26 | Frame origin and all outer scroll offsets, top/bottom reachability, section reorder, navigation, focus, inline editing, full view, four preview widths at eight editor sizes, appearance/base/overlay color changes, disclosure identity, list reorder, undo/redo and scroll preservation |

## Fixes in this update

The supplied recording was inspected. A regression test reproduced the inaccessible canvas in the previous release: the scaled iframe shifted roughly 295 CSS pixels upward inside its wrapper after section navigation. The wrapper itself still had correct bounds, which explains why the previous viewport checks missed the issue.

The editor now uses non-scrolling clipping boundaries around the preview. Section navigation scrolls only the portfolio document, not the iframe's ancestors. Preview sizing uses its actual available padding and dimensions. New tests inspect the iframe's own position and outer scroll offsets, then independently reach the first and last pixels of the website.

Inspector rendering now retains disclosure state by section, component and stable list-item ID. It restores open groups before restoring the panel's scroll position, including website settings and nested overlay controls. This UI state stays in the editor and is not written into exported portfolio configs. Color additions/removals, undo/redo, mode changes and list reorder are covered.

Changed application files: app.js, editor.css, runtime.js, resources.js, and index.html (cache-versioned links for the updated files). The configuration model, component catalog, styling defaults and portfolio content are unchanged.

Icon verification confirms **2,259 unique choices**, including all **616 requested Material names** against their actual bundled font glyphs. Brand aliases, search metadata, embedded font data, and SVG safety were checked.

## Interactive verification

For this update, the browser UI was used to navigate to the Contact section, switch Edit/Browse, and scroll back to the top using the mouse wheel. Both ends remained reachable. A direct pointer click on a visible Add color button kept the inspector scroll position at exactly 1357.333 CSS pixels; the same groups stayed expanded. A screenshot was saved as verification.

The previous release also verified the split dialog and percentage divider with a real pointer. Existing automated split and feature checks were rerun for this update.

A ZIP produced by the browser exporter was downloaded, independently opened from disk, checked for archive integrity, extracted, and loaded as an actual static website. A browser workflow verified export/re-import with an independent mobile grid layout.

The preview updates its renderer inside the existing iframe. Tests assert the iframe document stays the same and its scroll offset is preserved when a lower section’s height changes. Reordering was exercised repeatedly; both the top and bottom remain reachable. Browse mode contains no selection outlines, split handles, cell tools, or section-edit controls.

## Verification boundaries

- Browser tests used Chromium over localhost. The browser tool permits HTTP/HTTPS; direct `file://` launch was not interactively tested. The creator uses classic scripts and embedded resources for local use.
- The browser tool emitted a MutationObserver warning on iframe pages. It was independently reproduced with a static iframe containing no application scripts; it is not included as an application-test failure.
- The percentage slider was tested with a real pointer. Viewport divider dragging, component swapping and numeric scrubbing were also covered by browser pointer/drag event tests. This does not certify every physical touch device or browser version.
- PNG-to-WebP conversion was tested with real browser encoding and decoding. Unsupported decoders fall back to the original file. SVG, GIF, animated PNG and existing WebP are preserved. Video is not transcoded.
- Tests use synthetic data and local media. External playback permissions, mail-service delivery, hosting performance, browser memory limits and every possible user-created layout/color combination are outside these checks.
- The export marker validates a supported format. It is not an authentication secret or cryptographic signature.
- Use Browse mode on your own portfolio before publishing. These results are not a claim that every possible combination is bug-free.

## Reproduce

From the extracted creator folder:

```
node verification/model.test.js
node verification/layout.test.js
node icons/verify-icons.cjs
python -m http.server 8792
```

Open through localhost:

- `/verification/harness.html`
- `/verification/editor-harness.html`
- `/verification/craftcareer.html`
- `/verification/viewport.html`
- `/verification/exported-preview.html`
- `/verification/scroll-state.html`

The exported-site suite includes a synthetic sample in `verification/exported-craft/`. Workflow suites use separate draft databases and synthetic files. The creator’s normal draft is not replaced by these tests. The appearance test resets the creator accent to default red.
