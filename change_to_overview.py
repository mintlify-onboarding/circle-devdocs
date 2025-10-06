from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Iterator, Optional

# ======================
# CONFIG (edit as needed)
# ======================
ROOT = Path(".")  # repo root to search/write
DOCS_JSON_PATH = ROOT / "docs.json"
NAVIGATION_KEY = "navigation"  # key inside docs.json to traverse
MODE = "add_sidebar_title"  # "add_sidebar_title" | "retitle_title"
OVERVIEW_TEXT = "Overview"  # value to add as sidebar title or title
DRY_RUN = False  # True = report only, False = write changes
VERBOSE = True  # print per-file actions

# If MODE == add_sidebar_title:
SKIP_IF_SIDEBARTITLE_EXISTS = True

# How to resolve a page path like "/docs/get-started/onboarding"
# into a real file on disk. We'll try these patterns in order:
RESOLUTION_PATTERNS = [
    "{path}.mdx",
    "{path}.md",
    "docs/{path}.mdx",
    "docs/{path}.md",
    "{path}/index.mdx",
    "{path}/index.md",
    "docs/{path}/index.mdx",
    "docs/{path}/index.md",
]


# ==========
# UTILITIES
# ==========
def log(msg: str) -> None:
    if VERBOSE:
        print(msg)


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def normalize_nav_path(p: str) -> str:
    # strip leading slash and optional leading "docs/"
    p = p.lstrip("/")
    if p.startswith("docs/"):
        p = p[len("docs/") :]
    return p


def resolve_page_to_file(repo_root: Path, page: str) -> Optional[Path]:
    """
    Given a page string like '/docs/get-started/onboarding', try to find a file.
    """
    page_norm = normalize_nav_path(page)
    for pattern in RESOLUTION_PATTERNS:
        rel = pattern.format(path=page_norm)
        candidate = (repo_root / rel).resolve()
        if candidate.exists() and candidate.is_file():
            return candidate
    return None


# =================
# FRONTMATTER PARSE
# =================
FM_RE = re.compile(r"(?s)\A---\n(.*?)\n---\n?")


def parse_frontmatter(text: str) -> tuple[dict[str, Any], str, tuple[int, int]]:
    """
    Returns (fm_dict, body, (start, end)) where start/end are the span of the frontmatter block.
    If no frontmatter, returns ({}, original_text, (-1, -1)).
    """
    m = FM_RE.search(text)
    if not m:
        return {}, text, (-1, -1)

    fm_raw = m.group(1)
    body = text[m.end() :]

    fm = simple_yaml_to_dict(fm_raw)
    return fm, body, m.span()


def rebuild_with_frontmatter(fm: dict[str, Any], body: str) -> str:
    fm_raw = dict_to_simple_yaml(fm)
    return f"---\n{fm_raw}\n---\n{body}"


def simple_yaml_to_dict(src: str) -> dict[str, Any]:
    """
    Minimal YAML reader for flat frontmatter (string/bool/number) + nested dict/list.
    Prefers robustness over completeness. If you have PyYAML, you can swap it in:
        import yaml
        return yaml.safe_load(src) or {}
    """
    try:
        import yaml  # type: ignore

        data = yaml.safe_load(src)
        return data or {}
    except Exception:
        pass

    # naive fallback: key: value lines, handle basic lists and nested dicts via indentation
    # This is intentionally minimal; most MDX frontmatters are simple enough.
    lines = src.splitlines()
    stack = [({}, -1)]  # (current_obj, indent_level)
    key_stack: list[str] = []

    def set_value(container, key, value):
        if isinstance(container, dict):
            container[key] = value
        elif isinstance(container, list):
            container.append(value)

    def parse_scalar(val: str):
        v = val.strip()
        if v.lower() in ("true", "false"):
            return v.lower() == "true"
        # int?
        try:
            return int(v)
        except:
            pass
        # float?
        try:
            return float(v)
        except:
            pass
        # strip quotes
        if (v.startswith('"') and v.endswith('"')) or (
            v.startswith("'") and v.endswith("'")
        ):
            return v[1:-1]
        return v

    for raw in lines:
        if not raw.strip():
            continue
        indent = len(raw) - len(raw.lstrip())
        line = raw.strip()

        # ascend stack as needed
        while len(stack) > 1 and indent <= stack[-1][1]:
            stack.pop()
            if key_stack:
                key_stack.pop()

        current, _ = stack[-1]

        if line.startswith("- "):
            # list item
            item = line[2:].strip()
            if isinstance(current, dict):
                # if we saw a "key:" before, we should have turned current[key] into a list
                # but for simplicity, assume the dict only contains lists when lines start with "-"
                # so convert current to list if empty
                # This is a fallback – not perfect, but workable for simple FM.
                new_list = current.get("_list_", [])
                if not isinstance(new_list, list):
                    new_list = []
                new_list.append(parse_scalar(item) if ":" not in item else item)
                current["_list_"] = new_list
            elif isinstance(current, list):
                current.append(parse_scalar(item))
            else:
                pass
        elif ":" in line:
            k, v = line.split(":", 1)
            k = k.strip()
            v = v.strip()
            if v == "":
                # nested object starts
                new_obj: dict[str, Any] = {}
                set_value(current, k, new_obj) if isinstance(current, dict) else None
                stack.append((new_obj, indent))
                key_stack.append(k)
            else:
                set_value(current, k, parse_scalar(v))
        else:
            # bare line, ignore
            pass

    # If we used _list_ placeholder, flatten (best-effort)
    def flatten_lists(obj):
        if isinstance(obj, dict):
            for k, v in list(obj.items()):
                if k == "_list_":
                    return v
                else:
                    obj[k] = flatten_lists(v)
        elif isinstance(obj, list):
            return [flatten_lists(x) for x in obj]
        return obj

    result = flatten_lists(stack[0][0])
    return result if isinstance(result, dict) else {}


def dict_to_simple_yaml(d: dict[str, Any], indent: int = 0) -> str:
    """
    Simple YAML emitter. Uses quotes around strings that contain ':' or start with special chars.
    """
    lines: list[str] = []

    def needs_quotes(s: str) -> bool:
        return any(
            [
                ":" in s,
                s.strip() != s,
                s.startswith(
                    ("#", "!", "-", "?", "@", "&", "*", "%", "{", "}", "[", "]")
                ),
            ]
        )

    def emit(obj: Any, level: int, key: Optional[str] = None):
        pad = "  " * level
        if isinstance(obj, dict):
            if key is not None:
                lines.append(f"{pad}{key}:")
            for k, v in obj.items():
                emit(
                    v,
                    level + (1 if key is not None else 0),
                    k if key is not None else k,
                )
        elif isinstance(obj, list):
            if key is not None:
                lines.append(f"{pad}{key}:")
            for item in obj:
                if isinstance(item, (dict, list)):
                    lines.append(f"{pad}-")
                    emit(item, level + 1)
                else:
                    sval = str(item)
                    if isinstance(item, str) and needs_quotes(sval):
                        sval = f'"{sval}"'
                    lines.append(f"{pad}- {sval}")
        else:
            sval = str(obj)
            if isinstance(obj, str) and needs_quotes(sval):
                sval = f'"{sval}"'
            if key is None:
                lines.append(f"{pad}{sval}")
            else:
                lines.append(f"{pad}{key}: {sval}")

    emit(d, indent)
    return "\n".join(lines)


# ===================
# NAV TRAVERSAL (DFS)
# ===================
def iter_group_objects(node: Any) -> Iterator[dict]:
    """
    Yield every dict that has 'group' and 'pages' (list), anywhere in the nav tree.
    Recurse into all dicts/lists to find nested occurrences.
    """
    if isinstance(node, dict):
        # If this looks like a group object:
        if "group" in node and "pages" in node and isinstance(node["pages"], list):
            yield node
        # Recurse into all values
        for v in node.values():
            yield from iter_group_objects(v)
    elif isinstance(node, list):
        for item in node:
            yield from iter_group_objects(item)


# ===============
# CORE LOGIC
# ===============
def first_string_page(pages: list[Any]) -> Optional[str]:
    for p in pages:
        if isinstance(p, str):
            return p
        # Sometimes nested objects get mixed in; ignore non-strings for "first page"
    return None


def clean_text(s: Optional[str]) -> str:
    return (s or "").strip().strip('"').strip("'")


def process_file(path: Path, group_name: str) -> tuple[bool, str]:
    """
    Returns (changed, message)
    """
    try:
        text = path.read_text(encoding="utf-8")
    except Exception as e:
        return False, f"READ ERROR: {path} ({e})"

    fm, body, span = parse_frontmatter(text)
    if span == (-1, -1):
        return False, f"NO FRONTMATTER: {path}"

    file_title = clean_text(fm.get("title"))
    file_sidebar = clean_text(fm.get("sidebarTitle", ""))
    group_name_clean = clean_text(group_name)

    # Check if sidebarTitle equals group name (in addition to title check)
    sidebar_matches_group = file_sidebar == group_name_clean
    title_matches_group = file_title == group_name_clean

    if not title_matches_group and not sidebar_matches_group:
        return (
            False,
            f"SKIP (neither title nor sidebarTitle match group): {path}  [title='{file_title}' | sidebarTitle='{file_sidebar}' | group='{group_name_clean}']",
        )

    changed = False

    if MODE == "add_sidebar_title":
        # If sidebarTitle matches group name, change it to Overview
        if sidebar_matches_group:
            fm["sidebarTitle"] = OVERVIEW_TEXT
            changed = True
        # If title matches but no sidebarTitle exists, add it
        elif title_matches_group:
            if SKIP_IF_SIDEBARTITLE_EXISTS and "sidebarTitle" in fm:
                return False, f"ALREADY HAS sidebarTitle: {path}"
            fm["sidebarTitle"] = OVERVIEW_TEXT
            changed = True
    elif MODE == "retitle_title":
        if title_matches_group:
            fm["title"] = OVERVIEW_TEXT
            changed = True
    else:
        return False, f"UNKNOWN MODE '{MODE}' (no change): {path}"

    if not changed:
        return False, f"NO CHANGES NEEDED: {path}"

    new_text = rebuild_with_frontmatter(fm, body)

    if DRY_RUN:
        return True, f"WOULD CHANGE: {path}  ({MODE})"
    else:
        try:
            path.write_text(new_text, encoding="utf-8")
            return True, f"UPDATED: {path}  ({MODE})"
        except Exception as e:
            return False, f"WRITE ERROR: {path} ({e})"


def main():
    if not DOCS_JSON_PATH.exists():
        print(f"docs.json not found at: {DOCS_JSON_PATH}")
        return

    data = load_json(DOCS_JSON_PATH)
    if NAVIGATION_KEY not in data:
        print(f"Key '{NAVIGATION_KEY}' not found in docs.json")
        return

    nav = data[NAVIGATION_KEY]
    total_groups = 0
    changed = 0

    for group_obj in iter_group_objects(nav):
        total_groups += 1
        group_name = group_obj.get("group", "")
        pages = group_obj.get("pages", [])
        first_page = first_string_page(pages)
        if not first_page:
            log(f"[group: {group_name}] No string first page found; skipping.")
            continue

        mdx_path = resolve_page_to_file(ROOT, first_page)
        if not mdx_path:
            log(
                f"[group: {group_name}] Could not resolve page '{first_page}' to a file."
            )
            continue

        did_change, msg = process_file(mdx_path, group_name)
        log(msg)
        if did_change:
            changed += 1

    print(
        f"\nDone. Groups scanned: {total_groups}. Files changed{'' if not DRY_RUN else ' (would)'}: {changed}."
    )


if __name__ == "__main__":
    main()
