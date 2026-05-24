"use client";

import { T, useLang } from "./lang";
import { RESERVOIRS, CARBON_FLOWS, Reservoir, CarbonFlow } from "./content";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── node layout ─────────────────────────────────────────── */
const W = 800;
const H = 520;

type NodePos = { x: number; y: number };
const NODE_POS: Record<string, NodePos> = {
  atmosphere: { x: 400, y: 72 },
  ocean:      { x: 660, y: 190 },
  biosphere:  { x: 130, y: 200 },
  soil:       { x: 140, y: 370 },
  fossil:     { x: 390, y: 420 },
  geologic:   { x: 660, y: 420 },
};

/* ─── sizing helpers ─────────────────────────────────────── */
const MIN_R = 22;
const MAX_R = 62;
function nodeRadius(store: number): number {
  const lMin = Math.log10(550);          // biosphere — smallest "visible"
  const lMax = Math.log10(100_000_000);  // geologic
  const l = Math.log10(Math.max(1, store));
  const t = Math.min(1, Math.max(0, (l - lMin) / (lMax - lMin)));
  return MIN_R + t * (MAX_R - MIN_R);
}

const STROKE_MIN = 1.2;
const STROKE_MAX = 7;
function flowStroke(v: number): number {
  const max = 120;
  return STROKE_MIN + (Math.sqrt(Math.min(v, max) / max)) * (STROKE_MAX - STROKE_MIN);
}

/* ─── cubic bezier control point (arc above/below midpoint) ── */
function curvePath(from: NodePos, to: NodePos, offset = 0.32): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  // perpendicular
  const cx = mx - dy * offset;
  const cy = my + dx * offset;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

/* ─── arrowhead marker id ────────────────────────────────── */
function markerId(accent: string): string {
  return "arr-" + accent.replace("#", "");
}

/* ─── net atmosphere flux ─────────────────────────────────── */
function netAtmFlux(industrial: boolean): number {
  let net = 0;
  for (const f of CARBON_FLOWS) {
    const val = industrial ? f.natural + f.human : f.natural;
    if (f.to === "atmosphere") net += val;
    if (f.from === "atmosphere") net -= val;
  }
  return net;
}

/* ─── particle types for canvas animation ─────────────────── */
interface Particle {
  flowIdx: number;
  t: number;        // 0..1 along path
  speed: number;
}

/* ─── main component ─────────────────────────────────────── */
export default function CarbonCycleEngine() {
  const { lang } = useLang();
  const [industrial, setIndustrial] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null); // reservoir key or flow idx as string
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // canvas for particles
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const industrialRef = useRef(industrial);

  useEffect(() => { industrialRef.current = industrial; }, [industrial]);

  /* spawn particles proportional to flow magnitude */
  const spawnParticles = useCallback((ind: boolean) => {
    const particles: Particle[] = [];
    CARBON_FLOWS.forEach((f, i) => {
      const val = ind ? f.natural + f.human : f.natural;
      if (val <= 0) return;
      const count = Math.max(1, Math.round(Math.sqrt(val) * 1.4));
      for (let k = 0; k < count; k++) {
        particles.push({ flowIdx: i, t: Math.random(), speed: 0.0008 + Math.random() * 0.0006 });
      }
    });
    particlesRef.current = particles;
  }, []);

  /* evaluate point on quadratic bezier */
  function bezierPoint(from: NodePos, to: NodePos, offset: number, t: number): { x: number; y: number } {
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const cx = mx - dy * offset;
    const cy = my + dx * offset;
    // quadratic: B(t) = (1-t)^2 * P0 + 2(1-t)t * C + t^2 * P1
    const u = 1 - t;
    return {
      x: u * u * from.x + 2 * u * t * cx + t * t * to.x,
      y: u * u * from.y + 2 * u * t * cy + t * t * to.y,
    };
  }

  useEffect(() => {
    spawnParticles(industrial);
    const canvas = canvasRef.current;
    if (!canvas) return;

    function draw() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const ind = industrialRef.current;

      for (const p of particlesRef.current) {
        const f = CARBON_FLOWS[p.flowIdx];
        const val = ind ? f.natural + f.human : f.natural;
        if (val <= 0) continue;

        const fromPos = NODE_POS[f.from];
        const toPos = NODE_POS[f.to];
        if (!fromPos || !toPos) continue;

        // offset: same logic as curvePath
        const offset = 0.32;
        const pt = bezierPoint(fromPos, toPos, offset, p.t);

        // color
        const accent = f.accent;
        const r = parseInt(accent.slice(1, 3), 16);
        const g = parseInt(accent.slice(3, 5), 16);
        const b = parseInt(accent.slice(5, 7), 16);

        const alpha = 0.6 + 0.4 * Math.sin(p.t * Math.PI); // fade at endpoints
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        // glow for human flows
        if (f.human > 0 && ind) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.25})`;
          ctx.fill();
        }

        // advance
        p.t += p.speed;
        if (p.t > 1) p.t = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [industrial, spawnParticles]);

  /* re-spawn when mode changes */
  useEffect(() => { spawnParticles(industrial); }, [industrial, spawnParticles]);

  const net = netAtmFlux(industrial);
  const netBalanced = Math.abs(net) < 0.5;

  /* active key: hover trumps selection */
  const activeKey = hoveredKey ?? selectedKey;

  /* find detail text */
  type DetailInfo = { title: { en: string; zh: string }; body: { en: string; zh: string } } | null;
  let detail: DetailInfo = null;
  if (activeKey !== null) {
    const res = RESERVOIRS.find((r) => r.key === activeKey);
    if (res) {
      detail = { title: res.name, body: res.gloss };
    } else {
      const fi = parseInt(activeKey, 10);
      if (!isNaN(fi) && CARBON_FLOWS[fi]) {
        const f = CARBON_FLOWS[fi];
        detail = { title: f.name, body: { en: `${f.natural} natural · ${f.human} human GtC/yr`, zh: `${f.natural} 自然 · ${f.human} 人为 亿吨碳/年` } };
      }
    }
  }

  /* unique accents for arrowhead defs */
  const uniqueAccents = Array.from(new Set(CARBON_FLOWS.map((f) => f.accent)));

  return (
    <div className="holo rounded-2xl p-5 md:p-7 flex flex-col gap-6">
      {/* ── header ── */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        <div className="flex-1">
          <h2 className="display text-xl md:text-2xl azure-text tracking-tight leading-tight">
            <T v={{ en: "Global Carbon Cycle", zh: "全球碳循环" }} />
          </h2>
          <p className="label-mono text-ghost-300 mt-1">
            <T v={{ en: "Six reservoirs · Eight flows · One living ledger", zh: "六个储库 · 八条流量 · 一本活着的账" }} />
          </p>
        </div>

        {/* mode toggle */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setIndustrial(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              !industrial
                ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-300"
                : "border-ghost-700/40 text-ghost-500 hover:text-ghost-300 hover:border-ghost-500/40"
            }`}
          >
            <T v={{ en: "Natural balance", zh: "自然平衡" }} />
          </button>
          <button
            onClick={() => setIndustrial(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              industrial
                ? "bg-ember-500/20 border-ember-500/60 text-ember-300"
                : "border-ghost-700/40 text-ghost-500 hover:text-ghost-300 hover:border-ghost-500/40"
            }`}
          >
            <T v={{ en: "Industrial today", zh: "今日工业" }} />
          </button>
        </div>
      </div>

      {/* ── diagram ── */}
      <div className="relative w-full rounded-xl overflow-hidden border border-ghost-700/20 bg-ink-950/60">
        {/* SVG: paths + labels */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          style={{ display: "block" }}
        >
          <defs>
            {/* arrowhead markers */}
            {uniqueAccents.map((acc) => (
              <marker
                key={acc}
                id={markerId(acc)}
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L8,3 z" fill={acc} opacity="0.85" />
              </marker>
            ))}
            {/* glow filter */}
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* ember glow for accumulation */}
            <filter id="ember-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="9" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── flow paths ── */}
          {CARBON_FLOWS.map((f, i) => {
            const from = NODE_POS[f.from];
            const to = NODE_POS[f.to];
            if (!from || !to) return null;

            const isHuman = f.human > 0;
            const isVisible = industrial ? (f.natural + f.human > 0) : f.natural > 0;
            if (!isVisible) return null;

            const val = industrial ? f.natural + f.human : f.natural;
            const stroke = flowStroke(val);
            const isHovered = hoveredKey === String(i);

            // slight offset to avoid complete overlap with reverse flow
            const offset = (f.from === "atmosphere" || f.to === "atmosphere") ? 0.28 : 0.35;

            return (
              <path
                key={i}
                d={curvePath(from, to, offset)}
                fill="none"
                stroke={f.accent}
                strokeWidth={isHovered ? stroke + 2 : stroke}
                strokeOpacity={isHovered ? 1 : 0.65}
                strokeDasharray={isHuman && industrial ? "6 5" : undefined}
                markerEnd={`url(#${markerId(f.accent)})`}
                style={{ transition: "stroke-opacity 0.25s, stroke-width 0.2s", cursor: "pointer" }}
                filter={isHovered ? "url(#glow)" : undefined}
                onMouseEnter={() => setHoveredKey(String(i))}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => setSelectedKey((k) => (k === String(i) ? null : String(i)))}
              />
            );
          })}

          {/* ── reservoir nodes ── */}
          {RESERVOIRS.map((r) => {
            const pos = NODE_POS[r.key];
            if (!pos) return null;
            const radius = nodeRadius(r.store);
            const isHov = hoveredKey === r.key;
            const isSel = selectedKey === r.key;
            const isAtm = r.key === "atmosphere";
            const accumulating = isAtm && industrial;

            return (
              <g
                key={r.key}
                transform={`translate(${pos.x},${pos.y})`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredKey(r.key)}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => setSelectedKey((k) => (k === r.key ? null : r.key))}
              >
                {/* outer glow ring */}
                <circle
                  r={radius + 8}
                  fill="none"
                  stroke={r.accent}
                  strokeWidth={accumulating ? 2.5 : 1.2}
                  strokeOpacity={accumulating ? 0.55 : isHov || isSel ? 0.45 : 0.15}
                  filter={accumulating ? "url(#ember-glow)" : undefined}
                  className={accumulating ? "breathe" : ""}
                />
                {/* second pulse ring for accumulating atm */}
                {accumulating && (
                  <circle
                    r={radius + 18}
                    fill="none"
                    stroke="#f5923c"
                    strokeWidth={1}
                    strokeOpacity={0.25}
                    className="breathe"
                  />
                )}
                {/* main circle */}
                <circle
                  r={radius}
                  fill={r.accent}
                  fillOpacity={isHov || isSel ? 0.28 : 0.16}
                  stroke={r.accent}
                  strokeWidth={isHov || isSel ? 2 : 1.4}
                  strokeOpacity={isHov || isSel ? 1 : 0.7}
                  filter={isHov ? "url(#glow)" : undefined}
                />
                {/* label — name */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  y={-7}
                  fontSize={radius > 40 ? 11 : 9.5}
                  fill={r.accent}
                  opacity={0.95}
                  fontFamily="'Space Grotesk', monospace"
                  fontWeight="600"
                  letterSpacing="0.03em"
                >
                  {r.name[lang]}
                </text>
                {/* store number */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  y={7}
                  fontSize={8.5}
                  fill={r.accent}
                  opacity={0.65}
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {r.store >= 1_000_000
                    ? `${(r.store / 1_000_000).toFixed(0)}M`
                    : r.store >= 1_000
                    ? `${(r.store / 1_000).toFixed(0)}k`
                    : r.store}{" "}
                  GtC
                </text>
                {/* accumulation badge */}
                {accumulating && (
                  <g>
                    <rect
                      x={radius - 2}
                      y={-radius - 14}
                      width={44}
                      height={14}
                      rx={3}
                      fill="#f5923c"
                      opacity={0.9}
                    />
                    <text
                      x={radius + 20}
                      y={-radius - 4}
                      textAnchor="middle"
                      fontSize={8}
                      fill="#04070d"
                      fontFamily="'JetBrains Mono', monospace"
                      fontWeight="700"
                    >
                      +5 GtC/yr
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* ── flow labels (on hover) ── */}
          {CARBON_FLOWS.map((f, i) => {
            if (hoveredKey !== String(i)) return null;
            const from = NODE_POS[f.from];
            const to = NODE_POS[f.to];
            if (!from || !to) return null;
            const offset = 0.28;
            const mid = bezierPoint2(from, to, offset, 0.5);
            const val = industrial ? f.natural + f.human : f.natural;
            return (
              <g key={`lbl-${i}`}>
                <rect
                  x={mid.x - 44}
                  y={mid.y - 14}
                  width={88}
                  height={26}
                  rx={4}
                  fill="#04070d"
                  stroke={f.accent}
                  strokeWidth={1}
                  strokeOpacity={0.6}
                  opacity={0.92}
                />
                <text
                  x={mid.x}
                  y={mid.y - 3}
                  textAnchor="middle"
                  fontSize={8.5}
                  fill={f.accent}
                  fontFamily="'Space Grotesk', monospace"
                  fontWeight="600"
                >
                  {f.name[lang]}
                </text>
                <text
                  x={mid.x}
                  y={mid.y + 8}
                  textAnchor="middle"
                  fontSize={7.5}
                  fill="#8798a6"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {val} GtC/yr
                </text>
              </g>
            );
          })}
        </svg>

        {/* canvas for particles (absolutely overlaid) */}
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.85 }}
        />
      </div>

      {/* ── net flux readout ── */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl px-5 py-4 border transition-colors ${
          netBalanced
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-ember-500/30 bg-ember-500/5"
        }`}
      >
        <div className="flex-1">
          <p className="label-mono text-xs text-ghost-500 uppercase tracking-widest mb-1">
            <T v={{ en: "Net change in the sky", zh: "天空的净变化" }} />
          </p>
          <p className="text-xs text-ghost-300 leading-relaxed">
            {netBalanced ? (
              <T
                v={{
                  en: "Atmosphere is in approximate balance — carbon in ≈ carbon out.",
                  zh: "大气近乎平衡——进入的碳 ≈ 流出的碳。",
                }}
              />
            ) : (
              <T
                v={{
                  en: "Industrial combustion and land-use change have opened a one-way valve into the atmosphere — the smallest, most sensitive reservoir.",
                  zh: "工业燃烧与土地利用变化，已向大气打开了一个单向阀——通往那最小、最敏感的储库。",
                }}
              />
            )}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <div
            className={`mono text-3xl font-bold tnum ${netBalanced ? "emerald-text" : "ember-text"}`}
          >
            {net >= 0 ? "+" : ""}
            {net.toFixed(1)}
          </div>
          <div className="label-mono text-xs text-ghost-500">GtC / yr</div>
        </div>
      </div>

      {/* ── detail panel ── */}
      <div
        className="min-h-[52px] rounded-xl px-5 py-3 border border-ghost-700/20 bg-ink-900/40 transition-all"
      >
        {detail ? (
          <div className="flex flex-col gap-1">
            <span className="label-mono text-xs text-ghost-500 uppercase tracking-widest">
              <T v={{ en: "Selected", zh: "已选" }} />
            </span>
            <span className="text-sm font-semibold text-ghost-100">
              {detail.title[lang]}
            </span>
            <span className="text-xs text-ghost-300 leading-relaxed">
              {detail.body[lang]}
            </span>
          </div>
        ) : (
          <p className="text-xs text-ghost-500 italic">
            <T
              v={{
                en: "Hover or click a reservoir node or flow path for details.",
                zh: "悬停或点击储库节点或流量路径，查看详情。",
              }}
            />
          </p>
        )}
      </div>

      {/* ── legend ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
        {RESERVOIRS.map((r) => (
          <div key={r.key} className="flex items-center gap-2">
            <span
              className="inline-block rounded-full shrink-0"
              style={{ width: 10, height: 10, background: r.accent, opacity: 0.85 }}
            />
            <span className="text-xs text-ghost-300 leading-tight">{r.name[lang]}</span>
          </div>
        ))}
      </div>

      {/* ── caption ── */}
      <p className="text-xs text-ghost-500 leading-relaxed border-t border-ghost-700/20 pt-4">
        <T
          v={{
            en: "Carbon circulates between sky, sea, life and stone — for most of Earth's history the books balanced. Industrial combustion has opened a one-way valve into the atmosphere: the smallest and most sensitive reservoir, now accumulating ≈ 5 GtC every year.",
            zh: "碳在天、海、生命与岩石之间循环——在地球历史的大部分时间里，这本账是平的。工业燃烧打开了一个通往大气的单向阀：那最小也最敏感的储库，如今每年累积约五十亿吨碳。",
          }}
        />
      </p>
    </div>
  );
}

/* ─── helper: bezierPoint outside component scope (pure fn) ── */
function bezierPoint2(from: NodePos, to: NodePos, offset: number, t: number): NodePos {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const cx = mx - dy * offset;
  const cy = my + dx * offset;
  const u = 1 - t;
  return {
    x: u * u * from.x + 2 * u * t * cx + t * t * to.x,
    y: u * u * from.y + 2 * u * t * cy + t * t * to.y,
  };
}
