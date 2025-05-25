const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const archiver = require("archiver");
const dayjs = require("dayjs");
const { exec } = require("child_process");

// 🔧 Шлях до .env (у server/)
require("dotenv").config({ path: path.join(__dirname, "server", ".env") });

// 🔧 Конфігурація
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASSWORD;

const PROJECT_DIR = path.join(__dirname, "server"); // де код
const BACKUP_ROOT = path.join(__dirname, "backups"); // один рівень вище
const TIMESTAMP = dayjs().format("YYYY-MM-DD_HH-mm-ss");
const BACKUP_DIR = path.join(BACKUP_ROOT, TIMESTAMP);

// 📁 Створення тимчасової папки
fs.mkdirSync(BACKUP_DIR, { recursive: true });

// ✅ Копіювання .env
const envSrc = path.join(PROJECT_DIR, ".env");
const envDest = path.join(BACKUP_DIR, ".env");

if (fs.existsSync(envSrc)) {
  fs.copyFileSync(envSrc, envDest);
  console.log("✅ .env скопійовано");
} else {
  console.warn("⚠️ .env не знайдено у server/");
}

// ✅ Копіювання коду (без node_modules, .git, backups)
const codeBackupDir = path.join(BACKUP_DIR, "project");

fse.copy(PROJECT_DIR, codeBackupDir, {
  filter: (src) => {
    const rel = path.relative(PROJECT_DIR, src);
    return !rel.startsWith("node_modules") &&
           !rel.startsWith("backups") &&
           !rel.includes(".git") &&
           !rel.includes("backup.js");
  },
}).then(() => {
  console.log("✅ Код скопійовано");
  backupDb();
}).catch(err => {
  console.error("❌ Помилка копіювання коду:", err.message);
  backupDb(); // все одно йдемо далі
});

// 🗃 Бекап БД
function backupDb() {
  if (!DB_NAME || !DB_USER || !DB_PASS) {
    console.warn("⚠️ Дані бази не задані у .env — пропускаємо pg_dump");
    return zipProject();
  }

  const dbDumpPath = path.join(BACKUP_DIR, `db_${TIMESTAMP}.dump`);
  const cmd = `pg_dump -U ${DB_USER} -F c -d ${DB_NAME} -f "${dbDumpPath}"`;

  exec(cmd, { env: { ...process.env, PGPASSWORD: DB_PASS } }, (err) => {
    if (err) {
      console.error("❌ Бекап БД не вдався:", err.message);
    } else {
      console.log("✅ БД збережено");
    }
    zipProject();
  });
}

// 🗜 Архівація
function zipProject() {
  const zipPath = path.join(BACKUP_ROOT, `backup_${TIMESTAMP}.zip`);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    console.log(`✅ Архів створено: ${zipPath} (${archive.pointer()} байт)`);

    if (!process.env.SKIP_CLEANUP) {
      fs.rmSync(BACKUP_DIR, { recursive: true, force: true });
      console.log("🧹 Тимчасову теку видалено");
    } else {
      console.log("📁 Тимчасову теку залишено (SKIP_CLEANUP=true)");
    }
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(BACKUP_DIR, false);
  archive.finalize();
}
