#!/usr/bin/env python3
"""
Link validator for broken.mdx
Checks if links redirect to /not-found and generates a report
"""

import re
import requests
from urllib.parse import urljoin
from typing import List, Tuple
import time

# Configuration
BASE_URL = "https://developers.circle.com"
INPUT_FILE = "broken.mdx"
OUTPUT_FILE = "broken_links_report.txt"
REQUEST_DELAY = 0.5  # seconds between requests to avoid rate limiting


def extract_links_from_file(filepath: str) -> List[Tuple[int, str]]:
    """
    Extract all https://developers.circle.com links from the file.
    Returns list of tuples: (line_number, url)
    """
    links = []
    url_pattern = re.compile(r"https://developers\.circle\.com[^\s]*")

    with open(filepath, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, 1):
            matches = url_pattern.findall(line)
            for url in matches:
                links.append((line_num, url))

    return links


def check_url_redirect(url: str) -> Tuple[str, int, bool, str]:
    """
    Check if a URL redirects to /not-found.
    Returns: (original_url, status_code, is_broken, final_url)
    """
    try:
        response = requests.get(url, allow_redirects=True, timeout=10)
        final_url = response.url

        # Check if final URL ends with /not-found
        is_broken = final_url.endswith("/not-found") or "/not-found" in final_url

        return (url, response.status_code, is_broken, final_url)

    except requests.exceptions.RequestException as e:
        return (url, 0, True, f"ERROR: {str(e)}")


def main():
    print(f"Reading links from {INPUT_FILE}...")
    links = extract_links_from_file(INPUT_FILE)

    print(f"Found {len(links)} links to validate")
    print(f"Base URL: {BASE_URL}")
    print("-" * 80)

    broken_links = []
    valid_links = []

    for idx, (line_num, url) in enumerate(links, 1):
        print(f"[{idx}/{len(links)}] Checking: {url}")

        original_url, status_code, is_broken, final_url = check_url_redirect(url)

        if is_broken:
            broken_links.append(
                {
                    "line": line_num,
                    "original": original_url,
                    "final": final_url,
                    "status": status_code,
                }
            )
            print(f"  ❌ BROKEN - Redirects to: {final_url}")
        else:
            valid_links.append(
                {
                    "line": line_num,
                    "original": original_url,
                    "final": final_url,
                    "status": status_code,
                }
            )
            print(f"  ✓ OK - Status: {status_code}")

        # Rate limiting
        if idx < len(links):
            time.sleep(REQUEST_DELAY)

    # Generate report
    print("\n" + "=" * 80)
    print("GENERATING REPORT")
    print("=" * 80)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("=" * 80 + "\n")
        f.write("BROKEN LINKS REPORT\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"Total links checked: {len(links)}\n")
        f.write(f"Broken links: {len(broken_links)}\n")
        f.write(f"Valid links: {len(valid_links)}\n\n")

        if broken_links:
            f.write("=" * 80 + "\n")
            f.write("BROKEN LINKS (Redirect to /not-found)\n")
            f.write("=" * 80 + "\n\n")

            for link in broken_links:
                f.write(f"Line {link['line']}:\n")
                f.write(f"  Original:  {link['original']}\n")
                f.write(f"  Redirects: {link['final']}\n")
                f.write(f"  Status:    {link['status']}\n")
                f.write("\n")

        if valid_links:
            f.write("\n" + "=" * 80 + "\n")
            f.write("VALID LINKS\n")
            f.write("=" * 80 + "\n\n")

            for link in valid_links:
                f.write(f"Line {link['line']}: {link['original']}\n")
                if link["original"] != link["final"]:
                    f.write(f"  -> Redirects to: {link['final']}\n")
                f.write(f"  Status: {link['status']}\n\n")

    print(f"\n✓ Report saved to: {OUTPUT_FILE}")
    print(f"\nSummary:")
    print(f"  Total links: {len(links)}")
    print(f"  Broken: {len(broken_links)}")
    print(f"  Valid: {len(valid_links)}")


if __name__ == "__main__":
    main()
