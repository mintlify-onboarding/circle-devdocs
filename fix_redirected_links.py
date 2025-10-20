#!/usr/bin/env python3
"""
Script to fix redirected links in MDX files.
Reads the broken_links_report.txt file and replaces old URL slugs with new ones.
"""

import re
import os
from pathlib import Path
from urllib.parse import urlparse
from typing import Dict, List, Tuple


def parse_broken_links_report(report_file: str) -> Dict[str, str]:
    """
    Parse the broken_links_report.txt file to extract URL redirections.

    Args:
        report_file: Path to the broken_links_report.txt file

    Returns:
        Dictionary mapping old URL paths to new URL paths
    """
    url_mappings = {}
    base_url = "https://developers.circle.com"

    with open(report_file, "r", encoding="utf-8") as f:
        lines = f.readlines()

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Look for lines that start with "Line X: https://"
        if line.startswith("Line") and "https://" in line:
            # Extract the original URL
            old_url = line.split(": ", 1)[1] if ": " in line else None

            # Check if next line contains "-> Redirects to:"
            if i + 1 < len(lines) and "-> Redirects to:" in lines[i + 1]:
                new_url = lines[i + 1].strip().split("-> Redirects to: ", 1)[1]

                # Extract paths (everything after the base domain)
                if old_url and old_url.startswith(base_url):
                    old_path = old_url.replace(base_url, "")
                    new_path = new_url.replace(base_url, "")

                    # Only add if the paths are different
                    if old_path != new_path:
                        url_mappings[old_path] = new_path

        i += 1

    return url_mappings


def find_mdx_files(directory: str) -> List[str]:
    """
    Recursively find all .mdx files in the directory.

    Args:
        directory: Root directory to search

    Returns:
        List of paths to .mdx files
    """
    mdx_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".mdx"):
                mdx_files.append(os.path.join(root, file))
    return mdx_files


def replace_links_in_file(
    file_path: str, url_mappings: Dict[str, str], base_url: str = "https://developers.circle.com"
) -> Tuple[int, List[str]]:
    """
    Replace old URL slugs with new ones in a file.
    Handles both markdown format [text](url) and HTML format href="url".

    Args:
        file_path: Path to the file to process
        url_mappings: Dictionary mapping old paths to new paths
        base_url: Base URL to prepend when matching

    Returns:
        Tuple of (number of replacements made, list of changes)
    """
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content
    replacements_made = 0
    changes = []

    for old_path, new_path in url_mappings.items():
        # Pattern 1: Markdown links [text](url)
        # Match both with and without the base URL
        patterns = [
            # With full URL
            (
                rf"\[([^\]]+)\]\({re.escape(base_url + old_path)}\)",
                rf"[\1]({base_url}{new_path})",
            ),
            # With just the path
            (rf"\[([^\]]+)\]\({re.escape(old_path)}\)", rf"[\1]({new_path})"),
            # HTML href with full URL
            (
                rf'href=["\']({re.escape(base_url + old_path)})["\']',
                rf'href="{base_url}{new_path}"',
            ),
            # HTML href with just the path
            (rf'href=["\']({re.escape(old_path)})["\']', rf'href="{new_path}"'),
        ]

        for pattern, replacement in patterns:
            matches = re.findall(pattern, content)
            if matches:
                new_content = re.sub(pattern, replacement, content)
                if new_content != content:
                    count = len(matches)
                    replacements_made += count
                    changes.append(f"  Replaced {count}x: {old_path} -> {new_path}")
                    content = new_content

    # Write back if changes were made
    if content != original_content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)

    return replacements_made, changes


def main(
    report_file: str = "broken_links_report.txt",
    search_directory: str = ".",
    dry_run: bool = False,
):
    """
    Main function to fix redirected links in MDX files.

    Args:
        report_file: Path to the broken links report
        search_directory: Directory to search for MDX files
        dry_run: If True, only show what would be changed without modifying files
    """
    print(f"Reading broken links report from: {report_file}")
    url_mappings = parse_broken_links_report(report_file)

    print(f"\nFound {len(url_mappings)} URL redirections to fix:")
    for old_path, new_path in sorted(url_mappings.items())[:5]:
        print(f"  {old_path}")
        print(f"    -> {new_path}")
    if len(url_mappings) > 5:
        print(f"  ... and {len(url_mappings) - 5} more")

    print(f"\nSearching for .mdx files in: {search_directory}")
    mdx_files = find_mdx_files(search_directory)
    print(f"Found {len(mdx_files)} .mdx files")

    if dry_run:
        print("\n[DRY RUN MODE - No files will be modified]")

    total_replacements = 0
    files_modified = 0

    print("\nProcessing files...")
    for file_path in mdx_files:
        if dry_run:
            # For dry run, just check without modifying
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            file_replacements = 0
            for old_path in url_mappings.keys():
                # Check if old path exists in any form
                if old_path in content:
                    file_replacements += content.count(old_path)

            if file_replacements > 0:
                files_modified += 1
                total_replacements += file_replacements
                print(f"  Would modify: {file_path} ({file_replacements} replacements)")
        else:
            replacements, changes = replace_links_in_file(file_path, url_mappings)
            if replacements > 0:
                files_modified += 1
                total_replacements += replacements
                relative_path = os.path.relpath(file_path, search_directory)
                print(f"\n{relative_path}:")
                for change in changes:
                    print(change)

    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    if dry_run:
        print(f"Would modify {files_modified} files")
        print(f"Would make {total_replacements} replacements")
    else:
        print(f"Modified {files_modified} files")
        print(f"Made {total_replacements} replacements")
    print("=" * 80)


if __name__ == "__main__":
    import sys

    dry_run = "--dry-run" in sys.argv or "-n" in sys.argv

    if "--help" in sys.argv or "-h" in sys.argv:
        print("Usage: python fix_redirected_links.py [options]")
        print()
        print("Options:")
        print("  --dry-run, -n    Show what would be changed without modifying files")
        print("  --help, -h       Show this help message")
        print()
        print("The script looks for broken_links_report.txt in the current directory")
        print("and processes all .mdx files recursively.")
        sys.exit(0)

    main(dry_run=dry_run)
