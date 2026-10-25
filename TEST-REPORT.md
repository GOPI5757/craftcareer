# CraftCareer 1.7.1 — verification report

## Completed checks

The complete automated suite passed **287 checks**: the existing 267 checks plus 12 scrolling-controller tests and 8 chat interaction/state tests. The latter use a lightweight simulated DOM, not a browser.

New cases cover smooth arrival before typing, following answer growth, manual interruption, native scroll versus programmatic scroll, resuming on a new question, reduced motion, footer growth, cancellation, local and remote reply locks, Enter and topic-button guards, draft preservation, late network replies, error recovery, and closing or clearing while scrolling/typing.

Existing suites cover GitHub (41), sharing service (21), model (30), responsive layout (11), design engine (20), design review (9), generated layouts including 2,000 seeded examples (7), sharing links (16), local help (66), typing/emphasis (14), and Cloudflare backend/client transport (32).

Changed production JavaScript passed syntax checks. A source comparison confirms all server files, configuration, portfolio rendering/export, publishing and sharing code are unchanged. Production changes are limited to chat UI, its presentation helper/style and their cache-version references.

The first fresh-extraction run hit a local HTTP `fetch failed` error in an existing server-delivery test. A complete rerun passed all 287 checks without source changes; the transient failure was not reproduced.

## Limits

The browser tool reported that local browser access is disabled in Work settings. This release was not visually tested in a real browser. The optional browser harness is included but was not run. Simulated DOM and scrolling tests do not verify actual browser layout, animation appearance or assistive technology.

Cloudflare tests use mocked responses, not live account credentials. No production deployment or real GitHub publication was performed.

## Packaging

ZIP integrity and per-file byte comparisons passed. The full 287-check suite also passed from a fresh extraction. The ZIP excludes private reference screenshots, temporary logs and secrets. Existing tutorial/assets, image-analysis code and configuration format are preserved. No new environment variables are needed.
