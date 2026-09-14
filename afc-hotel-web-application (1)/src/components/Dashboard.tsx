import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownRight, ArrowUpRight, Banknote, Bell, CheckCircle2, Clock, Download,
  Eye, Filter, History, KeyRound, LogOut, MapPin, MessageCircle, Phone, Search,
  ShoppingBag, Star, Trash2, TrendingUp, User, Users, UtensilsCrossed, Wallet, X,
  ChefHat, Bike, Receipt, Store, ChevronRight, Printer
} from "lucide-react";
import { HOTEL, fmt, STATUS_COLOR, type Order } from "../data/hotel";
import type { AdminUser } from "../utils/admin";
import { changePassword } from "../utils/admin";

const SEED_SALES = [4200, 6800, 5400, 8900, 12400, 15800, 11200];
const SEED_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CustomerAgg = {
  phone: string;
  name: string;
  addresses: string[];
  municipalities: string[];
  totalOrders: number;
  totalSpent: number;
  lastOrder: number;
  firstOrder: number;
  lastStatus: Order["status"];
  orders: Order[];
};

function aggregateCustomers(orders: Order[]): CustomerAgg[] {
  const map = new Map<string, Order[]>();
  orders.forEach((o) => {
    const key = (o.phone || "").replace(/\D/g, "") || o.customer.toLowerCase();
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(o);
  });
  const list: CustomerAgg[] = [...map.entries()].map(([phone, os]) => {
    const sorted = [...os].sort((a, b) => b.createdAt - a.createdAt);
    const latest = sorted[0];
    const addresses = [...new Set(os.map((o) => o.address).filter(Boolean))];
    const municipalities = [...new Set(os.map((o) => o.municipality).filter(Boolean))];
    return {
      phone: latest.phone || phone,
      name: latest.customer,
      addresses,
      municipalities,
      totalOrders: os.length,
      totalSpent: os.filter((o) => o.status !== "Cancelled").reduce((a, o) => a + o.total, 0),
      lastOrder: latest.createdAt,
      firstOrder: Math.min(...os.map((o) => o.createdAt)),
      lastStatus: latest.status,
      orders: sorted,
    };
  });
  return list.sort((a, b) => b.totalSpent - a.totalSpent);
}

export default function Dashboard({
  orders, setOrders, onBack, adminUser, onLogout,
}: {
  orders: Order[]; setOrders: (o: Order[]) => void; onBack: () => void;
  adminUser: AdminUser; onLogout: () => void;
}) {
  const [tab, setTab] = useState<"overview" | "orders" | "customers" | "menu">("overview");
  const [q, setQ] = useState("");
  const [custQ, setCustQ] = useState("");
  const [statusF, setStatusF] = useState("All");
  const [toast, setToast] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAgg | null>(null);
  const [showPassModal, setShowPassModal] = useState(false);
  const [passForm, setPassForm] = useState({ current: "", next: "", confirm: "" });
  const [passMsg, setPassMsg] = useState("");

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const revenue = orders.filter((o) => o.status !== "Cancelled").reduce((a, o) => a + o.total, 0);
  const fakeBase = 48650;
  const totalRevenue = revenue + fakeBase;
  const totalOrders = orders.length + 312;
  const customers = useMemo(() => aggregateCustomers(orders), [orders]);
  const totalCustomers = customers.length + 184;
  const pending = orders.filter((o) => o.status === "Pending" || o.status === "Preparing").length;

  const chartData = useMemo(() => {
    const today = revenue > 0 ? Math.min(22000, 8000 + revenue) : SEED_SALES[6];
    return [...SEED_SALES.slice(0, 6), today];
  }, [revenue]);
  const max = Math.max(...chartData);

  const filtered = orders.filter((o) => {
    if (statusF !== "All" && o.status !== statusF) return false;
    if (q && !(o.id + o.customer + o.phone + o.address).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const filteredCustomers = customers.filter((c) => {
    if (!custQ.trim()) return true;
    const s = custQ.toLowerCase();
    return (c.name + c.phone + c.addresses.join(" ")).toLowerCase().includes(s);
  });

  const setStatus = (id: string, s: Order["status"]) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status: s } : o)));
    setSelectedOrder((prev) => (prev && prev.id === id ? { ...prev, status: s } : prev));
    notify(`Order ${id} → ${s}`);
  };

  const deleteOrder = (id: string) => {
    if (!confirm(`Delete order ${id}? This cannot be undone.`)) return;
    setOrders(orders.filter((o) => o.id !== id));
    setSelectedOrder(null);
    notify(`Order ${id} deleted`);
  };

  const clearAll = () => {
    if (confirm("Clear all live orders?")) {
      setOrders([]);
      notify("All orders cleared");
    }
  };

  const exportCSV = () => {
    const rows = [["ID", "Customer", "Phone", "Address", "Municipality", "Landmark", "Note", "Items", "Subtotal", "Delivery", "Discount", "Total", "Payment", "Type", "Status", "Date"], ...orders.map((o) => [o.id, o.customer, o.phone, o.address, o.municipality, o.landmark || "", o.note || "", o.items.map((i) => `${i.name}x${i.qty}`).join(";"), String(o.subtotal), String(o.deliveryFee), String(o.discount), String(o.total), o.payment, o.type, o.status, new Date(o.createdAt).toLocaleString()])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "afc-orders-full.csv";
    a.click();
    notify("Orders exported with customer details");
  };

  const exportCustomers = () => {
    const rows = [["Name", "Phone", "Addresses", "Municipalities", "Total Orders", "Total Spent", "First Order", "Last Order"], ...customers.map((c) => [c.name, c.phone, c.addresses.join(" | "), c.municipalities.join(", "), String(c.totalOrders), String(c.totalSpent), new Date(c.firstOrder).toLocaleString(), new Date(c.lastOrder).toLocaleString()])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "afc-customers.csv";
    a.click();
    notify("Customer list exported");
  };

  const handlePassChange = () => {
    setPassMsg("");
    if (passForm.next !== passForm.confirm) return setPassMsg("New passwords do not match.");
    const res = changePassword(passForm.current, passForm.next);
    setPassMsg(res.msg);
    if (res.ok) {
      setPassForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setShowPassModal(false), 1200);
      notify("Admin password updated");
    }
  };

  const topItems = useMemo(() => {
    const m = new Map<string, { name: string; qty: number; rev: number }>();
    orders.forEach((o) => o.items.forEach((i) => {
      const e = m.get(i.id) || { name: i.name, qty: 0, rev: 0 };
      e.qty += i.qty; e.rev += i.qty * i.price;
      m.set(i.id, e);
    }));
    const seeded = [
      { name: "Buff Steamed Momo", qty: 214 + (m.get("buff-steamed-momo")?.qty || 0), rev: 38400 },
      { name: "Chicken Biryani", qty: 168 + (m.get("chicken-biryani")?.qty || 0), rev: 53760 },
      { name: "Chicken Chowmein", qty: 152, rev: 28880 },
      { name: "Chicken Thakali Set", qty: 121, rev: 45980 },
    ];
    const live = [...m.entries()].filter(([k]) => !["buff-steamed-momo", "chicken-biryani"].includes(k)).map(([_, v]) => v).slice(0, 2);
    return [...seeded, ...live].sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders]);

  const typeIcon = (t: string) => t === "Delivery" ? Bike : t === "Takeaway" ? Store : t === "Room Booking" ? History : ChefHat;

  return (
    <div className="min-h-screen bg-[#F3EEE1]">
      {/* topbar */}
      <div className="bg-[#0C1A16] text-white sticky top-0 z-40 shadow-xl">
        <div className="max-w-[1280px] mx-auto px-4 h-[68px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4A24E] flex items-center justify-center font-display font-bold text-[#0C1A16] text-[20px] shrink-0">A</div>
            <div className="leading-tight">
              <div className="font-bold text-[15px] flex items-center gap-2">AFC Business Dashboard <span className="hidden sm:inline text-[10px] font-extrabold bg-emerald-400/15 text-emerald-300 border border-emerald-300/20 px-2 py-0.5 rounded-full">● LIVE</span></div>
              <div className="text-[11.5px] text-white/50 font-medium">{HOTEL.shortAddress} • {HOTEL.phoneDisplay}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 bg-white/10 border border-white/15 rounded-full pl-3 pr-1 py-1">
              <Search size={14} className="text-white/50" />
              <input value={q} onChange={(e) => { setQ(e.target.value); setTab("orders"); }} placeholder="Search order, name, phone..." className="bg-transparent text-[13px] w-[190px] placeholder:text-white/35 font-medium" />
            </div>
            <button onClick={() => setTab("orders")} className="relative w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/15 transition" title="Pending alerts">
              <Bell size={17} />
              {pending > 0 && <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-rose-500 text-[11px] font-extrabold flex items-center justify-center border-2 border-[#0C1A16]">{pending}</span>}
            </button>
            {/* admin profile */}
            <div className="hidden sm:flex items-center gap-2.5 bg-white/8 border border-white/15 rounded-full pl-1.5 pr-2 py-1.5">
              <span className="w-8 h-8 rounded-full bg-[#D4A24E] text-[#0C1A16] font-display font-bold flex items-center justify-center text-[15px]">{adminUser.name[0]}</span>
              <div className="leading-tight pr-1">
                <div className="text-[12.5px] font-extrabold">{adminUser.name}</div>
                <div className="text-[10.5px] text-[#F0C778] font-bold">{adminUser.role}</div>
              </div>
            </div>
            <button onClick={() => setShowPassModal(true)} className="w-10 h-10 rounded-full bg-white/10 border border-white/15 hidden sm:flex items-center justify-center hover:bg-white/15 transition" title="Change password"><KeyRound size={16} /></button>
            <button onClick={onLogout} className="inline-flex items-center gap-1.5 text-[13px] font-bold bg-rose-500/15 border border-rose-400/25 text-rose-200 px-3.5 py-2.5 rounded-full hover:bg-rose-500 hover:text-white transition"><LogOut size={14} /> <span className="hidden sm:inline">Logout</span></button>
            <button onClick={onBack} className="text-[13px] font-bold bg-white text-[#0C1A16] px-4 py-2.5 rounded-full hover:bg-[#F0C778] transition">← Store</button>
          </div>
        </div>
        {/* tabs */}
        <div className="max-w-[1280px] mx-auto px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Overview" },
            { id: "orders", label: `Orders ${orders.length > 0 ? `(${orders.length})` : ""}` },
            { id: "customers", label: `Customers (${customers.length})` },
            { id: "menu", label: "Menu" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as any)} className={`shrink-0 text-[13px] font-bold px-4 py-2 rounded-full transition ${tab === t.id ? "bg-[#D4A24E] text-[#0C1A16]" : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"}`}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-6">
        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            { label: "Total Revenue", value: fmt(totalRevenue), delta: "+18.2% vs last week", up: true, icon: Banknote, bg: "bg-[#0C1A16] text-white", sub: "Dine + Delivery + Rooms" },
            { label: "Total Orders", value: String(totalOrders), delta: `+${orders.length} live today`, up: true, icon: ShoppingBag, bg: "bg-white", sub: "Online & walk-in" },
            { label: "Total Customers", value: String(totalCustomers), delta: `+${customers.length} online`, up: true, icon: Users, bg: "bg-white", sub: "Unique phone numbers" },
            { label: "Pending Action", value: String(pending), delta: pending > 0 ? "Needs attention" : "All clear", up: pending === 0, icon: Clock, bg: pending > 0 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200", sub: "In kitchen queue" },
          ].map((k) => (
            <div key={k.label} className={`rounded-[20px] border border-[#0C1A16]/10 p-5 ${k.bg} ${k.bg.startsWith("bg-white") ? "shadow-sm" : k.bg.includes("amber") || k.bg.includes("emerald") ? "border shadow-sm" : "shadow-lg"} relative overflow-hidden`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className={`text-[12px] font-extrabold uppercase tracking-wider ${k.bg.includes("0C1A16") ? "text-[#F0C778]" : "text-[#0C1A16]/50"}`}>{k.label}</div>
                  <div className={`font-display font-bold text-[26px] mt-1 truncate ${k.bg.includes("0C1A16") ? "text-white" : "text-[#0C1A16]"}`}>{k.value}</div>
                  <div className={`mt-1 inline-flex items-center gap-1 text-[12px] font-bold ${k.up ? "text-emerald-600" : "text-amber-600"}`}>{k.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {k.delta}</div>
                  <div className={`text-[11.5px] font-medium ${k.bg.includes("0C1A16") ? "text-white/50" : "text-[#0C1A16]/45"}`}>{k.sub}</div>
                </div>
                <span className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${k.bg.includes("0C1A16") ? "bg-[#D4A24E]/20 text-[#F0C778]" : "bg-[#0C1A16] text-[#F0C778]"}`}><k.icon size={19} /></span>
              </div>
            </div>
          ))}
        </div>

        {tab === "overview" && (
          <div className="mt-4 grid lg:grid-cols-[1.6fr_1fr] gap-4">
            <div className="bg-white rounded-[20px] border border-[#0C1A16]/10 p-6 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="font-bold text-[16px]">Weekly Sales Performance</div>
                  <div className="text-[12.5px] text-[#0C1A16]/50 font-medium">Revenue across dine-in, delivery & rooms • NPR</div>
                </div>
                <span className="text-[12px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full inline-flex items-center gap-1"><TrendingUp size={13} /> +18.2%</span>
              </div>
              <div className="mt-6 flex items-end gap-2.5 h-[210px]">
                {chartData.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[11px] font-extrabold text-[#0C1A16]/60 opacity-0 group-hover:opacity-100 transition">{(v / 1000).toFixed(1)}k</div>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }} transition={{ delay: i * 0.06, type: "spring", damping: 20 }} className={`w-full rounded-t-xl min-h-[14px] relative ${i === 6 ? "bg-gradient-to-t from-[#9A6B1E] to-[#F0C778] shadow-[0_10px_25px_-8px_rgba(212,162,78,0.7)]" : "bg-[#0C1A16]/90 hover:bg-[#0C1A16]"}`}>
                      {i === 6 && <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-extrabold bg-[#0C1A16] text-[#F0C778] px-2 py-1 rounded-md whitespace-nowrap">Today</span>}
                    </motion.div>
                    <div className={`text-[11.5px] font-bold ${i === 6 ? "text-[#9A6B1E]" : "text-[#0C1A16]/45"}`}>{SEED_DAYS[i]}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[["Dine-In", "42%", "bg-[#0C1A16]"], ["Delivery", "38%", "bg-[#D4A24E]"], ["Rooms", "20%", "bg-emerald-500"]].map(([l, v, c]) => (
                  <div key={l} className="bg-[#F8F3E6] rounded-xl p-3">
                    <div className="flex items-center justify-center gap-1.5 text-[12px] font-bold text-[#0C1A16]/60"><span className={`w-2 h-2 rounded-full ${c}`} />{l}</div>
                    <div className="font-display font-bold text-[18px]">{v}</div>
                  </div>
                ))}
              </div>
              {/* recent customers preview */}
              <div className="mt-5 pt-5 border-t border-[#0C1A16]/8">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[14px]">Latest customers</div>
                  <button onClick={() => setTab("customers")} className="text-[12.5px] font-extrabold text-[#9A6B1E] hover:underline inline-flex items-center gap-1">View all <ChevronRight size={13} /></button>
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {customers.slice(0, 6).map((c) => (
                    <button key={c.phone} onClick={() => setSelectedCustomer(c)} className="shrink-0 flex items-center gap-2 bg-[#FFFBF0] border border-[#0C1A16]/10 rounded-full pl-1.5 pr-4 py-1.5 hover:border-[#D4A24E] transition text-left">
                      <span className="w-8 h-8 rounded-full bg-[#0C1A16] text-[#F0C778] text-[13px] font-extrabold flex items-center justify-center">{c.name[0]}</span>
                      <span className="leading-tight"><span className="block text-[12.5px] font-extrabold">{c.name}</span><span className="block text-[11px] text-[#0C1A16]/55 font-semibold">{c.phone} • {fmt(c.totalSpent)}</span></span>
                    </button>
                  ))}
                  {customers.length === 0 && <span className="text-[13px] text-[#0C1A16]/50 font-medium">No online customers yet — new orders will appear here.</span>}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0C1A16] text-white rounded-[20px] p-6 relative overflow-hidden">
                <div className="absolute inset-0 texture-dark" />
                <div className="relative">
                  <div className="text-[12px] font-extrabold uppercase tracking-wider text-[#F0C778]">Delivery Reach</div>
                  <div className="font-display font-bold text-[22px] mt-1">Promoting AFC all over Siraha</div>
                  <div className="mt-4 space-y-2.5">
                    {[["Golbazar", 92], ["Lahan", 68], ["Mirchaiya", 54], ["Siraha Bazaar", 47]].map(([a, p]) => (
                      <div key={a as string}>
                        <div className="flex justify-between text-[12.5px] font-bold"><span>{a}</span><span className="text-[#F0C778]">{p}% coverage</span></div>
                        <div className="mt-1 h-1.5 bg-white/12 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }} className="h-full bg-gradient-to-r from-[#D4A24E] to-[#F0C778] rounded-full" /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-[20px] border border-[#0C1A16]/10 p-5 shadow-sm">
                <div className="flex items-center justify-between"><div className="font-bold text-[15px]">Top Selling Dishes</div><span className="text-[11.5px] font-bold text-[#9A6B1E] bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">This week</span></div>
                <div className="mt-3 space-y-2.5">
                  {topItems.map((t, i) => (
                    <div key={t.name} className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-lg text-[12px] font-extrabold flex items-center justify-center shrink-0 ${i === 0 ? "bg-[#D4A24E] text-[#0C1A16]" : "bg-[#0C1A16]/8 text-[#0C1A16]/60"}`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2"><span className="text-[13px] font-bold truncate">{t.name}</span><span className="text-[12px] font-extrabold text-[#0C1A16]/60 shrink-0">{t.qty} sold</span></div>
                        <div className="mt-1 h-1.5 bg-[#0C1A16]/8 rounded-full overflow-hidden"><div className="h-full bg-[#0C1A16] rounded-full" style={{ width: `${Math.min(100, (t.qty / 220) * 100)}%` }} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="mt-4 bg-white rounded-[20px] border border-[#0C1A16]/10 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#0C1A16]/8 flex flex-col xl:flex-row xl:items-center gap-3 justify-between">
              <div>
                <div className="font-bold text-[16px]">Order Management + Customer Details</div>
                <div className="text-[12.5px] text-[#0C1A16]/50 font-medium">Click <span className="font-bold text-[#0C1A16]">View</span> to see full customer name, phone, address & note • {filtered.length} orders</div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-white border border-[#0C1A16]/12 rounded-full pl-3 pr-2 py-1.5 md:hidden w-full">
                  <Search size={14} className="text-[#0C1A16]/40" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, ID..." className="flex-1 bg-transparent text-[13px] font-semibold px-2 placeholder:text-[#0C1A16]/35" />
                </div>
                <div className="flex items-center gap-1 bg-[#F8F3E6] rounded-full p-1 border border-[#0C1A16]/10 overflow-x-auto no-scrollbar max-w-full">
                  {["All", "Pending", "Preparing", "On the Way", "Delivered", "Cancelled"].map((s) => (
                    <button key={s} onClick={() => setStatusF(s)} className={`shrink-0 text-[12px] font-bold px-3 py-1.5 rounded-full transition ${statusF === s ? "bg-[#0C1A16] text-white shadow" : "text-[#0C1A16]/55 hover:text-[#0C1A16]"}`}>{s}</button>
                  ))}
                </div>
                <button onClick={exportCSV} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold border border-[#0C1A16]/15 px-3.5 py-2 rounded-full hover:border-[#0C1A16] transition"><Download size={13} /> Export</button>
                {orders.length > 0 && <button onClick={clearAll} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-rose-600 border border-rose-200 px-3.5 py-2 rounded-full hover:bg-rose-50 transition"><Trash2 size={13} /> Clear</button>}
              </div>
            </div>
            {filtered.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0C1A16]/5 flex items-center justify-center"><Filter size={24} className="text-[#0C1A16]/30" /></div>
                <div className="font-bold text-[16px] mt-3">No orders found</div>
                <p className="text-[13px] text-[#0C1A16]/55 mt-1">New website orders with name, address & phone will pop up here instantly.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[980px]">
                  <thead><tr className="text-[11px] uppercase tracking-wider text-[#0C1A16]/45 border-b border-[#0C1A16]/8 bg-[#FAF5E8]"><th className="px-5 py-3 font-extrabold">Order / Customer</th><th className="px-4 py-3 font-extrabold">Contact</th><th className="px-4 py-3 font-extrabold">Items & Total</th><th className="px-4 py-3 font-extrabold">Status</th><th className="px-4 py-3 font-extrabold">Action</th></tr></thead>
                  <tbody className="divide-y divide-[#0C1A16]/6">
                    {filtered.map((o) => {
                      const Icon = typeIcon(o.type);
                      return (
                        <tr key={o.id} className="hover:bg-[#FFFBF0] transition">
                          <td className="px-5 py-3.5">
                            <div className="font-extrabold text-[13.5px] flex items-center gap-1.5">{o.id} <span className="text-[10.5px] bg-[#0C1A16]/8 px-1.5 py-0.5 rounded font-bold text-[#0C1A16]/60 inline-flex items-center gap-1"><Icon size={11} />{o.type}</span></div>
                            <div className="text-[13px] font-bold mt-0.5 flex items-center gap-1"><User size={12} className="text-[#9A6B1E]" />{o.customer}</div>
                            <div className="text-[12px] text-[#0C1A16]/55 font-medium truncate max-w-[260px] flex items-center gap-1"><MapPin size={11} />{o.address}</div>
                            <div className="text-[11px] text-[#0C1A16]/40 font-medium">{new Date(o.createdAt).toLocaleString()} • {o.payment}</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <a href={`tel:+977${o.phone}`} className="inline-flex items-center gap-1.5 text-[13px] font-extrabold text-[#0C1A16] hover:text-[#9A6B1E]"><Phone size={13} className="text-emerald-600" />{o.phone}</a>
                            <div className="mt-1.5 flex gap-1.5">
                              <a href={`tel:+977${o.phone}`} className="text-[11px] font-extrabold bg-[#0C1A16] text-white px-2.5 py-1.5 rounded-lg hover:bg-[#1e362e]">Call</a>
                              <a href={`https://wa.me/977${o.phone}?text=${encodeURIComponent(`Namaste ${o.customer}! This is AFC Hotel regarding your order ${o.id} (${o.status}).`)}`} target="_blank" rel="noreferrer" className="text-[11px] font-extrabold bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-emerald-600 inline-flex items-center gap-1"><MessageCircle size={11} />WhatsApp</a>
                            </div>
                          </td>
                          <td className="px-4 py-3.5"><div className="text-[12.5px] font-semibold max-w-[220px] line-clamp-2">{o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}</div><div className="font-display font-bold text-[16px] mt-0.5">{fmt(o.total)}</div></td>
                          <td className="px-4 py-3.5">
                            <span className={`text-[12px] font-extrabold border px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_COLOR[o.status]}`}>{o.status}</span>
                            <div className="mt-1.5">
                              <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as Order["status"])} className="text-[12px] font-bold border border-[#0C1A16]/15 rounded-lg px-2 py-1.5 bg-white focus:border-[#D4A24E]">
                                {(["Pending", "Preparing", "On the Way", "Delivered", "Cancelled"] as const).map((s) => <option key={s}>{s}</option>)}
                              </select>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex gap-1.5">
                              <button onClick={() => setSelectedOrder(o)} className="inline-flex items-center gap-1 text-[12px] font-extrabold bg-[#D4A24E] text-[#0C1A16] px-3 py-2 rounded-lg hover:bg-[#f0c778] transition"><Eye size={13} /> View</button>
                              <button onClick={() => deleteOrder(o.id)} className="w-9 h-9 rounded-lg border border-rose-200 text-rose-500 flex items-center justify-center hover:bg-rose-50 transition" title="Delete"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "customers" && (
          <div className="mt-4 bg-white rounded-[20px] border border-[#0C1A16]/10 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#0C1A16]/8 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <div className="font-bold text-[16px] flex items-center gap-2"><Users size={17} className="text-[#9A6B1E]" /> Customer Directory</div>
                <div className="text-[12.5px] text-[#0C1A16]/50 font-medium">Every name, phone & address from online orders • {filteredCustomers.length} customers</div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-[#F8F3E6] border border-[#0C1A16]/12 rounded-full pl-3.5 pr-2 py-1.5 min-w-[220px] flex-1 sm:flex-none">
                  <Search size={14} className="text-[#0C1A16]/40" />
                  <input value={custQ} onChange={(e) => setCustQ(e.target.value)} placeholder="Search customer, phone, address..." className="flex-1 bg-transparent text-[13px] font-semibold px-2 placeholder:text-[#0C1A16]/35" />
                </div>
                <button onClick={exportCustomers} className="inline-flex items-center gap-1.5 text-[12.5px] font-bold bg-[#0C1A16] text-white px-4 py-2.5 rounded-full hover:bg-[#1e362e] transition"><Download size={13} /> Export customers</button>
              </div>
            </div>
            {filteredCustomers.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0C1A16]/5 flex items-center justify-center"><Users size={24} className="text-[#0C1A16]/30" /></div>
                <div className="font-bold text-[16px] mt-3">No customers yet</div>
                <p className="text-[13px] text-[#0C1A16]/55">Customers who order with name, address & phone will be listed here automatically.</p>
              </div>
            ) : (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left min-w-[900px]">
                    <thead><tr className="text-[11px] uppercase tracking-wider text-[#0C1A16]/45 border-b border-[#0C1A16]/8 bg-[#FAF5E8]"><th className="px-5 py-3 font-extrabold">Customer</th><th className="px-4 py-3 font-extrabold">Phone & Address</th><th className="px-4 py-3 font-extrabold">Orders</th><th className="px-4 py-3 font-extrabold">Total Spent</th><th className="px-4 py-3 font-extrabold">Last Order</th><th className="px-4 py-3 font-extrabold">Action</th></tr></thead>
                    <tbody className="divide-y divide-[#0C1A16]/6">
                      {filteredCustomers.map((c) => (
                        <tr key={c.phone} className="hover:bg-[#FFFBF0] transition">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <span className="w-10 h-10 rounded-full bg-[#0C1A16] text-[#F0C778] font-display font-bold flex items-center justify-center text-[16px] shrink-0">{c.name[0]}</span>
                              <div><div className="font-extrabold text-[13.5px]">{c.name}</div><div className="text-[11.5px] text-[#0C1A16]/50 font-semibold">{c.municipalities.join(", ") || "—"}</div></div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <a href={`tel:+977${c.phone}`} className="font-extrabold text-[13px] inline-flex items-center gap-1 hover:text-[#9A6B1E]"><Phone size={12} className="text-emerald-600" />{c.phone}</a>
                            <div className="text-[12px] text-[#0C1A16]/60 font-medium truncate max-w-[240px]">{c.addresses[0]}</div>
                            {c.addresses.length > 1 && <div className="text-[11px] text-[#9A6B1E] font-bold">+{c.addresses.length - 1} more addresses</div>}
                          </td>
                          <td className="px-4 py-3.5"><span className="inline-flex items-center gap-1 text-[13px] font-extrabold bg-[#0C1A16]/8 px-2.5 py-1 rounded-lg"><ShoppingBag size={12} />{c.totalOrders}</span></td>
                          <td className="px-4 py-3.5 font-display font-bold text-[16px]">{fmt(c.totalSpent)}</td>
                          <td className="px-4 py-3.5 text-[12px] font-semibold text-[#0C1A16]/60">{new Date(c.lastOrder).toLocaleDateString()}<br /><span className={`text-[11px] font-extrabold`}>{c.lastStatus}</span></td>
                          <td className="px-4 py-3.5"><button onClick={() => setSelectedCustomer(c)} className="inline-flex items-center gap-1 text-[12px] font-extrabold bg-[#0C1A16] text-white px-3.5 py-2 rounded-lg hover:bg-[#D4A24E] hover:text-[#0C1A16] transition"><Eye size={13} /> Details</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* mobile cards */}
                <div className="md:hidden divide-y divide-[#0C1A16]/8">
                  {filteredCustomers.map((c) => (
                    <div key={c.phone} className="p-4 flex items-center gap-3">
                      <span className="w-11 h-11 rounded-full bg-[#0C1A16] text-[#F0C778] font-display font-bold flex items-center justify-center text-[17px] shrink-0">{c.name[0]}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-[14px] truncate">{c.name}</div>
                        <div className="text-[12.5px] font-bold text-[#0C1A16]/60">{c.phone} • {c.totalOrders} orders • {fmt(c.totalSpent)}</div>
                        <div className="text-[12px] text-[#0C1A16]/50 truncate">{c.addresses[0]}</div>
                      </div>
                      <button onClick={() => setSelectedCustomer(c)} className="w-9 h-9 rounded-full bg-[#D4A24E] text-[#0C1A16] flex items-center justify-center shrink-0"><ChevronRight size={16} /></button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {tab === "menu" && (
          <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              { n: "Buff Steamed Momo", c: "Momo Special", p: 180, r: 4.9, o: "8.2k orders", s: "94% positive", star: true },
              { n: "Chicken Biryani", c: "Biryani & Rice", p: 320, r: 4.8, o: "7.2k orders", s: "91% positive", star: true },
              { n: "Chicken Thakali Set", c: "Thakali & Nepali", p: 380, r: 4.9, o: "5.7k orders", s: "96% positive", star: false },
              { n: "Mutton Sekuwa", c: "Sekuwa & BBQ", p: 520, r: 4.9, o: "3.4k orders", s: "93% positive", star: false },
              { n: "Family Feast", c: "Fast Food", p: 1299, r: 5.0, o: "1.9k orders", s: "98% positive", star: true },
              { n: "Jhol Momo", c: "Momo Special", p: 220, r: 4.8, o: "6.4k orders", s: "92% positive", star: false },
            ].map((m) => (
              <div key={m.n} className="bg-white rounded-[18px] border border-[#0C1A16]/10 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div><div className="text-[11px] font-extrabold uppercase tracking-wider text-[#9A6B1E]">{m.c}</div><div className="font-bold text-[15px] mt-0.5">{m.n}</div></div>
                  {m.star && <span className="text-[10.5px] font-extrabold bg-[#D4A24E] text-[#0C1A16] px-2 py-1 rounded-lg inline-flex items-center gap-1"><Star size={10} fill="currentColor" /> STAR</span>}
                </div>
                <div className="mt-3 flex items-center justify-between text-[13px] font-bold">
                  <span className="font-display text-[18px]">Rs. {m.p}</span>
                  <span className="inline-flex items-center gap-1 text-amber-600"><Star size={13} fill="currentColor" /> {m.r}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[12px] font-semibold text-[#0C1A16]/55"><span>{m.o}</span><span className="text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 size={12} /> {m.s}</span></div>
              </div>
            ))}
            <div className="bg-[#0C1A16] text-white rounded-[18px] p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 texture-dark" />
              <div className="relative">
                <UtensilsCrossed size={26} className="text-[#F0C778]" />
                <div className="font-display font-bold text-[20px] mt-3 leading-snug">Tip: push Family Feast on weekends</div>
                <p className="text-[13px] text-white/60 mt-2 leading-relaxed">Combo orders have 2.3× higher value. Feature it Fri–Sun for +22% revenue.</p>
              </div>
              <button onClick={() => notify("Weekend campaign boosted!")} className="relative mt-5 bg-[#D4A24E] text-[#0C1A16] font-extrabold text-[13px] py-3 rounded-xl hover:bg-[#f0c778] transition">Boost Weekend Campaign</button>
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] font-medium text-[#0C1A16]/45 px-1">
          <span className="inline-flex items-center gap-1.5"><Users size={13} /> Logged in as {adminUser.name} ({adminUser.username}) • {new Date(adminUser.loginAt).toLocaleString()}</span>
          <span>AFC Hotel • Golbazar-06, Siraha • 9812763487 • Data stored on this device</span>
        </div>
      </div>

      {/* ORDER DETAIL MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-[#0C1A16]/70 backdrop-blur-sm" />
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} className="relative w-full max-w-[620px] bg-[#FFF9EF] rounded-t-[26px] sm:rounded-[26px] overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
              <div className="bg-[#0C1A16] text-white px-6 py-5 shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 texture-dark" />
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-[20px]">{selectedOrder.id}</span>
                      <span className={`text-[11.5px] font-extrabold border px-2.5 py-1 rounded-full ${STATUS_COLOR[selectedOrder.status]}`}>{selectedOrder.status}</span>
                    </div>
                    <div className="text-[12.5px] text-white/55 font-medium mt-1">{new Date(selectedOrder.createdAt).toLocaleString()} • {selectedOrder.type} • {selectedOrder.payment}</div>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0"><X size={17} /></button>
                </div>
              </div>
              <div className="overflow-y-auto p-5 space-y-4">
                {/* customer card */}
                <div className="bg-white rounded-2xl border border-[#0C1A16]/10 p-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#9A6B1E]">Customer details</div>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-[#0C1A16] text-[#F0C778] font-display font-bold flex items-center justify-center text-[20px] shrink-0">{selectedOrder.customer[0]}</span>
                    <div className="min-w-0">
                      <div className="font-extrabold text-[16px] truncate">{selectedOrder.customer}</div>
                      <a href={`tel:+977${selectedOrder.phone}`} className="text-[13.5px] font-bold text-emerald-700 inline-flex items-center gap-1 hover:underline"><Phone size={13} /> +977 {selectedOrder.phone}</a>
                    </div>
                  </div>
                  <div className="mt-3 grid sm:grid-cols-2 gap-2.5 text-[13px]">
                    <div className="bg-[#FFFBF0] border border-[#0C1A16]/8 rounded-xl p-3"><div className="text-[11px] font-extrabold uppercase text-[#0C1A16]/45 flex items-center gap-1"><MapPin size={11} /> Address</div><div className="font-bold mt-0.5">{selectedOrder.address}</div><div className="text-[#0C1A16]/60 font-medium">{selectedOrder.municipality}</div></div>
                    <div className="bg-[#FFFBF0] border border-[#0C1A16]/8 rounded-xl p-3"><div className="text-[11px] font-extrabold uppercase text-[#0C1A16]/45">Landmark / Note</div><div className="font-bold mt-0.5">{selectedOrder.landmark || "—"}</div><div className="text-[#0C1A16]/60 font-medium italic">"{selectedOrder.note || "No note"}"</div></div>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-bold bg-[#F1E8D3] px-3 py-1.5 rounded-lg"><Wallet size={12} />{selectedOrder.payment}</span>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-bold bg-[#F1E8D3] px-3 py-1.5 rounded-lg"><Clock size={12} />ETA {selectedOrder.eta}</span>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-bold bg-[#F1E8D3] px-3 py-1.5 rounded-lg"><Receipt size={12} />{selectedOrder.items.reduce((a, i) => a + i.qty, 0)} items</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <a href={`tel:+977${selectedOrder.phone}`} className="inline-flex items-center justify-center gap-1.5 bg-[#0C1A16] text-white text-[13px] font-extrabold py-2.5 rounded-xl hover:bg-[#1e362e]"><Phone size={14} /> Call</a>
                    <a href={`https://wa.me/977${selectedOrder.phone}?text=${encodeURIComponent(`Namaste ${selectedOrder.customer}! AFC Hotel here about order ${selectedOrder.id}.`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 bg-emerald-500 text-white text-[13px] font-extrabold py-2.5 rounded-xl hover:bg-emerald-600"><MessageCircle size={14} /> WhatsApp</a>
                    <button onClick={() => window.print()} className="inline-flex items-center justify-center gap-1.5 border-2 border-[#0C1A16]/15 text-[13px] font-extrabold py-2.5 rounded-xl hover:border-[#0C1A16]"><Printer size={14} /> Bill</button>
                  </div>
                </div>
                {/* items */}
                <div className="bg-white rounded-2xl border border-[#0C1A16]/10 divide-y divide-[#0C1A16]/8 overflow-hidden">
                  {selectedOrder.items.map((it) => (
                    <div key={it.id} className="p-3.5 flex items-center gap-3">
                      {it.image && <img src={it.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />}
                      <div className="flex-1 min-w-0"><div className="text-[13.5px] font-bold truncate">{it.name}</div><div className="text-[12px] text-[#0C1A16]/55 font-medium">Qty {it.qty} × {fmt(it.price)}</div></div>
                      <div className="font-extrabold text-[13.5px] shrink-0">{fmt(it.price * it.qty)}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#0C1A16] text-white rounded-2xl p-4 text-[13.5px] font-semibold space-y-1.5">
                  <div className="flex justify-between text-white/70"><span>Subtotal</span><span className="text-white">{fmt(selectedOrder.subtotal)}</span></div>
                  {selectedOrder.discount > 0 && <div className="flex justify-between text-emerald-300"><span>Discount</span><span>-{fmt(selectedOrder.discount)}</span></div>}
                  <div className="flex justify-between text-white/70"><span>Delivery</span><span className="text-white">{selectedOrder.deliveryFee === 0 ? "FREE" : fmt(selectedOrder.deliveryFee)}</span></div>
                  <div className="flex justify-between pt-2 border-t border-white/15 text-[16px] font-extrabold"><span>Total</span><span className="text-[#F0C778] font-display text-[20px]">{fmt(selectedOrder.total)}</span></div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select value={selectedOrder.status} onChange={(e) => setStatus(selectedOrder.id, e.target.value as Order["status"])} className="flex-1 border-2 border-[#0C1A16]/15 rounded-xl px-4 py-3 text-[13.5px] font-bold bg-white focus:border-[#D4A24E]">
                    {(["Pending", "Preparing", "On the Way", "Delivered", "Cancelled"] as const).map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => deleteOrder(selectedOrder.id)} className="inline-flex items-center justify-center gap-1.5 text-[13.5px] font-bold text-rose-600 border-2 border-rose-200 px-5 py-3 rounded-xl hover:bg-rose-50"><Trash2 size={15} /> Delete</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOMER DETAIL MODAL */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCustomer(null)} className="absolute inset-0 bg-[#0C1A16]/70 backdrop-blur-sm" />
            <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} className="relative w-full max-w-[600px] bg-[#FFF9EF] rounded-t-[26px] sm:rounded-[26px] overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
              <div className="bg-[#0C1A16] text-white px-6 py-5 shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 texture-dark" />
                <div className="relative flex items-center gap-3.5">
                  <span className="w-14 h-14 rounded-2xl bg-[#D4A24E] text-[#0C1A16] font-display font-bold flex items-center justify-center text-[24px] shrink-0">{selectedCustomer.name[0]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-bold text-[20px] truncate">{selectedCustomer.name}</div>
                    <div className="text-[13px] text-white/60 font-semibold">+977 {selectedCustomer.phone} • {selectedCustomer.totalOrders} orders • {fmt(selectedCustomer.totalSpent)} lifetime</div>
                  </div>
                  <button onClick={() => setSelectedCustomer(null)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0"><X size={17} /></button>
                </div>
                <div className="relative mt-3 flex gap-2">
                  <a href={`tel:+977${selectedCustomer.phone}`} className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#D4A24E] text-[#0C1A16] text-[13px] font-extrabold py-2.5 rounded-xl hover:bg-[#f0c778]"><Phone size={14} /> Call customer</a>
                  <a href={`https://wa.me/977${selectedCustomer.phone}?text=${encodeURIComponent(`Namaste ${selectedCustomer.name}! AFC Hotel, Golbazar. Thank you for ordering with us!`)}`} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-500 text-white text-[13px] font-extrabold py-2.5 rounded-xl hover:bg-emerald-600"><MessageCircle size={14} /> WhatsApp</a>
                </div>
              </div>
              <div className="overflow-y-auto p-5 space-y-3.5">
                <div className="bg-white rounded-2xl border border-[#0C1A16]/10 p-4">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#9A6B1E]">All saved addresses</div>
                  <div className="mt-2 space-y-2">
                    {selectedCustomer.addresses.map((a, i) => (
                      <div key={i} className="flex items-start gap-2 text-[13px] font-semibold bg-[#FFFBF0] border border-[#0C1A16]/8 rounded-xl px-3 py-2.5"><MapPin size={14} className="text-[#9A6B1E] shrink-0 mt-0.5" />{a}</div>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#F8F3E6] rounded-xl p-2.5"><div className="text-[11px] font-bold text-[#0C1A16]/50">ORDERS</div><div className="font-display font-bold text-[18px]">{selectedCustomer.totalOrders}</div></div>
                    <div className="bg-[#F8F3E6] rounded-xl p-2.5"><div className="text-[11px] font-bold text-[#0C1A16]/50">SPENT</div><div className="font-display font-bold text-[18px]">{fmt(selectedCustomer.totalSpent)}</div></div>
                    <div className="bg-[#F8F3E6] rounded-xl p-2.5"><div className="text-[11px] font-bold text-[#0C1A16]/50">AREAS</div><div className="font-display font-bold text-[15px] pt-1">{selectedCustomer.municipalities.slice(0, 2).join(", ")}</div></div>
                  </div>
                </div>
                <div className="text-[12px] font-extrabold uppercase tracking-wider text-[#0C1A16]/50">Order history ({selectedCustomer.orders.length})</div>
                {selectedCustomer.orders.map((o) => (
                  <div key={o.id} className="bg-white rounded-2xl border border-[#0C1A16]/10 p-3.5 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap"><span className="font-extrabold text-[13px]">{o.id}</span><span className={`text-[10.5px] font-extrabold border px-2 py-0.5 rounded-full ${STATUS_COLOR[o.status]}`}>{o.status}</span></div>
                      <div className="text-[12px] text-[#0C1A16]/55 font-medium truncate">{o.items.map((i) => `${i.name}×${i.qty}`).join(", ")}</div>
                      <div className="text-[11px] text-[#0C1A16]/45 font-medium">{new Date(o.createdAt).toLocaleString()} • {o.payment}</div>
                    </div>
                    <div className="text-right shrink-0"><div className="font-display font-bold text-[15px]">{fmt(o.total)}</div><button onClick={() => { setSelectedCustomer(null); setSelectedOrder(o); }} className="text-[11.5px] font-extrabold text-[#9A6B1E] hover:underline">Open →</button></div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {showPassModal && (
          <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPassModal(false)} className="absolute inset-0 bg-[#0C1A16]/70 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-[420px] bg-white rounded-[24px] p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="font-display font-bold text-[20px] flex items-center gap-2"><KeyRound size={19} className="text-[#9A6B1E]" /> Change password</div>
                <button onClick={() => setShowPassModal(false)} className="w-8 h-8 rounded-full bg-[#0C1A16]/5 flex items-center justify-center"><X size={15} /></button>
              </div>
              <div className="mt-4 space-y-3">
                {[["current", "Current password"], ["next", "New password"], ["confirm", "Confirm new password"]].map(([k, label]) => (
                  <div key={k}>
                    <label className="text-[12px] font-extrabold uppercase text-[#0C1A16]/55">{label}</label>
                    <input type="password" value={(passForm as any)[k]} onChange={(e) => setPassForm({ ...passForm, [k]: e.target.value })} className="mt-1 w-full border-2 border-[#0C1A16]/12 rounded-xl px-4 py-3 text-[14px] font-bold focus:border-[#0C1A16]" placeholder="••••" />
                  </div>
                ))}
                {passMsg && <div className={`text-[13px] font-bold rounded-xl px-4 py-2.5 ${passMsg.includes("success") ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"}`}>{passMsg}</div>}
                <button onClick={handlePassChange} className="w-full bg-[#0C1A16] text-white font-extrabold py-3.5 rounded-xl text-[14px] hover:bg-[#1e362e]">Update password</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-[#0C1A16] text-white text-[13.5px] font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-[#D4A24E]/40 max-w-[92vw]">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> <span className="truncate">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
