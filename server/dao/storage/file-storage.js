const fs = require("fs");
const path = require("path");

const STORAGE_DIR = path.join(__dirname);

function _filePath(name) {
  return path.join(STORAGE_DIR, `${name}.json`);
}

function readAll(name) {
  const filePath = _filePath(name);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    return [];
  }
}

function writeAll(name, data) {
  const filePath = _filePath(name);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = { readAll, writeAll };
