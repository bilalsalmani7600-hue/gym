"use client";

// Programmes (layout FT12 stacked pinned card pile, restyled as C12 steel-bezel cards: a 4:3 photo left, a mono
// spec block right). Each card slides up over the last; covered cards sink into a pile. Motion M88 (Round 3) adds
// the 3D tilt-back (rotateX −10°) to the covered cards. ?static=1: the finished pile.
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { programmes } from "@/site/content";

export default function ProgrammePile() {
  const tall = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tall.current;
    const sg = stage.current;
    if (!el || !sg) return;
    const cards = Array.from(sg.querySelectorAll<HTMLElement>("[data-pile]"));
    const n = cards.length;
    const set = (p: number) => {
      cards.forEach((c, i) => {
        const over = gsap.utils.clamp(0, n - 1 - i, p * (n - 1) - i);
        const y = gsap.utils.clamp(0, 1, i - p * (n - 1)) * 115;
        // M88: a covered card tilts back (rotateX −10°) and sinks in Z, like a plate added to a pile
        const tilt = Math.min(1, over);
        c.style.transform = `translateY(calc(${y.toFixed(2)}% - ${(over * 22).toFixed(1)}px)) translateZ(${(-over * 70).toFixed(1)}px) rotateX(${(-10 * tilt).toFixed(2)}deg)`;
        c.style.filter = `brightness(${(1 - over * 0.25).toFixed(3)})`;
      });
    };
    if (prefersReducedMotion()) return set(1);
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => set(s.progress),
      onRefresh: (s) => set(s.progress),
    });
    set(st.progress);
    return () => st.kill();
  }, []);

  return (
    <section id="programmes" data-section="Programmes" className="relative z-[2] bg-bg shadow-[0_-30px_60px_rgba(0,0,0,0.6)]" data-record-time={1.8} data-record-label="programmes: arrive">
      <div ref={tall} className="pin-outer relative h-[calc(100svh+350vh)]">
        <div aria-hidden className="rec-stop pointer-events-none absolute left-0 top-[350vh] h-px w-px" data-record-time={3.2} data-record-label="programmes: pile" />
        <div className="pin-stage flex flex-col px-4 sm:px-8 md:px-[64px] pt-[76px] md:pt-[104px]">
          <div className="rule-b flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 md:pb-5">
            <h2 className="stamp text-[36px] sm:text-[48px] md:text-[64px] leading-tight">{programmes.title.join(" ")}</h2>
            <p className="mono-s pb-1 text-muted text-[11px] sm:text-[13px]">{programmes.tag}</p>
          </div>
          <div ref={stage} className="relative mx-auto mt-6 md:mt-[88px] h-[520px] sm:h-[490px] md:h-[482px] w-full max-w-[1120px]" style={{ perspective: "1600px", perspectiveOrigin: "50% 0%", transformStyle: "preserve-3d" }}>
            {programmes.items.map((c, k) => (
              <article
                key={c.name}
                data-pile
                className="bezel absolute inset-0 origin-top will-change-transform"
                style={{ zIndex: k + 1 }}
              >
                <div className="bezel-inner flex flex-col md:grid h-full md:grid-cols-[600px_1fr]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt={`${c.name} programme`} className="h-[180px] sm:h-[220px] md:h-[450px] w-full md:w-[600px] object-cover" />
                  <div className="flex flex-1 flex-col justify-between p-4 sm:p-6 md:p-9">
                    <div>
                      <p className="mono-s text-muted text-[11px] sm:text-[13px]">
                        Service {String(k + 1).padStart(2, "0")} / {String(programmes.items.length).padStart(2, "0")}
                      </p>
                      <h3 className="stamp mt-1.5 md:mt-3 text-[22px] sm:text-[28px] md:text-[36px] leading-[1.05]">{c.name}</h3>
                      <p className="mt-1.5 md:mt-3 text-[13px] sm:text-[15px] md:text-[17px] leading-[1.4] text-fg/80">{c.note}</p>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-4 md:gap-x-6 gap-y-2 md:gap-y-4 border-t-2 border-[var(--rule)] pt-3 md:pt-5 mt-2">
                      <div>
                        <dt className="mono-s text-muted text-[10px] sm:text-[12px]">Schedule</dt>
                        <dd className="stamp-n mt-0.5 md:mt-1 text-[16px] sm:text-[20px] md:text-[22px]">{c.weeks}</dd>
                      </div>
                      <div>
                        <dt className="mono-s text-muted text-[10px] sm:text-[12px]">Access</dt>
                        <dd className="stamp-n mt-0.5 md:mt-1 text-[16px] sm:text-[20px] md:text-[22px]">{c.sessions}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="mono-s text-muted text-[10px] sm:text-[12px]">Focus</dt>
                        <dd className="stamp-n mt-0.5 md:mt-1 text-[14px] sm:text-[18px] md:text-[20px] truncate">{c.focus}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <span aria-hidden className="glint" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
