(async function() {
  const tnaItems = [
    ["tna_7165701", "https://img.tnaflix.com/a16:9q80w920/107/71/65/7165701/thumbs/10.jpg"],
    ["tna_7248216", "https://img.tnaflix.com/a16:9q80w920/107/72/48/7248216/thumbs/10.jpg"],
    ["tna_7495396", "https://img.tnaflix.com/a16:9q80w920/108/74/95/7495396/thumbs/10.jpg"],
    ["tna_7495365", "https://img.tnaflix.com/a16:9q80w920/109/74/95/7495365/thumbs/10.jpg"],
    ["tna_10583026", "https://img.tnaflix.com/a16:9q80w920/198/10/58/10583026/thumbs/10.jpg"],
    ["tna_7242213", "https://img.tnaflix.com/a16:9q80w920/107/72/42/7242213/thumbs/10.jpg"],
    ["tna_25345902", "https://img.tnaflix.com/a16:9q80w920/176/25/34/25345902/thumbs/10.jpg"],
    ["tna_6734943", "https://img.tnaflix.com/a16:9q80w920/105/67/34/6734943/thumbs/10.jpg"],
    ["tna_25486790", "https://img.tnaflix.com/a16:9q80w920/174/25/48/25486790/thumbs/10.jpg"]
  ];

  console.log("Downloading thumbnails via browser...");

  for (const [vid, url] of tnaItems) {
    try {
      const resp = await fetch(url);
      const blob = await resp.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${vid}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      console.log(`Downloaded ${vid}.jpg`);
    } catch (e) {
      console.error(e);
    }
  }
})();
