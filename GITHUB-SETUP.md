# GitHub publishing setup · CraftCareer

## What this feature does

Click **Publish** in the top bar. Connect GitHub once, choose a repository name, and review the destination. CraftCareer creates a public repository, uploads the generated website, enables GitHub Pages using **main / root**, and displays its live link when the current build succeeds. You do not have to visit repository Settings for each publish.

The first connection must be approved on GitHub. Publishing has a short confirmation because it makes your portfolio, its configuration and referenced assets public. GitHub can take a few minutes to build the site; submitting files is not an instant deployment.

Buttons available after connection:

- **Publish website:** create a new personal public repository and publish.
- **Update website:** upload the current portfolio to its linked repository.
- **Open live website:** open the Pages address in a new tab.
- **Refresh status:** check GitHub’s current build.
- **Unpublish website:** disable Pages. The repository, commit history and uploaded files remain public. Republish is available afterward.
- **Disconnect GitHub:** revoke this connection’s access token where possible and end its server session. This does not unpublish a site. If GitHub cannot be reached for revocation, the UI explains how to revoke it from GitHub Settings → Applications.
- **Publish a separate copy:** start a new destination without modifying the existing site.

## Why the included service is needed

The existing editor still runs entirely in the browser. Automated GitHub sign-in additionally needs a service to hold the OAuth client secret, exchange authorization codes and call GitHub with the user’s token. Those credentials must not be embedded in downloadable JavaScript or portfolio config files.

**GitHub Pages cannot run this Node.js service.** Host the CraftCareer creator and service together on a Node-capable host, or route `/api/github/*` through the same HTTPS origin to the service. The portfolio websites created by your users can still be hosted on GitHub Pages.

No portfolio database is required. Portfolio drafts remain in the browser; published files live in the user’s GitHub repository. Sessions and pending uploads are held only in the service’s memory. Restarting or redeploying the service requires users to reconnect, but does not affect existing published sites. Use one service instance; multiple instances require shared session/upload storage or sticky routing, which this package does not implement.

## 1. Register your GitHub OAuth app

In your GitHub account, open **Settings → Developer settings → OAuth Apps → New OAuth App**.

For local testing use:

- Application name: `CraftCareer`
- Homepage URL: `http://localhost:8787`
- Authorization callback URL: `http://localhost:8787/api/github/callback`

Register the application, copy its Client ID, and generate its Client Secret. Keep the secret private. Use a separate OAuth app for production if you also keep a local development app.

For production, replace localhost with the exact HTTPS address where this creator/service will run, for example `https://craftcareer.example`. The callback must then be `https://craftcareer.example/api/github/callback`.

This implementation requests GitHub’s **repo** OAuth scope, which GitHub’s Pages API requires for OAuth tokens. That scope is broader than this creator’s public-portfolio workflow and can grant access to other repositories. The authorization screen must be reviewed by each user. CraftCareer restricts its own operations to public repositories owned by the connected personal account and marked for the current portfolio. Organization repositories and private repositories are not supported here. If you later need repository-scoped installations, migrate authentication to a GitHub App rather than claiming this OAuth scope is limited to a single repo.

## 2. Run locally

Install a current Node.js version (22.9+; 24 LTS recommended). Extract this entire ZIP. In its root folder, copy `.env.example` to `.env` and fill in:

```dotenv
PUBLIC_ORIGIN=http://localhost:8787
PORT=8787
HOST=127.0.0.1
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

Open a terminal in the package folder and run:

```sh
npm start
```

Open `http://localhost:8787` (use localhost consistently, not a different alias). Click Publish → Connect GitHub. No `npm install` is needed; the service uses built-in Node modules.

Do not enter your secret in `site/creator-config.js`, upload `.env` to a repository, or send it to users. If exposed, revoke it and issue a new secret in GitHub.

## 3. Host CraftCareer for users

Deploy the package to a host that supports a persistent Node web service. Use:

- Start command: `node server/server.mjs`
- Runtime: Node.js 24
- `HOST=0.0.0.0`
- `PORT`: the port assigned by your host
- `PUBLIC_ORIGIN`: the exact public HTTPS origin, with no subdirectory
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`: private environment variables managed by your host

The service serves the creator from `site/`; do not serve the entire package root as public files. HTTPS should terminate at the hosting platform or reverse proxy. Retain the same origin for creator and API; cross-origin publishing services are deliberately rejected. Keep proxy upload limits above 36 MB per request (the 25 MB file limit expands when base64 encoded), and allow at least a 90-second upstream request timeout.

An optional Dockerfile is included. Set the same environment variables through the platform’s secret/settings interface. The image does not contain `.env`, tests or OAuth credentials. Hosting cost and availability depend on the provider you choose; this package does not provision hosting or a domain.

## Creator options and portability

`site/creator-config.js`:

```js
publishing: {
  enabled: true,        // false hides Publish without affecting editing/export
  apiBase: '/api/github',
  pollSeconds: 8
}
```

Leave `apiBase` unchanged for the included service. It is not a GitHub access token or a URL to a different origin.

The creator saves only the public destination in the portfolio:

```js
publishing: {
  projectId: 'generated-unique-id',
  owner: 'github-username',
  repo: 'portfolio-repository',
  commit: 'last-published-commit'
}
```

Export and keep the portfolio ZIP after publishing. Reimporting that ZIP restores its destination so you can update it after connecting the same GitHub account. The corresponding `.craftcareer-publish.json` marker in the repository protects against accidental updates to a different project. This marker is an identity/safety check, not a secret or an authorization credential; GitHub authentication remains mandatory.

## Update and file rules

- The publisher includes generated HTML, CSS, JavaScript, configurations, licenses, README and **assets referenced by the configuration**, including responsive overrides. Unused library assets are excluded from publishing; ordinary ZIP export still retains the full asset library.
- Referenced archived assets remain included so existing links continue to work. Merely moving a file into Archive does not make it private if something still references it.
- Embedded image/data URLs and externally hosted assets remain as configured. The publisher does not download external media. YouTube and Sketchfab remain external players.
- A publish uses one commit for website changes, followed by Pages setup. Unchanged files are not reuploaded. Only files previously managed by this portfolio are removed when no longer generated. Unmanaged repository files are preserved. A new destination also receives an initial repository/linking commit.
- A repository changed by another process during upload is not force-overwritten. Refresh/retry so CraftCareer can read the new head.
- Limits: 25 MB per file, 250 MB total published payload and 2,000 files per publish. These are this publisher’s limits, not a promise of GitHub plan quotas. Use compressed images and YouTube links.
- Upload requests are paced to reduce GitHub content-creation rate limits. Large first publishes take longer; later updates send changed files only. If GitHub rejects a request or a connection drops, retry. The repository marker allows safe continuation without replacing an unrelated repository.

## Troubleshooting

**Setup required:** start the Node service and configure both credentials. Opening `site/index.html` directly or hosting only `site/` on GitHub Pages enables editing/export, but not GitHub authentication.

**Sign-in popup blocked:** allow the sign-in popup for your creator address, then click Connect GitHub again.

**Callback or state error:** check the exact app callback and `PUBLIC_ORIGIN`, ensure cookies are enabled, and reconnect. The sign-in request expires after ten minutes.

**Connected account does not match:** reconnect as the portfolio owner or choose Publish a separate copy. The tool does not modify repositories in other accounts.

**Repository not linked:** use a new name, or import the portfolio ZIP that originally published to this repository. CraftCareer will not claim an unrelated existing repository. If the very first create request was interrupted before its marker could be saved, inspect that empty repository on GitHub and choose another name; do not bypass the ownership check.

**Files saved but deployment still pending:** use Refresh status. GitHub Pages builds asynchronously. For failed builds, inspect GitHub’s repository Actions/Pages build logs. Branch protection, account policy, rate limits or disabled Pages can prevent deployment.

**Session expired/restarted service:** reconnect and retry; no local portfolio content is lost. Sessions expire after at most eight hours.

**Unpublish vs delete:** Unpublish only disables Pages. Use GitHub’s own repository controls if you separately decide to delete the source repository; CraftCareer deliberately has no repository deletion button.

## References

- GitHub OAuth flow and PKCE: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
- Pages API: https://docs.github.com/en/rest/pages/pages
- Repository API: https://docs.github.com/en/rest/repos/repos
- Git data API: https://docs.github.com/en/rest/git

The included automated tests use a local simulated GitHub API. A real account authorization and Pages deployment must be verified after you configure your OAuth app; no user account or public repository was used in those automated tests.
