import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgePercent, Bike, CheckCircle2, ChevronRight, Clock, Home, MapPin, Minus, Phone, Plus, ShoppingBag, Store, Trash2, User, UtensilsCrossed, Wallet, X } from "lucide-react";
import { HOTEL, MENU, fmt, type MenuItem, type Order } from "../data/hotel";

type CartLine = { item: MenuItem; qty: number };

export function CartDrawer({
  open, onClose, lines, setQty, clear, onCheckout,
}: {
  open: boolean; onClose: () => void; lines: CartLine[];
  setQty: (id: string, qty: number) => void; clear: () => void; onCheckout: () => void;
}) {
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState<string | null>(() => {
    try { return localStorage.getItem("afc_promo_v1"); } catch { return null; }
  });

  useEffect(() => {
    try {
      if (applied) localStorage.setItem("afc_promo_v1", applied);
      else localStorage.removeItem("afc_promo_v1");
    } catch {}
  }, [applied]);

  const subtotal = lines.reduce((a, l) => a + l.item.price * l.qty, 0);
  const discount = useMemo(() => {
    if (applied === "AFC20" && subtotal >= 799) return Math.min(250, Math.round(subtotal * 0.2));
    if (applied === "FAMILY15") {
      const feast = lines.filter((l) => l.item.id.includes("feast") || l.item.id.includes("pizza") || l.item.id.includes("burger")).reduce((a, l) => a + l.item.price * l.qty, 0);
      return Math.round(feast * 0.15);
    }
    if (applied === "WELCOME10" && subtotal >= 499) return Math.round(subtotal * 0.1);
    return 0;
  }, [applied, subtotal, lines]);
  const deliveryFee = subtotal === 0 ? 0 : applied === "FREEDEL" ? 0 : subtotal - discount >= HOTEL.freeDeliveryAbove ? 0 : HOTEL.deliveryFee;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (["AFC20", "FREEDEL", "FAMILY15", "WELCOME10"].includes(code)) {
      if (code === "FREEDEL") {
        if (subtotal >= HOTEL.freeDeliveryAbove) setApplied(code);
        else alert(`FREEDEL needs minimum Rs.${HOTEL.freeDeliveryAbove} order`);
        return;
      }
      setApplied(code);
    } else alert("Invalid promo code. Try AFC20, FREEDEL, FAMILY15");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-[#0C1A16]/60 backdrop-blur-sm z-[70]" />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[440px] bg-[#FFF9EF] z-[71] flex flex-col shadow-2xl"
          >
            <div className="bg-[#0C1A16] text-white p-5 pb-6 rounded-b-[26px] relative overflow-hidden shrink-0">
              <div className="absolute inset-0 texture-dark" />
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 font-display font-bold text-[20px]"><ShoppingBag size={19} className="text-[#F0C778]" /> Your Order Bag</div>
                  <div className="text-[12.5px] text-white/60 font-medium mt-0.5">{lines.length === 0 ? "Bag is empty — let's fix that" : `${lines.reduce((a, l) => a + l.qty, 0)} items • ${HOTEL.shortAddress}`}</div>
                </div>
                <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"><X size={17} /></button>
              </div>
              {subtotal > 0 && subtotal - discount < HOTEL.freeDeliveryAbove && (
                <div className="relative mt-4 bg-white/10 border border-white/15 rounded-xl p-3">
                  <div className="text-[12px] font-bold text-[#F0C778]">Add {fmt(HOTEL.freeDeliveryAbove - (subtotal - discount))} more for FREE delivery</div>
                  <div className="mt-2 h-1.5 bg-white/15 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#D4A24E] to-[#F0C778] rounded-full transition-all" style={{ width: `${Math.min(100, ((subtotal - discount) / HOTEL.freeDeliveryAbove) * 100)}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {lines.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto rounded-[24px] bg-[#0C1A16]/5 flex items-center justify-center"><UtensilsCrossed size={30} className="text-[#0C1A16]/30" /></div>
                  <div className="font-display font-bold text-[20px] mt-4">Hungry? Let's fix that.</div>
                  <p className="text-[13.5px] text-[#0C1A16]/55 mt-1 max-w-[260px] mx-auto">Hot momos, biryani & sekuwa are one tap away. Your bag is waiting.</p>
                  <button onClick={onClose} className="mt-5 bg-[#0C1A16] text-white text-[13.5px] font-bold px-6 py-3 rounded-full hover:bg-[#1c332b] transition">Browse Menu</button>
                </div>
              ) : (
                <>
                  {lines.map(({ item, qty }) => (
                    <div key={item.id} className="bg-white rounded-2xl border border-[#0C1A16]/10 p-3 flex gap-3 shadow-sm">
                      <img src={item.image} alt={item.name} className="w-[72px] h-[72px] rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-bold text-[13.5px] leading-snug truncate">{item.name}</div>
                          <button onClick={() => setQty(item.id, 0)} className="text-[#0C1A16]/30 hover:text-rose-600 transition shrink-0"><Trash2 size={15} /></button>
                        </div>
                        <div className="text-[12px] text-[#0C1A16]/50 font-medium">{fmt(item.price)} each</div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center gap-1 bg-[#FFF3DE] border border-[#D4A24E]/30 rounded-full p-1">
                            <button onClick={() => setQty(item.id, qty - 1)} className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[#0C1A16] hover:text-white transition"><Minus size={13} strokeWidth={3} /></button>
                            <span className="min-w-[24px] text-center text-[13.5px] font-extrabold">{qty}</span>
                            <button onClick={() => setQty(item.id, qty + 1)} className="w-7 h-7 rounded-full bg-[#0C1A16] text-white flex items-center justify-center hover:bg-[#D4A24E] hover:text-[#0C1A16] transition"><Plus size={13} strokeWidth={3} /></button>
                          </div>
                          <div className="font-extrabold text-[14.5px]">{fmt(item.price * qty)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={clear} className="w-full text-center text-[12.5px] font-bold text-rose-600/80 hover:text-rose-600 py-1">Clear bag</button>

                  {/* promo */}
                  <div className="bg-white rounded-2xl border border-dashed border-[#D4A24E]/50 p-3.5">
                    <div className="flex items-center gap-2 text-[13px] font-extrabold"><BadgePercent size={15} className="text-[#9A6B1E]" /> Have a promo code?</div>
                    {applied ? (
                      <div className="mt-2 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
                        <span className="text-[13px] font-extrabold text-emerald-700">✓ {applied} applied • -{fmt(discount)}</span>
                        <button onClick={() => { setApplied(null); setPromo(""); }} className="text-[12px] font-bold text-emerald-700/60 hover:text-rose-600">Remove</button>
                      </div>
                    ) : (
                      <div className="mt-2 flex gap-2">
                        <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Try AFC20" className="flex-1 bg-[#FFF9EF] border border-[#0C1A16]/12 rounded-xl px-3 py-2.5 text-[13px] font-bold uppercase placeholder:normal-case placeholder:font-medium" />
                        <button onClick={applyPromo} className="bg-[#0C1A16] text-white text-[13px] font-bold px-4 rounded-xl hover:bg-[#D4A24E] hover:text-[#0C1A16] transition">Apply</button>
                      </div>
                    )}
                    <div className="mt-2 flex gap-1.5 flex-wrap">
                      {["AFC20", "FREEDEL", "FAMILY15"].map((c) => (
                        <button key={c} onClick={() => { setPromo(c); }} className="text-[11px] font-extrabold bg-[#FFF3DE] border border-[#D4A24E]/30 px-2.5 py-1 rounded-lg hover:bg-[#D4A24E] hover:text-[#0C1A16] transition">{c}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {lines.length > 0 && (
              <div className="shrink-0 p-4 pt-2 bg-[#FFF9EF] border-t border-[#0C1A16]/10">
                <div className="bg-white rounded-2xl border border-[#0C1A16]/10 p-4 space-y-1.5 text-[13px] font-semibold">
                  <div className="flex justify-between text-[#0C1A16]/65"><span>Subtotal</span><span className="text-[#0C1A16] font-bold">{fmt(subtotal)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Promo discount ({applied})</span><span>-{fmt(discount)}</span></div>}
                  <div className="flex justify-between text-[#0C1A16]/65"><span className="inline-flex items-center gap-1"><Bike size={13} /> Delivery fee</span><span className={deliveryFee === 0 ? "text-emerald-600 font-bold" : "text-[#0C1A16] font-bold"}>{deliveryFee === 0 ? "FREE" : fmt(deliveryFee)}</span></div>
                  <div className="flex justify-between pt-2 border-t border-dashed border-[#0C1A16]/15 text-[15px] font-extrabold"><span>To Pay</span><span className="font-display text-[20px]">{fmt(total)}</span></div>
                </div>
                <button onClick={onCheckout} className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-[#0C1A16] hover:bg-[#D4A24E] hover:text-[#0C1A16] text-white font-extrabold py-4 rounded-2xl text-[15px] transition-all shadow-lg active:scale-[0.98]">
                  Place Order • {fmt(total)} <ChevronRight size={17} />
                </button>
                <div className="mt-2 text-center text-[11.5px] text-[#0C1A16]/50 font-medium flex items-center justify-center gap-1"><Clock size={11} /> Estimated delivery 25-35 min • COD, eSewa, Khalti accepted</div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

type Form = {
  name: string; phone: string; address: string; municipality: string; landmark: string;
  note: string; type: Order["type"]; payment: string;
};

export function CheckoutModal({
  open, onClose, lines, total, deliveryFee, discount, subtotal, onPlaced,
}: {
  open: boolean; onClose: () => void; lines: CartLine[];
  total: number; deliveryFee: number; discount: number; subtotal: number;
  onPlaced: (o: Order) => void;
}) {
  const [step, setStep] = useState(1);
  const [f, setF] = useState<Form>({ name: "", phone: "", address: "", municipality: "Golbazar", landmark: "", note: "", type: "Delivery", payment: "Cash on Delivery" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);

  const set = (k: keyof Form, v: string) => {
    setF((p) => ({ ...p, [k]: v }));
    setErr((p) => ({ ...p, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (f.name.trim().length < 3) e.name = "Please enter your full name";
    if (!/^(98|97)\d{8}$/.test(f.phone.replace(/[\s-]/g, ""))) e.phone = "Enter valid 10-digit mobile (98XXXXXXXX)";
    if (f.type === "Delivery") {
      if (f.address.trim().length < 5) e.address = "Enter house / street / tole for delivery";
      if (!f.municipality.trim()) e.municipality = "Select your area";
    }
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const place = () => {
    if (!validate()) { setStep(1); return; }
    setPlacing(true);
    setTimeout(() => {
      const id = "AFC-" + Math.floor(100000 + Math.random() * 900000);
      const order: Order = {
        id,
        customer: f.name.trim(),
        phone: f.phone.trim(),
        address: f.type === "Delivery" ? `${f.address.trim()}, ${f.municipality}` : f.type,
        municipality: f.municipality,
        landmark: f.landmark.trim(),
        note: f.note.trim(),
        items: lines.map((l) => ({ id: l.item.id, name: l.item.name, price: l.item.price, qty: l.qty, image: l.item.image })),
        subtotal, deliveryFee: f.type === "Delivery" ? deliveryFee : 0, discount,
        total: f.type === "Delivery" ? total : subtotal - discount,
        payment: f.payment,
        type: f.type,
        status: "Pending",
        createdAt: Date.now(),
        eta: f.type === "Delivery" ? "25-35 min" : f.type === "Room Booking" ? "Check-in 12 PM" : "15-20 min",
      };
      setPlacing(false);
      onPlaced(order);
      setStep(3);
    }, 1400);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-[#0C1A16]/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative w-full max-w-[640px] bg-[#FFF9EF] rounded-t-[28px] sm:rounded-[28px] overflow-hidden shadow-2xl max-h-[94vh] flex flex-col">
        {/* header */}
        <div className="bg-[#0C1A16] text-white px-6 py-5 relative overflow-hidden shrink-0">
          <div className="absolute inset-0 texture-dark" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="font-display font-bold text-[20px]">Complete your order</div>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full text-[12px] font-extrabold flex items-center justify-center transition ${step >= s ? "bg-[#D4A24E] text-[#0C1A16]" : "bg-white/15 text-white/60"}`}>{s}</span>
                    <span className={`text-[12px] font-bold ${step >= s ? "text-[#F0C778]" : "text-white/40"}`}>{s === 1 ? "Details" : s === 2 ? "Review" : "Done"}</span>
                    {s < 3 && <span className={`w-8 h-[2px] rounded ${step > s ? "bg-[#D4A24E]" : "bg-white/15"}`} />}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><X size={17} /></button>
          </div>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          {step === 1 && (
            <div className="space-y-4">
              {/* order type */}
              <div>
                <label className="text-[12.5px] font-extrabold tracking-wide uppercase text-[#0C1A16]/60">How do you want it?</label>
                <div className={`mt-2 grid gap-2 ${lines.some((l) => l.item.id.startsWith("room-")) ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
                  {[
                    { v: "Delivery", icon: Bike, d: "25-35 min" },
                    { v: "Takeaway", icon: Store, d: "15-20 min" },
                    { v: "Dine-In", icon: UtensilsCrossed, d: "Table ready" },
                    ...(lines.some((l) => l.item.id.startsWith("room-")) ? [{ v: "Room Booking", icon: Home, d: "Check-in 12 PM" }] : []),
                  ].map((t) => (
                    <button key={t.v} onClick={() => set("type", t.v as any)} className={`rounded-2xl border-2 p-3 text-center transition ${f.type === t.v ? "border-[#0C1A16] bg-[#0C1A16] text-white shadow-lg" : "border-[#0C1A16]/12 bg-white hover:border-[#D4A24E]"}`}>
                      <t.icon size={19} className={`mx-auto ${f.type === t.v ? "text-[#F0C778]" : "text-[#9A6B1E]"}`} />
                      <div className="text-[13px] font-extrabold mt-1.5">{t.v}</div>
                      <div className={`text-[11px] font-medium ${f.type === t.v ? "text-white/60" : "text-[#0C1A16]/50"}`}>{t.d}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[12.5px] font-extrabold flex items-center gap-1.5 text-[#0C1A16]/70"><User size={13} className="text-[#9A6B1E]" /> FULL NAME *</label>
                  <input value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Aarav Chaudhary" className={`mt-1.5 w-full bg-white border rounded-xl px-4 py-3 text-[14px] font-medium placeholder:text-[#0C1A16]/30 ${err.name ? "border-rose-500" : "border-[#0C1A16]/15 focus:border-[#D4A24E]"}`} />
                  {err.name && <p className="text-[12px] text-rose-600 font-semibold mt-1">{err.name}</p>}
                </div>
                <div>
                  <label className="text-[12.5px] font-extrabold flex items-center gap-1.5 text-[#0C1A16]/70"><Phone size={13} className="text-[#9A6B1E]" /> PHONE NUMBER *</label>
                  <div className={`mt-1.5 flex items-center bg-white border rounded-xl overflow-hidden ${err.phone ? "border-rose-500" : "border-[#0C1A16]/15 focus-within:border-[#D4A24E]"}`}>
                    <span className="pl-4 pr-2 text-[14px] font-bold text-[#0C1A16]/50 border-r border-[#0C1A16]/10 mr-1">+977</span>
                    <input value={f.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" placeholder="9812763487" className="flex-1 px-3 py-3 text-[14px] font-bold tracking-wide placeholder:font-medium placeholder:text-[#0C1A16]/30" />
                  </div>
                  {err.phone && <p className="text-[12px] text-rose-600 font-semibold mt-1">{err.phone}</p>}
                </div>
              </div>

              {f.type === "Delivery" && (
                <>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[12.5px] font-extrabold flex items-center gap-1.5 text-[#0C1A16]/70"><Home size={13} className="text-[#9A6B1E]" /> FULL ADDRESS *</label>
                      <input value={f.address} onChange={(e) => set("address", e.target.value)} placeholder="House no, street, tole..." className={`mt-1.5 w-full bg-white border rounded-xl px-4 py-3 text-[14px] font-medium ${err.address ? "border-rose-500" : "border-[#0C1A16]/15 focus:border-[#D4A24E]"}`} />
                      {err.address && <p className="text-[12px] text-rose-600 font-semibold mt-1">{err.address}</p>}
                    </div>
                    <div>
                      <label className="text-[12.5px] font-extrabold flex items-center gap-1.5 text-[#0C1A16]/70"><MapPin size={13} className="text-[#9A6B1E]" /> AREA / MUNICIPALITY *</label>
                      <select value={f.municipality} onChange={(e) => set("municipality", e.target.value)} className="mt-1.5 w-full bg-white border border-[#0C1A16]/15 rounded-xl px-4 py-3 text-[14px] font-semibold focus:border-[#D4A24E]">
                        {["Golbazar", "Asanpur", "Lahan", "Mirchaiya", "Siraha Bazaar", "Bishnupur", "Kalyanpur", "Choharwa", "Other"].map((m) => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[12.5px] font-extrabold text-[#0C1A16]/70">LANDMARK (OPTIONAL)</label>
                      <input value={f.landmark} onChange={(e) => set("landmark", e.target.value)} placeholder="Near temple, school, chowk..." className="mt-1.5 w-full bg-white border border-[#0C1A16]/15 rounded-xl px-4 py-3 text-[14px] font-medium focus:border-[#D4A24E]" />
                    </div>
                    <div>
                      <label className="text-[12.5px] font-extrabold text-[#0C1A16]/70">COOKING NOTE (OPTIONAL)</label>
                      <input value={f.note} onChange={(e) => set("note", e.target.value)} placeholder="Less spicy, no onion..." className="mt-1.5 w-full bg-white border border-[#0C1A16]/15 rounded-xl px-4 py-3 text-[14px] font-medium focus:border-[#D4A24E]" />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-[12.5px] font-extrabold flex items-center gap-1.5 text-[#0C1A16]/70"><Wallet size={13} className="text-[#9A6B1E]" /> PAYMENT METHOD</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Cash on Delivery", "eSewa", "Khalti", "FonePay"].map((p) => (
                    <button key={p} onClick={() => set("payment", p)} className={`rounded-xl border-2 px-2 py-2.5 text-[12.5px] font-extrabold transition ${f.payment === p ? "border-[#0C1A16] bg-[#0C1A16] text-[#F0C778]" : "border-[#0C1A16]/12 bg-white hover:border-[#D4A24E]"}`}>{p}</button>
                  ))}
                </div>
                {f.payment !== "Cash on Delivery" && <p className="mt-2 text-[12px] font-semibold text-[#0C1A16]/55 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">You will receive a {f.payment} payment request on <span className="font-bold">{f.phone || "your mobile"}</span> after confirming.</p>}
              </div>

              <button onClick={() => { if (validate()) setStep(2); }} className="w-full bg-[#0C1A16] hover:bg-[#1c332b] text-white font-extrabold py-4 rounded-2xl text-[15px] inline-flex items-center justify-center gap-2 transition">Review Order <ChevronRight size={17} /></button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-[#0C1A16]/10 p-4">
                <div className="text-[12px] font-extrabold uppercase tracking-wider text-[#0C1A16]/50">Deliver to</div>
                <div className="mt-1 font-bold text-[15px]">{f.name} • +977 {f.phone}</div>
                <div className="text-[13.5px] text-[#0C1A16]/65 font-medium">{f.type === "Delivery" ? `${f.address}, ${f.municipality}${f.landmark ? ` (${f.landmark})` : ""}` : f.type} • {f.payment}</div>
                <button onClick={() => setStep(1)} className="mt-2 text-[12.5px] font-bold text-[#9A6B1E] hover:underline">Edit details</button>
              </div>
              <div className="bg-white rounded-2xl border border-[#0C1A16]/10 divide-y divide-[#0C1A16]/8">
                {lines.map((l) => (
                  <div key={l.item.id} className="p-3.5 flex items-center gap-3">
                    <img src={l.item.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <div className="flex-1 min-w-0"><div className="text-[13.5px] font-bold truncate">{l.item.name}</div><div className="text-[12px] text-[#0C1A16]/55 font-medium">Qty {l.qty} × {fmt(l.item.price)}</div></div>
                    <div className="font-extrabold text-[13.5px]">{fmt(l.item.price * l.qty)}</div>
                  </div>
                ))}
              </div>
              <div className="bg-[#0C1A16] text-white rounded-2xl p-4 text-[13.5px] font-semibold space-y-1.5">
                <div className="flex justify-between text-white/70"><span>Subtotal</span><span className="text-white">{fmt(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-emerald-300"><span>Discount</span><span>-{fmt(discount)}</span></div>}
                <div className="flex justify-between text-white/70"><span>Delivery</span><span className="text-white">{f.type === "Delivery" ? (deliveryFee === 0 ? "FREE" : fmt(deliveryFee)) : "—"}</span></div>
                <div className="flex justify-between pt-2 border-t border-white/15 text-[16px] font-extrabold"><span>Total to pay</span><span className="text-[#F0C778] font-display text-[20px]">{fmt(f.type === "Delivery" ? total : subtotal - discount)}</span></div>
              </div>
              <div className="flex gap-2.5">
                <button onClick={() => setStep(1)} className="px-6 py-4 rounded-2xl border-2 border-[#0C1A16]/15 font-bold text-[14px] hover:border-[#0C1A16] transition">Back</button>
                <button disabled={placing} onClick={place} className="flex-1 bg-[#D4A24E] hover:bg-[#f0c778] disabled:opacity-70 text-[#0C1A16] font-extrabold py-4 rounded-2xl text-[15px] transition inline-flex items-center justify-center gap-2">
                  {placing ? (<><span className="w-5 h-5 border-[3px] border-[#0C1A16]/25 border-t-[#0C1A16] rounded-full animate-spin" /> Placing order...</>) : (<>Confirm • Place Order</>)}
                </button>
              </div>
              <p className="text-center text-[12px] text-[#0C1A16]/50 font-medium">By confirming you agree to be contacted on your phone for delivery updates.</p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }} className="w-20 h-20 mx-auto rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center">
                <CheckCircle2 size={38} className="text-emerald-600" />
              </motion.div>
              <h3 className="font-display font-bold text-[26px] mt-4">Dhanyabad, {f.name.split(" ")[0] || "Guest"}!</h3>
              <p className="text-[14px] text-[#0C1A16]/60 mt-1.5 max-w-[380px] mx-auto">Your order is sizzling in our kitchen. We'll call <span className="font-bold text-[#0C1A16]">+977 {f.phone}</span> if needed. Track it live below.</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-[#0C1A16] text-[#F0C778] font-extrabold px-5 py-2.5 rounded-full text-[14px]">ETA: {f.type === "Delivery" ? "25-35 min" : "15-20 min"} • {f.payment}</div>
              <div className="mt-5 flex flex-col sm:flex-row gap-2.5 justify-center">
                <button onClick={onClose} className="bg-[#0C1A16] text-white font-bold px-7 py-3.5 rounded-full text-[14px] hover:bg-[#1c332b] transition">Track My Order</button>
                <a href={`https://wa.me/977${HOTEL.phone}?text=${encodeURIComponent(`Namaste AFC Hotel! I just ordered food. Name: ${f.name}`)}`} target="_blank" rel="noreferrer" className="border-2 border-[#0C1A16]/15 font-bold px-7 py-3.5 rounded-full text-[14px] hover:border-emerald-500 hover:text-emerald-700 transition">WhatsApp Us</a>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function totalsFor(lines: CartLine[], promo: string | null) {
  const subtotal = lines.reduce((a, l) => a + l.item.price * l.qty, 0);
  let discount = 0;
  if (promo === "AFC20" && subtotal >= 799) discount = Math.min(250, Math.round(subtotal * 0.2));
  if (promo === "WELCOME10" && subtotal >= 499) discount = Math.round(subtotal * 0.1);
  const deliveryFee = subtotal === 0 ? 0 : subtotal - discount >= HOTEL.freeDeliveryAbove ? 0 : HOTEL.deliveryFee;
  return { subtotal, discount, deliveryFee, total: Math.max(0, subtotal - discount + deliveryFee) };
}

export { MENU };
