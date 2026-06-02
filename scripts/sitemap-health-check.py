#!/usr/bin/env python3
"""
Sitemap Health Checker + Service Statistics Dashboard Generator
Free tool: zero external dependencies, uses only stdlib.
Scans all service pages from sitemap and reports:
- HTTP status (200/404/500/etc)
- Page load time
- Content size
- Service statistics per category
- Broken link detection
"""
import json, os, re, time, urllib.request, urllib.error, hashlib
from datetime import datetime, timezone
from pathlib import Path

SITE_URL = "https://zion-support.github.io"
SITEMAP_PATH = Path(__file__).parent.parent / "out" / "sitemap.xml"
SERVICE_DATA_PATH = Path(__file__).parent.parent / "app" / "data" / "servicesData.ts"
REPORT_PATH = Path(__file__).parent.parent / "app" / "data" / "healthReport.json"
STATS_PATH = Path(__file__).parent.parent / "app" / "data" / "serviceStats.json"


def fetch_url(url, timeout=15):
    """Fetch URL and return status, size, load_time."""
    start = time.time()
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "ZionHealthCheck/1.0"})
        resp = urllib.request.urlopen(req, timeout=timeout)
        body = resp.read()
        load_time = time.time() - start
        return {
            "url": url,
            "status": resp.status,
            "size_bytes": len(body),
            "load_time_ms": round(load_time * 1000),
            "ok": resp.status == 200,
        }
    except urllib.error.HTTPError as e:
        load_time = time.time() - start
        return {
            "url": url,
            "status": e.code,
            "size_bytes": 0,
            "load_time_ms": round(load_time * 1000),
            "ok": False,
        }
    except Exception as e:
        load_time = time.time() - start
        return {
            "url": url,
            "status": 0,
            "size_bytes": 0,
            "load_time_ms": round(load_time * 1000),
            "ok": False,
            "error": str(e)[:100],
        }


def parse_sitemap():
    """Parse sitemap.xml for all URLs."""
    urls = []
    if SITEMAP_PATH.exists():
        content = SITEMAP_PATH.read_text()
        for m in re.finditer(r'<loc>(.*?)</loc>', content):
            urls.append(m.group(1))
    return urls


def parse_service_stats():
    """Parse servicesData.ts to extract statistics."""
    stats = {
        "total_services": 0,
        "by_category": {},
        "by_stage": {},
        "by_industry": {},
        "price_ranges": {"starter": [], "pro": [], "enterprise": []},
        "features_per_service": [],
        "avg_rating": 0,
        "total_features": 0,
        "total_benefits": 0,
        "services_with_pricing": 0,
        "services_with_rating": 0,
    }

    if not SERVICE_DATA_PATH.exists():
        return stats

    content = SERVICE_DATA_PATH.read_text()

    # Count total services by looking for id: patterns in category arrays
    category_matches = re.findall(r"category:\s*['\"](\w[\w-]*)['\"]", content)
    stats["total_services"] = len(category_matches)

    # Count per category
    from collections import Counter
    cat_counts = Counter(category_matches)
    stats["by_category"] = dict(cat_counts.most_common(20))

    # Count stages
    stage_matches = re.findall(r"stage:\s*['\"](\w[\w-]*)['\"]", content)
    stats["by_stage"] = dict(Counter(stage_matches).most_common(10))

    # Count industries
    industry_matches = re.findall(r"industry:\s*['\"]([^'\"]+)['\"]", content)
    stats["by_industry"] = dict(Counter(industry_matches).most_common(15))

    # Count features
    features_matches = re.findall(r"features:\s*\[", content)
    stats["total_features"] = len(features_matches)

    # Count benefits
    benefits_matches = re.findall(r"benefits:\s*\[", content)
    stats["total_benefits"] = len(benefits_matches)

    # Services with pricing
    pricing_matches = re.findall(r"pricing:\s*\{", content)
    stats["services_with_pricing"] = len(pricing_matches)

    # Services with ratings
    rating_matches = re.findall(r"rating:\s*([\d.]+)", content)
    stats["services_with_rating"] = len(rating_matches)
    if rating_matches:
        ratings = [float(r) for r in rating_matches]
        stats["avg_rating"] = round(sum(ratings) / len(ratings), 2)

    return stats


def run_health_check(sample_size=0):
    """Run full health check. sample_size=0 means all URLs."""
    print(f"🔍 Sitemap Health Checker v1.0")
    print(f"   Site: {SITE_URL}")

    # Parse sitemap
    urls = parse_sitemap()
    if not urls:
        print("⚠️  No sitemap found. Generating URL list from service data...")
        # Generate URLs from service data
        if SERVICE_DATA_PATH.exists():
            content = SERVICE_DATA_PATH.read_text()
            service_ids = re.findall(r"id:\s*['\"]([^'\"]+)['\"]", content)
            urls = [f"{SITE_URL}/services/{sid}/" for sid in service_ids]
            # Add key pages
            urls.extend([SITE_URL + "/", SITE_URL + "/services/"])

    if sample_size > 0:
        urls = urls[:sample_size]

    print(f"   URLs to check: {len(urls)}")

    # Check each URL
    results = []
    ok_count = 0
    fail_count = 0
    total_time = 0

    for i, url in enumerate(urls):
        result = fetch_url(url)
        results.append(result)

        if result["ok"]:
            ok_count += 1
            icon = "✅"
        else:
            fail_count += 1
            icon = "❌"

        total_time += result["load_time_ms"]

        if (i + 1) % 50 == 0 or fail_count > 0 and not result["ok"]:
            print(f"   [{i+1}/{len(urls)}] {icon} {result['status']} — {url[-50:]} ({result['load_time_ms']}ms)")

    # Summary
    avg_time = round(total_time / len(urls)) if urls else 0
    ok_pct = round(ok_count / len(urls) * 100, 1) if urls else 0

    # Get service stats
    service_stats = parse_service_stats()

    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "site": SITE_URL,
        "summary": {
            "total_urls": len(urls),
            "ok": ok_count,
            "failed": fail_count,
            "ok_percentage": ok_pct,
            "avg_load_time_ms": avg_time,
            "total_load_time_ms": total_time,
        },
        "service_stats": service_stats,
        "failures": [r for r in results if not r["ok"]],
        "slow_pages": sorted(results, key=lambda r: r["load_time_ms"], reverse=True)[:10],
        "results": results,
    }

    # Save report
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(json.dumps(report, indent=2))

    # Save stats separately
    STATS_PATH.write_text(json.dumps(service_stats, indent=2))

    # Print summary
    print(f"\n{'='*60}")
    print(f"  HEALTH CHECK RESULTS")
    print(f"{'='*60}")
    print(f"  Total URLs checked: {len(urls)}")
    print(f"  ✅ OK: {ok_count} ({ok_pct}%)")
    print(f"  ❌ Failed: {fail_count}")
    print(f"  ⏱️  Avg load time: {avg_time}ms")
    print(f"\n  Service Statistics:")
    print(f"  Total services: {service_stats['total_services']}")
    print(f"  Categories: {len(service_stats['by_category'])}")
    print(f"  Industries: {len(service_stats['by_industry'])}")
    print(f"  Avg rating: {service_stats['avg_rating']}/5.0")
    if service_stats['by_category']:
        print(f"  Top categories:")
        for cat, count in list(service_stats['by_category'].items())[:5]:
            print(f"    {cat}: {count}")

    if fail_count > 0:
        print(f"\n  ❌ BROKEN LINKS:")
        for f in report["failures"][:10]:
            print(f"    [{f['status']}] {f['url'][-60:]}")

    print(f"\n  Report saved to: {REPORT_PATH}")
    return report


if __name__ == "__main__":
    import sys
    sample = 0
    if len(sys.argv) > 1:
        try:
            sample = int(sys.argv[1])
        except ValueError:
            pass
    run_health_check(sample)
