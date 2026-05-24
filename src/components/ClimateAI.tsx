"use client";

import { T, useLang } from "./lang";
import { AI_ROLES, AI_LAYERS } from "./content";
import { useEffect, useRef, useState, useCallback } from "react";

/* ─── faux-live metric seeds per role ──────────────────────────────────────── */
type MetricConfig = {
  label: { en: string; zh: string };
  base: number;
  delta: number;
  decimals: number;
  unit: string;
};

const ROLE_METRICS: Record<string, MetricConfig> = {
  mrv: {
    label: { en: "sources tracked", zh: "跟踪源" },
    base: 847231,
    delta: 12,
    decimals: 0,
    unit: "",
  },
  twin: {
    label: { en: "model nodes", zh: "模型节点" },
    base: 4096000,
    delta: 256,
    decimals: 0,
    unit: "",
  },
  forecast: {
    label: { en: "ensemble runs", zh: "集合运行" },
    base: 2048,
    delta: 1,
    decimals: 0,
    unit: "",
  },
  grid: {
    label: { en: "MW balanced", zh: "MW 已平衡" },
    base: 1284,
    delta: 3,
    decimals: 0,
    unit: "",
  },
  materials: {
    label: { en: "candidates screened", zh: "已筛选候选" },
    base: 98432,
    delta: 7,
    decimals: 0,
    unit: "",
  },
  monitor: {
    label: { en: "km² watched", zh: "监测 km²" },
    base: 51200000,
    delta: 0,
    decimals: 0,
    unit: "",
  },
};

/* ─── tiny sparkline ────────────────────────────────────────────────────────── */
function Sparkline({ accent, seed }: { accent: string; seed: number }) {
  const [pts, setPts] = useState<number[]>(() => {
    const arr: number[] = [];
    let v = 50 + ((seed * 17) % 30);
    for (let i = 0; i < 12; i++) {
      v = Math.max(20, Math.min(80, v + ((seed * (i + 3)) % 20) - 10));
      arr.push(v);
    }
    return arr;
  });

  useEffect(() => {
    const id = setInterval(() => {
      setPts((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(15, Math.min(85, last + Math.random() * 16 - 8));
        return [...prev.slice(1), next];
      });
    }, 1200 + seed * 97);
    return () => clearInterval(id);
  }, [seed]);

  const w = 80;
  const h = 28;
  const points = pts
    .map((v, i) => `${(i / (pts.length - 1)) * w},${h - (v / 100) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity={0.75}
      />
      <circle
        cx={(pts.length - 1) / (pts.length - 1) * w}
        cy={h - (pts[pts.length - 1] / 100) * h}
        r="2.5"
        fill={accent}
      />
    </svg>
  );
}

/* ─── autonomy bar ──────────────────────────────────────────────────────────── */
function MeterBar({
  value,
  accent,
  reverse,
}: {
  value: number;
  accent: string;
  reverse?: boolean;
}) {
  const filled = reverse ? 100 - value : value;
  return (
    <div className="relative h-1.5 w-full rounded-full bg-ink-800 overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
        style={{ width: `${filled}%`, backgroundColor: accent }}
      />
    </div>
  );
}

/* ─── main component ────────────────────────────────────────────────────────── */
export default function ClimateAI() {
  const { lang } = useLang();

  /* ── Part A: autonomy ladder state ── */
  const [activeLevel, setActiveLevel] = useState<number>(0);
  const [playing, setPlaying] = useState(false);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPlay = useCallback(() => {
    if (playRef.current) {
      clearInterval(playRef.current);
      playRef.current = null;
    }
    setPlaying(false);
  }, []);

  const startPlay = useCallback(() => {
    setPlaying(true);
    playRef.current = setInterval(() => {
      setActiveLevel((prev) => {
        if (prev >= AI_LAYERS.length - 1) {
          stopPlay();
          return prev;
        }
        return prev + 1;
      });
    }, 900);
  }, [stopPlay]);

  const handlePlayPause = () => {
    if (playing) {
      stopPlay();
    } else {
      if (activeLevel >= AI_LAYERS.length - 1) setActiveLevel(0);
      startPlay();
    }
  };

  const handleReset = () => {
    stopPlay();
    setActiveLevel(0);
  };

  useEffect(() => () => stopPlay(), [stopPlay]);

  /* ── Part B: faux-live metrics ── */
  const [metrics, setMetrics] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    for (const [k, cfg] of Object.entries(ROLE_METRICS)) m[k] = cfg.base;
    return m;
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => {
      setMetrics((prev) => {
        const next = { ...prev };
        for (const [k, cfg] of Object.entries(ROLE_METRICS)) {
          if (cfg.delta > 0) {
            next[k] = prev[k] + Math.floor(Math.random() * cfg.delta * 2);
          }
        }
        return next;
      });
    }, 1500);
    return () => clearInterval(id);
  }, []);

  /* ── derived meters ── */
  const humanPct = Math.round(100 - (activeLevel / (AI_LAYERS.length - 1)) * 95);
  const autonomyPct = Math.round((activeLevel / (AI_LAYERS.length - 1)) * 100);
  const isL5 = activeLevel === AI_LAYERS.length - 1;

  /* ── blink state ── */
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="terminal rounded-2xl p-5 md:p-7 space-y-8 relative overflow-hidden">
      {/* scanline overlay */}
      <div className="scan pointer-events-none absolute inset-0 rounded-2xl z-10" />

      {/* ══════════════ HEADER ══════════════════════════════════════════════════ */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-violet-500/20 pb-4">
        <div>
          <div className="label-mono text-ghost-400 text-xs tracking-widest mb-1">
            <T v={{ en: "SECTION 08 · INTELLIGENCE LAYER", zh: "第 08 节 · 智能层" }} />
          </div>
          <h2 className="display text-2xl md:text-3xl violet-text leading-tight">
            <T v={{ en: "AI & Earth Digital Twin", zh: "AI 与地球数字孪生" }} />
          </h2>
          <p className="text-ghost-300 text-sm mt-1 max-w-2xl">
            <T
              v={{
                en: "You cannot manage what you cannot measure. A mesh of satellites, sensors and models is becoming a planetary nervous system — AI is the layer that turns its flood of data into understanding and action.",
                zh: "你无法管理你无法测量之物。一张卫星、传感器与模型之网，正成为一套行星神经系统——AI，是把它那洪流般的数据转化为理解与行动的那一层。",
              }}
            />
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: "#9a7dfa", opacity: blink ? 1 : 0.2 }}
          />
          <span className="label-mono text-xs text-violet-300 tracking-widest">
            <T v={{ en: "LIVE", zh: "实时" }} />
          </span>
        </div>
      </header>

      {/* ══════════════ PART A — AUTONOMY LADDER ════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="label-mono text-xs text-ghost-400 tracking-widest">
            <T v={{ en: "AI AUTONOMY LADDER", zh: "AI 自主阶梯" }} />
          </span>
          <div className="h-px flex-1 bg-violet-500/20" />
        </div>

        {/* ladder rungs */}
        <div className="grid gap-1.5">
          {AI_LAYERS.map((layer, idx) => {
            const active = idx === activeLevel;
            const lit = idx <= activeLevel;
            const warning = isL5 && idx === AI_LAYERS.length - 1;
            return (
              <button
                key={layer.key}
                onClick={() => { stopPlay(); setActiveLevel(idx); }}
                className={[
                  "group w-full text-left rounded-lg px-3 py-2.5 border transition-all duration-300 cursor-pointer",
                  "grid grid-cols-[2.5rem_1fr_auto] items-center gap-3",
                  active
                    ? "border-opacity-80 bg-ink-800/60"
                    : lit
                    ? "border-opacity-30 bg-ink-900/40"
                    : "border-opacity-10 bg-ink-950/20",
                  warning && active ? "border-amber-500/60 bg-amber-950/20" : "",
                ].join(" ")}
                style={{
                  borderColor: warning && active
                    ? "#f5923c"
                    : lit
                    ? layer.accent
                    : "rgba(100,100,140,0.15)",
                }}
              >
                {/* level badge */}
                <span
                  className="mono text-xs font-bold rounded px-1 py-0.5 text-center"
                  style={{
                    color: lit ? layer.accent : "#4a5568",
                    backgroundColor: lit ? `${layer.accent}18` : "transparent",
                    border: `1px solid ${lit ? layer.accent + "40" : "transparent"}`,
                  }}
                >
                  {layer.level}
                </span>

                {/* name + gloss */}
                <div className="min-w-0">
                  <div
                    className="text-sm font-semibold leading-snug"
                    style={{ color: lit ? layer.accent : "#4a5568" }}
                  >
                    {lang === "zh" ? (
                      <span className="zh">{layer.name.zh}</span>
                    ) : (
                      layer.name.en
                    )}
                    {warning && active && (
                      <span className="ml-2 text-amber-400 text-xs">⚠</span>
                    )}
                  </div>
                  <div
                    className="text-xs mt-0.5 leading-snug"
                    style={{ color: lit ? "#8798a6" : "#2a3340" }}
                  >
                    {lang === "zh" ? (
                      <span className="zh">{layer.gloss.zh}</span>
                    ) : (
                      layer.gloss.en
                    )}
                  </div>
                </div>

                {/* step indicator */}
                {active && (
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: warning ? "#f5923c" : layer.accent,
                      boxShadow: `0 0 6px ${warning ? "#f5923c" : layer.accent}`,
                      opacity: blink ? 1 : 0.4,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* L5 warning */}
        {isL5 && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-xs text-amber-300/90 label-mono">
            <T
              v={{
                en: "⚠  L5 — CLOSED LOOP UNATTENDED · A planetary manager is only as wise as the goal it is given. Specifying the right goal for a living world is harder than specifying a temperature.",
                zh: "⚠  L5 — 无人照看的闭环 · 一个行星的管理者，只与它被赋予的目标一样有智慧。为一个活着的世界指定正确的目标，远比指定一个温度，要困难得多。",
              }}
            />
          </div>
        )}

        {/* playback controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayPause}
            className="label-mono text-xs px-3 py-1.5 rounded border border-violet-500/40 text-violet-300 hover:bg-violet-500/10 transition"
          >
            {playing
              ? (lang === "zh" ? "暂停" : "PAUSE")
              : (lang === "zh" ? "播放阶梯" : "PLAY LADDER")}
          </button>
          <button
            onClick={handleReset}
            className="label-mono text-xs px-3 py-1.5 rounded border border-ghost-600/30 text-ghost-400 hover:bg-ink-800/40 transition"
          >
            {lang === "zh" ? "重置" : "RESET"}
          </button>
          <span className="label-mono text-xs text-ghost-500">
            {lang === "zh" ? "点击任意层级跳转" : "or click any rung to jump"}
          </span>
        </div>

        {/* dual meters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-4 rounded-xl bg-ink-900/40 border border-ghost-700/10">
          {/* human in the loop */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="label-mono text-xs text-azure-300">
                <T v={{ en: "HUMAN IN THE LOOP", zh: "人类在回路中" }} />
              </span>
              <span className="mono tnum text-sm text-azure-400">{humanPct}%</span>
            </div>
            <MeterBar value={humanPct} accent="#37b6f6" />
            <p className="text-ghost-500 text-xs">
              <T
                v={{
                  en: "Human review and override authority — shrinks as AI assumes stewardship.",
                  zh: "人类审查与否决权威——随 AI 承担守护职责而缩减。",
                }}
              />
            </p>
          </div>
          {/* autonomy */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="label-mono text-xs text-violet-300">
                <T v={{ en: "AUTONOMY", zh: "自主性" }} />
              </span>
              <span className="mono tnum text-sm text-violet-400">{autonomyPct}%</span>
            </div>
            <MeterBar value={autonomyPct} accent="#9a7dfa" />
            <p className="text-ghost-500 text-xs">
              <T
                v={{
                  en: "System acts on its own — dispatching capture, adjusting flows, stabilizing sinks.",
                  zh: "系统自行行动——调度捕获、调整流量、稳定碳汇。",
                }}
              />
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════ PART B — PLANETARY CONTROL-ROOM GRID ═══════════════════ */}
      <section className="space-y-4">
        {/* panel header */}
        <div className="grid-bg rounded-xl border border-violet-500/15 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-4 py-3 border-b border-ghost-700/10 bg-ink-900/60">
            <div className="flex items-center gap-3">
              <div>
                <div className="label-mono text-xs text-ghost-500 tracking-widest">
                  <T v={{ en: "PLANETARY DIGITAL TWIN · CONTROL ROOM", zh: "行星数字孪生 · 控制室" }} />
                </div>
                <h3 className="display text-lg violet-text">
                  <T v={{ en: "AI Role Modules", zh: "AI 职能模块" }} />
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#2bd48b", opacity: blink ? 1 : 0.3 }}
              />
              <span className="label-mono text-xs text-emerald-400 tracking-widest">
                <T v={{ en: "● SYSTEMS NOMINAL", zh: "● 系统正常" }} />
              </span>
            </div>
          </div>

          {/* role grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ghost-700/10">
            {AI_ROLES.map((role, idx) => {
              const cfg = ROLE_METRICS[role.key];
              const val = mounted && cfg ? metrics[role.key] : (cfg?.base ?? 0);

              return (
                <div
                  key={role.key}
                  className="relative bg-ink-950/80 p-4 space-y-3 overflow-hidden group hover:bg-ink-900/80 transition-colors"
                  style={{
                    borderLeft: `2px solid ${role.accent}30`,
                  }}
                >
                  {/* accent glow strip */}
                  <div
                    className="absolute left-0 inset-y-0 w-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: role.accent }}
                  />

                  {/* status dot + label */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: role.accent,
                          opacity: blink ? 1 : 0.4,
                        }}
                      />
                      <span className="label-mono text-xs tracking-widest" style={{ color: role.accent }}>
                        <T v={{ en: "ONLINE", zh: "在线" }} />
                      </span>
                    </div>
                    <span className="mono text-xs text-ghost-600">
                      MOD-{String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* role name */}
                  <div>
                    <div
                      className="display text-base leading-tight font-semibold"
                      style={{ color: role.accent }}
                    >
                      {lang === "zh" ? (
                        <span className="zh">{role.name.zh}</span>
                      ) : (
                        role.name.en
                      )}
                    </div>
                    <p className="text-ghost-400 text-xs mt-1 leading-snug">
                      {lang === "zh" ? (
                        <span className="zh">{role.gloss.zh}</span>
                      ) : (
                        role.gloss.en
                      )}
                    </p>
                  </div>

                  {/* faux-live metric + sparkline */}
                  {cfg && (
                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <div
                          className="mono tnum text-xl font-bold"
                          style={{ color: role.accent }}
                        >
                          {val.toLocaleString()}
                        </div>
                        <div className="label-mono text-xs text-ghost-500 mt-0.5">
                          {lang === "zh" ? cfg.label.zh : cfg.label.en}
                        </div>
                      </div>
                      <Sparkline accent={role.accent} seed={idx + 1} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ TAKEAWAY ════════════════════════════════════════════════ */}
      <section className="rounded-xl border border-violet-500/20 bg-ink-900/40 p-5 space-y-3">
        <div className="label-mono text-xs text-violet-400 tracking-widest">
          <T v={{ en: "SIGNAL · PLANETARY INTELLIGENCE", zh: "信号 · 行星智能" }} />
        </div>
        <p className="text-ghost-200 text-sm leading-relaxed">
          <T
            v={{
              en: "You cannot manage what you cannot measure. A growing mesh of satellites, sensors and models is becoming a planetary nervous system, and AI is the layer that turns its flood of data into understanding and action — competence at a scale no committee could match.",
              zh: "你无法管理你无法测量之物。一张日益密集的卫星、传感器与模型之网，正成为一套行星神经系统，而 AI，是把它那洪流般的数据转化为理解与行动的那一层——任何委员会都无法匹敌的那种规模的胜任。",
            }}
          />
        </p>
        <p className="text-ghost-400 text-xs leading-relaxed border-t border-ghost-700/20 pt-3">
          <T
            v={{
              en: "The peril is the same as anywhere a system optimizes a number: a planetary manager is only as wise as the goal it is given — and the goal for a living world is far harder to specify than a temperature.",
              zh: "其凶险，与任何一个优化某个数字的系统相同：一个行星的管理者，只与它被赋予的目标一样有智慧——而为一个活着的世界设定目标，远比设定一个温度，要困难得多。",
            }}
          />
        </p>
      </section>
    </div>
  );
}
