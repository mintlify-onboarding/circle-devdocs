#!/usr/bin/env python3
"""
Script to remove duplicate links from broken.mdx file.
Keeps only the first occurrence of each URL under each file path.
"""


def remove_duplicate_links(input_file, output_file=None):
    """
    Remove duplicate URLs from the broken links file.

    Args:
        input_file: Path to the input file (e.g., broken.mdx)
        output_file: Path to output file. If None, overwrites input file.
    """
    if output_file is None:
        output_file = input_file

    with open(input_file, "r", encoding="utf-8") as f:
        lines = f.readlines()

    result_lines = []
    current_file = None
    seen_urls = set()

    for line in lines:
        stripped = line.strip()

        # Check if this is a URL line (contains ⎿)
        if "⎿" in line:
            # This is a URL line - extract the URL part after ⎿
            url = stripped.replace("⎿", "").strip()
            if url not in seen_urls:
                seen_urls.add(url)
                result_lines.append(line)
            # else: skip duplicate URL
        elif stripped and not line[0].isspace():
            # This is a file path line (doesn't start with whitespace and has content)
            # New file section - reset seen URLs
            current_file = stripped
            seen_urls = set()
            result_lines.append(line)
        else:
            # Empty line or other content
            result_lines.append(line)

    # Write the deduplicated content
    with open(output_file, "w", encoding="utf-8") as f:
        f.writelines(result_lines)

    print(f"Processed {input_file}")
    print(f"Output written to {output_file}")
    print(f"Original lines: {len(lines)}")
    print(f"Deduplicated lines: {len(result_lines)}")
    print(f"Removed {len(lines) - len(result_lines)} duplicate link entries")


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python remove_duplicate_links.py <input_file> [output_file]")
        print("Example: python remove_duplicate_links.py broken.mdx")
        print("Example: python remove_duplicate_links.py broken.mdx cleaned.mdx")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    remove_duplicate_links(input_file, output_file)
