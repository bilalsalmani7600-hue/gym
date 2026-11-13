"use client";

// Loader I16 · corner counter becomes the wipe. A chalk plate covers the screen with a huge stencilled counter in the
// corner that follows the real load (the hero frames register with lib/loading). At 100 the digits slide up out of
// their mask and the plate wipes upward with a dusty edge onto the hero, which is already moving.
import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { loading } from "@/lib/loading";
import { markPlateLifting } from "@/site/lib/plate";

import { nav } from "@/site/content";

export default function PlateLoader() {
  const root = useRef<HTMLDivElement>(null);
  const digits = useRef<HTMLSpanElement>(null);
  const mobileDigits = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const mobileBarRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const mobilePercentRef = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setGone(true);
      loading.markFinished();
      markPlateLifting();
      return;
    }
    const el = root.current!;
    const shown = { v: 0 };
    let target = 0;
    let exiting = false;
    const t0 = performance.now();
    const MIN = 1600; // the counter takes at least this long: it climbs with the clock and never waits on 100
    const draw = () => {
      const val = Math.round(shown.v);
      const strVal = String(val).padStart(3, "0");
      if (digits.current) digits.current.textContent = strVal;
      if (mobileDigits.current) mobileDigits.current.textContent = strVal;
      if (barRef.current) barRef.current.style.width = `${val}%`;
      if (mobileBarRef.current) mobileBarRef.current.style.width = `${val}%`;
      if (percentRef.current) percentRef.current.textContent = `${val}%`;
      if (mobilePercentRef.current) mobilePercentRef.current.textContent = strVal;
    };
    // the counter eases toward the real progress every frame (never steps: lesson 10)
    // the counter follows the smaller of the real load and the clock (linear over MIN), so it climbs smoothly from
    // the first frame and reaches 100 exactly as it may exit: it never sits on 100 waiting (lessons 3, 10)
    const tick = () => {
      const clock = Math.min(100, ((performance.now() - t0) / MIN) * 100);
      const goal = Math.min(target, clock);
      shown.v += (goal - shown.v) * 0.25;
      if (goal >= 100 && shown.v > 99.5) shown.v = 100;
      draw();
      if (shown.v >= 100) exit();
    };
    gsap.ticker.add(tick);
    const hard = window.setTimeout(() => (target = 100), 9000);

    const exit = () => {
      if (exiting) return;
      exiting = true;
      gsap.ticker.remove(tick);
      window.clearTimeout(hard);
      const digitEls = [digits.current, mobileDigits.current].filter(Boolean);
      gsap
        .timeline()
        .to(digitEls, { yPercent: -110, duration: 0.45, ease: "power3.in" })
        .add(() => markPlateLifting(), "-=0.1") // the hero starts moving as the plate starts to lift (lesson 4)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "expo.inOut" }, "<")
        .add(() => loading.markFinished(), "-=0.55")
        .add(() => setGone(true));
    };

    const unsub = loading.subscribe((p, done) => {
      target = done ? 100 : Math.min(99, p * 100);
    });
    return () => {
      unsub();
      gsap.ticker.remove(tick);
      window.clearTimeout(hard);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      data-loader
      aria-hidden
      className="plate-loader fixed inset-0 z-[200] bg-[#111110] text-[var(--plate-red)]"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="loader-dust absolute inset-0 opacity-20" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
        <img 
          src="/images/iron-temple/image copy.png" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <img 
          src="/images/iron-temple/loader-hero-transparent.png" 
          alt="" 
          className="relative h-[72vh] md:h-[75vh] object-contain mt-32 md:mt-48 z-10"
        />
      </div>

      {/* MOBILE LAYOUT (matching reference intro exactly) */}
      <div className="md:hidden absolute inset-x-0 top-0 pt-7 px-4 flex flex-col items-center text-center z-20">
        <div className="flex items-center justify-center mb-1">
          <img 
            src="/images/iron-temple/logo-trim.png" 
            alt="SHAKZ FITNESS CLUB logo" 
            className="w-[160px] xs:w-[190px] sm:w-[220px] h-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]" 
          />
        </div>
        <h1 
          className="font-sans italic font-black uppercase tracking-tight text-[34px] sm:text-[42px] text-transparent leading-[0.92] mt-2.5"
          style={{ WebkitTextStroke: "2px #ff1a1a" }}
        >
          SHAKZ<br />FITNESS CLUB
        </h1>
        <p className="mono-s mt-2.5 text-[10px] sm:text-[11px] tracking-[0.2em] text-white/70">
          STRENGTH LIVE &nbsp;•&nbsp; TRANSFORM THE BODY
        </p>
        <div className="mt-4 flex items-center gap-3 w-full max-w-[260px]">
          <div className="flex-1 h-[2px] bg-white/20 relative">
            <div 
              ref={mobileBarRef}
              className="absolute inset-y-0 left-0 bg-[#ff1a1a] shadow-[0_0_12px_rgba(255,26,26,0.8)]" 
              style={{ width: '0%' }}
            />
          </div>
          <span ref={mobilePercentRef} className="mono-s text-white/80 text-[11px] font-bold tabular-nums">000</span>
        </div>
      </div>

      {/* Mobile massive red number centered at bottom (matching reference Image 1) */}
      <div className="md:hidden absolute inset-x-0 bottom-1 z-20 flex justify-center overflow-hidden leading-none pointer-events-none">
        <span ref={mobileDigits} className="stamp block text-[130px] sm:text-[170px] tabular-nums text-[#ff1a1a] leading-none select-none drop-shadow-[0_4px_24px_rgba(255,26,26,0.3)]">
          000
        </span>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden md:flex absolute left-[64px] top-[56px] flex-col gap-0 z-20">
        <div className="mb-2 flex items-center justify-start">
           <img src="/images/iron-temple/logo-trim.png" alt="SHAKZ FITNESS CLUB logo" className="w-[280px] h-auto object-contain object-left" />
        </div>
        <div>
          <p 
            className="font-sans italic font-black uppercase tracking-tight text-[64px] text-transparent"
            style={{ WebkitTextStroke: "2px var(--plate-red)", lineHeight: 0.9 }}
          >
            {nav.brand}
          </p>
          <p className="mono-s mt-4 text-white/50">Strength gym · loading the bar</p>
          
          <div className="mt-6 flex items-center gap-4 w-full max-w-[360px]">
            <div className="flex-1 h-[2px] bg-[rgba(255,255,255,0.18)] relative">
              <div 
                ref={barRef}
                className="absolute inset-y-0 left-0 bg-[#ff1a1a] shadow-[0_0_12px_rgba(255,26,26,0.6)] animate-pulse" 
                style={{ width: '0%' }}
              />
            </div>
            <span ref={percentRef} className="mono-s text-white/80 w-[30px] text-right">0%</span>
          </div>
        </div>
      </div>
      <div className="hidden md:block absolute bottom-[40px] right-[56px] overflow-hidden leading-none z-20">
        <span ref={digits} className="stamp block text-[260px] tabular-nums">
          000
        </span>
      </div>
      <div className="hidden md:block absolute bottom-[56px] left-[64px] mono-s text-white/50 z-20">Warming up</div>
    </div>
  );
}
