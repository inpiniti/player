import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/tm-stream': {
        target: 'https://www.tokyomotion.net',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            try {
              const reqUrl = new URL(req.url || '', 'http://localhost');
              const targetUrl = reqUrl.searchParams.get('url');
              if (targetUrl) {
                const parsed = new URL(targetUrl);
                proxyReq.host = parsed.host;
                proxyReq.protocol = parsed.protocol;
                proxyReq.path = parsed.pathname + parsed.search;
                proxyReq.setHeader('Host', parsed.host);
                proxyReq.setHeader('Referer', 'https://www.tokyomotion.net/');
                proxyReq.setHeader('Origin', 'https://www.tokyomotion.net');
                proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
              }
            } catch (e) {}
          });
        }
      }
    }
  }
})
