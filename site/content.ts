// All text + data for Iron Temple (fictional strength gym, concept site, prices in ₹).

export const IMG = "/images/iron-temple";

export const studio = "BILAL SALMANI";

export const nav = {
  brand: "SHAKZ FITNESS CLUB",
  links: [
    { label: "Programmes", href: "#programmes" },
    { label: "Floor", href: "#floor" },
    { label: "Coaches", href: "#coaches" },
    { label: "Plans", href: "#plans" },
    { label: "Timetable", href: "#timetable" },
    { label: "Contact", href: "#footer" },
  ],
  cta: "Book a trial",
};

export const hero = {
  lines: ["MAKE BODY", "STRONGER"],
  sub: "GYM | CROSSFIT | PERSONAL TRAINING | CARDIO | WEIGHT LOSS/ GAIN | NUTRITIONIST | LOCKERS",
  strip: [
    { k: "Floor", v: "2,400 sq ft" },
    { k: "Platforms", v: "6" },
    { k: "Racks", v: "10" },
    { k: "Dumbbells", v: "to 60 kg" },
    { k: "Open", v: "08:00–22:00" },
  ],
  cta: "Book a trial",
};

export const rules = {
  label: "House rules",
  items: ["Chalk is free.", "Re-rack your weight.", "No mirrors on the platform.", "Coaches watch every rep.", "Earn the plates."],
};

export const programmes = {
  title: ["Core Services &", "Training Programs."],
  items: [
    {
      name: "Strength & Weight Training",
      img: "/images/iron-temple/prog-strength.webp",
      weeks: "All Levels",
      sessions: "Open Floor",
      focus: "Squat Racks · Cables · Resistance Machines",
      note: "Full range of free weights, squat racks, cables, and resistance machines for hypertrophy and functional strength.",
    },
    {
      name: "Cardio & Conditioning",
      img: "/images/iron-temple/prog-conditioning.webp",
      weeks: "Endurance",
      sessions: "Daily Access",
      focus: "Treadmills · Stamina · Heart Health",
      note: "Dedicated cardio zone with treadmills and endurance equipment to boost stamina and heart health.",
    },
    {
      name: "CrossFit & Functional Workouts",
      img: "/images/iron-temple/prog-oly.webp",
      weeks: "High Intensity",
      sessions: "HIIT Sessions",
      focus: "Intervals · Calorie Burn · Agility",
      note: "High-intensity interval and functional training sessions designed to burn calories and improve agility.",
    },
    {
      name: "Personal Training (1-on-1)",
      img: "/images/iron-temple/coach-wraps.webp",
      weeks: "Tailored Plan",
      sessions: "1-on-1 Coach",
      focus: "Form Correction · Progress Tracking",
      note: "Tailored workout programming, form correction, and progress tracking with certified coaches.",
    },
    {
      name: "Body Transformation & Nutrition",
      img: "/images/iron-temple/prog-hypertrophy.webp",
      weeks: "Goal Based",
      sessions: "Custom Diet",
      focus: "Fat Loss · Lean Muscle Gain",
      note: "Customized diet plans and nutrition counseling built around fat loss or lean muscle gain.",
    },
    {
      name: "Zumba & Group Fitness",
      img: "/images/iron-temple/floor-turf.webp",
      weeks: "High Energy",
      sessions: "Group Aerobics",
      focus: "Dance Fitness · Aerobics · Cardio",
      note: "High-energy group dance and aerobic sessions.",
    },
    {
      name: "Dedicated Ladies Batch",
      img: "/images/iron-temple/coach-belt.webp",
      weeks: "Mon – Sat",
      sessions: "12:00 – 2:00 PM",
      focus: "Exclusive Women-Only Slot",
      note: "Exclusive women-only workout hours daily from 12:00 PM to 2:00 PM with certified guidance and full privacy.",
    },
  ],
  tag: "Shakz Fitness Club · Hampankatta",
};

export const floor = {
  title: ["The floor."],
  sub: "Built for lifting, not for selfies.",
  zones: [
    { name: "Platforms", img: "/images/iron-temple/floor-platforms.webp", n: "6", unit: "oak" },
    { name: "Rack row", img: "/images/iron-temple/floor-racks.webp", n: "10", unit: "racks" },
    { name: "Dumbbells", img: "/images/iron-temple/floor-dumbbells.webp", n: "60", unit: "kg" },
    { name: "Sled turf", img: "/images/iron-temple/floor-turf.webp", n: "30", unit: "m" },
    { name: "Chalk", img: "/images/iron-temple/floor-chalk.webp", n: "∞", unit: "free" },
    { name: "Recovery", img: "/images/iron-temple/floor-recovery.webp", n: "4", unit: "°C" },
  ],
};

export const amenities = [
  {
    title: "Climate-Controlled Floor",
    desc: "Fully air-conditioned workout space.",
    tag: "AC Floor",
  },
  {
    title: "Locker & Restroom Access",
    desc: "Secure storage lockers and clean washroom facilities.",
    tag: "Lockers",
  },
  {
    title: "Member Perks",
    desc: "Complimentary Wi-Fi, first-aid support, and wheelchair-accessible entry.",
    tag: "Wi-Fi & Perks",
  },
  {
    title: "Accepted Payments",
    desc: "Debit cards and UPI / NFC mobile payments.",
    tag: "UPI / Cards",
  },
];

/** Competition plates (IWF colours). thick/height in mm: bumpers share one 450 mm diameter. */
export const plates = [
  { kg: 25, color: "#C8322A", ink: "#F2EEE6", thick: 64, dia: 450 },
  { kg: 20, color: "#2F55E4", ink: "#F2EEE6", thick: 54, dia: 450 },
  { kg: 15, color: "#E2B42B", ink: "#151413", thick: 44, dia: 450 },
  { kg: 10, color: "#2F7D4A", ink: "#F2EEE6", thick: 36, dia: 450 },
  { kg: 5, color: "#E8E6E0", ink: "#151413", thick: 28, dia: 325 },
] as const;

export const loadBar = {
  label: "Load the bar",
  title: ["Load", "the bar."],
  barKg: 20,
  end: "Week one.",
  sub: "Every member starts on the empty bar. We add the plates when you're ready for them.",
};

export const coaches = {
  title: ["Coaches.", "No ego."],
  sub: "Every coach still competes. Their gear tells you more than a headshot would.",
  items: [
    { name: "Rameez Miz", role: "Head of strength", lifts: "DL 260 · SQ 205 · BP 140", gear: "/images/iron-temple/ramish.webp", years: "14 yrs" },
    { name: "Meera Iyer", role: "Olympic lifting", lifts: "SN 82 · C&J 104", gear: "/images/iron-temple/unnamed.webp", years: "9 yrs" },
    { name: "Ismail Thufail", role: "Powerlifting", lifts: "DL 290 · SQ 240 · BP 165", gear: "/images/iron-temple/image.webp", years: "11 yrs" },
    { name: "Tara Menon", role: "Programming + conditioning", lifts: "DL 180 · Row 2k 7:02", gear: "/images/iron-temple/coach-logbook.webp", years: "8 yrs" },
  ],
};

export const plans = {
  title: ["Membership", "plans."],
  items: [
    {
      id: "1m",
      name: "1 Month",
      badge: "Standard",
      price: 1500,
      per: "1 month",
      note: "Beginners or short-term visitors",
    },
    {
      id: "4m",
      name: "4 Months",
      badge: "Promo Package",
      price: 4000,
      per: "4 months",
      note: "Building a consistent routine · ₹1,000 / mo",
    },
    {
      id: "8m",
      name: "8 Months",
      badge: "Promo Package",
      price: 6000,
      per: "8 months",
      note: "Medium-term body transformation · ₹750 / mo",
    },
    {
      id: "12m",
      name: "12 Months",
      badge: "Annual Promo",
      price: 8000,
      per: "12 months",
      note: "Best overall value for long-term fitness · ₹667 / mo",
    },
  ],
  selected: "4m",
  cta: "Join now",
  disclaimer: "Promotional bundle rates apply during seasonal offers. Personal training is billed separately.",
};

export const timetable = {
  title: ["This week", "on the floor."],
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  times: ["06:00", "07:30", "12:30", "18:00", "19:30"],
  // [day index, time index, class, spots]
  classes: [
    [0, 0, "Barbell Club", 4], [2, 0, "Barbell Club", 2], [4, 0, "Barbell Club", 5], [3, 0, "Barbell Club", 3],
    [1, 1, "Oly Technique", 6], [3, 1, "Oly Technique", 3], [5, 1, "Strongman", 8],
    [0, 2, "Engine", 9], [2, 2, "Engine", 7], [4, 2, "Mobility", 10],
    [0, 3, "Oly Technique", 2], [1, 3, "Barbell Club", 1], [2, 3, "Strongman", 6], [3, 3, "Engine", 5], [4, 3, "Barbell Club", 4],
    [0, 4, "Mobility", 12], [2, 4, "Mobility", 11], [5, 3, "Open Platform", 6], [6, 1, "Mobility", 12],
  ] as [number, number, string, number][],
  pick: { day: 3, time: 0 },
  ticket: { platform: "Platform 4", coach: "Rameez Miz" },
};

export const join = { lines: ["First session", "on us."], cta: "Book a trial", sub: "Bring shoes. We have the chalk." };

export const contact = {
  name: "SHAKZ FITNESS CLUB",
  address: "Crystal Arc Building, Ground Floor, Balmatta Road, Beside Roopa Hotel & Opposite KTM Showroom, Hampankatta, Mangaluru, Karnataka 575001",
  addressLine1: "Crystal Arc Building, Ground Floor",
  addressLine2: "Balmatta Road, Hampankatta",
  addressLandmark: "Beside Roopa Hotel & Opposite KTM Showroom",
  addressCity: "Mangaluru, Karnataka 575001",
  mapsUrl: "https://maps.google.com/?q=Shakz+Fitness+Club+Crystal+Arc+Building+Balmatta+Road+Hampankatta+Mangaluru+Karnataka+575001",
  websiteUrl: "https://google.com",
  phones: [
    { display: "+91 99804 05656", href: "tel:+919980405656", wa: "https://wa.me/919980405656" },
    { display: "+91 84978 15656", href: "tel:+918497815656", wa: "https://wa.me/918497815656" },
  ],
  instagram: {
    handle: "@shakz_fitnessclub",
    url: "https://www.instagram.com/shakz_fitnessclub/?hl=en",
  },
  hours: {
    days: "Monday – Saturday",
    general: "6:00 AM – 10:00 PM",
    ladies: "12:00 PM – 2:00 PM (Monday – Saturday)",
    sunday: "Closed",
  },
};

export const footer = {
  cols: [
    { t: "Programmes", l: ["Strength", "Olympic Lifting", "Hypertrophy", "Conditioning"] },
    { t: "Quick Links", l: ["The floor", "Coaches", "Membership Plans", "Timetable"] },
  ],
  words: ["SHAKZ", "SHAKZ", "SHAKZ"],
};
