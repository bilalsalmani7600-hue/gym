"use client";

// Footer (layout FO10 physics pile footer, restyled: the same code-drawn plates as the signature, seen face-on, plus
// stencilled chalk word discs, drop and pile on the floor line under a stamped wordmark + three mono link columns).
// Motion M236 (Round 3 tunes it): the pile plays on the clock once on screen (lesson 77). ?static=1: the settled pile.
import { useEffect, useRef } from "react";
import { isRecording, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { contact, footer, plates, studio } from "@/site/content";
import { PlateFace } from "./Plates";

type Body = { x: number; y: number; vx: number; vy: number; r: number; rot: number };
type Item = { kind: "plate"; p: number; r: number } | { kind: "word"; w: string; r: number };

// seeded random: the same pile on every load (and in ?static=1)
const rand = (s: number) => {
  const x = Math.sin(s * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};
const MOBILE_COUNT = 24;
const DESKTOP_COUNT = 100;
const MOBILE_SCALE = 0.54;

const ITEMS: Item[] = Array.from({ length: DESKTOP_COUNT }, (_, k): Item => {
  if (k % 6 === 5) return { kind: "word", w: footer.words[(k >> 2) % footer.words.length], r: 44 };
  const p = Math.floor(rand(k + 11) * plates.length);
  return { kind: "plate", p, r: plates[p].dia === 450 ? 54 + Math.round(rand(k) * 10) : 40 };
});

const spawn = (w: number): Body[] => {
  const isMobile = w < 768;
  const count = isMobile ? MOBILE_COUNT : DESKTOP_COUNT;
  const scale = isMobile ? MOBILE_SCALE : 0.82;
  return ITEMS.slice(0, count).map((s, k) => {
    const r = Math.round(s.r * scale);
    return {
      x: r + rand(k + 40) * (w - 2 * r),
      y: -r - (k % 25) * 16 - Math.floor(k / 25) * 36 - rand(k + 80) * 12,
      vx: (rand(k + 7) - 0.5) * 50,
      vy: 0,
      r,
      rot: rand(k + 3) * 360,
    };
  });
};

function step(b: Body[], w: number, h: number, dt: number) {
  const G = 2600;
  for (const p of b) {
    p.vy += G * dt;
    p.vx *= 0.995;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.rot += ((p.vx * dt) / p.r) * 57.3;
  }
  for (let it = 0; it < 3; it++) {
    for (let i = 0; i < b.length; i++) {
      const a = b[i];
      for (let j = i + 1; j < b.length; j++) {
        const c = b[j];
        const dx = c.x - a.x;
        const dy = c.y - a.y;
        const min = a.r + c.r;
        const d2 = dx * dx + dy * dy;
        if (d2 >= min * min || d2 === 0) continue;
        const d = Math.sqrt(d2);
        const nx = dx / d;
        const ny = dy / d;
        const over = (min - d) / 2;
        a.x -= nx * over;
        a.y -= ny * over;
        c.x += nx * over;
        c.y += ny * over;
        const rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
        if (rv < 0) {
          const imp = -0.6 * rv; // heavy: rubber plates barely bounce
          a.vx -= imp * nx;
          a.vy -= imp * ny;
          c.vx += imp * nx;
          c.vy += imp * ny;
        }
      }
    }
    for (const p of b) {
      if (p.y + p.r > h) {
        p.y = h - p.r;
        if (p.vy > 0) p.vy *= -0.18;
        p.vx *= 0.88;
      }
      if (p.x - p.r < 0) {
        p.x = p.r;
        p.vx = Math.abs(p.vx) * 0.4;
      }
      if (p.x + p.r > w) {
        p.x = w - p.r;
        p.vx = -Math.abs(p.vx) * 0.4;
      }
    }
  }
}

export default function PileFooter() {
  const box = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLDivElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const size = () => ({ w: el.clientWidth, h: el.clientHeight });
    const paint = () => {
      const isMobile = (box.current?.clientWidth || 0) < 768;
      const scaleStr = isMobile ? ` scale(${MOBILE_SCALE})` : "";
      bodies.current.forEach((p, k) => {
        const n = els.current[k];
        if (n) n.style.transform = `translate(${(p.x - ITEMS[k].r).toFixed(1)}px, ${(p.y - ITEMS[k].r).toFixed(1)}px) rotate(${p.rot.toFixed(1)}deg)${scaleStr}`;
      });
    };
    const { w, h } = size();
    bodies.current = spawn(w);
    if (prefersReducedMotion()) {
      for (let k = 0; k < 1200; k++) step(bodies.current, w, h, 1 / 120);
      paint();
      return;
    }
    paint();
    let raf = 0;
    let last = 0;
    let started = false;
    let hop = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.033, (now - (last || now)) / 1000);
      last = now;
      const { w: ww, h: hh } = size();
      // two plates hop every ~0.45 s so the resting pile (the reel's last screen) is never still (lesson 35)
      hop += dt;
      if (hop > 0.45) {
        hop = 0;
        const isMobile = ww < 768;
        const free = bodies.current.filter((p) => p.y > hh * 0.45);
        const hopCount = isMobile ? 1 : 2;
        for (let n = 0; n < hopCount; n++) {
          const p = free[Math.floor(Math.random() * free.length)];
          if (p) {
            p.vy = isMobile ? -360 - Math.random() * 120 : -820 - Math.random() * 260;
            p.vx = (Math.random() - 0.5) * (isMobile ? 180 : 460);
          }
        }
      }
      for (let k = 0; k < 3; k++) step(bodies.current, ww, hh, dt / 3);
      paint();
    };
    // the footer is revealed UNDER the page (X40, sticky): it is always "in view" geometrically, so the pile plays by
    // scroll position (lesson 66): it starts once the join band's bottom clears the screen bottom, on the clock (77)
    const st = ScrollTrigger.create({
      trigger: "#join",
      start: "bottom 98%",
      // runs from here to the very bottom of the page (it must not stop when the scroll reaches its end)
      onEnter: () => {
        cancelAnimationFrame(raf);
        last = 0;
        if (!started) {
          started = true;
          bodies.current = spawn(size().w);
          if (isRecording()) window.setTimeout(sweep, 1300);
        }
        raf = requestAnimationFrame(loop);
      },
      onLeaveBack: () => cancelAnimationFrame(raf),
      onEnterBack: () => {
        cancelAnimationFrame(raf);
        last = 0;
        raf = requestAnimationFrame(loop);
      },
    });

    const ro = new ResizeObserver(() => {
      const { w: newW } = size();
      const isMobile = newW < 768;
      const currCount = bodies.current.length;
      if ((isMobile && currCount !== MOBILE_COUNT) || (!isMobile && currCount !== DESKTOP_COUNT)) {
        bodies.current = spawn(newW);
      }
    });
    ro.observe(el);

    // ?record=1: a fake pointer sweeps once through the pile and shoves the plates it passes
    function sweep() {
      const { w: ww, h: hh } = size();
      const t0 = performance.now();
      const push = () => {
        const f = (performance.now() - t0) / 900;
        if (f > 1) return;
        const px = ww * (0.1 + 0.8 * f);
        const py = hh * 0.72;
        for (const p of bodies.current) {
          const dx = p.x - px;
          const dy = p.y - py;
          const d = Math.hypot(dx, dy);
          if (d < p.r + 60) {
            p.vx += (dx / (d || 1)) * 260 + 220;
            p.vy -= 380;
          }
        }
        requestAnimationFrame(push);
      };
      push();
    }
    return () => {
      st.kill();
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <footer id="footer" data-section="Footer" className="sticky bottom-0 z-[1] overflow-hidden bg-bg footer-pinned">
      <div className="flex flex-col gap-6 sm:gap-7 px-4 sm:px-8 md:px-[64px] pt-10 md:pt-[56px] max-w-[1560px] mx-auto relative z-10 w-full">
        {/* 1. Address & Directions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-start gap-3.5">
            {/* Red Location Pin */}
            <div className="mt-1 shrink-0 text-[#ff1a1a]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
            </div>
            <div>
              <h3 className="stamp-n text-[19px] sm:text-[22px] md:text-[26px] text-white font-black leading-tight">
                Crystal Arc Building, Ground Floor
              </h3>
              <p className="text-[13px] sm:text-[14px] text-white/70 mt-1 font-sans">
                Balmatta Road, Hampankatta &nbsp;•&nbsp; Beside Roopa Hotel &amp; Opposite KTM Showroom
              </p>
              <p className="stamp-n text-[14px] sm:text-[16px] text-white/90 font-bold mt-1">
                Mangaluru, Karnataka 575001
              </p>
            </div>
          </div>
          <div className="shrink-0 mt-1 lg:mt-0">
            <a
              href="https://maps.google.com/?q=Shakz+Fitness+Club+Crystal+Arc+Building+Balmatta+Road+Hampankatta+Mangaluru+Karnataka+575001"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-slanted px-5 sm:px-7 py-3 text-[12px] sm:text-[13.5px] font-black inline-flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(255,26,26,0.35)]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
              <span>GET DIRECTIONS ON GOOGLE MAPS</span>
              <span className="font-mono text-sm">→</span>
            </a>
          </div>
        </div>

        {/* 2. Opening Hours */}
        <div>
          <p className="mono-s text-[#ff1a1a] font-bold text-[12px] sm:text-[13px] uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
            <span className="text-[#ff1a1a] font-black">/</span> OPENING HOURS
          </p>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Card 1: Monday - Saturday */}
            <div className="bg-[#151514] border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-white/70">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="mono-s text-[9px] sm:text-[11px] text-white/50 uppercase tracking-wider truncate">
                  MON – SAT
                </span>
              </div>
              <div className="mt-2">
                <span className="stamp-n text-[14px] sm:text-[18px] md:text-[22px] text-white font-black leading-tight block">
                  8:00 AM – 10:00 PM
                </span>
                <span className="mono-s text-[8px] sm:text-[9.5px] text-white/40 uppercase tracking-wider block mt-0.5">
                  GENERAL ACCESS
                </span>
              </div>
            </div>

            {/* Card 2: Ladies-Only Slot */}
            <div className="bg-[#1c1212] border border-[#ff1a1a]/30 rounded-xl p-3 sm:p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-[#ff1a1a]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="mono-s text-[9px] sm:text-[11px] text-[#ff1a1a] font-bold uppercase tracking-wider truncate">
                  ALTERNATE SLOT
                </span>
              </div>
              <div className="mt-2">
                <span className="stamp-n text-[14px] sm:text-[18px] md:text-[22px] text-white font-black leading-tight block">
                  12:00 PM – 2:00 PM
                </span>
                <span className="mono-s text-[8px] sm:text-[9.5px] text-white/40 uppercase tracking-wider block mt-0.5">
                  MON – SAT
                </span>
              </div>
            </div>
          </div>

          {/* Sunday Closed Pill */}
          <div className="mt-2.5 flex items-center">
            <div className="inline-flex items-center gap-2 bg-[#151514] border border-white/10 rounded-full px-3.5 py-1.5 text-[11px] font-mono">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
              </svg>
              <span className="text-white/70 uppercase">SUNDAY:</span>
              <span className="border border-[#ff1a1a]/40 text-[#ff1a1a] bg-[#ff1a1a]/10 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                CLOSED
              </span>
            </div>
          </div>
        </div>

        {/* 3. Reach Us & Instagram */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* REACH US (WHATSAPP) — both numbers in one row */}
          <div>
            <p className="mono-s text-[#ff1a1a] font-bold text-[12px] sm:text-[13px] uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
              <span className="text-[#ff1a1a] font-black">/</span> REACH US (WHATSAPP)
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {contact.phones.map((p) => (
                <div key={p.display} className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1.5 xs:gap-2 bg-[#151514] border border-white/10 rounded-xl p-2.5 sm:px-4 sm:py-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <div className="text-[#25D366] shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
                      </svg>
                    </div>
                    <a href={p.href} className="stamp-n text-[12px] xs:text-[13.5px] sm:text-[16px] text-white font-bold hover:text-[#25D366] transition-colors truncate">
                      {p.display}
                    </a>
                  </div>
                  <a
                    href={p.wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono-s text-[9px] sm:text-[11px] font-bold uppercase px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-[#25D366]/40 text-[#25D366] bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-all flex items-center gap-0.5 sm:gap-1 shrink-0 self-end xs:self-auto"
                  >
                    <span>WA</span>
                    <span className="hidden sm:inline">TSAPP</span>
                    <span>→</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* INSTAGRAM */}
          <div>
            <p className="mono-s text-[#ff1a1a] font-bold text-[12px] sm:text-[13px] uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
              <span className="text-[#ff1a1a] font-black">/</span> INSTAGRAM
            </p>
            <a
              href={contact.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 bg-[#151514] border border-white/10 hover:border-white/25 rounded-xl px-4 py-3.5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>
                <span className="stamp-n text-[16px] sm:text-[18px] text-white font-bold group-hover:text-[#ff1a1a] transition-colors">
                  {contact.instagram.handle}
                </span>
              </div>
              <span className="text-white/40 group-hover:text-white transition-colors text-lg">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* the pile: natural stacked floor pile across full screen width */}
      <div ref={box} data-pile className="relative mt-8 sm:mt-10 h-[120px] sm:h-[165px]">
        {ITEMS.map((s, k) => (
          <div
            key={k}
            ref={(n) => {
              els.current[k] = n;
            }}
            className={`absolute left-0 top-0 will-change-transform ${k >= MOBILE_COUNT ? "hidden md:block" : ""}`}
            style={{ width: s.r * 2, height: s.r * 2 }}
          >
            {s.kind === "plate" ? (
              <PlateFace p={plates[s.p]} size={s.r * 2} id={`pf${k}`} />
            ) : (
              <div className="grid h-full w-full place-items-center rounded-full border-2 border-[#b9b5ad] bg-[var(--chalk)] text-[var(--chalk-ink)]">
                <span className="stamp text-[13px] sm:text-[15px]">{s.w}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rule-t bg-[#111110] relative z-20 flex flex-col sm:flex-row min-h-[56px] py-4 sm:py-0 items-center justify-between gap-3 px-4 sm:px-8 md:px-[64px]">
        <span className="mono-s text-muted text-[11px] sm:text-[12px] uppercase tracking-wider">
          CONCEPT WEBSITE BY <span className="text-white font-bold">{studio}</span>
        </span>
        <span className="mono-s text-[11px] sm:text-[13px] font-black uppercase tracking-wider">
          SHAKZ <span className="text-[#ff1a1a]">FITNESS CLUB</span>
        </span>
      </div>
    </footer>
  );
}
