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
      const text = me = await resp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const title = doc.querySelector('title')?.textContent?.replace('- TOKYO Motion', '').trim() || ('Tokyomotion ' + vid);
      const poster = doc.querySelector('video')?.getAttribute('poster') || doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
      
      // HTML 내부의 실제 mp4 URL 정규식 직접 파싱 (fetch 따라가지 않고 URL만 추출)
      let finalMp4Url = "";
      const matches = text.match(/https:\/\/[^"'\s]+\.tokyomotion\.net\/video\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+\/iphone\/\d+\.mp4/);
      if (matches) {
        finalMp4Url = matches[0];
      } else {
        const fallbackMatch = text.match(/https:\/\/[^"'\s]*\.mp4[^"'\s]*/);
        if (fallbackMatch) finalMp4Url = fallbackMatch[0];
      }

      if (finalMp4Url) {
        results.push({
          id: 'tm_' + vid,
          title: '[Tokyomotion] ' + title,
          videoUrl: finalMp4Url,
          thumbnailUrl: poster
        });
        console.log(`✅ [${i+1}/${links.length}] ${title} -> ${finalMp4Url}`);
      } else {
        console.warn(`⚠️ URL 파싱 실패: ${fullUrl}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const jsonStr = JSON.stringify(results, null, 2);
  console.log("=== 최종 추출 데이터 ===");
  console.log(jsonStr);
  
  if (typeof copy === 'function') {
    copy(jsonStr);
  }
  prompt("아래 텍스트를 전체 복사(Cmd+C)하셔서 대화창에 붙여넣어 주세요:", jsonStr);
})();
