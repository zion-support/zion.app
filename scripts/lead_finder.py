#!/usr/bin/env python3
"""
Lead Finding Engine v3 for Zion Tech Group
Uses DuckDuckGo HTML (POST) + Bing + Google scraping with retries.
Multi-source search with concurrent workers, email extraction, and AI-fit scoring.
"""
import json
import os
import re
import sys
import time
import argparse
import random
import subprocess
import urllib.request
import urllib.parse
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone

# ─── Configuration ────────────────────────────────────────────────────────────

ZION_EMAIL = "kleber@ziontechgroup.com"
ZION_PHONE = "+1 302 464 0950"
OUTPUT_DIR = "/Users/klebergarciaalcatrao/data/leads"

# Each industry has multiple search queries for broad coverage.
# "universal" queries are tagged to every industry at processing time.
SEARCH_QUERIES = [
    # ── Healthcare IT ──
    {"query": "top Healthcare IT companies 2026", "industry": "Healthcare IT",
     "pain_points": ["EHR integration", "patient analytics", "HIPAA AI", "clinical decision support"]},
    {"query": "Healthcare IT companies seeking AI solutions", "industry": "Healthcare IT",
     "pain_points": ["AI diagnostics", "predictive health", "automated workflows"]},
    {"query": "healthcare technology companies contact information", "industry": "Healthcare IT",
     "pain_points": ["digital health", "telehealth AI", "interoperability"]},

    # ── FinTech ──
    {"query": "top FinTech companies 2026", "industry": "FinTech",
     "pain_points": ["fraud detection", "credit scoring", "compliance AI", "AML"]},
    {"query": "FinTech companies seeking AI solutions", "industry": "FinTech",
     "pain_points": ["risk assessment", "algorithmic trading", "chatbot banking"]},
    {"query": "financial technology companies contact", "industry": "FinTech",
     "pain_points": ["payment AI", "regtech", "lending automation"]},

    # ── Retail / E-commerce ──
    {"query": "top Retail E-commerce companies 2026", "industry": "Retail/E-commerce",
     "pain_points": ["recommendation engine", "churn prediction", "dynamic pricing", "inventory AI"]},
    {"query": "Retail E-commerce companies seeking AI solutions", "industry": "Retail/E-commerce",
     "pain_points": ["personalization", "demand forecasting", "visual search"]},
    {"query": "ecommerce technology companies contact", "industry": "Retail/E-commerce",
     "pain_points": ["conversion optimization", "supply chain AI", "customer segmentation"]},

    # ── EdTech ──
    {"query": "top EdTech companies 2026", "industry": "EdTech",
     "pain_points": ["personalized learning", "automated grading", "engagement AI", "tutoring AI"]},
    {"query": "EdTech companies seeking AI solutions", "industry": "EdTech",
     "pain_points": ["adaptive learning", "content generation", "student analytics"]},
    {"query": "education technology companies contact", "industry": "EdTech",
     "pain_points": ["learning management", "AI tutor", "assessment automation"]},

    # ── Logistics ──
    {"query": "top Logistics companies 2026", "industry": "Logistics",
     "pain_points": ["route optimization", "demand forecasting", "predictive maintenance", "warehouse AI"]},
    {"query": "Logistics companies seeking AI solutions", "industry": "Logistics",
     "pain_points": ["fleet management", "last-mile optimization", "inventory prediction"]},
    {"query": "logistics technology companies contact", "industry": "Logistics",
     "pain_points": ["supply chain visibility", "automation", "tracking AI"]},

    # ── Manufacturing ──
    {"query": "top Manufacturing companies 2026 Industry 4.0", "industry": "Manufacturing",
     "pain_points": ["predictive maintenance", "quality AI", "digital twin", "process automation"]},
    {"query": "Manufacturing companies seeking AI solutions", "industry": "Manufacturing",
     "pain_points": ["smart factory", "defect detection", "production optimization"]},
    {"query": "manufacturing technology companies contact", "industry": "Manufacturing",
     "pain_points": ["IoT AI", "robotics", "supply chain optimization"]},

    # ── Insurance ──
    {"query": "top Insurance companies 2026", "industry": "Insurance",
     "pain_points": ["claims automation", "risk scoring", "fraud detection", "underwriting AI"]},
    {"query": "Insurance companies seeking AI solutions", "industry": "Insurance",
     "pain_points": ["policy automation", "customer service AI", "actuarial AI"]},
    {"query": "insurance technology companies contact", "industry": "Insurance",
     "pain_points": ["insurtech", "claims processing", "risk modeling"]},

    # ── Legal Tech ──
    {"query": "top Legal Tech companies 2026", "industry": "Legal Tech",
     "pain_points": ["contract analysis", "legal research AI", "compliance", "ediscovery"]},
    {"query": "Legal Tech companies seeking AI solutions", "industry": "Legal Tech",
     "pain_points": ["document review", "case prediction", "regulatory AI"]},
    {"query": "legal technology companies contact", "industry": "Legal Tech",
     "pain_points": ["contract management", "legal automation", "AI paralegal"]},

    # ── Real Estate Tech ──
    {"query": "top Real Estate Tech PropTech companies 2026", "industry": "Real Estate Tech",
     "pain_points": ["property valuation AI", "market prediction", "virtual tours", "lead scoring"]},
    {"query": "PropTech companies seeking AI solutions", "industry": "Real Estate Tech",
     "pain_points": ["pricing algorithm", "tenant screening", "investment AI"]},
    {"query": "real estate technology companies contact", "industry": "Real Estate Tech",
     "pain_points": ["property management AI", "smart buildings", "valuation automation"]},

    # ── Cybersecurity ──
    {"query": "top Cybersecurity companies 2026", "industry": "Cybersecurity",
     "pain_points": ["threat detection", "SIEM AI", "zero trust", "endpoint AI"]},
    {"query": "Cybersecurity companies seeking AI solutions", "industry": "Cybersecurity",
     "pain_points": ["SOC automation", "vulnerability AI", "incident response"]},
    {"query": "cybersecurity technology companies contact", "industry": "Cybersecurity",
     "pain_points": ["threat intelligence", "identity AI", "cloud security"]},
]

# Rotating User-Agents to reduce blocking
USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
]


def _random_ua():
    return random.choice(USER_AGENTS)


# ─── HTTP helpers ─────────────────────────────────────────────────────────────

def _fetch_url(url, method="GET", data=None, headers=None, timeout=20):
    """Generic URL fetcher with custom headers. Returns (status, body)."""
    hdrs = {
        "User-Agent": _random_ua(),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "identity",
    }
    if headers:
        hdrs.update(headers)

    if method == "POST" and data:
        body = urllib.parse.urlencode(data).encode("utf-8")
        req = urllib.request.Request(url, data=body, headers=hdrs, method="POST")
    else:
        req = urllib.request.Request(url, headers=hdrs)

    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.read().decode("utf-8", errors="replace")
    except Exception:
        return 0, ""


# ─── DuckDuckGo HTML (POST) ──────────────────────────────────────────────────

def ddg_html_search(query, max_results=10, retries=3):
    """
    POST to https://html.duckduckgo.com/html/ and parse results.
    Returns list of {url, title, snippet}.
    """
    url = "https://html.duckduckgo.com/html/"
    data = {"q": query, "kl": "us-en"}

    for attempt in range(1, retries + 1):
        try:
            # Small human-like delay
            time.sleep(random.uniform(0.5, 1.5))

            hdrs = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Origin": "https://html.duckduckgo.com",
                "Referer": "https://html.duckduckgo.com/",
            }
            status, html = _fetch_url(url, method="POST", data=data, headers=hdrs)
            if not html or len(html) < 500:
                raise IOError(f"DDG empty response (status={status})")
            return _parse_ddg_html(html, max_results)
        except Exception as e:
            if attempt < retries:
                wait = 2 * attempt + random.uniform(0, 1)
                print(f"    [DDG retry {attempt}/{retries}] {e} — waiting {wait:.1f}s")
                time.sleep(wait)
            else:
                print(f"    [DDG FAIL] {query[:60]} → {e}")
                return []


def _parse_ddg_html(html, max_results):
    """Parse DuckDuckGo HTML results for links and snippets."""
    results = []

    # Result blocks: each <div class="result"> ... </div>
    # Links: <a class="result__a" href="...">title</a>
    # Snippets: <a class="result__snippet">text</a>
    link_re = re.compile(
        r'<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>',
        re.DOTALL,
    )
    snippet_re = re.compile(
        r'<a[^>]*class="result__snippet"[^>]*>(.*?)</a>',
        re.DOTALL,
    )

    links = link_re.findall(html)[:max_results]
    snippets = snippet_re.findall(html)[:max_results]

    for i, (raw_url, raw_title) in enumerate(links):
        title = _strip_tags(raw_title).strip()
        # DDG redirects: //duckduckgo.com/l/?uddg=<encoded_url>
        real_url = _extract_ddg_real_url(raw_url)
        snippet = _strip_tags(snippets[i]).strip() if i < len(snippets) else ""
        if title and real_url:
            results.append({"url": real_url, "title": title, "snippet": snippet})

    return results


def _extract_ddg_real_url(raw_url):
    """Extract the real URL from DuckDuckGo redirect links."""
    # Format: //duckduckgo.com/l/?uddg=<url>&...
    if raw_url.startswith("//duckduckgo.com/l/"):
        m = re.search(r"[?&]uddg=([^&]+)", raw_url)
        if m:
            return urllib.parse.unquote(m.group(1))
    if raw_url.startswith("http"):
        return raw_url
    return raw_url if raw_url.startswith("/") else ""


# ─── Bing scraper ─────────────────────────────────────────────────────────────

def bing_search(query, max_results=10, retries=2):
    """
    GET https://www.bing.com/search?q=... and parse results.
    Fallback if DDG returns 0 results.
    """
    url = f"https://www.bing.com/search?q={urllib.parse.quote(query)}"
    for attempt in range(1, retries + 1):
        try:
            time.sleep(random.uniform(0.5, 1.2))
            status, html = _fetch_url(url, timeout=20)
            if not html or len(html) < 500:
                raise IOError(f"Bing empty response (status={status})")
            return _parse_bing_html(html, max_results)
        except Exception as e:
            if attempt < retries:
                wait = 2 * attempt + random.uniform(0, 1)
                print(f"    [BING retry {attempt}/{retries}] {e} — waiting {wait:.1f}s")
                time.sleep(wait)
            else:
                print(f"    [BING FAIL] {query[:60]} → {e}")
                return []


def _parse_bing_html(html, max_results):
    """Parse Bing search results from <li class="b_algo"> blocks."""
    results = []
    # Extract result items
    algo_re = re.compile(
        r'<li\s+class="b_algo">(.*?)</li>',
        re.DOTALL,
    )
    items = algo_re.findall(html)[:max_results]

    # Link patterns
    title_re = re.compile(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', re.DOTALL)
    snippet_re = re.compile(
        r'<p[^>]*>(.*?)</p>',
        re.DOTALL,
    )

    for item in items:
        link_m = title_re.findall(item)
        href, title = "", ""
        for h, t in link_m:
            if t.strip():
                href = h
                title = _strip_tags(t)
                break
        if not href or not title:
            continue

        snippet = ""
        snippet_m = snippet_re.search(item)
        if snippet_m:
            snippet = _strip_tags(snippet_m.group(1)).strip()

        results.append({"url": href, "title": title.strip(), "snippet": snippet})

    return results


# ─── Google scraper (via curl subprocess) ─────────────────────────────────────

def google_search(query, max_results=10, retries=2):
    """
    Use curl subprocess to scrape Google search results.
    Last-resort fallback.
    """
    for attempt in range(1, retries + 1):
        try:
            time.sleep(random.uniform(1.0, 2.0))  # Be extra polite to Google

            encoded = urllib.parse.quote(query)
            url = f"https://www.google.com/search?q={encoded}&num={max_results}&hl=en"

            result = subprocess.run(
                [
                    "curl", "-s", "-L",
                    "--max-time", "15",
                    "-A", _random_ua(),
                    "-H", "Accept-Language: en-US,en;q=0.9",
                    url,
                ],
                capture_output=True,
                text=True,
                timeout=20,
            )
            if result.returncode != 0:
                raise RuntimeError(f"curl exit {result.returncode}: {result.stderr[:200]}")

            html = result.stdout
            if not html or len(html) < 200:
                raise RuntimeError("Empty or too-short response from Google")

            return _parse_google_html(html, max_results)
        except Exception as e:
            if attempt < retries:
                wait = 3 * attempt + random.uniform(0, 2)
                print(f"    [GOOG retry {attempt}/{retries}] {e} — waiting {wait:.1f}s")
                time.sleep(wait)
            else:
                print(f"    [GOOG FAIL] {query[:60]} → {e}")
                return []


def _parse_google_html(html, max_results):
    """Parse Google search result blocks for title, URL, snippet."""
    results = []

    # Google result blocks: <div class="g"> or <div data-sokoban-container>
    # Main title link: <a href="http..."><h3>...</h3></a>
    # Snippet: <div class="VwiC3b"> or <span class="aCOpRe">

    # First try modern Google layout
    link_re = re.compile(
        r'<a\s+href="(https?://[^"]+)"[^>]*>.*?<h3[^>]*>(.*?)</h3>',
        re.DOTALL,
    )
    links = link_re.findall(html)[:max_results]

    # Snippet patterns
    snippet_re = re.compile(r'<div class="VwiC3b[^"]*">(.*?)</div>', re.DOTALL)
    alt_snippet_re = re.compile(r'<span class="aCOpRe">(.*?)</span>', re.DOTALL)

    snippets_raw = snippet_re.findall(html)
    if not snippets_raw:
        snippets_raw = alt_snippet_re.findall(html)
    snippets_raw = snippets_raw[:max_results]

    for i, (href, raw_title) in enumerate(links):
        # Skip Google cache/self links
        if "google.com" in href and "/search?" in href:
            continue
        title = _strip_tags(raw_title).strip()
        if not title:
            continue
        snippet = _strip_tags(snippets_raw[i]).strip() if i < len(snippets_raw) else ""
        results.append({"url": href, "title": title, "snippet":snippet})

    return results


# ─── Multi-source search with fallback ────────────────────────────────────────

def search_with_fallback(query, max_results=10):
    """
    Try DDG → Bing → Google in order. Return first non-empty result set.
    """
    # DuckDuckGo HTML POST
    results = ddg_html_search(query, max_results)
    if results:
        for r in results:
            r["_source"] = "ddg"
        return results

    # Bing fallback
    results = bing_search(query, max_results)
    if results:
        for r in results:
            r["_source"] = "bing"
        return results

    # Google curl last resort
    results = google_search(query, max_results)
    if results:
        for r in results:
            r["_source"] = "google"
        return results

    return []


# ─── Parsing helpers ──────────────────────────────────────────────────────────

def _strip_tags(html_str):
    """Remove HTML tags and normalize whitespace."""
    text = re.sub(r'<[^>]+>', '', html_str)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_domain(url):
    """Extract clean domain from URL."""
    try:
        parsed = urllib.parse.urlparse(url)
        domain = parsed.netloc.replace("www.", "").strip("/")
        return domain
    except Exception:
        return ""


def extract_emails_from_snippet(snippet):
    """Extract email-like patterns visible in snippets."""
    email_re = re.compile(r'[\w.+-]+@[\w-]+\.[\w.]+')
    return email_re.findall(snippet)


def extract_email_from_url(url):
    """Try to construct a plausible contact email from domain."""
    domain = extract_domain(url)
    if domain and "." in domain:
        # Don't fabricate — only return if we found one in text
        return ""
    return ""


def extract_company_from_title(title):
    """
    Extract company name from search result title.
    Tries separators first, then falls back to first meaningful words.
    """
    title = title.strip()
    # Common separators used in search titles
    for sep in [" - ", " | ", " · ", " — ", " – ", ": "]:
        if sep in title:
            candidate = title.split(sep)[0].strip()
            if len(candidate) >= 3:
                return candidate
    # Fallback: first 4 words max
    words = title.split()
    if len(words) > 5:
        return " ".join(words[:4])
    return title


# ─── Scoring ──────────────────────────────────────────────────────────────────

INDUSTRY_SIGNALS = {
    "Healthcare IT": ["healthcare", "health", "hospital", "clinical", "patient", "ehr", "hipaa", "medical", "pharma", "biotech", "telehealth", "emr"],
    "FinTech": ["fintech", "banking", "financial", "payment", "fraud", "credit", "trading", "lending", "remittance", "crypto", "insurtech"],
    "Retail/E-commerce": ["retail", "ecommerce", "e-commerce", "shop", "store", "product", "customer", "marketplace", "omnichannel", "shopify", "woocommerce"],
    "EdTech": ["edtech", "education", "learning", "student", "course", "training", "school", "university", "elearning", "lms", "mooc"],
    "Logistics": ["logistics", "supply chain", "shipping", "warehouse", "fleet", "delivery", "freight", "transport", "3pl", "fulfillment"],
    "Manufacturing": ["manufacturing", "factory", "production", "industrial", "iot", "sensor", "automation", "cnc", "plc", "mes"],
    "Insurance": ["insurance", "claims", "policy", "underwriting", "actuarial", "risk", "life insurance", "property insurance", "reinsurance"],
    "Legal Tech": ["legal", "law", "contract", "compliance", "regulatory", "attorney", "lawyer", "ediscovery", "litigation", "paralegal"],
    "Real Estate Tech": ["real estate", "property", "proptech", "housing", "mortgage", "rental", "realtor", "mls", "construction", "building"],
    "Cybersecurity": ["security", "cyber", "threat", "siem", "firewall", "detection", "zero trust", "pentest", "ransomware", "infosec", "soc", "endpoint"],
}

AI_KEYWORDS = ["ai", "artificial intelligence", "machine learning", "ml", "automation", "intelligent",
               "neural", "deep learning", "nlp", "computer vision", "generative", "llm", "predictive",
               "data science", "algorithm", "robotics", "rpa", "automate"]

CONTACT_KEYWORDS = ["contact", "demo", "trial", "partner", "vendor", "get started", "learn more",
                    "request a quote", "book a call", "schedule", "free consultation", "sales"]


def score_lead(result, industry, pain_points):
    """Score a lead 0-100 based on AI-fit signals."""
    score = 20  # base
    title_lower = result.get("title", "").lower()
    snippet_lower = result.get("snippet", "").lower()
    combined = title_lower + " " + snippet_lower

    # AI keyword bonus
    ai_hits = sum(1 for k in AI_KEYWORDS if k in combined)
    score += min(ai_hits * 5, 25)

    # Contact intent bonus
    if any(k in combined for k in CONTACT_KEYWORDS):
        score += 10

    # Industry signal bonus
    sigs = INDUSTRY_SIGNALS.get(industry, [])
    if any(s in combined for s in sigs):
        score += 15

    # Pain point bonus
    if any(p.lower() in combined for p in pain_points):
        score += 10

    # Result source bonus (DDG tends to have richer results)
    if result.get("_source") == "ddg":
        score += 5

    # Negative signals (directories, Wikipedia, how-tos)
    negative = ["wikipedia", "dictionary", "definition", "what is ", "how to ", "tutorial",
                "blog post", "youtube", "reddit.com", "quora.com", "stackoverflow"]
    neg_hits = sum(1 for n in negative if n in combined)
    score -= neg_hits * 10

    return max(0, min(100, score))


# ─── Query processing ─────────────────────────────────────────────────────────

def process_query(q, max_results):
    """
    Run search with fallback for a single query, return list of lead dicts.
    Raw leads are trimmed to max_results.
    """
    industry = q["industry"]
    pain_points = q["pain_points"]

    print(f"  [SEARCH] {q['query']}  (industry={industry})")
    results = search_with_fallback(q["query"], max_results)
    if not results:
        print(f"    → 0 results (all sources exhausted)")
        return []

    leads = []
    for r in results:
        company = extract_company_from_title(r["title"])
        domain = extract_domain(r["url"])
        if not company or len(company) < 3:
            continue

        emails = extract_emails_from_snippet(r.get("snippet", ""))
        score = score_lead(r, industry, pain_points)

        lead = {
            "company": company,
            "website": r["url"],
            "domain": domain,
            "industry": industry,
            "pain_points": pain_points,
            "score": score,
            "emails": emails[:3],  # max 3 plausible emails
            "source_query": q["query"],
            "search_source": r.get("_source", "unknown"),
            "snippet": r.get("snippet", "")[:300],
            "date_found": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        }
        leads.append(lead)

    print(f"    → {len(leads)} leads  (via {results[0].get('_source', '?')})")
    return leads


# ─── Google Company Directory search (bonus source) ───────────────────────────

def search_company_directory(industry, max_results=5):
    """
    Bonus search: '[industry] companies list 2026 site:crunchbase.com OR site:linkedin.com/company'
    Returns leads from structured directory pages.
    """
    queries = [
        f"top {industry} companies 2026 site:crunchbase.com OR site:g2.com OR site:clutch.co",
        f"{industry} companies list founders CEO email",
        f"best {industry} startups 2026 funding",
    ]
    all_leads = []
    for q in queries:
        results = ddg_html_search(q, max_results)
        if not results:
            results = bing_search(q, max_results)
        for r in results:
            company = extract_company_from_title(r["title"])
            domain = extract_domain(r["url"])
            if not company or len(company) < 3:
                continue
            emails = extract_emails_from_snippet(r.get("snippet", ""))
            all_leads.append({
                "company": company,
                "website": r["url"],
                "domain": domain,
                "industry": industry,
                "pain_points": [],
                "score": 40,  # directory leads start at 40
                "emails": emails[:3],
                "source_query": q,
                "search_source": "directory",
                "snippet": r.get("snippet", "")[:300],
                "date_found": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
            })
    return all_leads


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Lead Finding Engine v3 — DDG + Bing + Google multi-source",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 lead_finder.py --max-results 10
  python3 lead_finder.py --force --max-results 15 --workers 4
  python3 lead_finder.py --max-results 5 --output-dir ./leads
        """,
    )
    parser.add_argument("--max-results", type=int, default=8,
                        help="Max results to keep per query (default: 8)")
    parser.add_argument("--output-dir", default=OUTPUT_DIR,
                        help=f"Output directory (default: {OUTPUT_DIR})")
    parser.add_argument("--workers", type=int, default=4,
                        help="Number of concurrent workers (default: 4)")
    parser.add_argument("--force", action="store_true",
                        help="Force re-run even if already run today")
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    output_file = os.path.join(args.output_dir, f"prospects_{today}.json")
    state_file = os.path.join(args.output_dir, ".lead_finder_state.json")

    # ── Check if already run today ──
    already_run = False
    if os.path.exists(output_file) and not args.force:
        try:
            with open(output_file) as f:
                existing = json.load(f)
            if existing.get("generated", "").startswith(today):
                already_run = True
                print(f"[SKIP] Output already exists for {today}: {output_file}")
                print(f"       Use --force to re-run.")
                # Still print summary
                print(f"\n{'=' * 60}")
                print(f"  EXISTING RESULTS SUMMARY")
                print(f"{'=' * 60}")
                print(f"  Unique leads:     {existing.get('total_unique', 0)}")
                print(f"  High score (80+): {existing.get('high_score', 0)}")
                print(f"  Medium (50-79):   {existing.get('medium_score', 0)}")
                print(f"  Output: {output_file}")
                print(f"{'=' * 60}")
                if existing.get("leads"):
                    print(f"\n  TOP 10 LEADS:")
                    for i, l in enumerate(existing["leads"][:10], 1):
                        print(f"  {i:2d}. [{l['score']:2d}] {l['company'][:40]:40s} | {l['industry']}")
                return
        except Exception:
            pass

    # ── Load state (dedup across runs) ──
    seen_queries = set()
    if os.path.exists(state_file) and not args.force:
        try:
            with open(state_file) as f:
                state = json.load(f)
            seen_queries = set(state.get("queries_run", []))
        except Exception:
            pass

    # Filter to un-run queries (unless --force)
    queries = [q for q in SEARCH_QUERIES if q["query"] not in seen_queries]
    if not queries:
        print("[INFO] All queries already run. Use --force to re-run.")
        queries = SEARCH_QUERIES  # fall back to running all

    print(f"[LEAD FINDER v3] {len(queries)} queries | {args.workers} workers | max={args.max_results}")
    print(f"                  output → {output_file}")
    print()

    start = time.time()
    all_leads = []

    # ── Process queries concurrently ──
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {executor.submit(process_query, q, args.max_results): q for q in queries}
        for future in as_completed(futures):
            q = futures[future]
            try:
                leads = future.result(timeout=90)
                all_leads.extend(leads)
                seen_queries.add(q["query"])
                print(f"  [DONE] {q['query'][:60]}… → {len(leads)} leads")
            except Exception as e:
                print(f"  [ERROR] {q['query'][:60]}… → {e}")

    # ── Deduplicate by domain, keep highest score ──
    seen_domains = {}
    for lead in all_leads:
        d = lead.get("domain", "")
        if not d:
            d = lead.get("company", "")
        if d not in seen_domains or lead["score"] > seen_domains[d]["score"]:
            seen_domains[d] = lead

    unique_leads = sorted(seen_domains.values(), key=lambda x: x["score"], reverse=True)

    elapsed = time.time() - start

    # Count by search source
    source_counts = {}
    for l in unique_leads:
        src = l.get("search_source", "unknown")
        source_counts[src] = source_counts.get(src, 0) + 1

    # ── Save output ──
    output = {
        "generated": datetime.now(timezone.utc).isoformat(),
        "engine": "lead_finder_v3",
        "search_time_seconds": round(elapsed, 1),
        "total_raw": len(all_leads),
        "total_unique": len(unique_leads),
        "high_score": len([l for l in unique_leads if l["score"] >= 75]),
        "medium_score": len([l for l in unique_leads if 45 <= l["score"] < 75]),
        "source_breakdown": source_counts,
        "industries_covered": list(set(l["industry"] for l in unique_leads)),
        "leads": unique_leads,
    }
    with open(output_file, "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    # ── Save state for dedup across runs ──
    state = {
        "last_run": datetime.now(timezone.utc).isoformat(),
        "queries_run": list(seen_queries),
    }
    with open(state_file, "w") as f:
        json.dump(state, f, indent=2)

    # ── Print summary ──
    print(f"\n{'=' * 60}")
    print(f"  RESULTS SUMMARY")
    print(f"{'=' * 60}")
    print(f"  Search time:       {elapsed:.1f}s")
    print(f"  Raw leads found:   {len(all_leads)}")
    print(f"  Unique leads:      {len(unique_leads)}")
    print(f"  High score (75+):  {output['high_score']}")
    print(f"  Medium (45-74):    {output['medium_score']}")
    print(f"  Sources used:      {source_counts}")
    print(f"  Industries:        {output['industries_covered']}")
    print(f"  Output: {output_file}")
    print(f"{'=' * 60}")

    if unique_leads:
        print(f"\n  TOP LEADS:")
        for i, l in enumerate(unique_leads[:15], 1):
            email_str = f" | emails: {', '.join(l['emails'])}" if l.get("emails") else ""
            print(f"  {i:2d}. [{l['score']:2d}] {l['company'][:38]:38s} | {l['industry'][:18]}{email_str}")


if __name__ == "__main__":
    main()
