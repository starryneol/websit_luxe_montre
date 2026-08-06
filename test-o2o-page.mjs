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
  "/assets/luxe-montre-storefront.jpg",
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
  "WhatsApp",
  'id="about"',
  'href="#about"',
  'data-i18n="nav_about"',
  'data-about-list="services"',
  'data-about-list="values"',
  "尊時匯成立於 2013 年",
  "核心業務與服務",
  "核心價值與信念",
  "頂級全新腕錶銷售",
  "全球奢華腕錶代訂服務",
  "專業鐘錶諮詢與資訊",
  "長遠私人顧問服務",
  "誠信至上",
  "合理價格",
  "優質與長遠服務",
  "Founded in 2013, LUXE MONTRE specialises",
  "Let Time Tell the Story",
  'src="/assets/luxe-montre-emblem.png"',
  'alt="LUXE MONTRE 尊時匯徽章"',
  'aria-label="Switch language"',
  'aria-label="Open menu"',
  'class="brand-mark-image"'
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

const aboutMenuLinks = html.match(/href="#about"/g) || [];
assert.equal(aboutMenuLinks.length, 2, "About Us must appear once in the desktop menu and once in the mobile menu.");

const serviceList = html.match(/<div class="about-list" data-about-list="services">(?<body>[\s\S]*?)<\/div>\s*<\/section>/)?.groups?.body || "";
const valueList = html.match(/<div class="about-list" data-about-list="values">(?<body>[\s\S]*?)<\/div>\s*<\/section>/)?.groups?.body || "";
assert.equal((serviceList.match(/class="about-item"/g) || []).length, 4, "About Us must show four core services.");
assert.equal((valueList.match(/class="about-item"/g) || []).length, 3, "About Us must show three core values.");
assert(!html.includes('class="story-section"'), "The old philosophy story block must be replaced by About Us.");
assert(html.indexOf('id="services"') < html.indexOf('id="about"'), "About Us must follow the watch and service sections.");
assert(html.indexOf('id="about"') < html.indexOf('id="contact"'), "About Us must appear before contact details.");
assert(!html.includes('<span class="brand-mark">L</span>'), "The placeholder L badge must be replaced by the supplied emblem.");

const mobileMenuLinkRule = html.match(/\.mobile-panel a\s*\{(?<body>[^}]+)\}/)?.groups?.body || "";
assert(mobileMenuLinkRule, "Missing mobile menu link styles.");
assert(!mobileMenuLinkRule.includes("color: var(--ink)"), "Mobile menu links must not use dark ink text on a dark panel.");
assert(!html.includes(".hero { min-height: 91vh; }"), "Mobile hero must be shortened for a faster watch-browsing entry.");

console.log("New-watch retail page checks passed.");
