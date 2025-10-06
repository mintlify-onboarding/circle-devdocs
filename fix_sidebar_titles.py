#!/usr/bin/env python3
"""
Script to ensure all sidebarTitle fields in MDX files use double quotes.
"""

import os
import re
from pathlib import Path


def fix_sidebar_title(content):
    """
    Fix sidebarTitle to use double quotes.
    Handles various formats:
    - sidebarTitle: 'text' -> sidebarTitle: "text"
    - sidebarTitle: text -> sidebarTitle: "text"
    - sidebarTitle: "text" -> sidebarTitle: "text" (already correct)
    """
    # Pattern to match sidebarTitle with single quotes
    pattern_single = r"sidebarTitle:\s*'([^']*)'"
    content = re.sub(pattern_single, r'sidebarTitle: "\1"', content)

    # Pattern to match sidebarTitle without quotes
    pattern_no_quotes = r"sidebarTitle:\s+([^\"'\n][^\n]*)"

    def replace_no_quotes(match):
        value = match.group(1).strip()
        # Don't replace if it's already quoted with double quotes
        if value.startswith('"') and value.endswith('"'):
            return match.group(0)
        return f'sidebarTitle: "{value}"'

    content = re.sub(pattern_no_quotes, replace_no_quotes, content)

    return content


def process_mdx_files(directory):
    """
    Process all MDX files in the directory and subdirectories.
    """
    mdx_files = Path(directory).rglob("*.mdx")
    processed_count = 0
    updated_count = 0

    for file_path in mdx_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                original_content = f.read()

            updated_content = fix_sidebar_title(original_content)

            if original_content != updated_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                print(f"Updated: {file_path}")
                updated_count += 1

            processed_count += 1

        except Exception as e:
            print(f"Error processing {file_path}: {e}")

    print(f"\nProcessed {processed_count} files, updated {updated_count} files.")


if __name__ == "__main__":
    # Run from the script's directory or specify the path
    directory = "."
    print(f"Processing MDX files in {os.path.abspath(directory)}")
    process_mdx_files(directory)
