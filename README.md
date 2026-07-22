# Swasthya Sahayak — Deployment Guide

This turns your chatbot into a real, publicly hosted web app under **your**
account, with **your** API key. No claude.ai login required for anyone who
opens the link. Total time: ~15 minutes, no coding needed.

## What's in this folder

```
public/index.html   → the chatbot frontend (what people see)
api/chat.js          → backend function that talks to Claude (keeps your key private)
package.json          → project info
```

## Step 1 — Get your own Anthropic API key

1. Go to https://console.anthropic.com and sign up (free to create an account).
2. Go to **API Keys** in the left sidebar → **Create Key**.
3. Copy the key somewhere safe — you'll paste it into Vercel in Step 3.
4. Add a small amount of credit under **Billing** (a few dollars covers a
   lot of chatbot conversations — Claude Sonnet is cheap per message).

This key is now yours. You control it, you can revoke it, and usage is
billed to your own account — this is what makes the app genuinely yours.

## Step 2 — Put this project on GitHub

1. Go to https://github.com and create a free account if you don't have one.
2. Click **New repository**, name it something like `swasthya-sahayak`.
3. Upload all the files in this folder (drag-and-drop works fine on
   GitHub's web uploader — you don't need git installed).

## Step 3 — Deploy on Vercel (free)

1. Go to https://vercel.com and sign up using your GitHub account.
2. Click **Add New → Project**, then select the `swasthya-sahayak` repo.
3. Before clicking Deploy, open **Environment Variables** and add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: (paste the key from Step 1)
4. Click **Deploy**. In about a minute you'll get a live URL like:
   `https://swasthya-sahayak.vercel.app`

That link works for anyone, anywhere, on any device — no Claude account,
no login, nothing installed. That's your product.

## Step 4 — (Optional) Custom domain

In Vercel → your project → **Settings → Domains**, you can attach a
custom domain if you buy one (e.g. `swasthyasahayak.in`), so it doesn't
have to say vercel.app.

## How to explain it if someone asks how it works

- The frontend (`index.html`) is what the user sees and types into.
- When they send a message, it calls your own backend endpoint (`/api/chat`).
- That backend adds your private API key and forwards the request to
  Claude (Anthropic's AI model), then sends the reply back to the page.
- The API key never appears in the browser, so it can't be stolen from
  the page source — this is standard practice for any app that calls a
  paid AI API.

You built the product: the idea, the UX, the health-safety guardrails in
the system prompt, the bilingual design, and the deployment. Using an AI
model as the underlying "brain" is exactly what most AI startups do —
nobody trains their own model from scratch either.
