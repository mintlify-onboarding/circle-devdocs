#!/usr/bin/env python3
"""
Generate MDX files from OpenAPI specifications.

This script parses OpenAPI YAML files and creates individual MDX files for each endpoint.
Each file contains frontmatter with the title, filepath, method, and route.
Files are organized by tag in the api-pages directory.
"""

import os
import re
import yaml
from pathlib import Path
from typing import Dict, List, Any


def to_kebab_case(text: str) -> str:
    """Convert text to kebab-case."""
    # Replace spaces and underscores with hyphens
    text = re.sub(r"[\s_]+", "-", text)
    # Insert hyphens before capital letters (camelCase to kebab-case)
    text = re.sub(r"([a-z0-9])([A-Z])", r"\1-\2", text)
    # Convert to lowercase
    text = text.lower()
    # Remove any characters that aren't alphanumeric or hyphens
    text = re.sub(r"[^a-z0-9-]", "", text)
    # Remove duplicate hyphens
    text = re.sub(r"-+", "-", text)
    # Remove leading/trailing hyphens
    text = text.strip("-")
    return text


def sanitize_tag(tag: str) -> str:
    """Convert tag to a safe folder name."""
    return to_kebab_case(tag)


def parse_openapi_file(filepath: str) -> Dict[str, Any]:
    """Parse an OpenAPI YAML file."""
    with open(filepath, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def get_openapi_relative_path(openapi_file: str, base_dir: str) -> str:
    """Get the relative path of the OpenAPI file from the base directory."""
    return os.path.relpath(openapi_file, base_dir)


def generate_mdx_files(openapi_dir: str, output_dir: str):
    """
    Generate MDX files from all OpenAPI specs in the given directory.

    Args:
        openapi_dir: Directory containing OpenAPI YAML files
        output_dir: Base directory for output (api-pages will be created inside)
    """
    openapi_path = Path(openapi_dir)
    base_path = Path(output_dir)

    # Find all YAML files in the openapi directory
    yaml_files = list(openapi_path.glob("*.yaml")) + list(openapi_path.glob("*.yml"))

    if not yaml_files:
        print(f"No YAML files found in {openapi_dir}")
        return

    print(f"Found {len(yaml_files)} OpenAPI specification file(s)")

    total_endpoints = 0

    for yaml_file in yaml_files:
        print(f"\nProcessing: {yaml_file.name}")

        try:
            spec = parse_openapi_file(str(yaml_file))
        except Exception as e:
            print(f"  Error parsing {yaml_file.name}: {e}")
            continue

        if "paths" not in spec:
            print(f"  No paths found in {yaml_file.name}")
            continue

        # Get relative path for the openapi field
        openapi_rel_path = get_openapi_relative_path(str(yaml_file), str(base_path))

        # Get OpenAPI filename without extension for folder name
        openapi_folder = yaml_file.stem

        endpoints_count = 0

        # Iterate through all paths and methods
        for path, path_item in spec["paths"].items():
            for method, operation in path_item.items():
                # Skip if not an HTTP method
                if method.upper() not in [
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE",
                    "PATCH",
                    "HEAD",
                    "OPTIONS",
                ]:
                    continue

                # Skip if no operationId
                if "operationId" not in operation:
                    print(
                        f"  Warning: No operationId for {method.upper()} {path}, skipping"
                    )
                    continue

                operation_id = operation["operationId"]
                summary = operation.get("summary", operation_id)
                tags = operation.get("tags", ["default"])

                # Use the first tag for folder organization
                tag = tags[0] if tags else "default"
                tag_folder = sanitize_tag(tag)

                # Create the output directory with openapi filename folder
                output_path = base_path / "api-pages" / openapi_folder / tag_folder
                output_path.mkdir(parents=True, exist_ok=True)

                # Create filename from operationId
                filename = to_kebab_case(operation_id) + ".mdx"
                file_path = output_path / filename

                # Create the MDX content
                mdx_content = f"""---
title: {summary}
openapi: "{openapi_rel_path} {method.upper()} {path}"
---
"""

                # Write the file
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(mdx_content)

                endpoints_count += 1
                total_endpoints += 1

        print(f"  Generated {endpoints_count} MDX file(s) from {yaml_file.name}")

    print(
        f"\nTotal: Generated {total_endpoints} MDX file(s) in {base_path / 'api-pages'}"
    )


def main():
    """Main function."""
    # Get the script's directory
    script_dir = Path(__file__).parent

    # Set up paths
    openapi_dir = script_dir / "openapi"
    output_dir = script_dir

    # Check if openapi directory exists
    if not openapi_dir.exists():
        print(f"Error: OpenAPI directory not found at {openapi_dir}")
        return

    print("OpenAPI to MDX File Generator")
    print("=" * 50)
    print(f"OpenAPI specs directory: {openapi_dir}")
    print(f"Output directory: {output_dir / 'api-pages'}")
    print("=" * 50)

    # Generate the MDX files
    generate_mdx_files(str(openapi_dir), str(output_dir))

    print("\nDone!")


if __name__ == "__main__":
    main()
