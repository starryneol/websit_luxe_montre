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
  "全新名錶甄選",
  "預約私人品鑑",
  "24 小時保留中",
  "Stripe",
  "/data/products.json",
  "mobile-market-dock",
  "mobile-cta-bar",
  "查看現貨",
  "WhatsApp"
];

const removedFeatureSnippets = [
  'id="trade"',
  'href="#trade"',
  'id="concierge"',
  'href="#concierge"',
  "sellForm",
  "tradeTarget",
  "assetChatForm",
  "AI 名錶資產",
  "AI Watch Asset Portfolio"
];

assert(!html.includes("Cocoa HTML Writer"), "index.html must be a real webpage, not Cocoa-exported escaped source.");
assert(!html.includes("&lt;!DOCTYPE html&gt;"), "index.html must not render source code as escaped HTML.");

for (const snippet of requiredSnippets) {
  assert(html.includes(snippet), `Missing required O2O feature marker: ${snippet}`);
}

for (const snippet of removedFeatureSnippets) {
  assert(!html.includes(snippet), `Removed business feature is still present: ${snippet}`);
}

const conditionOptions = html.match(/const conditions = \[(?<body>[\s\S]*?)\n    \];/)?.groups?.body || "";
assert(conditionOptions, "Missing condition filter configuration.");
assert(!conditionOptions.includes('id: "mint"'), "Condition filter must not offer the Mint / 極佳品相 option.");
assert(!html.includes('condition_mint:'), "Rendered condition labels must not expose Mint / 極佳品相.");

const mobileMenuLinkRule = html.match(/\.mobile-panel a\s*\{(?<body>[^}]+)\}/)?.groups?.body || "";
assert(mobileMenuLinkRule, "Missing mobile menu link styles.");
assert(!mobileMenuLinkRule.includes("color: var(--ink)"), "Mobile menu links must not use dark ink text on a dark panel.");
assert(!html.includes(".hero { min-height: 91vh; }"), "Mobile hero must be shortened for a faster watch-browsing entry.");

console.log("New-watch retail page checks passed.");
