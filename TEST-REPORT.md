# CraftCareer 1.5.0 verification report

Date: 26 October 2026.

## Completed checks

| Suite | Passing checks |
|---|---:|
| GitHub service integration and OCR caching | 41 |
| Existing shared-canvas service | 21 |
| New sharing roles, revocation and presence service | 16 |
| Document/model | 30 |
| Responsive layout model | 11 |
| Image analysis and grid compiler | 20 |
| Guided classification and image proportions | 9 |
| Browser editor regression | 111 |
| Browser editing and viewport | 25 |
| Browser publishing with simulated GitHub | 30 |
| Browser canvas controls and asset workflows | 16 |
| Browser guided sharing, recovery and responsive header | 20 |
| Browser image assistant, real OCR and export/publishing | 33 |
| Earlier supplied image: fidelity, export and re-import | 20 |
| Latest supplied image: navigation, three icon buttons and geometry | 20 |
| **Total** | **423** |

The production JavaScript and test scripts pass syntax checks. Embedded preview/export resources match the current CSS, layout, runtime and icon source files. Packaging checks verify ZIP integrity and every included file against the tested source. Node suites are rerun from the extracted delivery package.

## Image review

The actual supplied artist-portfolio reference is processed by the bundled OCR engine. The header links are proposed as navigation, the header mark as a logo/image, and the three lower-left social controls as buttons. Each requires an explicit multiple-choice answer. After confirmation they become ordinary editable navigation, image and button components. The large title and small labels stay within their bounds; image assets use contained/proportional rendering.

The browser tests also use a different dark layout with an illustration and colored button, and a light layout with dark text. Detector tests vary control placement across left/right/top/bottom and vertical groups, and include dark borders on a light background. Questions are reversible without duplicate controls. Unanswered reviews cannot be applied. Manual marking, correction, cancellation, device previews, Undo/Redo, unique section IDs, asset export, re-import and preserved existing content are checked.

The assistant was inspected visually, including the cropped multiple-choice controls and reconstructed page. Expanded review controls remain reachable at laptop dimensions. The private screenshots used for exact-image tests are excluded from the release ZIP.

This does not establish universal reconstruction accuracy. Local OCR and visual rules can still misread or miss a component. Cropped symbols are image assets, not recreated vectors, and links require user-specified destinations. Background cleanup is approximate. Real browser-native vision AI was unavailable on this test device; its adapter is tested with controlled responses, not a live model.

## Sharing and recovery

Each generated link has a separate token and role. Owner-only listing, generation and deletion are enforced at the service. Viewer and Instance editor links cannot write; Helper links can. Independent copies use frozen snapshots and separate local drafts. Revoking one link does not revoke the others. Delete-all blocks active viewer/helper access and future independent imports, while imported independent drafts remain editable after reload.

Helpers must enter a name before the editing UI opens. Both sides receive named remote cursors, with Owner enforced by the service; own cursors are omitted. Invalid coordinates, excessive updates, expiry and disconnected-cursor cleanup are tested. Presence does not change document revisions. Revocation during an in-flight content or cursor submission is rechecked before accepting it.

Concurrent owner/helper edits preserve both local versions and require explicit conflict resolution. Owner reload restores the same room and Sent links. Snapshot comparison ignores object-key ordering while retaining real content differences. Opening another portfolio disconnects that browser before replacing its workspace. Sharing credentials, names/cursors and publishing metadata do not appear in exported configuration.

Sharing still uses single-process, memory-only rooms with a 24-hour maximum lifetime. Restarting or redeploying the server ends active links. It is complete-revision synchronization, not character-level automatic merging. See SHARING.md.

## Creator interface and regression

Header and menu bounds are checked at 1024×768, 1280×720, 1366×768, 1536×695, 1920×1080 and 2560×1440. The Workspace menu stays alongside Publish, including on wrapped laptop headers. The inspector, canvas and menu remain inside the viewport. Older tests also cover mobile and very short windows, including 600×360. Very short windows reserve the right panel for inspector controls.

Prior checks cover resizing and Shift proportions, independent corner handles, keyboard focus, inspector scroll ends, disclosure preservation, split editing, cell blends, Edit/Browse/Full-view geometry, isolation, item lists, colors, asset upload/move/rename, project controls, device overrides, config export and re-import.

## Publishing and scope

GitHub integration checks use the local mock service: OAuth state/PKCE, CSRF, ownership checks, atomic commits, update/rebuild status, reopening portfolios, unpublish, republish and disconnect. No real GitHub login, production repository modification or public deployment was performed in this update. The GitHub service, publisher, environment template, Dockerfile and setup guide are unchanged from the preceding release.

The existing tutorial and icon library are retained. No paid AI endpoint or new dependency has been added. Automated checks cover these fixtures and workflows; they cannot guarantee that every possible design or user configuration is bug-free.
