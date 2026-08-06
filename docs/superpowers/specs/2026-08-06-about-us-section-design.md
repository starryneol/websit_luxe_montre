# 「關於我們」公司介紹板塊設計

## 目標

在首頁加入一個清晰、可信且與現有奢華鐘錶視覺一致的公司介紹板塊，讓訪客快速了解尊時匯的成立背景、業務定位與服務理念。主導航與手機選單均提供「關於我們」入口。

## 已確認事實

- 公司名稱：LUXE MONTRE／尊時匯
- 成立年份：2013 年
- 成立地點：香港
- 現階段定位：專注全新及未使用高級腕錶
- 主要品牌：Patek Philippe、Rolex、Richard Mille
- 服務方向：現貨介紹、訂貨諮詢、私人品鑑、配件與保養建議

## 資訊架構

1. 桌面主導航在「傳世珍藏」之前加入「關於我們」，連結至 `#about`。
2. 手機選單同步加入「關於我們」。
3. 首頁首屏與手機快捷入口之後、現貨珍藏之前放置公司介紹板塊。
4. 以新的 `#about` 板塊取代現有「時間藝術的守護者」品牌理念區，避免內容重複。

## 視覺設計

- 使用米白色／暖白色全寬背景，與深色門店首屏形成明顯而高雅的對比。
- 內容置於現有網站容器內，採居中排版。
- 標題為「關於我們」，使用現有中文襯線字體和深色文字。
- 標題下方加入短金線作為裝飾。
- 正文分為三段，保持舒適行寬與較寬行距；關鍵詞可使用半粗體，但不使用卡片、圖標或額外按鈕。
- 板塊底部使用兩側細金線與「讓時間，說故事」形成分隔裝飾。
- 不新增照片；門店照片繼續由首屏承擔品牌視覺重點。

## 正式繁體中文文案

### 標題

關於我們

### 正文

尊時匯自 2013 年於香港成立，專注甄選 Patek Philippe、Rolex、Richard Mille 等品牌的全新及未使用高級腕錶，為顧客提供清晰的產品資訊與私密從容的品鑑體驗。

我們相信，每一枚腕錶都承載工藝、歷史與個人風格。團隊以專業知識了解顧客需要，從門店現貨介紹、訂貨諮詢，到配件完整度與保養建議，協助顧客選擇真正適合自己的時計。

尊時匯重視每一段長期關係，並以謹慎、真誠及透明的方式服務每位顧客，讓每一次選購都成為值得珍藏的時間故事。

### 分隔語

讓時間，說故事

## 正式英文文案

### Title

About Us

### Body

Founded in Hong Kong in 2013, LUXE MONTRE focuses on new and unworn timepieces from Patek Philippe, Rolex, Richard Mille and other distinguished maisons, offering clear product information and a discreet private viewing experience.

We believe every watch carries craftsmanship, history and personal character. Our team listens carefully to each client and provides guidance across in-store availability, special-order enquiries, accessory completeness and long-term care.

LUXE MONTRE values lasting relationships and serves every client with discretion, sincerity and transparency, turning each purchase into a story worth preserving.

### Divider

Let Time Tell the Story

## 響應式行為

- 桌面端正文最大行寬控制在約 900–980px，三段文字置中。
- 手機端左右留白不少於 20px，標題與正文按現有斷點縮小。
- 手機端正文改為左對齊，以提高長段中文的閱讀性；分隔語保持居中。
- 導航錨點需要考慮固定頁首高度，避免標題被頁首遮擋。
- 不產生橫向滾動，也不隱藏標題或正文。

## 多語言與互動

- 新增 `nav_about`、`about_title`、`about_copy_1`、`about_copy_2`、`about_copy_3`、`about_divider` 中英文翻譯鍵。
- 語言切換沿用現有 `data-i18n` 機制。
- 桌面及手機選單點擊「關於我們」均平滑定位至 `#about`。
- 手機選單點擊後沿用現有自動收合行為。

## 驗收標準

- 桌面與手機導航均存在「關於我們／About Us」，且指向唯一的 `#about`。
- 公司成立年份只顯示為 2013 年。
- 中文與英文三段文案均完整顯示。
- 原「時間藝術的守護者」區塊不再重複出現。
- 固定頁首不遮擋板塊標題。
- 1440×900 與 390×844 視口無裁切、重疊或橫向溢出。
- 語言切換後標題、三段正文、分隔語與導航文字全部更新。
- 瀏覽器控制台沒有與本次修改相關的錯誤或警告。

## 非目標

- 本次不新增品牌目錄、訂貨資料庫、WeChat 二維碼或後端管理功能。
- 本次不修改現貨商品資料、價格邏輯或 WhatsApp 詢價流程。
- 本次不新增未經確認的獎項、授權經銷商身分、保證條款或市場地位聲明。
