export default async function handler(req, res) {
  try {
    const mod = await import('./index.js');
    return res.status(200).json({
      ok: true,
      exportedType: typeof mod.default,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL
      }
    });
  } catch (err) {
    return res.status(200).json({
      ok: false,
      error: err.message,
      stack: err.stack
    });
  }
}
