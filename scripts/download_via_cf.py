import urllib.request
import os

os.makedirs('public/thumbnails', exist_ok=True)

cf_worker = "https://kaori-proxy.younginpiniti.workers.dev"

tna_items = [
    ("tna_7165701", "https://img.tnaflix.com/a16:9q80w920/107/71/65/7165701/thumbs/10.jpg"),
    ("tna_7248216", "https://img.tnaflix.com/a16:9q80w920/107/72/48/7248216/thumbs/10.jpg"),
    ("tna_7495396", "https://img.tnaflix.com/a16:9q80w920/108/74/95/7495396/thumbs/10.jpg"),
    ("tna_7495365", "https://img.tnaflix.com/a16:9q80w920/109/74/95/7495365/thumbs/10.jpg"),
    ("tna_10583026", "https://img.tnaflix.com/a16:9q80w920/198/10/58/10583026/thumbs/10.jpg"),
    ("tna_7242213", "https://img.tnaflix.com/a16:9q80w920/107/72/42/7242213/thumbs/10.jpg"),
    ("tna_25345902", "https://img.tnaflix.com/a16:9q80w920/176/25/34/25345902/thumbs/10.jpg"),
    ("tna_6734943", "https://img.tnaflix.com/a16:9q80w920/105/67/34/6734943/thumbs/10.jpg"),
    ("tna_25486790", "https://img.tnaflix.com/a16:9q80w920/174/25/48/25486790/thumbs/10.jpg")
]

for vid, url in tna_items:
    filepath = f"public/thumbnails/{vid}.jpg"
    cf_url = f"{cf_worker}/?url={urllib.parse.quote(url)}"
    print(f"Downloading {vid} via CF Worker -> {filepath}...")
    try:
        urllib.request.urlretrieve(cf_url, filepath)
        print(f"✅ Success: {vid}")
    except Exception as e:
        print(f"❌ Failed {vid}: {e}")

