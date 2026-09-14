import { motion } from "framer-motion";
import { ArrowRight, Award, BadgeCheck, BedDouble, Bike, ChevronRight, MapPin, Phone, Play, Star, UtensilsCrossed } from "lucide-react";
import { HOTEL } from "../data/hotel";

export default function Hero({ onOrder, onBook }: { onOrder: () => void; onBook: () => void }) {
  return (
    <section id="home" className="relative overflow-hidden bg-[#0C1A16] text-white">
      {/* bg */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/31820499/pexels-photo-31820499.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
          alt="AFC Hotel"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C1A16] via-[#0C1A16]/85 to-[#0C1A16]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1A16] via-transparent to-[#0C1A16]/60" />
        <div className="absolute inset-0 texture-dark" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-10 pb-10 lg:pt-16 lg:pb-16 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
        {/* left */}
        <div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur rounded-full pl-1.5 pr-4 py-1.5 text-[12.5px] font-semibold text-[#F5E7C8]">
            <span className="bg-[#D4A24E] text-[#0C1A16] text-[11px] font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1"><Award size={12} /> No.1 in Golbazar</span>
            4.8 ★ Loved by 12,000+ guests
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="font-display mt-5 text-[42px] leading-[1.02] sm:text-[62px] lg:text-[72px] font-bold tracking-tight"
          >
            Stay Royal.
            <br />
            <span className="gold-gradient-text italic font-semibold">Dine Divine</span>
            <span className="text-[#D4A24E]">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="mt-4 text-[15.5px] sm:text-[17px] text-white/70 max-w-[560px] leading-relaxed"
          >
            Siraha's most loved hotel & multi-cuisine restaurant — steaming momos, authentic Thakali, dum biryani & luxury rooms. Now delivering hot across <span className="text-[#F0C778] font-bold">Golbazar, Lahan, Mirchaiya & Siraha</span>.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-7 flex flex-wrap items-center gap-3">
            <button onClick={onOrder} className="group inline-flex items-center gap-2.5 bg-[#D4A24E] hover:bg-[#f0c778] text-[#0C1A16] font-extrabold px-7 py-4 rounded-full text-[15px] shadow-[0_18px_40px_-10px_rgba(212,162,78,0.6)] transition-all hover:-translate-y-0.5">
              <UtensilsCrossed size={18} /> Order Food Online
              <ArrowRight size={17} className="group-hover:translate-x-1 transition" />
            </button>
            <button onClick={onBook} className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur px-7 py-4 rounded-full font-bold text-[15px] transition">
              <BedDouble size={18} className="text-[#F0C778]" /> Book a Room
            </button>
            <a href={HOTEL.phoneHref} className="inline-flex items-center gap-2 px-2 py-2 text-[14px] font-bold text-white/80 hover:text-white">
              <span className="w-11 h-11 rounded-full border border-[#D4A24E]/50 flex items-center justify-center text-[#F0C778] animate-pulse-ring bg-[#D4A24E]/10"><Phone size={17} /></span>
              <span className="text-left leading-tight">Call to order<br /><span className="text-[#F0C778] text-[15px]">9812763487</span></span>
            </a>
          </motion.div>

          {/* trust row */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-[13px]">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2.5">
                {["https://images.pexels.com/photos/18803177/pexels-photo-18803177.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280","https://images.pexels.com/photos/28674660/pexels-photo-28674660.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280","https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"].map((s,i)=>(
                <img key={i} src={s} className="w-9 h-9 rounded-full object-cover border-2 border-[#0C1A16]" alt="" />
                ))}
                <span className="w-9 h-9 rounded-full bg-[#D4A24E] text-[#0C1A16] text-[11px] font-extrabold border-2 border-[#0C1A16] flex items-center justify-center">12k+</span>
              </div>
              <div className="leading-tight"><div className="flex items-center gap-1 text-[#F0C778] font-bold"><Star size={13} fill="currentColor"/> 4.8/5 <span className="text-white/50 font-medium">• 1,240 reviews</span></div><div className="text-white/60">Happy foodies & guests</div></div>
            </div>
            <div className="hidden sm:flex items-center gap-2 border-l border-white/15 pl-7">
              <span className="w-10 h-10 rounded-xl bg-emerald-400/15 border border-emerald-300/20 flex items-center justify-center text-emerald-300"><Bike size={18}/></span>
              <div className="leading-tight"><div className="font-bold">25-35 min delivery</div><div className="text-white/60">Free above Rs.999</div></div>
            </div>
            <div className="hidden md:flex items-center gap-2 border-l border-white/15 pl-7">
              <span className="w-10 h-10 rounded-xl bg-[#D4A24E]/15 border border-[#D4A24E]/25 flex items-center justify-center text-[#F0C778]"><BadgeCheck size={18}/></span>
              <div className="leading-tight"><div className="font-bold">FSSAI Hygienic Kitchen</div><div className="text-white/60">100% Halal & fresh</div></div>
            </div>
          </motion.div>
        </div>

        {/* right card */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative hidden lg:block">
          <div className="relative rounded-[28px] overflow-hidden border border-white/15 shadow-2xl">
            <img src="https://images.pexels.com/photos/12893063/pexels-photo-12893063.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" alt="AFC Hotel at night" className="h-[520px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C1A16] via-[#0C1A16]/20 to-transparent" />
            {/* floating order card */}
            <div className="absolute top-4 left-4 right-4 glass-dark border border-white/15 rounded-2xl p-4 flex items-center gap-3">
              <img src="https://images.pexels.com/photos/18803174/pexels-photo-18803174.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280" className="w-14 h-14 rounded-xl object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold truncate">Chicken Jhol Momo • 2x</div>
                <div className="text-[12px] text-emerald-300 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"/> On the way • 12 min away</div>
                <div className="mt-1.5 h-1.5 bg-white/15 rounded-full overflow-hidden"><div className="h-full w-[72%] bg-gradient-to-r from-[#D4A24E] to-[#F0C778] rounded-full"/></div>
              </div>
              <span className="text-[12px] font-extrabold bg-[#D4A24E] text-[#0C1A16] px-2.5 py-1.5 rounded-lg">LIVE</span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex gap-3">
              <div className="flex-1 glass-dark border border-white/15 rounded-2xl p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-[#F0C778] font-bold flex items-center gap-1"><MapPin size={11}/> Visit us</div>
                <div className="text-[13.5px] font-bold mt-1 leading-snug">Golbazar-06, Siraha<br/><span className="text-white/60 font-medium">On East-West Highway</span></div>
              </div>
              <div className="flex-1 bg-[#D4A24E] rounded-2xl p-4 text-[#0C1A16]">
                <div className="text-[11px] uppercase tracking-[0.16em] font-extrabold flex items-center gap-1"><Play size={11}/> Today's offer</div>
                <div className="font-display font-bold text-[19px] leading-tight mt-1">Flat 20% OFF<br/>Code: AFC20</div>
              </div>
            </div>
          </div>
          {/* small floating badges */}
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white text-[#0C1A16] rounded-2xl shadow-xl p-3 pr-4 flex items-center gap-2.5 animate-floaty">
            <img src="https://images.pexels.com/photos/35267280/pexels-photo-35267280.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280" className="w-11 h-11 rounded-xl object-cover" alt="" />
            <div className="leading-tight"><div className="text-[12.5px] font-extrabold">Thakali Set</div><div className="text-[11.5px] text-amber-600 font-bold flex items-center gap-1"><Star size={11} fill="currentColor"/> 4.9 • 5.7k orders</div></div>
          </div>
        </motion.div>
      </div>

      {/* marquee */}
      <div className="relative border-t border-white/10 bg-[#0a1512] py-3.5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee gap-0 w-max">
          {[0,1].map(k=>(
            <div key={k} className="flex items-center gap-8 pr-8 text-[13px] font-bold tracking-[0.14em] uppercase text-[#F0C778]/90">
              {["Steaming Jhol Momo","Authentic Thakali","Dum Handi Biryani","Charcoal Sekuwa","Wood-Fired Pizza","Golbazar Chowmein","Royal Suite Stay","Free Delivery over Rs.999"].map(t=>(
                <span key={t} className="inline-flex items-center gap-8"><span>{t}</span><span className="text-[#D4A24E]/50">✦</span></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* quick stats */}
      <div className="relative bg-[#FFF9EF] text-[#0C1A16]">
        <div className="max-w-7xl mx-auto px-4 -mt-0 grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#0C1A16]/10 border-b border-[#0C1A16]/10">
          {[
            { n: "20+", l: "Signature Dishes", s: "Momo to Biryani" },
            { n: "25 min", l: "Avg. Delivery", s: "Hot & fresh promise" },
            { n: "4.8★", l: "Guest Rating", s: "1,240 verified reviews" },
            { n: "15+", l: "Cozy Rooms", s: "From Rs.1,800/night" },
          ].map((s,i)=>(
            <div key={i} className="py-5 px-4 sm:px-6 text-center sm:text-left flex sm:items-center gap-3 justify-center sm:justify-start">
              <div className="font-display font-bold text-[26px] sm:text-[30px] leading-none">{s.n}</div>
              <div className="leading-tight text-left"><div className="text-[13px] font-extrabold">{s.l}</div><div className="text-[12px] text-[#0C1A16]/55 font-medium">{s.s}</div></div>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-1.5 text-[12.5px] font-medium text-[#0C1A16]/60 overflow-x-auto no-scrollbar whitespace-nowrap">
          <span className="font-bold text-[#0C1A16]">Delivering to:</span>
          {["Golbazar","Asanpur","Lahan","Mirchaiya","Siraha Bazaar","Bishnupur","Kalyanpur","Choharwa"].map(a=>(
            <span key={a} className="inline-flex items-center gap-1.5">• {a}</span>
          ))}
          <span className="ml-2 inline-flex items-center gap-1 text-[#9A6B1E] font-bold">View full menu <ChevronRight size={13}/></span>
        </div>
      </div>
    </section>
  );
}
