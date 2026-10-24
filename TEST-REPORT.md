# CraftCareer GitHub publishing update — verification

Date: 24 October 2026.

## Automated checks

- 31 GitHub service integration checks using Node's HTTP server and a simulated GitHub API.
- 24 browser publishing checks using the actual creator, ZIP import/export, publishing UI and service against that simulated API.
- 30 existing document/model checks.
- 11 existing responsive-layout checks.
- 111 existing browser editor regression checks.

Total: **207 checks**. The test commands and browser harnesses are included; see the package README.

## Publishing coverage

OAuth state/PKCE and cookie binding; token/secret exclusion from client responses; same-origin and CSRF enforcement; safe generated-file paths; upload size/hash validation; creating a public repository; keeping unrelated repositories untouched; preserving unmanaged files; removing obsolete managed assets; concurrent-head conflict detection; no force push; no repository deletion; incremental uploads; repeatable finish/unpublish; Pages main/root configuration; build status matched to the current commit; unpublish/republish; token revocation failure recovery; disconnected and expired sessions.

Browser checks cover confirmation/cancellation, actual generated config/runtime uploads, asset references including spaces and Archive, excluding unused assets, live links, export with public repository metadata but no credentials, reimporting the published ZIP, mobile editing destination persistence, compact dialog width, and restoring editing after closing the dialog.

The existing editor regression suite covers canvas/split controls, sizing, linked and individual corner radii, seam blending, inspector scrolling, section controls, responsive overrides, assets, ZIP import/export, component fields, button states, and undo/redo.

## Visual and package checks

- Publishing dialog inspected in the browser with a simulated connected account and completed deployment.
- Missing-credentials setup state checked using the production startup command.
- JavaScript syntax and package startup checked.
- Final ZIP extracted, integrity checked, and tests run against the extracted copy.
- Existing runtime, model, layout, resources, icons and tutorial retained from the previous update. Changes are limited to publishing integration, its header control, related documentation and tests.

## Limits of verification

No real GitHub credentials were supplied. **A real GitHub authorization and public Pages deployment were not performed.** GitHub calls were tested against a local simulation of the documented APIs. The service still requires the owner's OAuth app credentials and a Node-capable host; its account permissions, hosting proxy, GitHub limits and deployment behavior must be verified after setup.

The simulated account and repository shown in the preview screenshot are test fixtures, not an actual hosted portfolio. No claim of a bug-free system or guaranteed GitHub uptime is made.
