import { motion } from "framer-motion";
import { ArrowRight, BedDouble, Check, Maximize, Star, Users, Wifi, Coffee, Quote, BadgeCheck, ConciergeBell, Sparkles } from "lucide-react";
import { ROOMS, REVIEWS, fmt } from "../data/hotel";

export function RoomsSection({ onBookRoom }: { onBookRoom: (roomName: string, price: number) => void }) {
  return (
    <section id="rooms" className="relative bg-[#0C1A16] text-white py-14 lg:py-20 overflow-hidden scroll-mt-16">
      <div className="absolute inset-0 texture-dark" />
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-[#D4A24E]/15 blur-[120px]" />
      <div className="absolute -bottom-40 -left-40 w-[520px] h-[520px] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 border border-[#D4A24E]/40 text-[#F0C778] text-[11.5px] font-extrabold tracking-[0.18em] uppercase px-4 py-2 rounded-full bg-[#D4A24E]/10">
              <BedDouble size={13} /> Stay at AFC • 15 Premium Rooms
            </div>
            <h2 className="font-display text-[34px] sm:text-[46px] font-bold leading-[1.05] mt-4 tracking-tight">
              Sleep like royalty <br /> in the heart of <span className="gold-gradient-text italic">Terai.</span>
            </h2>
            <p className="mt-3 text-white/60 text-[15px] max-w-[560px] leading-relaxed">Highway-touch location, 24/7 front desk, in-house restaurant & free breakfast. Perfect for business, wedding & family yatra.</p>
          </div>
          <div className="flex items-center gap-6 text-[13px]">
            <div className="flex items-center gap-2"><Star size={15} className="text-[#D4A24E]" fill="currentColor" /><span className="font-bold text-[15px]">4.8</span><span className="text-white/50">• 860 stays</span></div>
            <div className="hidden sm:flex items-center gap-2 text-white/70"><Wifi size={15} className="text-emerald-300" /> Free high-speed WiFi</div>
            <div className="hidden sm:flex items-center gap-2 text-white/70"><Coffee size={15} className="text-[#F0C778]" /> Free breakfast</div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-5">
          {ROOMS.map((r, i) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08 }}
              className={`group relative rounded-[26px] overflow-hidden border border-white/12 bg-white/[0.04] backdrop-blur hover:border-[#D4A24E]/50 transition-all card-lift ${i === 0 ? "md:col-span-2 md:grid md:grid-cols-2" : ""}`}
            >
              <div className={`relative overflow-hidden ${i === 0 ? "h-[260px] md:h-full md:min-h-[360px]" : "h-[230px]"}`}>
                <img src={r.image} alt={r.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {r.tag && <span className="text-[11px] font-extrabold bg-[#D4A24E] text-[#0C1A16] px-3 py-1.5 rounded-full">{r.tag}</span>}
                  <span className="text-[11px] font-bold bg-black/55 backdrop-blur text-white px-3 py-1.5 rounded-full border border-white/20">Only {r.left} left</span>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[12px] font-bold">
                  <span className="inline-flex items-center gap-1 bg-white/95 text-[#0C1A16] px-2.5 py-1 rounded-lg"><Star size={12} className="text-amber-500" fill="currentColor" />{r.rating}</span>
                  <span className="inline-flex items-center gap-1 bg-black/55 backdrop-blur text-white px-2.5 py-1 rounded-lg border border-white/15"><Maximize size={11} /> {r.size}</span>
                </div>
              </div>
              <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display font-bold text-[22px] sm:text-[24px] tracking-tight">{r.name}</h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-white/60 font-semibold">
                      <span className="inline-flex items-center gap-1.5"><Users size={13} className="text-[#F0C778]" /> {r.guests}</span>
                      <span className="inline-flex items-center gap-1.5"><BedDouble size={13} className="text-[#F0C778]" /> {r.bed}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[12px] text-white/45 line-through font-semibold">{fmt(r.mrp)}</div>
                    <div className="font-display font-bold text-[24px] text-[#F0C778] leading-none">{fmt(r.price)}</div>
                    <div className="text-[11px] text-white/50 font-semibold">/ night + breakfast</div>
                  </div>
                </div>
                <p className="mt-3 text-[13.5px] text-white/65 leading-relaxed">{r.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {r.amenities.map((a) => (
                    <span key={a} className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-white/8 border border-white/12 px-2.5 py-1.5 rounded-lg text-white/80"><Check size={12} className="text-emerald-300" />{a}</span>
                  ))}
                </div>
                <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
                  <button onClick={() => onBookRoom(r.name, r.price)} className="flex-1 inline-flex items-center justify-center gap-2 bg-[#D4A24E] hover:bg-[#f0c778] text-[#0C1A16] font-extrabold px-6 py-3.5 rounded-full text-[14px] transition-all hover:-translate-y-0.5 shadow-[0_14px_30px_-10px_rgba(212,162,78,0.55)]">
                    Book This Room <ArrowRight size={16} />
                  </button>
                  <a href="tel:+9779812763487" className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-[#D4A24E] px-6 py-3.5 rounded-full text-[14px] font-bold transition">Call to Enquire</a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* perks */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: ConciergeBell, t: "24/7 Front Desk", d: "Late check-in welcome" },
            { icon: Sparkles, t: "Daily Housekeeping", d: "Spotless, sanitized rooms" },
            { icon: Coffee, t: "In-house Restaurant", d: "Room service till 10:30 PM" },
            { icon: BadgeCheck, t: "Secure Parking", d: "CCTV + night guard" },
          ].map((p) => (
            <div key={p.t} className="flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-2xl p-4">
              <span className="w-10 h-10 rounded-xl bg-[#D4A24E]/15 border border-[#D4A24E]/25 flex items-center justify-center text-[#F0C778] shrink-0"><p.icon size={18} /></span>
              <div className="leading-tight"><div className="text-[13.5px] font-bold">{p.t}</div><div className="text-[12px] text-white/50">{p.d}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  return (
    <section className="bg-[#FFF9EF] py-14 lg:py-20 relative overflow-hidden">
      <div className="absolute inset-0 texture-grain opacity-60" />
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center max-w-[620px] mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 border border-amber-200 text-amber-800 text-[12px] font-extrabold px-4 py-2 rounded-full">
            <Star size={13} fill="currentColor" /> 4.8 / 5 FROM 1,240 VERIFIED REVIEWS
          </div>
          <h2 className="font-display text-[32px] sm:text-[44px] font-bold tracking-tight mt-4">Golbazar loves <span className="italic text-[#9A6B1E]">AFC.</span></h2>
          <p className="text-[14.5px] text-[#0C1A16]/60 mt-2">Real words from foodies, families & travellers across Siraha.</p>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVIEWS.map((r, i) => (
            <motion.figure
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-[20px] border border-[#0C1A16]/10 p-5 shadow-[0_12px_30px_-14px_rgba(12,26,22,0.25)] flex flex-col card-lift"
            >
              <Quote size={22} className="text-[#D4A24E]" fill="currentColor" />
              <div className="flex gap-0.5 mt-2">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} size={13} className={k < r.rating ? "text-amber-500" : "text-[#0C1A16]/15"} fill="currentColor" />
                ))}
              </div>
              <blockquote className="text-[13.5px] leading-relaxed text-[#0C1A16]/75 mt-2.5 flex-1">"{r.text}"</blockquote>
              <figcaption className="mt-4 pt-4 border-t border-[#0C1A16]/8 flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-full bg-[#0C1A16] text-[#F0C778] font-display font-bold flex items-center justify-center text-[16px]">{r.name[0]}</span>
                <div className="leading-tight">
                  <div className="text-[13px] font-extrabold flex items-center gap-1">{r.name} <BadgeCheck size={13} className="text-emerald-600" /></div>
                  <div className="text-[11.5px] text-[#0C1A16]/50 font-medium">{r.place} • ordered {r.item}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
