## Installing 1.5.1

Replace the release files in your CraftCareer repository and let Render redeploy. Keep your existing Render environment variables and GitHub OAuth settings. Server routes and publishing credentials are unchanged. The release uses a new script version so browsers load the recognition update. Export important drafts as backups before updating.

# CraftCareer 1.5 update

## Update your hosted creator

Replace the matching files in your **CraftCareer creator repository** with this package's contents, keeping `site/`, `server/`, and `package.json` at their existing locations. Commit the update and let Render redeploy it. Keep your existing Render environment variables, OAuth client ID/secret and custom-domain settings. No new environment variable, dependency, database or OAuth permission is required.

The production start command stays `npm start`. Do not start `tests/browser-server.mjs` on Render. That server contains a synthetic test login.

After deployment, refresh CraftCareer. Existing exported portfolios and local drafts remain compatible. Export important drafts as a ZIP before replacing local copies of the creator. Opening a portfolio from GitHub loads the files that were actually published; unused library assets were never uploaded by the publisher.

## New in 1.5

Deploy **both site/ and server/**, plus package.json. The sharing endpoints changed in this release. Existing environment variables and OAuth settings remain valid. Redeployment ends active temporary sharing rooms, so finish shared work and export a ZIP first.

- **From image** asks cropped multiple-choice questions for uncertain navigation, logos, icon controls and text. Applying waits until the review is complete. Previous answers are revisable; the final question offers manual marking for missed controls.
- Confirmed navigation becomes an editable navigation bar. Confirmed visual controls become buttons with cropped image icons. Assign their destination yourself; screenshots cannot supply URLs.
- Imported imagery uses contained/proportional rendering. Photographic section height follows its reference aspect ratio; use **Keep reference proportions** in section settings to switch to manual sizing. Ordinary existing sections retain their sizing.
- **Workspace** replaces the old Settings menu name. It contains Open GitHub, Share canvas, Sent links, creator appearance and file operations. The header wraps into usable rows on laptop widths; Publish, Undo/Redo and Website settings remain accessible.
- Share generates fresh **Viewer**, **Instance editor** or **Helper** links. Manage/revoke them separately in Sent links. Independent imports never change the owner and remain after revocation.
- Helpers choose their name before joining; named remote cursors include the **Owner**. Simultaneous document edits are held for review, not silently overwritten.

See DESIGN-ASSISTANT.md and SHARING.md for workflows and limits. Existing authored configuration exports remain compatible. This update does not silently rewrite previously generated designs: analyse the original image again and review the new result.

## Retained controls from 1.3

- **Update website** queues a build for the newest commit without switching Pages off. If GitHub is still building, the server retries. Published CSS, scripts, configuration and local assets use content revision tags so browsers request the updated versions. After updating CraftCareer, open your portfolio and run **Update website** once to apply this to its export. Wait for the current deployment to report live; uploading and deploying are separate steps.
- **Refresh status** shows a checking state and a timestamp when it completes.
- **Open GitHub** is separate from Publish and is now under Workspace. Publish contains publishing controls only.
- **Right-button drag** duplicates a component into another leaf cell with independent IDs and the same styling. **Left-button drag** still moves or swaps. Right-dragging onto an occupied cell replaces its component; Undo restores it. A right click without dragging keeps the normal browser context menu.
- **Background** in the selected component's toolbar opens its colors/gradient controls in the inspector. The toolbar shares the section-control row.
- Set **Website settings → Top navigation → Height · rem** for the built-in top bar. Navigation bar sections also have their own **Height · rem** setting.
- **Website settings → Scrollbars** controls thumb, track, hover color, width, corner radius and thin mode. Enable Custom scrollbars to apply them. Native scrollbar appearance varies by browser and operating system; overlay scrollbars may stay hidden until scrolling.
- Project grids have an **Add project** tile after the cards and a **Remove** control on each card. Removal asks for confirmation and supports Undo. The project page and assets remain available. A new card inherits the currently selected category.
- External file drops open the same **Assets** browser used for normal uploads. Navigate the folder tree, edit the staged filename and choose **Save and use**. Images still convert to WebP where supported. Duplicate names are rejected within a folder.
- Existing assets now have **Rename**. Renaming keeps their extension and updates references in all device configurations. Folder protections and archive rules are unchanged.
- **Workspace → Share canvas** creates temporary Viewer, Instance editor and Helper **cclinks**. See **SHARING.md** for use, permissions, conflict recovery and the foundation's limits.

## Canvas controls

| Control | How to use it |
|---|---|
| Resize | Select a component and drag one of its eight square markers. Hold **Shift** to retain its starting proportions. Small components spread the markers apart to keep them usable. |
| Corner radius | Use the circular markers. They remain separate from resizing. |
| Context toolbar | The fixed strip above the canvas shows the selected component's main fields. It never covers the website content. Drag numeric values horizontally or click to type. |
| Text alignment | Use horizontal alignment and **Vertical: top / middle / bottom** within a resized text frame. |
| Underline | Use **U** in the context toolbar or **Underline** in any text appearance group. |
| Keyboard alignment | With a component selected, arrow keys move its cell alignment one step left/center/right or top/center/bottom. Typing fields retain their normal cursor keys. |
| Isolate | Select a component, then click **Isolate** or press **Ctrl+1** (Cmd+1 where delivered by the browser). Toggle again to return to the original canvas scroll position. |
| Remove | Use the small **×** in the occupied cell's tools. Confirm removal; Undo can restore it. |
| Split count | Drag the number horizontally or type a number from 2 to 4. Percentage dividers still total 100%. |

Desktop Edit and Browse use a uniformly scaled version of the current browser's desktop viewport, including its full logical height. Full view displays the website at the actual browser size. A selected mobile/tablet preview returns when you exit Full view. Device previews intentionally show their own responsive layout; resizing the browser across a breakpoint can change the website's layout as it would when hosted.

## Lists and buttons

- The list inspector has a compact item picker and one active item's fields. Click an item in the canvas to jump to it.
- Use **Ctrl+D / Cmd+D** to duplicate the selected list item, including its styling. The copy receives independent IDs. Undo removes the copy.
- List gap can be zero. **Item padding** is separate, so remove that padding too when you want the visible text or images very close together. Fonts still have their normal line height.
- Button labels can be empty. An icon-only button centers its icon without an empty label gap.
- Hover and pressed appearance each have separate **Text fill** and **Background fill** switches. Turning a fill off makes that layer transparent, including the label/icon when Text fill is off.
- The icon library includes 26 additional social and publishing brands, including Instagram, Facebook, X, Threads, TikTok, WhatsApp, Telegram, Twitch, Reddit, Behance and Bluesky. Assets are bundled locally with license notices.

## GitHub publishing

The publishing panel refreshes a connected destination every 30 seconds while open, more frequently while deploying, and when you return focus to the browser. **Refresh status** checks immediately and shows visible checking/completion feedback. If you disable Pages on GitHub, the panel changes to **Publish website again** and removes the stale live link and Unpublish action.

Upload progress shows completed file uploads. GitHub's deployment stage uses an indeterminate progress bar because GitHub does not provide a reliable percentage. Once the current build succeeds, the panel shows its address and **Visit website**.

Use **Workspace → Open GitHub** to browse public CraftCareer portfolios owned and administered by your connected personal account. Load more pages if needed. Choose a portfolio, optionally download your current ZIP backup, and confirm Open. Previous destinations remain available after **Publish a separate copy**. Unpublishing preserves the repository, so an unpublished portfolio can also be reopened.

The server only reopens repositories with a matching CraftCareer publishing marker. It reads config and managed assets from one pinned commit, verifies their hashes and sizes, and does not execute repository scripts. Auth tokens remain on the server. Public repository association stays under `site.publishing`.

## Configuration compatibility

All authored settings remain ordinary JSON-compatible fields inside exported config files:

- Component frame size: `dimensions.enabled`, `dimensions.width`, `dimensions.height`; buttons retain `sizeMode`, `width`, `height`.
- Text: `style.textDecoration` (`none` or `underline`) and `style.verticalAlign` (`top`, `middle`, `bottom`). Text-specific styles and list `itemStyle` use the same appearance fields.
- Button states: `hoverColor`, `hoverBackground`, `clickColor`, `clickBackground`; no fill is stored as `transparent`.
- Lists: `gap`, `itemStyle.padding`, item IDs, and per-item overrides remain in their original section config.
- Top navigation height: `site.topbar.height`. Custom scrollbar values: `site.scrollbars` (`enabled`, `thumb`, `track`, `hover`, `width`, `radius`, `thin`). Navigation section height stays in that section's `height`.
- Cell alignment stays in `align`; responsive patches stay in `deviceOverrides`.

Isolation, selection, editing markers and the context toolbar are creator controls and are never included in the exported website content. The existing export schema and section folder structure are unchanged.

## Updating to 1.4 — image-to-layout assistant

Deploy the updated source package, including `site/vendor/ocr-6.0.1/`. Existing environment variables and GitHub OAuth settings stay the same. There are no new secrets or paid AI endpoints. The server change only adds cache headers for the versioned local recognition resources. Existing portfolio config files remain compatible. See DESIGN-ASSISTANT.md.

## Updating to 1.4.1 — photographic design reconstruction

Replace the complete `site/` folder from this package, including `resources.js` and the local OCR resources, then redeploy. Cache-version tags have changed so the updated creator scripts load. The backend, environment variables, GitHub scopes, publish controls and sharing endpoints are unchanged from 1.4. Existing drafts and exported portfolios remain compatible.

Reopen **From image** and analyse the original design again; existing generated sections are not automatically replaced. The assistant now separates a broad photographic background from its editable text, rejects low-confidence artwork readings, and preserves large headings and reference spacing. Review before applying. To avoid approximate cleanup marks, select the background region and supply its **Original artwork**. See DESIGN-ASSISTANT.md for limitations and config fields.
