"use client";

import { T, useLang } from "./lang";
import { ENERGY_SOURCES, EnergySource } from "./content";
import { useState, useEffect, useRef, useCallback } from "react";

/* ── types ─────────────────────────────────────────────────── */
interface InterpolatedSource extends EnergySource {
  currentShare: number;
}

/* ── helpers ────────────────────────────────────────────────── */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function getInterpolated(t: number): InterpolatedSource[] {
  return ENERGY_SOURCES.map((s) => ({
    ...s,
    currentShare: lerp(s.share2024, s.share2050, t),
  }));
}

function avgIntensity(sources: InterpolatedSource[]): number {
  const totalShare = sources.reduce((sum, s) => sum + s.currentShare, 0);
  if (totalShare === 0) return 0;
  return sources.reduce((sum, s) => sum + s.currentShare * s.intensity, 0) / totalShare;
}

function intensityColor(val: number, baseline: number): string {
  // ember when high, azure when low
  const ratio = Math.max(0, Math.min(1, val / baseline));
  if (ratio > 0.7) return "#f5923c";
  if (ratio > 0.45) return "#ffb368";
  if (ratio > 0.25) return "#37b6f6";
  return "#2bd48b";
}

/* ── intensity dirtiness ladder entry ──────────────────────── */
function IntensityRow({ source, lang }: { source: EnergySource; lang: "en" | "zh" }) {
  const [hovered, setHovered] = useState(false);
  const maxIntensity = 820;
  const pct = Math.min(100, (source.intensity / maxIntensity) * 100);

  return (
    <div
      className="relative group cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="listitem"
      aria-label={`${source.name[lang]}: ${source.intensity} gCO₂/kWh`}
    >
      <div className="flex items-center gap-2 py-1">
        <span
          className="label-mono text-right shrink-0"
          style={{ color: source.accent, width: "5.5rem", fontSize: "0.7rem" }}
        >
          {source.name[lang]}
        </span>
        <div className="flex-1 relative h-4 rounded overflow-hidden"
          style={{ background: "rgba(19,32,47,0.7)" }}>
          <div
            className="h-full rounded transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: source.accent,
              opacity: 0.85,
            }}
          />
        </div>
        <span className="mono tnum shrink-0 text-ghost-300" style={{ fontSize: "0.68rem", width: "3.5rem", textAlign: "right" }}>
          {source.intensity}
        </span>
      </div>
      {hovered && (
        <div
          className="absolute z-20 left-24 -top-1 rounded-lg px-3 py-2 pointer-events-none shadow-xl border border-azure-500/20"
          style={{
            background: "rgba(7,14,24,0.97)",
            minWidth: "13rem",
            maxWidth: "18rem",
          }}
        >
          <p className="label-mono text-azure-300 mb-1" style={{ fontSize: "0.7rem" }}>
            {source.name[lang]} · {source.intensity} gCO₂/kWh
          </p>
          <p className="text-ghost-300" style={{ fontSize: "0.68rem", lineHeight: 1.5 }}>
            {source.gloss[lang]}
          </p>
        </div>
      )}
    </div>
  );
}

/* ── main component ─────────────────────────────────────────── */
export default function EnergyTransition() {
  const { lang } = useLang();
  const [t, setT] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const animate = useCallback((ts: number) => {
    if (lastTimeRef.current === null) {
      lastTimeRef.current = ts;
    }
    const dt = (ts - lastTimeRef.current) / 1000;
    lastTimeRef.current = ts;
    setT((prev) => {
      const next = prev + dt * 0.18; // full sweep ~5.5 seconds
      if (next >= 1) {
        setPlaying(false);
        return 1;
      }
      return next;
    });
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (playing) {
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(animate);
    } else {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [playing, animate]);

  function togglePlay() {
    if (t >= 1) {
      setT(0);
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  }

  const sources = getInterpolated(t);
  const totalShare = sources.reduce((sum, s) => sum + s.currentShare, 0);

  // baseline = 2024 intensity
  const baseline2024Sources = getInterpolated(0);
  const baseline = avgIntensity(baseline2024Sources);
  const current = avgIntensity(sources);
  const reduction = Math.round(((baseline - current) / baseline) * 100);
  const iColor = intensityColor(current, baseline);

  const year = Math.round(lerp(2024, 2050, t));

  return (
    <div className="holo rounded-2xl p-5 md:p-7 space-y-7">

      {/* ── header ─────────────────────────────────────────── */}
      <div className="space-y-1">
        <p className="label-mono azure-text tracking-widest" style={{ fontSize: "0.68rem" }}>
          <T v={{ en: "SECTION 06 · ENERGY SYSTEMS", zh: "第六章 · 能源系统" }} />
        </p>
        <h2 className="display" style={{ fontSize: "clamp(1.35rem, 3.5vw, 2rem)", lineHeight: 1.15 }}>
          <T v={{ en: "Energy Transition", zh: "能源转型" }} />
        </h2>
        <p className="text-ghost-300" style={{ fontSize: "0.82rem", maxWidth: "56ch", lineHeight: 1.6 }}>
          <T v={{
            en: "Drag the slider to morph 2024's energy mix toward 2050 — watch fossil share collapse and carbon intensity fall.",
            zh: "拖动滑块，把2024年的能源结构变形为2050年的样貌——看化石燃料份额萎缩，碳强度下跌。",
          }} />
        </p>
      </div>

      {/* ── timeline slider ────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="mono tnum text-azure-300" style={{ fontSize: "1.15rem", fontWeight: 700 }}>
            {year}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="label-mono px-3 py-1 rounded-full border transition"
              style={{
                fontSize: "0.68rem",
                borderColor: "rgba(55,182,246,0.35)",
                color: playing ? "#37b6f6" : "#8798a6",
              }}
              aria-label={playing ? "Pause animation" : "Play animation"}
            >
              {playing
                ? <T v={{ en: "⏸ Pause", zh: "⏸ 暂停" }} />
                : <T v={{ en: "▶ Play", zh: "▶ 播放" }} />
              }
            </button>
            <button
              onClick={() => { setPlaying(false); setT(0); }}
              className="label-mono px-3 py-1 rounded-full border transition text-ghost-300 hover:text-ghost-100"
              style={{ fontSize: "0.68rem", borderColor: "rgba(135,152,166,0.2)" }}
            >
              2024
            </button>
            <button
              onClick={() => { setPlaying(false); setT(1); }}
              className="label-mono px-3 py-1 rounded-full border transition text-ghost-300 hover:text-ghost-100"
              style={{ fontSize: "0.68rem", borderColor: "rgba(135,152,166,0.2)" }}
            >
              2050
            </button>
          </div>
        </div>
        <div className="relative flex items-center">
          <span className="label-mono text-ghost-300 mr-3 shrink-0" style={{ fontSize: "0.65rem" }}>2024</span>
          <input
            type="range"
            min={0}
            max={1000}
            value={Math.round(t * 1000)}
            onChange={(e) => {
              setPlaying(false);
              setT(Number(e.target.value) / 1000);
            }}
            className="flex-1"
            style={{ accentColor: "#37b6f6", height: "4px" }}
            aria-label="Transition progress"
          />
          <span className="label-mono text-ghost-300 ml-3 shrink-0" style={{ fontSize: "0.65rem" }}>2050</span>
        </div>
      </div>

      {/* ── carbon intensity readout ───────────────────────── */}
      <div
        className="rounded-xl p-4 md:p-5 border"
        style={{ borderColor: `${iColor}33`, background: `${iColor}0d` }}
      >
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <p className="label-mono mb-1" style={{ fontSize: "0.65rem", color: "#8798a6" }}>
              <T v={{ en: "Average carbon intensity / 平均碳强度", zh: "平均碳强度 / Average carbon intensity" }} />
            </p>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span
                className="mono tnum"
                style={{
                  fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
                  fontWeight: 700,
                  lineHeight: 1,
                  color: iColor,
                  transition: "color 0.4s",
                  letterSpacing: "-0.02em",
                }}
              >
                {Math.round(current)}
              </span>
              <span className="mono" style={{ fontSize: "0.9rem", color: "#8798a6" }}>
                gCO₂/kWh
              </span>
              {reduction > 0 && (
                <span
                  className="mono tnum px-2 py-0.5 rounded-full"
                  style={{
                    fontSize: "0.75rem",
                    color: "#2bd48b",
                    background: "rgba(43,212,139,0.12)",
                    border: "1px solid rgba(43,212,139,0.25)",
                  }}
                >
                  −{reduction}% <T v={{ en: "vs 2024", zh: "较2024年" }} />
                </span>
              )}
            </div>
            <p className="mt-2" style={{ fontSize: "0.72rem", color: "#8798a6", maxWidth: "44ch", lineHeight: 1.5 }}>
              <T v={{
                en: `Baseline (2024): ${Math.round(baseline)} gCO₂/kWh. A carbon-negative mix would be the first in history rewarded for putting carbon back.`,
                zh: `基准（2024年）：${Math.round(baseline)} gCO₂/kWh。负碳能源组合，将是历史上第一个因把碳放回去而获得报酬的。`,
              }} />
            </p>
          </div>

          {/* mini intensity gradient bar */}
          <div className="shrink-0 flex flex-col gap-1">
            <div
              className="rounded-full overflow-hidden"
              style={{
                width: "7rem",
                height: "0.45rem",
                background: "linear-gradient(to right, #2bd48b, #37b6f6, #ffb368, #f5923c)",
              }}
            >
              <div
                className="h-full w-2 rounded-full"
                style={{
                  background: "#fff",
                  marginLeft: `calc(${Math.max(0, Math.min(96, ((current - 50) / (baseline - 50)) * 96))}% )`,
                  transition: "margin-left 0.3s",
                }}
              />
            </div>
            <div className="flex justify-between label-mono" style={{ fontSize: "0.58rem", color: "#8798a6" }}>
              <span><T v={{ en: "clean", zh: "清洁" }} /></span>
              <span><T v={{ en: "dirty", zh: "高碳" }} /></span>
            </div>
          </div>
        </div>
      </div>

      {/* ── stacked energy mix bar ─────────────────────────── */}
      <div className="space-y-3">
        <p className="label-mono text-ghost-300 tracking-widest" style={{ fontSize: "0.65rem" }}>
          <T v={{ en: "PRIMARY ENERGY MIX", zh: "一次能源结构" }} />
        </p>

        {/* horizontal stacked bar */}
        <div
          className="flex w-full overflow-hidden rounded-lg"
          style={{ height: "2.2rem" }}
          role="img"
          aria-label={lang === "en" ? "Energy mix stacked bar" : "能源结构堆叠条形图"}
        >
          {sources.map((s) => {
            const pct = (s.currentShare / totalShare) * 100;
            return (
              <div
                key={s.key}
                className="relative flex items-center justify-center overflow-hidden transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: s.accent,
                  opacity: 0.88,
                }}
                title={`${s.name[lang]}: ${pct.toFixed(1)}%`}
              >
                {pct > 7 && (
                  <span
                    className="mono tnum text-white font-bold select-none"
                    style={{
                      fontSize: "0.62rem",
                      textShadow: "0 1px 3px rgba(0,0,0,0.7)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {pct.toFixed(0)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* segment legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1.5">
          {sources.map((s) => {
            const pct = (s.currentShare / totalShare) * 100;
            return (
              <div key={s.key} className="flex items-center gap-1.5">
                <span
                  className="shrink-0 rounded-sm"
                  style={{ width: "0.55rem", height: "0.55rem", background: s.accent, display: "inline-block" }}
                />
                <span className="label-mono truncate" style={{ fontSize: "0.67rem", color: "#8798a6" }}>
                  {s.name[lang]}
                </span>
                <span
                  className="mono tnum ml-auto shrink-0"
                  style={{ fontSize: "0.67rem", color: s.accent }}
                >
                  {pct.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── dirtiness ladder ───────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <p className="label-mono text-ghost-300 tracking-widest" style={{ fontSize: "0.65rem" }}>
            <T v={{ en: "LIFECYCLE CARBON INTENSITY LADDER", zh: "全生命周期碳强度阶梯" }} />
          </p>
          <span className="label-mono text-ghost-300" style={{ fontSize: "0.6rem" }}>
            gCO₂/kWh
          </span>
        </div>
        <div role="list" className="space-y-0.5">
          {[...ENERGY_SOURCES]
            .sort((a, b) => b.intensity - a.intensity)
            .map((s) => (
              <IntensityRow key={s.key} source={s} lang={lang} />
            ))}
        </div>
        <p className="label-mono text-ghost-300" style={{ fontSize: "0.6rem", lineHeight: 1.5 }}>
          <T v={{
            en: "Hover for details. Lifecycle figures include construction, fuel extraction, and operations.",
            zh: "悬停查看详情。全生命周期数据含建设、燃料开采与运营阶段。",
          }} />
        </p>
      </div>

      {/* ── per-source transition bars ──────────────────────── */}
      <div className="space-y-2">
        <p className="label-mono text-ghost-300 tracking-widest" style={{ fontSize: "0.65rem" }}>
          <T v={{ en: "SOURCE-BY-SOURCE SHIFT", zh: "逐类能源份额变化" }} />
        </p>
        <div className="space-y-2">
          {sources.map((s) => {
            const current2050 = s.share2050;
            const maxShare = Math.max(...ENERGY_SOURCES.map((x) => Math.max(x.share2024, x.share2050)));
            const pctCurrent = (s.currentShare / maxShare) * 100;
            const isFossil = ["coal", "oil", "gas"].includes(s.key);
            return (
              <div key={s.key} className="flex items-center gap-3">
                <span
                  className="label-mono shrink-0 text-right"
                  style={{ color: s.accent, width: "5.5rem", fontSize: "0.68rem" }}
                >
                  {s.name[lang]}
                </span>
                <div
                  className="flex-1 relative rounded overflow-hidden"
                  style={{ height: "1.1rem", background: "rgba(19,32,47,0.7)" }}
                >
                  {/* ghost bar showing 2024 */}
                  <div
                    className="absolute top-0 left-0 h-full rounded opacity-20"
                    style={{ width: `${(s.share2024 / maxShare) * 100}%`, background: s.accent }}
                  />
                  {/* animated bar */}
                  <div
                    className="absolute top-0 left-0 h-full rounded transition-all duration-500"
                    style={{ width: `${pctCurrent}%`, background: s.accent, opacity: 0.85 }}
                  />
                  {/* direction arrow indicator */}
                  <div
                    className="absolute right-2 top-0 h-full flex items-center"
                    style={{ fontSize: "0.58rem", color: isFossil ? "#f5923c" : "#2bd48b" }}
                  >
                    {isFossil ? "▼" : "▲"}
                  </div>
                </div>
                <div className="shrink-0 text-right" style={{ width: "3.2rem" }}>
                  <span className="mono tnum" style={{ fontSize: "0.72rem", color: s.accent }}>
                    {s.currentShare.toFixed(1)}%
                  </span>
                </div>
                <div className="shrink-0" style={{ width: "2.6rem", textAlign: "right" }}>
                  <span className="mono tnum text-ghost-300" style={{ fontSize: "0.6rem" }}>
                    →{current2050}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="label-mono text-ghost-300" style={{ fontSize: "0.6rem" }}>
          <T v={{
            en: "Faded bar = 2024 baseline. Solid bar = current interpolated share. Arrow = direction of travel.",
            zh: "浅色条 = 2024年基准。实色条 = 当前插值份额。箭头 = 变化方向。",
          }} />
        </p>
      </div>

      {/* ── takeaway ───────────────────────────────────────── */}
      <div
        className="rounded-xl p-4 md:p-5 border border-azure-500/15 rule-azure"
        style={{ background: "rgba(55,182,246,0.04)" }}
      >
        <p className="text-ghost-300" style={{ fontSize: "0.8rem", lineHeight: 1.7, maxWidth: "62ch" }}>
          <T v={{
            en: "Almost the entire carbon problem is, underneath, an energy problem. Civilization runs on burning — and burning is how we made carbon a pollutant. Rebuilding the largest machine humanity has ever operated so it delivers the same power without the smoke collapses carbon intensity. A carbon-negative economy would be the first in history rewarded for putting carbon back.",
            zh: "几乎整个碳问题，在底下，都是一个能源问题。文明靠燃烧运转——而燃烧，正是我们把碳变成污染物的方式。重建人类操作过的最大机器，使其输出同样的动力却不冒烟，便能令碳强度崩塌。负碳经济，将是历史上第一个因把碳放回去而获得报酬的经济。",
          }} />
        </p>
      </div>
    </div>
  );
}
