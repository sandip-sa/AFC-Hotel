import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { HOTEL } from "../data/hotel";
import { getAdminCreds, saveSession, validateLogin, type AdminUser } from "../utils/admin";

export default function AdminLogin({
  onLogin,
  onBack,
}: {
  onLogin: (u: AdminUser) => void;
  onBack: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);

  const creds = getAdminCreds();

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setErr("");
    if (!username.trim()) return setErr("Please enter admin username.");
    if (!password) return setErr("Please enter password.");
    setLoading(true);
    setTimeout(() => {
      const user = validateLogin(username, password);
      setLoading(false);
      if (user) {
        saveSession(user, remember);
        onLogin(user);
      } else {
        setErr("Invalid username or password. Try the demo credentials below.");
        setShake((s) => s + 1);
      }
    }, 900);
  };

  const fillDemo = () => {
    setUsername(creds.username);
    setPassword(creds.password);
    setErr("");
  };

  return (
    <div className="min-h-screen bg-[#0C1A16] text-white relative overflow-hidden flex items-center justify-center p-4">
      {/* bg decor */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/31820499/pexels-photo-31820499.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
          alt=""
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C1A16] via-[#0C1A16]/90 to-[#0C1A16]/70" />
        <div className="absolute inset-0 texture-dark" />
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[#D4A24E]/15 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[980px] grid lg:grid-cols-[1fr_1fr] rounded-[28px] overflow-hidden border border-white/12 bg-white/[0.04] backdrop-blur-xl shadow-2xl">
        {/* left brand panel */}
        <div className="hidden lg:flex flex-col justify-between p-9 relative overflow-hidden bg-gradient-to-br from-[#11231d] to-[#0C1A16]">
          <div className="absolute inset-0 texture-dark" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D4A24E] flex items-center justify-center font-display font-bold text-[#0C1A16] text-[26px]">A</div>
              <div>
                <div className="font-display font-bold text-[20px]">AFC Hotel</div>
                <div className="text-[11px] tracking-[0.2em] uppercase text-[#F0C778] font-bold">Admin Control Center</div>
              </div>
            </div>
            <h2 className="font-display font-bold text-[36px] leading-[1.1] mt-8">
              Namaste, <br />
              <span className="gold-gradient-text italic">Manager Sahab.</span>
            </h2>
            <p className="text-white/60 text-[14px] leading-relaxed mt-3 max-w-[340px]">
              Manage live food orders, room bookings, customer details, revenue & delivery — all from one secure dashboard for {HOTEL.shortAddress}.
            </p>
          </div>

          <div className="relative space-y-3 mt-8">
            {[
              { icon: ShieldCheck, t: "Secure staff-only access", d: "Orders & customer phones stay private" },
              { icon: BadgeCheck, t: "Live order management", d: "Pending → Preparing → On the Way → Delivered" },
              { icon: Phone, t: "1-tap customer call", d: "Call or WhatsApp any customer instantly" },
            ].map((f) => (
              <div key={f.t} className="flex items-center gap-3 bg-white/[0.06] border border-white/10 rounded-2xl p-3.5">
                <span className="w-10 h-10 rounded-xl bg-[#D4A24E]/15 border border-[#D4A24E]/25 flex items-center justify-center text-[#F0C778] shrink-0">
                  <f.icon size={18} />
                </span>
                <div>
                  <div className="text-[13.5px] font-bold">{f.t}</div>
                  <div className="text-[12px] text-white/50">{f.d}</div>
                </div>
              </div>
            ))}
            <div className="text-[11.5px] text-white/40 font-medium pt-1">© 2026 AFC Hotel • Golbazar-06, Siraha • {HOTEL.phoneDisplay}</div>
          </div>
        </div>

        {/* right form */}
        <div className="p-6 sm:p-9 bg-[#FFF9EF] text-[#0C1A16]">
          <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0C1A16]/60 hover:text-[#0C1A16] transition">
            <ArrowLeft size={15} /> Back to website
          </button>

          <div className="mt-4 flex items-center gap-3 lg:hidden">
            <div className="w-11 h-11 rounded-2xl bg-[#0C1A16] flex items-center justify-center font-display font-bold text-[#F0C778] text-[22px]">A</div>
            <div>
              <div className="font-display font-bold text-[18px]">AFC Admin Login</div>
              <div className="text-[11px] tracking-[0.18em] uppercase font-bold text-[#9A6B1E]">Golbazar • Siraha</div>
            </div>
          </div>

          <h1 className="hidden lg:block font-display font-bold text-[30px] tracking-tight">Admin Login</h1>
          <p className="text-[13.5px] text-[#0C1A16]/60 font-medium mt-1">Staff only. Login to manage orders & view customer details.</p>

          <motion.form
            key={shake}
            initial={shake ? { x: 0 } : false}
            animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}}
            transition={{ duration: 0.4 }}
            onSubmit={submit}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="text-[12px] font-extrabold uppercase tracking-wider text-[#0C1A16]/60 flex items-center gap-1.5">
                <User size={13} className="text-[#9A6B1E]" /> Username
              </label>
              <div className="mt-1.5 flex items-center bg-white border-2 border-[#0C1A16]/12 rounded-2xl overflow-hidden focus-within:border-[#0C1A16] transition">
                <span className="pl-4 text-[#0C1A16]/35"><User size={17} /></span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  autoComplete="username"
                  className="flex-1 px-3 py-3.5 bg-transparent text-[14.5px] font-bold placeholder:font-medium placeholder:text-[#0C1A16]/30"
                />
              </div>
            </div>

            <div>
              <label className="text-[12px] font-extrabold uppercase tracking-wider text-[#0C1A16]/60 flex items-center gap-1.5">
                <Lock size={13} className="text-[#9A6B1E]" /> Password
              </label>
              <div className="mt-1.5 flex items-center bg-white border-2 border-[#0C1A16]/12 rounded-2xl overflow-hidden focus-within:border-[#0C1A16] transition">
                <span className="pl-4 text-[#0C1A16]/35"><KeyRound size={17} /></span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="flex-1 px-3 py-3.5 bg-transparent text-[14.5px] font-bold placeholder:text-[#0C1A16]/30"
                />
                <button type="button" onClick={() => setShow(!show)} className="pr-4 text-[#0C1A16]/40 hover:text-[#0C1A16] transition">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[13px] font-semibold">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => setRemember(!remember)}
                  className={`w-11 h-6 rounded-full p-1 transition ${remember ? "bg-[#0C1A16]" : "bg-[#0C1A16]/15"}`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white shadow transition-all ${remember ? "translate-x-5" : ""}`} />
                </button>
                Remember me
              </label>
              <span className="text-[#0C1A16]/45">Forgot? Call {HOTEL.phone}</span>
            </div>

            {err && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-[13px] font-bold rounded-xl px-4 py-3">{err}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0C1A16] hover:bg-[#1d352c] disabled:opacity-70 text-white font-extrabold py-4 rounded-2xl text-[15px] transition inline-flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin text-[#F0C778]" /> Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} className="text-[#F0C778]" /> Login to Dashboard
                </>
              )}
            </button>

            {/* demo creds */}
            <div className="bg-[#0C1A16] text-white rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute inset-0 texture-dark" />
              <div className="relative flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#F0C778]">Demo credentials</div>
                  <div className="mt-1 text-[13.5px] font-bold">
                    User: <span className="text-[#F0C778] font-mono">{creds.username}</span>
                    <span className="mx-2 text-white/30">•</span>
                    Pass: <span className="text-[#F0C778] font-mono">{creds.password}</span>
                  </div>
                  <div className="text-[11.5px] text-white/50 font-medium">You can change this later inside dashboard settings.</div>
                </div>
                <button type="button" onClick={fillDemo} className="bg-[#D4A24E] hover:bg-[#f0c778] text-[#0C1A16] text-[12.5px] font-extrabold px-4 py-2.5 rounded-xl transition shrink-0">
                  Autofill
                </button>
              </div>
            </div>

            <p className="text-center text-[11.5px] text-[#0C1A16]/45 font-medium">
              Protected area • All logins are for AFC Hotel staff only • {HOTEL.shortAddress}
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
