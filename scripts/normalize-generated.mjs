import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const roots = process.argv.slice(2);

if (roots.length === 0) {
  throw new Error("Usage: node scripts/normalize-generated.mjs <path> [...]");
}

const filesUnder = (path) => {
  const stat = statSync(path);
  if (stat.isFile()) {
    return [path];
  }
  if (!stat.isDirectory()) {
    return [];
  }

  return readdirSync(path, { withFileTypes: true }).flatMap((entry) =>
    filesUnder(join(path, entry.name)),
  );
};

for (const file of roots.flatMap(filesUnder)) {
  const input = readFileSync(file, "utf8");
  const normalized = `${input.replace(/[ \t]+$/gm, "").replace(/\s*$/u, "")}\n`;

  if (normalized !== input) {
    writeFileSync(file, normalized);
  }
}
