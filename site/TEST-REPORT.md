# CraftCareer 1.5.1 verification report

Date: 26 October 2026.

## Checks run for this update

| Suite | Passing checks |
|---|---:|
| GitHub service integration and OCR caching | 41 |
| Shared-canvas service | 21 |
| Document model | 30 |
| Responsive layout model | 11 |
| Image analysis and compiler | 20 |
| Guided review | 9 |
| Recognition, grouping and generated layout regression | 7 |
| Sharing roles, revocation and presence | 16 |
| Browser editor regression | 111 |
| Browser editing and viewport | 25 |
| Browser assistant, OCR, export and simulated publishing | 33 |
| Earlier artist reference: geometry, export and reopening | 20 |
| Artist reference: navigation, logo and social-button list | 20 |
| Technical-artist reference: portrait, review, button list, export and reopening | 26 |
| **Total** | **390** |

The seven recognition regression tests include 2,000 seeded generated layout cases. These exercise rows/columns, item counts, gaps, independent assets, configuration round trips, valid splits and desktop/tablet/mobile variants. They are synthetic geometry tests, **not 2,000 website screenshots, model training or evidence of universal visual accuracy**.

The Node suites pass on the working source and are rerun from the extracted release ZIP. ZIP integrity and every packaged file are verified against the tested source. Preview/export resources match their runtime, CSS, layout and icon source files.

## Actual reference-image checks

The supplied technical-artist image is processed with the bundled OCR engine and local visual detector. It produces an independent portrait candidate, a full-width uncertain-lettering review, and a four-button group. In the tested review path, the reviewer chooses to preserve the stylized lettering as an image, confirms a button list, and retains the decorative background. The result contains movable portrait/lettering image components, editable role text, and one ordinary list containing Portfolio, About Me, Contact and Resume. Choosing an image preserves appearance; it does not make the lettering editable text.

The technical layout has no horizontal page overflow and its button labels remain within their bounds at widths of 320, 390, 768, 1280 and 1600 pixels. Exported section configuration contains the list, assets and styles. Reopening that ZIP preserves the sections exactly and passes validation. Manual selection in the editor reaches the list and its individual item inspector.

The earlier artist references are also rechecked. Their navigation and logo remain separate, and the three lower-left social controls compile into one row list with individual image assets. The general browser assistant checks include light/dark examples, cancellation, review, independent device layouts, asset export, re-import, Undo/Redo and preserved pre-existing content.

## Reviewed examples

Unanswered review questions prevent example export. A completed review exports the working reference PNG, a versioned annotation JSON and a SHA-256 source hash. The annotation explicitly says `human-reviewed-proposal`. The operation is local; no upload or automatic model learning occurs.

## Scope and limits

No new model was trained and no external screenshot corpus was downloaded. See TRAINING-STATUS.md for what was attempted, the remaining data/training stages and references. Browser-native vision AI was unavailable on this test device; this release's actual-image checks use OCR and visual rules. No 99.9% accuracy claim is made.

OCR can still misread stylized text, decorative features can be mistaken for controls, and missing elements may need manual marking. Unknown fonts, hidden background pixels, original URLs, hover behavior and responsive rules cannot be recovered reliably from one screenshot. Background cleanup remains approximate. Reviewed images and logos are crops, not reconstructed vectors.

Publishing, sharing service/client, cursor collaboration, tutorial, icon library, Dockerfile and environment template are byte-for-byte unchanged from 1.5.0. Service tests and local simulated publishing pass; no real GitHub repository or deployed service was modified. Existing single-process, memory-only sharing limitations remain documented in SHARING.md.

Private reference PNGs and local test logs are excluded from the delivery package. Real-image harnesses require the developer to supply those fixtures as described in tests/fixtures/README.md. No credentials or private environment file are packaged.
