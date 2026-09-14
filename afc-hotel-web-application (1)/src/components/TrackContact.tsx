import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AtSign, Bike, CheckCircle2, ChefHat, Clock, Globe, Mail, MapPin, MessageCircle, Navigation, PackageSearch, Phone, Receipt, Send, Star } from "lucide-react";
import { HOTEL, fmt, STATUS_COLOR, type Order } from "../data/hotel";

export function TrackSection({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const results = query.trim()
    ? orders.filter((o) => (o.id + o.customer + o.phone).toLowerCase().includes(query.trim().toLowerCase()))
    : orders.slice(0, 3);

  const steps = ["Pending", "Preparing", "On the Way", "Delivered"] as const;

  return (
    <section id="track" className="bg-[#F7EDDA] py-14 lg:py-20 relative overflow-hidden scroll-mt-16 border-y border-[#0C1A16]/10">
      <div className="absolute inset-0 texture-grain opacity-70" />
      <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
        <div>
          <div className="inline-flex items-center gap-2 bg-white border border-[#0C1A16]/12 text-[11.5px] font-extrabold tracking-[0.16em] uppercase px-4 py-2 rounded-full text-[#0C1A16]">
            <PackageSearch size={14} className="text-[#9A6B1E]" /> Live Order Tracking
          </div>
          <h2 className="font-display text-[32px] sm:text-[44px] font-bold tracking-tight mt-4 leading-[1.05]">Where's my <span className="italic text-[#9A6B1E]">momo?</span></h2>
          <p className="text-[14.5px] text-[#0C1A16]/60 mt-2 leading-relaxed">Enter your order ID (e.g. AFC-123456), name or phone number to see live kitchen status. We update every step — from flame to doorstep.</p>

          <div className="mt-5 flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white border-2 border-[#0C1A16]/12 rounded-2xl px-4 py-1 focus-within:border-[#0C1A16] transition overflow-hidden">
              <Receipt size={17} className="text-[#0C1A16]/35 shrink-0" />
              <input value={query} onChange={(e) => { setQuery(e.target.value); setSearched(false); }} placeholder="Order ID, name or phone..." className="flex-1 py-3.5 bg-transparent text-[14px] font-semibold placeholder:font-medium placeholder:text-[#0C1A16]/35" />
            </div>
            <button onClick={() => setSearched(true)} className="bg-[#0C1A16] text-white font-extrabold px-6 rounded-2xl text-[14px] hover:bg-[#1e362e] transition shrink-0">Track</button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[
              { icon: ChefHat, t: "Live Kitchen", d: "Real-time updates" },
              { icon: Bike, t: "Fast Rider", d: "Avg 28 min" },
              { icon: MessageCircle, t: "WhatsApp Help", d: "Instant reply" },
            ].map((c) => (
              <div key={c.t} className="bg-white/70 border border-[#0C1A16]/10 rounded-2xl p-3.5 text-center">
                <c.icon size={19} className="mx-auto text-[#9A6B1E]" />
                <div className="text-[12.5px] font-extrabold mt-1.5">{c.t}</div>
                <div className="text-[11px] text-[#0C1A16]/55 font-medium">{c.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3.5">
          <AnimatePresence>
            {results.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[22px] border border-dashed border-[#0C1A16]/25 p-10 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#0C1A16]/5 flex items-center justify-center"><PackageSearch size={24} className="text-[#0C1A16]/35" /></div>
                <div className="font-bold text-[16px] mt-3">{searched || query ? "No order found" : "No orders yet on this device"}</div>
                <p className="text-[13px] text-[#0C1A16]/55 mt-1">Orders placed from this browser appear here. Try your phone number.</p>
              </motion.div>
            ) : (
              results.map((o) => {
                const idx = steps.indexOf(o.status as any);
                const activeIdx = o.status === "Cancelled" ? -1 : idx;
                return (
                  <motion.div key={o.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[22px] border border-[#0C1A16]/10 p-5 shadow-[0_14px_35px_-16px_rgba(12,26,22,0.3)]">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-[15px]">{o.id}</span>
                          <span className={`text-[11.5px] font-extrabold border px-2.5 py-1 rounded-full ${STATUS_COLOR[o.status]}`}>{o.status}</span>
                          <span className="text-[11.5px] font-bold text-[#0C1A16]/50 inline-flex items-center gap-1"><Clock size={11} /> ETA {o.eta}</span>
                        </div>
                        <div className="text-[13px] font-semibold text-[#0C1A16]/60 mt-1">{o.customer} • {o.phone} • {fmt(o.total)} • {o.payment}</div>
                      </div>
                      <div className="text-right text-[12px] font-medium text-[#0C1A16]/50">{new Date(o.createdAt).toLocaleString()}</div>
                    </div>

                    {o.status === "Cancelled" ? (
                      <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-700 text-[13px] font-bold rounded-xl px-4 py-3">This order was cancelled. Call {HOTEL.phoneDisplay} for help.</div>
                    ) : (
                      <div className="mt-4">
                        <div className="flex items-center">
                          {steps.map((s, i) => (
                            <div key={s} className="flex-1 flex items-center last:flex-none">
                              <div className="flex flex-col items-center gap-1.5">
                                <span className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition ${i <= activeIdx ? "bg-[#0C1A16] border-[#0C1A16] text-[#F0C778]" : "bg-white border-[#0C1A16]/15 text-[#0C1A16]/30"}`}>
                                  {i < activeIdx ? <CheckCircle2 size={16} /> : i === 0 ? <Receipt size={15} /> : i === 1 ? <ChefHat size={15} /> : i === 2 ? <Bike size={15} /> : <CheckCircle2 size={15} />}
                                </span>
                                <span className={`text-[10.5px] font-extrabold whitespace-nowrap ${i <= activeIdx ? "text-[#0C1A16]" : "text-[#0C1A16]/35"}`}>{s}</span>
                              </div>
                              {i < steps.length - 1 && <div className={`flex-1 h-[3px] rounded-full mx-1 mb-5 ${i < activeIdx ? "bg-[#0C1A16]" : "bg-[#0C1A16]/12"}`} />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-dashed border-[#0C1A16]/12 text-[12.5px] font-medium text-[#0C1A16]/60">
                      {o.items.map((it) => `${it.name} ×${it.qty}`).join(" • ")}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
          {!query && orders.length > 3 && <div className="text-center text-[12.5px] font-bold text-[#0C1A16]/50">Showing recent 3 • search to find older orders</div>}
        </div>
      </div>
    </section>
  );
}

export function ContactFooter({ onOrder }: { onOrder: () => void }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", msg: "" });

  return (
    <footer id="contact" className="bg-[#0C1A16] text-white relative overflow-hidden scroll-mt-16">
      <div className="absolute inset-0 texture-dark" />
      <div className="absolute -top-32 left-1/3 w-[500px] h-[300px] bg-[#D4A24E]/12 blur-[100px] rounded-full" />
      <div className="relative max-w-7xl mx-auto px-4 pt-14 pb-8">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr_1fr] gap-8">
          {/* brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D4A24E] flex items-center justify-center font-display font-bold text-[#0C1A16] text-[26px]">A</div>
              <div className="leading-tight">
                <div className="font-display font-bold text-[22px]">AFC Hotel</div>
                <div className="text-[11px] tracking-[0.2em] uppercase text-[#F0C778] font-bold">Stay Royal • Dine Divine</div>
              </div>
            </div>
            <p className="mt-4 text-[13.5px] text-white/60 leading-relaxed max-w-[340px]">Golbazar's landmark for luxury stay & unforgettable taste. E-commerce delivery across Siraha — hot, fast & hygienic, from our family to yours.</p>
            <div className="mt-4 space-y-2.5 text-[13.5px] font-semibold">
              <div className="flex items-center gap-2.5"><span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#F0C778]"><MapPin size={15} /></span> {HOTEL.address}</div>
              <a href={HOTEL.phoneHref} className="flex items-center gap-2.5 hover:text-[#F0C778] transition"><span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#F0C778]"><Phone size={15} /></span> {HOTEL.phoneDisplay} (Call / WhatsApp)</a>
              <div className="flex items-center gap-2.5"><span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#F0C778]"><Mail size={15} /></span> {HOTEL.email}</div>
              <div className="flex items-center gap-2.5 text-white/70"><span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#F0C778]"><Clock size={15} /></span> {HOTEL.kitchenHours}</div>
            </div>
            <div className="mt-4 flex gap-2">
              {[Globe, AtSign, MessageCircle, Send].map((I, i) => (
                <a key={i} href="#" onClick={(e) => e.preventDefault()} className="w-10 h-10 rounded-full bg-white/8 border border-white/12 flex items-center justify-center hover:bg-[#D4A24E] hover:text-[#0C1A16] hover:border-[#D4A24E] transition"><I size={16} /></a>
              ))}
            </div>
          </div>

          {/* quick order */}
          <div className="bg-white/[0.05] border border-white/12 rounded-[22px] p-6">
            <div className="font-display font-bold text-[19px]">Hungry right now?</div>
            <p className="text-[13px] text-white/55 mt-1">One tap — kitchen starts cooking instantly.</p>
            <button onClick={onOrder} className="mt-4 w-full bg-[#D4A24E] hover:bg-[#f0c778] text-[#0C1A16] font-extrabold py-3.5 rounded-xl text-[14.5px] transition">Order Food Online</button>
            <a href={HOTEL.phoneHref} className="mt-2.5 w-full border border-white/20 hover:border-[#D4A24E] font-bold py-3.5 rounded-xl text-[14px] flex items-center justify-center gap-2 transition"><Phone size={15} className="text-[#F0C778]" /> Call 9812763487</a>
            <div className="mt-4 flex items-center gap-2 text-[12px] font-bold text-white/60">
              <Star size={13} className="text-[#F0C778]" fill="currentColor" /> 4.8 rated
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <Navigation size={12} className="text-emerald-300" /> On East-West Highway
            </div>
            <div className="mt-4 rounded-xl overflow-hidden border border-white/12 h-[130px] relative bg-[#12291f]">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-center p-4">
                <MapPin size={22} className="text-[#F0C778]" />
                <div className="text-[13px] font-bold">Golbazar-06, Siraha</div>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(HOTEL.mapQuery)}`} target="_blank" rel="noreferrer" className="text-[12px] font-bold text-[#F0C778] underline underline-offset-2">Open in Google Maps →</a>
              </div>
            </div>
          </div>

          {/* enquiry */}
          <div>
            <div className="font-display font-bold text-[19px]">Send an enquiry</div>
            <p className="text-[13px] text-white/55 mt-1">Wedding, party hall, bulk order or room booking — we reply within an hour.</p>
            {sent ? (
              <div className="mt-4 bg-emerald-400/10 border border-emerald-300/25 rounded-2xl p-5 text-center">
                <CheckCircle2 size={30} className="mx-auto text-emerald-300" />
                <div className="font-bold text-[15px] mt-2">Message received!</div>
                <div className="text-[13px] text-white/60">Our team will call you back shortly.</div>
                <button onClick={() => setSent(false)} className="mt-3 text-[12.5px] font-bold text-[#F0C778] hover:underline">Send another</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (form.name && form.phone) setSent(true); }} className="mt-4 space-y-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name *" className="bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-[13.5px] font-medium placeholder:text-white/35 focus:border-[#D4A24E]" />
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone *" className="bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-[13.5px] font-medium placeholder:text-white/35 focus:border-[#D4A24E]" />
                </div>
                <textarea value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} placeholder="e.g. Need party hall for 80 guests on Saturday..." rows={3} className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-[13.5px] font-medium placeholder:text-white/35 focus:border-[#D4A24E] resize-none" />
                <button className="w-full bg-white text-[#0C1A16] font-extrabold py-3.5 rounded-xl text-[14px] hover:bg-[#F0C778] transition inline-flex items-center justify-center gap-2"><Send size={15} /> Send Enquiry</button>
              </form>
            )}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["Party Hall", "Wedding", "Rooms", "Bulk Order", "Catering"].map((t) => (
                <span key={t} className="text-[11.5px] font-bold bg-white/8 border border-white/12 px-2.5 py-1.5 rounded-lg text-white/70">{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] font-medium text-white/45">
          <span>© 2026 AFC Hotel, Golbazar-06 Siraha. All rights reserved. Crafted with ❤️ in Madhesh.</span>
          <span className="flex items-center gap-4"><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Privacy</a><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white">Terms</a><span className="inline-flex items-center gap-1 text-[#F0C778] font-bold">FSSAI Lic. 12345678901234</span></span>
        </div>
      </div>

      {/* floating call */}
      <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2.5 items-end">
        <a href={`https://wa.me/977${HOTEL.phone}?text=${encodeURIComponent("Namaste AFC Hotel! I want to order food.")}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl hover:scale-110 transition" title="WhatsApp"><MessageCircle size={21} /></a>
        <a href={HOTEL.phoneHref} className="h-12 pl-2 pr-5 rounded-full bg-[#0C1A16] border border-[#D4A24E]/50 text-white flex items-center gap-2 shadow-xl hover:bg-[#1c332b] transition">
          <span className="w-9 h-9 rounded-full bg-[#D4A24E] text-[#0C1A16] flex items-center justify-center animate-pulse-ring"><Phone size={16} /></span>
          <span className="text-[12px] font-extrabold leading-tight text-left">Call to Order<br /><span className="text-[#F0C778] text-[13px]">9812763487</span></span>
        </a>
      </div>
    </footer>
  );
}
