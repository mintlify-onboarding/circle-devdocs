#!/usr/bin/env python3
"""
Script to convert release notes MDX files to use Update components.
Wraps content under each h3 date heading in <Update label="date"> components.
"""

import os
import re
from pathlib import Path


def extract_date_from_heading(line):
    """
    Extract date from h3 heading like '### 2024.12.23'
    Returns the date if found, None otherwise.
    """
    match = re.match(r'^###\s+(\d{4}\.\d{2}\.\d{2})\s*$', line.strip())
    if match:
        return match.group(1)
    return None


def is_h2_heading(line):
    """Check if line is an h2 heading (month heading)"""
    return re.match(r'^##\s+', line.strip()) is not None


def is_h3_heading(line):
    """Check if line is an h3 heading"""
    return re.match(r'^###\s+', line.strip()) is not None


def is_horizontal_rule(line):
    """Check if line is a horizontal rule (---)"""
    return line.strip() == '---'


def process_mdx_file(file_path):
    """
    Process a single MDX file to wrap date sections in Update components.
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    i = 0
    in_frontmatter = False
    current_update = None
    update_content = []

    while i < len(lines):
        line = lines[i]

        # Handle frontmatter
        if i == 0 and line.strip() == '---':
            in_frontmatter = True
            new_lines.append(line)
            i += 1
            continue

        if in_frontmatter:
            new_lines.append(line)
            if line.strip() == '---':
                in_frontmatter = False
            i += 1
            continue

        # Check if this is a date heading (h3)
        date = extract_date_from_heading(line)

        if date:
            # Close previous update if exists
            if current_update:
                new_lines.append(f'<Update label="{current_update}">\n')
                new_lines.extend(update_content)
                new_lines.append('</Update>\n\n')
                update_content = []

            # Start new update
            current_update = date
            i += 1
            continue

        # Check if we hit a new h2 section or end of file
        if is_h2_heading(line) or i == len(lines) - 1:
            # Close current update if exists
            if current_update:
                new_lines.append(f'<Update label="{current_update}">\n')
                new_lines.extend(update_content)

                # Include the last line if it's the end of file and not an h2
                if i == len(lines) - 1 and not is_h2_heading(line):
                    new_lines.append(line)

                new_lines.append('</Update>\n\n')
                update_content = []
                current_update = None

            new_lines.append(line)
            i += 1
            continue

        # Skip horizontal rules between updates (they're just separators)
        if is_horizontal_rule(line):
            # Close current update if exists
            if current_update:
                new_lines.append(f'<Update label="{current_update}">\n')
                new_lines.extend(update_content)
                new_lines.append('</Update>\n\n')
                update_content = []
                current_update = None
            i += 1
            continue

        # If we're in an update, collect the content
        if current_update:
            update_content.append(line)
        else:
            new_lines.append(line)

        i += 1

    # Close any remaining update
    if current_update:
        new_lines.append(f'<Update label="{current_update}">\n')
        new_lines.extend(update_content)
        new_lines.append('</Update>\n\n')

    return ''.join(new_lines)


def process_release_notes_folder(directory):
    """
    Process all MDX files in the release-notes directory.
    """
    mdx_files = Path(directory).glob("*.mdx")
    processed_count = 0
    updated_count = 0

    for file_path in mdx_files:
        try:
            print(f"Processing: {file_path}")

            # Read original content
            with open(file_path, 'r', encoding='utf-8') as f:
                original_content = f.read()

            # Process the file
            updated_content = process_mdx_file(file_path)

            # Only write if content changed
            if original_content != updated_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(updated_content)
                print(f"  ✓ Updated: {file_path}")
                updated_count += 1
            else:
                print(f"  - No changes needed")

            processed_count += 1

        except Exception as e:
            print(f"  ✗ Error processing {file_path}: {e}")

    print(f"\nProcessed {processed_count} files, updated {updated_count} files.")


if __name__ == "__main__":
    release_notes_dir = "release-notes"

    if not os.path.exists(release_notes_dir):
        print(f"Error: Directory '{release_notes_dir}' not found")
        exit(1)

    print(f"Processing MDX files in {os.path.abspath(release_notes_dir)}")
    process_release_notes_folder(release_notes_dir)
