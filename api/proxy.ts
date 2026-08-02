import type { VercelRequest, VercelResponse } from '@vercel/node';
import https from 'https';
import http from 'http';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const parsed = new URL(targetUrl);
    const client = parsed.protocol === 'https:' ? https : http;

    const requestOptions = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: req.method || 'GET',
      headers: {
        'Referer': 'https://www.tokyomotion.net/',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        ...(req.headers.range ? { 'Range': req.headers.range } : {})
      }
    };

    const proxyReq = client.request(requestOptions, (proxyRes) => {
      // 301/302 Redirect handling
      if (proxyRes.statusCode && proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
        const redirectUrl = proxyRes.headers.location;
        req.query.url = redirectUrl;
        return handler(req, res);
      }

      res.writeHead(proxyRes.statusCode || 200, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': proxyRes.headers['content-type'] || 'video/mp4',
        'Content-Length': proxyRes.headers['content-length'] || '',
        'Accept-Ranges': proxyRes.headers['accept-ranges'] || 'bytes',
        'Content-Range': proxyRes.headers['content-range'] || ''
      });

      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      res.status(500).send(err.message);
    });

    proxyReq.end();
  } catch (err: any) {
    res.status(500).send(err.message);
  }
}
