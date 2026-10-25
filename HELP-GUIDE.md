# CraftCareer Help — 1.7.1

Use **Help** to ask about CraftCareer. When the server is connected to Cloudflare, it generates an answer grounded in the reviewed CraftCareer guides. **Browse topics** and suggested guide buttons open the built-in guides locally. AI can make mistakes and cannot change your canvas or inspect your GitHub account.

For setup, read **CLOUDFLARE-SETUP.md**. Required credentials belong in Render's environment, never frontend files.

## Privacy and selection context

AI questions and at most six recent messages go through the CraftCareer backend to Cloudflare. With Use selected component enabled, only the component/section/device type and read-only state are included. Portfolio document contents, uploaded assets and account credentials are not read. Chat history is held in page memory, cleared on reload, New chat or workspace changes. The server does not save transcripts.

## Chat behaviour

Questions slide in subtly. Sending a question smoothly moves to the latest message before the answer types. The chat follows the growing answer until you scroll manually (wheel, touch, keyboard or scrollbar). Read more resumes following; a new question also resumes it. Reduced-motion preferences disable these animations.

Send, Enter-to-send and topic buttons are blocked while an answer is being fetched or typed. You can draft the next question in the text box. Sending becomes available when the answer finishes. New chat, closing Help or replacing the workspace cancels a pending request. New chat also cancels typing; closing Help reveals the rest of an existing answer without scrolling.

If AI is temporarily unavailable, the chat shows a brief message and local-guide choices. For a daily pause it shows the next UTC reset in the visitor's local date/time without mentioning usage allowances. Other failures show a short retry message.

## Creator configuration

In site/creator-config.js, helpChat contains:

- enabled: show/hide Help.
- title: heading.
- useSelection: default selection context checkbox.
- maxMessages: bounded visible conversation, 8–60, default 24.
- typingEffect: enable/disable typing animation.
- typingSpeed: 30–500 characters/second, default 180, long answers finish within six seconds.
- cloudflare: true for server AI, false for local-only guide matching.
- apiBase: same-origin API path, default /api/help.

The 53 reviewed topics remain in help-knowledge.js. Update them when features change. help-engine.js retrieves relevant guides. help-remote.js handles the local backend connection. server/help-ai.mjs handles Cloudflare and request validation. help-presentation.js handles safe text emphasis and typing. No HTML from users or AI is interpreted.

Exports retain the existing config-file format and contain neither the creator help scripts nor chat history. Image analysis is preserved and hidden by default. GitHub publishing and sharing do not require AI.
