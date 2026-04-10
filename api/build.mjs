import { build } from 'esbuild';

const shared = {
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  minify: true,
  sourcemap: true,
  treeShaking: true,
  external: ['@clerk/backend'],
};

const handlers = ['visits', 'catalogs', 'analytics'];

for (const handler of handlers) {
  await build({
    ...shared,
    entryPoints: [`src/handlers/${handler}.ts`],
    outfile: `dist/${handler}/index.mjs`,
  });
  console.log(`Built ${handler} handler`);
}

console.log('All handlers built successfully');
