# OpenAPI to MDX File Generator

This script automatically generates MDX files from OpenAPI specifications for use with Mintlify documentation.

## Overview

The `generate_mdx_files.py` script processes all OpenAPI YAML files in the `openapi/` directory and creates individual MDX files for each API endpoint. Each file includes frontmatter compatible with Mintlify's OpenAPI integration.

## Features

- Processes all `.yaml` and `.yml` files in the `openapi/` directory
- Creates one MDX file per endpoint (operation)
- Organizes files by API tag into separate folders
- Converts operationIds to kebab-case for filenames
- Generates proper frontmatter with title and OpenAPI reference

## Usage

### Basic Usage

```bash
python3 generate_mdx_files.py
```

### Requirements

- Python 3.6+
- PyYAML library

Install dependencies:

```bash
pip install pyyaml
```

## Output Structure

The script creates the following structure:

```
api-reference/
├── tag-name-1/
│   ├── operation-id-1.mdx
│   ├── operation-id-2.mdx
│   └── ...
├── tag-name-2/
│   ├── operation-id-3.mdx
│   └── ...
└── ...
```

### Example Output File

For an endpoint with:

- **operationId**: `createSubscription`
- **summary**: "Create a notification subscription"
- **method**: POST
- **path**: `/v2/notifications/subscriptions`
- **tag**: "Webhook Subscriptions"
- **OpenAPI file**: `openapi/configurations.yaml`

The script generates:

**File**: `api-reference/webhook-subscriptions/create-subscription.mdx`

```mdx
---
title: Create a notification subscription
openapi: "/openapi/configurations.yaml POST /v2/notifications/subscriptions"
---
```

## How It Works

1. **Scans OpenAPI Directory**: Finds all `.yaml` and `.yml` files in the `openapi/` directory
2. **Parses Specifications**: Reads each OpenAPI spec using PyYAML
3. **Iterates Endpoints**: For each path and HTTP method combination:
   - Extracts the operationId, summary, tags, method, and path
   - Converts the operationId to kebab-case for the filename
   - Converts the tag to kebab-case for the folder name
   - Creates the MDX file with proper frontmatter
4. **Organizes by Tag**: Places files in folders named after their primary tag

## Naming Conventions

### Folder Names (Tags)

Tags are converted to kebab-case:

- "Webhook Subscriptions" → `webhook-subscriptions`
- "Monitor Tokens" → `monitor-tokens`
- "CCTP v1" → `cctp-v1`

### File Names (Operation IDs)

Operation IDs are converted to kebab-case:

- `createSubscription` → `create-subscription.mdx`
- `getPublicKey` → `get-public-key.mdx`
- `updateMonitoredTokens` → `update-monitored-tokens.mdx`

## Statistics

The last run generated:

- **199 total MDX files**
- Processed **11 OpenAPI specification files**
- Created **48 tag-based folders**

## Regenerating Files

To regenerate all files:

1. Delete the existing `api-reference/` directory (optional but recommended for clean slate)
2. Run the script:
   ```bash
   python3 generate_mdx_files.py
   ```

## Notes

- Files are overwritten if they already exist
- Endpoints without an `operationId` are skipped with a warning
- Only valid HTTP methods are processed (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
- The script uses the **first tag** from each endpoint's tag list for folder organization
- Endpoints with no tags are placed in a `default/` folder

## Troubleshooting

### No files generated

- Ensure the `openapi/` directory exists in the same location as the script
- Verify YAML files are valid OpenAPI specifications
- Check that endpoints have `operationId` fields

### Missing dependencies

```bash
pip install pyyaml
```

### Permission errors

Ensure you have write permissions in the script directory:

```bash
chmod +w .
```

## Integration with Mintlify

After generating the files, you may need to update your `mint.json` configuration to include the new API reference pages in your navigation structure.

Example navigation entry:

```json
{
  "group": "API Reference",
  "pages": [
    "api-reference/webhook-subscriptions/create-subscription",
    "api-reference/webhook-subscriptions/get-subscriptions",
    ...
  ]
}
```
