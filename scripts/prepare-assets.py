"""Non-generative resizing/compression of the owner-supplied photograph.

The photograph is intentionally kept intact in an editorial frame. No face,
background, skin, clothing, or body reconstruction is performed.
"""
from pathlib import Path
from shutil import copy2
import argparse
import json
import re
from PIL import Image, ImageDraw, ImageFont

parser = argparse.ArgumentParser()
parser.add_argument('--brand-only', action='store_true', help='Refresh logo/brand exports without changing portrait files')
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
source = root / 'source-assets' / 'portrait'
source.mkdir(parents=True, exist_ok=True)
original = next((path for path in [root/'image.png', source/'mohamed-updated.png', root/'image.jpeg', source/'mohamed-original.jpeg'] if path.exists()), None)
if original is None:
    raise FileNotFoundError('Supply an approved portrait in image.png or source-assets/portrait/')
if not args.brand_only:
    preserved = source / ('mohamed-updated.png' if original.suffix.lower()=='.png' else 'mohamed-original.jpeg')
    if original.resolve()!=preserved.resolve():
        copy2(original, preserved)
image = Image.open(original).convert('RGB')
output = root / 'public' / 'assets' / 'images'
output.mkdir(parents=True, exist_ok=True)
if not args.brand_only:
    output = output/'profile'
    output.mkdir(parents=True,exist_ok=True)
    for size, name in [(960, 'mohamed-portrait.webp'), (640, 'mohamed-portrait-640.webp'), (480, 'mohamed-portrait-480.webp')]:
        resized=image.copy()
        resized.thumbnail((size,size),Image.Resampling.LANCZOS)
        resized.save(output/name, 'WEBP', quality=88, method=6)

brand = root / 'public' / 'assets' / 'brand'
geometry = json.loads((root/'src'/'data'/'brand.json').read_text(encoding='utf-8'))
colors = dict(re.findall(r'--([\w-]+):\s*(#[\da-fA-F]{6})', (root/'src'/'styles'/'tokens.css').read_text(encoding='utf-8')))
mark = ''.join('<polygon points="'+' '.join(f'{x},{y}' for x,y in points)+'"/>' for points in geometry['polygons'])
svg_open = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+' '.join(map(str,geometry['viewBox']))+'" role="img" aria-label="Mohamed Monsef — MM logo"'
(brand/'monogram.svg').write_text(svg_open+' fill="currentColor">'+mark+'</svg>',encoding='utf-8')
for filename, color in [('logo-navy.svg',colors['ink']),('logo-white.svg',colors['surface']),('logo-cyan.svg',colors['brand'])]:
    (brand/filename).write_text(svg_open+f' fill="{color}">'+mark+'</svg>',encoding='utf-8')
(root/'public'/'favicon.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><rect width="72" height="72" rx="14" fill="{colors["deep"]}"/><g transform="translate(0 8)" fill="{colors["brand"]}">'+mark+'</g></svg>',encoding='utf-8')

def logo_image(width, color):
    # The same polygons drive SVG, inline markup and antialiased PNG exports.
    height = round(width*geometry['viewBox'][3]/geometry['viewBox'][2])
    scale = width*4/geometry['viewBox'][2]
    logo = Image.new('RGBA',(width*4,height*4),(0,0,0,0))
    painter = ImageDraw.Draw(logo)
    for points in geometry['polygons']:
        painter.polygon([(round(x*scale),round(y*scale)) for x,y in points],fill=color)
    return logo.resize((width,height),Image.Resampling.LANCZOS)

logo_image(1440,colors['ink']).save(brand/'logo-transparent.png',optimize=True)

canvas = Image.new('RGB', (1200,630), '#080F1C')
draw = ImageDraw.Draw(canvas)
font_path = root/'source-assets'/'fonts'/'space-grotesk-600.ttf'
font_path.parent.mkdir(parents=True,exist_ok=True)
download = root/'public'/'assets'/'fonts'/'space-grotesk-600.ttf'
if download.exists():
    copy2(download,font_path)
    download.unlink()
font = lambda size: ImageFont.truetype(str(font_path),size)
canvas.paste(logo_image(90,colors['brand']),(60,46),logo_image(90,colors['brand']))
draw.text((64,155),'Mohamed Monsef',font=font(47),fill='#F8FAFC')
draw.text((64,240),'Smarter ads.',font=font(43),fill='#F8FAFC')
draw.text((64,300),'Stronger creatives.',font=font(43),fill='#22D3EE')
draw.line((64,440,640,440),fill='#334155',width=1)
draw.text((64,475),'Performance Media Buyer',font=font(22),fill='#F8FAFC')
draw.text((64,512),'& AI Creative Specialist',font=font(22),fill='#94A3B8')
portrait=image.resize((440,440),Image.Resampling.LANCZOS)
canvas.paste(portrait,(720,90))
draw.text((720,550),'STRATEGY MEETS CREATIVE',font=font(15),fill='#94A3B8')
canvas.save(brand/'social-preview.png',optimize=True)

board=Image.new('RGB',(1440,960),colors['bg'])
painter=ImageDraw.Draw(board)
painter.rectangle((960,0,1440,960),fill=colors['deep'])
painter.text((72,64),'MOHAMED MONSEF',font=font(20),fill=colors['ink'])
painter.text((72,96),'PERSONAL BRAND / MM',font=font(12),fill=colors['text-secondary'])
board.paste(logo_image(236,colors['ink']),(64,305),logo_image(236,colors['ink']))
painter.text((330,330),'MOHAMED',font=font(58),fill=colors['ink'])
painter.text((330,396),'MONSEF',font=font(58),fill=colors['ink'])
painter.line((72,708,888,708),fill=colors['line'],width=1)
painter.text((72,745),'Clear geometry. A confident signature.',font=font(22),fill=colors['ink'])
painter.text((72,794),'SVG / TRANSPARENT PNG / LIGHT + DARK',font=font(13),fill=colors['text-secondary'])
board.paste(logo_image(320,colors['brand']),(1040,228),logo_image(320,colors['brand']))
painter.text((1040,720),'SMALL-SIZE APPLICATION',font=font(12),fill=colors['muted'])
x=1040
for size in [24,32,48,64]:
    logo=logo_image(size,colors['light'])
    board.paste(logo,(x,768),logo)
    x+=size+24
board.save(brand/'logo-preview.png',optimize=True)
print('Brand refreshed from brand.json: SVG color variants, transparent PNG, favicon, preview board and social image.')
