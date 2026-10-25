# CraftCareer 1.6.0 help update

Choose **? Help** for the free, local built-in guide. From image is hidden; its code is retained. See ../HELP-GUIDE.md for behaviour and configuration, and ../TEST-REPORT.md for this release's verification limits.

# CraftCareer

**A portfolio creator for game makers — By Gopinath.**

Create a responsive portfolio from sections, grids, and components. Everything you create is saved as editable configuration when you export your website.

## Current update

Version **1.5.1** improves dark artwork and repeated-button detection, uncertain-lettering review, proportional layouts, and button lists. It also lets you save reviewed examples locally. This is a recognition update, not a newly trained model. See **../TRAINING-STATUS.md** and **../TEST-REPORT.md**.

### Earlier editing and publishing features

Version 1.3 adds reliable Pages update builds, a separate Open GitHub button, right-drag copies, a Background shortcut, navbar height, custom scrollbars, project-card actions, safe asset renaming and temporary cclinks. See **../UPDATE-GUIDE.md** and **../SHARING.md**. Sharing and GitHub operations require the included Node server. Editing and ZIP export can still run locally.

## Editing update

See **../UPDATE-GUIDE.md** for the docked toolbar, Shift resize, vertical alignment, compact list editing, Ctrl+D, Ctrl+1 isolation, additional icons, and reopening portfolios from GitHub.

## GitHub publishing update

The new **Publish** button supports connection, publishing, updates, live links, unpublishing and disconnecting. These functions require the included Node service and your registered GitHub OAuth app. See **GITHUB-SETUP.md**. Editing and ZIP export still work without that service.

## Start here

1. Extract this entire ZIP. Keep its files and `vendor` folder together.
2. Open **index.html** in a current desktop Chrome or Edge browser. There is no installation or build step.
3. Choose a blank canvas or a role-based starter.
4. Add sections, split their grids, and place components.
5. Check your portfolio in **Browse** mode at desktop, tablet, and mobile widths.
6. Click **Export website**. The downloaded ZIP is your finished static website, with readable config files and all your uploaded assets.
7. To publish, extract that exported website ZIP and upload its contents to your static host. The `index.html` must be at your hosting root. Upload the exported portfolio, not this creator, if you want visitors to see your portfolio.

You can also host this creator itself as a static site. It requires neither accounts nor a server database. Opening it locally is sufficient; browser storage availability can vary in private browsing or restricted environments, so keep exported ZIP backups.

This update fixes canvas clipping during scrolling/navigation and keeps the inspector's scroll position and expanded groups when colors or other settings are updated. To continue an existing portfolio, open its exported website ZIP in this creator. The portfolio configuration format is unchanged.

## Canvas overlays and corner controls — 24 October 2026

- Editing tools now float over the preview. They add no rows, padding, or section height. The same content occupies the same positions in Edit, Browse, and the exported website.
- The colored frame marks the website width; dashed outlines mark section boundaries. **END OF WEBSITE** marks the actual bottom. These guides never appear in Browse or the published website.
- Split controls sit on the first divider of their own group. Hover or focus them to see the outlined cells and their numbers. Add section, Add subsection, and Add project remain available as overlay controls.
- Select a component to reveal **four circular corner handles**. Drag inward to round the corners and outward to square them. The **Linked / Independent** lock beneath the selection matches **Link corners** in the inspector.
- With the lock off, the inspector exposes **Top left**, **Top right**, **Bottom right**, and **Bottom left**. With it on, one radius controls all four. Reset buttons, undo/redo, and device overrides continue to work.
- **Adjust corners on canvas** in Appearance, Image border, Cell layout, or Background layers selects that exact border. The blue guide and its label identify the target. Image handles follow the fitted image, not its letterboxing or caption.
- Handles accept mouse and touch dragging. Keyboard arrows change the radius; Shift uses larger steps, Home squares the corner, End uses the available maximum, and Escape cancels a drag. A completed drag is one undo step. Canvas drags are bounded by the box size.
- Configuration stays in the same files: `borderRadius` (or `imageBorder.radius`) is the shared rem value. `radiusLinked: false` uses `radiusCorners: { topLeft, topRight, bottomRight, bottomLeft }`. Missing corner settings preserve older scalar-only configurations. Exported portfolios remain readable and can be reopened in CraftCareer.

## Inspector, split targeting and image update — 24 October 2026

- The inspector has one scroll area with a fixed header. Expanded groups keep their full content height, and the hierarchy divider preserves a usable minimum inspector area on short windows. Both the first and last fields remain reachable.
- **Edit split** sits on its group’s divider, showing the direction and cell count. Hover or keyboard-focus it to outline the group and number its immediate children. The dialog names the group path and the content of each cell. Changing direction or proportions still preserves content.
- Select an **Image**, then open **Image border** for width, color, and radius. These affect the visible image rather than its caption. Existing **Appearance** settings still style the overall component.
- Open **Image edge blending** and enable **Blend edges**. **Fade width** controls how far the fade extends from all four edges. Leave **Tint color** blank to reveal the real background, including gradients and background imagery. Set a color and **Tint strength** to add a colored feather that still fades into the background. Reset returns to the default; disabling the effect restores sharp image edges.
- Portrait images using **contain** stay fully visible, and the fade follows the image itself rather than its empty surrounding space. The image border and caption remain crisp.
- New image settings are stored under the image element as `imageBorder` and `edgeBlend` in the section configuration. They support independent device overrides, ZIP export, and later reimport. Older images keep their existing appearance until these effects are enabled. Image URL edits now update the preview while typing/pasting as other text fields do.

## Navigation update — 24 October 2026

- **Header:** Edit/Browse, Assets, page/device preview, Full view, and panel visibility. **Workspace** holds creator color/theme, New, Open ZIP, Save, Export, tutorial and quick guide. Website settings and Undo/Redo are separate header controls.
- **Bottom components tray:** drag into a cell, or select a cell and click a component. Use arrows, the mouse wheel, horizontal trackpad scrolling, or middle-button dragging to browse the tray. Dropping a new component on an occupied leaf replaces it; Undo restores the previous component.
- **Hierarchy:** automatically named sections, subsections, split cells, components, and project cards. Expand branches to navigate; selecting a row opens its inspector. Empty cells are labelled clearly. Hierarchy labels are generated from content and cannot be renamed there. Section names remain editable in Section settings.
- **Panel divider:** drag the horizontal divider between Hierarchy and Inspector, or focus it and use Up/Down. Its position is remembered on this browser.
- **Canvas controls:** the section-name button opens section settings; Remove section asks for confirmation. Add section below a section inserts there. Split and Edit split open the same visual wizard. Changing direction retains content; removing extra cells asks for confirmation.
- **Inspector:** labels and controls sit side by side, with ↺ reset buttons. Appearance and the floating toolbar show controls relevant to the selected component. Font controls for captions/titles are separate from media appearance. Hex edits immediately update their color swatch. Inspector scroll and disclosure state remain intact during updates.
- **Move components:** click anywhere in an occupied leaf cell to select it; drag the cell to move or swap its component. Double-click text to edit it directly. Internal image drags reuse the existing asset. External file drops ask where to save.
- **Asset library:** a large content-browser dialog, folder tree on the left and assets on the right. Upload multiple images/documents/models, create section subfolders, pick assets, and move them with references updated across devices. Protected section/type roots and Archive rules are unchanged.
- **YouTube only:** new local video file imports are rejected, including direct drops. Video components, gallery videos and background video settings accept YouTube URLs. Existing video files in older ZIPs are preserved for recovery/cleanup, but YouTube video playback is replaced by a YouTube prompt. Legacy video folders remain accessible when they contain files.
- **Fixed canvases:** Fit sections use the available viewport height; Flexible sections use their configured rem height. Subsection height controls its grid. Resizing splits or enlarging components does not enlarge these canvases. Components stay within their cells, and long text can scroll inside its cell. Infinite/project/content-panel sections still grow by adding subsections. Set device overrides where a layout needs more room.
- **Background borders:** Background layers now includes border width, border color, and corner radius.

Everything remains config-driven. Exports still contain `config/site.js`, individual `config/sections/*.js`, the renderer and assets. Previous CraftCareer exports remain importable. Hierarchy expansion and panel sizes are editor preferences and do not affect the exported portfolio.

The included tutorial is retained. It demonstrates the previous workspace layout; its player notes where controls moved. No tutorial media is included in users' exported portfolios.

## How to build

### Watch the tutorial

Click **Video tutorial** in the Workspace menu. The 2-minute 36-second tutorial opens over the editor, with English narration, visible captions, animated pointers, playback speed/fullscreen controls, and chapter shortcuts. Press Play to begin. Close the player or press Escape to return to your work; closing pauses the video and reopening keeps its playback position during that session.

The tutorial is bundled in `tutorial/`, so it also works when opening the creator locally. Keep that folder with the creator when hosting it. The video is loaded on demand, and is not included in portfolios your users export.

In `creator-config.js`, `tutorial.enabled` hides or shows the button. You can also change its title, video path, poster, and chapter titles/times. Captions are already embedded in the picture.

### Sections first

- **Fit:** fills the viewport after the top navigation. Oversized content stays within cells; long text scrolls inside its cell.
- **Flexible:** choose a section height in rem.
- **Infinite:** add as many subsections as needed. Each subsection has a configured rem/viewport height for its grid.
- **Projects:** a category bar or filter sidebar and a collection of cards. Categories can also be hidden.
- **Content panel:** a separate canvas that opens from a button near the bottom of the screen.
- **Navigation bar:** add rows, split them into cells, and place normal components. Choose sticky or scrolling behavior. Available in Add section and the Components palette.
- **Project page:** created automatically with a project card. It uses the same infinite subsection builder.

Section display names must be unique. Asset roots and exported section IDs are stable when you rename a section.

### Split the space

Click **Split** directly on a canvas cell, or use **Cell layout → Split this cell**. Choose 2–4 cells. Use the Columns/Rows radio buttons and live diagram to see the arrangement. The segmented slider starts with equal shares. Drag a divider to trade space between its two adjacent cells; the total stays 100%. Arrow keys move a focused divider by 1%, or 5% with Shift.

You can nest up to three split levels. Each leaf cell holds one component; a list counts as one component. Splitting an occupied cell moves its component into the first child cell. Drag the divider between cells directly in the canvas to resize later. You can also select a parent from the section’s layout hierarchy and use the same slider.

Desktop is the base design. Tablet and mobile inherit the desktop structure. Select another device to create independent overrides; the inspector states which device you are editing. Reset this device returns it to the desktop design. The optional Phone flow setting can stack columns on phones. Use the nine-position alignment selector, Fit component to cell, padding, and gap to control placement. Measurements use rem, with viewport percentages available for subsection height. A rem follows the browser's base font size, normally 16px; the layout rules provide the responsiveness.

### Place and edit components

Drag a component from the bottom tray into an empty cell. You can also select the cell and click the component. Select a placed component for its floating formatting toolbar and collapsible inspector. Double-click plain text in the preview to type directly.

The floating toolbar remains inside the preview and scrolls horizontally if needed. Drag directly from an occupied cell to move its component to another cell. Dropping onto an occupied cell swaps the two components. Hide the right panels to give the preview more room.

Components include text, buttons, decorative icons, images, video, galleries, code snippets, Sketchfab viewers, contact forms, dropdowns, lists, dividers, and spacers. Every component has a visibility switch. Lists support text, buttons, dropdowns, images, and images with captions. Shared item appearance applies to new list items; use an individual override when one item needs different styling.

Numeric fields support typing, the normal arrow controls, and horizontal dragging. Hold Shift while dragging for finer adjustment. A drag becomes one Undo step.

Use **Full view** to hide the editor panels and inspect the site in Browse mode. Exit with the visible button or Escape. Ordinary setting changes preserve preview scroll position.

In infinite sections, project pages and content panels, **Add a layout preset** creates an editable image breakdown, paired-image comparison, video with notes, code walkthrough, model viewer, or profile/skills layout. These are normal grids and components after insertion. **Add subsection** is also available at the bottom of the canvas. A subsection’s height controls its actual grid; a blank heading is hidden. Text wraps within cells, and long text scrolls without expanding fixed canvases.

### Appearance and backgrounds

Website settings control the global font, background, text, accent, navigation, contact dock, and footer. Components can override font and appearance. Project headings, card text, category navigation and subsection titles have their own appearance controls.

Buttons have automatic sizing or custom width and height in rem. Custom buttons stay within their cell. **Choose icon** opens a searchable local icon library with names, pictures and categories. A standalone Icon component is decorative. The library contains 2,259 choices, including all 616 requested Material names and game-tool/social brand icons. Marmoset Toolbag is labelled as an MT monogram.

Component appearance includes background colors/gradients, borders and padding. Lists have separate container and shared-item appearance, with optional individual overrides. Cells also have their own backgrounds, borders, padding and margin.

Backgrounds have separate base, image/video, and overlay layers. A one-color array is solid; multiple colors create a gradient with your chosen angle. Image and overlay opacity are independent. Optional edge fading blends the image into a chosen page color.

Background videos are muted and respect reduced-motion preferences. Video components use YouTube links and load the player after clicking Play. Galleries support images and video, captions, arrow navigation, and image enlargement.

### Projects and categories

Add a Projects section, create categories, then add cards. A card can belong to several categories. Choose category buttons, a checkbox filter sidebar, or no category UI. Set card counts separately for desktop, tablet, and mobile; choose visible details or a hover reveal design.

A card can open a full project page, replace the cards inline, or open an external URL. When you add another card, choose whether to copy a previous project's page layout. Copies have independent settings and initially reuse the same asset paths.

Project pages support category and subcategory navigation tied to their subsections, with an optional sticky bar. Subsections can be collapsible and initially expanded or collapsed. Code blocks provide a file name, language label, line numbers, selected-line highlights, wrapping, vertical scrolling, and an explanation below.

### Links, pop-up panels, and downloads

Buttons and dropdown options can:

1. Scroll to a section.
2. Open a content panel.
3. Close the current panel.
4. Open a link or document in a new tab.
5. Download a file.

Content panels have their own backgrounds, subsections, grids, and components. They can close on scroll and have a built-in close control. Opening another panel replaces the current one. Local downloadable files are most reliable; remote servers can override the browser's download behavior.

### Assets stay organized

Each section has protected roots:

```
assets/<section-id>/images/
assets/<section-id>/videos/
assets/<section-id>/documents/
assets/<section-id>/models/
```

Upload through Asset library and create subfolders as needed. Choose an asset from any section to reuse it. Dropping files directly onto a cell first asks where to store them. Duplicate filenames get a numeric suffix. Referenced files cannot be deleted until you remove their references. Use **Move** on an asset to choose another section/type/subfolder. Every reference across all device variants is updated. Click the × beside a section to remove it after confirmation. Its config is removed and its files move into the protected Archive folders; other sections using those files follow the new paths. Removing a project card alone retains its independent project page.

The following roots always exist and cannot be renamed, removed, or given subfolders:

```
assets/archive/images/
assets/archive/videos/
assets/archive/documents/
assets/archive/models/
```

JPEG, PNG, BMP and other browser-decodable raster uploads convert to WebP by default. The original files on your computer stay unchanged. **Website → Image optimization** controls conversion, quality (default 0.86), and maximum dimension (default 2560 pixels; images are never enlarged). SVG, GIF, animated PNG and existing WebP stay unchanged. Unsupported decoders fall back to the original file with a notification. Video is not transcoded.

Images use asynchronous decoding and lazy loading below the first visible image. The first visible image receives higher loading priority, YouTube loads its player on demand, background players use lazy loading. Large files and slow connections still affect load time.

For an interactive 3D model, link a public **Sketchfab** model. FBX/GLB/other source files can be stored in Models and offered for download. This release does not render raw FBX files locally.

## Save, reopen, and publish

- Local drafts save in this browser on this device. **Save draft** also saves explicitly.
- **Export website** is your portable backup and publishing package.
- **Open ZIP** reads CraftCareer exports and legacy CraftCareer exports, including its edited configurations and assets. This creator does not analyze/import arbitrary third-party sites; that belongs to the separate Portfolio Studio editor.
- **Ctrl+Z / Cmd+Z** undo; **Ctrl+Y / Cmd+Shift+Z** redo. Inputs keep their normal text-editing undo while focused.
- Editor dark/light mode is independent of your portfolio’s theme. Dark is the initial editor theme. The appearance button beside the theme switch changes the editor accent, with red as the default. Edit `creator-config.js` to set the default accent and theme for a fresh browser; an existing saved preference takes priority.

Your exported website includes its own README explaining manual configuration edits and hosting. All user content lives in `config/site.js` and `config/sections/*.js`, not in the HTML shell. Config objects are JSON-compatible JavaScript assignments with readable names and indentation. `config/site.js` also stores ID-based `deviceOverrides` patches. Tablet means 601–1024 CSS pixels, and mobile means 600 pixels or narrower. The `craftcareer.json` marker identifies the export format; it is a compatibility check, not an authentication secret. Arbitrary HTML/CSS/JS website imports are deliberately rejected.

## Contact forms and external services

No hidden email service or account is supplied. Without an endpoint, contact forms open an email composer or Gmail and clearly say they have not sent mail themselves. You may add a compatible HTTPS form endpoint, then test its delivery and cross-origin policy on your host. Never put secret API keys into a public config.

YouTube and Sketchfab need internet access and publicly accessible content. Third-party playback, embedding permissions, mail delivery, and browser privacy settings remain outside the creator’s control.

## Files in this creator

`index.html` is the creator shell; `editor.css` and `app.js` provide the editor; `model.js` defines configuration and validation; `layout.js` manages device inheritance and weighted splits; `icons.js` bundles the searchable local icon library; `creator-config.js` defines editor defaults; `runtime.js` and `site.css` render portfolios; `resources.js` includes the same runtime and CSS for local preview/export; `vendor` contains JSZip and its license. If you change runtime.js, site.css, layout.js or icons.js, run `python build.py` to refresh resources.js before packaging.

See **TEST-REPORT.md** for completed verification and the scope of testing. The `verification` folder contains reproducible model and browser test harnesses. Tests use isolated draft storage and synthetic project data.



## Clean canvas controls (October 2026)

- Section actions sit in the editor strip above the preview: choose a section, open its settings, remove it with confirmation, or add a section after it. None of these controls occupy website space.
- Unselected cell controls are hidden. Hover a cell to reveal faint tools; select it for full-opacity tools and smaller corner handles. Click the editor background, click unused section background, or press Escape to clear selection. Editing fields and using the inspector keep the current selection.
- Split sits at the top center of a cell, away from corner handles. The compact Edit split button retains an ownership tooltip and highlights its immediate children.
- Newly created sections have zero padding. Existing files keep their configured padding. Adjust Section padding in the inspector to add breathing room.
- Full view is a live, edge-to-edge preview at the current window size. The normal device selector remains available outside Full view; returning restores the previous device and editing mode. Use the floating Exit full view button or Escape to return.
- Buttons expose Hover appearance and Click / pressed appearance. Each supports text and background colors. Pressed means while the mouse/touch/keyboard is held, not a permanent selected state. The section configuration stores hoverColor, hoverBackground, clickColor and clickBackground. Button lists have shared states and optional per-item overrides. Navigation, footer and contact links also expose these states.
- Exported portfolios use the same renderer and state styles. No editor controls, selections or editor UI settings are written into portfolio content.


## Sizing and cell blending update

- Website settings, Undo, and Redo are directly on the top bar. Workspace contains creator appearance, file operations, and the tutorial.
- Select a component to reveal edge handles. Drag an edge to resize its frame without scaling its font or icon; keyboard arrow keys adjust a focused edge, Shift increases the step, and Escape cancels an unfinished drag. One completed drag is one Undo step. Components stay bounded by their cell.
- Buttons have **Fit to content**, **Width**, and **Height** in Button dimensions & icon. Editing a dimension turns Fit off. Custom dimensions retain a content-sized minimum, bounded by the available cell. Fit restores automatic sizing. Button lists expose these controls for each item.
- Other components have a Frame size group. Turning Fit back on restores their normal component-specific sizing. Resizing changes the frame, and overflowing text/code/form content scrolls inside it. Flexible sections expose top/bottom resize edges when selected. Infinite, project-page and popup subsections expose edges around their actual content grid; select the subsection in the hierarchy to resize it.
- Very small components use a compact expanded corner-handle arrangement outside their actual rectangle, so all four radius controls remain distinct. The outline still follows the actual component.
- Hover any child of a split to reveal the parent Edit split control. The compact circular **◐** control at each divider toggles a soft visual transition across that pair of cells. The inspector's **Cell blending** group exposes each toggle and its blend width in rem. It blends the facing strips of colors, gradients and static images, while foreground text remains sharp. The feature is off by default. It softens the join; it does not reconstruct or align unrelated photographic subjects. Animated videos/interactive embeds retain their original rendering.
- Exported portfolios contain the same sizing and blending renderer. These settings are saved in each owning `config/sections/<section-id>.js`, including device overrides; the creator does not require a server to save configuration.

### Configuration fields

Buttons retain the existing `sizeMode: "auto" | "custom"`, `width`, and `height` fields in rem. Other components use `dimensions: { enabled, width, height }`; `enabled: false` is Fit to content. Flexible sections use their existing `height`, and subsections retain `height` and `heightMode`. Split cells use `blends: [{ left, right, enabled, width }]`, where left/right are the stable adjacent child cell IDs. Copying a project page remaps these references to the copied cells. All fields are ordinary serializable configuration values, and older exported sites still import with neutral defaults.



## Guided review and sharing (1.5)

From image now asks multiple-choice questions for uncertain controls and keeps images in proportion. Open GitHub and Share canvas are under Workspace. Sent links manages Viewer, Instance editor and Helper links separately. Helpers choose a name and see remote cursors. Independent imports remain local even after the source link is deleted. Temporary rooms still end after 24 hours or a server restart. See the package-level DESIGN-ASSISTANT.md and SHARING.md for details.
