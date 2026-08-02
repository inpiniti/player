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
  ];

  console.log("Searching all anchor tags on TNAFlix...");
  const allAnchors = Array.from(document.querySelectorAll('a'));
  
  const results = [];
  const processedUrls = new Set();

  for (const a of allAnchors) {
    const href = a.getAttribute('href') || "";
    const title = (a.getAttribute('title') || a.innerText || a.textContent || "").trim();

    if (!href || processedUrls.has(href)) continue;

    // Check if title or href contains any target key
    const lowerTitle = title.toLowerCase();
    const isTarget = targetTitles.some(t => {
      const targetLower = t.toLowerCase();
      return lowerTitle.includes(targetLower) || href.toLowerCase().includes(targetLower.replace(/\s+/g, '-'));
    });

    if (isTarget && (href.includes('/v/') || href.includes('/video/') || href.includes('video'))) {
      processedUrls.add(href);
      const fullUrl = href.startsWith('http') ? href : 'https://www.tnaflix.com' + href;
      const vidMatch = href.match(/\/video(\d+)/) || href.match(/\/(\d+)/);
      const vid = vidMatch ? vidMatch[1] : Math.random().toString(36).substring(7);

      try {
        console.log(`Fetching detail: ${title} (${fullUrl})...`);
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
          title: `[TNAFlix] ${title || 'Lele Wu Video'}`,
          videoUrl: mp4Url || fullUrl,
          thumbnailUrl: poster
        });
        console.log(`✅ [${results.length}] ${title}`);
      } catch (e) {
        console.error(e);
      }
    }
  }

  const jsonStr = JSON.stringify(results, null, 2);
  console.log("=== TNAFlix 결과 ===");
  console.log(jsonStr);

  if (typeof copy === 'function') {
    copy(jsonStr);
  }
  prompt("아래 복사된 결과를 대화창에 붙여넣어 주세요:", jsonStr);
})();
