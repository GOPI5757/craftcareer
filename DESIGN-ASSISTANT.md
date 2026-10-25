# CraftCareer — image-to-layout assistant

**From image** beside Assets creates a starting layout using CraftCareer's normal sections, splits and components. Version 1.4.1 improves text over photographic backgrounds. Recognized headings and labels become editable components above a background layer; it does not present one flattened screenshot as an editable website or generate executable HTML from an AI response.

## Use it

1. Open CraftCareer and choose **From image**.
2. Select a PNG, JPEG, WebP, AVIF or BMP screenshot, or choose **Try an example**.
3. Choose **Analyse image**. Text recognition and layout analysis run on your device. The recognition files load only when needed.
4. Compare **Reference** with **Editable result**. Switch between Desktop, Tablet and Mobile previews.
5. Choose **Review regions**, or click a numbered region on the reference. Correct text, choose Text / Button / Image / Background, change its bounds, color, size or alignment, or untick a region to exclude it.
6. For something missing, choose **Mark a region**, drag a rectangle over it, then choose its component type. An Image region becomes a cropped image component; a Background region becomes a section image behind its components. Background layers must occupy non-overlapping vertical bands. For a background, **Original artwork** can replace the screenshot crop with your clean source image before applying. Use **Start manually** when automatic recognition is unsuitable.
7. Give the imported sections a name and choose **Add editable layout**. Existing sections remain in place. One Undo reverses the entire addition, including its new assets.
8. Continue with the usual cell, split, component and inspector controls. Assign button actions, replace image crops with original assets, and refine mobile layouts before publishing.

Tall screenshots can become several sections. The compiler keeps the existing limit of three nested split levels and two to four cells in each split. Designs too complex to fit that structure produce an actionable error instead of silently dropping content; use smaller screenshot portions or exclude overlapping regions.

## Two analysis modes

**Analyse image** is the broadly available mode. It combines the bundled Tesseract neural OCR model with CraftCareer-specific geometry, color sampling, image and button detection, grid construction, and responsive layout rules. English text recognition is included. This is specialized local analysis, not a newly trained general-purpose vision model.

**Use browser AI** is optional. When the browser exposes an available multimodal `LanguageModel` API, a local vision model can analyse the reference. CraftCareer gives it a constrained component description and validates its structured response before compiling it. The button is disabled on unsupported browsers/devices. If the browser needs its model first, the button says **Download & use browser AI**; the download can be large. There is no cloud AI fallback, API key, or paid inference endpoint. Availability depends on the browser, operating system, hardware, browser policy and model support.

The native vision path has contract tests for its request, validation, error handling and cleanup. The test browser did not expose the real model, so real native-vision quality has not been verified on this machine. The default OCR path is tested with the actual bundled recognition engine.

## What to expect

- It makes a useful editable draft, not a guaranteed pixel-perfect reproduction. Review recognition mistakes, spacing and colors.
- Screenshots cannot reveal original fonts, hidden content, animations, destinations, form behavior, breakpoint rules or project data relationships. Generated buttons intentionally have no invented destinations.
- Automatically generated components are text, buttons and images, with background images stored on sections. Other components and project/category behavior can be added with the existing editor.
- Desktop positioning is approximated through grids, not arbitrary absolute coordinates. Tablet and mobile receive editable stacking overrides; review these rather than assuming that one screenshot describes every device.
- Broad photographic hero sections receive a separate background analysis pass. High-confidence neutral/light lettering is recognized over artwork; targeted OCR retries recover small labels. Low-confidence texture hits are omitted instead of becoming stray text columns. This is still heuristic detection, not general visual understanding.
- Recognized source lettering is removed from background crops with approximate local cleanup. It can leave marks or smudges: a screenshot cannot supply the hidden artwork. Choose the background region and upload **Original artwork** for a clean result. Unrecognized logos, social icons and screenshot chrome can remain rasterized in the crop and do not acquire functional links automatically.
- Photo, illustration and UI boundaries can be ambiguous. Mark, resize or exclude regions in review when needed. Use original media for best image quality.
- Clear, uncropped, high-resolution screenshots work best. Busy photography behind text, very small text, unusual typography and languages outside the bundled English model need more correction.
- Upload limit defaults to 20 MB, with a 36-megapixel decoding guard. Analysis is downscaled to a bounded working size to limit memory use. A long screenshot can lose fine text; analyse it in sections.
- Automatic OCR requires HTTPS or localhost. If you double-click the creator HTML (`file://`), manual region marking still works; use the hosted creator or `npm start` for automatic analysis.

## Files and configuration

- `site/design-engine.js`: input normalization, text / media / button detection, grid compiler and device layouts.
- `site/design-assistant.js`: image review, local OCR, optional native vision adapter and generated preview.
- `site/design-assistant.css`: assistant UI, including dark/light styles and smaller-screen layouts.
- `site/vendor/ocr-6.0.1/`: pinned local engine, WebAssembly bundles, English model and licenses.
- `site/creator-config.js`: `designAssistant.enabled` hides/shows the feature; `maxFileMB` adjusts its upload limit within the hard safety cap of 30 MB.

The generated portfolio uses the existing `config/site.js` and `config/sections/<section-id>.js` files. The existing config format and runtime are retained. Imported photographic layouts add optional cell `referenceInset` values (`enabled`, `left`, `right`, `top`, `bottom`, in percent) and text `style.referenceWidth: 1280`. These preserve reference spacing through normal grid cells; the cell inspector exposes **Reference spacing** so it can be adjusted or disabled. Ordinary existing cells are unaffected. Tablet/mobile stacking removes those reference insets and uses normal editable spacing. Device overrides remain in the existing ID-based patch format. Generated crops use `assets/<first-generated-section-id>/images/region-N.webp` (PNG fallback if WebP encoding is unavailable). All generated sections and assets support the normal export, re-import, publishing and sharing flows.

The original full reference file is not included in the exported website; selected image/background crops are included as assets. AI libraries and model weights are creator-only and do not inflate a student's exported portfolio.

## Privacy, hosting and deployment

Recognition and layout inference do not send the reference image to a third-party AI server. The local engine is served by your CraftCareer host. Optional browser AI uses the browser's local model. Once the user applies the layout, generated image assets are ordinary portfolio assets and can be shared or published through the features they choose.

There is no AI billing integration or per-generation charge. Users supply their own device's computation. Hosting, bandwidth, storage, browser hardware limits and model availability still apply; this is not a promise of unlimited free infrastructure. The default OCR path initially transfers roughly 7 MB of engine/model resources. The English model uses browser caching, and the bundled server serves the versioned OCR files with long-lived cache headers. The creator ZIP contains all four core variants for different browser capabilities; only the appropriate variant loads.

Deploy the complete updated `site/` folder. This patch retains the 1.4 backend without changes; use the packaged server if updating from an older release. Keep your existing environment variables, GitHub app credentials, custom domain and OAuth callback settings. No additional API keys, database or AI server are required. Do not copy `.env.example` over your real deployment settings.

Primary implementation references: [Tesseract.js API](https://github.com/naptha/tesseract.js/blob/master/docs/api.md), [local Tesseract installation](https://github.com/naptha/tesseract.js/blob/master/docs/local-installation.md), [Chrome Prompt API](https://developer.chrome.com/docs/ai/prompt-api).
