import type { VercelRequest, VercelResponse } from '@vercel/node';
import https from 'https';
import http from 'http';

export const config = {
  api: {
    responseLimit: false,
    bodyParser: false,
  },
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send('Missing target url');
  }

  try {
    const parsed = new URL(targetUrl);
    const client = parsed.protocol === 'https:' ? https : http;

    const headers: Record<string, string> = {
      'Referer': 'https://www.tokyomotion.net/',
      'Origin': 'https://www.tokyomotion.net',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*'
    };

    if (req.headers.range) {
      headers['Range'] = req.headers.range as string;
    }

    const requestOptions = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: req.method || 'GET',
      headers
    };

    const proxyReq = client.request(requestOptions, (proxyRes) => {
      // Handle 301 / 302 redirects automatically
      if (proxyRes.statusCode && proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
        let redirectUrl = proxyRes.headers.location;
        if (redirectUrl.startsWith('/')) {
          redirectUrl = `${parsed.protocol}//${parsed.hostname}${redirectUrl}`;
        }
        req.query.url = redirectUrl;
        return handler(req, res);
      }

      const resHeaders: Record<string, string | string[] | undefined> = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Range',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': proxyRes.headers['content-type'] || 'video/mp4',
        'Accept-Ranges': proxyRes.headers['accept-ranges'] || 'bytes'
      };

      if (proxyRes.headers['content-length']) {
        resHeaders['Content-Length'] = proxyRes.headers['content-length'];
      }
      if (proxyRes.headers['content-range']) {
        resHeaders['Content-Range'] = proxyRes.headers['content-range'];
      }

      res.writeHead(proxyRes.statusCode || 200, resHeaders);
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
