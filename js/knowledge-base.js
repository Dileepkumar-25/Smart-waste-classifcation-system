/**
 * EcoSort AI - Waste Knowledge Base & Intelligence Engine
 * Comprehensive database of waste types, disposal rules, impact metrics, and image recognition mappings.
 */

const WASTE_CATEGORIES = {
  plastic: {
    id: "plastic",
    name: "Plastic Material",
    badge: "Recyclable Plastic",
    icon: "recycle",
    color: "#2563eb",
    bgColor: "#eff6ff",
    binName: "Blue Recycling Bin (Plastics & Dry Packaging)",
    binType: "blue",
    recyclable: true,
    score: 92,
    decomposition: "450 - 1,000 Years",
    carbonSavings: "1.8 kg CO₂e saved / kg",
    waterSavings: "26 Liters / kg",
    summary: "Polymer-based packaging including drink bottles, jugs, containers, and rigid packaging.",
    resinCode: "PETE #1, HDPE #2, PP #5",
    preparationSteps: [
      "Empty all remaining liquids or food residues thoroughly.",
      "Give it a quick rinse with greywater to remove grease.",
      "Remove detachable bottle caps (or crush bottle and screw cap tightly).",
      "Compress or flatten the bottle to maximize recycling bin volume.",
      "Place into the Blue Recyclables bin."
    ],
    dos: [
      "Rinse containers clean of residues",
      "Recycle clear and colored beverage bottles",
      "Include shampoo, milk, and detergent jugs"
    ],
    donts: [
      "Do NOT recycle thin plastic shopping bags in curbside bins",
      "Do NOT recycle black plastic trays (optical sorters miss them)",
      "Do NOT place hazardous chemical bottles in regular bin"
    ],
    upcyclingTip: "Convert into self-watering seedling planters, DIY bird feeders, or eco-brick crafting."
  },

  organic: {
    id: "organic",
    name: "Organic & Biodegradable",
    badge: "Compostable Organics",
    icon: "leaf",
    color: "#10b981",
    bgColor: "#ecfdf5",
    binName: "Green Organic & Compost Bin",
    binType: "green",
    recyclable: true,
    score: 98,
    decomposition: "2 - 6 Weeks (in aerobic compost)",
    carbonSavings: "0.5 kg CO₂e avoided / kg (prevents landfill methane)",
    waterSavings: "High soil moisture retention",
    summary: "Biodegradable organic matter including fruit/vegetable scraps, coffee grounds, eggshells, and plant waste.",
    resinCode: "100% Biodegradable Biomass",
    preparationSteps: [
      "Remove non-biodegradable fruit brand stickers, rubber bands, or plastic ties.",
      "Drain excess wet soups or liquids to avoid anaerobic foul odor.",
      "Chop large organic stems or rinds to speed up natural breakdown.",
      "Toss into home compost pile or municipal Green Organics Bin."
    ],
    dos: [
      "Fruit and vegetable scraps, peels, cores",
      "Coffee grounds and unbleached paper filters",
      "Crushed eggshells and garden trimmings"
    ],
    donts: [
      "Do NOT add meat scraps or dairy to basic home composters (attracts pests)",
      "Do NOT include plastic produce stickers or plastic tea bags",
      "Do NOT include pet waste or treated wood"
    ],
    upcyclingTip: "Bury under garden soil to cultivate rich microbial humus, or make citrus vinegar cleaning solution."
  },

  paper: {
    id: "paper",
    name: "Paper & Cardboard",
    badge: "Recyclable Fiber",
    icon: "file-text",
    color: "#d97706",
    bgColor: "#fffbeb",
    binName: "Blue/Brown Paper & Cardboard Bin",
    binType: "brown",
    recyclable: true,
    score: 95,
    decomposition: "2 - 5 Months",
    carbonSavings: "1.3 kg CO₂e saved / kg (saves 17 trees per ton)",
    waterSavings: "26,000 Liters / ton",
    summary: "Cellulose fiber products such as shipping boxes, newsprint, office paper, and corrugated packaging.",
    resinCode: "PAP #20 / #21 Corrugated Fiberboard",
    preparationSteps: [
      "Break down and flatten boxes completely to conserve bin capacity.",
      "Strip off plastic packing tape, bubble wrap, and delivery labels.",
      "Ensure paper is dry and uncontaminated by pizza grease or oils.",
      "Place flat into the Paper / Cardboard recycling stream."
    ],
    dos: [
      "Clean cardboard delivery boxes and egg cartons",
      "Office paper, notebooks, and letters",
      "Newspapers, magazines, and paper bags"
    ],
    donts: [
      "Do NOT recycle greasy pizza boxes (oil ruins the pulp batch)",
      "Do NOT recycle waxed, plastic-laminated cups or thermal receipts",
      "Do NOT recycle wet or moldy paper"
    ],
    upcyclingTip: "Use as weed-suppressing cardboard mulch in garden beds, or shred for compost carbon layer."
  },

  metal: {
    id: "metal",
    name: "Metal & Aluminum",
    badge: "100% Infinitely Recyclable",
    icon: "shield",
    color: "#64748b",
    bgColor: "#f1f5f9",
    binName: "Yellow / Grey Dry Recyclables Bin",
    binType: "yellow",
    recyclable: true,
    score: 99,
    decomposition: "200 - 500 Years",
    carbonSavings: "9.0 kg CO₂e saved / kg (uses 95% less energy than mining)",
    waterSavings: "Prevents toxic bauxite runoff",
    summary: "Ferrous and non-ferrous metals like aluminum beverage cans, tin food cans, and metal jar closures.",
    resinCode: "ALU #41 (Aluminum) / FE #40 (Steel)",
    preparationSteps: [
      "Pour out all liquid or scrape out canned food residues.",
      "Quickly rinse with water; no need for harsh detergents.",
      "Leave pull tabs attached to beverage cans.",
      "Place in the Yellow / Grey dry recycling bin."
    ],
    dos: [
      "Aluminum beverage cans and sparkling water cans",
      "Clean aluminum food trays and foil balls (> 5cm diameter)",
      "Tin soup cans, tuna cans, and steel food tins"
    ],
    donts: [
      "Do NOT put aerosol cans in regular recycling if still pressurized",
      "Do NOT include paint tins with dry chemical residues",
      "Do NOT throw scrap engine metal in household bin"
    ],
    upcyclingTip: "Can be melted down and re-engineered infinitely with zero loss in structural strength."
  },

  glass: {
    id: "glass",
    name: "Glass Packaging",
    badge: "100% Recyclable Glass",
    icon: "sparkles",
    color: "#0d9488",
    bgColor: "#f0fdfa",
    binName: "Glass Bottle & Jar Recycling Bin",
    binType: "teal",
    recyclable: true,
    score: 97,
    decomposition: "1,000,000+ Years (Never biodegrades)",
    carbonSavings: "0.3 kg CO₂e saved / kg",
    waterSavings: "Reduces water pollution by 50%",
    summary: "Container glass like beverage bottles, sauce jars, and olive oil bottles.",
    resinCode: "GL #70 (Clear), #71 (Green), #72 (Brown)",
    preparationSteps: [
      "Rinse out food residues or liquid sauces thoroughly.",
      "Remove metal or plastic twist caps (recycle caps separately).",
      "Keep glass containers intact; do NOT break intentionally.",
      "Drop into color-sorted or dedicated Glass recycling bin."
    ],
    dos: [
      "Clear, brown, and green beverage bottles",
      "Condiment jars (mayo, pasta sauce, jam)",
      "Perfume bottles and glass cosmetic jars"
    ],
    donts: [
      "Do NOT mix ceramics, porcelain, or oven-safe Pyrex (different melt points)",
      "Do NOT recycle broken window panes or mirrors in glass bins",
      "Do NOT include lightbulbs or fluorescent tubes"
    ],
    upcyclingTip: "Sterilize and repurpose as stylish pantry storage jars, spice containers, or flower propagation vials."
  },

  ewaste: {
    id: "ewaste",
    name: "Electronic Waste (E-Waste)",
    badge: "Hazardous Tech Stream",
    icon: "cpu",
    color: "#dc2626",
    bgColor: "#fef2f2",
    binName: "Designated E-Waste Drop-Off Center",
    binType: "red",
    recyclable: true,
    score: 85,
    decomposition: "Non-biodegradable (Toxic leaching risks)",
    carbonSavings: "Recovers precious gold, silver, copper, and rare-earth elements",
    waterSavings: "Prevents heavy metals from poisoning aquifers",
    summary: "Discarded electronics, batteries, power accessories, and circuit boards containing hazardous elements.",
    resinCode: "WEEE Category 1-4",
    preparationSteps: [
      "Do NOT place in curbside rubbish or regular recycling under any circumstance.",
      "Perform a factory reset to wipe all personal data from the device.",
      "Tape battery terminals with electrical tape to avoid fire sparks.",
      "Take to your certified local municipal E-Waste collection kiosk or retailer drop-off."
    ],
    dos: [
      "Mobile phones, tablets, smartwatches, and cables",
      "Rechargeable lithium and household alkaline batteries",
      "Laptops, mice, computer hardware, and chargers"
    ],
    donts: [
      "NEVER throw lithium batteries into trash bins (causes severe garbage truck fires!)",
      "Do NOT crush, puncture, or dismantle swollen batteries",
      "Do NOT leave old electronics in landfills"
    ],
    upcyclingTip: "Check manufacturer trade-in programs for cash credit or donate working gadgets to charity schools."
  },

  hazardous: {
    id: "hazardous",
    name: "Household Hazardous Waste",
    badge: "Dangerous Goods",
    icon: "alert-triangle",
    color: "#b91c1c",
    bgColor: "#fef2f2",
    binName: "Special Chemical & Hazardous Drop-Off",
    binType: "red",
    recyclable: false,
    score: 40,
    decomposition: "Persistent toxic contaminants",
    carbonSavings: "Crucial for drinking water and ecological safety",
    waterSavings: "Protects millions of liters of municipal water",
    summary: "Corrosive, flammable, or toxic chemicals such as motor oils, paints, solvents, and pesticides.",
    resinCode: "HAZ-MAT Class",
    preparationSteps: [
      "Keep the liquid in its original labeled container.",
      "Fasten child-resistant cap securely.",
      "Never mix different chemical products together.",
      "Transport upright to an authorized hazardous waste collection event."
    ],
    dos: [
      "Store in cool, dry, well-ventilated space until collection day",
      "Keep original manufacturer warning labels visible",
      "Utilize local council chemical cleanup drives"
    ],
    donts: [
      "NEVER pour down sinks, toilets, or street gutters",
      "Do NOT throw half-full paint or solvent cans in trash",
      "Do NOT burn chemical packaging"
    ],
    upcyclingTip: "Donate leftover usable interior paint to community theater projects or community tool sheds."
  },

  textile: {
    id: "textile",
    name: "Textiles & Apparel",
    badge: "Reclaimable Fabric",
    icon: "shirt",
    color: "#7c3aed",
    bgColor: "#f5f3ff",
    binName: "Textile Donation Box / Fabric Recycler",
    binType: "purple",
    recyclable: true,
    score: 88,
    decomposition: "Cotton: 5 Months | Polyester/Nylon: 200+ Years",
    carbonSavings: "3.6 kg CO₂e saved per garment reused",
    waterSavings: "2,700 Liters saved per t-shirt diverted",
    summary: "Apparel, footwear, bedding, towels, and scrap textile materials.",
    resinCode: "Natural / Synthetic Blends",
    preparationSteps: [
      "Launder garments and ensure they are clean and bone dry.",
      "Separate wearable clothing from damaged/stained rags.",
      "Place in sealed bags to protect from moisture inside donation bins.",
      "Drop off at local thrift store, clothing drive, or textile recycling depot."
    ],
    dos: [
      "Gently worn wearable shirts, pants, jackets, and shoes",
      "Clean bed sheets, towels, and curtains",
      "Worn fabrics for automotive insulation shredding"
    ],
    donts: [
      "Do NOT deposit damp, oily, or mildewed clothing",
      "Do NOT put clothes in curbside plastic recycling bin"
    ],
    upcyclingTip: "Cut worn t-shirts into durable household cleaning rags or craft braided dog toys."
  }
};

/**
 * Pre-defined sample items for 1-click demonstration
 */
const SAMPLE_ITEMS = [
  {
    id: "plastic_bottle",
    name: "Clear PET Water Bottle",
    category: "plastic",
    confidence: 98.4,
    image: "assets/images/sample_plastic_bottle.jpg",
    description: "Single-use Polyethylene Terephthalate (PETE 1) beverage bottle with screw cap.",
    binColor: "#2563eb",
    co2Saved: "0.08 kg",
    waterSaved: "1.2 L"
  },
  {
    id: "apple_core",
    name: "Organic Apple Core",
    category: "organic",
    confidence: 97.9,
    image: "assets/images/sample_apple_core.jpg",
    description: "Biodegradable organic food residue rich in cellulose, water, and fruit fibers.",
    binColor: "#10b981",
    co2Saved: "0.15 kg",
    waterSaved: "Soil Humus"
  },
  {
    id: "cardboard_box",
    name: "Corrugated Cardboard Box",
    category: "paper",
    confidence: 96.8,
    image: "assets/images/sample_cardboard_box.jpg",
    description: "Post-consumer corrugated brown delivery box stamped with circular recycle arrows.",
    binColor: "#d97706",
    co2Saved: "0.45 kg",
    waterSaved: "9.5 L"
  },
  {
    id: "soda_can",
    name: "Aluminum Soda Can",
    category: "metal",
    confidence: 99.2,
    image: "assets/images/sample_soda_can.jpg",
    description: "Standard aluminum alloy beverage container, 100% infinitely recyclable.",
    binColor: "#64748b",
    co2Saved: "0.22 kg",
    waterSaved: "3.4 L"
  },
  {
    id: "ewaste_device",
    name: "Cracked Smartphone & Battery",
    category: "ewaste",
    confidence: 95.7,
    image: "assets/images/sample_ewaste.jpg",
    description: "Electronic consumer gadget and lithium battery requiring hazardous WEEE recovery.",
    binColor: "#dc2626",
    co2Saved: "1.80 kg",
    waterSaved: "Prevents Leaching"
  },
  {
    id: "glass_bottle",
    name: "Green Glass Beverage Bottle",
    category: "glass",
    confidence: 97.5,
    image: "assets/images/sample_glass_bottle.jpg",
    description: "Clean reusable green container glass bottle, completely inert and recyclable.",
    binColor: "#0d9488",
    co2Saved: "0.31 kg",
    waterSaved: "0.8 L"
  }
];

/**
 * MobileNet ImageNet Label to Waste Category Mapper
 */
const MOBILENET_MAPPINGS = {
  // Plastics
  "water bottle": { category: "plastic", specificName: "Plastic Water Bottle", confidenceBonus: 0.15 },
  "pop bottle": { category: "plastic", specificName: "Plastic Beverage Bottle", confidenceBonus: 0.15 },
  "soda bottle": { category: "plastic", specificName: "Plastic Soda Bottle", confidenceBonus: 0.15 },
  "plastic bag": { category: "plastic", specificName: "Plastic Film / Bag", confidenceBonus: 0.12 },
  "pill bottle": { category: "plastic", specificName: "Plastic Medicine Container", confidenceBonus: 0.15 },
  "measuring cup": { category: "plastic", specificName: "Rigid Plastic Container", confidenceBonus: 0.1 },
  "bucket": { category: "plastic", specificName: "Heavy Plastic Tub / Bucket", confidenceBonus: 0.1 },
  "lotion": { category: "plastic", specificName: "Cosmetic / Lotion Dispenser", confidenceBonus: 0.12 },
  "shampoo": { category: "plastic", specificName: "Plastic Shampoo Bottle", confidenceBonus: 0.15 },
  "detergent": { category: "plastic", specificName: "HDPE Detergent Bottle", confidenceBonus: 0.15 },
  "cup": { category: "plastic", specificName: "Plastic Cup / Container", confidenceBonus: 0.1 },
  "straw": { category: "plastic", specificName: "Plastic Straw", confidenceBonus: 0.1 },

  // Organics
  "banana": { category: "organic", specificName: "Banana Peel / Fruit Scrap", confidenceBonus: 0.2 },
  "apple": { category: "organic", specificName: "Apple Core / Residue", confidenceBonus: 0.2 },
  "orange": { category: "organic", specificName: "Citrus Peel / Fruit Scrap", confidenceBonus: 0.2 },
  "lemon": { category: "organic", specificName: "Citrus Scrap", confidenceBonus: 0.2 },
  "strawberry": { category: "organic", specificName: "Organic Berry Scrap", confidenceBonus: 0.18 },
  "pineapple": { category: "organic", specificName: "Pineapple Rind / Core", confidenceBonus: 0.2 },
  "corn": { category: "organic", specificName: "Corn Husk / Cob", confidenceBonus: 0.15 },
  "cucumber": { category: "organic", specificName: "Vegetable Residue", confidenceBonus: 0.15 },
  "zucchini": { category: "organic", specificName: "Vegetable Peels", confidenceBonus: 0.15 },
  "bell pepper": { category: "organic", specificName: "Vegetable Scrap", confidenceBonus: 0.15 },
  "broccoli": { category: "organic", specificName: "Organic Vegetable Stem", confidenceBonus: 0.15 },
  "cabbage": { category: "organic", specificName: "Leaf Vegetable Scrap", confidenceBonus: 0.15 },
  "mushroom": { category: "organic", specificName: "Organic Fungi Scrap", confidenceBonus: 0.15 },
  "pizza": { category: "organic", specificName: "Food Waste / Leftover Crust", confidenceBonus: 0.1 },
  "bagel": { category: "organic", specificName: "Bread / Bakery Food Waste", confidenceBonus: 0.15 },
  "burrito": { category: "organic", specificName: "Organic Food Waste", confidenceBonus: 0.1 },
  "sandwich": { category: "organic", specificName: "Organic Food Residue", confidenceBonus: 0.1 },
  "flower": { category: "organic", specificName: "Yard / Garden Biomass", confidenceBonus: 0.15 },
  "hay": { category: "organic", specificName: "Garden Green Waste", confidenceBonus: 0.15 },

  // Paper / Cardboard
  "carton": { category: "paper", specificName: "Corrugated Cardboard Box", confidenceBonus: 0.2 },
  "packet": { category: "paper", specificName: "Paperboard Packaging", confidenceBonus: 0.12 },
  "envelope": { category: "paper", specificName: "Paper Envelope / Document", confidenceBonus: 0.15 },
  "newspaper": { category: "paper", specificName: "Newspaper / Newsprint", confidenceBonus: 0.2 },
  "book jacket": { category: "paper", specificName: "Printed Paper Cardboard", confidenceBonus: 0.15 },
  "comic book": { category: "paper", specificName: "Magazines / Glossy Paper", confidenceBonus: 0.15 },
  "menu": { category: "paper", specificName: "Paper / Card Stock", confidenceBonus: 0.15 },
  "binder": { category: "paper", specificName: "Stationery / Paperboard", confidenceBonus: 0.1 },
  "notebook": { category: "paper", specificName: "Paper Notebook", confidenceBonus: 0.15 },
  "paper towel": { category: "paper", specificName: "Paper Towel (Compostable)", confidenceBonus: 0.12 },
  "toilet tissue": { category: "paper", specificName: "Tissue Paper", confidenceBonus: 0.12 },

  // Metals
  "can": { category: "metal", specificName: "Aluminum Beverage Can", confidenceBonus: 0.2 },
  "beer can": { category: "metal", specificName: "Aluminum Beverage Can", confidenceBonus: 0.2 },
  "tin can": { category: "metal", specificName: "Steel / Tin Food Can", confidenceBonus: 0.2 },
  "thimble": { category: "metal", specificName: "Small Metal Scrap", confidenceBonus: 0.1 },
  "pan": { category: "metal", specificName: "Metal Cookware Scrap", confidenceBonus: 0.12 },
  "pot": { category: "metal", specificName: "Metal Vessel", confidenceBonus: 0.1 },
  "safety pin": { category: "metal", specificName: "Metal Fastener", confidenceBonus: 0.1 },
  "whistle": { category: "metal", specificName: "Metal Hardware", confidenceBonus: 0.1 },
  "wrench": { category: "metal", specificName: "Scrap Tool Metal", confidenceBonus: 0.1 },
  "nail": { category: "metal", specificName: "Metal Hardware", confidenceBonus: 0.1 },

  // Glass
  "wine bottle": { category: "glass", specificName: "Glass Wine Bottle", confidenceBonus: 0.2 },
  "beer bottle": { category: "glass", specificName: "Glass Beverage Bottle", confidenceBonus: 0.2 },
  "whiskey bottle": { category: "glass", specificName: "Glass Liquor Bottle", confidenceBonus: 0.2 },
  "goblet": { category: "glass", specificName: "Glass Drinkware", confidenceBonus: 0.12 },
  "vase": { category: "glass", specificName: "Decorative Glassware", confidenceBonus: 0.12 },
  "pitcher": { category: "glass", specificName: "Glass Carafe", confidenceBonus: 0.12 },
  "jar": { category: "glass", specificName: "Glass Condiment Jar", confidenceBonus: 0.2 },
  "cocktail shaker": { category: "glass", specificName: "Glassware / Mixed", confidenceBonus: 0.1 },

  // E-Waste
  "cellular telephone": { category: "ewaste", specificName: "Smartphone / Mobile Phone", confidenceBonus: 0.2 },
  "mobile phone": { category: "ewaste", specificName: "Smartphone / Cell Phone", confidenceBonus: 0.2 },
  "smart phone": { category: "ewaste", specificName: "Smartphone / Handset", confidenceBonus: 0.2 },
  "dial telephone": { category: "ewaste", specificName: "Electronic Communication Equipment", confidenceBonus: 0.15 },
  "laptop": { category: "ewaste", specificName: "Laptop / Portable Computer", confidenceBonus: 0.2 },
  "notebook computer": { category: "ewaste", specificName: "Personal Computer Hardware", confidenceBonus: 0.2 },
  "keyboard": { category: "ewaste", specificName: "Computer Peripherals / Keyboards", confidenceBonus: 0.15 },
  "mouse": { category: "ewaste", specificName: "Electronic Computer Mouse", confidenceBonus: 0.15 },
  "iPod": { category: "ewaste", specificName: "Portable Media Device", confidenceBonus: 0.18 },
  "remote control": { category: "ewaste", specificName: "Electronic Remote / Battery Unit", confidenceBonus: 0.15 },
  "hard disc": { category: "ewaste", specificName: "Computer Storage Drive", confidenceBonus: 0.18 },
  "screen": { category: "ewaste", specificName: "Electronic Display / Monitor", confidenceBonus: 0.18 },
  "monitor": { category: "ewaste", specificName: "Computer Monitor", confidenceBonus: 0.18 },
  "television": { category: "ewaste", specificName: "Television / CRT Display", confidenceBonus: 0.18 },
  "battery": { category: "ewaste", specificName: "Dry Cell Battery", confidenceBonus: 0.25 },
  "power drill": { category: "ewaste", specificName: "Power Tool (WEEE)", confidenceBonus: 0.15 },

  // Textiles
  "jersey": { category: "textile", specificName: "Knitwear / Clothing Fabric", confidenceBonus: 0.15 },
  "jean": { category: "textile", specificName: "Denim Garment", confidenceBonus: 0.18 },
  "sweatshirt": { category: "textile", specificName: "Apparel / Cotton Blend", confidenceBonus: 0.15 },
  "t-shirt": { category: "textile", specificName: "Cotton T-Shirt Fabric", confidenceBonus: 0.18 },
  "sock": { category: "textile", specificName: "Woven Textile Scrap", confidenceBonus: 0.15 },
  "coat": { category: "textile", specificName: "Outerwear / Garment", confidenceBonus: 0.15 }
};

// Export to window object for access across modules
window.WASTE_CATEGORIES = WASTE_CATEGORIES;
window.SAMPLE_ITEMS = SAMPLE_ITEMS;
window.MOBILENET_MAPPINGS = MOBILENET_MAPPINGS;
