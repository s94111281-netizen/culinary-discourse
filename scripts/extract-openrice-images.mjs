import { fileURLToPath } from "node:url";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { PNG } from "pngjs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const PDF_PATH = new URL("../data/openrice评价.pdf", import.meta.url);
const OUTPUT_DIR = new URL("../public/openrice-photos/", import.meta.url);
const MANIFEST_PATH = new URL("../data/openrice-photo-manifest.json", import.meta.url);
const titleNameHints = {
  33: "tamarind",
  35: "grissini"
};

function clamp(value) {
  return Math.max(0, Math.min(255, value));
}

function convertImageDataToRgba(imageData) {
  const { width, height, data, kind } = imageData;
  const total = width * height;
  const out = new Uint8Array(total * 4);
  if (kind === pdfjsLib.ImageKind.RGBA_32BPP) {
    out.set(data);
    return out;
  }
  if (kind === pdfjsLib.ImageKind.RGB_24BPP) {
    for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
      out[j] = data[i];
      out[j + 1] = data[i + 1];
      out[j + 2] = data[i + 2];
      out[j + 3] = 255;
    }
    return out;
  }
  if (kind === pdfjsLib.ImageKind.GRAYSCALE_1BPP) {
    for (let i = 0, j = 0; i < data.length; i += 1, j += 4) {
      const v = clamp(data[i]);
      out[j] = v;
      out[j + 1] = v;
      out[j + 2] = v;
      out[j + 3] = 255;
    }
    return out;
  }
  for (let i = 0; i < out.length; i += 4) {
    out[i] = 230;
    out[i + 1] = 230;
    out[i + 2] = 230;
    out[i + 3] = 255;
  }
  return out;
}

function writePng(path, width, height, rgba) {
  const png = new PNG({ width, height });
  png.data = Buffer.from(rgba);
  const buffer = PNG.sync.write(png);
  return writeFile(path, buffer);
}

function getImageFromObj(page, objId) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), 1200);
    page.objs.get(objId, (img) => {
      clearTimeout(timer);
      resolve(img ?? null);
    });
  });
}

function isValidPhotoCandidate(img) {
  if (!img || typeof img.width !== "number" || typeof img.height !== "number") return false;
  if (img.width < 220 || img.height < 160) return false;
  const ratio = img.width / img.height;
  return ratio > 0.35 && ratio < 4.2;
}

function multiplyMatrix(m1, m2) {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
  ];
}

function bboxFromMatrix(m) {
  const points = [
    [m[4], m[5]],
    [m[0] + m[4], m[1] + m[5]],
    [m[2] + m[4], m[3] + m[5]],
    [m[0] + m[2] + m[4], m[1] + m[3] + m[5]]
  ];
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
}

function parseTextRows(textItems) {
  return textItems
    .map((item) => ({
      text: String(item.str ?? "").trim(),
      x: item.transform?.[4] ?? 0,
      y: item.transform?.[5] ?? 0,
      h: Math.max(Math.abs(item.transform?.[3] ?? 0), item.height ?? 0, 8)
    }))
    .filter((row) => row.text.length > 0)
    .sort((a, b) => b.y - a.y);
}

function detectExpectedTitleAnchor(textRows, expectedNo) {
  const numberRows = textRows
    .filter((row) => row.text === String(expectedNo))
    .sort((a, b) => b.y - a.y);
  if (numberRows.length === 0) return null;

  const preferred = numberRows.filter((row) => row.y > 650);
  const candidates = preferred.length > 0 ? preferred : numberRows;

  for (const numberRow of candidates) {
    const sibling = textRows.find((row) => {
      if (row.text.length < 2) return false;
      if (row.text.includes("餐厅信息") || row.text.includes("of 56") || row.text.startsWith("--")) return false;
      if (/[,:/]/.test(row.text)) return false;
      const isSameLine = Math.abs(row.y - numberRow.y) < 2;
      const isNextLine = row.y < numberRow.y - 0.8 && row.y > numberRow.y - 60;
      const hasText = /[A-Za-z\u4e00-\u9fa5]/.test(row.text) && !/^\d+$/.test(row.text);
      return hasText && (isSameLine || isNextLine);
    });
    if (sibling) {
      return {
        text: `${expectedNo} ${sibling.text}`,
        y: Math.max(numberRow.y, sibling.y)
      };
    }
  }

  return null;
}

function findInfoAnchorAfter(rows, titleY) {
  return rows.find((row) => row.text.includes("餐厅信息") && row.y < titleY - 3) ?? null;
}

function findTitleByNameHint(pageRows, expectedNo) {
  const hint = titleNameHints[expectedNo];
  if (!hint) return null;
  const joined = pageRows.map((row) => row.text).join(" ").toLowerCase();
  if (!joined.includes(hint)) return null;
  const row = pageRows.find((item) => item.text.toLowerCase().includes(hint));
  if (!row) return null;
  return { text: `${expectedNo} ${row.text}`, y: row.y };
}

async function clearOutputDir() {
  const dirPath = fileURLToPath(OUTPUT_DIR);
  await mkdir(dirPath, { recursive: true });
  const files = await readdir(dirPath);
  await Promise.all(files.filter((name) => name.endsWith(".png")).map((name) => rm(new URL(name, OUTPUT_DIR), { force: true })));
}

function imageOrderCompare(a, b) {
  if (a.page !== b.page) return a.page - b.page;
  return b.bbox.maxY - a.bbox.maxY;
}

async function main() {
  await clearOutputDir();
  const bytes = await readFile(PDF_PATH);
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
  const pages = [];
  let totalSaved = 0;

  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
    const page = await pdf.getPage(pageNo);
    const viewport = page.getViewport({ scale: 1 });
    const textRows = parseTextRows((await page.getTextContent()).items ?? []);
    const opList = await page.getOperatorList();
    const images = [];
    let imageIndex = 0;
    let ctm = [1, 0, 0, 1, 0, 0];
    const ctmStack = [];

    for (let i = 0; i < opList.fnArray.length; i += 1) {
      const fn = opList.fnArray[i];
      const args = opList.argsArray[i];
      if (fn === pdfjsLib.OPS.save) {
        ctmStack.push([...ctm]);
        continue;
      }
      if (fn === pdfjsLib.OPS.restore) {
        ctm = ctmStack.pop() ?? [1, 0, 0, 1, 0, 0];
        continue;
      }
      if (fn === pdfjsLib.OPS.transform && Array.isArray(args) && args.length === 6) {
        ctm = multiplyMatrix(ctm, args);
        continue;
      }

      let img = null;
      let objId = null;
      if (fn === pdfjsLib.OPS.paintInlineImageXObject) {
        img = args?.[0] ?? null;
      } else if (fn === pdfjsLib.OPS.paintImageXObject || fn === pdfjsLib.OPS.paintJpegXObject) {
        objId = args?.[0] ?? null;
        if (objId) img = await getImageFromObj(page, objId);
      }
      if (!img || !isValidPhotoCandidate(img)) continue;

      const bbox = bboxFromMatrix(ctm);
      if (bbox.width < viewport.width * 0.18 || bbox.height < viewport.height * 0.12) continue;

      imageIndex += 1;
      const fileName = `page-${String(pageNo).padStart(3, "0")}-img-${String(imageIndex).padStart(2, "0")}.png`;
      const outPath = new URL(`../public/openrice-photos/${fileName}`, import.meta.url);
      await writePng(outPath, img.width, img.height, convertImageDataToRgba(img));
      images.push({
        page: pageNo,
        fileName,
        url: `/openrice-photos/${fileName}`,
        objId: objId ?? `inline-${imageIndex}`,
        bbox,
        width: img.width,
        height: img.height
      });
      totalSaved += 1;
    }

    pages.push({ page: pageNo, textRows, images });
    console.log(`Page ${pageNo}: images=${images.length}`);
  }

  const restaurants = [];
  let cursorPage = 1;
  for (let index = 1; index <= 38; index += 1) {
    let titleAnchor = null;
    let titlePageNo = null;
    for (let p = cursorPage; p <= pages.length; p += 1) {
      const row = detectExpectedTitleAnchor(pages[p - 1].textRows, index) ?? findTitleByNameHint(pages[p - 1].textRows, index);
      if (row) {
        titleAnchor = row;
        titlePageNo = p;
        cursorPage = p;
        break;
      }
    }

    if (!titleAnchor || !titlePageNo) {
      restaurants.push({ index, page: null, titleText: null, selectedPhotoUrl: null, reason: "title_not_found" });
      continue;
    }

    let infoPageNo = titlePageNo;
    let infoAnchor = findInfoAnchorAfter(pages[titlePageNo - 1].textRows, titleAnchor.y);
    if (!infoAnchor) {
      for (let p = titlePageNo + 1; p <= pages.length; p += 1) {
        infoAnchor = pages[p - 1].textRows.find((row) => row.text.includes("餐厅信息")) ?? null;
        if (infoAnchor) {
          infoPageNo = p;
          break;
        }
      }
    }

    const intervalImages = [];
    for (let p = titlePageNo; p <= infoPageNo; p += 1) {
      for (const img of pages[p - 1].images) {
        let inInterval = true;
        if (p === titlePageNo && img.bbox.maxY > titleAnchor.y + 8) inInterval = false;
        if (p === infoPageNo && infoAnchor && img.bbox.minY < infoAnchor.y - 24) inInterval = false;
        if (inInterval) intervalImages.push(img);
      }
    }

    intervalImages.sort(imageOrderCompare);
    const selected = intervalImages[0] ?? pages[titlePageNo - 1].images.sort(imageOrderCompare)[0] ?? null;
    restaurants.push({
      index,
      page: titlePageNo,
      titleText: titleAnchor.text,
      infoPage: infoPageNo,
      selectedPhotoUrl: selected?.url ?? null,
      selectedFileName: selected?.fileName ?? null,
      candidates: intervalImages.map((img) => img.fileName)
    });
  }

  const selectedCount = restaurants.filter((item) => item.selectedPhotoUrl).length;
  await writeFile(
    MANIFEST_PATH,
    `${JSON.stringify({ totalSaved, totalPages: pages.length, selectedCount, restaurants, pages }, null, 2)}\n`,
    "utf8"
  );
  console.log(`Saved ${totalSaved} images; selected ${selectedCount}/38 by title->info interval.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
