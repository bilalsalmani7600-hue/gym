"use client";

// Nav (layout NV14 ruled-cell navbar, restyled as a gym scoreboard). The REP cell counts the page's real sections
// ([data-section]) and shows which one is on screen. Motion M283: every changed digit / letter rolls in its own
// clipped cell with a springy overshoot (RollText "slot").
import { useEffect, useState } from "react";
import { nav } from "@/site/content";
import RollText from "./RollText";
import { onPlateLifting } from "@/site/lib/plate";

const pad = (n: number) => String(n).padStart(2, "0");


export default function ScoreNav() {
  const [rep, setRep] = useState({ i: 1, n: 0, name: "" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return onPlateLifting(() => setVisible(true));
  }, []);

  useEffect(() => {
    const secs = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const n = secs.length;
    const update = () => {
      const mid = window.innerHeight * 0.5;
      let i = 0;
      secs.forEach((s, k) => {
        if (s.getBoundingClientRect().top <= mid) i = k;
      });
      const name = secs[i]?.getAttribute("data-section") ?? "";
      setRep((r) => (r.i === i + 1 && r.n === n && r.name === name ? r : { i: i + 1, n, name }));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const total = rep.n || 10;
  const isSignature = rep.name.toLowerCase().includes("load") || rep.i === 5;

  return (
    <>
      {/* MODERN DESKTOP HEADER (Frosted Glass Floating Navbar) */}
      <header className={`fixed inset-x-0 top-0 z-50 hidden md:flex h-[68px] items-center justify-between px-8 bg-black/60 backdrop-blur-2xl border-b border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-fg transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {/* Brand Logo */}
        <a href="#lift" className="flex items-center group transition-transform duration-200 hover:scale-[1.02]">
          <img 
            src="/images/iron-temple/logo-trim.webp" 
            alt="SHAKZ FITNESS CLUB logo" 
            className="h-[40px] w-auto object-contain object-left drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" 
          />
        </a>

        {/* Center Floating Glass Nav Capsule */}
        <nav className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
          {nav.links.map((l) => (
            <a 
              key={l.href} 
              href={l.href} 
              className="px-4 py-1.5 rounded-full mono-s text-[12px] font-bold tracking-wider text-white/70 hover:text-white hover:bg-white/[0.1] active:scale-95 transition-all"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right Action & Rep Indicator */}
        <div className="flex items-center gap-3">
          {/* iOS-style Live Section Pill */}
          <div 
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-xl shadow-sm"
            aria-label={`Section ${rep.i} of ${rep.n}`}
          >
            <span className="w-2 h-2 rounded-full bg-[#ff1a1a] shadow-[0_0_8px_#ff1a1a] animate-pulse" />
            <span className="mono-s text-[11px] text-white/60 tracking-wider">REP</span>
            <span className="mono text-[13.5px] font-bold text-white tabular-nums tracking-wider">
              <RollText text={pad(rep.i)} />
              <span className="text-white/40"> / </span>
              <RollText text={pad(rep.n)} />
            </span>
            <span className="w-px h-3 bg-white/15" />
            <RollText text={rep.name.toUpperCase()} className="mono-s text-[11px] font-semibold text-white/85 max-w-[120px] truncate" />
          </div>

          {/* Liquid Glass CTA Button */}
          <a 
            href="#plans" 
            className="ios-glass-btn flex items-center gap-2 px-5 py-2 rounded-full font-sans font-black text-[12.5px] tracking-wider text-white uppercase" 
            data-cursor="Book" 
            data-hover 
            data-press 
            data-nav-book
          >
            <span>{nav.cta}</span>
            <span className="text-xs transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </div>

        {/* Bottom Hairline Reading Progress */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/[0.06]">
          <div 
            className="h-full bg-gradient-to-r from-[#ff1a1a] via-[#ff3b3b] to-[#ff1a1a] shadow-[0_0_8px_#ff1a1a] transition-all duration-300" 
            style={{ width: `${Math.round((rep.i / total) * 100)}%` }} 
          />
        </div>
      </header>

      {/* MODERN MOBILE HEADER */}
      <header className={`fixed inset-x-0 top-0 z-[100] md:hidden bg-black/75 backdrop-blur-2xl border-b border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-fg transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="flex h-[60px] items-center justify-between px-3.5">
          {/* Logo */}
          <a href="#lift" className="flex items-center active:scale-95 transition-transform">
            <img 
              src="/images/iron-temple/logo-trim.webp" 
              alt="SHAKZ FITNESS CLUB logo" 
              className="h-[36px] w-auto object-contain object-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" 
            />
          </a>

          {/* Right Status Pill & Menu Toggle */}
          <div className="flex items-center gap-2">
            {/* Live Rep Status Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1a1a] shadow-[0_0_6px_#ff1a1a] animate-pulse" />
              <span className="mono-s text-[10px] font-bold text-white tracking-wider tabular-nums">
                {isSignature ? "170 KG" : `REP ${pad(rep.i)}/${pad(total)}`}
              </span>
            </div>

            {/* Circular iOS Frosted Menu Button */}
            <button 
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open navigation menu"}
              className="flex flex-col items-center justify-center gap-1.5 w-10 h-10 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/20 text-white active:scale-90 transition-all focus:outline-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
            >
              <span className={`block w-4 h-[2px] bg-white transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[8px]" : ""}`} />
              <span className={`block w-4 h-[2px] bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-4 h-[2px] bg-white transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[8px]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Bottom Hairline Laser Progress Track */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/[0.08]">
          <div 
            className="h-full bg-gradient-to-r from-[#ff1a1a] via-[#ff4d4d] to-[#ff1a1a] shadow-[0_0_8px_#ff1a1a] transition-all duration-300"
            style={{ width: `${Math.max(8, Math.round((rep.i / total) * 100))}%` }}
          />
        </div>
      </header>

      {/* FULL-SCREEN MOBILE OVERLAY (Placed outside header so backdrop-filter doesn't clip fixed position) */}
      {menuOpen && (
        <div className="fixed inset-0 z-[95] md:hidden bg-[#0d0c0c]/98 backdrop-blur-3xl pt-[76px] pb-6 px-5 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
          <nav className="flex flex-col gap-2.5 pt-2">
            {nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-[#ff1a1a]/50 active:scale-[0.98] transition-all"
              >
                <span className="stamp text-[24px] text-white/95 group-hover:text-[#ff1a1a] transition-colors">
                  {l.label}
                </span>
                <span className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-[#ff1a1a] transition-all text-xs">
                  →
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href="#plans"
              onClick={() => setMenuOpen(false)}
              className="ios-glass-btn w-full py-4 rounded-full text-center text-[15px] font-sans font-black tracking-wider uppercase text-white shadow-[0_8px_24px_rgba(255,26,26,0.5)]"
            >
              BOOK A TRIAL →
            </a>

            {/* iOS Frosted Info Card */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex flex-col gap-2 text-[11px] font-mono text-white/70">
              <div className="flex items-center justify-between text-white/95 font-semibold">
                <span className="text-[#ff1a1a] font-bold">MON – SAT</span>
                <span>06:00 AM – 10:00 PM</span>
              </div>
              <div className="flex items-center justify-between text-[#ff1a1a]/95 text-[10.5px]">
                <span>LADIES SLOT</span>
                <span>12:00 PM – 2:00 PM</span>
              </div>
              <div className="text-[10px] text-white/45 pt-1.5 border-t border-white/10 text-center">
                Hampankatta, Mangaluru • +91 99804 05656
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
