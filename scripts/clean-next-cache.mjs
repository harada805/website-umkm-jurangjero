import { existsSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

const workspace = resolve(process.cwd());
const nextCache = resolve(join(workspace, ".next"));

if (!nextCache.startsWith(workspace) || nextCache === workspace) {
  throw new Error("Refusing to remove a path outside the project workspace.");
}

if (existsSync(nextCache)) {
  rmSync(nextCache, { recursive: true, force: true });
  console.log("Cleaned stale .next cache.");
}
