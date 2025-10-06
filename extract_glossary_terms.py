#!/usr/bin/env python3
"""
Script to extract all unique glossary terms from MDX files and map them to pages.
Searches for <Glossary term="..." /> components and creates a JSON mapping.
"""

import os
import re
import json
from pathlib import Path
from urllib.parse import urljoin


def extract_glossary_terms(file_path, base_url="https://developers.circle.com"):
    """
    Extract all glossary terms from a single MDX file.
    Returns a list of (term, page_url) tuples.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return []

    # Find all <Glossary term="..." /> or <Glossary term='...' /> patterns
    pattern = r'<Glossary\s+term=["\']([^"\']+)["\']'
    matches = re.findall(pattern, content)

    if not matches:
        return []

    # Convert file path to URL path
    # Remove .mdx extension and create relative URL
    relative_path = str(file_path).replace('.mdx', '').replace('\\', '/')

    # Remove leading './' if present
    if relative_path.startswith('./'):
        relative_path = relative_path[2:]

    page_url = urljoin(base_url, relative_path)

    return [(term, page_url) for term in matches]


def find_all_glossary_terms(directory, base_url="https://developers.circle.com"):
    """
    Find all glossary terms across all MDX files in the directory.
    Returns a dictionary mapping terms to their first occurrence page.
    """
    term_map = {}  # term -> page_url (first occurrence only)

    # Find all .mdx files recursively
    mdx_files = Path(directory).rglob("*.mdx")

    for file_path in mdx_files:
        # Skip files in certain directories if needed
        file_str = str(file_path)

        # Extract terms from this file
        terms = extract_glossary_terms(file_path, base_url)

        for term, page_url in terms:
            # Only store first occurrence of each term
            if term not in term_map:
                term_map[term] = page_url
                print(f"Found term: '{term}' in {file_path}")

    return term_map


def create_glossary_json(term_map, output_file="glossary.json"):
    """
    Create a JSON file with the glossary terms in the required format.
    """
    # Convert to list format matching the expected output
    glossary_list = [
        {"term": term, "page": page_url}
        for term, page_url in sorted(term_map.items())
    ]

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(glossary_list, f, indent=2, ensure_ascii=False)

    print(f"\nCreated {output_file} with {len(glossary_list)} unique terms")


def main():
    """Main function to extract glossary terms and create JSON."""
    current_dir = "."
    base_url = "https://developers.circle.com"

    print("Searching for glossary terms in MDX files...")
    print(f"Base URL: {base_url}\n")

    term_map = find_all_glossary_terms(current_dir, base_url)

    if not term_map:
        print("No glossary terms found!")
        return

    create_glossary_json(term_map, "glossary.json")

    print("\nSummary:")
    print(f"Total unique terms found: {len(term_map)}")
    print("\nTerms:")
    for term in sorted(term_map.keys()):
        print(f"  - {term}")


if __name__ == "__main__":
    main()
