"""
Merges products that differ only by weight into a single product with 'težina' variants.
Also deduplicates exact title duplicates.

Input/output: products_scraped.json (in-place)

Run: python3 merge-weight-variants.py
"""

import json
import re
from collections import defaultdict

JSON_PATH = "./products_scraped.json"

# --------------------------------------------------------------------------
# Normalization helpers
# --------------------------------------------------------------------------

WEIGHT_RE = re.compile(
    r"[\s/\-]*\b(\d+(?:[,\.]\d+)?\s*(?:GR|G|KG|ML|L|CAPS?|CAPSULES?|TAB|TABLETS?|SACHET|VEGAN\s+CAPSULE|VEGAN\s+CAPSULES))\b",
    re.IGNORECASE,
)

BRAND_SUFFIX_RE = re.compile(
    r"\s*[\|\-–]\s*BASIC\s+SUPPLEMENTS\s*$", re.IGNORECASE
)


def normalize_weight(raw: str) -> str:
    """Normalize weight string: '2270GR' → '2270g', '2KG' → '2kg', etc."""
    w = raw.strip().upper()
    w = re.sub(r"\s+", "", w)
    w = w.replace("GR", "g").replace("KG", "kg").replace("ML", "ml")
    # lower remaining suffix
    w = re.sub(r"([A-Z]+)$", lambda m: m.group(1).lower(), w)
    return w


def extract_weights(title: str) -> list[str]:
    """Return list of weight strings found in title."""
    return [normalize_weight(m.group(1)) for m in WEIGHT_RE.finditer(title)]


def base_title(title: str) -> str:
    """Strip weight and brand suffix from title."""
    t = WEIGHT_RE.sub("", title)
    t = BRAND_SUFFIX_RE.sub("", t)
    t = re.sub(r"\s+", " ", t).strip(" -–|/")
    return t


# --------------------------------------------------------------------------
# Merge logic
# --------------------------------------------------------------------------

def merge_group(items: list[dict]) -> dict:
    """
    Given a list of products with the same base title,
    return a single merged product.
    - 'težina' variants are added for each weight.
    - All ukus variants are collected (deduplicated).
    - Images are combined (max 8 total).
    - Lowest price is used.
    - Description/highlights from item with best description.
    """
    # Sort by price ascending (smallest = cheapest = starting point)
    items_sorted = sorted(items, key=lambda p: p.get("price") or 9999999)

    # Use the merged base title (strip weight from whichever has cleanest title)
    clean_base = base_title(items_sorted[0]["title"])

    # Best description = longest one
    best = max(items, key=lambda p: len(p.get("description") or ""))

    # Collect all ukus variants (deduplicated by name)
    ukus_seen = {}
    for item in items:
        for v in item.get("variants", []):
            if v["type"] == "ukus" and v["name"] not in ukus_seen:
                ukus_seen[v["name"]] = v

    # Build težina variants from weights in titles
    tezina_variants = []
    tezina_seen = set()
    for item in items:
        weights = extract_weights(item["title"])
        if not weights:
            # Try to find weight in slug
            slug_weights = extract_weights(item.get("slug", ""))
            weights = slug_weights if slug_weights else []
        for w in weights:
            if w not in tezina_seen:
                tezina_seen.add(w)
                tezina_variants.append({"name": w, "type": "težina", "inStock": True})

    # All variants: ukus first, then težina
    all_variants = list(ukus_seen.values()) + tezina_variants

    # Combine images from all items (deduplicated, max 8)
    seen_imgs = set()
    combined_images = []
    for item in items:
        for img in item.get("images", []):
            if img not in seen_imgs:
                seen_imgs.add(img)
                combined_images.append(img)
    combined_images = combined_images[:8]

    # Build merged product
    merged = {
        "title": f"{clean_base} - BASIC SUPPLEMENTS",
        "slug": items_sorted[0]["slug"],  # use cheapest item's slug as canonical
        "url": items_sorted[0]["url"],
        "price": items_sorted[0].get("price") or 0,
        "salePrice": items_sorted[0].get("salePrice"),
        "categoryPath": best.get("categoryPath", []),
        "images": combined_images,
        "description": best.get("description", ""),
        "variants": all_variants,
        "highlights": best.get("highlights", []),
        "specifications": best.get("specifications", []),
        "_mergedFrom": [p["slug"] for p in items],
        "_weights": list(tezina_seen),
    }

    return merged


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------

def main():
    with open(JSON_PATH, encoding="utf-8") as f:
        products = json.load(f)

    print(f"Loaded {len(products)} products\n")

    # Step 1: Deduplicate exact same slugs (keep first)
    seen_slugs = set()
    deduped = []
    for p in products:
        if p["slug"] not in seen_slugs:
            seen_slugs.add(p["slug"])
            deduped.append(p)
        else:
            print(f"  Removed duplicate slug: {p['slug']}")

    print(f"After dedup: {len(deduped)} products\n")

    # Step 2: Group products by base title
    groups: dict[str, list[dict]] = defaultdict(list)
    for p in deduped:
        weights = extract_weights(p["title"])
        if weights:
            key = base_title(p["title"]).upper()
            groups[key].append(p)
        else:
            groups[f"__solo__{p['slug']}"].append(p)

    # Step 3: Process groups
    result = []
    merged_count = 0

    for key, items in groups.items():
        if key.startswith("__solo__"):
            result.append(items[0])
            continue

        if len(items) == 1:
            # Only one product with a weight in name — still add težina variant
            p = items[0]
            weights = extract_weights(p["title"])
            if weights:
                existing_types = {v["type"] for v in p.get("variants", [])}
                if "težina" not in existing_types:
                    w = weights[0]
                    p["variants"].append({"name": normalize_weight(w), "type": "težina", "inStock": True})
                    print(f"  Added težina '{normalize_weight(w)}' to: {p['title']}")
            result.append(p)
        else:
            # Merge group
            merged = merge_group(items)
            print(f"  Merged {len(items)} products → '{merged['title']}'")
            print(f"    Weights: {merged['_weights']}")
            print(f"    Variants: {[v['type'] for v in merged['variants']][:6]}...")
            result.append(merged)
            merged_count += 1

    print(f"\nMerged {merged_count} groups")
    print(f"Final product count: {len(result)} (was {len(products)})")

    # Step 4: Add 'težina' variant type to VARIANT_TYPE_DEFS in seed (just a reminder)
    tezina_products = [p for p in result if any(v["type"] == "težina" for v in p.get("variants", []))]
    all_tezina = set()
    for p in tezina_products:
        for v in p["variants"]:
            if v["type"] == "težina":
                all_tezina.add(v["name"])

    print(f"\nProducts with težina variants: {len(tezina_products)}")
    print(f"All težina options: {sorted(all_tezina)}")

    # Step 5: Save
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\nSaved to {JSON_PATH}")


if __name__ == "__main__":
    main()
