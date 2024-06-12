import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_JSON_PATH = path.join(__dirname, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH));

export const version = packageJson.version;
