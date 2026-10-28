import esbuild from 'esbuild';

const commonConfig = {
  entryPoints: ['backend/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
};

async function build() {
  console.log('[build-api] Bundling Serverless Functions for Vercel...');
  await Promise.all([
    esbuild.build({
      ...commonConfig,
      outfile: 'api/index.js',
    }),
    esbuild.build({
      ...commonConfig,
      outfile: 'api/[...all].js',
    }),
  ]);
  console.log('[build-api] Successfully bundled api/index.js and api/[...all].js');
}

build().catch((err) => {
  console.error('[build-api] Build failed:', err);
  process.exit(1);
});
