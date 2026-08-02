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
      
      // cdn / media static direct url
      // e.g. https://cdn.tokyo-motion.net/media/videos/...
      let directUrl = "";
      const matches = text.match(/https:\/\/[^"'\s]*cdn[^\s"'\.]*\.tokyo-motion\.net\/[^\s"']*/g) || [];
      const mp4Matches = text.match(/https:\/\/[^"'\s]*\.mp4[^\s"']*/g) || [];
      
      console.log(`[${i+1}] ${title}:`, matches, mp4Matches);
    } catch (e) {
      console.error(e);
    }
  }
})();
