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
      
      let vsrcUrl = doc.querySelector('video source')?.getAttribute('src') || '';
      if (!vsrcUrl) {
        const vsrcMatch = text.match(/https:\/\/[^"'\s]+\/vsrc\/sd\/[a-zA-Z0-9]+/);
        if (vsrcMatch) vsrcUrl = vsrcMatch[0];
      }

      let finalMp4Url = "";
      if (vsrcUrl) {
        // Fetch vsrc URL with redirect: 'manual' or fetch directly to inspect final URL
        const redirectResp = await fetch(vsrcUrl);
        finalMp4Url = redirectResp.url; // 리다이렉트 최종 도달 URL (www32.tokyomotion.net/video/5daa30.../iphone/6705859.mp4)
      }

      if (finalMp4Url && finalMp4Url.includes('.mp4')) {
        results.push({
          id: 'tm_' + vid,
          title: '[Tokyomotion] ' + title,
          videoUrl: finalMp4Url,
          thumbnailUrl: poster
        });
        console.log(`✅ [${i+1}/${links.length}] ${title} -> ${finalMp4Url.substring(0, 70)}...`);
      } else {
        console.warn(`⚠️ 최종 MP4 URL 추적 실패: ${fullUrl}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const jsonStr = JSON.stringify(results, null, 2);
  console.log(jsonStr);
  copy(jsonStr);
  alert(`완료! 총 ${results.length}개의 리다이렉트 완료된 최종 MP4 URL이 클립보드에 복사되었습니다.`);
})();
