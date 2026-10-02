#!/usr/bin/env node
/* =====================================================
   HAT CANDY — EMPLOYEE BUILD SCRIPT
   =====================================================
   يدمج كل أجزاء script.partN.js في ملف js/script.js واحد
   
   التشغيل:  node build.js
   ===================================================== */
'use strict';

const fs   = require('fs');
const path = require('path');

/* ============ CONFIG ============ */
const ROOT   = __dirname;
const JS_DIR = path.join(ROOT, 'js');
const PARTS  = [
  'script.part0.js',
  'script.part1.js',
  'script.part2.js',
  'script.part3.js',
  'script.part4.js'
];
const OUT = path.join(JS_DIR, 'script.js');

/* ============ ANSI COLORS ============ */
const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  red:    '\x1b[31m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  blue:   '\x1b[34m',
  cyan:   '\x1b[36m'
};

const log = (color, ...args) => console.log(color + args.join(' ') + C.reset);

/* ============ VALIDATE ENV ============ */
if (!fs.existsSync(JS_DIR)) {
  log(C.cyan, `📁 Creating: ${path.relative(ROOT, JS_DIR)}`);
  fs.mkdirSync(JS_DIR, { recursive: true });
}

const missing = PARTS.filter(p => !fs.existsSync(path.join(ROOT, p)));
if (missing.length) {
  log(C.red, '\n❌ Missing files:');
  missing.forEach(m => log(C.red, `   • ${m}`));
  log(C.yellow, '\n   Run the migration script first — see README.md\n');
  process.exit(1);
}

/* ============ HEADER BANNER ============ */
const banner = `/* =====================================================
   HAT CANDY — EMPLOYEE POS (MERGED BUILD)
   =====================================================
   ⚠️  AUTO-GENERATED FILE — DO NOT EDIT DIRECTLY
   
   Source:        ${PARTS.join(', ')}
   Generated:     ${new Date().toISOString()}
   
   To modify:
     1. Edit the appropriate script.partN.js
     2. Run:  node build.js
     3. Hard refresh the browser (Ctrl + Shift + R)
   ===================================================== */

`;

/* ============ MERGE ============ */
log('');
log(C.bold, '🍬 HAT CANDY — Employee POS Build');
log(C.dim,  '─'.repeat(48));
log('');

let merged = banner;
let totalSize = 0;
let partCount = 0;
const timings = [];

for (const part of PARTS) {
  const src = path.join(ROOT, part);
  const t0 = Date.now();
  const content = fs.readFileSync(src, 'utf8');
  const t1 = Date.now();

  const sizeKB = (content.length / 1024).toFixed(1);
  const lines  = content.split('\n').length;
  const ms     = t1 - t0;

  totalSize += content.length;
  partCount++;

  timings.push({ part, sizeKB, lines, ms });

  log(
    C.green,
    `   ✓ ${part.padEnd(20)} ` +
    `${sizeKB.padStart(7)} KB  ` +
    `${String(lines).padStart(6)} lines  ` +
    C.dim + `${ms}ms`
  );

  merged += `\n/* ══════════════════════════════════════════════════
   SECTION ${partCount} of ${PARTS.length}: ${part}
   ══════════════════════════════════════════════════ */\n\n`;
  merged += content;
  merged += '\n';
}

/* ============ WRITE OUTPUT ============ */
log('');
log(C.dim, '─'.repeat(48));

try {
  fs.writeFileSync(OUT, merged, 'utf8');
  const outKB   = (totalSize / 1024).toFixed(1);
  const outLines = merged.split('\n').length;

  log(C.cyan, `📦 Output:  ${path.relative(ROOT, OUT)}`);
  log(C.cyan, `   Size:   ${outKB} KB`);
  log(C.cyan, `   Lines:  ${outLines}`);
  log('');
  log(C.green + C.bold, '✅ Build complete!\n');

} catch (err) {
  log('');
  log(C.red, `❌ Write failed: ${err.message}`);
  process.exit(1);
}