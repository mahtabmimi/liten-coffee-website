# Build tools (not part of the live site)

- `build_pages.py` regenerates all five pages (shared header and footer, page content).
  Run from the repo root: `python3 tools/build_pages.py .`
- `menuexp/` holds the Menus page content (`drinks.py`, `food.py`) and the script that builds it.
  `build_pages.py` runs it automatically.
- `preview/preview-edit.js` is the text editor used only in the private Claude preview.
