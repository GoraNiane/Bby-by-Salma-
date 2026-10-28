export default async function handler(req, res) {
  const diagnostics = {};

  try {
    diagnostics.nodeVersion = process.version;
    diagnostics.cwd = process.cwd();
    diagnostics.envVercel = process.env.VERCEL;

    try {
      const express = await import('express');
      diagnostics.express = typeof express.default;
    } catch (e) {
      diagnostics.expressError = e.message;
    }

    try {
      const bcrypt = await import('bcryptjs');
      diagnostics.bcrypt = typeof bcrypt.default;
    } catch (e) {
      diagnostics.bcryptError = e.message;
    }

    try {
      const jwt = await import('jsonwebtoken');
      diagnostics.jwt = typeof jwt.default;
    } catch (e) {
      diagnostics.jwtError = e.message;
    }

    try {
      const appMod = await import('./index.js');
      diagnostics.appLoaded = true;
      diagnostics.appType = typeof appMod.default;
    } catch (e) {
      diagnostics.appLoaded = false;
      diagnostics.appError = e.message;
      diagnostics.appStack = e.stack;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(diagnostics, null, 2));
  } catch (fatal) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ fatal: fatal.message, stack: fatal.stack }));
  }
}
