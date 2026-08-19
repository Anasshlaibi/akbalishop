import re

def escape_xml(text):
    if not text:
        return ""
    return (text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace('"', "&quot;")
                .replace("'", "&apos;"))

def map_category(cat):
    c = (cat or '').lower()
    if 'camera' in c or 'appareil' in c:
        return 'Cameras &amp; Optics &gt; Cameras &gt; Video Cameras'
    if 'obj' in c or 'lens' in c:
        return 'Cameras &amp; Optics &gt; Camera &amp; Optic Accessories &gt; Camera Lenses'
    if 'eclair' in c or 'light' in c:
        return 'Cameras &amp; Optics &gt; Photography &gt; Photo Studio &amp; Lighting &gt; Studio Lighting'
    if 'audio' in c or 'mic' in c or 'son' in c:
        return 'Electronics &gt; Audio &gt; Microphones'
    if 'stabilis' in c or 'gimbal' in c:
        return 'Cameras &amp; Optics &gt; Camera &amp; Optic Accessories &gt; Camera Tripods &amp; Monopods'
    return 'Cameras &amp; Optics &gt; Camera &amp; Optic Accessories'

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract products blocks
items = []
blocks = text.split('{')
for b in blocks:
    if 'id:' in b and 'name:' in b:
        id_m = re.search(r'id:\s*[\'"]([^\'"]+)[\'"]', b)
        name_m = re.search(r'name:\s*[\'"]([^\'"]+)[\'"]', b)
        brand_m = re.search(r'brand:\s*[\'"]([^\'"]+)[\'"]', b)
        price_m = re.search(r'price:\s*([0-9.]+)', b)
        cat_m = re.search(r'category:\s*[\'"]([^\'"]+)[\'"]', b)
        img_m = re.search(r'image:\s*[\'"]([^\'"]+)[\'"]', b)
        desc_m = re.search(r'description:\s*[\'"]([^\'"]+)[\'"]', b)
        occ_m = 'isOccasion: true' in b or "condition: 'used'" in b

        if id_m and name_m:
            p_id = id_m.group(1)
            p_name = name_m.group(1)
            p_brand = brand_m.group(1) if brand_m else 'AKABLISHOP'
            p_price = float(price_m.group(1)) if price_m else 100.0
            p_cat = cat_m.group(1) if cat_m else 'accessoires'
            p_img = img_m.group(1) if img_m else '/logo.png'
            p_desc = desc_m.group(1) if desc_m else f"Achetez {p_name} ({p_brand}) au meilleur prix au Maroc chez AKABLISHOP Marrakech."

            if not p_img.startswith('http'):
                p_img = f"https://akablishop.ma{'' if p_img.startswith('/') else '/'}{p_img}"

            title = f"{p_brand} {p_name} – Prix au Maroc | AKABLISHOP" if not p_name.lower().startswith(p_brand.lower()) else f"{p_name} – Prix au Maroc | AKABLISHOP"
            link = f"https://akablishop.ma/?product={p_id}"
            condition = "used" if occ_m else "new"
            g_cat = map_category(p_cat)

            items.append(f"""    <item>
      <g:id>{escape_xml(p_id)}</g:id>
      <g:title>{escape_xml(title)}</g:title>
      <g:description>{escape_xml(p_desc)}</g:description>
      <g:link>{escape_xml(link)}</g:link>
      <g:image_link>{escape_xml(p_img)}</g:image_link>
      <g:condition>{condition}</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>{p_price:.2f} MAD</g:price>
      <g:brand>{escape_xml(p_brand)}</g:brand>
      <g:google_product_category>{g_cat}</g:google_product_category>
    </item>""")

xml_content = f"""<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>AKABLISHOP – Flux Produits Google Merchant Center</title>
    <link>https://akablishop.ma</link>
    <description>Catalogue officiel des équipements audiovisuels et photo/vidéo AKABLISHOP Marrakech Maroc.</description>
{chr(10).join(items)}
  </channel>
</rss>"""

with open('public/google-merchant-feed.xml', 'w', encoding='utf-8') as f:
    f.write(xml_content)

print(f"Generated public/google-merchant-feed.xml with {len(items)} product items!")
