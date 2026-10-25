# CraftCareer 1.7.0 — verification report

Date: 26 October 2026

## Completed automated verification

The complete npm test suite passed **267 checks**:

| Suite | Checks |
| --- | ---: |
| GitHub service | 41 |
| Shared canvas service | 21 |
| Portfolio model | 30 |
| Responsive layout | 11 |
| Preserved design engine | 20 |
| Design review | 9 |
| Generated layouts (including 2,000 seeded layouts) | 7 |
| Sharing links | 16 |
| Local help | 66 |
| Typing and safe emphasis | 14 |
| Cloudflare backend/client transport | 32 |

Cloudflare tests use mocked upstream responses and real local HTTP requests. They cover successful answers and request format, curated guide context, history bounds, safe context fields, same-origin checks, session/CSRF protection, input limits, provider errors, 3036 daily pause and exact UTC reset, separate temporary-capacity handling, local daily ceiling, session expiry, timeouts, concurrency, rate throttling, no raw error/secret disclosure and local-time user messages. Client transport tests cover session renewal without repeating provider failures.

Syntax checks passed for the changed JavaScript. Source comparisons confirm portfolio configuration/model/rendering/export, image-analysis, publishing UI, sharing UI/service and the existing GitHub route handlers are unchanged. New help routes are added before the existing routes. The only reviewed-guide change clarifies that AI help is now optional.

## Important limits

No live Cloudflare request was made: the owner's Account ID and API token were not supplied. Model answer quality, account permissions and live availability remain to be checked after configuration. The default model and request schema were checked against Cloudflare's current official model documentation.

Browser access reported disabled. The updated interface and existing browser harness were NOT run interactively. Screen-reader behaviour, visual contrast and layout remain unverified in a real browser in this release. No production deployment, GitHub repository modification or real publish was performed.

The in-memory application counters and pause state reset when the service restarts and are not shared across replicas. They are not a billing guarantee. Cloudflare enforces its own free allowance when the account remains on Workers Free. See CLOUDFLARE-SETUP.md.

## Package verification

ZIP integrity and extracted-file hashes are checked before delivery. A fresh extraction runs the automated suite. Private screenshot fixtures, logs, credentials and local dependencies are excluded. No real secret is included; test-only credentials are synthetic.
