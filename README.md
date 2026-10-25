# CraftCareer · By Gopinath

Version 1.3 improves live website updates, adds direct canvas and asset controls, and introduces temporary shared canvases with viewer/editor links. The existing tutorial, config-based exports, asset library and authentication setup are retained. See **UPDATE-GUIDE.md** for every new control and deployment instructions.

## Start here

For editing and ZIP export only, open **site/index.html** in a desktop browser. No account or server is required for those features.

For **Connect GitHub, Publish, Update, Open GitHub, Open live website, Unpublish and Disconnect**, follow **GITHUB-SETUP.md**. This integration includes a small Node.js service. GitHub sign-in requires your own registered OAuth app and its secret; credentials are not preconfigured in the ZIP.

Once configured, start the service with `npm start` and use its website address. There are no package dependencies to install. Node.js 22.9 or newer is required (Node 24 LTS is recommended).

## Files

- `site/` — the complete browser-based creator, existing tutorial and offline resources.
- `SHARING.md` — shared-canvas setup, permissions, limits and recovery.
- `server/sharing.mjs` — temporary collaboration sessions; included in the same Node service.
- `server/server.mjs` — authentication, repository uploads and Pages management; serves `site/` only.
- `.env.example` — local server settings template, containing no credentials.
- `GITHUB-SETUP.md` — setup, hosting, permissions, user workflow and troubleshooting.
- `tests/` — automated service checks and local simulated GitHub browser tests.
- `TEST-REPORT.md` — validation performed for this release.
- `Dockerfile` — optional deployment container.

The creator’s Publish button is separate from Settings. Creator-level options are in `site/creator-config.js` under `publishing`. The portfolio remains config-driven: its public repository association is saved under `site.publishing` in the exported `config/site.js`. OAuth tokens and secrets never go into that configuration or website ZIP.

## Tests

Run `npm test` for service, model and layout checks. Run `npm run test:browser`, then visit `http://localhost:18988/browser.html` for publishing integration checks and `/regression.html` for editor regression checks. Open `/verification/editing.html` for editing and viewport checks, and `/verification/collaboration.html` for the new canvas controls, asset workflows and multi-participant sharing checks. The browser test server uses synthetic accounts and repositories held in memory; it never calls GitHub. **Do not deploy the test server.**

Shared canvases require this same Node server; no new environment variable or database is needed. This first version supports a single running server instance and temporary sessions, not permanent cloud storage. See **SHARING.md** before enabling it for users.

For the detailed existing editor instructions, see `site/README.md`.
