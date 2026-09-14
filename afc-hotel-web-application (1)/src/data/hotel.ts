export const HOTEL = {
  name: "AFC Hotel",
  tagline: "Stay Royal • Dine Divine",
  address: "Golbazar-06, Siraha, Madhesh Province, Nepal",
  shortAddress: "Golbazar-06, Siraha",
  phone: "9812763487",
  phoneDisplay: "+977 9812763487",
  phoneHref: "tel:+9779812763487",
  email: "stay@afchotel.com.np",
  hours: "Open Daily • 6:00 AM – 11:00 PM",
  kitchenHours: "Kitchen 7 AM – 10:30 PM • Delivery 8 AM – 10 PM",
  rating: 4.8,
  reviewsCount: 1240,
  deliveryFee: 60,
  freeDeliveryAbove: 999,
  mapQuery: "Golbazar-06 Siraha Nepal",
};

export type MenuItem = {
  id: string;
  name: string;
  nepali: string;
  desc: string;
  price: number;
  mrp?: number;
  category: string;
  image: string;
  veg: boolean;
  spicy: 0 | 1 | 2 | 3;
  rating: number;
  orders: number;
  time: string;
  badge?: string;
};

export const CATEGORIES = [
  "All",
  "Momo Special",
  "Thakali & Nepali",
  "Biryani & Rice",
  "Chinese",
  "Fast Food",
  "Sekuwa & BBQ",
  "Beverages & Dessert",
] as const;

export const MENU: MenuItem[] = [
  {
    id: "buff-steamed-momo",
    name: "Buff Steamed Momo (10 pc)",
    nepali: "बफ स्टिम मो:मो",
    desc: "Juicy hand-pleated buff momos, fiery tomato-sesame achar & creamy mayo. Our legendary bestseller.",
    price: 180,
    mrp: 220,
    category: "Momo Special",
    image: "https://images.pexels.com/photos/18803177/pexels-photo-18803177.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: false,
    spicy: 2,
    rating: 4.9,
    orders: 8214,
    time: "15-20 min",
    badge: "Bestseller",
  },
  {
    id: "chicken-jhol-momo",
    name: "Chicken Jhol Momo",
    nepali: "झोल मो:मो",
    desc: "Plump chicken momos drowned in spicy-sour jhol achar, toasted mustard & fresh coriander.",
    price: 220,
    category: "Momo Special",
    image: "https://images.pexels.com/photos/18803174/pexels-photo-18803174.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: false,
    spicy: 3,
    rating: 4.8,
    orders: 6420,
    time: "15-20 min",
    badge: "Chef Special",
  },
  {
    id: "cheese-corn-fry-momo",
    name: "Crispy Cheese Corn Momo",
    nepali: "चिज कर्न फ्राई मो:मो",
    desc: "Golden fried momos stuffed with molten cheese & sweet corn, served with tangy dip.",
    price: 250,
    category: "Momo Special",
    image: "https://images.pexels.com/photos/28445591/pexels-photo-28445591.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: true,
    spicy: 1,
    rating: 4.7,
    orders: 3890,
    time: "18-22 min",
  },
  {
    id: "veg-steamed-momo",
    name: "Veg Steamed Momo (10 pc)",
    nepali: "भेज मो:मो",
    desc: "Garden-fresh cabbage, carrot & mushroom momos with light ginger-soy dip. Wholesome & delicate.",
    price: 140,
    category: "Momo Special",
    image: "https://images.pexels.com/photos/13443242/pexels-photo-13443242.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: true,
    spicy: 1,
    rating: 4.6,
    orders: 5120,
    time: "12-15 min",
  },
  {
    id: "chicken-thakali",
    name: "Chicken Thakali Set",
    nepali: "चिकेन थकाली",
    desc: "Authentic Thakali — basmati rice, chicken curry, black dal, saag, gundruk, papad, ghee & achar.",
    price: 380,
    mrp: 450,
    category: "Thakali & Nepali",
    image: "https://images.pexels.com/photos/35267280/pexels-photo-35267280.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: false,
    spicy: 2,
    rating: 4.9,
    orders: 5740,
    time: "20-25 min",
    badge: "Most Loved",
  },
  {
    id: "mutton-thakali",
    name: "Mutton Thakali Special",
    nepali: "खसी थकाली",
    desc: "Slow-cooked tender mutton, jimbu-tempered dal, dhido option, ghee rice & 4 homemade achars.",
    price: 550,
    category: "Thakali & Nepali",
    image: "https://images.pexels.com/photos/8818667/pexels-photo-8818667.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: false,
    spicy: 2,
    rating: 5.0,
    orders: 3120,
    time: "25-30 min",
    badge: "Premium",
  },
  {
    id: "dal-bhat-power",
    name: "AFC Power Dal Bhat",
    nepali: "दाल भात तरकारी",
    desc: "Unlimited rice refuel — dal, seasonal tarkari, chicken curry, saag, salad & papad. Farmers' favourite.",
    price: 280,
    category: "Thakali & Nepali",
    image: "https://images.pexels.com/photos/4439740/pexels-photo-4439740.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: false,
    spicy: 1,
    rating: 4.7,
    orders: 4980,
    time: "15 min",
  },
  {
    id: "chicken-biryani",
    name: "Hyderabadi Chicken Biryani",
    nepali: "चिकेन बिर्यानी",
    desc: "Dum-cooked long grain rice, saffron, fried onion, mirchi ka salan & raita. Served in handi.",
    price: 320,
    mrp: 380,
    category: "Biryani & Rice",
    image: "https://images.pexels.com/photos/28674660/pexels-photo-28674660.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: false,
    spicy: 2,
    rating: 4.8,
    orders: 7230,
    time: "20 min",
    badge: "Bestseller",
  },
  {
    id: "mutton-biryani-handi",
    name: "Mutton Handi Biryani",
    nepali: "मटन बिर्यानी",
    desc: "Overnight-marinated mutton, kewra water, desi ghee, served bubbling in clay handi for two.",
    price: 480,
    category: "Biryani & Rice",
    image: "https://images.pexels.com/photos/32825909/pexels-photo-32825909.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: false,
    spicy: 2,
    rating: 4.9,
    orders: 2940,
    time: "25-30 min",
  },
  {
    id: "veg-fried-rice",
    name: "Schezwan Veg Fried Rice",
    nepali: "फ्राइड राइस",
    desc: "Smoky wok-tossed rice, burnt garlic, exotic veggies & schezwan kick. Wok hei guaranteed.",
    price: 200,
    category: "Biryani & Rice",
    image: "https://images.pexels.com/photos/14731636/pexels-photo-14731636.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: true,
    spicy: 2,
    rating: 4.5,
    orders: 3210,
    time: "12-15 min",
  },
  {
    id: "chicken-chowmein",
    name: "Chicken Chowmein",
    nepali: "चाउमिन",
    desc: "Street-style Golbazar chowmein — springy noodles, shredded chicken, crunchy veg, secret AFC masala.",
    price: 190,
    category: "Chinese",
    image: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: false,
    spicy: 1,
    rating: 4.7,
    orders: 6840,
    time: "12-15 min",
    badge: "Local Favourite",
  },
  {
    id: "teriyaki-noodles",
    name: "Spicy Teriyaki Noodles Bowl",
    nepali: "तेरियाकी नुडल्स",
    desc: "Glossy teriyaki-glazed noodles, bok choy, mushroom & sesame. A premium pan-Asian bowl.",
    price: 260,
    category: "Chinese",
    image: "https://images.pexels.com/photos/28895977/pexels-photo-28895977.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: true,
    spicy: 2,
    rating: 4.6,
    orders: 2140,
    time: "15 min",
  },
  {
    id: "chicken-chilli",
    name: "Chicken Chilli Dry + Fried Rice Combo",
    nepali: "चिल्ली चिकेन",
    desc: "Crackling chilli chicken tossed with peppers & onion, paired with egg fried rice.",
    price: 340,
    category: "Chinese",
    image: "https://images.pexels.com/photos/30506291/pexels-photo-30506291.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: false,
    spicy: 3,
    rating: 4.7,
    orders: 3580,
    time: "18-22 min",
  },
  {
    id: "afc-crispy-burger",
    name: "AFC Crispy Chicken Burger + Fries",
    nepali: "चिकेन बर्गर",
    desc: "Crunchy fried fillet, chipotle mayo, cheese slice, brioche bun & peri-peri fries.",
    price: 280,
    mrp: 330,
    category: "Fast Food",
    image: "https://images.pexels.com/photos/28760164/pexels-photo-28760164.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: false,
    spicy: 1,
    rating: 4.6,
    orders: 4310,
    time: "15 min",
  },
  {
    id: "veg-pizza-party",
    name: "Tandoori Paneer Pizza (Medium)",
    nepali: "पिज्जा",
    desc: "Wood-fired base, tandoori paneer, capsicum, onion, mozzarella pull & mint drizzle.",
    price: 499,
    category: "Fast Food",
    image: "https://images.pexels.com/photos/19685655/pexels-photo-19685655.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: true,
    spicy: 2,
    rating: 4.7,
    orders: 2870,
    time: "20-25 min",
    badge: "Family Pack",
  },
  {
    id: "mutton-sekuwa",
    name: "Mutton Sekuwa (500g) with Bhuja",
    nepali: "मटन सेकुवा",
    desc: "Charcoal-grilled Himalayan-spiced mutton, beaten rice, pickled radish & chula-fired taste.",
    price: 520,
    category: "Sekuwa & BBQ",
    image: "https://images.pexels.com/photos/32083366/pexels-photo-32083366.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: false,
    spicy: 3,
    rating: 4.9,
    orders: 3420,
    time: "25-30 min",
    badge: "Chula Special",
  },
  {
    id: "chicken-tandoori-full",
    name: "Tandoori Chicken (Full) + Naan",
    nepali: "तन्दुरी चिकेन",
    desc: "Clay-oven roasted, smoked yogurt marinade, butter naan (2 pc) & green chutney.",
    price: 450,
    category: "Sekuwa & BBQ",
    image: "https://images.pexels.com/photos/12737817/pexels-photo-12737817.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: false,
    spicy: 2,
    rating: 4.8,
    orders: 2650,
    time: "25 min",
  },
  {
    id: "cold-coffee-falooda",
    name: "Kesar Falooda + Cold Coffee Combo",
    nepali: "फलुदा",
    desc: "Royal kesar falooda with rabri & basil seeds + thick blended AFC cold coffee.",
    price: 220,
    category: "Beverages & Dessert",
    image: "https://images.pexels.com/photos/14773005/pexels-photo-14773005.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: true,
    spicy: 0,
    rating: 4.6,
    orders: 1980,
    time: "10 min",
  },
  {
    id: "masala-chiya-jeri",
    name: "Illam Masala Chiya + Jeri Swarm",
    nepali: "चिया जेरी",
    desc: "Slow-brewed Illam tea with spices + hot crispy jeri (250g). Perfect Siraha evening.",
    price: 150,
    category: "Beverages & Dessert",
    image: "https://images.pexels.com/photos/34159107/pexels-photo-34159107.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: true,
    spicy: 0,
    rating: 4.8,
    orders: 4120,
    time: "10 min",
    badge: "Evening Special",
  },
  {
    id: "afc-family-feast",
    name: "AFC Family Feast (Serves 4-5)",
    nepali: "फ्यामिली फिस्ट",
    desc: "2 chicken biryani + 1 veg chowmein + 10pc momo + 4 cold drinks + gulab jamun. Save Rs.400!",
    price: 1299,
    mrp: 1699,
    category: "Fast Food",
    image: "https://images.pexels.com/photos/6088519/pexels-photo-6088519.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    veg: false,
    spicy: 1,
    rating: 5.0,
    orders: 1890,
    time: "30-35 min",
    badge: "Save Rs.400",
  },
];

export type Room = {
  id: string;
  name: string;
  desc: string;
  price: number;
  mrp: number;
  image: string;
  size: string;
  guests: string;
  bed: string;
  amenities: string[];
  rating: number;
  left: number;
  tag?: string;
};

export const ROOMS: Room[] = [
  {
    id: "executive-suite",
    name: "Royal Executive Suite",
    desc: "Top-floor suite with panoramic Terai view, living lounge, bathtub & private balcony. Our crown jewel.",
    price: 5500,
    mrp: 7500,
    image: "https://images.pexels.com/photos/29000312/pexels-photo-29000312.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    size: "650 sq.ft",
    guests: "2 Adults + 1 Child",
    bed: "King + Sofa Bed",
    amenities: ["AC + Heater", "Bathtub", "55\" Smart TV", "Mini Bar", "Free Breakfast", "High-speed WiFi"],
    rating: 4.9,
    left: 2,
    tag: "Most Booked",
  },
  {
    id: "deluxe-king",
    name: "Deluxe King Room",
    desc: "Warm wooden interiors, king bed with premium linens, work desk & city-facing windows.",
    price: 3200,
    mrp: 4200,
    image: "https://images.pexels.com/photos/2736388/pexels-photo-2736388.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    size: "380 sq.ft",
    guests: "2 Adults",
    bed: "King Bed",
    amenities: ["AC", "42\" Smart TV", "Geyser", "Free Breakfast", "WiFi", "Room Service"],
    rating: 4.8,
    left: 4,
  },
  {
    id: "family-comfort",
    name: "Family Comfort Twin",
    desc: "Two plush queen beds, kids corner, spacious bathroom — perfect for family yatra & weddings.",
    price: 3800,
    mrp: 5000,
    image: "https://images.pexels.com/photos/3688261/pexels-photo-3688261.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    size: "480 sq.ft",
    guests: "4 Guests",
    bed: "2 Queen Beds",
    amenities: ["AC", "Family Breakfast", "Kids Welcome", "Geyser", "WiFi", "Laundry"],
    rating: 4.7,
    left: 3,
    tag: "Family Pick",
  },
  {
    id: "standard-cozy",
    name: "Standard Cozy Room",
    desc: "Smart, spotless & budget-friendly. Cozy queen bed, modern bath & all essentials for business stay.",
    price: 1800,
    mrp: 2500,
    image: "https://images.pexels.com/photos/6434592/pexels-photo-6434592.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    size: "280 sq.ft",
    guests: "2 Adults",
    bed: "Queen Bed",
    amenities: ["Cooler + Fan", "Smart TV", "Geyser", "WiFi", "Room Service"],
    rating: 4.6,
    left: 6,
  },
];

export const REVIEWS = [
  {
    name: "Ramesh Yadav",
    place: "Golbazar",
    text: "Best momo in Siraha, no competition! Ordered jhol momo at 8pm, delivered hot in 25 minutes. AFC Hotel has changed food scene in Golbazar.",
    rating: 5,
    item: "Chicken Jhol Momo",
  },
  {
    name: "Priya Sah",
    place: "Lahan",
    text: "Stayed in Executive Suite for wedding. Spotless room, warm staff, and that mutton sekuwa... mind blowing. Feels like Kathmandu luxury in Terai price.",
    rating: 5,
    item: "Royal Executive Suite",
  },
  {
    name: "Amit Chaudhary",
    place: "Mirchaiya",
    text: "Thakali set is authentic — gundruk, jimbu dal, ghee everything perfect. Online ordering with eSewa was super smooth. Highly recommended.",
    rating: 5,
    item: "Chicken Thakali Set",
  },
  {
    name: "Sunita Mahato",
    place: "Siraha",
    text: "Ordered family feast for 6 people. Huge portion, fresh, packaging premium. Kids loved pizza, elders loved biryani. AFC is our weekend fix now.",
    rating: 4,
    item: "AFC Family Feast",
  },
];

export type OrderItem = { id: string; name: string; price: number; qty: number; image: string };
export type Order = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  municipality: string;
  landmark?: string;
  note?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  payment: string;
  type: "Delivery" | "Takeaway" | "Dine-In" | "Room Booking";
  status: "Pending" | "Preparing" | "On the Way" | "Delivered" | "Cancelled";
  createdAt: number;
  eta: string;
};

export const fmt = (n: number) => "Rs. " + n.toLocaleString("en-IN");

export const STATUS_COLOR: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  Preparing: "bg-blue-100 text-blue-800 border-blue-200",
  "On the Way": "bg-violet-100 text-violet-800 border-violet-200",
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};
