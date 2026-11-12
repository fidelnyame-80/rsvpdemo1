import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const path of ['index.html', 'style.css', 'app.js', 'assets']) await cp(path, `dist/${path}`, { recursive: true });
console.log('Static wedding demo built in dist/');
