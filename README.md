## 1.5.1 — recognition and editable lists

Improves dark artwork detection, complete-line OCR review, proportional layout and repeated-button lists. Read [TRAINING-STATUS.md](TRAINING-STATUS.md) for exactly what was changed and what was not trained. Reviewed examples can be saved locally from the design assistant.

# CraftCareer · By Gopinath

Version **1.5.1** improves image recognition and repeated-button lists. Guided review, the Workspace menu, sharing links, collaborator cursors, editing, tutorials, GitHub publishing and configuration exports are retained.

## Start here

For local editing and ZIP export, open **site/index.html** in a desktop browser. For automatic image analysis, use the hosted creator or localhost.

For GitHub publishing and sharing, follow **GITHUB-SETUP.md** and run the included Node service with `npm start`. Node.js 22.9 or newer is required. There are no package dependencies to install. GitHub sign-in needs your registered OAuth app; credentials are not supplied in this ZIP.

For an existing Render installation, replace the matching **site/** and **server/** files and **package.json**, then redeploy. Keep your existing environment variables, custom domain and OAuth settings. **Do not deploy the browser test server.** See UPDATE-GUIDE.md.

## What's new

- **From image:** cropped, multiple-choice questions for uncertain navigation, logos, small controls and text. Confirmed controls become ordinary editable components. Missing controls can be marked manually. Images keep their proportions.
- **Workspace:** Open GitHub, Share canvas, Sent links, file operations and creator appearance are grouped here. Website settings and Undo/Redo remain directly accessible.
- **Share canvas:** create a fresh Viewer, Instance editor or Helper link each time.
- **Sent links:** revoke one link or every active link created from this browser.
- **Helper:** choose a name before joining. Remote cursors show names; the sender appears as Owner.
- **Instance editor:** import a frozen, independent copy. Changes never affect the owner; imported copies remain after link deletion.

Read DESIGN-ASSISTANT.md for analysis limits and SHARING.md for permissions, expiry and conflict recovery. This remains local OCR plus layout rules, with optional browser-native AI; it is not a universally trained screenshot reconstruction model. Sharing remains temporary, single-server storage.

## Files

- `site/`: browser creator, runtime, local recognition resources, icons and tutorial.
- `server/`: GitHub service and temporary shared sessions.
- `.env.example`: settings template; contains no credentials.
- `GITHUB-SETUP.md`: hosting and OAuth setup.
- `UPDATE-GUIDE.md`: update instructions and editor controls.
- `DESIGN-ASSISTANT.md`, `SHARING.md`: feature guides and limits.
- `tests/`, `site/verification/`: local verification harnesses.
- `TEST-REPORT.md`: completed validation and scope.

Authored content stays in `config/site.js` and `config/sections/<id>.js` in exported portfolios, with assets in section folders. Sharing tokens, names/cursors, editor controls and recognition libraries are excluded. Creator preferences remain in `site/creator-config.js`.

## Verification

Run `npm test` for server, model, layout and image-analysis checks.

Run `npm run test:browser`, then open these local pages:

- `/regression.html`: editor, layout, assets, scrolling and controls.
- `/verification/editing.html`: editing and viewport checks.
- `/verification/collaboration.html`: canvas controls and assets.
- `/browser.html`: simulated GitHub publishing.
- `/sharing-ui.html`: three link roles, helpers, conflicts, cursors, revocation and laptop layouts.
- `/verification/design.html`: real OCR on synthetic references, review, export and simulated publishing.
- `/fidelity.html` and `/guided.html`: the supplied private reference images, when installed as described in `tests/fixtures/README.md`.

The test service uses synthetic GitHub accounts and in-memory repositories. It never contacts a real GitHub account. Private reference images are not distributed.

See `site/README.md` for the full creator guide.
