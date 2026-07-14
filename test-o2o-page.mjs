import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("./index.html", import.meta.url), "utf8");

const requiredSnippets = [
  "<!DOCTYPE html>",
  "application/ld+json",
  "googletagmanager.com/gtag/js?id=G-",
  "filterBrand",
  "filterCategory",
  "filterCondition",
  "filterInStore",
  "地舖現貨",
  "In-Store Ready",
  "wa.me/852",
  "價格查詢",
  "plateNumber",
  "appointmentType",
  "VIP 泊車用",
  "Google Maps",
  "traffic-guide",
  "sellForm",
  "sellImages",
  "最多 5 張",
  "15 分鐘極速交收",
  "tradeTarget",
  "tradeOwnedValue",
  "鎖定交易",
  "24 小時保留中",
  "portfolioChart",
  "Live Market API",
  "qrcode",
  "Stripe",
  "nfcPassport",
  "地舖保證回收價",
  "/data/products.json",
  "mobile-market-dock",
  "mobile-cta-bar",
  "查看現貨",
  "WhatsApp"
];

assert(!html.includes("Cocoa HTML Writer"), "index.html must be a real webpage, not Cocoa-exported escaped source.");
assert(!html.includes("&lt;!DOCTYPE html&gt;"), "index.html must not render source code as escaped HTML.");

for (const snippet of requiredSnippets) {
  assert(html.includes(snippet), `Missing required O2O feature marker: ${snippet}`);
}

const mobileMenuLinkRule = html.match(/\.mobile-panel a\s*\{(?<body>[^}]+)\}/)?.groups?.body || "";
assert(mobileMenuLinkRule, "Missing mobile menu link styles.");
assert(!mobileMenuLinkRule.includes("color: var(--ink)"), "Mobile menu links must not use dark ink text on a dark panel.");
assert(!html.includes(".hero { min-height: 91vh; }"), "Mobile hero must be shortened for a faster watch-browsing entry.");

console.log("O2O page checks passed.");
