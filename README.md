# LUXE MONTRE 尊時匯

Single-page luxury watch salon website with a small Node.js backend for the AI concierge.

## Structure

- `index.html` - Frontend website, product display, modal, language switch, chat UI.
- `server.js` - Static file server plus `/api/chat` backend endpoint.
- `.env.example` - Environment variable template.
- `package.json` - Node start scripts.

## Local Run

```bash
cp .env.example .env
```

Edit `.env` and add your real OpenAI API key:

```bash
OPENAI_API_KEY=sk-your_real_key
OPENAI_MODEL=gpt-4.1-mini
PORT=8080
```

Start the site:

```bash
node server.js
```

Open:

```text
http://localhost:8080/index.html
```

## AI Concierge

The frontend sends chat messages to:

```text
POST /api/chat
```

The backend calls OpenAI's Responses API. If `OPENAI_API_KEY` is not configured, the backend returns a local fallback reply so the site remains usable during development.

Recommended default model:

```text
gpt-4.1-mini
```

This is a practical default for customer-service style responses because it is fast, lower cost, and supports the Responses API. For more complex valuation workflows, the model can be changed in `.env` without editing the frontend.

## Maintenance Notes

- Keep API keys only in `.env` or deployment environment variables.
- Do not put API keys in `index.html`.
- Update `systemPrompt` in `server.js` to change the concierge tone or policy.
- Update the `products` array in `index.html` to change watches and prices.
- Replace the WhatsApp placeholder link in `index.html` before publishing.
