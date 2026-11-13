"use client";

// House rules (layout SY04 manifesto, restyled as five numbered rules in black expanded caps on iron).
// Motion M90 (Round 3): two blocks (chalk, then red 0.14 s behind) sweep across each line and reveal it.
// The curtain blocks are in the markup now, parked off (scaleX 0), so ?static=1 shows every rule.
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { onPlateLifting } from "@/site/lib/plate";
import { rules } from "@/site/content";

export default function HouseRules() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = root.current;
    if (!section) return;

    const lines = Array.from(section.querySelectorAll<HTMLElement>(".curtain-line"));
    const ctx = gsap.context(() => {
      lines.forEach((line) => {
        const word = line.querySelector<HTMLElement>(".stamp")!;
        const a = line.querySelector<HTMLElement>(".curtain-a")!;
        const b = line.querySelector<HTMLElement>(".curtain-b")!;

        // Initial hidden state for animation
        gsap.set(word, { opacity: 0 });
        gsap.set([a, b], { scaleX: 0, transformOrigin: "0% 50%" });

        const tl = gsap.timeline({ paused: true });
        // two blocks sweep in from the left (chalk, then red 0.14 s behind), the words appear under them,
        // then both sweep off to the right
        tl.fromTo(a, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.34, ease: "power3.in" }, 0)
          .fromTo(b, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.34, ease: "power3.in" }, 0.14)
          .set(word, { opacity: 1 }, 0.48)
          .set([a, b], { transformOrigin: "100% 50%" }, 0.48)
          .to(a, { scaleX: 0, duration: 0.42, ease: "expo.out" }, 0.48)
          .to(b, { scaleX: 0, duration: 0.42, ease: "expo.out" }, 0.62);

        ScrollTrigger.create({
          trigger: line,
          start: "top 85%",
          onEnter: () => tl.restart(),
          onEnterBack: () => tl.restart(),
        });
      });
    }, root);

    // Refresh ScrollTrigger once the plate lifts and layout settles
    const unsub = onPlateLifting(() => {
      setTimeout(() => ScrollTrigger.refresh(), 150);
    });

    return () => {
      unsub();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="rules" data-section="House rules" className="relative bg-bg px-4 sm:px-8 md:px-[64px] py-16 md:pb-[120px] md:pt-[140px]" data-record-time={2.0} data-record-label="rules">
      <div className="rule-b mb-8 md:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 md:pb-5">
        <p className="mono-s text-muted">{rules.label}</p>
        <p className="mono-s text-muted text-[11px] sm:text-[13px]">Posted by the platforms · read before you lift</p>
      </div>
      <ol>
        {rules.items.map((r, i) => (
          <li key={r} className="rule-b grid grid-cols-[44px_1fr] md:grid-cols-[120px_1fr] items-center py-4 md:py-5">
            <span className="mono text-[18px] md:text-[22px] text-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="curtain-line relative inline-block justify-self-start max-w-full">
              <span className="stamp block text-[clamp(28px,7.5vw,104px)] leading-[0.9]">{r}</span>
              <span aria-hidden className="curtain curtain-a pointer-events-none absolute inset-0 z-10 origin-left scale-x-0 bg-[#ece9e2]" />
              <span aria-hidden className="curtain curtain-b pointer-events-none absolute inset-0 z-20 origin-left scale-x-0 bg-[#ff1a1a]" />
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
