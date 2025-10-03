import fs2 from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import z from 'zod';

// src/utils.ts
var mdxFileCache = /* @__PURE__ */ new Map();
var __dirname = dirname(fileURLToPath(import.meta.url));
function fromRepoRoot(relative) {
  return path.resolve(__dirname, `../../`, relative);
}
function fromPackageRoot(relative) {
  return path.resolve(__dirname, `../`, relative);
}
var log = console.error;
async function* walkMdxFiles(dir) {
  if (mdxFileCache.has(dir)) {
    for (const file of mdxFileCache.get(dir)) yield file;
    return;
  }
  const filesInDir = [];
  const entries = await fs2.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      for await (const file of walkMdxFiles(fullPath)) {
        filesInDir.push(file);
        yield file;
      }
    } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
      filesInDir.push(fullPath);
      yield fullPath;
    }
  }
  mdxFileCache.set(dir, filesInDir);
}
async function searchDocumentContent(keywords, baseDir) {
  if (keywords.length === 0) return [];
  const fileScores = /* @__PURE__ */ new Map();
  for await (const filePath of walkMdxFiles(baseDir)) {
    let content;
    try {
      content = await fs2.readFile(filePath, "utf-8");
    } catch {
      continue;
    }
    const lines = content.split("\n");
    lines.forEach((lineText) => {
      const lowerLine = lineText.toLowerCase();
      for (const keyword of keywords) {
        if (lowerLine.includes(keyword.toLowerCase())) {
          const relativePath = path.relative(baseDir, filePath).replace(/\\/g, "/");
          if (!fileScores.has(relativePath)) {
            fileScores.set(relativePath, {
              path: relativePath,
              keywordMatches: /* @__PURE__ */ new Set(),
              totalMatches: 0,
              titleMatches: 0,
              pathRelevance: calculatePathRelevance(relativePath, keywords)
            });
          }
          const score = fileScores.get(relativePath);
          score.keywordMatches.add(keyword);
          score.totalMatches++;
          if (lowerLine.includes("#") || lowerLine.includes("title")) {
            score.titleMatches++;
          }
        }
      }
    });
  }
  const validFiles = Array.from(fileScores.values()).sort(
    (a, b) => calculateFinalScore(b, keywords.length) - calculateFinalScore(a, keywords.length)
  ).slice(0, 10);
  return validFiles.map((score) => score.path);
}
function calculatePathRelevance(filePath, keywords) {
  let relevance = 0;
  const pathLower = filePath.toLowerCase();
  if (pathLower.startsWith("reference/")) relevance += 2;
  keywords.forEach((keyword) => {
    if (pathLower.includes(keyword.toLowerCase())) relevance += 3;
  });
  const highValueDirs = ["rag", "memory", "agents", "workflows"];
  if (highValueDirs.some((dir) => pathLower.includes(dir))) {
    relevance += 1;
  }
  return relevance;
}
function calculateFinalScore(score, totalKeywords) {
  const allKeywordsBonus = score.keywordMatches.size === totalKeywords ? 10 : 0;
  return score.totalMatches * 1 + score.titleMatches * 3 + score.pathRelevance * 2 + score.keywordMatches.size * 5 + allKeywordsBonus;
}
function extractKeywordsFromPath(path3) {
  const filename = path3.split("/").pop()?.replace(/\.(mdx|md)$/, "") || "";
  const keywords = /* @__PURE__ */ new Set();
  const splitParts = filename.split(/[-_]|(?=[A-Z])/);
  splitParts.forEach((keyword) => {
    if (keyword.length > 2) {
      keywords.add(keyword.toLowerCase());
    }
  });
  return Array.from(keywords);
}
function normalizeKeywords(keywords) {
  return Array.from(
    new Set(
      keywords.flatMap((k) => k.split(/\s+/).filter(Boolean)).map((k) => k.toLowerCase())
    )
  );
}
async function getMatchingPaths(path3, queryKeywords, baseDir) {
  const pathKeywords = extractKeywordsFromPath(path3);
  const allKeywords = normalizeKeywords([
    ...pathKeywords,
    ...queryKeywords || []
  ]);
  if (allKeywords.length === 0) {
    return "";
  }
  const suggestedPaths = await searchDocumentContent(allKeywords, baseDir);
  if (suggestedPaths.length === 0) {
    return "";
  }
  const pathList = suggestedPaths.map((path4) => `- ${path4}`).join("\n");
  return `Here are some paths that might be relevant based on your query:

${pathList}`;
}
z.object({
  slug: z.string(),
  content: z.string(),
  metadata: z.object({
    title: z.string(),
    publishedAt: z.string(),
    summary: z.string(),
    image: z.string().optional(),
    author: z.string().optional(),
    draft: z.boolean().optional().default(false),
    categories: z.array(z.string()).or(z.string())
  })
});
var DOCS_SOURCE = fromRepoRoot("docs");
var DOCS_DEST = fromPackageRoot(".docs/raw");
async function copyDir(src, dest) {
  await fs2.mkdir(dest, { recursive: true });
  const entries = await fs2.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile() && (entry.name.endsWith(".mdx") || entry.name.endsWith(".md"))) {
      await fs2.copyFile(srcPath, destPath);
    }
  }
}
async function copyRaw() {
  try {
    try {
      await fs2.rm(DOCS_DEST, { recursive: true });
    } catch {
    }
    await copyDir(DOCS_SOURCE, DOCS_DEST);
    log("\u2705 Documentation files copied successfully");
  } catch (error) {
    console.error("\u274C Failed to copy documentation files:", error);
    process.exit(1);
  }
}

// src/prepare-docs/prepare.ts
async function prepare() {
  log("Preparing documentation...");
  await copyRaw();
  log("Documentation preparation complete!");
}
if (process.env.PREPARE === `true`) {
  try {
    await prepare();
  } catch (error) {
    console.error("Error preparing documentation:", error);
    process.exit(1);
  }
}

export { fromPackageRoot, getMatchingPaths, prepare };
