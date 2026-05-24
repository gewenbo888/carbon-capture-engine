"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { T, useLang } from "./lang";
import { CAPTURE_METHODS, DAC_PIPELINE, CaptureMethod, DacStage } from "./content";

/* ── types ───────────────────────────────────────────────────── */
type Dot = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isCO2: boolean;
  captured: boolean;
  stage: number; // 0..4 pipeline stage index
  phase: "flow" | "captured" | "descend";
  alpha: number;
  radius: number;
};

type YAxis = "durability" | "energy" | "scalability";

/* ── helpers ─────────────────────────────────────────────────── */
function sqrtScale(val: number, min: number, max: number, outMin: number, outMax: number): number {
  const norm = (Math.sqrt(val) - Math.sqrt(min)) / (Math.sqrt(max) - Math.sqrt(min));
  return outMin + norm * (outMax - outMin);
}

/* ── constants ───────────────────────────────────────────────── */
const PIPELINE_COLORS = DAC_PIPELINE.map((s: DacStage) => s.accent);
const DOT_COUNT = 60;
const CO2_RATIO = 0.04; // 0.04% in real life — exaggerated for UX to ~25%
const STAGE_W = 100 / DAC_PIPELINE.length; // percent width per stage

/* ══════════════════════════════════════════════════════════════ */
export default function CaptureLab() {
  const { lang } = useLang();

  /* ── Part A state ── */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const dotsRef = useRef<Dot[]>([]);
  const playingRef = useRef(true);
  const [playing, setPlayingState] = useState(true);
  const [stageIdx, setStageIdx] = useState<number | null>(null); // hovered stage

  /* ── Part B state ── */
  const [yAxis, setYAxis] = useState<YAxis>("durability");
  const [hovered, setHovered] = useState<CaptureMethod | null>(null);
  const [selected, setSelected] = useState<CaptureMethod | null>(null);

  /* ─────────────── PART A — DAC animation ──────────────────── */
  const initDots = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const dots: Dot[] = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      const isCO2 = Math.random() < 0.28; // visually ~28% for readability
      dots.push({
        id: i,
        x: Math.random() * (w * 0.18), // start in intake zone
        y: Math.random() * (h * 0.7) + h * 0.1,
        vx: 0.5 + Math.random() * 0.8,
        vy: (Math.random() - 0.5) * 0.4,
        isCO2,
        captured: false,
        stage: 0,
        phase: "flow",
        alpha: 0.7 + Math.random() * 0.3,
        radius: isCO2 ? 4 : 2.5,
      });
    }
    dotsRef.current = dots;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = 200;
    }
    initDots();

    const SORBENT_X = canvas.width * 0.22;
    const DESORB_X = canvas.width * 0.42;
    const COMPRESS_X = canvas.width * 0.62;
    const STORE_X = canvas.width * 0.82;
    const ROCK_Y = canvas.height * 0.88;

    function draw() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Draw stage bands
      const bandColors = ["#1a2836", "#1a2040", "#1e1a36", "#151e30", "#1a1e28"];
      DAC_PIPELINE.forEach((_s: DacStage, i: number) => {
        const x0 = (i / 5) * W;
        const x1 = ((i + 1) / 5) * W;
        ctx.fillStyle = bandColors[i];
        ctx.fillRect(x0, 0, x1 - x0, H * 0.82);
        // separator
        if (i > 0) {
          ctx.strokeStyle = "rgba(55,182,246,0.12)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x0, 0);
          ctx.lineTo(x0, H * 0.82);
          ctx.stroke();
        }
      });

      // Rock layer at bottom
      const gRock = ctx.createLinearGradient(0, H * 0.82, 0, H);
      gRock.addColorStop(0, "#23211a");
      gRock.addColorStop(1, "#14120e");
      ctx.fillStyle = gRock;
      ctx.fillRect(0, H * 0.82, W, H * 0.18);
      ctx.strokeStyle = "rgba(135,152,166,0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(0, H * 0.82);
      ctx.lineTo(W, H * 0.82);
      ctx.stroke();
      ctx.setLineDash([]);

      // Rock texture lines
      for (let rl = 0; rl < 3; rl++) {
        ctx.strokeStyle = `rgba(135,152,166,${0.08 + rl * 0.04})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, H * (0.87 + rl * 0.04));
        ctx.lineTo(W, H * (0.87 + rl * 0.04));
        ctx.stroke();
      }

      // Stage label at bottom of each band
      DAC_PIPELINE.forEach((s: DacStage, i: number) => {
        const cx = ((i + 0.5) / 5) * W;
        ctx.fillStyle = PIPELINE_COLORS[i] + "cc";
        ctx.font = "bold 10px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(`0${i + 1}`, cx, 14);
      });

      if (!playingRef.current) {
        rafRef.current = requestAnimationFrame(draw);
        renderDots(ctx, W, H);
        return;
      }

      // Update dots
      const dots = dotsRef.current;
      for (const d of dots) {
        if (d.phase === "flow") {
          d.x += d.vx;
          d.y += d.vy;
          d.vy += (Math.random() - 0.5) * 0.06;
          d.vy = Math.max(-1.5, Math.min(1.5, d.vy));
          // clamp y to band
          if (d.y < H * 0.06) d.vy += 0.2;
          if (d.y > H * 0.78) d.vy -= 0.2;

          // Sorbent capture (stage 1 → 2)
          if (d.x >= SORBENT_X && !d.captured && d.isCO2) {
            d.captured = true;
            d.phase = "captured";
            d.stage = 1;
            d.vy = 0;
          }

          // Non-CO2 passes through sorbent
          if (d.x >= SORBENT_X && !d.isCO2) {
            d.alpha = Math.max(0, d.alpha - 0.004); // fade out
          }

          // Wrap non-captured non-CO2 dots back
          if (d.x > W || d.alpha <= 0) {
            d.x = Math.random() * W * 0.15;
            d.y = Math.random() * (H * 0.7) + H * 0.1;
            d.alpha = 0.6 + Math.random() * 0.3;
            d.captured = false;
            d.isCO2 = Math.random() < 0.28;
            d.radius = d.isCO2 ? 4 : 2.5;
          }
        } else if (d.phase === "captured") {
          // Travel right through desorb → compress → store
          d.x += 0.6;
          d.vy = 0;
          // Update stage
          if (d.x >= STORE_X) d.stage = 4;
          else if (d.x >= COMPRESS_X) d.stage = 3;
          else if (d.x >= DESORB_X) d.stage = 2;
          else d.stage = 1;

          if (d.x >= STORE_X + (W / 5) * 0.7) {
            d.phase = "descend";
          }
        } else if (d.phase === "descend") {
          d.y += 1.2;
          d.alpha = Math.max(0, d.alpha - 0.01);
          if (d.y > ROCK_Y || d.alpha <= 0) {
            // reset
            d.x = Math.random() * W * 0.15;
            d.y = Math.random() * (H * 0.7) + H * 0.1;
            d.alpha = 0.6 + Math.random() * 0.3;
            d.captured = false;
            d.isCO2 = Math.random() < 0.28;
            d.phase = "flow";
            d.radius = d.isCO2 ? 4 : 2.5;
            d.vx = 0.5 + Math.random() * 0.8;
            d.vy = (Math.random() - 0.5) * 0.4;
          }
        }
      }
      renderDots(ctx, W, H);
      rafRef.current = requestAnimationFrame(draw);
    }

    function renderDots(ctx: CanvasRenderingContext2D, W: number, H: number) {
      const dots = dotsRef.current;
      for (const d of dots) {
        ctx.globalAlpha = d.alpha;
        if (d.phase === "captured" || d.phase === "descend") {
          // CO2 captured — colored by stage
          const col = PIPELINE_COLORS[d.stage] || "#37b6f6";
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
          ctx.fill();
          // glow
          ctx.shadowColor = col;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (d.isCO2) {
          ctx.fillStyle = "#f5923c";
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = "rgba(135,152,166,0.6)";
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      // Label a few CO2 dots in the intake zone
      ctx.font = "7px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#f5923c";
      ctx.textAlign = "center";
      let labeled = 0;
      for (const d of dots) {
        if (d.isCO2 && d.phase === "flow" && d.x < W * 0.18 && labeled < 4) {
          ctx.globalAlpha = d.alpha * 0.9;
          ctx.fillText("CO₂", d.x, d.y - 7);
          ctx.globalAlpha = 1;
          labeled++;
        }
      }

      // Arrow connectors between stages
      for (let i = 0; i < 4; i++) {
        const ax = ((i + 1) / 5) * W;
        const ay = H * 0.42;
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = "#37b6f6";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ax - 4, ay - 5);
        ctx.lineTo(ax + 4, ay);
        ctx.lineTo(ax - 4, ay + 5);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Descend arrow at store stage
      const sx = W * 0.9;
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = "#8798a6";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sx, H * 0.72);
      ctx.lineTo(sx, H * 0.85);
      ctx.lineTo(sx - 5, H * 0.8);
      ctx.moveTo(sx, H * 0.85);
      ctx.lineTo(sx + 5, H * 0.8);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [initDots]);

  function togglePlay() {
    playingRef.current = !playingRef.current;
    setPlayingState(playingRef.current);
  }

  /* ─────────────── PART B — bubble chart ───────────────────── */
  // SVG dimensions
  const SVG_W = 560;
  const SVG_H = 320;
  const PAD = { top: 20, right: 20, bottom: 50, left: 54 };
  const plotW = SVG_W - PAD.left - PAD.right;
  const plotH = SVG_H - PAD.top - PAD.bottom;

  const MIN_COST = 20;
  const MAX_COST = 520;

  function costToX(cost: number): number {
    return PAD.left + sqrtScale(cost, MIN_COST, MAX_COST, 0, plotW);
  }

  function metricToY(val: number): number {
    return PAD.top + plotH - (val / 100) * plotH;
  }

  function scaleToR(scalability: number): number {
    return 8 + (scalability / 100) * 18;
  }

  const yLabel: Record<YAxis, { en: string; zh: string }> = {
    durability: { en: "Storage durability / 储存持久性", zh: "储存持久性 / Storage durability" },
    energy: { en: "Energy intensity / 能耗强度", zh: "能耗强度 / Energy intensity" },
    scalability: { en: "Scalability / 可扩展性", zh: "可扩展性 / Scalability" },
  };

  const xTicks = [25, 50, 100, 200, 500];

  const activeMethod = selected ?? hovered;

  return (
    <div className="holo rounded-2xl p-5 md:p-7">
      {/* ── Header ── */}
      <div className="mb-6">
        <p className="label-mono azure-text mb-1 text-xs tracking-widest uppercase">
          <T v={{ en: "Carbon Capture Laboratory", zh: "碳捕获实验室" }} />
        </p>
        <h2 className="display text-2xl md:text-3xl font-bold text-ghost-50 leading-tight">
          <T v={{ en: "Capture Lab", zh: "捕获实验台" }} />
        </h2>
        <p className="text-ghost-300 text-sm mt-2 max-w-2xl">
          <T v={{ en: "Two instruments: an animated Direct Air Capture pipeline, and a trade-off map of eight carbon-removal architectures.", zh: "两台仪器：一条动态直接空气捕获流水线，以及八种碳移除架构的权衡图谱。" }} />
        </p>
      </div>

      {/* ══ PART A — DAC Pipeline ══ */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="label-mono text-xs text-ghost-300 tracking-widest uppercase">
            <T v={{ en: "A — Direct Air Capture Pipeline", zh: "A — 直接空气捕获流程" }} />
          </span>
          <button
            onClick={togglePlay}
            className="mono text-xs px-3 py-1 rounded border border-azure-500/30 text-azure-300 hover:bg-azure-500/10 transition"
            aria-label={playing ? "Pause animation" : "Play animation"}
          >
            {playing
              ? <T v={{ en: "⏸ Pause", zh: "⏸ 暂停" }} />
              : <T v={{ en: "▶ Play", zh: "▶ 播放" }} />
            }
          </button>
        </div>

        {/* Stage labels row */}
        <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: `repeat(${DAC_PIPELINE.length}, 1fr)` }}>
          {DAC_PIPELINE.map((s: DacStage, i: number) => (
            <div
              key={s.key}
              className="text-center cursor-default"
              onMouseEnter={() => setStageIdx(i)}
              onMouseLeave={() => setStageIdx(null)}
            >
              <span
                className="label-mono text-[10px] font-bold tracking-wide block"
                style={{ color: s.accent }}
              >
                <T v={s.name} />
              </span>
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div className="relative w-full rounded-xl overflow-hidden border border-ghost-700/30">
          <canvas
            ref={canvasRef}
            className="w-full block"
            style={{ height: 200 }}
          />
        </div>

        {/* Hover gloss */}
        <div className="mt-2 min-h-[2.2rem]">
          {stageIdx !== null ? (
            <p className="text-xs text-ghost-300 mono">
              <span style={{ color: DAC_PIPELINE[stageIdx].accent }} className="font-bold">
                <T v={DAC_PIPELINE[stageIdx].name} />
              </span>
              {" — "}
              <T v={DAC_PIPELINE[stageIdx].gloss} />
            </p>
          ) : (
            <p className="text-xs text-ghost-300/60 italic">
              <T v={{ en: "Hover a stage label for details.", zh: "将鼠标悬停在阶段标签上查看详情。" }} />
            </p>
          )}
        </div>

        {/* Thermodynamic note */}
        <div className="mt-3 rounded-lg border border-ember-500/20 bg-ember-500/5 px-4 py-3 text-xs text-ghost-300 leading-relaxed">
          <span className="mono azure-text font-bold mr-1">
            <T v={{ en: "Thermodynamic catch:", zh: "热力学陷阱：" }} />
          </span>
          <T v={{
            en: "CO₂ is only 0.04% of air. Separating a dilute gas from everything else costs energy by the laws of physics — which is why a tonne removed can cost $300–500, and why the power must be clean. Run DAC on coal power and the cure emits more than it captures.",
            zh: "大气中的二氧化碳浓度仅为 0.04%。从其余气体中分离稀薄气体，依物理定律就要耗费能量——这正是为何每吨捕获成本高达 300–500 美元，也是为何所用电力必须是清洁的。若用煤电驱动直接空气捕获，这剂解药排放的将多于它捕获的。",
          }} />
        </div>
      </div>

      {/* ══ PART B — Bubble chart ══ */}
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="label-mono text-xs text-ghost-300 tracking-widest uppercase">
            <T v={{ en: "B — Removal Architecture Trade-offs", zh: "B — 移除架构权衡" }} />
          </span>
          <div className="flex gap-1 ml-auto flex-wrap">
            {(["durability", "energy", "scalability"] as YAxis[]).map((ax) => (
              <button
                key={ax}
                onClick={() => setYAxis(ax)}
                className={`mono text-[10px] px-2 py-1 rounded border transition ${yAxis === ax
                  ? "border-azure-400/60 bg-azure-500/15 text-azure-300"
                  : "border-ghost-700/40 text-ghost-400 hover:text-ghost-200"
                  }`}
              >
                {ax === "durability"
                  ? <T v={{ en: "Durability", zh: "持久性" }} />
                  : ax === "energy"
                    ? <T v={{ en: "Energy", zh: "能耗" }} />
                    : <T v={{ en: "Scalability", zh: "规模性" }} />
                }
              </button>
            ))}
          </div>
        </div>

        {/* Chart + detail card layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* SVG Scatter/Bubble chart */}
          <div className="flex-1 min-w-0 overflow-x-auto">
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full max-w-full"
              style={{ minWidth: 300, height: "auto" }}
              role="img"
              aria-label={lang === "en" ? "Carbon removal trade-off bubble chart" : "碳移除权衡气泡图"}
            >
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((v) => (
                <g key={v}>
                  <line
                    x1={PAD.left} y1={metricToY(v)}
                    x2={PAD.left + plotW} y2={metricToY(v)}
                    stroke="rgba(135,152,166,0.12)" strokeWidth={1}
                  />
                  <text
                    x={PAD.left - 6} y={metricToY(v) + 4}
                    textAnchor="end"
                    fontSize={9}
                    fill="rgba(135,152,166,0.7)"
                    fontFamily="'JetBrains Mono', monospace"
                  >{v}</text>
                </g>
              ))}

              {/* X grid + ticks */}
              {xTicks.map((c) => (
                <g key={c}>
                  <line
                    x1={costToX(c)} y1={PAD.top}
                    x2={costToX(c)} y2={PAD.top + plotH}
                    stroke="rgba(135,152,166,0.10)" strokeWidth={1}
                  />
                  <text
                    x={costToX(c)} y={PAD.top + plotH + 14}
                    textAnchor="middle"
                    fontSize={9}
                    fill="rgba(135,152,166,0.7)"
                    fontFamily="'JetBrains Mono', monospace"
                  >{c === 500 ? "500" : `$${c}`}</text>
                </g>
              ))}

              {/* Axes */}
              <line
                x1={PAD.left} y1={PAD.top}
                x2={PAD.left} y2={PAD.top + plotH}
                stroke="rgba(135,152,166,0.3)" strokeWidth={1}
              />
              <line
                x1={PAD.left} y1={PAD.top + plotH}
                x2={PAD.left + plotW} y2={PAD.top + plotH}
                stroke="rgba(135,152,166,0.3)" strokeWidth={1}
              />

              {/* Axis labels */}
              <text
                x={PAD.left + plotW / 2} y={SVG_H - 4}
                textAnchor="middle"
                fontSize={10}
                fill="rgba(135,152,166,0.8)"
                fontFamily="'JetBrains Mono', monospace"
              >
                {lang === "en" ? "Cost $/tCO₂  (√ scale)" : "成本 $/tCO₂（√ 刻度）"}
              </text>
              <text
                x={12} y={PAD.top + plotH / 2}
                textAnchor="middle"
                fontSize={9}
                fill="rgba(135,152,166,0.8)"
                fontFamily="'JetBrains Mono', monospace"
                transform={`rotate(-90, 12, ${PAD.top + plotH / 2})`}
              >
                {yLabel[yAxis][lang]}
              </text>

              {/* Bubbles */}
              {CAPTURE_METHODS.map((m: CaptureMethod) => {
                const cx = costToX(m.cost);
                const cy = metricToY(m[yAxis]);
                const r = scaleToR(m.scalability);
                const isActive = activeMethod?.key === m.key;

                return (
                  <g key={m.key}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelected(selected?.key === m.key ? null : m)}
                    onMouseEnter={() => setHovered(m)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Glow ring on hover */}
                    {isActive && (
                      <circle
                        cx={cx} cy={cy} r={r + 5}
                        fill="none"
                        stroke={m.accent}
                        strokeWidth={1.5}
                        opacity={0.4}
                      />
                    )}
                    {/* Bubble */}
                    <circle
                      cx={cx} cy={cy} r={r}
                      fill={m.accent + "55"}
                      stroke={m.accent}
                      strokeWidth={isActive ? 2 : 1}
                    />
                    {/* Label */}
                    <text
                      x={cx}
                      y={cy - r - 5}
                      textAnchor="middle"
                      fontSize={8.5}
                      fill={m.accent}
                      fontFamily="'JetBrains Mono', monospace"
                      fontWeight={isActive ? "bold" : "normal"}
                    >
                      {m.name[lang].split(" ")[0]}
                    </text>
                  </g>
                );
              })}

              {/* Legend: bubble size = scalability */}
              <g transform={`translate(${PAD.left + plotW - 80}, ${PAD.top + 8})`}>
                <text fontSize={7} fill="rgba(135,152,166,0.6)" fontFamily="'JetBrains Mono', monospace">
                  {lang === "en" ? "● size = scalability" : "● 圆圈大小 = 规模性"}
                </text>
              </g>
            </svg>
          </div>

          {/* Detail card */}
          <div className="lg:w-56 shrink-0">
            {activeMethod ? (
              <div
                className="rounded-xl border p-4 text-xs space-y-2 h-full"
                style={{ borderColor: activeMethod.accent + "55", background: activeMethod.accent + "0a" }}
              >
                <p className="font-bold text-sm" style={{ color: activeMethod.accent }}>
                  <T v={activeMethod.name} />
                </p>
                <p className="text-ghost-400 italic">
                  <T v={activeMethod.family} />
                </p>

                {/* Metric bars */}
                {(["cost", "energy", "durability", "scalability"] as const).map((k) => {
                  const labels: Record<string, { en: string; zh: string }> = {
                    cost: { en: "Cost $/t", zh: "成本 $/t" },
                    energy: { en: "Energy", zh: "能耗" },
                    durability: { en: "Durability", zh: "持久性" },
                    scalability: { en: "Scalability", zh: "规模性" },
                  };
                  const raw = activeMethod[k];
                  const pct = k === "cost"
                    ? Math.round((raw / 500) * 100)
                    : raw;
                  const display = k === "cost" ? `$${raw}` : `${raw}`;
                  return (
                    <div key={k}>
                      <div className="flex justify-between text-ghost-400 mb-0.5">
                        <span><T v={labels[k]} /></span>
                        <span className="tnum mono text-ghost-300">{display}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-ghost-800 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background: activeMethod.accent,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                <p className="text-ghost-300 leading-relaxed pt-1">
                  <T v={activeMethod.gloss} />
                </p>

                {selected?.key === activeMethod.key && (
                  <button
                    onClick={() => setSelected(null)}
                    className="text-ghost-500 hover:text-ghost-300 text-[10px] mt-1"
                  >
                    <T v={{ en: "✕ dismiss", zh: "✕ 关闭" }} />
                  </button>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-ghost-700/20 p-4 text-xs text-ghost-500 h-full flex items-center justify-center text-center leading-relaxed">
                <T v={{ en: "Click or hover a bubble to inspect the method.", zh: "点击或悬停气泡查看详情。" }} />
              </div>
            )}
          </div>
        </div>

        {/* Takeaway */}
        <div className="mt-5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs text-ghost-300 leading-relaxed">
          <span className="mono text-emerald-300 font-bold mr-1">
            <T v={{ en: "Core insight:", zh: "核心洞见：" }} />
          </span>
          <T v={{
            en: "No single method scales alone — cheap methods (forests, soil) are impermanent; durable methods (DAC, mineralization) are costly. Only a portfolio spans the full trade-off, and only if cutting emissions does the heavy lifting first. For the first time in history, the atmosphere is an engineering target.",
            zh: "没有任何单一方法能独自扩展规模——廉价的方法（造林、土壤）不持久；持久的方法（直接空气捕获、矿化）代价高昂。只有组合策略才能跨越完整的权衡空间，而且前提是削减排放首先承担主要工作。人类历史上首次，大气成为了一个工程目标。",
          }} />
        </div>
      </div>
    </div>
  );
}
