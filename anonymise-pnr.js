#!/usr/bin/env node
/**
 * PNR XML Anonymiser
 *
 * ✅ Tag-safe (never touches XML structure)
 * ✅ Same real passenger → same anonymised identity
 * ✅ Covers structured fields + SSR + RM + history
 * ✅ Handles phones with or without +
 */

const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(process.cwd(), 'input-pnrs');
const OUTPUT_DIR = path.join(process.cwd(), 'anonymized');

/* ---------- Regex ---------- */

const EMAIL_RE =
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

const PHONE_RE =
  /\b\+?\d{9,15}\b/g;

const AIRLINE_NAME_RE =
  /\b[A-Z]{2,}(?:\s[A-Z]{2,})+\/[A-Z\s]+(?:MS|MR|MRS)?\b/g;

/* ---------- Identity registry ---------- */

const identityMap = new Map();
let identityCounter = 1;

function getIdentity(realFirst, realLast) {
  const key = `${realLast}|${realFirst}`;

  if (!identityMap.has(key)) {
    const s = identityCounter === 1 ? '' : String(identityCounter);
    identityMap.set(key, {
      first: `testFirst${s}`,
      last: `testLast${s}`,
      email: `test${s}@test.com`,
      phone: '0000000000'
    });
    identityCounter++;
  }

  return identityMap.get(key);
}

/* ---------- Helpers ---------- */

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ---------- Passenger extraction ---------- */

function extractPassengers(xml) {
  const pax = [];
  const re =
    /<surname>(.*?)<\/surname>[\s\S]*?<firstName>(.*?)<\/firstName>/gi;

  let match;
  while ((match = re.exec(xml)) !== null) {
    pax.push({
      last: match[1].trim(),
      first: match[2].trim()
    });
  }

  return pax;
}

/* ---------- Free-text anonymisation ---------- */

function anonymiseFreeText(xml, replacements) {
  let out = xml;

  // Known-value replacement (safe + deterministic)
  for (const [real, anon] of Object.entries(replacements)) {
    if (!real) continue;
    out = out.replace(
      new RegExp(escapeRegExp(real), 'g'),
      anon
    );
  }

  // Airline formatted names
  out = out.replace(
    AIRLINE_NAME_RE,
    'TESTLAST/TESTFIRST'
  );

  // Emails
  out = out.replace(EMAIL_RE, 'test@test.com');

  // Phones
  out = out.replace(PHONE_RE, '0000000000');

  return out;
}

/* ---------- Main anonymiser ---------- */

function anonymizeXml(xml) {
  let out = xml;

  const passengers = extractPassengers(xml);
  const replacements = {};

  passengers.forEach(pax => {
    const anon = getIdentity(pax.first, pax.last);

    // Structured replacements
    replacements[pax.last] = anon.last;
    replacements[pax.first] = anon.first;

    // Airline formats
    replacements[`${pax.last}/${pax.first}`] =
      `${anon.last}/${anon.first}`;

    replacements[
      `${pax.last}/${pax.first} MS`
    ] = `${anon.last}/${anon.first}`;
  });

  // Strict tag-content replacement (by value, not index)
  for (const [real, anon] of Object.entries(replacements)) {
    out = out.replace(
      new RegExp(`>${escapeRegExp(real)}<`, 'g'),
      `>${anon}<`
    );
  }

  // Free-text anonymisation (SSR, RM, history, etc.)
  out = anonymiseFreeText(out, replacements);

  return out;
}

/* ---------- CLI ---------- */

function main() {
  ensureDir(INPUT_DIR);
  ensureDir(OUTPUT_DIR);

  const files = fs.readdirSync(INPUT_DIR)
    .filter(f => f.toLowerCase().endsWith('.xml'))
    .sort();

  if (!files.length) {
    console.log(`No XML files found in ${INPUT_DIR}`);
    return;
  }

  files.forEach(file => {
    const xml = fs.readFileSync(
      path.join(INPUT_DIR, file),
      'utf8'
    );

    const outXml = anonymizeXml(xml);

    const outFile = path.join(
      OUTPUT_DIR,
      file.replace(/\.xml$/i, '.anonymized.xml')
    );

    fs.writeFileSync(outFile, outXml, 'utf8');
  });
}

main();
``