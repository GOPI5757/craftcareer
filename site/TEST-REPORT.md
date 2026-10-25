# CraftCareer 1.6.0 verification report

Date: 26 October 2026

## Automated checks completed

The complete `npm test` command passed with 221 checks:

| Suite | Passed |
| --- | ---: |
| GitHub service | 41 |
| Shared canvas service | 21 |
| Configuration/model | 30 |
| Responsive layout | 11 |
| Preserved design engine | 20 |
| Design review | 9 |
| Generated layout (including 2,000 seeded cases) | 7 |
| Guided sharing | 16 |
| Built-in help | 66 |

Help tests cover representative questions, selection-aware replies, follow-up topics, unsupported requests, safe handling of markup, bounded input, topic/action integrity, the hidden image launcher, HTTP delivery of help resources, unchanged GitHub session responses, and embedded export resources. JavaScript syntax checks passed for the changed application and new help files.

Source comparison against 1.5.1 confirms the production server, publishing, sharing, renderer, model, layout, and embedded export resources are unchanged. Image analysis remains available internally; only its launcher is hidden by default. A resource comparison test was corrected to normalize Windows versus Unix line endings. One test invocation hit a Node/V8 internal crash; a subsequent complete run passed.

## Limits of this verification

Interactive browser access reported disabled in Work settings, including the final availability check. The new chat panel has NOT been visually or interactively verified in this release. The optional `/help.html` browser harness is included, but its results are not counted above. No live GitHub publish, production deployment or external-account change was performed. Automated checks do not guarantee that every user question will match correctly or that the interface has no bugs.

The guide is reviewed local retrieval, not a generative language model. No model training or external AI service integration is claimed. Its 53 English topics cover supported CraftCareer workflows; unfamiliar wording may require choosing a topic.

## Package checks

The deliverable excludes private screenshot fixtures, logs, credentials and local dependencies. ZIP integrity and extracted-package tests are checked before delivery. Keep existing Render environment variables when deploying. No new keys or environment settings are required.
