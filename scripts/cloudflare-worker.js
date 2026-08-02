/**
 * Cloudflare Worker Proxy for Kaori Player
 * 
 * [기능]
 * 1. Vercel 네트워크 대역폭 0B (모든 동영상 스트리밍을 Cloudflare Edge가 담당)
 * 2. Kissjav IP/SNI 차단 우회 (VPN 없이 한국에서 재생 가능)
 * 3. Tokyomotion Referer 체크 우회 (403 Forbidden 방지)
 */

export default {
  async fetch(request, env, ctx) {
    // 1. CORS Preflight 처리
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      });
    }

    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return new Response('Missing target url query parameter', { status: 400 });
    }

    try {
      const parsedTarget = new URL(targetUrl);
      const isTokyomotion = parsedTarget.hostname.includes('tokyomotion');

      // 2. 원본 서버 요청 헤더 구성
      const newHeaders = new Headers(request.headers);
      newHeaders.set('Host', parsedTarget.hostname);
      newHeaders.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      if (isTokyomotion) {
        newHeaders.set('Referer', 'https://www.tokyomotion.net/');
        newHeaders.set('Origin', 'https://www.tokyomotion.net');
      } else {
        newHeaders.set('Referer', `${parsedTarget.protocol}//${parsedTarget.hostname}/`);
      }

      // 3. Cloudflare Edge에서 대상 비디오 URL 스트리밍 요청
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: newHeaders,
        redirect: 'follow',
      });

      // 4. CORS 응답 헤더 부여 후 사용자 브라우저로 직접 파이프 스트리밍
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  },
};
