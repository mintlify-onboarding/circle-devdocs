#!/usr/bin/env python3
"""
Extract all links from sample.html and save them to a JSON file with base URL prepended.
"""

import json
from html.parser import HTMLParser
from pathlib import Path


class LinkExtractor(HTMLParser):
    """HTML parser to extract all href attributes from anchor tags."""

    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        """Extract href attribute from anchor tags."""
        if tag == "a":
            for attr_name, attr_value in attrs:
                if attr_name == "href" and attr_value:
                    self.links.append(attr_value)


def extract_links_from_html(html_file_path, base_url):
    """
    Extract all links from an HTML file and prepend base URL.

    Args:
        html_file_path: Path to the HTML file
        base_url: Base URL to prepend to each link

    Returns:
        List of complete URLs
    """
    # Read the HTML file
    html_content = Path(html_file_path).read_text(encoding="utf-8")

    # Parse and extract links
    parser = LinkExtractor()
    parser.feed(html_content)

    # Prepend base URL to each link
    # Remove trailing slash from base_url if present to avoid double slashes
    base_url = base_url.rstrip("/")
    complete_urls = [f"{base_url}{link}" for link in parser.links]

    return complete_urls


def main():
    # Configuration
    html_file = "sample.html"
    base_url = ""
    output_file = "links.json"

    # Extract links
    print(f"Extracting links from {html_file}...")
    links = extract_links_from_html(html_file, base_url)

    # Create output data structure
    output_data = {"base_url": base_url, "total_links": len(links), "links": links}

    # Save to JSON file
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"Successfully extracted {len(links)} links")
    print(f"Results saved to {output_file}")

    # Display first few links as preview
    print("\nFirst 5 links:")
    for i, link in enumerate(links[:5], 1):
        print(f"  {i}. {link}")


if __name__ == "__main__":
    main()
