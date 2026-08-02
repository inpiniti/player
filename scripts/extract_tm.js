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
      let mp4Url = doc.querySelector('video source')?.getAttribute('src') || '';
      if (!mp4Url) {
        const mp4Match = text.match(/https:\/\/[^"'\s]+\.mp4[^"'\s]*/);
        if (mp4Match) mp4Url = mp4Match[0];
      }
      if (mp4Url) {
        results.push({
          id: 'tm_' + vid,
          title: '[Tokyomotion] ' + title,
          videoUrl: mp4Url,
          thumbnailUrl: poster
        });
      }
    } catch (e) {}
  }
  const jsonStr = JSON.stringify(results, null, 2);
  console.log(jsonStr);
  copy(jsonStr);
  alert("수집 완료! " + results.length + "개 영상 정보가 클립보드에 복사되었습니다. 대화창에 붙여넣어 주세요!");
})();
