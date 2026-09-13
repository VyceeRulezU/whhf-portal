#!/usr/bin/env node
/**
 * generate-css-variables.js
 *
 * Reads color-tokens.json (raw palette) + design-tokens.json (semantic
 * tokens, referencing the palette with {dot.path} placeholders) and writes
 * tokens.css — a single :root block of CSS custom properties.
 *
 * Usage:
 *   node tokens/generate-css-variables.js
 *
 * Do not hand-edit tokens.css. Edit color-tokens.json / design-tokens.json
 * and re-run this script instead, so the JSON (used by non-CSS consumers,
 * e.g. a future React Native app or a design-tooling sync) never drifts
 * from the CSS.
 */

const fs = require("fs");
const path = require("path");

const TOKENS_DIR = __dirname;
const colorTokens = JSON.parse(
  fs.readFileSync(path.join(TOKENS_DIR, "color-tokens.json"), "utf8")
);
const designTokens = JSON.parse(
  fs.readFileSync(path.join(TOKENS_DIR, "design-tokens.json"), "utf8")
);

/** Resolve a "{dot.path}" reference against color-tokens.json. */
function resolveReference(value) {
  if (typeof value !== "string") return value;
  const match = value.match(/^\{(.+)\}$/);
  if (!match) return value;

  const parts = match[1].split(".");
  let current = colorTokens;
  for (const part of parts) {
    if (current == null || !(part in current)) {
      throw new Error(
        `Could not resolve token reference "{${match[1]}}" against color-tokens.json`
      );
    }
    current = current[part];
  }
  return current;
}

/** Walk design-tokens.json, collecting every leaf that has a "css" key. */
function collectCssVariables(node, out) {
  if (node == null || typeof node !== "object") return;

  if (typeof node.css === "string" && "value" in node) {
    out.push([node.css, resolveReference(node.value)]);
    return;
  }

  for (const key of Object.keys(node)) {
    if (key.startsWith("$")) continue; // skip $description etc.
    collectCssVariables(node[key], out);
  }
}

const variables = [];
collectCssVariables(designTokens, variables);

const lines = variables
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, value]) => `  ${name}: ${value};`);

const output = `/**
 * tokens.css — GENERATED FILE. Do not edit by hand.
 * Source: tokens/color-tokens.json + tokens/design-tokens.json
 * Regenerate with: node tokens/generate-css-variables.js
 */

:root {
${lines.join("\n")}
}
`;

fs.writeFileSync(path.join(TOKENS_DIR, "tokens.css"), output);
console.log(`Wrote ${variables.length} CSS custom properties to tokens.css`);
