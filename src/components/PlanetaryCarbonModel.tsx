"use client";

import { T, useLang } from "./lang";
import { CAPACITIES } from "./content";

const SERIES = [
  { key: "natural" as const, label: { en: "Pre-industrial", zh: "工业化前" }, color: "#2bd48b" },
  { key: "industrial" as const, label: { en: "Industrial today", zh: "今日工业" }, color: "#f5923c" },
  { key: "managed" as const, label: { en: "Managed planet", zh: "被管理的行星" }, color: "#37b6f6" },
];

export default function PlanetaryCarbonModel() {
  const { lang } = useLang();
  return (
    <div className="holo rounded-2xl p-5 md:p-8">
      {/* the formula */}
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-center">
        <span className="display text-xl text-ghost-50 md:text-2xl">{lang === "zh" ? "行星碳稳定性" : "Planetary Carbon Stability"}</span>
        <span className="display text-xl text-azure-400 md:text-2xl">=</span>
        {CAPACITIES.map((c, i) => (
          <span key={c.sym} className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-md border border-azure-500/30 bg-ink-900 mono text-azure-300">{c.sym}</span>
            {i < CAPACITIES.length - 1 && <span className="azure-text display text-lg">+</span>}
          </span>
        ))}
      </div>
      <p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-ghost-300">
        <T v={{
          en: "A working definition: the carbon stability of any system — a habitat, a nation, a planet — is not any one term but the sum of eight: how steady its atmospheric balance, how clean its energy, how much its biology absorbs, how well its industry manages emissions, how intelligently it coordinates the whole, how much it stores in rock, how resilient its ecosystems remain, and how far ahead it plans. For four billion years the first terms ran on their own; the last did not exist. This moment is a species supplying the missing ones.",
          zh: "一个可操作的定义：任何系统——一个栖息地、一个国家、一颗行星——的碳稳定性，不在于任何单一项，而在于八项之和：它的大气平衡多么稳定、它的能源多么清洁、它的生物吸收多少、它的工业多么好地管理排放、它多么智慧地协调全局、它在岩石中储存多少、它的生态系统多么有韧性，以及它把计划做到多远。有四十亿年，前面那些项自行运转；后面那些则并不存在。这一刻，正是一个物种，在供应那些缺失的项。",
        }} />
      </p>

      <div className="mt-7 h-px rule-azure opacity-50" />

      {/* legend */}
      <div className="mt-6 mb-4 flex flex-wrap justify-center gap-5">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-2 text-sm text-ghost-200">
            <span className="h-3 w-3 rounded-sm" style={{ background: s.color }} /><T v={s.label} />
          </span>
        ))}
      </div>

      {/* grouped capacity bars */}
      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {CAPACITIES.map((c) => (
          <div key={c.sym}>
            <div className="flex items-baseline justify-between gap-3">
              <span className={`text-sm text-ghost-100 ${lang === "zh" ? "zh" : "display"}`}>
                <span className="mono mr-2 text-azure-400">{c.sym}</span><T v={c.name} />
              </span>
              <span className="text-[0.68rem] text-ghost-300"><T v={c.gloss} /></span>
            </div>
            <div className="mt-2 space-y-1">
              {SERIES.map((s) => (
                <div key={s.key} className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-700">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${c[s.key]}%`, background: s.color, boxShadow: `0 0 8px ${s.color}66` }} />
                  </div>
                  <span className="mono tnum w-7 text-right text-[0.6rem] text-ghost-300">{c[s.key]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
