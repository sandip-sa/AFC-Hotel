import { useEffect, useState } from "react";
import { Clock, Lock, MapPin, Menu, Phone, ShieldCheck, ShoppingBag, UtensilsCrossed, X } from "lucide-react";
import { HOTEL } from "../data/hotel";

type Props = {
  view: string;
  setView: (v: any) => void;
  cartCount: number;
  onCart: () => void;
  isAdmin?: boolean;
};

const LINKS = [
  { id: "home", label: "Home" },
  { id: "menu", label: "Restaurant" },
  { id: "rooms", label: "Rooms & Stay" },
  { id: "track", label: "Track Order" },
  { id: "contact", label: "Contact" },
];

export default function Navbar({ view, setView, cartCount, onCart, isAdmin }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    if (id === "dashboard") {
      setView("dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (view === "dashboard") setView("store");
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <>
      {/* top strip */}
      <div className="bg-[#0C1A16] text-[11.5px] sm:text-[12.5px] text-[#F5E7C8] relative z-[60]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 truncate">
              <MapPin size={13} className="text-[#D4A24E] shrink-0" /> {HOTEL.address}
            </span>
            <span className="sm:hidden inline-flex items-center gap-1.5 truncate">
              <MapPin size={13} className="text-[#D4A24E] shrink-0" /> {HOTEL.shortAddress}
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-[#F5E7C8]/80">
              <Clock size={13} className="text-[#D4A24E]" /> {HOTEL.hours}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-400/20 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Open Now
            </span>
            <a href={HOTEL.phoneHref} className="inline-flex items-center gap-1.5 font-bold text-[#F0C778] hover:text-white transition">
              <Phone size={13} /> {HOTEL.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* main nav */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#FFF9EF]/90 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(12,26,22,0.35)] border-b border-[#D4A24E]/25" : "bg-[#FFF9EF] border-b border-[#0C1A16]/8"}`}>
        <div className="max-w-7xl mx-auto px-4 h-[68px] flex items-center justify-between gap-3">
          {/* logo */}
          <button onClick={() => go("home")} className="flex items-center gap-3 group text-left">
            <div className="w-11 h-11 rounded-2xl bg-[#0C1A16] flex items-center justify-center relative overflow-hidden shadow-lg shadow-[#0C1A16]/20 group-hover:rotate-3 transition-transform">
              <div className="absolute inset-0 texture-dark opacity-60" />
              <span className="font-display text-[26px] leading-none font-800 font-bold gold-gradient-text relative">A</span>
              <span className="absolute bottom-1 text-[7px] tracking-[0.22em] text-[#D4A24E] font-bold">AFC</span>
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-[19px] text-[#0C1A16] tracking-tight">AFC Hotel</div>
              <div className="text-[10.5px] tracking-[0.18em] uppercase font-bold text-[#9A6B1E]">Golbazar • Siraha</div>
            </div>
          </button>

          {/* desktop links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0C1A16]/[0.045] p-1.5 rounded-full border border-[#0C1A16]/10">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="px-4 py-2 rounded-full text-[13.5px] font-semibold text-[#0C1A16]/70 hover:text-[#0C1A16] hover:bg-white hover:shadow-sm transition"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => go("dashboard")}
              className={`px-4 py-2 rounded-full text-[13.5px] font-bold inline-flex items-center gap-1.5 transition ${view === "dashboard" ? "bg-[#0C1A16] text-[#F0C778] shadow" : "bg-[#D4A24E] text-[#0C1A16] hover:bg-[#c0933f]"}`}
              title={isAdmin ? "Open dashboard" : "Admin login required"}
            >
              {isAdmin ? <ShieldCheck size={14} /> : <Lock size={13} />} {isAdmin ? "Dashboard" : "Admin Login"}
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <a href={HOTEL.phoneHref} className="hidden md:inline-flex items-center gap-2 text-[13px] font-bold text-[#0C1A16] bg-white border border-[#0C1A16]/12 px-3.5 py-2.5 rounded-full hover:border-[#D4A24E] transition shadow-sm">
              <span className="w-7 h-7 rounded-full bg-[#0C1A16] text-[#F0C778] flex items-center justify-center"><Phone size={13} /></span>
              9812763487
            </a>
            <button onClick={onCart} className="relative inline-flex items-center gap-2 bg-[#0C1A16] text-white pl-4 pr-4 sm:pr-5 py-2.5 rounded-full font-bold text-[13.5px] hover:bg-[#1a3129] transition shadow-lg shadow-[#0C1A16]/25 group">
              <ShoppingBag size={17} className="text-[#F0C778] group-hover:scale-110 transition" />
              <span className="hidden sm:inline">My Order</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 rounded-full bg-[#D4A24E] text-[#0C1A16] text-[12px] font-extrabold flex items-center justify-center border-2 border-[#FFF9EF] animate-pulse-ring">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setOpen(!open)} className="lg:hidden w-10 h-10 rounded-full border border-[#0C1A16]/15 flex items-center justify-center bg-white">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-[#0C1A16]/10 bg-[#FFF9EF]/95 backdrop-blur-xl px-4 py-4 space-y-1">
            {LINKS.map((l) => (
              <button key={l.id} onClick={() => go(l.id)} className="w-full text-left px-4 py-3 rounded-xl font-semibold text-[#0C1A16] hover:bg-[#0C1A16]/5 flex items-center gap-2">
                <UtensilsCrossed size={15} className="text-[#9A6B1E]" /> {l.label}
              </button>
            ))}
            <button onClick={() => go("dashboard")} className="w-full text-left px-4 py-3 rounded-xl font-bold bg-[#0C1A16] text-[#F0C778] flex items-center gap-2">
              {isAdmin ? <ShieldCheck size={15} /> : <Lock size={15} />} {isAdmin ? "Business Dashboard" : "Admin Login"}
            </button>
          </div>
        )}
      </header>
    </>
  );
}
