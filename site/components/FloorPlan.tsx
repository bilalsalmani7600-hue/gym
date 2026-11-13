"use client";

// The floor (layout GL17 perspective floor grid, restyled: six square zone photos with a ruled label strip under
// each, beside a stamped title). Motion M430 (Round 3): the grid lies in deep perspective like a floor plan seen
// from the door and unfurls flat as the section passes (--unfurl 1 → 0, columns at different parallax offsets).
// ?static=1: flat.
import { useEffect, useRef } from "react";
import { prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { floor } from "@/site/content";
import Odo from "./Odo";

export default function FloorPlan() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const g = grid.current!;
    const tiles = Array.from(g.querySelectorAll<HTMLElement>("[data-col]"));
    const set = (p: number) => {
      const u = 1 - p; // 1 = lying on the floor, 0 = flat, facing you
      g.style.setProperty("--unfurl", u.toFixed(4));
      // columns at different parallax offsets while they rise (desktop only)
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        tiles.forEach((t) => {
          const c = Number(t.dataset.col);
          t.style.transform = `translateY(${((c - 1) * 60 * Math.min(1, u * 1.5)).toFixed(1)}px) scale(${(1 + 0.03 * u).toFixed(4)})`;
        });
      } else {
        tiles.forEach((t) => {
          t.style.transform = "";
        });
      }
    };
    if (prefersReducedMotion()) return set(1);
    // the unfurl runs from the floor's arrival to the hard cut into the bar (X5): the floor sticks for that last
    // screen, so it is never a still picture on camera
    const st = ScrollTrigger.create({
      trigger: root.current!,
      start: "top bottom",
      endTrigger: "#load",
      end: "top top",
      onUpdate: (s) => set(s.progress),
      onRefresh: (s) => set(s.progress),
    });
    set(st.progress);
    return () => st.kill();
  }, []);

  return (
    <section ref={root} id="floor" data-section="The floor" className="relative bg-bg px-4 sm:px-8 md:px-[64px] pt-8 pb-10 md:pb-[72px] md:pt-[120px]" data-record-time={1.8} data-record-label="floor">
      {/* Header matching CoachRows ('Coaches. No ego.') style and text size */}
      <div className="rule-b flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 md:pb-6 mb-5 md:mb-8">
        <div>
          <p className="mono-s text-muted text-[11px] sm:text-[12px] md:text-[13px] uppercase tracking-wider mb-1">
            THE FLOOR · 2,400 SQ FT
          </p>
          <h2 className="stamp text-[44px] sm:text-[64px] md:text-[88px] leading-[0.9]">
            The
            <br />
            <span className="text-muted">floor.</span>
          </h2>
        </div>
        <div className="sm:text-right pb-1">
          <p className="max-w-[340px] text-[14px] md:text-[18px] leading-[1.45] text-fg/80">{floor.sub}</p>
          <div className="mt-1.5 flex flex-wrap sm:justify-end items-center gap-x-2 text-[11px] sm:text-[12px] font-mono text-[#ff1a1a] font-bold">
            <span>2,400 SQ FT</span>
            <span className="text-white/30">•</span>
            <span>6 ZONES</span>
          </div>
          <p className="mono-s text-muted text-[10.5px] sm:text-[12px] mt-0.5">Mon–Sat 08:00–22:00 · Hampankatta, Mangaluru</p>
        </div>
      </div>

      <div className="floor-persp w-full" style={{ perspective: "1600px", perspectiveOrigin: "70% 20%" }}>
          <div
            ref={grid}
            className="floor-grid floor-grid-3d grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 md:gap-[20px] w-full max-w-[820px]"
          >
            {floor.zones.map((z, i) => (
              <figure key={z.name} className="floor-tile" data-col={i % 3}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={z.img} alt={z.name} className="block aspect-[4/3] md:aspect-square w-full object-cover" />
                <figcaption className="flex h-[42px] sm:h-[48px] md:h-[56px] items-center justify-between border-x border-b md:border-x-2 md:border-b-2 border-[var(--rule)] bg-[#161514] px-2.5 sm:px-3 md:px-4">
                  <span className="mono-s text-[11px] sm:text-[12.5px] md:text-[14px] font-bold text-white uppercase tracking-wider truncate">
                    {z.name}
                  </span>
                  <span className="flex items-baseline gap-1 md:gap-1.5 shrink-0 pl-1">
                    <span className="stamp-n text-[16px] sm:text-[19px] md:text-[24px] font-black text-white leading-none">
                      {/[0-9]/.test(z.n) ? <Odo text={z.n} start="top 32%" delay={i * 0.08} duration={1.1} /> : z.n}
                    </span>
                    <span className="mono-s text-[9px] sm:text-[10px] md:text-[11px] font-bold text-white/70 uppercase">
                      {z.unit}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

    </section>
  );
}
