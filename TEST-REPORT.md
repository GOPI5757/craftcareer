# CraftCareer 1.2 — verification report

Date: 25 October 2026.

## Results

- 38 server integration checks — passed.
- 30 document/model checks — passed.
- 11 responsive-layout checks — passed.
- 111 existing browser editor regression checks — passed.
- 25 browser editing checks — passed.
- 30 browser publishing checks against the local simulated GitHub service — passed.

Total: **245 passing checks**. See README.md for reproducible commands and browser harness URLs.

## Controls and publishing-link update

The active Isolate label now uses the contrasting accent ink color. Split, Edit split, remove-component and blend buttons retain readable screen sizes as the preview zoom changes; checks cover editor widths of 1440, 1024 and 800 pixels. The published address is above the action buttons and is blue and underlined in both themes. The compact shared section/context row is retained. Server files, auth settings, configuration schema, tutorial and portfolio content are unchanged.

## Editing coverage

Eight resize handles; screen-space hit targets; small-component handle separation; Shift aspect ratio; Undo/Redo and cancellation; full-cell edge reachability; corner controls above resize hit areas; docked toolbar geometry; numeric scrubbing; split-count scrubbing; vertical text alignment; underline; zero-gap lists; compact item selection and inspector scrolling; Ctrl+D duplicate identity and style; typing field shortcut exclusions; arrow-key alignment; isolation and return to a lower-page scroll position; remove confirmation and Undo; icon-only buttons; transparent hover/pressed fills; local social icons; favicon/title; config export/import round trips.

Desktop Edit, Browse and Full view logical rectangles were compared directly. The existing viewport suite covers 1920×1080, 1366×768, 1024×768, 768×900, 390×844 and 600×360 editor sizes with desktop/tablet/mobile previews, both scroll ends and inspector reachability. Full view also adapts when the browser is resized.

## Publishing coverage

Existing OAuth state, PKCE, bound HttpOnly cookie, same-origin/CSRF, upload hash/size and repository ownership checks still pass. No auth scope or environment variable was added. Tests cover managed-file preservation, atomic commits, conflict detection, no force push or repository deletion, Pages state and external unpublish, session expiry, rapid dialog close/reopen, disconnect, deployment progress, safe links and unchanged public repository association.

Reopening tests cover portfolio discovery, private/non-admin exclusion, invalid identity, managed config/asset restrictions, commit-pinned blob reads after subsequent repository edits, byte/hash verification, arbitrary-file refusal, opening a previous destination after choosing a separate copy, and publishing back to that destination.

## Visual and package verification

The actual creator was inspected in the browser, including selected-element resize controls, the fixed context strip, isolation and the single compact desktop header. Browser tests use the production editor and shared runtime resources. JavaScript syntax and resource consistency were checked. The delivery ZIP is integrity-checked and extracted for the Node test suites.

## Verification limits

The GitHub tests use a local HTTP service with simulated GitHub responses. No real GitHub OAuth login, production repository modification, or public Pages deployment was performed during this update. Existing authentication configuration is retained. Real GitHub availability, API quotas, browser-reserved shortcuts and host deployment timings remain external dependencies; tests are not a guarantee that every possible website configuration is bug-free.
