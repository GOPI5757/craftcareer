# CraftCareer 1.4 verification report

Date: 25 October 2026.

## Results

| Suite | Passing checks |
|---|---:|
| GitHub service integration and OCR caching | 41 |
| Shared canvas service | 21 |
| Document/model | 30 |
| Responsive layout | 11 |
| Browser editor regression | 111 |
| Browser editing and viewport | 25 |
| Browser publishing with simulated GitHub | 30 |
| Browser collaboration, assets and new controls | 22 |
| Image analysis / grid compiler | 14 |
| Browser image assistant, real OCR and generated publishing | 31 |
| **Total** | **336** |

See README.md for commands and browser harness URLs. The delivery ZIP is checked for integrity, every packaged file is compared with the tested source, and the Node suites are run again from the extracted package.

## Publishing

Tests cover new and updated repositories, managed-file preservation, current-commit build status, automatic retry after a busy build, no unnecessary Pages reconfiguration on update, cache revision changes, stable revisions for unchanged exports, status refresh feedback, blue underlined live addresses above buttons, opening previous portfolios through the separate GitHub button, rapid close/reopen, expired sessions, unpublish, republish and disconnect. Reopening waits until import and destination restoration finish before closing.

Existing OAuth state, PKCE, bound HttpOnly cookie, same-origin/CSRF, upload hash/size and repository ownership checks still pass. There is no new OAuth scope or secret. Updates use atomic commits without force push or repository deletion.

## Collaboration foundation

Service checks cover distinct owner/editor/viewer capabilities, unauthorized and cross-origin requests, viewer write refusal, owner-only revocation, optimistic revision conflicts, expiry, memory/size limits, traversal and duplicate-name refusal, prototype-key validation, all-device document validation, exclusion of publishing metadata and script-capable assets, asset reuse and asset-cache invalidation.

Browser checks use three separate workspaces for owner, editor and viewer. They verify actual shared changes, view-only controls, concurrent local edits preserved for review, explicit conflict resolution, portable config exports, and ending the synthetic room. This is a temporary revision-based collaboration foundation, with the limitations documented in SHARING.md.

## Canvas, assets and regression coverage

Right-button copy preserves the source and styling, generates independent IDs, supports Undo, and keeps left-drag moving/swapping. Every component has a Background shortcut. Navigation and navigation-section heights render from configuration. Scrollbar theme settings reach preview and export. Project add/remove controls appear in Edit only, removal asks confirmation, and category-specific creation retains the selected category.

External image drops open the content browser, select a destination and filename, and use the converted asset. Renaming updates desktop and mobile references and export paths; duplicate filenames cannot overwrite an existing file.

The earlier viewport, inspector and editing suites cover scroll reachability, disclosure preservation, logical Edit/Browse/Full-view geometry, numeric dragging, zero-gap lists, eight resize handles, Shift proportions, small-component controls, individual corners, isolation, restoring a lower-page scroll position, keyboard shortcuts, button states, icon-only buttons and config export/import. Editor sizes include 1920×1080, 1366×768, 1024×768, 768×900, 390×844 and 600×360.

## Visual and source verification

The real editor was inspected in the browser. The selected-element toolbar shares the section row, the header contains Open GitHub and Share, and canvas tools remain readable. JavaScript syntax was checked, and embedded runtime/CSS/layout/icon resources match their source files. The tutorial, icon library, existing environment template and hosting files are retained.

## Verification limits

GitHub tests use a local HTTP service with simulated GitHub responses. No real OAuth login, production repository modification or public Pages deployment was performed for this update. Sharing tests run on the local included server, not a production Render instance. Host restarts, live API availability, quotas and deployment latency remain external dependencies. Tests do not guarantee that every possible user-authored configuration is bug-free.

## Image-to-layout assistant

The real bundled OCR engine was exercised on a dark design with text, an illustration and a colored button, and a light design with dark text. Tests cover type/size validation, bounded geometry, text/paragraph grouping, media detection, button recognition, correction controls, exclusion, manual region creation, uploaded files, cancellation before and during recognition, preview reopen, independent tablet/mobile layouts, unique IDs, preserved original sections and publishing association, single-step undo/redo, and view-only refusal.

Generated layouts were rendered at 320, 390, 768 and 1280 pixels and checked for horizontal overflow, narrow columns and clipped text. The assistant dialog was checked at a narrow viewport and the additional header control was checked for reachability. Generated image assets and section config files survived export/re-import and the existing simulated GitHub publishing flow. AI model files were excluded from the exported portfolio.

The native browser vision adapter has mock contract checks for multimodal input, constrained output, validation and session cleanup. The actual native model was unavailable in the test browser, so its real image-understanding quality is not claimed as tested. The default local OCR path was tested with actual inference, not mocked recognition.

Visual review confirmed the reference/result comparison and manual application into three real editor sections. Recognition and layout remain approximate; source text, typography and mobile flow need user review. This is not a trained-from-scratch general vision model or a guarantee of reproducing every design.

The AI browser harness is under tests/, served only by the local test server at /verification/design.html. It refuses to run without that server's synthetic test endpoint. It is excluded from the production Docker build.
