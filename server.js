import { createReadStream, existsSync, readFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { randomUUID, timingSafeEqual } from "node:crypto";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 8080);
const productDbPath = join(root, "data", "products.json");
const adminSessions = new Set();

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
        configured: Boolean(process.env.OPENAI_API_KEY),
        productDatabase: existsSync(productDbPath)
      });
    }

    if (req.method === "GET" && url.pathname === "/api/products") {
      return sendJson(res, 200, { products: await readProducts(false) });
    }

    if (req.method === "POST" && url.pathname === "/api/chat") {
      return handleChat(req, res);
    }

    if (url.pathname === "/api/admin/login" && req.method === "POST") {
      return handleAdminLogin(req, res);
    }

    if (url.pathname === "/api/admin/session" && req.method === "GET") {
      return sendJson(res, 200, { authenticated: isAdminRequest(req) });
    }

    if (url.pathname === "/api/admin/logout" && req.method === "POST") {
      return handleAdminLogout(req, res);
    }

    if (url.pathname === "/api/admin/products" && req.method === "GET") {
      if (!isAdminRequest(req)) return sendJson(res, 401, { error: "Unauthorized" });
      return sendJson(res, 200, { products: await readProducts(true) });
    }

    if (url.pathname === "/api/admin/products" && req.method === "POST") {
      if (!isAdminRequest(req)) return sendJson(res, 401, { error: "Unauthorized" });
      return handleCreateProduct(req, res);
    }

    const productMatch = url.pathname.match(/^\/api\/admin\/products\/([^/]+)$/);
    if (productMatch && req.method === "PUT") {
      if (!isAdminRequest(req)) return sendJson(res, 401, { error: "Unauthorized" });
      return handleUpdateProduct(req, res, productMatch[1]);
    }

    if (productMatch && req.method === "DELETE") {
      if (!isAdminRequest(req)) return sendJson(res, 401, { error: "Unauthorized" });
      return handleDeleteProduct(res, productMatch[1]);
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

async function handleAdminLogin(req, res) {
  const body = await readJsonBody(req);
  const password = String(body.password || "");
  const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (!safeEqual(password, expectedPassword)) {
    return sendJson(res, 401, { error: "Invalid password" });
  }

  const token = randomUUID();
  adminSessions.add(token);
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Set-Cookie": `lm_admin=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`
  });
  res.end(JSON.stringify({ ok: true }));
}

function handleAdminLogout(req, res) {
  const token = getCookie(req, "lm_admin");
  if (token) adminSessions.delete(token);
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Set-Cookie": "lm_admin=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0"
  });
  res.end(JSON.stringify({ ok: true }));
}

async function handleCreateProduct(req, res) {
  const body = await readJsonBody(req, 131_072);
  const products = await readProducts(true);
  const now = new Date().toISOString();
  const nextId = products.reduce((max, product) => Math.max(max, Number(product.id) || 0), 0) + 1;
  const product = normalizeProduct({ ...body, id: nextId, createdAt: now, updatedAt: now });
  products.push(product);
  await writeProducts(products);
  return sendJson(res, 201, { product });
}

async function handleUpdateProduct(req, res, id) {
  const body = await readJsonBody(req, 131_072);
  const products = await readProducts(true);
  const index = products.findIndex((product) => String(product.id) === String(id));
  if (index === -1) return sendJson(res, 404, { error: "Product not found" });

  const product = normalizeProduct({
    ...products[index],
    ...body,
    id: products[index].id,
    updatedAt: new Date().toISOString()
  });
  products[index] = product;
  await writeProducts(products);
  return sendJson(res, 200, { product });
}

async function handleDeleteProduct(res, id) {
  const products = await readProducts(true);
  const next = products.filter((product) => String(product.id) !== String(id));
  if (next.length === products.length) return sendJson(res, 404, { error: "Product not found" });
  await writeProducts(next);
  return sendJson(res, 200, { ok: true });
}

async function readProducts(includeAll) {
  const raw = await readFile(productDbPath, "utf8");
  const products = JSON.parse(raw);
  const normalized = Array.isArray(products) ? products.map(normalizeProduct) : [];

  if (includeAll) return normalized;
  return normalized.filter((product) => product.published !== false);
}

async function writeProducts(products) {
  await writeFile(productDbPath, `${JSON.stringify(products, null, 2)}\n`);
}

function normalizeProduct(input) {
  const priceMode = ["price", "inquiry"].includes(input.priceMode) ? input.priceMode : "price";
  return {
    id: input.id,
    category: cleanChoice(input.category, ["grand", "sports", "heritage"], "heritage"),
    brand: cleanText(input.brand, 80),
    title: cleanText(input.title, 120),
    reference: cleanText(input.reference, 80),
    year: cleanText(input.year, 20),
    image: cleanText(input.image, 1200),
    caliber: cleanText(input.caliber, 120),
    material: cleanText(input.material, 120),
    complication: cleanText(input.complication, 180),
    certificate: cleanText(input.certificate, 180),
    price: priceMode === "inquiry" ? "Price on request" : cleanText(input.price, 80),
    priceMode,
    stockStatus: cleanChoice(input.stockStatus, ["available", "reserved", "sold", "hidden"], "available"),
    published: input.published !== false && input.stockStatus !== "hidden",
    featured: Boolean(input.featured),
    story: cleanText(input.story, 1200),
    createdAt: input.createdAt || null,
    updatedAt: input.updatedAt || null
  };
}

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function cleanChoice(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
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

function readJsonBody(req, limit = 16_384) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > limit) {
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

function isAdminRequest(req) {
  const token = getCookie(req, "lm_admin");
  return Boolean(token && adminSessions.has(token));
}

function getCookie(req, name) {
  const cookie = req.headers.cookie || "";
  const parts = cookie.split(";").map((item) => item.trim());
  for (const part of parts) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    if (part.slice(0, index) === name) return decodeURIComponent(part.slice(index + 1));
  }
  return "";
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
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
