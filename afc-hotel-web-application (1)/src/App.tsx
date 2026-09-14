import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MenuSection from "./components/MenuSection";
import { RoomsSection, ReviewsSection } from "./components/RoomsReviews";
import { CartDrawer, CheckoutModal } from "./components/CartCheckout";
import Dashboard from "./components/Dashboard";
import AdminLogin from "./components/AdminLogin";
import { TrackSection, ContactFooter } from "./components/TrackContact";
import { HOTEL, MENU, ROOMS, type MenuItem, type Order } from "./data/hotel";
import { clearSession, getSession, type AdminUser } from "./utils/admin";

function load<T>(k: string, fb: T): T {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fb;
  } catch {
    return fb;
  }
}

export default function App() {
  const [view, setView] = useState<"store" | "dashboard">("store");
  const [cart, setCart] = useState<Record<string, number>>(() => load("afc_cart_v1", {}));
  const [roomCatalog, setRoomCatalog] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => load("afc_orders_v1", []));
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => getSession());

  useEffect(() => {
    localStorage.setItem("afc_cart_v1", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("afc_orders_v1", JSON.stringify(orders));
  }, [orders]);

  // seed demo orders + customers on first visit so admin sees realistic data
  useEffect(() => {
    const seeded = localStorage.getItem("afc_seeded_v1");
    if (!seeded && orders.length === 0) {
      const now = Date.now();
      const demo: Order[] = [
        {
          id: "AFC-482913",
          customer: "Suman Mahara",
          phone: "9845671234",
          address: "Main Chowk, Golbazar",
          municipality: "Golbazar",
          landmark: "Near Siddhartha Bank",
          note: "Extra spicy, less oil",
          items: [
            { id: "buff-steamed-momo", name: "Buff Steamed Momo (10 pc)", price: 180, qty: 2, image: MENU[0].image },
            { id: "chicken-biryani", name: "Hyderabadi Chicken Biryani", price: 320, qty: 1, image: MENU[7].image },
          ],
          subtotal: 680,
          deliveryFee: 60,
          discount: 136,
          total: 604,
          payment: "eSewa",
          type: "Delivery",
          status: "Preparing",
          createdAt: now - 1000 * 60 * 14,
          eta: "25-35 min",
        },
        {
          id: "AFC-482871",
          customer: "Priya Sah",
          phone: "9804812233",
          address: "Ward 4, Hospital Road",
          municipality: "Lahan",
          landmark: "Opposite Life Guard Hospital",
          note: "Call on arrival",
          items: [
            { id: "chicken-thakali", name: "Chicken Thakali Set", price: 380, qty: 2, image: MENU[4].image },
          ],
          subtotal: 760,
          deliveryFee: 60,
          discount: 0,
          total: 820,
          payment: "Cash on Delivery",
          type: "Delivery",
          status: "On the Way",
          createdAt: now - 1000 * 60 * 42,
          eta: "25-35 min",
        },
        {
          id: "AFC-482802",
          customer: "Ramesh Yadav",
          phone: "9814768890",
          address: "Siraha Bazaar, Main Road",
          municipality: "Siraha Bazaar",
          landmark: "Near Bus Park",
          note: "",
          items: [
            { id: "chicken-chowmein", name: "Chicken Chowmein", price: 190, qty: 3, image: MENU[10].image },
            { id: "masala-chiya-jeri", name: "Illam Masala Chiya + Jeri", price: 150, qty: 2, image: MENU[18].image },
          ],
          subtotal: 870,
          deliveryFee: 60,
          discount: 0,
          total: 930,
          payment: "Khalti",
          type: "Takeaway",
          status: "Delivered",
          createdAt: now - 1000 * 60 * 60 * 3,
          eta: "15-20 min",
        },
      ];
      setOrders(demo);
      localStorage.setItem("afc_seeded_v1", "1");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const catalog = useMemo(() => {
    const map = new Map<string, MenuItem>();
    MENU.forEach((m) => map.set(m.id, m));
    roomCatalog.forEach((m) => map.set(m.id, m));
    return map;
  }, [roomCatalog]);

  const lines = useMemo(() => {
    return Object.entries(cart)
      .filter(([, q]) => q > 0)
      .map(([id, qty]) => ({ item: catalog.get(id)!, qty }))
      .filter((l) => l.item);
  }, [cart, catalog]);

  const cartCount = lines.reduce((a, l) => a + l.qty, 0);
  const subtotal = lines.reduce((a, l) => a + l.item.price * l.qty, 0);

  const promoApplied = (() => {
    try {
      return localStorage.getItem("afc_promo_v1");
    } catch {
      return null;
    }
  })();

  const { discount, deliveryFee, total } = useMemo(() => {
    let code: string | null = null;
    try { code = (localStorage.getItem("afc_promo_v1") || "").toUpperCase() || null; } catch { code = null; }
    let d = 0;
    if (code === "AFC20" && subtotal >= 799) d = Math.min(250, Math.round(subtotal * 0.2));
    if (code === "FAMILY15") {
      const feast = lines.filter((l) => l.item.id.includes("feast") || l.item.id.includes("pizza") || l.item.id.includes("burger")).reduce((a, l) => a + l.item.price * l.qty, 0);
      d = Math.round(feast * 0.15);
    }
    if (code === "WELCOME10" && subtotal >= 499) d = Math.round(subtotal * 0.1);
    const fee = subtotal === 0 ? 0 : code === "FREEDEL" ? 0 : subtotal - d >= HOTEL.freeDeliveryAbove ? 0 : HOTEL.deliveryFee;
    return { discount: d, deliveryFee: fee, total: Math.max(0, subtotal - d + fee) };
  }, [subtotal, cartOpen, checkoutOpen, promoApplied, lines]);

  const add = (m: MenuItem) => {
    setCart((p) => ({ ...p, [m.id]: (p[m.id] || 0) + 1 }));
    setToast(`${m.name} added to bag`);
    setTimeout(() => setToast(null), 1800);
  };

  const setQty = (id: string, qty: number) => {
    setCart((p) => {
      if (qty <= 0) {
        const { [id]: _, ...rest } = p;
        return rest;
      }
      return { ...p, [id]: qty };
    });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleBookRoom = (roomName: string, price: number) => {
    const id = "room-" + roomName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const real = ROOMS.find((r) => r.name === roomName);
    const roomItem: MenuItem = {
      id,
      name: `${roomName} — 1 Night + Breakfast`,
      nepali: "रुम बुकिङ",
      desc: "Room booking for 1 night with complimentary breakfast.",
      price,
      category: "Rooms",
      image: real?.image || "https://images.pexels.com/photos/2736388/pexels-photo-2736388.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      veg: true,
      spicy: 0,
      rating: 4.8,
      orders: 120,
      time: "Check-in 12 PM",
    };
    setRoomCatalog((p) => (p.find((r) => r.id === id) ? p : [...p, roomItem]));
    setCart((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
    setCartOpen(true);
    showToast(`${roomName} added — complete booking in bag`);
  };

  const handlePlaced = (o: Order) => {
    setOrders((p) => [o, ...p]);
    setCart({});
    try {
      localStorage.removeItem("afc_promo_v1");
    } catch {}
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = (u: AdminUser) => {
    setAdminUser(u);
    setView("dashboard");
    window.scrollTo({ top: 0 });
    showToast(`Welcome back, ${u.name}!`);
  };

  const handleLogout = () => {
    clearSession();
    setAdminUser(null);
    setView("store");
    showToast("Logged out securely. Dhanyabad!");
  };

  if (view === "dashboard") {
    if (!adminUser) {
      return <AdminLogin onLogin={handleLogin} onBack={() => setView("store")} />;
    }
    return <Dashboard orders={orders} setOrders={setOrders} onBack={() => setView("store")} adminUser={adminUser} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-[#FFF9EF]">
      <Navbar view={view} setView={setView} cartCount={cartCount} onCart={() => setCartOpen(true)} isAdmin={!!adminUser} />
      <Hero onOrder={() => scrollTo("menu")} onBook={() => scrollTo("rooms")} />

      <div className="bg-[#FFF9EF] border-b border-[#0C1A16]/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-[12.5px] font-semibold text-[#0C1A16]/60 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Sparkles size={14} className="text-[#9A6B1E] shrink-0" />
          <span><span className="font-extrabold text-[#0C1A16]">E-commerce launch offer:</span> order online & get up to 20% off + free delivery over Rs.999 — promoting AFC Hotel all over Golbazar, Lahan, Mirchaiya & Siraha.</span>
        </div>
      </div>

      <MenuSection cart={cart} add={add} setQty={setQty} onCart={() => setCartOpen(true)} />
      <RoomsSection onBookRoom={handleBookRoom} />
      <ReviewsSection />
      <TrackSection orders={orders} />
      <ContactFooter onOrder={() => scrollTo("menu")} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        lines={lines}
        setQty={setQty}
        clear={() => setCart({})}
        onCheckout={() => {
          setCartOpen(false);
          setTimeout(() => setCheckoutOpen(true), 250);
        }}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => {
          setCheckoutOpen(false);
          setTimeout(() => scrollTo("track"), 300);
        }}
        lines={lines}
        subtotal={subtotal}
        discount={discount}
        deliveryFee={deliveryFee}
        total={total}
        onPlaced={handlePlaced}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[95] bg-[#0C1A16] text-white pl-4 pr-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 border border-[#D4A24E]/40 max-w-[92vw]"
          >
            <span className="w-8 h-8 rounded-full bg-[#D4A24E] text-[#0C1A16] flex items-center justify-center shrink-0"><CheckCircle2 size={16} /></span>
            <span className="text-[13.5px] font-bold truncate">{toast}</span>
            {toast.includes("added") && (
              <button onClick={() => { setToast(null); setCartOpen(true); }} className="ml-1 text-[12.5px] font-extrabold bg-white/15 hover:bg-[#D4A24E] hover:text-[#0C1A16] px-3 py-1.5 rounded-full transition shrink-0">View Bag</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
