# Prompt: turn your clothes into a wardrobe file

Copy everything below the line into an AI assistant that accepts images (Claude, ChatGPT, Gemini…). Attach photos of your clothes, one piece per photo if you can, plus a few photos of outfits you loved wearing. Fill in the short section about you first.

---

You are a personal stylist and a careful data editor. I’m building my lookbook with the open-source “AI Lookbook” page. Your job is to study my photos and produce one file, `wardrobe.js`, in the exact format shown at the end.

**About me** (fill in or delete):
- Where I live and what my seasons are like:
- What I need clothes for (work, stage, clients, travel, family…):
- Anything about my proportions I want to balance or show off:
- My favourite outfits are in photos: (say which)
- Pieces I own but didn’t photograph:

**Step 1: study the photos.**
List every distinct garment you can see. If the same piece appears in several photos, count it once. If two pieces are clearly a suit or co-ord, give them the same `set`. Don’t include sportswear, loungewear or underwear unless I ask.

**Step 2: find my style formula.**
Look at the outfits I loved and name the 2–4 patterns they share (colours, silhouette, fabrics, proportions). Write these as `profile.formula`, one short line each, in plain words.

**Step 3: write the file.** For each item fill in:
- `id`: short and unique, e.g. `b-cream`, `t-blush`
- `name`: plain description a person would recognise (no brand needed)
- `cat`: `layer` (jackets, blazers, cardigans), `top`, `bottom`, `dress`
- `kind` for bottoms: `trousers`, `jeans`, `skirt`, `maxiSkirt`
- `color`: a key in `colors`; add new colour keys with realistic hex values taken from the photo
- `fabric`: `matte`, `satin`, `tweed` (also bouclé), `linen`, `knit`, `denim`, `stripe`, `print`, `graphic`
- `formality`: `[min, max]`, 1 = city/casual, 2 = work, 3 = evening
- `seasons`: any of `su` (hot), `ms` (spring/autumn), `wi` (cold)
- `flags` where they apply:
  - `alsoTop` a cardigan you can wear on its own; `alsoLayer` a shirt you can wear open over a top
  - `sleeveless`; `noLayer` (halter or strapless, nothing goes over it); `cropped` (ends at the waist)
  - `longLayer` jacket that covers the hips; `relaxed` jacket that reads casual
  - `fineKnit` smart knit fit for the stage; `mini`; `beltIt` dress worn with a belt; `stage` dress smart enough for a talk
- `printColors` for stripes and prints: one or two hex colours of the pattern

Then add:
- `rules.neutrals` and `rules.lights` from my colours; `allowedAccentPairs` for accent colours that work together in my wardrobe; `clashingPairs` for darks that shouldn’t meet
- 6–12 `favourites` built from the outfits I loved, plus strong combinations you’d recommend
- 2–3 `presets` (packing lists) that suit my life, e.g. a business trip, a city weekend, a beach holiday
- `proportions`: set `raiseWaist` and `lengthenLegs` to `true` or `false` based on what I told you
- `shoes`: a short suggestion for default, evening, summer casual and winter, using shoes I own if I showed them

**Step 4: give me feedback in plain words** (outside the file): what works, what doesn’t fit my style, and at most 3 things worth buying, if any.

**Output rules**
- Return the full file in one code block, starting with `window.WARDROBE = {` and ending with `};`
- Valid JavaScript only: single quotes, commas between items, no comments inside the arrays
- Every id used in favourites and presets must exist in items

**Format to follow**

```js
window.WARDROBE = {
  id: 'me',
  profile: {
    title: 'My Lookbook',
    eyebrow: 'Lookbook · autumn wardrobe',
    headline: 'A light base, *one accent*',
    lede: 'Tick the pieces you’re packing and see every outfit they make.',
    formula: [ { title: 'Light monochrome', text: 'Cream, ivory, champagne.' } ],
    palette: ['cream', 'navy'],
    note: ''
  },
  proportions: { raiseWaist: true, lengthenLegs: true },
  shoes: { default: '', evening: '', summerCasual: '', winter: '' },
  colors: { cream: '#EFE8D8', navy: '#1F2A4D' },
  rules: {
    neutrals: ['cream', 'navy'],
    lights: ['cream'],
    allowedAccentPairs: [],
    clashingPairs: [['black', 'navy']]
  },
  items: [
    { id: 'b-cream', name: 'Cream pleated trousers', cat: 'bottom', kind: 'trousers', color: 'cream', fabric: 'matte', formality: [1, 3], seasons: ['su', 'ms', 'wi'], set: '', flags: [] }
  ],
  favourites: [ { title: 'Cream and navy', layer: '', top: '', bottom: 'b-cream', dress: '' } ],
  presets: [ { name: 'Business trip', climate: 'ms', items: ['b-cream'] } ]
};
```
