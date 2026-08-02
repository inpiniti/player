import urllib.request
import urllib.parse
import re
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
}

def fetch_html(url):
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
            return response.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

def crawl():
    videos = []
    page = 1
    while True:
        url = f"https://www.tokyomotion.net/search?search_query=kaori_xoxo&search_type=videos&page={page}"
        print(f"Fetching search page {page}: {url}")
        html = fetch_html(url)
        if not html:
            break
            
        # Find video links: <a href="/video/12345/..." title="...">
        # or class="video-title"
        matches = re.findall(r'<a\s+href="(/video/(\d+)/[^"]*)"[^>]*title="([^"]*)"', html)
        if not matches:
            # alternative pattern
            matches = re.findall(r'href="(/video/(\d+)/[^"]*)".*?title="([^"]*)"', html, re.DOTALL)
            
        # Find thumbnail matches
        # e.g., src="https://cdn.tokyo-motion.net/media/videos/tmb/..."
        
        # Parse video items from HTML containers
        # container pattern: <div class="col-..."> ... <a href="/video/12345/...">...
        video_blocks = re.findall(r'<div class="[^"]*col-[^"]*">(.*?)</div>\s*</div>', html, re.DOTALL)
        
        found_in_page = 0
        # Simple regex for video items on search page:
        # <a href="/video/ID/TITLE_SLUG">
        items = re.findall(r'<a\s+href="(/video/(\d+)/[^"]*)"\s+class="[^"]*">\s*<img\s+src="([^"]+)"[^>]*alt="([^"]*)"', html)
        if not items:
            items = re.findall(r'<a\s+href="(/video/(\d+)/[^"]*)"[^>]*>\s*<img\s+src="([^"]+)"[^>]*alt="([^"]*)"', html)

        print(f"Found {len(items)} items raw on page {page}")
        
        # Let's inspect links and video pages
        video_links = set(re.findall(r'/video/\d+/[a-zA-Z0-9_\-%]+', html))
        print(f"Unique video links found: {len(video_links)}")
        if not video_links:
            break
            
        for vlink in video_links:
            vid = re.search(r'/video/(\d+)', vlink).group(1)
            vurl = f"https://www.tokyomotion.net{vlink}"
            vhtml = fetch_html(vurl)
            
            # Find video title
            title_m = re.search(r'<title>(.*?)</title>', vhtml)
            title = title_m.group(1).replace(' - TOKYO Motion', '').strip() if title_m else f"Tokyomotion {vid}"
            
            # Find poster/thumbnail
            thumb_m = re.search(r'poster="([^"]+)"', vhtml) or re.search(r'property="og:image"\s+content="([^"]+)"', vhtml)
            thumb_url = thumb_m.group(1) if thumb_m else ""
            
            # Find mp4 URL: <source src="https://...mp4" ...> or player source
            mp4_m = re.search(r'<source\s+src="([^"]+\.mp4[^"]*)"', vhtml) or re.search(r'src:\s*["\']([^"\']+\.mp4[^"\']*)["\']', vhtml)
            mp4_url = mp4_m.group(1) if mp4_m else ""
            
            if mp4_url:
                print(f"Successfully extracted [{vid}]: {title} -> {mp4_url[:60]}...")
                videos.append({
                    "id": f"tm_{vid}",
                    "title": f"[Tokyomotion] {title}",
                    "videoUrl": mp4_url,
                    "thumbnailUrl": thumb_url
                })
                found_in_page += 1
            else:
                print(f"Failed to find mp4 URL for {vurl}")
                
        if found_in_page == 0:
            break
        page += 1
        if page > 5: # limit safeguard
            break

    print(f"Total Tokyomotion videos collected: {len(videos)}")
    with open('tokyo_videos.json', 'w', encoding='utf-8') as f:
        json.dump(videos, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    crawl()
