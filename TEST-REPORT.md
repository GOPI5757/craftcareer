# CraftCareer 1.6.1 — test report

26 October 2026

## Passed automated checks

The full suite passed: **233 checks** (221 existing checks plus 12 presentation checks).

New checks cover complete keyword matching, exact original text preservation, safe markup-like text, Unicode, case matching, typing progress, a six-second maximum duration, normal completion, reduced-motion handling, cancellation, repeated completion and loading order. The existing help suite also verifies that the production server serves the new presentation script.

JavaScript syntax checks passed. Source comparisons confirm the server, portfolio model, rendering/export runtime, image assistant, help articles and answer-matching engine are unchanged. Changes affect help presentation, its configuration, script loading, documentation and tests only.

## Not performed

Browser tools reported local browser use disabled. The optional browser harness was updated for progressive replies, keyword highlighting and reading-position retention, but was NOT run. Visual animation, scroll behaviour and screen-reader behaviour remain unverified in a real browser in this release. No production deployment or live GitHub action was performed.

## Delivery

The ZIP excludes private screenshots, logs, credentials and local dependencies. ZIP integrity and a fresh extraction are checked before delivery. Reuse existing Render environment settings; no backend setup or API keys are needed.
