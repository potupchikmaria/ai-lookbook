/* ============================================================
   YOUR WARDROBE
   This is the only file you need to edit. Easiest way: give
   PROMPT.md and photos of your clothes to an AI assistant and
   paste what it returns over this file.
   ============================================================ */
window.WARDROBE = {
  id: 'example',   // short name; keeps each wardrobe's saved selections separate

  profile: {
    title: 'My Lookbook',
    eyebrow: 'Lookbook · example wardrobe',
    headline: 'A light base, *one accent*',          // *text* is shown in italics
    lede: 'Tick the pieces you’re packing and see every outfit they make. Then lay them out day by day, with no repeats.',
    formula: [
      { title: 'Light monochrome', text: 'Cream, ivory, champagne. The strongest formula in this wardrobe.' },
      { title: 'High waist', text: 'Tops tucked in or cropped, high-rise bottoms, a belt at the narrowest point.' },
      { title: 'Sheen + matte', text: 'Satin works best next to tweed, linen and knitwear.' }
    ],
    palette: ['cream', 'white', 'champagne', 'blush', 'navy', 'cornflower', 'cobalt', 'plum', 'burgundy', 'chocolate'],
    note: 'Example wardrobe. Replace it with your own using PROMPT.md.'
  },

  // Optional styling hints shown on each outfit card
  proportions: { raiseWaist: true, lengthenLegs: true },
  shoes: { default: 'Nude pointed slingbacks', evening: 'Strappy heeled sandals or nude slingbacks', summerCasual: 'Sandals or nude slingbacks', winter: 'Heeled ankle boots or knee boots' },

  // Colour names used below, with the hex used for the swatch
  colors: {
    cream: '#EFE8D8', white: '#FAFAF6', beige: '#DAD1BF', champagne: '#EED8C2', blush: '#E6C1B9', tweed: '#D9D1C0',
    black: '#1B1B1E', navy: '#1F2A4D', denim: '#2F4468', chocolate: '#4A2C1D',
    cornflower: '#5A7ED6', cobalt: '#2445C6', raspberry: '#D41A40', plum: '#5E1A33', burgundy: '#6B1730',
    lavender: '#B9A8D6', dustyblue: '#A9BFD6', bluestripe: '#F7F8FC', navyprint: '#2B3A7A'
  },

  // How colours combine. Neutrals go with anything; only one accent per outfit unless the pair is allowed.
  rules: {
    neutrals: ['cream', 'white', 'beige', 'champagne', 'blush', 'tweed', 'black', 'navy', 'denim', 'chocolate'],
    lights: ['cream', 'white', 'beige', 'champagne', 'blush', 'tweed'],
    allowedAccentPairs: [['cobalt', 'bluestripe'], ['cornflower', 'bluestripe'], ['dustyblue', 'bluestripe'], ['dustyblue', 'lavender']],
    clashingPairs: [['black', 'navy'], ['black', 'chocolate']]
  },

  /* Items
     cat:       'layer' | 'top' | 'bottom' | 'dress'
     color:     a key from `colors`
     fabric:    'matte' | 'satin' | 'tweed' | 'linen' | 'knit' | 'denim' | 'stripe' | 'print' | 'graphic'
     formality: [min, max] where 1 = city/casual, 2 = work, 3 = evening
     seasons:   any of 'su' (hot), 'ms' (spring/autumn), 'wi' (cold)
     set:       pieces with the same set name always go together (suits, co-ords)
     kind:      for bottoms: 'trousers' | 'jeans' | 'skirt' | 'maxiSkirt'
     flags:     alsoTop, alsoLayer, sleeveless, noLayer, cropped, longLayer, relaxed, fineKnit, mini, beltIt, stage
     printColors: optional [colour1, colour2] for stripes and prints */
  items: [
    { id: 'j-cream', name: 'Cream blazer', cat: 'layer', color: 'cream', fabric: 'matte', formality: [2, 3], seasons: ['su', 'ms', 'wi'], set: 'cream', flags: ['longLayer'] },
    { id: 'j-black', name: 'Black double-breasted blazer', cat: 'layer', color: 'black', fabric: 'matte', formality: [1, 3], seasons: ['ms', 'wi'], set: 'blacksuit', flags: ['longLayer'] },
    { id: 'j-corn', name: 'Cornflower blazer', cat: 'layer', color: 'cornflower', fabric: 'matte', formality: [1, 3], seasons: ['su', 'ms'], set: 'corn', flags: ['longLayer'] },
    { id: 'j-red', name: 'Raspberry blazer', cat: 'layer', color: 'raspberry', fabric: 'matte', formality: [1, 2], seasons: ['ms'], set: 'red', flags: ['longLayer'] },
    { id: 'j-feather', name: 'Navy satin jacket with feather cuffs', cat: 'layer', color: 'navy', fabric: 'satin', formality: [1, 3], seasons: ['su', 'ms', 'wi'], set: 'navysat', flags: ['longLayer'] },
    { id: 'j-boucle', name: 'Navy bouclé jacket, gold buttons', cat: 'layer', color: 'navy', fabric: 'tweed', formality: [1, 3], seasons: ['su', 'ms', 'wi'], flags: ['relaxed'] },
    { id: 'c-polo', name: 'White ribbed polo cardigan', cat: 'layer', color: 'white', fabric: 'knit', formality: [1, 2], seasons: ['su', 'ms', 'wi'], flags: ['alsoTop', 'longLayer'] },

    { id: 't-blush', name: 'Blush satin shirt', cat: 'top', color: 'blush', fabric: 'satin', formality: [1, 3], seasons: ['su', 'ms', 'wi'] },
    { id: 't-navysat', name: 'Navy satin shirt', cat: 'top', color: 'navy', fabric: 'satin', formality: [1, 3], seasons: ['su', 'ms', 'wi'] },
    { id: 't-blacksat', name: 'Black satin shirt', cat: 'top', color: 'black', fabric: 'satin', formality: [1, 3], seasons: ['ms', 'wi'] },
    { id: 't-choc', name: 'Chocolate pussy-bow blouse', cat: 'top', color: 'chocolate', fabric: 'satin', formality: [2, 3], seasons: ['ms', 'wi'] },
    { id: 't-plum', name: 'Plum blouse', cat: 'top', color: 'plum', fabric: 'matte', formality: [1, 3], seasons: ['ms', 'wi'] },
    { id: 't-stripe', name: 'Blue striped shirt', cat: 'top', color: 'bluestripe', fabric: 'stripe', printColors: ['#4F78D8'], formality: [1, 2], seasons: ['su', 'ms'], flags: ['alsoLayer'] },
    { id: 't-cobalt', name: 'Cobalt satin shirt', cat: 'top', color: 'cobalt', fabric: 'satin', formality: [1, 3], seasons: ['su', 'ms'], set: 'cobalt', flags: ['alsoLayer'] },
    { id: 't-tunic', name: 'White poplin shirt', cat: 'top', color: 'white', fabric: 'matte', formality: [1, 2], seasons: ['su', 'ms', 'wi'] },
    { id: 't-lace', name: 'White shirt with lace cuffs', cat: 'top', color: 'white', fabric: 'matte', formality: [2, 3], seasons: ['su', 'ms', 'wi'] },
    { id: 't-turtle', name: 'White sleeveless roll-neck', cat: 'top', color: 'white', fabric: 'knit', formality: [1, 3], seasons: ['su', 'ms', 'wi'], flags: ['sleeveless', 'fineKnit'] },
    { id: 't-linen', name: 'Linen cropped top', cat: 'top', color: 'beige', fabric: 'linen', formality: [1, 1], seasons: ['su'], set: 'linen', flags: ['sleeveless', 'cropped'] },
    { id: 't-bow', name: 'White halter top with bow', cat: 'top', color: 'white', fabric: 'matte', formality: [2, 3], seasons: ['su', 'ms'], flags: ['sleeveless', 'noLayer', 'cropped'] },
    { id: 't-tweedpep', name: 'Tweed peplum jacket', cat: 'top', color: 'tweed', fabric: 'tweed', formality: [2, 3], seasons: ['su', 'ms'], set: 'tweedsuit', flags: ['sleeveless', 'noLayer', 'cropped'] },
    { id: 't-puff', name: 'White puff-sleeve blouse', cat: 'top', color: 'white', fabric: 'matte', formality: [1, 2], seasons: ['su', 'ms'] },

    { id: 'b-cream', name: 'Cream pleated trousers', cat: 'bottom', kind: 'trousers', color: 'cream', fabric: 'matte', formality: [1, 3], seasons: ['su', 'ms', 'wi'], set: 'cream' },
    { id: 'b-black', name: 'Black flared trousers', cat: 'bottom', kind: 'trousers', color: 'black', fabric: 'matte', formality: [2, 3], seasons: ['ms', 'wi'], set: 'blacksuit' },
    { id: 'b-corn', name: 'Cornflower trousers', cat: 'bottom', kind: 'trousers', color: 'cornflower', fabric: 'matte', formality: [2, 3], seasons: ['su', 'ms'], set: 'corn' },
    { id: 'b-red', name: 'Raspberry belted trousers', cat: 'bottom', kind: 'trousers', color: 'raspberry', fabric: 'matte', formality: [1, 2], seasons: ['ms'], set: 'red' },
    { id: 'b-navysat', name: 'Navy satin trousers', cat: 'bottom', kind: 'trousers', color: 'navy', fabric: 'satin', formality: [1, 3], seasons: ['su', 'ms', 'wi'], set: 'navysat' },
    { id: 'b-cobalt', name: 'Cobalt drawstring trousers', cat: 'bottom', kind: 'trousers', color: 'cobalt', fabric: 'satin', formality: [1, 2], seasons: ['su', 'ms'], set: 'cobalt' },
    { id: 'b-jeans', name: 'Dark jeans', cat: 'bottom', kind: 'jeans', color: 'denim', fabric: 'denim', formality: [1, 2], seasons: ['su', 'ms', 'wi'] },
    { id: 'b-white', name: 'White trousers', cat: 'bottom', kind: 'trousers', color: 'white', fabric: 'matte', formality: [1, 3], seasons: ['su', 'ms'] },
    { id: 'b-tweedskirt', name: 'Tweed flounce skirt', cat: 'bottom', kind: 'skirt', color: 'tweed', fabric: 'tweed', formality: [1, 3], seasons: ['ms', 'wi'] },
    { id: 'b-tweedpencil', name: 'Tweed pencil skirt', cat: 'bottom', kind: 'skirt', color: 'tweed', fabric: 'tweed', formality: [2, 3], seasons: ['su', 'ms'], set: 'tweedsuit' },
    { id: 'b-satskirt', name: 'Dusty-blue satin skirt', cat: 'bottom', kind: 'skirt', color: 'dustyblue', fabric: 'satin', formality: [1, 3], seasons: ['su', 'ms'] },
    { id: 'b-navyskirt', name: 'Navy satin midi skirt', cat: 'bottom', kind: 'skirt', color: 'navy', fabric: 'satin', formality: [1, 3], seasons: ['su', 'ms', 'wi'] },
    { id: 'b-linenskirt', name: 'Linen maxi skirt', cat: 'bottom', kind: 'maxiSkirt', color: 'beige', fabric: 'linen', formality: [1, 1], seasons: ['su'], set: 'linen' },

    { id: 'd-tweed', name: 'Cream tweed mini dress', cat: 'dress', color: 'cream', fabric: 'tweed', formality: [2, 3], seasons: ['su', 'ms'], flags: ['mini', 'stage'] },
    { id: 'd-champ', name: 'Champagne slip dress', cat: 'dress', color: 'champagne', fabric: 'satin', formality: [3, 3], seasons: ['su', 'ms'] },
    { id: 'd-burg', name: 'Burgundy satin dress', cat: 'dress', color: 'burgundy', fabric: 'satin', formality: [2, 3], seasons: ['ms', 'wi'], flags: ['stage'] },
    { id: 'd-print', name: 'Printed shirt dress', cat: 'dress', color: 'navyprint', fabric: 'print', printColors: ['#D4A43A', '#E7A0B0'], formality: [1, 2], seasons: ['su', 'ms'], flags: ['beltIt'] }
  ],

  // Outfits you already know work. Use item ids.
  favourites: [
    { title: 'Cream suit and white roll-neck', layer: 'j-cream', top: 't-turtle', bottom: 'b-cream' },
    { title: 'Cream suit and chocolate blouse', layer: 'j-cream', top: 't-choc', bottom: 'b-cream' },
    { title: 'Almost Chanel', layer: 'j-cream', top: 't-turtle', bottom: 'b-tweedskirt' },
    { title: 'Bouclé, satin skirt and belt', layer: 'j-boucle', top: 't-tunic', bottom: 'b-navyskirt' },
    { title: 'Black blazer and lace cuffs', layer: 'j-black', top: 't-lace', bottom: 'b-black' },
    { title: 'Cobalt over linen', layer: 't-cobalt', top: 't-linen', bottom: 'b-cobalt' },
    { title: 'Tweed peplum suit', top: 't-tweedpep', bottom: 'b-tweedpencil' },
    { title: 'Tweed dress', dress: 'd-tweed' },
    { title: 'Burgundy satin dress', dress: 'd-burg' }
  ],

  // One-tap packing lists
  presets: [
    { name: 'Winter to summer', climate: 'su', items: ['t-linen', 'b-linenskirt', 't-cobalt', 'b-cobalt', 'b-white', 't-stripe', 't-blush', 't-turtle', 'd-champ', 'c-polo', 'b-cream'] },
    { name: 'Business trip', climate: 'ms', items: ['j-cream', 'b-cream', 'j-black', 'b-black', 't-blush', 't-navysat', 't-turtle', 't-tunic', 't-choc', 'b-jeans', 'd-burg'] },
    { name: 'City weekend', climate: 'ms', items: ['j-boucle', 'b-jeans', 'b-cream', 't-stripe', 't-blush', 'c-polo', 't-turtle', 'b-tweedskirt', 'd-tweed'] }
  ]
};
