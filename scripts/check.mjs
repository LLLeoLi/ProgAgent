import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate HTML ids');
for (const [, link] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  if (link.startsWith('#')) {
    if (link.length > 1 && !ids.includes(link.slice(1))) throw new Error(`Missing anchor: ${link}`);
  } else if (!/^[a-z]+:/i.test(link)) {
    await access(path.join(root, link.split('#')[0]));
  }
}
for (const [, image] of html.matchAll(/(<img\b[^>]*>)/g)) {
  if (!/\balt="[^"]+"/.test(image)) throw new Error('Missing image description');
}
console.log('Passed: unique IDs, navigation anchors, local assets, and image descriptions.');
