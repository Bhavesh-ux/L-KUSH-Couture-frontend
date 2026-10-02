export const initialProducts = [
  {
    id: "lk-001",
    name: "Royal Velvet Zardozi Sherwani",
    category: "Sherwani",
    categoryId: "sherwani",
    description: "Handcrafted in sumptuous midnight velvet, this sherwani features antique gold dabka and zardozi embroidery along the mandarin collar and cuffs, paired with a chanderi silk churidar.",
    price: 34999,
    originalPrice: 42999,
    discount: 18,
    rating: 4.9,
    reviewCount: 38,
    images: [
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "Midnight Navy", hex: "#1A2536" },
      { name: "Royal Obsidian", hex: "#1B1B1E" },
      { name: "Regal Maroon", hex: "#4A0E17" }
    ],
    stock: 12,
    featured: true,
    newArrival: true,
    trending: true,
    tags: ["Sherwani", "Wedding", "Royal", "Velvet", "Handcrafted"],
    fabric: "Premium Micro-Velvet & Chanderi Silk",
    care: "Dry Clean Only",
    fit: "Tailored Royal Silhouette"
  },
  {
    id: "lk-002",
    name: "Raw Silk Ivory Kurta Pajama Set",
    category: "Kurta Pajama",
    categoryId: "kurta-pajama",
    description: "An epitome of understated luxury, woven from pure tussar raw silk with fine tone-on-tone resham thread detailing on the placket and a crisp matching silk trouser.",
    price: 11499,
    originalPrice: 14999,
    discount: 23,
    rating: 4.8,
    reviewCount: 42,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Ivory Pearl", hex: "#FDFBF7" },
      { name: "Warm Champagne", hex: "#E8DEC8" },
      { name: "Soft Sage", hex: "#CBD5C0" }
    ],
    stock: 18,
    featured: true,
    newArrival: true,
    trending: false,
    tags: ["Kurta Pajama", "Festive", "Raw Silk", "Minimalist"],
    fabric: "100% Pure Raw Tussar Silk",
    care: "Dry Clean Only",
    fit: "Regular Comfort Fit"
  },
  {
    id: "lk-003",
    name: "Asymmetric Draped Indo-Western Jacket",
    category: "Indo-Western",
    categoryId: "indo-western",
    description: "Sculpted with contemporary diagonal buttoning and fluid side pleating, styled over an ivory silk cowl kurta and fitted narrow trousers.",
    price: 21999,
    originalPrice: 26999,
    discount: 18,
    rating: 4.9,
    reviewCount: 29,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Charcoal Slate", hex: "#2E3138" },
      { name: "Deep Wine", hex: "#471927" },
      { name: "Emerald Forest", hex: "#16382B" }
    ],
    stock: 9,
    featured: true,
    newArrival: false,
    trending: true,
    tags: ["Indo-Western", "Cocktail", "Draped", "Designer"],
    fabric: "Fine Italian Wool Blend & Silk Georgette",
    care: "Dry Clean Only",
    fit: "Modern Structured Slim"
  },
  {
    id: "lk-004",
    name: "Heritage Benarasi Brocade Achkan",
    category: "Wedding",
    categoryId: "wedding",
    description: "Woven in authentic Varanasi brocade looms with royal floral motifs in spun gold zari, complete with jeweled metallic buttons.",
    price: 38999,
    originalPrice: 47999,
    discount: 19,
    rating: 5.0,
    reviewCount: 31,
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["40", "42", "44", "46"],
    colors: [
      { name: "Antique Gold", hex: "#C5A059" },
      { name: "Crimson Royal", hex: "#630B1C" }
    ],
    stock: 7,
    featured: true,
    newArrival: false,
    trending: true,
    tags: ["Wedding", "Brocade", "Benarasi", "Groom Couture"],
    fabric: "Pure Varanasi Katan Silk Brocade",
    care: "Dry Clean Only",
    fit: "Classic Imperial Achkan"
  },
  {
    id: "lk-005",
    name: "Ethereal Chikankari Pastel Kurta",
    category: "Kurta",
    categoryId: "kurta",
    description: "Delicate Lucknowi shadow and tepchi embroidery over lightweight mulmul cotton silk, featuring subtle mukaish highlights that glisten in sunlight.",
    price: 8999,
    originalPrice: 10999,
    discount: 18,
    rating: 4.7,
    reviewCount: 54,
    images: [
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "Powder Blush", hex: "#E8C8C8" },
      { name: "Sky Azure", hex: "#C5D8E8" },
      { name: "Pistachio Mint", hex: "#CFE3CE" }
    ],
    stock: 22,
    featured: false,
    newArrival: true,
    trending: true,
    tags: ["Kurta", "Chikankari", "Festive", "Pastel", "Summer Luxury"],
    fabric: "Mulmul Silk Blend",
    care: "Gentle Hand Wash or Dry Clean",
    fit: "Easy Breeze Fit"
  },
  {
    id: "lk-006",
    name: "Bespoke Jacquard Evening Bandhgala",
    category: "Blazer",
    categoryId: "blazer",
    description: "A striking tailored black-tie bandhgala jacket crafted from woven micro-jacquard fabric with satin piped collars and gold filigree buttons.",
    price: 18499,
    originalPrice: 22999,
    discount: 19,
    rating: 4.8,
    reviewCount: 26,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Onyx Black", hex: "#121214" },
      { name: "Midnight Indigo", hex: "#161E33" }
    ],
    stock: 14,
    featured: false,
    newArrival: false,
    trending: true,
    tags: ["Blazer", "Bandhgala", "Formal", "Black Tie"],
    fabric: "Micro-Jacquard Poly-Viscose with Silk Satin Trims",
    care: "Dry Clean Only",
    fit: "Tailored Sharp Fit"
  },
  {
    id: "lk-007",
    name: "Embroidered Maroon Jodhpuri Set",
    category: "Indo-Western",
    categoryId: "indo-western",
    description: "Classic high-neck Jodhpuri coat rendered in fine cashmere blend with rich copper bullion embroidery across shoulder line and sleeves.",
    price: 26499,
    originalPrice: 32000,
    discount: 17,
    rating: 4.9,
    reviewCount: 33,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "Royal Burgundy", hex: "#420F1D" },
      { name: "Imperial Teal", hex: "#0E3133" }
    ],
    stock: 8,
    featured: true,
    newArrival: false,
    trending: false,
    tags: ["Jodhpuri", "Indo-Western", "Celebration", "Embroidery"],
    fabric: "Superfine Cashmere Blend",
    care: "Dry Clean Only",
    fit: "Regal Structured Fit"
  },
  {
    id: "lk-008",
    name: "Rose Gold Sequin Festive Kurta",
    category: "Festive",
    categoryId: "festive",
    description: "A celebration showstopper featuring all-over micro-sequin scatter on soft georgette lining, paired with tailored straight-cut silk pants.",
    price: 13999,
    originalPrice: 16999,
    discount: 17,
    rating: 4.8,
    reviewCount: 47,
    images: [
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Rose Gold", hex: "#C7938B" },
      { name: "Gilded Amber", hex: "#C29B38" }
    ],
    stock: 16,
    featured: true,
    newArrival: true,
    trending: true,
    tags: ["Festive", "Sequin", "Diwali", "Sangeet", "Kurta"],
    fabric: "Sequined Georgette with Pure Cotton Lining",
    care: "Dry Clean Only",
    fit: "Fluid Modern Fit"
  },
  {
    id: "lk-009",
    name: "Emerald Green Silk Dhoti Kurta Set",
    category: "Festive",
    categoryId: "festive",
    description: "Deep jewel-tone emerald silk kurta paired with a pre-draped pleated dhoti pant bordered in heritage gota patti gold ribbons.",
    price: 14499,
    originalPrice: 17999,
    discount: 19,
    rating: 4.9,
    reviewCount: 22,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Emerald Jewel", hex: "#114732" },
      { name: "Royal Mustard", hex: "#C79316" }
    ],
    stock: 11,
    featured: false,
    newArrival: false,
    trending: false,
    tags: ["Festive", "Dhoti Kurta", "Silk", "Traditional"],
    fabric: "Mulberry Silk and Zari Border",
    care: "Dry Clean Only",
    fit: "Pleated Traditional Draped"
  },
  {
    id: "lk-010",
    name: "Imperial Brocade Groom Wedding Sherwani",
    category: "Wedding",
    categoryId: "wedding",
    description: "Crafted specifically for the quintessential Indian groom. Features dense hand-stitched French knots, pearls, and zardozi cresting on antique ivory brocade.",
    price: 45999,
    originalPrice: 54999,
    discount: 16,
    rating: 5.0,
    reviewCount: 39,
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["40", "42", "44", "46"],
    colors: [
      { name: "Antique Cream Gold", hex: "#EBE3CE" },
      { name: "Vintage Rose Quartz", hex: "#D4B4B4" }
    ],
    stock: 5,
    featured: true,
    newArrival: false,
    trending: true,
    tags: ["Wedding", "Sherwani", "Groom", "Royal", "Brocade"],
    fabric: "Pure Silk Brocade with Hand Embroidery",
    care: "Dry Clean Only",
    fit: "Imperial Groom Cut"
  },
  {
    id: "lk-011",
    name: "Contemporary Textured Tuxedo Blazer",
    category: "Party Wear",
    categoryId: "party-wear",
    description: "Modern single-breasted evening tuxedo jacket with shawl lapels in black silk satin and textured diamond weave body.",
    price: 16999,
    originalPrice: 20999,
    discount: 19,
    rating: 4.8,
    reviewCount: 19,
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Midnight Raven", hex: "#111116" },
      { name: "Cobalt Night", hex: "#17254A" }
    ],
    stock: 15,
    featured: false,
    newArrival: true,
    trending: true,
    tags: ["Party Wear", "Tuxedo", "Cocktail", "Evening"],
    fabric: "Textured Poly-Wool Blend with Satin Lapel",
    care: "Dry Clean Only",
    fit: "European Slim Fit"
  },
  {
    id: "lk-012",
    name: "Mirror Embroidered Sangeet Kurta",
    category: "Kurta",
    categoryId: "kurta",
    description: "Handcrafted real mirror work embedded across geometric yoke patterns on rich crimson viscose raw silk base.",
    price: 10499,
    originalPrice: 12999,
    discount: 19,
    rating: 4.7,
    reviewCount: 31,
    images: [
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "Crimson Ruby", hex: "#6E1321" },
      { name: "Turquoise Azure", hex: "#1A5766" }
    ],
    stock: 17,
    featured: false,
    newArrival: false,
    trending: true,
    tags: ["Kurta", "Mirror Work", "Sangeet", "Festive"],
    fabric: "Viscose Raw Silk",
    care: "Dry Clean Only",
    fit: "Comfort Traditional Fit"
  },
  {
    id: "lk-013",
    name: "Classic Silk Bundi Waistcoat Set",
    category: "Kurta Pajama",
    categoryId: "kurta-pajama",
    description: "A three-piece luxury ensemble comprising a tailored raw silk Nehru jacket/bundi, crisp cotton-silk kurta, and tapered churidar.",
    price: 15999,
    originalPrice: 18999,
    discount: 15,
    rating: 4.8,
    reviewCount: 37,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "Warm Ochre", hex: "#B8832A" },
      { name: "Olive Moss", hex: "#4A5239" },
      { name: "Ivory White", hex: "#F7F5F0" }
    ],
    stock: 20,
    featured: true,
    newArrival: false,
    trending: false,
    tags: ["Kurta Pajama", "Nehru Jacket", "Bundi", "Classic"],
    fabric: "Raw Silk Bundi & Cotton-Silk Base",
    care: "Dry Clean Only",
    fit: "Tailored Layered Fit"
  },
  {
    id: "lk-014",
    name: "Velvet Peak Lapel Dinner Jacket",
    category: "Blazer",
    categoryId: "blazer",
    description: "Opulent Italian velvet jacket with peak lapels, double back vents, and custom monogram gold lining for prestigious gatherings.",
    price: 19999,
    originalPrice: 24999,
    discount: 20,
    rating: 4.9,
    reviewCount: 28,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Bottle Green", hex: "#0F382A" },
      { name: "Royal Damson", hex: "#3B1828" }
    ],
    stock: 8,
    featured: false,
    newArrival: true,
    trending: false,
    tags: ["Blazer", "Velvet", "Formal Wear", "Party Wear"],
    fabric: "100% Cotton Velvet",
    care: "Dry Clean Only",
    fit: "Slim Structured Fit"
  },
  {
    id: "lk-015",
    name: "Pleated Angrakha Style Indo-Western",
    category: "Indo-Western",
    categoryId: "indo-western",
    description: "An aristocratic overlapping Angrakha silhouette with delicate golden cord tie-ups, rendered in fine mulberry silk with gold thread embroidery.",
    price: 23999,
    originalPrice: 28999,
    discount: 17,
    rating: 4.9,
    reviewCount: 25,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Champagne Gold", hex: "#D6C7A1" },
      { name: "Deep Charcoal", hex: "#22242B" }
    ],
    stock: 10,
    featured: true,
    newArrival: true,
    trending: true,
    tags: ["Indo-Western", "Angrakha", "Royal", "Occasion"],
    fabric: "Mulberry Silk Blend",
    care: "Dry Clean Only",
    fit: "Draped Angrakha Silhouette"
  },
  {
    id: "lk-016",
    name: "Matte Black Minimalist Bandhgala",
    category: "Formal Wear",
    categoryId: "formal-wear",
    description: "A masterclass in modern Indian minimalism. Pristine tailoring in matte wrinkle-resistant tropical wool with discreet concealed horn buttons.",
    price: 17499,
    originalPrice: 21999,
    discount: 20,
    rating: 4.8,
    reviewCount: 34,
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "Matte Jet Black", hex: "#0E0E10" },
      { name: "Deep Oxford Navy", hex: "#141B2D" }
    ],
    stock: 16,
    featured: false,
    newArrival: false,
    trending: false,
    tags: ["Formal Wear", "Bandhgala", "Minimalist", "Business"],
    fabric: "Super 120s Tropical Wool",
    care: "Dry Clean Only",
    fit: "Custom Sharp Fit"
  },
  {
    id: "lk-017",
    name: "Hand-Painted Kalamkari Silk Kurta",
    category: "Kurta",
    categoryId: "kurta",
    description: "Features organic vegetable-dye motifs inspired by temple architecture, hand-painted on pure tussar silk with antique metal buttons.",
    price: 9499,
    originalPrice: 11999,
    discount: 20,
    rating: 4.8,
    reviewCount: 27,
    images: [
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Tussar Ochre", hex: "#C79E5E" },
      { name: "Indigo Flora", hex: "#2A4365" }
    ],
    stock: 13,
    featured: false,
    newArrival: true,
    trending: false,
    tags: ["Kurta", "Kalamkari", "Handcrafted", "Heritage"],
    fabric: "Tussar Silk with Natural Dyes",
    care: "Dry Clean Only",
    fit: "Comfort Regular Fit"
  },
  {
    id: "lk-018",
    name: "Draped Cowl Kurta with Metallic Vest",
    category: "Party Wear",
    categoryId: "party-wear",
    description: "An avant-garde party ensemble featuring a fluid modal-silk cowl draped kurta paired with an antique pewter foil-printed waistcoat.",
    price: 15499,
    originalPrice: 18999,
    discount: 18,
    rating: 4.7,
    reviewCount: 21,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Graphite & Silver", hex: "#383B42" },
      { name: "Obsidian & Gold", hex: "#1C1C22" }
    ],
    stock: 9,
    featured: false,
    newArrival: false,
    trending: true,
    tags: ["Party Wear", "Cowl", "Draped", "Sangeet"],
    fabric: "Modal Silk & Metallic Brocade",
    care: "Dry Clean Only",
    fit: "Draped Fluid Fit"
  },
  {
    id: "lk-019",
    name: "Gilded Ivory Wedding Sherwani Set",
    category: "Wedding",
    categoryId: "wedding",
    description: "Tailored for landmark wedding celebrations, complete with matching safa fabric, embroidered stole (doshala), and embellished mojaris coordination.",
    price: 41999,
    originalPrice: 49999,
    discount: 16,
    rating: 4.9,
    reviewCount: 45,
    images: [
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "Pearl Ivory", hex: "#FAF8F5" },
      { name: "Regal Sand", hex: "#E0D5BE" }
    ],
    stock: 6,
    featured: true,
    newArrival: false,
    trending: true,
    tags: ["Wedding", "Sherwani", "Groom", "Complete Set"],
    fabric: "Raw Silk with Resham & Mukaish Embroidery",
    care: "Dry Clean Only",
    fit: "Imperial Tailored Fit"
  },
  {
    id: "lk-020",
    name: "Classic Khadi Silk Pathani Suit",
    category: "Kurta Pajama",
    categoryId: "kurta-pajama",
    description: "A commanding Pathani silhouette with epaulettes, flap chest pockets, and relaxed salwar bottoms crafted from organic handspun khadi silk.",
    price: 9999,
    originalPrice: 12499,
    discount: 20,
    rating: 4.8,
    reviewCount: 36,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "Forest Olive", hex: "#3A4533" },
      { name: "Charcoal Ash", hex: "#313338" },
      { name: "Pure White", hex: "#FFFFFF" }
    ],
    stock: 24,
    featured: false,
    newArrival: false,
    trending: false,
    tags: ["Kurta Pajama", "Pathani", "Khadi Silk", "Tradition"],
    fabric: "Organic Handspun Khadi Silk",
    care: "Dry Clean Only",
    fit: "Relaxed Pathani Fit"
  },
  {
    id: "lk-021",
    name: "Printed Silk Festival Kurta",
    category: "Festive",
    categoryId: "festive",
    description: "Vibrant botanical foil print on mulberry silk with contrast piping along the collar and concealed button placket.",
    price: 7999,
    originalPrice: 9999,
    discount: 20,
    rating: 4.7,
    reviewCount: 41,
    images: [
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Saffron Marigold", hex: "#D67A18" },
      { name: "Royal Indigo", hex: "#1E3466" }
    ],
    stock: 19,
    featured: false,
    newArrival: true,
    trending: false,
    tags: ["Festive", "Foil Print", "Mulberry Silk", "Kurta"],
    fabric: "Mulberry Silk",
    care: "Dry Clean or Mild Hand Wash",
    fit: "Classic Fit"
  },
  {
    id: "lk-022",
    name: "Sartorial Double-Breasted Bandhgala",
    category: "Formal Wear",
    categoryId: "formal-wear",
    description: "An imposing double-breasted Indian formal suit with peaked bandhgala collar, handcrafted in fine worsted merino wool.",
    price: 21499,
    originalPrice: 25999,
    discount: 17,
    rating: 4.9,
    reviewCount: 18,
    images: [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Midnight Charcoal", hex: "#1D1E24" },
      { name: "Tobacco Brown", hex: "#4A3525" }
    ],
    stock: 8,
    featured: false,
    newArrival: false,
    trending: false,
    tags: ["Formal Wear", "Double Breasted", "Bandhgala", "Merino Wool"],
    fabric: "Fine Worsted Merino Wool",
    care: "Dry Clean Only",
    fit: "Sartorial Tailored Fit"
  },
  {
    id: "lk-023",
    name: "Zari Embroidered Open Front Sherwani",
    category: "Sherwani",
    categoryId: "sherwani",
    description: "Contemporary open-front styling revealing an inner gold dust kurta, adorned with dense jaal needlework across borders.",
    price: 36999,
    originalPrice: 44999,
    discount: 17,
    rating: 4.9,
    reviewCount: 30,
    images: [
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "Smoky Quartz", hex: "#423B36" },
      { name: "Ivory Cream", hex: "#F5F1E4" }
    ],
    stock: 7,
    featured: true,
    newArrival: true,
    trending: true,
    tags: ["Sherwani", "Open Front", "Zari", "Wedding"],
    fabric: "Raw Silk & Organza Overlay",
    care: "Dry Clean Only",
    fit: "Structured Open Silhouette"
  },
  {
    id: "lk-024",
    name: "Pleated Front Indo-Western Achkan",
    category: "Indo-Western",
    categoryId: "indo-western",
    description: "Vertical knife-pleats cascade across the left panel, contrasting against smooth raw silk on the right, punctuated by bespoke metallic crest buttons.",
    price: 24999,
    originalPrice: 29999,
    discount: 16,
    rating: 4.8,
    reviewCount: 23,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Pewter Silver", hex: "#7E828A" },
      { name: "Obsidian Black", hex: "#141416" }
    ],
    stock: 11,
    featured: false,
    newArrival: true,
    trending: false,
    tags: ["Indo-Western", "Pleated", "Achkan", "Contemporary"],
    fabric: "Raw Silk and Georgette",
    care: "Dry Clean Only",
    fit: "Architectural Modern Cut"
  },
  {
    id: "lk-025",
    name: "Hand-Block Printed Chanderi Kurta",
    category: "Kurta",
    categoryId: "kurta",
    description: "Artisanal hand-block gold foil printing on translucent chanderi silk with full cotton lining, ideal for daytime festive celebrations.",
    price: 8499,
    originalPrice: 10499,
    discount: 19,
    rating: 4.7,
    reviewCount: 39,
    images: [
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Ivory & Gold", hex: "#EFE6CE" },
      { name: "Coral Peach", hex: "#DEA08A" }
    ],
    stock: 21,
    featured: false,
    newArrival: false,
    trending: false,
    tags: ["Kurta", "Chanderi", "Hand Block", "Day Festive"],
    fabric: "Chanderi Silk with Pure Cotton Lining",
    care: "Dry Clean Only",
    fit: "Comfort Traditional Fit"
  },
  {
    id: "lk-026",
    name: "Jacquard Shawl Collar Evening Jacket",
    category: "Party Wear",
    categoryId: "party-wear",
    description: "An exquisite evening piece featuring subtle Persian floral motifs woven in gunmetal jacquard, complemented by a satin shawl collar.",
    price: 17999,
    originalPrice: 22499,
    discount: 20,
    rating: 4.8,
    reviewCount: 22,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Gunmetal Jacquard", hex: "#3A3D45" },
      { name: "Bronze Ember", hex: "#5C3E29" }
    ],
    stock: 12,
    featured: false,
    newArrival: true,
    trending: true,
    tags: ["Party Wear", "Jacquard", "Shawl Collar", "Night Event"],
    fabric: "Woven Jacquard with Silk Satin Trims",
    care: "Dry Clean Only",
    fit: "Evening Tailored Fit"
  },
  {
    id: "lk-027",
    name: "Regal Velvet Bundi with Silk Kurta",
    category: "Kurta Pajama",
    categoryId: "kurta-pajama",
    description: "Deep burgundy velvet waistcoat with delicate dabka hand embroidery on pocket welts, accompanied by a rich ecru silk kurta and churidar.",
    price: 16499,
    originalPrice: 19999,
    discount: 17,
    rating: 4.9,
    reviewCount: 29,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "Burgundy Velvet", hex: "#4A1221" },
      { name: "Deep Royal Blue", hex: "#16284F" }
    ],
    stock: 14,
    featured: true,
    newArrival: false,
    trending: false,
    tags: ["Kurta Pajama", "Velvet", "Bundi", "Festive"],
    fabric: "Micro-Velvet Bundi & Pure Raw Silk Kurta",
    care: "Dry Clean Only",
    fit: "Tailored Regal Fit"
  },
  {
    id: "lk-028",
    name: "Embroidered Collar Silk Bandhgala",
    category: "Blazer",
    categoryId: "blazer",
    description: "An understated statement of luxury with intricately embroidered gold and copper resham running across the collar and cuffs.",
    price: 18999,
    originalPrice: 23999,
    discount: 20,
    rating: 4.8,
    reviewCount: 35,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Slate Anthracite", hex: "#2B2D33" },
      { name: "Ivory Cream", hex: "#EFE8DA" }
    ],
    stock: 15,
    featured: false,
    newArrival: false,
    trending: true,
    tags: ["Blazer", "Bandhgala", "Embroidered", "Occasion"],
    fabric: "Raw Silk Wool Blend",
    care: "Dry Clean Only",
    fit: "Tailored Royal Silhouette"
  },
  {
    id: "lk-029",
    name: "Pearl Embroidered Reception Sherwani",
    category: "Wedding",
    categoryId: "wedding",
    description: "Subtle silver zari and cultured seed pearls woven into fluid geometric jaal, crafted for evening reception opulence.",
    price: 43999,
    originalPrice: 51999,
    discount: 15,
    rating: 5.0,
    reviewCount: 27,
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["40", "42", "44", "46"],
    colors: [
      { name: "Silver Pearl", hex: "#E8ECEF" },
      { name: "Pale Gold", hex: "#E4D5B5" }
    ],
    stock: 4,
    featured: true,
    newArrival: true,
    trending: true,
    tags: ["Wedding", "Sherwani", "Pearl", "Reception", "Luxury"],
    fabric: "Katan Silk with Real Seed Pearls & Silver Zari",
    care: "Dry Clean Only",
    fit: "Imperial Fit"
  },
  {
    id: "lk-030",
    name: "Monochrome Geometric Kurta Set",
    category: "Kurta Pajama",
    categoryId: "kurta-pajama",
    description: "Crisp black and ivory geometric jacquard weave with asymmetric overlap and modern churidar pants.",
    price: 10999,
    originalPrice: 13499,
    discount: 18,
    rating: 4.7,
    reviewCount: 33,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "Monochrome Black", hex: "#17171C" },
      { name: "Ivory Contrast", hex: "#F3EDE1" }
    ],
    stock: 20,
    featured: false,
    newArrival: true,
    trending: false,
    tags: ["Kurta Pajama", "Jacquard", "Monochrome", "Modern"],
    fabric: "Cotton Silk Jacquard",
    care: "Dry Clean Only",
    fit: "Modern Regular Fit"
  },
  {
    id: "lk-031",
    name: "Royal Crest Embroidered Velvet Bandhgala",
    category: "Blazer",
    categoryId: "blazer",
    description: "A showpiece evening jacket adorned with a hand-embroidered golden lion crest on the chest, rendered in plush black velvet.",
    price: 22999,
    originalPrice: 27999,
    discount: 17,
    rating: 4.9,
    reviewCount: 40,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Jet Velvet", hex: "#0B0B0D" },
      { name: "Midnight Navy Velvet", hex: "#10162B" }
    ],
    stock: 9,
    featured: true,
    newArrival: true,
    trending: true,
    tags: ["Blazer", "Velvet", "Crest", "Royal", "Evening"],
    fabric: "Imported Micro-Velvet with Zardozi Crest",
    care: "Dry Clean Only",
    fit: "Tailored Royal Silhouette"
  },
  {
    id: "lk-032",
    name: "Classic Silk Chanderi Festive Kurta",
    category: "Festive",
    categoryId: "festive",
    description: "Lightweight, sheer chanderi silk woven with fine gold tissue borders, perfect for daytime puja and family celebrations.",
    price: 7499,
    originalPrice: 8999,
    discount: 16,
    rating: 4.7,
    reviewCount: 28,
    images: [
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Golden Haldi", hex: "#D6A329" },
      { name: "Powder Coral", hex: "#E89B85" }
    ],
    stock: 18,
    featured: false,
    newArrival: false,
    trending: false,
    tags: ["Festive", "Chanderi", "Haldi", "Silk"],
    fabric: "Chanderi Silk Cotton",
    care: "Dry Clean or Gentle Hand Wash",
    fit: "Comfort Traditional Fit"
  }
];
