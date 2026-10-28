import esbuild from 'esbuild';

const commonConfig = {
  entryPoints: ['backend/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
};

async function build() {
  console.log('[build-api] Bundling Serverless Function for Vercel...');
  await esbuild.build({
    ...commonConfig,
    outfile: 'api/index.js',
  });
  console.log('[build-api] Successfully bundled api/index.js');
}

build().catch((err) => {
  console.error('[build-api] Build failed:', err);
  process.exit(1);
});
