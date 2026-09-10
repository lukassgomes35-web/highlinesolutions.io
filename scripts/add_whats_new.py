#!/usr/bin/env python3
"""Add an entry to the "What's new with us" section on the homepage.

Usage:
    python3 scripts/add_whats_new.py --date "January 5th 2026" \\
        --text "Some update text." \\
        --link "https://www.linkedin.com/posts/..."

Entries are stored in data/whats-new.json (newest first) and rendered into
index.html between the WHATS-NEW:START / WHATS-NEW:END markers. Re-running
the script (e.g. after hand-editing the JSON) just regenerates the HTML.
"""
import argparse
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "data" / "whats-new.json"
INDEX_FILE = ROOT / "index.html"
START_MARKER = "<!-- WHATS-NEW:START"
END_MARKER = "<!-- WHATS-NEW:END -->"


def load_entries():
    if DATA_FILE.exists():
        return json.loads(DATA_FILE.read_text())
    return []


def save_entries(entries):
    DATA_FILE.write_text(json.dumps(entries, indent=2) + "\n")


def render_entries(entries):
    items = []
    for e in entries:
        date = html.escape(e["date"], quote=False)
        text = html.escape(e["text"], quote=False)
        link = html.escape(e["link"], quote=True)
        items.append(
            f'                            <li class="whats-new-list-item">\n'
            f'                    <a href="{link}" class="whats-new-list-item">\n'
            f'                        <span class="whats-new-date">{date}</span>\n'
            f'                        <span class="whats-new-text">{text}</a>\n'
            f'                    </a>\n'
            f'                </li>'
        )
    return "\n".join(items)


def update_index_html(entries):
    content = INDEX_FILE.read_text()
    start_idx = content.find(START_MARKER)
    end_idx = content.find(END_MARKER)
    if start_idx == -1 or end_idx == -1:
        sys.exit(
            "Could not find WHATS-NEW markers in index.html. "
            "Add '<!-- WHATS-NEW:START -->' and '<!-- WHATS-NEW:END -->' "
            "around the <ul class=\"whats-new\"> items."
        )
    start_line_end = content.find("\n", start_idx) + 1
    new_body = render_entries(entries) + "\n                "
    content = content[:start_line_end] + new_body + content[end_idx:]
    INDEX_FILE.write_text(content)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--date", help='Display date, e.g. "January 5th 2026"')
    parser.add_argument("--text", help="Update blurb text")
    parser.add_argument("--link", help="URL the item links to (LinkedIn post, blog page, etc.)")
    parser.add_argument(
        "--regen-only",
        action="store_true",
        help="Skip adding a new entry; just regenerate index.html from data/whats-new.json",
    )
    args = parser.parse_args()

    entries = load_entries()

    if not args.regen_only:
        missing = [f"--{f}" for f in ("date", "text", "link") if not getattr(args, f)]
        if missing:
            sys.exit(f"Missing required arguments: {', '.join(missing)} (or pass --regen-only)")
        entries.insert(0, {"date": args.date, "text": args.text, "link": args.link})
        save_entries(entries)

    update_index_html(entries)
    print(f"Wrote {len(entries)} entries to index.html and {DATA_FILE.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
