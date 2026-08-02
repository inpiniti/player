(async function() {
  const targetTitles = [
    "Chinese Delivery Girl - Lele Wu Timestop",
    "Taiwan swag girl lele",
    "Swag girl lele 2 in train",
    "Lele Wu seller girl",
    "lelewu timestop 2",
    "F cup boobs horny ghost lele wu hungry for your cum sadako",
    "lelewu",
    "lele_wu"
  ].map(t => t.toLowerCase().trim());

  console.log("Starting TNAFlix collection for titles:", targetTitles);

  const videoItems = Array.from(document.querySelectorAll('a[href*="/v/"], a[href*="/video/"]'));
  console.log("Found raw video elements:", videoItems.length);

  const results = [];
  const processedUrls = new Set();

  for (const item of videoItems) {
    const title = (item.getAttribute('title') || item.textContent || "").trim();
    const href = item.getAttribute('href');
    if (!href || processedUrls.has(href)) continue;

    const matchedTitle = targetTitles.find(t => title.toLowerCase().includes(t) || t.includes(title.toLowerCase()));
    if (matchedTitle) {
      processedUrls.add(href);
      const fullUrl = href.startsWith('http') ? href : 'https://www.tnaflix.com' + href;
      const vidMatch = href.match(/\/(\d+)/);
      const vid = vidMatch ? vidMatch[1] : Math.random().toString(36).substring(7);

      try {
        const resp = await fetch(fullUrl);
        const text = await resp.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        const poster = doc.querySelector('video')?.getAttribute('poster') || 
                       doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || "";
        
        let mp4Url = doc.querySelector('video source')?.getAttribute('src') || "";
        if (!mp4Url) {
          const mp4Match = text.match(/https?:\/\/[^"'\s]+\.mp4[^"'\s]*/);
          if (mp4Match) mp4Url = mp4Match[0];
        }

        results.push({
          id: `tna_${vid}`,
          title: `[TNAFlix] ${title}`,
          videoUrl: mp4Url || fullUrl,
          thumbnailUrl: poster
        });
        console.log(`✅ 수집 성공: ${title} -> ${mp4Url || fullUrl}`);
      } catch (e) {
        console.error(e);
      }
    }
  }

  const jsonStr = JSON.stringify(results, null, 2);
  console.log("=== 최종 TNAFlix 추출 결과 ===");
  console.log(jsonStr);

  if (typeof copy === 'function') {
    copy(jsonStr);
  }
  prompt("아래 TNAFlix JSON 데이터를 복사(Cmd+C)하셔서 대화창에 붙여넣어 주세요:", jsonStr);
})();
