// Copies the Lenis build out of node_modules into js/vendor so the site stays
// a zero-build static deployment (GitHub Pages serves the vendored file as-is).
// The stylesheet in css/lenis.css carries the same rules plus local overrides.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

const require = createRequire(import.meta.url);
// `lenis` blocks deep imports of package.json, so resolve the ESM entry and
// step into its dist directory instead.
const entry = require.resolve('lenis');
const distDir = dirname(entry);
const targetDir = resolve(process.cwd(), 'js', 'vendor');

const stripSourceMap = (code) => code.replace(/^\/\/# sourceMappingURL=.*$/gm, '').trimEnd() + '\n';

await mkdir(targetDir, { recursive: true });

const min = await readFile(resolve(distDir, 'lenis.min.js'), 'utf8');
await writeFile(resolve(targetDir, 'lenis.min.js'), stripSourceMap(min), 'utf8');

console.log('Vendored Lenis into js/vendor/lenis.min.js');
