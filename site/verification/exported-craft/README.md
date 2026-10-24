# CraftCareer regression

Created with CraftCareer — By Gopinath. Export format 2 (config-grid).

## Open and publish

Open index.html to view the portfolio. To publish, upload the contents of this ZIP (including index.html at the root) to any static host, such as GitHub Pages. Do not upload only the ZIP. No build step, package manager, or server database is required. Video embeds, Sketchfab, external links and optional form services need internet access.

## Folder structure

- index.html: the empty page shell and script references. User content is not stored here.
- css/site.css: responsive layout and component styles.
- js/runtime.js: the same renderer used in the creator preview.
- js/boot.js: loads the configuration into the renderer.
- config/site.js: website settings, format version and section order.
- config/sections/<section-id>.js: one editable file per section, including project pages and content panels.
- assets/<section-id>/images/: thumbnails, backgrounds, galleries.
- assets/<section-id>/videos/: local video and reels.
- assets/<section-id>/documents/: resumes and downloadable files.
- assets/<section-id>/models/: FBX and other model/source downloads.

These asset roots are stable. You may create subfolders inside them. Images and documents can be reused across sections. Asset paths stay relative, so the site also works below a repository path. Do not rename a root without updating every reference.

## Edit configuration manually

Each config file assigns a plain JSON-compatible object to window.PortfolioConfig or window.PortfolioSections["id"]. Keep the surrounding assignment. Change the quoted values, numbers, booleans and arrays; keep double quotes and valid JSON inside the object (no functions, expressions, trailing commas, or inline comments). CraftCareer can reopen an exported ZIP and read these edited values without executing its scripts. A true enabled value displays an item; false hides it.

site.js lists sectionOrder. When manually adding a config file, also add its script reference to index.html and its ID to sectionOrder. Project pages and popup sections are configured like other sections but do not appear in the home-page flow.

## Sections and grids

appbar provides configurable navigation rows and grid cells, with sticky or scrolling behavior. fit fills the viewport after the navigation; it grows when content cannot fit, avoiding clipped text on small screens. flexible uses height as a minimum in rem. infinite, page and popup contain any number of blocks (subsections). Each block has an automatic, rem, or viewport-percentage minimum height applied to its actual grid canvas. Projects sections contain project cards and category mappings.

A cell holds one element OR 2–4 children. direction is columns or rows. ratios are positive percentages totaling 100. Three nested split levels are supported. Desktop is the base design. Tablet and mobile inherit it unless you create overrides with the device selector. Grid layout, styling, and content can be overridden independently. The optional cell mobile setting can stack columns on phones. Tall content grows to avoid clipping. align supports nine positions. fit stretches the component to its cell; padding and gap use rem. 1rem follows the browser root font size (normally 16px). Text scales at narrow widths; readable minimums and media rules handle responsiveness.

## Backgrounds and styling

A background array with one color gives a solid fill; two or more colors give a gradient using backgroundAngle. The image/video layer has independent imageOpacity. Overlay colors, angle and opacity are nested under overlay. surface.enabled switches off that entire surface. Videos use local files, muted loops, and respect reduced-motion preferences.

Element style and itemStyle contain font, colors, spacing and borders in rem. Lists inherit itemStyle. Set an item's override to true to use its style instead. Project cards follow cardStyle unless override is true. Color values accept CSS colors; use hex values for easy color-wheel editing.

## Components and behavior

Text, buttons, decorative icons, images, video, gallery, code, Sketchfab, contact forms, dropdowns, lists, dividers and spacers are supported. Buttons support automatic or custom dimensions and named icons from the local library. Lists can contain text, buttons, images, images with text, or dropdowns. Row lists wrap down; column lists wrap across within columnHeight and reflow on small screens.

Button action.type: section (target section ID), popup (target popup ID), close, external (url in a new tab), or download (url and optional downloadName). Local downloads are the most reliable; remote hosts can override browser download behavior.

Project mode: page, inline, or external. Categories can use bar, checkbox, or none. Project detail pages can have a sticky category/subcategory navigation tied to the category and subcategory on each block. Subsections may be collapsible, with initiallyCollapsed controlling the initial state. Cards can copy a previous project's layout; copied layouts are independent but initially reuse asset paths.

Code components contain fileName, language (a label), code, startLine, highlightLines (e.g. "2-5, 9"), maxHeight in rem, wrap and explanation. Long code wraps by default and scrolls vertically. Gallery images can open in a full-screen lightbox. YouTube URLs include watch, shorts and share URLs. Sketchfab uses a public model URL; uploading an FBX to the library makes it downloadable, not a local interactive viewer. Upload to Sketchfab and link its model for the interactive viewer.

## Contact forms

No hidden backend is provided. Without endpoint, the form opens the visitor's email composer or Gmail, and does not claim to have sent anything. Add a compatible HTTPS form-service endpoint to submit with POST/FormData. Test that endpoint and its CORS policy after hosting. Never put secret keys into config files.

## Reopen in CraftCareer

Open CraftCareer, click Open ZIP, and select this complete ZIP. Local drafts use browser storage on this device; they do not publish changes. Export a ZIP as your portable backup. The creator does not import arbitrary third-party websites.

## Device overrides and identity

config/site.js stores deviceOverrides as structured patches against the desktop configuration, keyed by stable IDs. Tablet is 601–1024 CSS pixels; mobile is 600 pixels or narrower. The editor device selector chooses which independent patch you edit. Reset this device removes only that patch. Shared assets are global. The main section list remains in config/sections; device-only sections are included in their device patch. The craftcareer.json format marker identifies a supported archive structure. It is a compatibility marker, not an authentication secret or cryptographic signature. Legacy Portfolio Forge format 1 archives are migrated on import.

## Media and Archive

assets/archive/images, documents, videos, and models are permanent protected folders. Removing a section removes its config and moves its files into Archive without subfolders. Other references follow their new paths. Move in the asset library also updates references on every device. Unreferenced files can be removed, and Undo restores a move or deletion during the editing session.

New JPEG, PNG and browser-decodable raster uploads are converted to WebP by default, using site.imageImport quality and maxDimension. Images are never enlarged. SVG, GIF, animated PNG and existing WebP are preserved. Unsupported formats are kept with a notification. Compression cannot guarantee instant loading on slow networks; file dimensions, video length and the host still matter. Below-the-fold images load lazily, media frames defer heavy players, and background videos start near the viewport.

## Icon licenses

The included js/icons.js uses a local Material Icons font, brand SVGs, and original symbols. ICONS-LICENSES.md contains the license notices. Marmoset Toolbag is explicitly shown as an MT monogram. No external icon service is required.

## Before publishing

Replace starter text, add your real projects and media, check image descriptions, verify every destination and resume file, then test Browse mode at desktop, tablet and mobile widths. Use compressed images and short optimized background videos for faster loading. Static content and all uploaded assets are public once hosted.
