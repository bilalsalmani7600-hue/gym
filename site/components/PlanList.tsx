"use client";

// Membership (layout PR14 radio plan list, restyled on the chalk band: ruled plan rows with square radios on the
// left, a total card with a big ₹ price on the right). Motion M133 (Round 3): the selected plan steps down the list
// in ?record=1 and the total's digits slide to the new price. ?static=1: Monthly selected.
import { useRef, useState } from "react";
import { plans } from "@/site/content";
import RollText from "./RollText";
import SwapText from "./SwapText";
import Odo from "./Odo";
import Magnet from "./Magnet";

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export default function PlanList() {
  const [sel, setSel] = useState(plans.selected);
  const plan = plans.items.find((p) => p.id === sel)!;
  const root = useRef<HTMLElement>(null);

  return (
    <section ref={root} id="plans" data-section="Membership" className="band-chalk relative z-[30] px-4 sm:px-8 md:px-[64px] py-16 md:pb-[110px] md:pt-[120px]" data-record-time={2.0} data-record-hold={0.6} data-record-label="plans">
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_440px] gap-8 md:gap-[64px]">
        <div>
          <div className="rule-b pb-4 md:pb-6">
            <h2 className="stamp text-[44px] sm:text-[60px] md:text-[80px] leading-[0.9]">
              {plans.title[0]}
              <br />
              {plans.title[1]}
            </h2>
          </div>
          <div role="radiogroup" aria-label="Membership plans">
            {plans.items.map((p) => {
              const on = p.id === sel;
              return (
                <button
                  key={p.id}
                  role="radio"
                  aria-checked={on}
                  onClick={() => setSel(p.id)}
                  data-press
                  data-click
                  data-plan={p.id}
                  className={`plan-row grid min-h-[80px] md:h-[92px] transition-colors duration-300 w-full grid-cols-[36px_1fr_auto] md:grid-cols-[56px_1fr_auto] items-center gap-2 border-b-2 border-[var(--rule)] text-left py-3 md:py-0 ${on ? "is-on" : ""}`}
                >
                  <span className={`grid h-[22px] w-[22px] md:h-[26px] md:w-[26px] place-items-center border-2 border-[var(--chalk-ink)]`}>
                    <span className={`h-[10px] w-[10px] md:h-[12px] md:w-[12px] transition-transform duration-300 ${on ? "scale-100 bg-[var(--plate-blue)]" : "scale-0 bg-[var(--plate-blue)]"}`} />
                  </span>
                  <span className="pr-2">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className="stamp-n block text-[20px] sm:text-[24px] md:text-[30px]">{p.name}</span>
                      {p.badge && (
                        <span className="mono-s text-[9px] sm:text-[10px] px-2 py-0.5 rounded uppercase tracking-wider bg-black/10 border border-black/15 text-[#33312e] font-bold">
                          {p.badge}
                        </span>
                      )}
                    </span>
                    <span className="mono-s mt-0.5 md:mt-1 block text-[#5b5850] text-[11px] sm:text-[13px]">{p.note}</span>
                  </span>
                  <span className="text-right shrink-0">
                    <span className="stamp-n block text-[20px] sm:text-[24px] md:text-[30px] tabular-nums">
                      <Odo text={inr(p.price)} start="top 85%" duration={1.2} />
                    </span>
                    <span className="mono-s block text-[#5b5850] text-[11px] sm:text-[13px]">{p.per}</span>
                  </span>
                </button>
              );
            })}
            <div className="mt-6 border-t border-[var(--rule)] pt-4">
              <p className="mono-s text-[11px] sm:text-[13px] text-[#5b5850] leading-relaxed">
                <span className="font-bold text-[#111110]">Note:</span> {plans.disclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* total card */}
        <aside className="self-start w-full bg-[var(--chalk-ink)] p-6 sm:p-9 text-[var(--text)]">
          <p className="mono-s text-muted">Your plan</p>
          <p className="stamp-n mt-3 text-[34px]">
            <SwapText text={plan.name} />
          </p>
          <div className="mt-8 border-t-2 border-[var(--rule)] pt-6">
            <p className="mono-s text-muted">Total today</p>
            <p className="stamp mt-2 text-[72px] leading-[1] tabular-nums" data-total>
              <RollText text={inr(plan.price)} mode="slide" />
            </p>
            <p className="mono-s mt-1 text-muted">
              <SwapText text={`${plan.per} · no hidden fees`} />
            </p>
          </div>
          <ul className="mono-s mt-8 space-y-3 text-fg/80">
            <li>· Fully air-conditioned, climate-controlled floor</li>
            <li>· Secure storage lockers & clean washrooms</li>
            <li>· Complimentary Wi-Fi & accessible entry</li>
            <li>· Mon–Sat: 06:00–22:00 (Ladies: 12–2 PM)</li>
            <li>· Debit cards & UPI / NFC mobile payments</li>
          </ul>
          <Magnet strength={0.12} className="mt-9 w-full">
            <a href="#timetable" className="ibtn ibtn-blue w-full justify-between" data-hover data-join>
              {plans.cta} <span className="arrow" />
            </a>
          </Magnet>
        </aside>
      </div>
    </section>
  );
}
