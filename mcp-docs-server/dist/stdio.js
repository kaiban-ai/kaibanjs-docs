#!/usr/bin/env node
import { fromPackageRoot, prepare, getMatchingPaths } from './chunk-FAUX2O2X.js';
import * as fs from 'fs';
import * as os from 'os';
import * as path2 from 'path';
import path2__default from 'path';
import fs2 from 'fs/promises';
import { MCPServer } from '@mastra/mcp';
import { z } from 'zod';

var writeErrorLog = (message, data) => {
  const now = /* @__PURE__ */ new Date();
  const timestamp = now.toISOString();
  const hourTimestamp = timestamp.slice(0, 13);
  const logMessage = {
    timestamp,
    message,
    ...data ? typeof data === "object" ? data : { data } : {}
  };
  try {
    const cacheDir = path2.join(os.homedir(), ".cache", "mastra", "mcp-docs-server-logs");
    fs.mkdirSync(cacheDir, { recursive: true });
    const logFile = path2.join(cacheDir, `${hourTimestamp}.log`);
    fs.appendFileSync(logFile, JSON.stringify(logMessage) + "\n", "utf8");
  } catch (err) {
    console.error("Failed to write to log file:", err);
  }
};
function createLogger(server2) {
  const sendLog = async (level, message, data) => {
    if (!server2) return;
    try {
      const sdkServer = server2.getServer();
      if (!sdkServer) return;
      await sdkServer.sendLoggingMessage({
        level,
        data: {
          message,
          ...data ? typeof data === "object" ? data : { data } : {}
        }
      });
    } catch (error) {
      if (error instanceof Error && (error.message === "Not connected" || error.message.includes("does not support logging") || error.message.includes("Connection closed"))) {
        return;
      }
      console.error(`Failed to send ${level} log:`, error instanceof Error ? error.message : error);
    }
  };
  return {
    info: async (message, data) => {
      await sendLog("info", message, data);
    },
    warning: async (message, data) => {
      await sendLog("warning", message, data);
    },
    error: async (message, error) => {
      const errorData = error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error;
      writeErrorLog(message, errorData);
      await sendLog("error", message, errorData);
    },
    debug: async (message, data) => {
      if (process.env.DEBUG || process.env.NODE_ENV === "development") {
        await sendLog("debug", message, data);
      }
    }
  };
}
var logger = createLogger();
var docsBaseDir = fromPackageRoot(".docs/raw/");
async function listDirContents(dirPath) {
  try {
    void logger.debug(`Listing directory contents: ${dirPath}`);
    const entries = await fs2.readdir(dirPath, { withFileTypes: true });
    const dirs = [];
    const files = [];
    for (const entry of entries) {
      if (entry.isDirectory()) {
        dirs.push(entry.name + "/");
      } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
        files.push(entry.name);
      }
    }
    return {
      dirs: dirs.sort(),
      files: files.sort()
    };
  } catch (error) {
    void logger.error(`Failed to list directory contents: ${dirPath}`, error);
    throw error;
  }
}
async function readMdxContent(docPath, queryKeywords) {
  const fullPath = path2__default.join(docsBaseDir, docPath);
  void logger.debug(`Reading MDX content from: ${fullPath}`);
  try {
    const stats = await fs2.stat(fullPath);
    if (stats.isDirectory()) {
      const { dirs, files } = await listDirContents(fullPath);
      const dirListing = [
        `Directory contents of ${docPath}:`,
        "",
        dirs.length > 0 ? "Subdirectories:" : "No subdirectories.",
        ...dirs.map((d) => `- ${d}`),
        "",
        files.length > 0 ? "Files in this directory:" : "No files in this directory.",
        ...files.map((f) => `- ${f}`),
        "",
        "---",
        "",
        "Contents of all files in this directory:",
        ""
      ].join("\n");
      let fileContents = "";
      for (const file of files) {
        const filePath = path2__default.join(fullPath, file);
        const content2 = await fs2.readFile(filePath, "utf-8");
        fileContents += `

# ${file}

${content2}`;
      }
      const contentBasedSuggestions = await getMatchingPaths(
        docPath,
        queryKeywords,
        docsBaseDir
      );
      const suggestions = ["---", "", contentBasedSuggestions, ""].join("\n");
      return { found: true, content: dirListing + fileContents + suggestions };
    }
    const content = await fs2.readFile(fullPath, "utf-8");
    return { found: true, content };
  } catch (error) {
    void logger.error(`Failed to read MDX content: ${fullPath}`, error);
    if (error.code === "ENOENT") {
      return { found: false };
    }
    throw error;
  }
}
async function findNearestDirectory(docPath, availablePaths2) {
  void logger.debug(`Finding nearest directory for: ${docPath}`);
  const parts = docPath.split("/");
  while (parts.length > 0) {
    const testPath = parts.join("/");
    try {
      const fullPath = path2__default.join(docsBaseDir, testPath);
      const stats = await fs2.stat(fullPath);
      if (stats.isDirectory()) {
        const { dirs, files } = await listDirContents(fullPath);
        return [
          `Path "${docPath}" not found.`,
          `Here are the available paths in "${testPath}":`,
          "",
          dirs.length > 0 ? "Directories:" : "No subdirectories.",
          ...dirs.map((d) => `- ${testPath}/${d}`),
          "",
          files.length > 0 ? "Files:" : "No files.",
          ...files.map((f) => `- ${testPath}/${f}`)
        ].join("\n");
      }
    } catch {
      void logger.debug(
        `Directory not found, trying parent: ${parts.slice(0, -1).join("/")}`
      );
    }
    parts.pop();
  }
  return [
    `Path "${docPath}" not found.`,
    "Here are all available paths:",
    "",
    availablePaths2
  ].join("\n");
}
async function getAvailablePaths() {
  const { dirs, files } = await listDirContents(docsBaseDir);
  let referenceDirs = [];
  if (dirs.includes("reference/")) {
    const { dirs: refDirs } = await listDirContents(
      path2__default.join(docsBaseDir, "reference")
    );
    referenceDirs = refDirs.map((d) => `reference/${d}`);
  }
  return [
    "Available top-level paths:",
    "",
    "Directories:",
    ...dirs.map((d) => `- ${d}`),
    "",
    referenceDirs.length > 0 ? "Reference subdirectories:" : "",
    ...referenceDirs.map((d) => `- ${d}`),
    "",
    "Files:",
    ...files.map((f) => `- ${f}`)
  ].filter(Boolean).join("\n");
}
var availablePaths = await getAvailablePaths();
var docsInputSchema = z.object({
  paths: z.array(z.string()).min(1).describe(
    `One or more documentation paths to fetch
Available paths:
${availablePaths}`
  ),
  queryKeywords: z.array(z.string()).optional().describe(
    "Keywords from user query to use for matching documentation. Each keyword should be a single word or short phrase; any whitespace-separated keywords will be split automatically."
  )
});
var docsTool = {
  name: "kaibanjsDocs",
  description: `Get Kaibanjs documentation. 
    Request paths to explore the docs. 
    The user doesn't know about files and directories. 
    You can also use keywords from the user query to find relevant documentation, but prioritize paths. 
    This is your internal knowledge the user can't read. 
    IMPORTANT: Be concise with your answers. The user will ask for more info. 
    If packages need to be installed, provide the pnpm command to install them. 
    Ex. if you see \`import { X } from "@kaibanjs/$PACKAGE_NAME"\` in an example, show an install command. 
    Always install latest tag, not alpha unless requested. If you scaffold a new project it may be in a subdir.
    When displaying results, always mention which file path contains the information (e.g., 'Found in "path/to/file.mdx"') so users know where this documentation lives.`,
  parameters: docsInputSchema,
  execute: async (args) => {
    void logger.debug("Executing kaibanjsDocs tool", { args });
    try {
      const queryKeywords = args.queryKeywords ?? [];
      const results = await Promise.all(
        args.paths.map(async (path3) => {
          try {
            const result = await readMdxContent(path3, queryKeywords);
            if (result.found) {
              return {
                path: path3,
                content: result.content,
                error: null
              };
            }
            const directorySuggestions = await findNearestDirectory(
              path3,
              availablePaths
            );
            const contentBasedSuggestions = await getMatchingPaths(
              path3,
              queryKeywords,
              docsBaseDir
            );
            return {
              path: path3,
              content: null,
              error: [directorySuggestions, contentBasedSuggestions].join(
                "\n\n"
              )
            };
          } catch (error) {
            void logger.warning(
              `Failed to read content for path: ${path3}`,
              error
            );
            return {
              path: path3,
              content: null,
              error: error instanceof Error ? error.message : "Unknown error"
            };
          }
        })
      );
      const output = results.map((result) => {
        if (result.error) {
          return `## ${result.path}

${result.error}

---
`;
        }
        return `## ${result.path}

${result.content}

---
`;
      }).join("\n");
      return output;
    } catch (error) {
      void logger.error("Failed to execute kaibanjsDocs tool", error);
      throw error;
    }
  }
};

// src/index.ts
var server;
if (process.env.REBUILD_DOCS_ON_START === "true") {
  void logger.info("Rebuilding docs on start");
  try {
    await prepare();
    void logger.info("Docs rebuilt successfully");
  } catch (error) {
    void logger.error("Failed to rebuild docs", error);
  }
}
server = new MCPServer({
  name: "Kaibanjs Documentation Server",
  version: JSON.parse(
    await fs2.readFile(fromPackageRoot(`package.json`), "utf8")
  ).version,
  tools: {
    kaibanjsDocs: docsTool
  }
});
Object.assign(logger, createLogger(server));
async function runServer() {
  try {
    await server.startStdio();
    void logger.info("Started Kaibanjs Docs MCP Server");
  } catch (error) {
    void logger.error("Failed to start server", error);
    process.exit(1);
  }
}

// src/stdio.ts
runServer().catch((error) => {
  const errorMessage = "Fatal error running server";
  console.error(errorMessage, error);
  writeErrorLog(errorMessage, {
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : error
  });
  process.exit(1);
});
