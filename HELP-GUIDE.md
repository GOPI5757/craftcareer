# CraftCareer Help — 1.6.0

## For users

Choose **? Help** in the top bar. Ask a question, choose a suggested guide, or open **Browse topics**. The guide covers 53 reviewed CraftCareer workflows, including layouts, splits, components, lists, assets, responsive overrides, publishing and collaboration.

This is a **built-in guide**, not a generative AI model. It matches words, supported phrases and selection context to reviewed instructions. It cannot understand every wording, inspect a GitHub account, guarantee a diagnosis or create a layout. Ambiguous matches offer topic choices; unmatched questions say so. Use the topic list if a question is not understood.

**Use selected component** shares only the type of selection, section type, editing mode, device and view-only state with the local guide. It does not read your project text, uploaded files, account credentials or asset contents. Questions and responses remain in page memory, are never sent to a server, and disappear on reload. New chat clears them. Opening another workspace also clears the conversation.

The guide's **Show…** buttons open or highlight the relevant existing control. They do not submit a publish action, delete a section or change component values. Close the help panel to continue working; the canvas is not resized when help opens. Enter sends; Shift+Enter adds a line; Escape closes. Chat input does not trigger canvas shortcuts.

## Why there is no hosted AI connection

The owner requested free help without depending on a limited AI service. The official services checked on 26 October 2026 provide quotas, not an unlimited free service for every visitor:

- [Gemini API](https://ai.google.dev/gemini-api/docs/rate-limits): model/project usage limits apply to the free tier.
- [Groq](https://console.groq.com/docs/rate-limits): free plans have request and token limits.
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/platform/pricing/): free allocation is 10,000 neurons per day; requests fail after applicable limits are exceeded.

No account, external AI integration, API key or paid fallback was added. Once the creator's files have loaded, this guide does not need a network request to answer. This does not guarantee uptime of the website's hosting service.

## Configuration and maintenance

In `site/creator-config.js`:

- `helpChat.enabled`: show or hide the guide.
- `helpChat.title`: chat heading.
- `helpChat.useSelection`: default selection-context setting.
- `helpChat.maxMessages`: bounded visible history (8–60 messages).
- `designAssistant.showLauncher`: defaults to false. Set true to restore From image. `designAssistant.enabled` remains true so its existing API and tools remain available for development.

The image assistant's scripts, model resources, review UI, examples and tests are retained. The guide does not load OCR resources when used.

`site/help-knowledge.js` contains the reviewed articles and their related topics. Update these when control names or behaviour change. `help-engine.js` performs local retrieval; `help-chat.js` is the interface. The content is currently English. User text is rendered as text, never executed as HTML.

Help is creator-only: exported portfolios contain their usual section configurations, assets and runtime. They do not acquire chat files or conversation history. Publishing, OAuth, sharing and the portfolio format are unchanged.

## Verification

Run `npm test` for service, configuration, image-engine and help retrieval checks. `node tests/browser-server.mjs` then `/help.html` runs the optional browser harness against the local mock server. Never deploy the test server. See TEST-REPORT.md for which checks were actually run in this release.
