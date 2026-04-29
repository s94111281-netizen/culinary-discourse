import { readFile, writeFile } from "node:fs/promises";

const MANIFEST_PATH = new URL("../data/openrice-photo-manifest.json", import.meta.url);
const OUTPUT_PATH = new URL("../data/openrice-review-snippets.json", import.meta.url);

function getPageByNumber(pages, pageNo) {
  return pages.find((item) => item.page === pageNo) ?? null;
}

function normalizeTitleText(titleText) {
  return String(titleText ?? "")
    .replace(/^\s*\d+\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findTitleY(pageRows, titleText) {
  const title = normalizeTitleText(titleText);
  if (!title) return null;
  const row = pageRows.find((item) => item.text.includes(title));
  return row?.y ?? null;
}

function findTagY(pageRows) {
  const row = pageRows.find((item) => /^标签[:：]?$/.test(String(item.text).trim()));
  return row?.y ?? null;
}

function isLikelyReviewLine(text) {
  const cleaned = String(text ?? "").trim();
  if (!cleaned) return false;
  if (/^(餐厅信息|标签|评价|美食|美食展示)[:：]?$/.test(cleaned)) return false;
  if (/^(--\s*)?\d+\s*(of\s*\d+)?$/i.test(cleaned)) return false;
  if (/^[\d\s\-\/,:.]+$/.test(cleaned)) return false;

  // Prefer sentence-like lines from the PDF review section.
  const hasSentenceLikeShape = /[A-Za-z\u4e00-\u9fff]/.test(cleaned) && cleaned.length >= 28;
  const looksLikeAddress =
    /road|street|building|shop|mansion|center|centre|f\/|floor|hong kong|district|tower|plaza/i.test(cleaned) ||
    /^\s*(g|ug|lg|\d+)\s*\/\s*f/i.test(cleaned);
  const looksLikeTags = cleaned.includes(" / ") || cleaned.split("/").length >= 3;
  const hasVerb =
    /\b(is|are|was|were|has|have|serves|serve|provides|provide|uses|use|known|famous|popular|offers|offer|try|visit)\b/i.test(
      cleaned
    );
  return hasSentenceLikeShape && hasVerb && !looksLikeAddress && !looksLikeTags;
}

function compactWords(text) {
  return text
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/-\s+/g, "-")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function collectReviewLines(pages, item) {
  if (!item.page || !item.infoPage) return [];
  const lines = [];
  for (let p = item.page; p <= item.infoPage; p += 1) {
    const page = getPageByNumber(pages, p);
    if (!page) continue;
    const rows = Array.isArray(page.textRows) ? page.textRows : [];
    const titleY = p === item.page ? findTitleY(rows, item.titleText) : null;
    const tagY = findTagY(rows);

    for (const row of rows) {
      const text = String(row.text ?? "").trim();
      if (!text) continue;
      if (titleY !== null && row.y >= titleY - 2) continue;
      if (tagY !== null && row.y <= tagY + 0.5) continue;
      if (!isLikelyReviewLine(text)) continue;
      lines.push(compactWords(text));
    }
  }
  return Array.from(new Set(lines));
}

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  const pages = Array.isArray(manifest.pages) ? manifest.pages : [];
  const restaurants = Array.isArray(manifest.restaurants) ? manifest.restaurants : [];

  const snippets = restaurants.map((item) => {
    const lines = collectReviewLines(pages, item);
    return {
      index: item.index,
      page: item.page,
      infoPage: item.infoPage,
      titleText: item.titleText,
      review_lines: lines,
      review_text: lines.join(" ")
    };
  });

  const withReview = snippets.filter((item) => item.review_text.length > 0).length;
  const payload = {
    metadata: {
      source: "openrice评价.pdf text layer",
      extracted_at: new Date().toISOString(),
      total: snippets.length,
      with_review_text: withReview,
      without_review_text: snippets.length - withReview
    },
    restaurants: snippets
  };

  await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Saved ${snippets.length} review snippets; with text: ${withReview}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
