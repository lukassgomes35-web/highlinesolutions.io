# Highline Solutions — site mirror

A static mirror of [highlinesolutions.io](https://highlinesolutions.io), deployed to Vercel.

## Live URLs

| Branch | Vercel target | URL |
|---|---|---|
| `main` | Production | https://highlinesolutions-io.vercel.app |
| `dev` | Preview | https://highlinesolutions-io-git-dev-lukas555.vercel.app (requires Vercel login — preview deployments are protected by default) |

**Note:** the real `highlinesolutions.io` domain is not connected to this project — it still points at the actual live site elsewhere. This is a separate copy. If that ever changes, update the `canonical`/`og:url`/`og:image` tags in `index.html` (and the URLs in `robots.txt` / `sitemap.xml`) to match.

## How deploys work

This repo is connected to Vercel via Git integration:

- Push to `main` → auto-deploys to production.
- Push to `dev` (or any other branch) → auto-deploys to a preview, aliased at a stable `-git-<branch>-` URL so you don't need to hunt for a fresh link each time.

There's no build step — it's plain HTML/CSS/JS, served as-is.

## Project structure

```
index.html                  Homepage
blog.php@pageId=NNN.html    Individual blog posts (static snapshots)
css/, js/, images/          Static assets
data/whats-new.json         Source of truth for the homepage "What's new with us" list
scripts/add_whats_new.py    Adds an entry to data/whats-new.json and regenerates index.html
robots.txt, sitemap.xml     Basic SEO/crawler files
```

## Adding a "What's new" entry

The homepage's "What's new with us" section is generated from `data/whats-new.json`. To add an entry:

```bash
python3 scripts/add_whats_new.py \
  --date "January 5th 2026" \
  --text "Some update text." \
  --link "https://www.linkedin.com/posts/..."
```

This prepends the entry to `data/whats-new.json` and regenerates the `<ul>` block in `index.html` between the `WHATS-NEW:START` / `WHATS-NEW:END` markers. `--link` can point at a local blog page or an external URL (e.g. a specific public LinkedIn post someone hands you directly).

If you've hand-edited `data/whats-new.json`, run the script with `--regen-only` to re-render `index.html` without adding a new entry.

## Where content comes from

There's no automated feed pulling in updates (LinkedIn doesn't expose a public API or feed for personal or company profile posts, and this project deliberately does not use scraping tools or automated logins to get around that). New entries come from either:

- Someone sending you the text/link of an update directly, or
- A specific public LinkedIn post link, which you can hand to whoever's updating the site to summarize and add via the script above.
