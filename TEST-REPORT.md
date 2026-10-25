# CraftCareer 1.3 verification report

Date: 25 October 2026.

## Results

| Suite | Passing checks |
|---|---:|
| GitHub service integration | 39 |
| Shared canvas service | 21 |
| Document/model | 30 |
| Responsive layout | 11 |
| Browser editor regression | 111 |
| Browser editing and viewport | 25 |
| Browser publishing with simulated GitHub | 30 |
| Browser collaboration, assets and new controls | 22 |
| **Total** | **289** |

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
