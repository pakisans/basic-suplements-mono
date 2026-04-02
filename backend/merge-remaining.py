"""
Merges remaining product groups that the generic script missed:
  - GLUTA PRO 500g + 1000g → 1 product, težina variants
  - OMEGA 3 PRO 120 SOFT GEL + 300 SOFT GEL → 1 product, pakovanje variants

Run: python3 merge-remaining.py
"""

import json
from copy import deepcopy

JSON_PATH = "./products_scraped.json"

with open(JSON_PATH, encoding="utf-8") as f:
    products = json.load(f)

print(f"Loaded {len(products)} products")

def find_and_remove(slugs: list[str]) -> list[dict]:
    """Remove products with given slugs from list, return them."""
    found = []
    remaining = []
    slug_set = set(slugs)
    for p in products:
        if p["slug"] in slug_set:
            found.append(p)
        else:
            remaining.append(p)
    products[:] = remaining
    return found


def merge_into_one(items: list[dict], merged_title: str, merged_slug: str) -> dict:
    """Merge list of products into one. Combines all variants and images."""
    base = deepcopy(max(items, key=lambda p: len(p.get("description") or "")))
    base["title"] = merged_title
    base["slug"] = merged_slug
    base["price"] = min(p["price"] for p in items)
    base["salePrice"] = None

    # Combine images (deduplicated, max 8)
    seen_imgs = set()
    imgs = []
    for p in items:
        for img in p.get("images", []):
            if img not in seen_imgs:
                seen_imgs.add(img)
                imgs.append(img)
    base["images"] = imgs[:8]

    # Combine all variants (deduplicated by type+name)
    seen_variants = set()
    combined = []
    for p in items:
        for v in p.get("variants", []):
            key = (v["type"], v["name"])
            if key not in seen_variants:
                seen_variants.add(key)
                combined.append(v)
    base["variants"] = combined

    return base


# ---------------------------------------------------------------------------
# 1. GLUTA PRO: merge 500g and 1000g
# ---------------------------------------------------------------------------
gluta_items = find_and_remove([
    "gluta-pro-500gr-glutamin-basic-supplements-summer-sale",
    "gluta-pro-1000g-basic-supplements",
])

if len(gluta_items) == 2:
    merged_gluta = merge_into_one(
        gluta_items,
        merged_title="GLUTA PRO – Glutamin BASIC SUPPLEMENTS",
        merged_slug="gluta-pro-glutamin-basic-supplements",
    )
    products.append(merged_gluta)
    print(f"  GLUTA PRO merged: {[v['name'] for v in merged_gluta['variants']]} variants")
else:
    print(f"  WARNING: Expected 2 GLUTA PRO items, found {len(gluta_items)}")
    for p in gluta_items:
        products.append(p)


# ---------------------------------------------------------------------------
# 2. OMEGA 3 PRO: merge 120 and 300 soft gel — use 'pakovanje' variant type
# ---------------------------------------------------------------------------
omega_items = find_and_remove([
    "omega-3-pro-basic-supplements",
    "omega-3-pro-300-soft-gel-basic-supplements",
])

if len(omega_items) == 2:
    # Add 'pakovanje' variants to each before merging
    for p in omega_items:
        title_upper = p["title"].upper()
        if "120" in title_upper:
            p["variants"].append({"name": "120 Soft Gel", "type": "pakovanje", "inStock": True})
        elif "300" in title_upper:
            p["variants"].append({"name": "300 Soft Gel", "type": "pakovanje", "inStock": True})

    merged_omega = merge_into_one(
        omega_items,
        merged_title="OMEGA 3 PRO Soft Gel - BASIC SUPPLEMENTS",
        merged_slug="omega-3-pro-soft-gel-basic-supplements",
    )
    products.append(merged_omega)
    print(f"  OMEGA 3 PRO merged: {[v['name'] for v in merged_omega['variants']]} variants")
else:
    print(f"  WARNING: Expected 2 OMEGA items, found {len(omega_items)}")
    for p in omega_items:
        products.append(p)


# ---------------------------------------------------------------------------
# Save
# ---------------------------------------------------------------------------
print(f"\nFinal product count: {len(products)}")

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"Saved to {JSON_PATH}")
