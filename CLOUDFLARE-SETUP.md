# Enable CraftCareer AI chat — 1.7.0

The integration is implemented but needs your Cloudflare credentials before it can generate answers. No credentials are included. Your current domain, Render service and GitHub publishing setup remain in place.

## 1. Get Cloudflare credentials

1. Sign in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
2. Open Workers AI, then **Use REST API**.
3. Choose **Create a Workers AI API Token** and create the token with the prefilled permissions. A manually created token needs Workers AI Read and Edit for your account.
4. Copy the Account ID and API token into your private password manager or directly into Render. Do not put the token in GitHub, the website config or a chat message.
5. Stay on the **Workers Free plan** if you require the provider's free-allocation cutoff. This app does not upgrade your plan or buy credits.

[Official token setup](https://developers.cloudflare.com/workers-ai/get-started/rest-api/)

## 2. Add these in Render → your CraftCareer service → Environment

| Name | Value |
| --- | --- |
| CLOUDFLARE_ACCOUNT_ID | Your 32-character Cloudflare Account ID |
| CLOUDFLARE_API_TOKEN | Your secret Workers AI API token |
| CLOUDFLARE_AI_MODEL | @cf/meta/llama-3.1-8b-instruct-fp8 |
| CLOUDFLARE_AI_DAILY_REQUESTS | 300 |

The last two settings are optional: these are the defaults. Keep existing PUBLIC_ORIGIN, HOST and GitHub settings. PUBLIC_ORIGIN must exactly match the HTTPS address visitors use (including www if applicable), with no path. Do not change working GitHub OAuth settings for this update.

The default model is the currently documented FP8 model. The older FP8 Fast variant discussed earlier was not present in the current model catalog during verification; do not copy that older ID. [Current model and API schema](https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct-fp8/)

## 3. Deploy the update

Replace the application files in your existing repository with this package, preserving your repository history and any private local .env. Do not upload the package as one ZIP file. Include the new server/help-ai.mjs and site/help-remote.js files. Commit/push and let Render redeploy. The production start command remains npm start (or the included Dockerfile). Never use tests/browser-server.mjs in production.

## 4. Check it

1. Open CraftCareer at your normal domain and reload.
2. Open Help and ask: “How do I put text next to an image?”
3. Expect a Thinking indicator followed by a typed answer labelled **CraftCareer AI**. Important words use colored, heavier text without underlines.
4. Ask a follow-up. Recent messages are included in the request.
5. Browse topics still opens local, reviewed instructions.

If you see “AI chat is not connected yet”, check that both required environment values were saved and that Render restarted. A configured status only means credentials have the expected shape; it does not prove Cloudflare accepts them. For a generic service error, check the token permissions, Account ID, model availability and Cloudflare service status. A sleeping Render instance can also delay the first request.

## What is sent and how it works

The browser sends the question, at most six recent messages, a selected guide ID and optional component/section/device type. It does not read or send the portfolio files, uploaded assets, document text, GitHub credentials or publishing connection. The server selects up to six reviewed guides and sends them with the question to Cloudflare. No model is trained. No model output can execute code or change the portfolio. AI can still be wrong; it cannot guarantee answers to every question.

Chat history is held in page memory and is cleared by New chat, changing workspace or reloading. The server does not persist chat transcripts or log prompts/responses. Cloudflare processes requests under its [Workers AI data policy](https://developers.cloudflare.com/workers-ai/platform/data-usage/).

## Temporary-unavailability behaviour

Cloudflare error 3036 pauses AI requests until the next 00:00 UTC (5:30 a.m. IST). The interface says **Chat is temporarily unavailable. Please try again on [date and time].** It uses the visitor's local time and never mentions allowance, quota or neurons. It includes the date rather than always saying “tomorrow”, because the next UTC reset can fall later on the same local day. This is a retry time, not an uptime guarantee.

Transient capacity errors, connection failures and invalid credentials do not promise next-day recovery. Visitors receive a short retry message and can use the built-in guides. Editing, exports and publishing remain available.

There is also a configurable application ceiling of 300 provider requests per UTC day, per server process, plus six requests/minute per anonymous session, twenty/minute globally and three simultaneous requests. These protect the endpoint but are not a measurement of Cloudflare's remaining neurons. Local counters and pause state reset on a server restart and are not shared across replicas. Cloudflare enforces its own account-level free allowance regardless of these counters. For zero paid overage, remain on its Free plan; this application cannot enforce your provider billing plan.

No automatic model/provider fallback or paid upgrade is implemented. [Cloudflare errors](https://developers.cloudflare.com/workers-ai/platform/errors/) · [Pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)

## Disable AI without removing it

Set helpChat.cloudflare to false in site/creator-config.js to restore local-only matching. Keep credentials on the server only. All prior image-analysis code stays preserved and its launcher stays hidden.

## Verification limits

The backend and client transport were tested with simulated Cloudflare responses. A live Cloudflare request requires your credentials and was not performed. Browser access was disabled, so real-browser checks were not performed. See TEST-REPORT.md.
