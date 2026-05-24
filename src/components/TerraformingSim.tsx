"use client";

import { T, useLang } from "./lang";
import { BIOSPHERE_STAGES, BiosphereStage } from "./content";
import { useState, useRef, useEffect, useCallback } from "react";

/* ─── helpers ─── */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function lerpColor(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number,
  t: number
): [number, number, number] {
  return [
    Math.round(lerp(r1, r2, t)),
    Math.round(lerp(g1, g2, t)),
    Math.round(lerp(b1, b2, t)),
  ];
}

function hexStr(r: number, g: number, b: number, a = 1) {
  const ah = Math.round(a * 255).toString(16).padStart(2, "0");
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}${ah}`;
}

/* ─── planet visual ─── */
const PLANET_R = 120;
const CANVAS_SIZE = 280;

function drawPlanet(
  ctx: CanvasRenderingContext2D,
  intensity: number, // 0-1
  cloudPhase: number  // animated float for drifting clouds
) {
  const cx = CANVAS_SIZE / 2;
  const cy = CANVAS_SIZE / 2;
  const r = PLANET_R;

  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // ── surface color ──
  // 0%: barren ember-grey  → mid: rusty warm  → high: green+blue living world
  const surf0: [number, number, number] = [110, 80, 70];   // barren: dark ember-grey
  const surfMid: [number, number, number] = [155, 95, 65]; // warm rusty at 50%
  const surfHigh: [number, number, number] = [40, 120, 80]; // green-teal living at 100%

  let surfColor: [number, number, number];
  if (intensity < 0.5) {
    surfColor = lerpColor(...surf0, ...surfMid, intensity * 2);
  } else {
    surfColor = lerpColor(...surfMid, ...surfHigh, (intensity - 0.5) * 2);
  }

  // ── base planet fill ──
  const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.05, cx, cy, r);
  grad.addColorStop(0, hexStr(...lerpColor(...surfColor, 255, 255, 255, 0.25)));
  grad.addColorStop(0.6, hexStr(...surfColor));
  grad.addColorStop(1, hexStr(...lerpColor(...surfColor, 0, 0, 0, 0.5)));
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  // ── craters (barren world — fade out as life appears) ──
  const craterOpacity = Math.max(0, 1 - intensity * 2.5);
  if (craterOpacity > 0.01) {
    const craters: [number, number, number][] = [
      [cx - 35, cy - 20, 16],
      [cx + 30, cy + 28, 12],
      [cx - 10, cy + 45, 9],
      [cx + 50, cy - 35, 8],
      [cx - 55, cy + 15, 7],
    ];
    ctx.save();
    ctx.globalAlpha = craterOpacity * 0.55;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    for (const [x, y, cr] of craters) {
      ctx.beginPath();
      ctx.arc(x, y, cr, 0, Math.PI * 2);
      ctx.fillStyle = "#1a0e0a";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x - cr * 0.25, y - cr * 0.25, cr * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,200,160,0.18)";
      ctx.fill();
    }
    ctx.restore();
  }

  // ── ocean patches (appear mid-to-high) ──
  const oceanOpacity = Math.max(0, (intensity - 0.4) / 0.4);
  if (oceanOpacity > 0.01) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.globalAlpha = oceanOpacity * 0.72;
    // northern ocean
    const oGrad = ctx.createRadialGradient(cx - 20, cy - 30, 5, cx - 20, cy - 30, 55);
    oGrad.addColorStop(0, "#37b6f6");
    oGrad.addColorStop(1, "rgba(30,100,180,0)");
    ctx.fillStyle = oGrad;
    ctx.fillRect(cx - 80, cy - 90, 160, 160);
    // southern ocean blob
    const oGrad2 = ctx.createRadialGradient(cx + 25, cy + 40, 4, cx + 25, cy + 40, 38);
    oGrad2.addColorStop(0, "#1f7fd6");
    oGrad2.addColorStop(1, "rgba(20,80,160,0)");
    ctx.fillStyle = oGrad2;
    ctx.fillRect(cx - 40, cy, 110, 90);
    ctx.restore();
  }

  // ── green life patches (appear high) ──
  const greenOpacity = Math.max(0, (intensity - 0.65) / 0.35);
  if (greenOpacity > 0.01) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.globalAlpha = greenOpacity * 0.68;
    const gPatches: [number, number, number][] = [
      [cx - 15, cy + 10, 42],
      [cx + 40, cy - 10, 30],
      [cx - 55, cy - 10, 22],
      [cx + 10, cy + 50, 28],
    ];
    for (const [x, y, pr] of gPatches) {
      const gGrad = ctx.createRadialGradient(x, y, 3, x, y, pr);
      gGrad.addColorStop(0, "#2bd48b");
      gGrad.addColorStop(0.6, "#1aab62");
      gGrad.addColorStop(1, "rgba(20,120,60,0)");
      ctx.fillStyle = gGrad;
      ctx.fillRect(x - pr, y - pr, pr * 2, pr * 2);
    }
    ctx.restore();
  }

  // ── drifting clouds (appear at mid intensity) ──
  const cloudOpacity = Math.max(0, (intensity - 0.45) / 0.35);
  if (cloudOpacity > 0.01) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.globalAlpha = cloudOpacity * 0.45;
    const clouds: [number, number, number, number][] = [
      [0.0, cy - 15, 70, 18],
      [0.33, cy + 30, 55, 14],
      [0.67, cy - 45, 48, 12],
    ];
    for (const [phOff, cy2, cw, ch] of clouds) {
      const px = ((cloudPhase + phOff) % 1) * (r * 2) - r;
      ctx.save();
      ctx.translate(cx + px, cy2);
      const cGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, cw * 0.5);
      cGrad.addColorStop(0, "rgba(255,255,255,0.9)");
      cGrad.addColorStop(0.5, "rgba(230,240,255,0.6)");
      cGrad.addColorStop(1, "rgba(200,220,255,0)");
      ctx.scale(1, ch / cw);
      ctx.beginPath();
      ctx.arc(0, 0, cw * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = cGrad;
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  // ── atmosphere halo ──
  const atmosOpacity = Math.max(0, intensity * 0.85);
  if (atmosOpacity > 0.01) {
    const haloR = r + 2 + intensity * 22;
    const hGrad = ctx.createRadialGradient(cx, cy, r - 2, cx, cy, haloR + 12);
    // azure for thin atmos → deeper azure+emerald tinge for lush
    const haloR_val = Math.round(lerp(55, 15, intensity));
    const haloG_val = Math.round(lerp(182, 160, intensity));
    const haloB_val = Math.round(lerp(246, 220, intensity));
    hGrad.addColorStop(0, hexStr(haloR_val, haloG_val, haloB_val, atmosOpacity * 0.65));
    hGrad.addColorStop(0.55, hexStr(haloR_val, haloG_val, haloB_val, atmosOpacity * 0.2));
    hGrad.addColorStop(1, hexStr(haloR_val, haloG_val, haloB_val, 0));
    ctx.beginPath();
    ctx.arc(cx, cy, haloR + 12, 0, Math.PI * 2);
    ctx.arc(cx, cy, r - 2, 0, Math.PI * 2, true);
    ctx.fillStyle = hGrad;
    ctx.fill();
  }

  // ── specular highlight ──
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  const specGrad = ctx.createRadialGradient(cx - r * 0.38, cy - r * 0.38, 1, cx - r * 0.35, cy - r * 0.35, r * 0.55);
  specGrad.addColorStop(0, "rgba(255,255,255,0.22)");
  specGrad.addColorStop(0.5, "rgba(255,255,255,0.05)");
  specGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = specGrad;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

/* ─── computed readouts ─── */
function computeReadouts(intensity: number) {
  // atmospheric pressure: 0.006 bar (Mars) → 1.01 bar (Earth)
  const pressure = lerp(0.006, 1.01, Math.pow(intensity, 1.6));
  // temperature: −63°C (Mars avg) → +14°C (Earth avg)
  const temperature = lerp(-63, 14, Math.pow(intensity, 1.3));
  // habitability: 0→100, S-curve feel
  const hab = Math.round(lerp(0, 100, Math.pow(intensity, 0.8)));
  return { pressure, temperature, hab };
}

/* ─── main component ─── */
export default function TerraformingSim() {
  const { lang } = useLang();

  // Part A
  const [sliderVal, setSliderVal] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const cloudPhaseRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const intensity = sliderVal / 100;
  const { pressure, temperature, hab } = computeReadouts(intensity);

  const animate = useCallback((ts: number) => {
    if (lastTimeRef.current !== null) {
      const dt = (ts - lastTimeRef.current) / 1000;
      cloudPhaseRef.current = (cloudPhaseRef.current + dt * 0.055) % 1;
    }
    lastTimeRef.current = ts;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawPlanet(ctx, intensity, cloudPhaseRef.current);
      }
    }
    rafRef.current = requestAnimationFrame(animate);
  }, [intensity]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  // Part B
  const [activeStage, setActiveStage] = useState<number>(0);
  const [playing, setPlaying] = useState(false);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPlay = useCallback(() => {
    if (playRef.current !== null) {
      clearInterval(playRef.current);
      playRef.current = null;
    }
    setPlaying(false);
  }, []);

  const startPlay = useCallback(() => {
    setPlaying(true);
    playRef.current = setInterval(() => {
      setActiveStage((prev) => {
        const next = prev + 1;
        if (next >= BIOSPHERE_STAGES.length) {
          stopPlay();
          return prev;
        }
        return next;
      });
    }, 1200);
  }, [stopPlay]);

  useEffect(() => {
    return () => {
      if (playRef.current !== null) clearInterval(playRef.current);
    };
  }, []);

  const handleReset = () => {
    stopPlay();
    setActiveStage(0);
  };

  const handleStep = () => {
    stopPlay();
    setActiveStage((prev) => Math.min(prev + 1, BIOSPHERE_STAGES.length - 1));
  };

  const handlePlayPause = () => {
    if (playing) {
      stopPlay();
    } else {
      if (activeStage >= BIOSPHERE_STAGES.length - 1) setActiveStage(0);
      startPlay();
    }
  };

  // habitat label
  const habLabel = (h: number): { en: string; zh: string } => {
    if (h < 10) return { en: "Uninhabitable", zh: "不可居住" };
    if (h < 30) return { en: "Marginal", zh: "勉强可存" };
    if (h < 55) return { en: "Hostile", zh: "严酷宜居" };
    if (h < 75) return { en: "Emerging", zh: "初步宜居" };
    if (h < 90) return { en: "Habitable", zh: "基本宜居" };
    return { en: "Flourishing", zh: "生机盎然" };
  };

  const habInfo = habLabel(hab);

  // pressure display
  const pressureStr = pressure < 0.01
    ? pressure.toFixed(4)
    : pressure < 0.1
      ? pressure.toFixed(3)
      : pressure.toFixed(2);

  // temp display
  const tempStr = `${temperature >= 0 ? "+" : ""}${temperature.toFixed(1)}`;

  return (
    <div className="holo rounded-2xl p-5 md:p-7 space-y-10">
      {/* ── header ── */}
      <div className="space-y-1">
        <h2 className="display text-2xl md:text-3xl azure-text">
          <T v={{ en: "Terraforming Sim", zh: "地球化模拟器" }} />
        </h2>
        <p className="label-mono text-ghost-300 text-sm">
          <T v={{
            en: "The greenhouse effect that overheats Earth can resurrect a frozen world.",
            zh: "让地球过热的温室效应，也能复活一颗冰封的星球。"
          }} />
        </p>
      </div>

      {/* ══════════════════════════════════════════
          PART A — the terraforming dial
      ══════════════════════════════════════════ */}
      <div className="space-y-5">
        <div className="rule-azure" />
        <p className="label-mono text-xs text-ghost-300 uppercase tracking-widest">
          <T v={{ en: "Part A — Atmosphere thickening", zh: "第一部分 — 大气加厚" }} />
        </p>

        {/* planet + readouts */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          {/* planet canvas */}
          <div className="flex-shrink-0 relative">
            {/* starfield bg */}
            <div className="absolute inset-0 rounded-full overflow-hidden" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
              <svg width={CANVAS_SIZE} height={CANVAS_SIZE} className="absolute inset-0">
                {[
                  [18, 22], [240, 30], [10, 200], [255, 195], [130, 8],
                  [150, 260], [55, 255], [270, 140], [200, 250], [30, 120],
                  [95, 38], [245, 80], [180, 18], [8, 70], [260, 210],
                  [120, 270], [75, 150], [220, 60], [50, 50], [195, 130],
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r={0.8 + (i % 3) * 0.5}
                    fill={`rgba(180,200,255,${0.3 + (i % 4) * 0.15})`} />
                ))}
              </svg>
            </div>
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              style={{ display: "block", borderRadius: "50%" }}
            />
          </div>

          {/* readout panel */}
          <div className="flex-1 space-y-4 w-full max-w-xs">
            {/* pressure */}
            <div className="space-y-1">
              <p className="label-mono text-xs text-ghost-300 uppercase tracking-wider">
                <T v={{ en: "Atmospheric pressure", zh: "大气压力" }} />
              </p>
              <div className="flex items-end gap-2">
                <span className="mono tnum text-3xl azure-text font-bold">{pressureStr}</span>
                <span className="mono text-ghost-300 text-sm pb-1">bar</span>
              </div>
              <div className="h-1.5 rounded-full bg-ink-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (pressure / 1.01) * 100)}%`,
                    background: "linear-gradient(90deg, #1f7fd6, #37b6f6)"
                  }}
                />
              </div>
            </div>

            {/* temperature */}
            <div className="space-y-1">
              <p className="label-mono text-xs text-ghost-300 uppercase tracking-wider">
                <T v={{ en: "Mean surface temperature", zh: "平均地表温度" }} />
              </p>
              <div className="flex items-end gap-2">
                <span
                  className="mono tnum text-3xl font-bold"
                  style={{
                    color: temperature < -30
                      ? "#37b6f6"
                      : temperature < 0
                        ? "#6cc6ff"
                        : temperature < 10
                          ? "#2bd48b"
                          : "#f5923c"
                  }}
                >
                  {tempStr}
                </span>
                <span className="mono text-ghost-300 text-sm pb-1">°C</span>
              </div>
              <div className="h-1.5 rounded-full bg-ink-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, ((temperature + 63) / 77) * 100)}%`,
                    background: temperature < 0
                      ? "linear-gradient(90deg, #1f7fd6, #6cc6ff)"
                      : "linear-gradient(90deg, #2bd48b, #f5923c)"
                  }}
                />
              </div>
            </div>

            {/* habitability */}
            <div className="space-y-1">
              <p className="label-mono text-xs text-ghost-300 uppercase tracking-wider">
                <T v={{ en: "Habitability index", zh: "宜居度指数" }} />
              </p>
              <div className="flex items-baseline gap-2">
                <span className="mono tnum text-3xl font-bold emerald-text">{hab}</span>
                <span className="mono text-ghost-300 text-sm">/ 100</span>
                <span
                  className="ml-auto label-mono text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: hab < 10 ? "rgba(245,146,60,0.12)" : hab < 55 ? "rgba(55,182,246,0.12)" : "rgba(43,212,139,0.12)",
                    color: hab < 10 ? "#f5923c" : hab < 55 ? "#37b6f6" : "#2bd48b"
                  }}
                >
                  {lang === "en" ? habInfo.en : habInfo.zh}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-ink-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${hab}%`,
                    background: "linear-gradient(90deg, #37b6f6, #2bd48b)"
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="label-mono text-xs text-ghost-300">
              <T v={{ en: "Release frozen CO₂ →", zh: "释放冻结的 CO₂ →" }} />
            </span>
            <span className="mono tnum text-sm azure-text font-bold">{sliderVal}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={sliderVal}
            onChange={(e) => setSliderVal(Number(e.target.value))}
            className="w-full accent-azure-400 cursor-pointer"
            style={{ accentColor: "#37b6f6" }}
            aria-label={lang === "en" ? "Atmosphere thickening intensity" : "大气加厚强度"}
          />
          <div className="flex justify-between label-mono text-xs text-ghost-500">
            <span><T v={{ en: "Barren Mars", zh: "荒芜火星" }} /></span>
            <span><T v={{ en: "Temperate", zh: "温和宜居" }} /></span>
            <span><T v={{ en: "Living world", zh: "生机世界" }} /></span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          PART B — biosphere ladder
      ══════════════════════════════════════════ */}
      <div className="space-y-5">
        <div className="rule-azure" />
        <p className="label-mono text-xs text-ghost-300 uppercase tracking-widest">
          <T v={{ en: "Part B — The ladder of closed biospheres", zh: "第二部分 — 封闭生物圈的阶梯" }} />
        </p>

        {/* controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleReset}
            className="label-mono text-xs px-3 py-1.5 rounded-lg border border-ghost-500/30 text-ghost-300 hover:text-azure-300 hover:border-azure-500/40 transition"
          >
            <T v={{ en: "Reset", zh: "重置" }} />
          </button>
          <button
            onClick={handleStep}
            disabled={activeStage >= BIOSPHERE_STAGES.length - 1}
            className="label-mono text-xs px-3 py-1.5 rounded-lg border border-azure-500/30 text-azure-300 hover:bg-azure-500/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <T v={{ en: "Step →", zh: "下一级 →" }} />
          </button>
          <button
            onClick={handlePlayPause}
            className="label-mono text-xs px-4 py-1.5 rounded-lg border transition"
            style={{
              borderColor: playing ? "rgba(43,212,139,0.4)" : "rgba(43,212,139,0.25)",
              color: playing ? "#2bd48b" : "#8798a6",
              background: playing ? "rgba(43,212,139,0.08)" : "transparent"
            }}
          >
            {playing
              ? <T v={{ en: "⏸ Pause", zh: "⏸ 暂停" }} />
              : <T v={{ en: "▶ Play all", zh: "▶ 播放全部" }} />
            }
          </button>
          <span className="ml-auto mono tnum text-xs text-ghost-500">
            {activeStage + 1} / {BIOSPHERE_STAGES.length}
          </span>
        </div>

        {/* stage cards */}
        <div className="space-y-2">
          {BIOSPHERE_STAGES.map((stage: BiosphereStage, idx: number) => {
            const isActive = idx === activeStage;
            const isPast = idx < activeStage;
            return (
              <button
                key={stage.key}
                onClick={() => { stopPlay(); setActiveStage(idx); }}
                className="w-full text-left rounded-xl border transition-all duration-300 p-4 group"
                style={{
                  borderColor: isActive
                    ? `${stage.accent}55`
                    : isPast
                      ? `${stage.accent}22`
                      : "rgba(135,152,166,0.1)",
                  background: isActive
                    ? `${stage.accent}10`
                    : isPast
                      ? `${stage.accent}06`
                      : "transparent",
                  opacity: !isActive && !isPast ? 0.45 : 1,
                }}
              >
                <div className="flex items-start gap-4">
                  {/* index dot */}
                  <div
                    className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center label-mono text-xs font-bold transition-all duration-300"
                    style={{
                      background: isActive ? stage.accent : isPast ? `${stage.accent}30` : "rgba(135,152,166,0.08)",
                      color: isActive ? "#0a0f1c" : isPast ? stage.accent : "#8798a6",
                    }}
                  >
                    {isPast ? "✓" : idx + 1}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    {/* name + scope */}
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <span
                        className="display text-base font-bold"
                        style={{ color: isActive ? stage.accent : isPast ? `${stage.accent}bb` : "#8798a6" }}
                      >
                        {lang === "en" ? stage.name.en : stage.name.zh}
                      </span>
                      <span className="label-mono text-xs text-ghost-500">
                        {lang === "en" ? stage.scope.en : stage.scope.zh}
                      </span>
                    </div>

                    {/* gloss — only show for active + past */}
                    {(isActive || isPast) && (
                      <p className="text-sm leading-snug transition-all duration-300"
                        style={{ color: isActive ? "#c4d4e0" : "#8798a6" }}>
                        {lang === "en" ? stage.gloss.en : stage.gloss.zh}
                      </p>
                    )}

                    {/* scope bar */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex-1 h-0.5 rounded-full bg-ink-700 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: isActive || isPast ? `${((idx + 1) / BIOSPHERE_STAGES.length) * 100}%` : "0%",
                            background: stage.accent,
                            opacity: isActive ? 1 : 0.45,
                          }}
                        />
                      </div>
                      <span className="label-mono text-xs" style={{ color: `${stage.accent}99` }}>
                        L{idx + 1}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── closing bilingual takeaway ── */}
      <div className="space-y-3">
        <div className="rule-azure" />
        <blockquote className="rounded-xl border-l-2 pl-5 py-2 space-y-2"
          style={{ borderColor: "#9a7dfa55" }}>
          <p className="text-sm leading-relaxed text-ghost-300">
            <T v={{
              en: "Every spacecraft is a tiny closed biosphere where every exhaled breath of CO₂ must be scrubbed or the crew dies. To make Mars livable you run a carbon cycle forward on purpose, warming a dead world from the inside. To keep Earth livable you must run ours back toward balance — both demand the same mastery.",
              zh: "每一艘飞船，都是一个微型封闭生物圈——每一口呼出的二氧化碳，必须被洗涤，否则乘员将死。要让火星宜居，你要主动地正向运转碳循环，从内部温暖一颗死寂的世界。要守住地球的宜居，你必须将我们的碳循环拨回平衡——两件事要求的是同一种掌握。"
            }} />
          </p>
          <p className="text-sm leading-relaxed violet-text font-medium">
            <T v={{
              en: "The skill to settle the stars is the skill to not ruin the world we already have.",
              zh: "定居星辰所需的技艺，正是守护我们已拥有的这个世界不被毁坏的技艺。"
            }} />
          </p>
        </blockquote>
      </div>
    </div>
  );
}
