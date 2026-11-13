"use client";

// Hero · The lift (layout HR01 split hero + strip, restyled: the film is full-bleed, the headline sits on its dark
// left third, the logo strip became a ruled spec strip). Motion M142 (Round 2): HEAVY gains weight + width with the
// bar's height in the film (--heavy 0 → 1). ?static=1 shows the lockout still and HEAVY at full weight.
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { onPlateLifting } from "@/site/lib/plate";
import LiftPin from "./LiftPin";
import type { Film } from "@/site/lib/film";
import { hero } from "@/site/content";
import Odo from "./Odo";
import Magnet from "./Magnet";

/** Video seconds are of the trimmed clip (raw 3.0–7.0 s): 0–1 bottom (the lifter is set and still: the intro plays it
 *  during the loader wipe, so the scroll gives it only 0.3 s), 1–2 the pull (the biggest share), 2–4 lockout hold. */
export const LIFT: Film = {
  frames: "/frames/iron-temple-lift",
  start: 0,
  segments: [
    { to: 1, secs: 0.3, label: "bottom" },
    { to: 2, secs: 2.8, label: "pull" },
    { to: 4, secs: 1.2, label: "lockout" },
  ],
  poster: 4,
};

/** 0 at the floor, 1 at lockout: the pull (1–2 s) carries the whole change. */
export const heavyAt = (t: number) => Math.min(1, Math.max(0, t - 1));

/** The slow push-in, done in code: a gentle scale that follows the shown video second (intro or scroll), so the
 *  camera keeps creeping in through the lockout hold too. 1 → 1.08 over the whole film. */
const pushAt = (t: number) => 1 + 0.08 * Math.min(1, Math.max(0, t / 4));

const SPEC_CARDS = [
  { label: "FLOOR", val: "2,400", sub: "SQ FT", valClass: "text-[16px] sm:text-[19px]" },
  { label: "PLATFORMS", val: "6", sub: "OAK", valClass: "text-[21px] sm:text-[25px]" },
  { label: "RACKS", val: "10", sub: "ROGUE", valClass: "text-[24px] sm:text-[28px]" },
  { label: "DUMBBELLS", val: "TO 60 KG", sub: "", valClass: "text-[11px] sm:text-[13px]" },
  { label: "OPEN", val: "08:00–22:00", sub: "", valClass: "text-[9.5px] sm:text-[11.5px] tracking-tight" },
];

export default function HeroLift() {
  const [activeCard, setActiveCard] = useState(2);
  const words = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLElement[]>([]);
  const onTime = useCallback((t: number) => {
    words.current?.style.setProperty("--heavy", heavyAt(t).toFixed(4));
    if (!media.current.length) media.current = Array.from(document.querySelectorAll<HTMLElement>("#lift .lift-media"));
    const s = pushAt(t).toFixed(4);
    // origin on the lifter (centre-right, chest height) so the push lands on him, not on the empty left
    media.current.forEach((m) => (m.style.transform = `scale(${s})`));
  }, []);

  // entrance on the clock as the loader wipes off (≤ 3 staggered groups, lesson budget): LIFT rises out of its mask,
  // the line + copy follow, the spec strip cells come up in turn. It fills the film's still "bottom" second.
  const intro = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = intro.current!;
    const lift = el.querySelector("[data-in='lift']");
    const rest = el.querySelectorAll("[data-in='rest']");
    const cells = el.querySelectorAll("[data-in='cell']");
    gsap.set(lift, { yPercent: 105 });
    gsap.set(rest, { y: 34, opacity: 0 });
    gsap.set(cells, { yPercent: 100 });
    return onPlateLifting(() => {
      // starts as the chalk plate wipes off and runs ~1.5 s into the first record second
      const tl = gsap.timeline({ delay: 0.35 });
      tl.fromTo(lift, { yPercent: 105 }, { yPercent: 0, duration: 0.8, ease: "power2.out" }, 0)
        .fromTo(rest, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.14 }, 0.25)
        .fromTo(cells, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "power2.out", stagger: 0.12 }, 0.4);
    });
  }, []);

  return (
    <LiftPin
      id="lift"
      sectionName="The lift"
      film={LIFT}
      arrive={0}
      eager
      blockLoader
      onTime={onTime}
      autoplay
      canvasClass="lift-canvas lift-media absolute inset-0 h-full w-full origin-[66%_48%]"
      place={() => ({ fade: { l: 0.04, r: 0.04, t: 0.06, b: 0.1 } })}
      before={
        // the lockout still: poster while the frames load, and the ?static=1 picture
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/images/iron-temple/image copy.png" alt="" className="lift-media absolute inset-0 h-full w-full origin-[66%_48%] object-cover" />
      }
    >
      {/* Mobile iOS ambient atmosphere: clear top for lifter, rich dark vignette at bottom left for text readability */}
      <div 
        aria-hidden 
        className="pointer-events-none absolute inset-0 md:hidden bg-[linear-gradient(180deg,rgba(10,10,10,0.35)_0%,rgba(10,10,10,0.08)_28%,rgba(10,10,10,0.65)_58%,rgba(10,10,10,0.94)_88%,#0a0a0a_100%)]" 
      />

      {/* Desktop soft dark pool behind the words only */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden md:block w-[52%] bg-[linear-gradient(90deg,rgba(17,17,16,0.86),rgba(17,17,16,0.55)_55%,transparent)]" />

      {/* MOBILE HERO VIEW (Modern iOS Glassy - Bottom Left Aligned) */}
      <div className="md:hidden absolute inset-0 z-20 flex flex-col justify-end pt-[68px] pb-3.5 px-3.5 pointer-events-none">
        {/* Hero Content Block (Bottom Left) */}
        <div className="pointer-events-auto flex flex-col items-start mb-5 sm:mb-6">
          {/* Logo before MAKE BODY STRONGER */}
          <div className="flex items-center -ml-1 mb-1">
            <img 
              src="/images/iron-temple/logo-trim.png" 
              alt="SHAKZ FITNESS CLUB" 
              className="w-[180px] xs:w-[210px] sm:w-[240px] h-auto object-contain object-left drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]" 
            />
          </div>

          {/* Headline: MAKE BODY STRONGER */}
          <h1 className="stamp italic text-[44px] xs:text-[50px] sm:text-[58px] leading-[0.85] tracking-tight mt-1">
            <span 
              className="block text-transparent" 
              style={{ 
                WebkitTextStroke: "2.5px #ff2626", 
                filter: "drop-shadow(0 0 18px rgba(255,38,38,0.5))" 
              }}
            >
              {hero.lines[0]}
            </span>
            <span className="block text-white mt-0.5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
              {hero.lines[1]}
            </span>
          </h1>

          {/* Disciplines & Services Text (No card, pure text) */}
          <div className="mt-3 flex flex-col gap-1 text-[11px] sm:text-[12px] font-mono tracking-wider text-white uppercase font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            <div className="flex flex-wrap items-center gap-x-2">
              <span>GYM</span>
              <span className="w-1 h-1 rounded-full bg-[#ff1a1a] shadow-[0_0_6px_#ff1a1a]" />
              <span>CROSSFIT</span>
              <span className="w-1 h-1 rounded-full bg-[#ff1a1a] shadow-[0_0_6px_#ff1a1a]" />
              <span>PERSONAL TRAINING</span>
              <span className="w-1 h-1 rounded-full bg-[#ff1a1a] shadow-[0_0_6px_#ff1a1a]" />
              <span>CARDIO</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 text-white/85">
              <span>WEIGHT LOSS / GAIN</span>
              <span className="w-1 h-1 rounded-full bg-[#ff1a1a] shadow-[0_0_6px_#ff1a1a]" />
              <span>NUTRITIONIST</span>
              <span className="w-1 h-1 rounded-full bg-[#ff1a1a] shadow-[0_0_6px_#ff1a1a]" />
              <span>LOCKERS</span>
            </div>
          </div>

          {/* iOS Liquid Glass Action Button - pushed up with margin */}
          <a 
            href="#plans" 
            className="ios-glass-btn mt-3.5 mb-2 sm:mb-3 group inline-flex items-center gap-3 px-6 py-2.5 rounded-full text-[13px] font-sans font-black tracking-wider text-white uppercase shadow-[0_4px_20px_rgba(255,26,26,0.4)]"
          >
            <span>BOOK A TRIAL</span>
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black/30 backdrop-blur-md text-white text-[11px] group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </a>
        </div>

        {/* Bottom Spec Dock (iOS Control Center / Floating Glass Shelf) */}
        <div className="pointer-events-auto flex flex-col items-center gap-2.5 w-full">
          <div className="ios-glass-panel w-full p-2 rounded-2xl">
            <div className="grid grid-cols-5 gap-1.5 w-full">
              {SPEC_CARDS.map((spec, i) => {
                const isActive = activeCard === i;
                return (
                  <button
                    key={spec.label}
                    type="button"
                    onClick={() => setActiveCard(i)}
                    className={`ios-stat-card py-2 px-1 min-h-[74px] sm:min-h-[82px] flex flex-col justify-between items-center text-center cursor-pointer select-none ${
                      isActive ? "is-active" : ""
                    }`}
                  >
                    <span className={`mono-s block text-[9.5px] sm:text-[11px] font-bold tracking-wider leading-tight ${isActive ? "text-white" : "text-white/70"}`}>
                      {spec.label}
                    </span>
                    <span className={`stamp-n block ${spec.valClass} font-black text-white leading-none my-auto whitespace-nowrap`}>
                      {spec.val}
                    </span>
                    <span className={`mono-s block text-[8px] sm:text-[9.5px] font-semibold leading-tight ${isActive ? "text-white/95" : "text-white/60"} ${spec.sub ? "" : "invisible"}`}>
                      {spec.sub || "—"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3 Pagination Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((dotIdx) => {
              const isDotActive = 
                (dotIdx === 0 && activeCard < 2) || 
                (dotIdx === 1 && activeCard === 2) || 
                (dotIdx === 2 && activeCard > 2);
              return (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setActiveCard(dotIdx === 0 ? 0 : dotIdx === 1 ? 2 : 4)}
                  aria-label={`Show slide ${dotIdx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                    isDotActive
                      ? "w-6 h-1.5 bg-[#ff1a1a] shadow-[0_0_12px_rgba(255,26,26,0.95)]"
                      : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* DESKTOP HERO VIEW */}
      <div ref={intro} className="hidden md:contents">
      <div className="absolute inset-x-0 top-[96px] bottom-[96px] flex flex-col justify-center px-[64px]">
        <div data-in="rest" className="-mb-16 w-[550px] h-[160px] flex-shrink-0 flex items-center justify-start overflow-hidden rounded-sm">
          <img src="/images/iron-temple/logo.png" alt="SHAKZ FITNESS CLUB logo" className="w-full h-full object-contain object-left" />
        </div>
        <div ref={words} className="hero-words">
          <h1 className="text-[clamp(64px,10vw,150px)] font-sans italic font-black uppercase leading-[0.85] tracking-tight">
            <span className="block overflow-hidden pb-[0.04em]">
              <span data-in="lift" className="block text-transparent" style={{ WebkitTextStroke: "2px var(--plate-red)" }}>{hero.lines[0]}</span>
            </span>
            <span data-in="lift" className="block text-white mt-1">{hero.lines[1]}</span>
          </h1>
        </div>
        <p data-in="rest" className="mt-8 max-w-[420px] text-[18px] leading-[1.5] text-fg/85">{hero.sub}</p>
      </div>

      {/* ruled spec strip */}
      <div className="absolute inset-x-0 bottom-0 flex h-[96px] overflow-hidden border-t-2 border-[var(--rule)] bg-[rgba(17,17,16,0.88)]">
        {hero.strip.map((s, i) => (
          <div key={s.k} data-in="cell" className="rule-r flex flex-1 flex-col justify-center px-6">
            <span className="mono-s text-muted">{s.k}</span>
            <span className="stamp-n mt-1 text-[26px]">{/[0-9]/.test(s.v) && !s.v.includes(":") ? <Odo text={s.v} when="plate" delay={0.6 + i * 0.12} /> : s.v}</span>
          </div>
        ))}
        <a href="#plans" data-in="cell" className="ibtn ibtn-blue h-full px-10 text-[15px]" data-cursor="Book" data-hover>
          <Magnet strength={0.22}>
            <span data-magnet-label className="inline-flex items-center gap-[14px]">
              {hero.cta} <span className="arrow" />
            </span>
          </Magnet>
        </a>
      </div>
      </div>
    </LiftPin>
  );
}
