# CraftCareer

**A portfolio creator for game makers — By Gopinath.**

Create a responsive portfolio from sections, grids, and components. Everything you create is saved as editable configuration when you export your website.

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

## How to build

### Watch the tutorial

Click **Video tutorial** in the left sidebar (the play icon when collapsed). The 2-minute 36-second tutorial opens over the editor, with English narration, visible captions, animated pointers, playback speed/fullscreen controls, and chapter shortcuts. Press Play to begin. Close the player or press Escape to return to your work; closing pauses the video and reopening keeps its playback position during that session.

The tutorial is bundled in `tutorial/`, so it also works when opening the creator locally. Keep that folder with the creator when hosting it. The video is loaded on demand, and is not included in portfolios your users export.

In `creator-config.js`, `tutorial.enabled` hides or shows the button. You can also change its title, video path, poster, and chapter titles/times. Captions are already embedded in the picture.

### Sections first

- **Fit:** fills the viewport after the top navigation. If your content cannot fit, it grows to keep text accessible.
- **Flexible:** choose a minimum section height in rem.
- **Infinite:** add as many subsections as needed. Each subsection can grow to fit content or use a minimum rem/viewport height.
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

Drag a component from the left palette into an empty cell. You can also select the cell and click the component. Select a placed component for its floating formatting toolbar and collapsible inspector. Double-click plain text in the preview to type directly.

The floating toolbar remains inside the preview and scrolls horizontally if needed. The move handle on the cell or floating toolbar moves a component to another cell. Dropping onto an occupied cell swaps the two components. Collapse the sidebar or inspector to give the preview more room.

Components include text, buttons, decorative icons, images, video, galleries, code snippets, Sketchfab viewers, contact forms, dropdowns, lists, dividers, and spacers. Every component has a visibility switch. Lists support text, buttons, dropdowns, images, and images with captions. Shared item appearance applies to new list items; use an individual override when one item needs different styling.

Numeric fields support typing, the normal arrow controls, and horizontal dragging. Hold Shift while dragging for finer adjustment. A drag becomes one Undo step.

Use **Full view** to hide the editor panels and inspect the site in Browse mode. Exit with the visible button or Escape. Ordinary setting changes preserve preview scroll position.

In infinite sections, project pages and content panels, **Add a layout preset** creates an editable image breakdown, paired-image comparison, video with notes, code walkthrough, model viewer, or profile/skills layout. These are normal grids and components after insertion. **Add subsection** is also available at the bottom of the canvas. A subsection’s height controls its actual grid; a blank heading is hidden. Content grows or wraps when it needs more room.

### Appearance and backgrounds

Website settings control the global font, background, text, accent, navigation, contact dock, and footer. Components can override font and appearance. Project headings, card text, category navigation and subsection titles have their own appearance controls.

Buttons have automatic sizing or custom width and minimum height in rem. Custom buttons shrink to their cell and grow for wrapped labels. **Choose icon** opens a searchable local icon library with names, pictures and categories. A standalone Icon component is decorative. The library contains 2,259 choices, including all 616 requested Material names and game-tool/social brand icons. Marmoset Toolbag is labelled as an MT monogram.

Component appearance includes background colors/gradients, borders and padding. Lists have separate container and shared-item appearance, with optional individual overrides. Cells also have their own backgrounds, borders, padding and margin.

Backgrounds have separate base, image/video, and overlay layers. A one-color array is solid; multiple colors create a gradient with your chosen angle. Image and overlay opacity are independent. Optional edge fading blends the image into a chosen page color.

Background videos are muted and respect reduced-motion preferences. Standard local video components have controls; YouTube embeds load after clicking Play. Galleries support images and video, captions, arrow navigation, and image enlargement.

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

Images use asynchronous decoding and lazy loading below the first visible image. The first visible image receives higher loading priority, YouTube loads its player on demand, local videos use no initial preload, and background videos load near the viewport. Large files and slow connections still affect load time.

For an interactive 3D model, link a public **Sketchfab** model. FBX/GLB/other source files can be stored in Models and offered for download. This release does not render raw FBX files locally.

## Save, reopen, and publish

- Local drafts save in this browser on this device. **Save draft** also saves explicitly.
- **Export website** is your portable backup and publishing package.
- **Open ZIP** reads CraftCareer exports and legacy Portfolio Forge exports, including its edited configurations and assets. This creator does not analyze/import arbitrary third-party sites; that belongs to the separate Portfolio Studio editor.
- **Ctrl+Z / Cmd+Z** undo; **Ctrl+Y / Cmd+Shift+Z** redo. Inputs keep their normal text-editing undo while focused.
- Editor dark/light mode is independent of your portfolio’s theme. Dark is the initial editor theme. The appearance button beside the theme switch changes the editor accent, with red as the default. Edit `creator-config.js` to set the default accent and theme for a fresh browser; an existing saved preference takes priority.

Your exported website includes its own README explaining manual configuration edits and hosting. All user content lives in `config/site.js` and `config/sections/*.js`, not in the HTML shell. Config objects are JSON-compatible JavaScript assignments with readable names and indentation. `config/site.js` also stores ID-based `deviceOverrides` patches. Tablet means 601–1024 CSS pixels, and mobile means 600 pixels or narrower. The `craftcareer.json` marker identifies the export format; it is a compatibility check, not an authentication secret. Arbitrary HTML/CSS/JS website imports are deliberately rejected.

## Contact forms and external services

No hidden email service or account is supplied. Without an endpoint, contact forms open an email composer or Gmail and clearly say they have not sent mail themselves. You may add a compatible HTTPS form endpoint, then test its delivery and cross-origin policy on your host. Never put secret API keys into a public config.

YouTube and Sketchfab need internet access and publicly accessible content. Third-party playback, embedding permissions, mail delivery, and browser privacy settings remain outside the creator’s control.

## Files in this creator

`index.html` is the creator shell; `editor.css` and `app.js` provide the editor; `model.js` defines configuration and validation; `layout.js` manages device inheritance and weighted splits; `icons.js` bundles the searchable local icon library; `creator-config.js` defines editor defaults; `runtime.js` and `site.css` render portfolios; `resources.js` includes the same runtime and CSS for local preview/export; `vendor` contains JSZip and its license. If you change runtime.js, site.css, layout.js or icons.js, run `python build.py` to refresh resources.js before packaging.

See **TEST-REPORT.md** for completed verification and the scope of testing. The `verification` folder contains reproducible model and browser test harnesses. Tests use isolated draft storage and synthetic project data.
