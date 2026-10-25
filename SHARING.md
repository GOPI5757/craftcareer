# Shared canvases · cclink foundation

## Hosting

Deploy both `site/` and `server/` from this package using your existing `npm start` service. There is no new environment variable, database, dependency or GitHub permission. Keep `PUBLIC_ORIGIN` set to the exact HTTPS address visitors use, including the chosen www/non-www host. Use one running server instance for this foundation; rooms are held in that process's memory. GitHub Pages alone cannot host this feature.

## Share a canvas

1. Open or create a portfolio, then click **Share** in the header.
2. Choose **Viewer — view only** or **Editor — edit together** before creating the cclink.
3. Click **Create cclink**, then **Copy cclink**. You can switch the permission selector to copy the other link later. Each permission has a separate link.
4. Send the selected link to your collaborators. An editor link gives anyone holding it permission to edit the shared portfolio and assets. A viewer link displays the canvas without edit controls and cannot save through the server API.
5. Changes sync after a short pause while editing. Participants check for updates approximately every 2.5 seconds. The status badge shows pending, saved, updated or disconnected states. Ordinary content changes reuse the assets already in the session instead of uploading images every time.
6. Use **Save ZIP backup** for a permanent copy. The owner can select **End sharing for everyone** to invalidate both links. **Continue locally** disconnects only that browser; it does not end the room for others.

The creator's regular ZIP/config export remains the source format. Sharing sends the configuration, asset paths and asset bytes; it does not replace that format with another proprietary document. GitHub tokens, OAuth secrets and publishing destination associations are never included. The owner's original publishing association stays local. Sharing never automatically publishes.

## Simultaneous changes and recovery

This first version synchronizes complete configuration revisions; it is not a character-by-character co-editing engine. If two people change the same revision at the same time, one save succeeds and the other receives **Shared changes need review**. It does not silently overwrite either person's local work.

The person with a conflict can export their local ZIP, load the shared version, then reapply the desired changes. They can instead continue locally. Unsaved shared changes restored from a local draft are also held for review after a reload. Undo history resets when an incoming shared revision is applied, so Undo does not accidentally reverse someone else's edits.

## Limits in this foundation

- Session links last **up to 24 hours**, measured from creation. A **server restart, redeploy or instance replacement ends all rooms** immediately. Free hosting sleep/restarts can therefore interrupt sharing.
- Assets: **15 MB total**, at most 400 files per session. Configuration: 2 MB. Rooms are also capped globally to bound memory usage. Large portfolios should use ZIP exchange until persistent storage is added.
- Shared sessions reject executable/HTML/XML and SVG files. Convert SVG imagery to PNG/WebP for sharing. Regular local editing and ZIP export retain original files.
- No accounts, participant identity list, live cursors, per-person invitations, permanent cloud storage or granular change merging are included yet.
- Links are bearer capabilities: whoever holds an editor link can edit. Treat editor links as private. End the room and create a new one to replace compromised links. There is no individual participant revocation in this foundation.
- Participant drafts are separated from the regular local workspace. Browser storage is a recovery aid, not a durable backup. Export ZIPs before leaving a session, replacing work or redeploying the server.

For a later production collaboration phase, add authenticated invitations, persistent rooms/assets, durable revision history and granular operation merging before running multiple server instances. The current foundation deliberately reports conflicts and expiration rather than promising permanent collaborative storage.
