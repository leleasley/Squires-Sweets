#!/usr/bin/env python3
import yaml
from pathlib import Path

data = yaml.safe_load(Path(' _data/products.yml'.strip()).read_text())
products = data.get('products', {})
out_dir = Path('products')
out_dir.mkdir(exist_ok=True)

template = '''---
layout: product
title: "{title}"
product: {slug}
description: "{description}"
og_image: /image/mix1.png
---
'''

for slug, info in products.items():
    title = info.get('name')
    description = info.get('description', '')
    content = template.format(title=title.replace('"','\"'), slug=slug, description=description.replace('"','\"'))
    path = out_dir / f"{slug}.html"
    path.write_text(content)
    print('Wrote', path)
