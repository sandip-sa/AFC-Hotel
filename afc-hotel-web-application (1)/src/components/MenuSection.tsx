import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Flame, Leaf, Minus, Plus, Search, ShoppingBag, Star } from "lucide-react";
import { CATEGORIES, MENU, fmt, type MenuItem } from "../data/hotel";

export default function MenuSection({
  cart,
  add,
  setQty,
  onCart,
}: {
  cart: Record<string, number>;
  add: (m: MenuItem) => void;
  setQty: (id: string, qty: number) => void;
  onCart: () => void;
}) {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const [vegOnly, setVegOnly] = useState(false);

  const list = useMemo(() => {
    return MENU.filter((m) => {
      if (cat !== "All" && m.category !== cat) return false;
      if (vegOnly && !m.veg) return false;
      if (q && !(m.name + m.nepali + m.desc).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [cat, q, vegOnly]);

  return (
    <section id="menu" className="relative bg-[#FFF9EF] py-14 lg:py-20 scroll-mt-20">
      <div className="absolute inset-0 texture-grain opacity-70 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4">
        {/* heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-[620px]">
            <div className="inline-flex items-center gap-2 bg-[#0C1A16] text-[#F0C778] text-[11.5px] font-extrabold tracking-[0.18em] uppercase px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A24E] animate-pulse" /> AFC Restaurant • Live Kitchen
            </div>
            <h2 className="font-display text-[34px] sm:text-[46px] leading-[1.05] font-bold mt-4 tracking-tight">
              Craving something? <br />
              <span className="italic text-[#9A6B1E]">Order in one tap.</span>
            </h2>
            <p className="mt-3 text-[15px] text-[#0C1A16]/65 leading-relaxed">
              From chula-smoked sekuwa to soupy jhol momo — cooked fresh after you order. Add to bag, enter your name, address & phone, and we ride to your door.
            </p>
          </div>
          {/* search */}
          <div className="w-full lg:w-[380px]">
            <div className="flex items-center gap-2 bg-white border border-[#0C1A16]/12 rounded-full pl-4 pr-2 py-2 shadow-sm focus-within:border-[#D4A24E] transition">
              <Search size={17} className="text-[#0C1A16]/40 shrink-0" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search momo, biryani, thakali..." className="flex-1 bg-transparent text-[14px] font-medium placeholder:text-[#0C1A16]/35" />
              <button onClick={() => setVegOnly(!vegOnly)} className={`inline-flex items-center gap-1.5 text-[12px] font-extrabold px-3.5 py-2 rounded-full border transition ${vegOnly ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-600/30 hover:border-emerald-600"}`}>
                <Leaf size={13} /> VEG
              </button>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[12.5px] font-semibold text-[#0C1A16]/60 px-1">
              <span>{list.length} dishes available • Kitchen open till 10:30 PM</span>
              {Object.values(cart).reduce((a, b) => a + b, 0) > 0 && (
                <button onClick={onCart} className="text-[#9A6B1E] font-extrabold hover:underline">View bag →</button>
              )}
            </div>
          </div>
        </div>

        {/* categories */}
        <div className="mt-7 flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {CATEGORIES.map((c) => {
            const active = cat === c;
            const count = c === "All" ? MENU.length : MENU.filter((m) => m.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 inline-flex items-center gap-2 px-4.5 px-5 py-2.5 rounded-full text-[13.5px] font-bold border transition-all ${active ? "bg-[#0C1A16] text-[#F0C778] border-[#0C1A16] shadow-lg shadow-[#0C1A16]/20" : "bg-white text-[#0C1A16]/70 border-[#0C1A16]/12 hover:border-[#D4A24E] hover:text-[#0C1A16]"}`}
              >
                {c}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-extrabold ${active ? "bg-[#D4A24E] text-[#0C1A16]" : "bg-[#0C1A16]/8 text-[#0C1A16]/60"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* grid */}
        <motion.div layout className="mt-7 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {list.map((m) => {
              const qty = cart[m.id] || 0;
              return (
                <motion.article
                  layout
                  key={m.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white rounded-[22px] overflow-hidden border border-[#0C1A16]/10 shadow-[0_10px_30px_-14px_rgba(12,26,22,0.25)] card-lift hover:shadow-[0_24px_50px_-16px_rgba(12,26,22,0.35)] hover:border-[#D4A24E]/50 flex flex-col"
                >
                  <div className="relative h-[190px] overflow-hidden">
                    <img src={m.image} alt={m.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-108 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-md bg-white flex items-center justify-center border-2 ${m.veg ? "border-emerald-600" : "border-rose-600"}`}>
                        <span className={`w-2.5 h-2.5 rounded-full ${m.veg ? "bg-emerald-600" : "bg-rose-600"}`} />
                      </span>
                      {m.badge && <span className="text-[11px] font-extrabold bg-[#D4A24E] text-[#0C1A16] px-2.5 py-1 rounded-full shadow">{m.badge}</span>}
                    </div>
                    <div className="absolute top-3 right-3 bg-black/55 backdrop-blur text-white text-[11.5px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                      <Clock size={11} className="text-[#F0C778]" /> {m.time}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 bg-white/95 text-[#0C1A16] text-[12px] font-extrabold px-2 py-1 rounded-lg"><Star size={12} className="text-amber-500" fill="currentColor" /> {m.rating}</span>
                        <span className="text-white/90 text-[11.5px] font-semibold">{(m.orders / 1000).toFixed(1)}k orders</span>
                      </div>
                      {m.spicy > 0 && (
                        <span className="inline-flex items-center gap-0.5 bg-black/50 backdrop-blur px-2 py-1 rounded-lg">
                          {[1, 2, 3].map((i) => (
                            <Flame key={i} size={11} className={i <= m.spicy ? "text-orange-400" : "text-white/25"} fill={i <= m.spicy ? "currentColor" : "none"} />
                          ))}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#9A6B1E]">{m.category} • {m.nepali}</div>
                    <h3 className="font-bold text-[15.5px] leading-snug mt-1 tracking-tight">{m.name}</h3>
                    <p className="text-[13px] text-[#0C1A16]/60 leading-relaxed mt-1.5 line-clamp-2 flex-1">{m.desc}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="leading-tight">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-extrabold text-[17px]">{fmt(m.price)}</span>
                          {m.mrp && <span className="text-[12.5px] text-[#0C1A16]/40 line-through font-semibold">{fmt(m.mrp)}</span>}
                        </div>
                        {m.mrp && <div className="text-[11px] font-extrabold text-emerald-600">Save {fmt(m.mrp - m.price)}</div>}
                      </div>
                      {qty === 0 ? (
                        <button onClick={() => add(m)} className="inline-flex items-center gap-1.5 bg-[#0C1A16] hover:bg-[#D4A24E] hover:text-[#0C1A16] text-white text-[13px] font-extrabold px-4.5 px-5 py-2.5 rounded-full transition-all active:scale-95 shadow">
                          <Plus size={14} strokeWidth={3} /> ADD
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-1 bg-[#0C1A16] text-white rounded-full p-1 shadow">
                          <button onClick={() => setQty(m.id, qty - 1)} className="w-8 h-8 rounded-full bg-white/15 hover:bg-[#D4A24E] hover:text-[#0C1A16] flex items-center justify-center transition"><Minus size={14} strokeWidth={3} /></button>
                          <span className="min-w-[26px] text-center font-extrabold text-[14px]">{qty}</span>
                          <button onClick={() => setQty(m.id, qty + 1)} className="w-8 h-8 rounded-full bg-[#D4A24E] text-[#0C1A16] flex items-center justify-center hover:bg-[#f0c778] transition"><Plus size={14} strokeWidth={3} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {list.length === 0 && (
          <div className="mt-10 text-center py-14 bg-white rounded-[24px] border border-dashed border-[#0C1A16]/20">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0C1A16]/5 flex items-center justify-center"><ShoppingBag size={22} className="text-[#0C1A16]/40" /></div>
            <div className="font-bold text-[17px] mt-3">No dishes found</div>
            <div className="text-[13.5px] text-[#0C1A16]/55">Try a different search or category</div>
            <button onClick={() => { setQ(""); setCat("All"); setVegOnly(false); }} className="mt-4 text-[13px] font-bold bg-[#0C1A16] text-white px-5 py-2.5 rounded-full">Reset filters</button>
          </div>
        )}

        {/* promo strip */}
        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {[
            { code: "AFC20", t: "Flat 20% OFF", d: "On orders above Rs.799 • Max Rs.250" },
            { code: "FREEDEL", t: "Free Delivery", d: "On all orders above Rs.999" },
            { code: "FAMILY15", t: "15% OFF Feast", d: "On Family Feast & Party packs" },
          ].map((p) => (
            <div key={p.code} className="relative overflow-hidden bg-[#0C1A16] text-white rounded-2xl p-5 flex items-center justify-between gap-3 border border-[#D4A24E]/25">
              <div className="absolute inset-0 texture-dark" />
              <div className="relative">
                <div className="font-display font-bold text-[18px] text-[#F0C778]">{p.t}</div>
                <div className="text-[12.5px] text-white/60 font-medium mt-0.5">{p.d}</div>
              </div>
              <button onClick={() => { navigator.clipboard?.writeText(p.code).catch(()=>{}); }} className="relative shrink-0 border border-dashed border-[#D4A24E]/60 text-[#F0C778] text-[12.5px] font-extrabold px-3.5 py-2.5 rounded-xl hover:bg-[#D4A24E] hover:text-[#0C1A16] hover:border-solid transition" title="Tap to copy">{p.code}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
