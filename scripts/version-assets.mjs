import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const pagePath = path.join(root, 'index.html');
let html = await readFile(pagePath, 'utf8');
for (const [name, extension, attribute] of [['styles', 'css', 'href'], ['app', 'js', 'src']]) {
  const content = await readFile(path.join(root, `${name}.${extension}`));
  const digest = createHash('sha256').update(content).digest('hex').slice(0, 12);
  const filename = `${name}.${digest}.${extension}`;
  const reference = new RegExp(`${attribute}="${name}(?:\\.[a-f0-9]{12})?\\.${extension}"`, 'g');
  if (!reference.test(html)) throw new Error(`Missing ${name}.${extension} reference`);
  await writeFile(path.join(root, filename), content);
  html = html.replace(reference, `${attribute}="${filename}"`);
  console.log(`Versioned asset: ${filename}`);
}
await writeFile(pagePath, html);
