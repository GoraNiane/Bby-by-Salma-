import 'dotenv/config';
import type { IncomingMessage, ServerResponse } from 'http';

let appInstance: any = null;
let initError: any = null;

try {
  const mod = await import('./index.js');
  appInstance = mod.default || mod.app;
} catch (e: any) {
  console.error('[BBS Vercel Handler] Top-level initialization error:', e);
  initError = {
    message: e?.message || String(e),
    stack: e?.stack,
    name: e?.name
  };
}

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (initError) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'VERCEL_MODULE_INIT_FAILED',
      details: initError
    }, null, 2));
    return;
  }

  try {
    return appInstance(req, res);
  } catch (err: any) {
    console.error('[BBS Vercel Handler] Runtime handler error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'VERCEL_HANDLER_RUNTIME_ERROR',
      message: err?.message || String(err),
      stack: err?.stack
    }, null, 2));
  }
}
