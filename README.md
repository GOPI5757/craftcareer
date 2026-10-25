# CraftCareer 1.6.1 — chat presentation update

Help replies now type progressively and highlight important controls and terms. Long replies retain their starting position with a Read more button. No server/environment changes are needed. Image analysis remains preserved and hidden.

# CraftCareer 1.6.0 — Built-in Help

A portfolio creator for game makers — By Gopinath.

This update hides **From image** while retaining its code and bundled resources. The new **? Help** button opens a free, local chat-style guide with 53 reviewed topics, contextual help, follow-up choices and shortcuts to controls. It is not a generative AI model and does not promise to understand every question. No external AI API or paid fallback is used.

## Start

Open `site/index.html` for local editing and ZIP export. For publishing and shared canvases, use the included Node service with `npm start` and the configuration in GITHUB-SETUP.md. Node 22.9 or newer is required. No new dependency or environment variable is needed.

For your existing Render deployment, replace the release files in the creator repository and redeploy. Keep your existing environment variables, custom domain and GitHub OAuth settings. Back up important drafts as exported ZIPs first. Do not deploy or run `tests/browser-server.mjs` in production.

## Included

- `site/`: editor, help content, runtime, icons, tutorial and retained image-analysis tools.
- `server/`: unchanged GitHub publishing and temporary sharing services.
- `HELP-GUIDE.md`: guide behaviour, privacy, configuration and free-service research.
- `UPDATE-GUIDE.md`: installation and existing editor controls.
- `GITHUB-SETUP.md`, `SHARING.md`: publishing and collaboration setup/limits.
- `DESIGN-ASSISTANT.md`, `TRAINING-STATUS.md`: retained image assistant and its limitations.
- `TEST-REPORT.md`: checks actually completed for this release.
- `tests/`: automated checks and optional browser harnesses.

## Help configuration

`site/creator-config.js` controls `helpChat.enabled`, title, selection use and history length. `designAssistant.showLauncher` is false by default; set it to true to restore From image later. Its underlying feature remains enabled for development.

Everything authored in the portfolio still uses the existing configuration export system. Help messages stay in page memory; they are not saved in drafts, shared rooms or exported websites. The guide does not publish, remove content or change your layout.

## Validation

Run `npm test`. The optional browser test server exposes `/help.html` for interaction and layout checks. Tests use simulated GitHub and must never be used as the public server. See TEST-REPORT.md for the current browser-access limitation.
