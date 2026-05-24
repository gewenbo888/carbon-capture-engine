"use client";

import { useEffect, useState } from "react";
import { RECURSION_LAYERS } from "./content";
import { T, useLang } from "./lang";

/**
 * The recursive engine. The same carbon-move — capture carbon from the air, hold it
 * in a more stable store, and keep the books balanced — re-emerges at every layer,
 * from a single leaf fixing one molecule to a civilization deliberately holding a
 * whole planet's metabolism steady. A rising signal lights each layer in turn. The
 * claim: carbon management is not many things. It is one act, iterated up the scales.
 */
export default function CarbonRecursionSim() {
  const { lang } = useLang();
  const n = RECURSION_LAYERS.length;
  const [step, setStep] = useState(n);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => setStep((s) => (s + 1) % (n + 1)), 850);
    return () => clearInterval(id);
  }, [play, n]);

  return (
    <div className="holo rounded-2xl p-5 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="label-mono">{lang === "zh" ? "递归碳引擎" : "recursive carbon engine"}</div>
          <h3 className={`mt-1 display text-2xl text-azure-300 ${lang === "zh" ? "zh" : ""}`}>
            <T v={{ en: "One move, every scale", zh: "同一个动作，每一种尺度" }} />
          </h3>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPlay((p) => !p)} className="rounded-full border border-azure-500/40 px-3.5 py-1.5 mono text-[0.62rem] uppercase tracking-wider text-azure-300 transition hover:border-azure-400">
            {play ? (lang === "zh" ? "暂停" : "pause") : (lang === "zh" ? "运行模拟" : "run sim")}
          </button>
          <button onClick={() => { setPlay(false); setStep((s) => (s >= n ? 1 : s + 1)); }} className="rounded-full border border-emerald-500/30 px-3.5 py-1.5 mono text-[0.62rem] uppercase tracking-wider text-emerald-300 transition hover:border-emerald-400">
            {lang === "zh" ? "单步 ▸" : "step ▸"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-2.5">
        {RECURSION_LAYERS.map((l, i) => {
          const lit = i < step;
          const cur = i === step - 1;
          return (
            <div
              key={l.k}
              className="grid grid-cols-[150px_1fr] items-center gap-3 rounded-lg border px-3 py-2.5 transition-all duration-500 sm:grid-cols-[210px_1fr_1.6fr]"
              style={{
                borderColor: lit ? l.color + "66" : "rgba(169,222,248,0.08)",
                background: cur ? l.color + "16" : lit ? "rgba(169,222,248,0.03)" : "transparent",
                opacity: lit ? 1 : 0.32,
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="mono text-[0.62rem] text-ghost-300">{String(i + 1).padStart(2, "0")}</span>
                <span className="h-2.5 w-2.5 shrink-0 rounded-full transition" style={{ background: lit ? l.color : "transparent", border: `2px solid ${l.color}`, boxShadow: cur ? `0 0 14px ${l.color}` : "none" }} />
                <span className={`display text-sm ${lang === "zh" ? "zh" : ""}`} style={{ color: lit ? l.color : "#566472" }}><T v={l.name} /></span>
              </div>
              <div className="mono text-[0.66rem] text-ghost-200"><T v={l.scale} /></div>
              <div className="text-sm leading-snug text-ghost-200">
                <span className="text-ghost-300">{lang === "zh" ? "碳在此：" : "carbon here: "}</span><T v={l.move} />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-ghost-300">
        <T v={{
          en: "Run it bottom to top. At each layer the carbon store changes — a sugar molecule, a tree's wood, a forest's soil, the planet's limestone, a farmer's field, a coal seam set alight, a priced tonne, a capture plant, an AI-managed Earth, a sealed habitat, a deliberately stewarded world — but the move is identical: pull carbon from where it destabilizes, hold it where it is stable, and keep the books balanced. Carbon management is not eleven things. It is one act, recursing from a single leaf in the sun all the way up to a civilization that holds a planet's metabolism steady on purpose.",
          zh: "从下往上运行它。在每一层，碳的储存都在变化——一个糖分子、一棵树的木质、一片森林的土壤、行星的石灰岩、一个农人的田、一道被点燃的煤层、一吨被定价的碳、一座捕获工厂、一个被 AI 管理的地球、一个密封的栖息地、一个被刻意守护的世界——但那个动作始终如一：把碳从它致乱之处拉出，把它存放在它稳定之处，并让账目保持平衡。碳管理，不是十一样东西。它是同一桩行为，从阳光下的一片叶子，一路递归到一个有意地稳住一颗行星之新陈代谢的文明。",
        }} />
      </p>
    </div>
  );
}
