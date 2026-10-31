<div align="center">

# 👗 AI Lookbook
### Your wardrobe, styled and packed by AI

*Built by a founder who travels constantly and hates shopping. Use what you already own, and look different every day.*

[![HTML](https://img.shields.io/badge/Built_with-HTML_+_JS-E34F26?style=flat-square&logo=html5&logoColor=white)](index.html)
[![No build](https://img.shields.io/badge/Build_step-none-1D2547?style=flat-square)](#setup-in-15-minutes)
[![Claude](https://img.shields.io/badge/Wardrobe_file-made_by_AI-D97757?style=flat-square&logo=anthropic&logoColor=white)](PROMPT.md)
[![GitHub Pages](https://img.shields.io/badge/Hosting-GitHub_Pages-222222?style=flat-square&logo=github&logoColor=white)](#5-put-it-online-optional)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)](LICENSE)

**[Live demo](https://potupchikmaria.github.io/ai-lookbook/) · [Why I built this](#the-problem-this-solves) · [What it does](#what-it-does) · [Setup in 15 min](#setup-in-15-minutes) · [Wardrobe format](#wardrobe-format)**

</div>

---

Most styling apps want you to buy more. This one starts from the opposite end: photograph what's already in your wardrobe, let AI work out what suits you, and get a lookbook that plans every outfit for every trip.

![Ticking pieces for a trip](docs/packing.png)

---

## The problem this solves

I speak at conferences, meet clients and investors, mentor founders and post on LinkedIn, often in the same week and in different countries. In tech, where most people dress on autopilot, looking put-together gets you remembered. But I don't enjoy shopping, and packing for a week of different roles used to take a whole evening.

The clothes were never the problem. I already owned more good outfits than I realised. I just couldn't see them all at once, or remember what I wore in the last post.

This fixes that.

---

## What it does

Pick where you're going, tick what goes in the suitcase, and the page shows every outfit those pieces make. Then it plans the trip day by day, with no repeats:

```
Business trip · spring · 11 pieces → 38 outfits

Day 1  Cream blazer · white roll-neck · cream trousers
       Light monochrome                     Stage · Clients · Mentoring
       Shoes: nude slingbacks
       Proportions: tuck the top in to raise the waist

Day 2  Black double-breasted blazer · blush satin shirt · black trousers
       Light base, deep tone · sheen next to matte   Stage · Clients
...
```

![Day-by-day plan](docs/day-plan.png)

- **Trip planner.** Climate (hot, spring/autumn, cold), one-tap packing sets, and a no-repeat plan for up to 21 days.
- **Outfits by season.** Your favourite combinations, then everything else your wardrobe can do in each season.
- **Dress for the role.** Filter by occasion (city, work, evening) and by role: stage, clients & investors, mentoring, workshop, networking.
- **Your style formula** at the top of the page, written from photos of outfits you loved.
- **Styling notes on every look:** which shoes, and how to balance your proportions.

---

## How the intelligence works

There are two layers. **AI does the seeing**: it turns photos of your clothes into a structured wardrobe file and finds your style formula. **A small rules engine does the combining**: it runs in the browser, so it's instant and works offline.

### Outfit rules

Every top × bottom × optional layer (and every dress ± layer) is checked against:

| Rule | Why |
|------|-----|
| **One accent colour** | Neutrals go with anything; two accents only if you've allowed the pair |
| **One pattern** | Stripes and prints never compete |
| **One textured piece** | Tweed or bouclé is the star, not the backing vocals |
| **No clashing darks** | e.g. black with navy, black with chocolate (configurable) |
| **Sets stay together** | Suits and co-ords always pair with each other |
| **Season and formality overlap** | A linen top won't be sent to a winter dinner |

### Ranking

```
score = light_monochrome (3) or light_base_one_accent (2)
      + sheen_next_to_matte (1)
      − two_satins_together (1)
      + layered_for_work (0.5) + favourite (1.5)
```

### Trip planning

Days are filled greedily from the highest-ranked outfits, with a penalty for every piece already worn and an extra penalty for repeating a piece from the day before, so the plan rotates through your suitcase instead of living in your favourite blazer.

---

## Architecture

```
ai-lookbook/
├── index.html     ← the page and its styles
├── app.js         ← outfit engine, trip planner, UI (no edits needed)
├── wardrobe.js    ← YOUR wardrobe, style formula and packing sets
├── PROMPT.md      ← the prompt that turns photos into wardrobe.js
└── docs/          ← screenshots
```

**Fully private by default.** One HTML page, no server, no account, no tracking. Your selections are saved only in your own browser.

**Zero dependencies, zero build step.** Plain HTML, CSS and JavaScript. Fonts come from Google Fonts and fall back to system fonts offline.

---

## Setup in 15 minutes

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/ai-lookbook.git
cd ai-lookbook
```

Or download the ZIP from the green **Code** button.

### 2. Photograph your clothes (10 min)

One piece per photo, hung up or laid flat, in daylight. Add a few photos of outfits you've worn and loved: these teach the AI your style.

### 3. Let AI write your wardrobe file (3 min)

Open Claude, ChatGPT or any assistant that accepts images. Paste the whole of [`PROMPT.md`](PROMPT.md), fill in the short "About me" section, attach your photos and send. You'll get back a complete `wardrobe.js` plus honest feedback on what works, what doesn't, and at most three things worth buying.

### 4. Open it

Replace `wardrobe.js` with the file you got, then open `index.html` in your browser.

### 5. Put it online (optional)

Push to your fork, then **Settings → Pages → Deploy from branch → `main` / root**. Your lookbook will live at `https://YOUR_USERNAME.github.io/ai-lookbook/`.

> A public Pages site can be opened by anyone with the link. To keep your wardrobe private, just open `index.html` locally.

---

## Wardrobe format

Each piece is one line in `wardrobe.js`:

```js
{ id: 'b-cream', name: 'Cream pleated trousers', cat: 'bottom', kind: 'trousers',
  color: 'cream', fabric: 'matte', formality: [1, 3], seasons: ['su', 'ms', 'wi'], set: 'cream' }
```

| Field | Values |
|-------|--------|
| `cat` | `layer` / `top` / `bottom` / `dress` |
| `color` | Any key from `colors` (your names, your hex values) |
| `fabric` | `matte` / `satin` / `tweed` / `linen` / `knit` / `denim` / `stripe` / `print` / `graphic` |
| `formality` | `[min, max]`: 1 city · 2 work · 3 evening |
| `seasons` | `su` hot · `ms` spring/autumn · `wi` cold |
| `set` | Pieces sharing a set name always pair (suits, co-ords) |
| `kind` | Bottoms only: `trousers` / `jeans` / `skirt` / `maxiSkirt` |
| `flags` | `alsoTop` · `alsoLayer` · `sleeveless` · `noLayer` · `cropped` · `longLayer` · `relaxed` · `fineKnit` · `mini` · `beltIt` · `stage` |

The same file also holds your `profile` (headline and style formula), colour `rules`, `favourites`, packing `presets`, `shoes` and `proportions` hints. The example wardrobe in this repo shows every option in use.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Page | HTML + CSS, light and dark themes, mobile-first |
| Engine | Vanilla JavaScript, runs in the browser |
| Data | One `wardrobe.js` file |
| AI step | Any multimodal assistant + [`PROMPT.md`](PROMPT.md) |
| Storage | Browser `localStorage` (selections only) |
| Hosting | Open locally, or GitHub Pages |

---

## Why not just use a wardrobe app?

Wardrobe apps make you photograph and tag every item by hand, then mostly suggest what to buy next. This takes ten minutes of photos, lets AI do the tagging, and has one goal: get more out of the clothes you already own.

---

## Roadmap

- [ ] Shoes, bags and outerwear as their own categories
- [ ] "Worn on" log, so social media posts never repeat an outfit
- [ ] Russian and other languages
- [ ] Printable packing list

Contributions and ideas welcome: open an issue or a pull request.

---

<div align="center">

Built and used by **[Mariia Potupchik](https://www.linkedin.com/in/potupchikmaria/)**, Founder & CEO of **[YourSkills](https://yourskills.pro)** · [mariiapotupchik.com](https://mariiapotupchik.com)

*If this helped you, consider giving it a ⭐ so others can find it.*

MIT License · Contributions welcome

</div>
