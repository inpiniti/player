(async function() {
  const links = Array.from(document.querySelectorAll('a[href*="/video/"]'))
    .map(a => a.getAttribute('href'))
    .filter((href, index, self) => href && self.indexOf(href) === index && href.match(/\/video\/\d+/));

  console.log("Found links:", links.length);
  const results = [];
  for (let i = 0; i < links.length; i++) {
    const fullUrl = 'https://www.tokyomotion.net' + links[i];
    const vidMatch = links[i].match(/\/video\/(\d+)/);
    const vid = vidMatch ? vidMatch[1] : i;
    try {
      const resp = await fetch(fullUrl);
      const text = await resp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const title = doc.querySelector('title')?.textContent?.replace('- TOKYO Motion', '').trim() || ('Tokyomotion ' + vid);
      const poster = doc.querySelector('video')?.getAttribute('poster') || doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
      
      // 실제 cdn .mp4 미디어 주소 추출 (예: cdn.tokyo-motion.net/...mp4)
      const mp4Matches = text.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/g) || [];
      // vsrc/sd가 아닌 cdn/direct mp4 우선 선택
      let realMp4 = mp4Matches.find(url => url.includes('cdn') || url.includes('.mp4')) || doc.querySelector('video source')?.getAttribute('src') || '';

      if (realMp4) {
        results.push({
          id: 'tm_' + vid,
          title: '[Tokyomotion] ' + title,
          videoUrl: realMp4,
          thumbnailUrl: poster
        });
      }
    } catch (e) {}
  }
  const jsonStr = JSON.stringify(results, null, 2);
  console.log(jsonStr);
  copy(jsonStr);
  alert("수집 완료! " + results.length + "개 영상 CDN URL 정보가 클립보드에 복사되었습니다.");
})();
