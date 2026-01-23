# Scripts

This folder contains small helper scripts used to generate static product pages from `_data/products.yml`.

## Files

- `generate_product_pages.rb` — Ruby script that reads `_data/products.yml` and writes one static page per product under `products/`.
- `generate_product_pages.py` — Python version of the generator (requires PyYAML). This is provided as an alternative but is not used by default.

## Usage

### Ruby (recommended)

Requires Ruby (tested with Ruby 3.1+).

```bash
# From the repository root
ruby scripts/generate_product_pages.rb
```

This will create/update files under `products/` (e.g. `products/mini-dolphins.html`). Regenerate and commit whenever you update `_data/products.yml`.

### Python (optional)

Requires `pyyaml`.

```bash
# Install dependency (system or venv)
pip install pyyaml
python3 scripts/generate_product_pages.py
```

## Notes

- The Ruby script is the simplest approach for GitHub Pages compatibility (no plugins required).
- Running the scripts does not require `sudo` once Ruby/Python is installed; only system package installation needs elevated privileges.
- If you prefer not to store generated files in the repo, you can remove `/products/` and rely on the client-side `product.html` viewer.

## Removing or archiving

If you no longer need these scripts, you can either delete them or move them to `scripts/archive/` for future reference.

---
Generated and maintained by the dev tooling for the Squires Sweets site.