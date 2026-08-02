(async function() {
  const links = Array.from(document.querySelectorAll('a[href*="/video/"]'))
    .map(a => a.getAttribute('href'))
    .filter((href, index, self) => href && self.indexOf(href) === index && href.match(/\/video\/\d+/));

  console.log("Found video links:", links.length);
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
      
      // HTML 내부의 <video source> 및 vsrc 링크 추적
      let finalMp4Url = "";
      const sourceSrc = doc.querySelector('video source')?.getAttribute('src') || doc.querySelector('source')?.getAttribute('src') || '';
      
      if (sourceSrc) {
        finalMp4Url = sourceSrc;
      } else {
        const vsrcMatch = text.match(/https:\/\/[^"'\s]+\/vsrc\/sd\/[a-zA-Z0-9]+/);
        if (vsrcMatch) {
          finalMp4Url = vsrcMatch[0];
        } else {
          const mp4Match = text.match(/https:\/\/[^"'\s]+\.mp4[^"'\s]*/);
          if (mp4Match) finalMp4Url = mp4Match[0];
        }
      }

      if (finalMp4Url) {
        results.push({
          id: 'tm_' + vid,
          title: '[Tokyomotion] ' + title,
          videoUrl: finalMp4Url,
          thumbnailUrl: poster
        });
        console.log(`✅ [${i+1}/${links.length}] ${title}`);
      } else {
        console.warn(`⚠️ URL 파싱 실패: ${fullUrl}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const jsonStr = JSON.stringify(results, null, 2);
  console.log("=== 최종 추출 성공 (" + results.length + "개) ===");
  console.log(jsonStr);
  
  if (typeof copy === 'function') {
    copy(jsonStr);
  }
  prompt("아래 텍스트를 전체 복사(Cmd+C)하셔서 대화창에 붙여넣어 주세요:", jsonStr);
})();
