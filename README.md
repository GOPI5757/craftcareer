# CraftCareer · By Gopinath

This package adds GitHub Pages publishing to the existing CraftCareer creator. The editor, tutorial, configuration-based export, layout controls and asset library are retained.

## Start here

For editing and ZIP export only, open **site/index.html** in a desktop browser. No account or server is required for those features.

For **Connect GitHub, Publish, Update, Open live website, Unpublish and Disconnect**, follow **GITHUB-SETUP.md**. This integration includes a small Node.js service. GitHub sign-in requires your own registered OAuth app and its secret; credentials are not preconfigured in the ZIP.

Once configured, start the service with `npm start` and use its website address. There are no package dependencies to install. Node.js 22.9 or newer is required (Node 24 LTS is recommended).

## Files

- `site/` — the complete browser-based creator, existing tutorial and offline resources.
- `server/server.mjs` — authentication, repository uploads and Pages management; serves `site/` only.
- `.env.example` — local server settings template, containing no credentials.
- `GITHUB-SETUP.md` — setup, hosting, permissions, user workflow and troubleshooting.
- `tests/` — automated service checks and local simulated GitHub browser tests.
- `TEST-REPORT.md` — validation performed for this release.
- `Dockerfile` — optional deployment container.

The creator’s Publish button is separate from Settings. Creator-level options are in `site/creator-config.js` under `publishing`. The portfolio remains config-driven: its public repository association is saved under `site.publishing` in the exported `config/site.js`. OAuth tokens and secrets never go into that configuration or website ZIP.

## Tests

Run `npm test` for service, model and layout checks. Run `npm run test:browser`, then visit `http://localhost:18988/browser.html` for publishing integration checks and `/regression.html` for editor regression checks. The browser test server uses synthetic accounts and repositories held in memory; it never calls GitHub. **Do not deploy the test server.**

For the detailed existing editor instructions, see `site/README.md`.
