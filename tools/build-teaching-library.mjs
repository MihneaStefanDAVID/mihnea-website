import { readdir, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const materialsRoot = join(projectRoot, "teaching-materials");
const outputFile = join(projectRoot, "teaching-library.js");

const courseDetails = {
  AnD: ["Algorithms and Data Structures", "Teaching Assistant · ETH Zürich"],
  AnP: ["Algorithms and Probability", "Teaching Assistant · ETH Zürich"],
  NumCS: ["Numerical Methods for Computer Science", "Teaching Assistant · ETH Zürich"],
  PVK: ["Exam Preparation Workshops", "Academic Facilitator · ETH Zürich"],
  Coding: ["Coding & Mentoring", "Debugging, optimization and mentoring"],
};
const courseOrder = ["AnD", "AnP", "NumCS", "PVK", "Coding"];

function publicPath(path) {
  return relative(projectRoot, path).split(sep).map(encodeURIComponent).join("/");
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

async function scanFolder(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const visible = entries.filter((entry) => !entry.name.startsWith("."));
  const children = await Promise.all(visible.map(async (entry) => {
    const entryPath = join(path, entry.name);
    if (entry.isDirectory()) {
      const folder = await scanFolder(entryPath);
      const details = path === materialsRoot ? courseDetails[entry.name] : null;
      return {
        type: "folder",
        name: entry.name,
        ...(details ? { label: details[0], description: details[1] } : {}),
        children: folder.children,
      };
    }

    const info = await stat(entryPath);
    return {
      type: "file",
      name: entry.name,
      extension: extname(entry.name).slice(1).toLowerCase(),
      size: formatSize(info.size),
      url: publicPath(entryPath),
    };
  }));

  children.sort((a, b) => {
    if (path === materialsRoot) {
      return courseOrder.indexOf(a.name) - courseOrder.indexOf(b.name);
    }
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name, undefined, { numeric: true });
  });
  return { type: "folder", name: "Teaching", children };
}

const library = await scanFolder(materialsRoot);
await writeFile(outputFile, `window.TEACHING_LIBRARY = ${JSON.stringify(library, null, 2)};\n`);
console.log(`Teaching library updated: ${library.children.length} courses indexed.`);
