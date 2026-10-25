# CraftCareer shared canvases

## Hosting

Deploy both `site/` and `server/` with the existing `npm start` service. No new environment variable, dependency, database or GitHub permission is required. Keep `PUBLIC_ORIGIN` set to the exact HTTPS address people use. GitHub Pages alone cannot run sharing. Use one running server instance: this release stores temporary rooms in memory.

## Create a link

Open **Workspace → Share canvas**, choose a role and press **Generate new link**. Every generation creates a distinct link. Closing and reopening Share starts a new generation form; it does not expose old link management.

| Role | Recipient experience | Owner's canvas | After link deletion |
|---|---|---|---|
| Viewer | Views the current shared canvas; cannot edit or save through the API | Unchanged by the viewer | Future access is denied; connected view is locked on its next check |
| Instance editor | Imports a frozen copy from the time the link was created, then edits locally | Never receives the recipient's edits | Previously imported copies remain on that browser and in exported ZIPs; new imports are denied |
| Helper | Enters a name, joins the live canvas, edits with the owner | Updates synchronize with revision checks | Reads, writes and cursor updates are denied; the connected editor locks on its next check |

An Instance editor link requires acknowledgement that recipients may retain their copy. Revoking any link cannot erase a ZIP, screenshot or other data someone already saved. Export an independent copy as a ZIP for portability to another device.

## Sent links

**Workspace → Sent links** lists links created from this browser, with their role, creation time and status. Copy an active link, **Delete link**, or **Delete all active links**. Deletion asks for confirmation. One link can be revoked without affecting the others. Independent copies already imported remain separate.

Sent-link management credentials are stored locally on the owner's browser. Clearing that storage loses this management list; there is no signed-in cross-device link dashboard. Link tokens are carried in the URL fragment and sent to the server in authorization headers, not put into exported configuration.

## Working together

Helpers choose a name before the canvas is loaded. Others see that name above their cursor. The original sender is labelled **Owner**. Each participant sees only remote cursors, not another copy of their own. Cursors map to the same section/cell even at different editor zoom levels; they appear when people view the same page and device layout. Disconnected cursors disappear after approximately 12 seconds.

Names are display names, not verified identities. Links give access to whoever holds them. Share Helper links only with intended collaborators.

Content sync checks run approximately every two seconds and after a brief pause in editing. Cursor updates run roughly twice a second. Hidden tabs reduce cursor traffic. The status badge reports syncing, saved, connection errors or conflicts. GitHub credentials and publishing associations are never shared. Sharing does not publish a website.

If people edit the same revision at once, the second save is held for review rather than silently replacing either local version. Use **Save my ZIP**, then **Load shared version** and reapply the desired changes. This is complete-revision synchronization, not character-level concurrent merging. Incoming revisions reset Undo history to avoid reversing another person's changes. Pending local edits recovered after reload also require review.

Opening another ZIP or starting a new portfolio disconnects that browser from its shared room before replacing the document. **Stop syncing on this device** also disconnects the owner locally; links remain active until deleted or expired.

## Limits and storage

- Rooms last **up to 24 hours from initial creation**. Every link in that room shares its expiry. A server restart, redeploy or replacement ends all rooms earlier.
- Independent copies already imported persist in their own local browser draft. Browser storage can be cleared or fail; export a ZIP for a reliable backup.
- Maximum 15 MB of assets, 400 files, 2 MB configuration, 100 generated links per room and 30 concurrent cursor participants. Server-wide memory and creation limits also apply.
- Shared sessions refuse executable/HTML/XML/SVG assets. Use PNG/WebP for shared imagery. Local ZIP export retains original assets.
- No persistent cloud storage, accounts, authenticated invitations, automatic merge history or multi-server coordination is provided in this foundation.

The section config format and ordinary asset folders remain unchanged. Presence, link permissions and management tokens are editor/session data, not authored website content. Add durable storage and authenticated access before promising permanent collaboration links.
