import { createReadStream, existsSync, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 8080);

loadEnvFile();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const systemPrompt = `
You are the AI Horology Concierge for LUXE MONTRE 尊時匯, a Hong Kong luxury watch salon.
Speak in the user's language. Use a polished, discreet, expert tone.
Help with luxury watch references, market direction, authentication preparation, consignment, acquisition, and maintenance.
Do not invent exact live prices or claim a final appraisal. Give market guidance, condition factors, document checks, and suggest a private salon or WhatsApp follow-up for confirmed valuation.
Keep answers concise: 2-4 short paragraphs, no markdown tables.
`;

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (req.method === "GET" && url.pathname === "/api/health") {
      return sendJson(res, 200, {
        ok: true,
        provider: "openai",
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        configured: Boolean(process.env.OPENAI_API_KEY)
      });
    }

    if (req.method === "POST" && url.pathname === "/api/chat") {
      return handleChat(req, res);
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      return sendJson(res, 405, { error: "Method not allowed" });
    }

    return serveStatic(url.pathname, res);
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { error: "Internal server error" });
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use.`);
    console.error(`Stop the existing server, or run with another port, for example: PORT=8081 node server.js`);
    process.exit(1);
  }
  throw error;
});

server.listen(port, () => {
  console.log(`LUXE MONTRE server running at http://localhost:${port}`);
});

async function handleChat(req, res) {
  const body = await readJsonBody(req);
  const message = String(body.message || "").trim().slice(0, 600);
  const lang = body.lang === "en" ? "en" : "zh";

  if (!message) {
    return sendJson(res, 400, { error: "Message is required" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return sendJson(res, 200, {
      reply: fallbackReply(message, lang),
      provider: "local-fallback",
      configured: false
    });
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      instructions: systemPrompt,
      input: [
        {
          role: "user",
          content: `Language: ${lang}\nCollector question: ${message}`
        }
      ],
      max_output_tokens: 520
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("OpenAI API error:", data);
    return sendJson(res, 502, {
      error: "The model service is temporarily unavailable.",
      reply: fallbackReply(message, lang)
    });
  }

  return sendJson(res, 200, {
    reply: extractOutputText(data) || fallbackReply(message, lang),
    provider: "openai",
    model
  });
}

function extractOutputText(data) {
  if (typeof data.output_text === "string") return data.output_text.trim();
  if (!Array.isArray(data.output)) return "";

  return data.output
    .flatMap((item) => Array.isArray(item.content) ? item.content : [])
    .map((content) => content.text || content.output_text || "")
    .join("\n")
    .trim();
}

function fallbackReply(message, lang) {
  if (lang === "en") {
    return `Respected Collector, regarding “${message}”, please first review the production year, accessory set, case condition, service history, and recent comparable transactions. For a confirmed valuation, our salon specialist should inspect the watch and documents directly.`;
  }
  return `尊敬的藏家，關於「${message}」，建議先核驗年份、附件完整度、錶殼狀態、保養紀錄與近期同款成交紀錄。若需要確認估值，仍需由沙龍專家實物檢視腕錶與文件。`;
}

function serveStatic(pathname, res) {
  const requestedPath = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const safePath = normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, "");
  const filePath = join(root, safePath);

  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    return sendJson(res, 404, { error: "Not found" });
  }

  const type = mimeTypes[extname(filePath)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  createReadStream(filePath).pipe(res);
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 16_384) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function loadEnvFile() {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
