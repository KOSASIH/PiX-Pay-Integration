const crypto = require("crypto");
const fs = require("fs");

const LOG_FILE = "audit.log";

function hash(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function writeAudit(entry) {
  let prevHash = "GENESIS";

  if (fs.existsSync(LOG_FILE)) {
    const lines = fs.readFileSync(LOG_FILE, "utf8").trim().split("\n");
    if (lines.length) prevHash = JSON.parse(lines[lines.length - 1]).hash;
  }

  const record = {
    timestamp: new Date().toISOString(),
    ...entry,
    prevHash
  };

  record.hash = hash(JSON.stringify(record));

  fs.appendFileSync(LOG_FILE, JSON.stringify(record) + "\n");
}

module.exports = writeAudit;
