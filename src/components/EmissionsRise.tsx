"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { T, useLang } from "./lang";
import { CO2_CURVE, EMISSION_SOURCES, Co2Point, EmissionSource } from "./content";

/* ── layout constants ─────────────────────────────────────── */
const SVG_W = 720;
const SVG_H = 320;
const PAD = { top: 24, right: 32, bottom: 48, left: 58 };

const YEAR_MIN = 1750;
const YEAR_MAX = 2050;
const PPM_MIN = 260;
const PPM_MAX = 520;
const BASELINE_PPM = 278;

/* ── colour helpers ───────────────────────────────────────── */
function ppmColor(ppm: number): string {
  const t = Math.max(0, Math.min(1, (ppm - PPM_MIN) / (PPM_MAX - PPM_MIN)));
  // azure #37b6f6  →  ember #f5923c
  const r = Math.round(0x37 + t * (0xf5 - 0x37));
  const g = Math.round(0xb6 + t * (0x92 - 0xb6));
  const b = Math.round(0xf6 + t * (0x3c - 0xf6));
  return `rgb(${r},${g},${b})`;
}

/* ── coordinate mapping ───────────────────────────────────── */
function xOf(year: number) {
  return PAD.left + ((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * (SVG_W - PAD.left - PAD.right);
}
function yOf(ppm: number) {
  return PAD.top + ((1 - (ppm - PPM_MIN) / (PPM_MAX - PPM_MIN)) * (SVG_H - PAD.top - PAD.bottom));
}

/* ── nearest point to a given year ───────────────────────── */
function nearestPoint(year: number): Co2Point {
  let best = CO2_CURVE[0];
  let bestDist = Math.abs(CO2_CURVE[0].year - year);
  for (const pt of CO2_CURVE) {
    const d = Math.abs(pt.year - year);
    if (d < bestDist) { best = pt; bestDist = d; }
  }
  return best;
}

/* ── build SVG path d string ─────────────────────────────── */
function buildPath(pts: Co2Point[]): string {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${xOf(p.year).toFixed(1)} ${yOf(p.ppm).toFixed(1)}`).join(" ");
}

/* ── area fill (under curve) ─────────────────────────────── */
function buildArea(pts: Co2Point[]): string {
  const yBase = yOf(PPM_MIN);
  const line = buildPath(pts);
  const last = pts[pts.length - 1];
  const first = pts[0];
  return `${line} L ${xOf(last.year).toFixed(1)} ${yBase.toFixed(1)} L ${xOf(first.year).toFixed(1)} ${yBase.toFixed(1)} Z`;
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function EmissionsRise() {
  const { lang } = useLang();

  /* scrubber state — default 2024 */
  const defaultPt = nearestPoint(2024);
  const [scrubYear, setScrubYear] = useState<number>(2024);
  const [activePt, setActivePt] = useState<Co2Point>(defaultPt);

  /* hover state for emission sources */
  const [hoveredSource, setHoveredSource] = useState<string | null>(null);

  /* animation: reveal curve on mount via stroke-dashoffset */
  const [revealed, setRevealed] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // small delay so the element is painted before we trigger the animation
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        setRevealed(true);
      });
    });
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleScrub = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const yr = Number(e.target.value);
    setScrubYear(yr);
    setActivePt(nearestPoint(yr));
  }, []);

  /* split curve into data segment and projection segment */
  const dataPoints = CO2_CURVE.filter((p) => !p.proj);
  // projection segment starts from the last data point
  const lastData = dataPoints[dataPoints.length - 1];
  const projPoints = CO2_CURVE.filter((p) => p.proj);
  const projSegment = [lastData, ...projPoints];

  /* total path length estimate (rough, for dasharray) */
  const DATA_PATH = buildPath(dataPoints);
  const PROJ_PATH = buildPath(projSegment);

  /* ── y-axis ticks ─────────────────────────────────────── */
  const yTicks = [280, 320, 360, 400, 440, 480, 520].filter(
    (v) => v >= PPM_MIN && v <= PPM_MAX
  );

  /* ── x-axis ticks ─────────────────────────────────────── */
  const xTicks = [1750, 1800, 1850, 1900, 1950, 2000, 2024, 2050];

  /* ── active marker ────────────────────────────────────── */
  const markerX = xOf(activePt.year);
  const markerY = yOf(activePt.ppm);
  const markerColor = ppmColor(activePt.ppm);

  /* ── emission sources total ───────────────────────────── */
  const totalShare = EMISSION_SOURCES.reduce((s, src) => s + src.share, 0);

  /* ── gradient stops for area fill ────────────────────── */
  // We use a vertical gradient from azure (bottom) to ember (top)
  const gradId = "co2-area-grad";
  const strokeGradId = "co2-stroke-grad";

  return (
    <div className="holo rounded-2xl p-5 md:p-7 space-y-8">
      {/* ── header ─────────────────────────────────────────── */}
      <div className="space-y-1">
        <h2 className="display text-xl md:text-2xl azure-text">
          <T v={{ en: "The CO₂ Rise", zh: "二氧化碳的上升" }} />
        </h2>
        <p className="text-ghost-300 text-sm leading-relaxed max-w-2xl">
          <T
            v={{
              en: "For ten thousand years CO₂ sat near 280 ppm. In under two centuries of burning coal, oil and gas — plus cement, land-clearing and agriculture — we pushed it past 420. The deep change is one of rate.",
              zh: "在一万年间，二氧化碳徘徊于百万分之二百八十附近。在不到两百年的燃煤、燃油与燃气之间——加上水泥、砍林与农业——我们把它推过了百万分之四百二十。那个深层的改变，是速率的改变。",
            }}
          />
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════
          PART A — CO₂ CURVE
          ══════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <h3 className="label-mono text-xs text-azure-400 uppercase tracking-widest">
          <T v={{ en: "Atmospheric CO₂ — 1750 to 2050", zh: "大气 CO₂ — 1750 至 2050" }} />
        </h3>

        {/* SVG chart */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full"
            style={{ minWidth: 320 }}
            aria-label={lang === "zh" ? "大气二氧化碳浓度折线图" : "Atmospheric CO₂ concentration line chart"}
          >
            <defs>
              {/* vertical gradient for area fill: azure at bottom, ember near top */}
              <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#37b6f6" stopOpacity="0.12" />
                <stop offset="60%" stopColor="#f5923c" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#f5923c" stopOpacity="0.08" />
              </linearGradient>
              {/* horizontal gradient for stroke: azure left, ember right */}
              <linearGradient id={strokeGradId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#37b6f6" />
                <stop offset="60%" stopColor="#f5923c" />
                <stop offset="100%" stopColor="#f5923c" />
              </linearGradient>
              {/* clip for area only to chart bounds */}
              <clipPath id="chart-clip">
                <rect
                  x={PAD.left}
                  y={PAD.top}
                  width={SVG_W - PAD.left - PAD.right}
                  height={SVG_H - PAD.top - PAD.bottom}
                />
              </clipPath>
            </defs>

            {/* grid lines */}
            {yTicks.map((v) => (
              <line
                key={v}
                x1={PAD.left}
                x2={SVG_W - PAD.right}
                y1={yOf(v)}
                y2={yOf(v)}
                stroke="#8798a6"
                strokeOpacity="0.12"
                strokeWidth="1"
              />
            ))}

            {/* area fill under data curve */}
            <path
              d={buildArea(dataPoints)}
              fill={`url(#${gradId})`}
              clipPath="url(#chart-clip)"
            />

            {/* ── pre-industrial baseline ─────────────────── */}
            <line
              x1={PAD.left}
              x2={SVG_W - PAD.right}
              y1={yOf(BASELINE_PPM)}
              y2={yOf(BASELINE_PPM)}
              stroke="#37b6f6"
              strokeOpacity="0.5"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
            <text
              x={PAD.left + 4}
              y={yOf(BASELINE_PPM) - 5}
              fontSize="9"
              fill="#37b6f6"
              fillOpacity="0.75"
              className="mono"
            >
              {lang === "zh" ? "工业化前基线 278 ppm" : "Pre-industrial baseline 278 ppm"}
            </text>

            {/* ── data curve (solid) ──────────────────────── */}
            <path
              d={DATA_PATH}
              fill="none"
              stroke={`url(#${strokeGradId})`}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 2000,
                strokeDashoffset: revealed ? 0 : 2000,
                transition: "stroke-dashoffset 2s cubic-bezier(0.4,0,0.2,1)",
              }}
            />

            {/* ── projection segment (dashed) ─────────────── */}
            <path
              d={PROJ_PATH}
              fill="none"
              stroke="#f5923c"
              strokeOpacity="0.6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 4"
              style={{
                strokeDashoffset: revealed ? 0 : 500,
                transition: "stroke-dashoffset 2.5s cubic-bezier(0.4,0,0.2,1) 1.8s",
              }}
            />

            {/* ── dot markers at each data point ─────────── */}
            {dataPoints.map((pt) => (
              <circle
                key={pt.year}
                cx={xOf(pt.year)}
                cy={yOf(pt.ppm)}
                r="3"
                fill={ppmColor(pt.ppm)}
                fillOpacity={revealed ? 1 : 0}
                style={{ transition: `opacity 0.4s ease ${0.5 + (pt.year - 1750) / 300}s` }}
              />
            ))}

            {/* projection dot */}
            {projPoints.map((pt) => (
              <circle
                key={pt.year}
                cx={xOf(pt.year)}
                cy={yOf(pt.ppm)}
                r="3"
                fill="#f5923c"
                fillOpacity="0.5"
                strokeDasharray="2 2"
                stroke="#f5923c"
                strokeWidth="1"
              />
            ))}

            {/* ── active scrubber marker ──────────────────── */}
            <line
              x1={markerX}
              x2={markerX}
              y1={PAD.top}
              y2={SVG_H - PAD.bottom}
              stroke={markerColor}
              strokeOpacity="0.4"
              strokeWidth="1"
              strokeDasharray="3 2"
            />
            <circle
              cx={markerX}
              cy={markerY}
              r="6"
              fill={markerColor}
              fillOpacity="0.25"
              stroke={markerColor}
              strokeWidth="1.5"
            />
            <circle
              cx={markerX}
              cy={markerY}
              r="3"
              fill={markerColor}
            />

            {/* ── x-axis ticks ────────────────────────────── */}
            {xTicks.map((yr) => (
              <g key={yr}>
                <line
                  x1={xOf(yr)}
                  x2={xOf(yr)}
                  y1={SVG_H - PAD.bottom}
                  y2={SVG_H - PAD.bottom + 4}
                  stroke="#8798a6"
                  strokeOpacity="0.5"
                  strokeWidth="1"
                />
                <text
                  x={xOf(yr)}
                  y={SVG_H - PAD.bottom + 14}
                  fontSize="9"
                  fill="#8798a6"
                  textAnchor="middle"
                  className="mono tnum"
                >
                  {yr}
                </text>
              </g>
            ))}

            {/* ── y-axis ticks ────────────────────────────── */}
            {yTicks.map((v) => (
              <text
                key={v}
                x={PAD.left - 6}
                y={yOf(v) + 3}
                fontSize="9"
                fill="#8798a6"
                textAnchor="end"
                className="mono tnum"
              >
                {v}
              </text>
            ))}

            {/* y-axis label */}
            <text
              x={14}
              y={SVG_H / 2}
              fontSize="9"
              fill="#8798a6"
              textAnchor="middle"
              transform={`rotate(-90, 14, ${SVG_H / 2})`}
              className="mono"
            >
              ppm CO₂
            </text>

            {/* ── projection label ────────────────────────── */}
            <text
              x={xOf(2050) - 4}
              y={yOf(500) - 10}
              fontSize="8.5"
              fill="#f5923c"
              fillOpacity="0.7"
              textAnchor="end"
              className="mono"
            >
              {lang === "zh" ? "推演" : "projection"}
            </text>
          </svg>
        </div>

        {/* ── year scrubber ─────────────────────────────────── */}
        <div className="space-y-3">
          <input
            type="range"
            min={YEAR_MIN}
            max={YEAR_MAX}
            step={1}
            value={scrubYear}
            onChange={handleScrub}
            className="w-full accent-azure-400 cursor-pointer"
            aria-label={lang === "zh" ? "年份滑块" : "Year scrubber"}
          />

          {/* readout card */}
          <div
            className="rounded-xl border p-4 flex flex-wrap gap-4 items-start"
            style={{
              borderColor: `${markerColor}40`,
              backgroundColor: `${markerColor}0a`,
            }}
          >
            {/* year */}
            <div className="space-y-0.5 min-w-[80px]">
              <div className="label-mono text-[10px] text-ghost-300 uppercase tracking-widest">
                <T v={{ en: "Year", zh: "年份" }} />
              </div>
              <div className="mono tnum text-2xl font-bold" style={{ color: markerColor }}>
                {activePt.year}
              </div>
            </div>

            {/* ppm */}
            <div className="space-y-0.5 min-w-[100px]">
              <div className="label-mono text-[10px] text-ghost-300 uppercase tracking-widest">
                CO₂ (ppm)
              </div>
              <div className="mono tnum text-2xl font-bold" style={{ color: markerColor }}>
                {activePt.ppm}
              </div>
            </div>

            {/* delta from baseline */}
            <div className="space-y-0.5 min-w-[100px]">
              <div className="label-mono text-[10px] text-ghost-300 uppercase tracking-widest">
                <T v={{ en: "Above baseline", zh: "超出基线" }} />
              </div>
              <div
                className="mono tnum text-2xl font-bold"
                style={{ color: activePt.ppm > BASELINE_PPM ? "#f5923c" : "#37b6f6" }}
              >
                {activePt.ppm > BASELINE_PPM ? `+${activePt.ppm - BASELINE_PPM}` : "—"}
              </div>
            </div>

            {/* label */}
            <div className="space-y-0.5 flex-1 min-w-[160px]">
              <div className="label-mono text-[10px] text-ghost-300 uppercase tracking-widest">
                <T v={{ en: "Milestone", zh: "里程碑" }} />
              </div>
              <div className="text-sm text-ghost-50 leading-snug">
                {activePt.label[lang]}
                {activePt.proj && (
                  <span className="ml-2 text-[10px] mono text-ember-300 border border-ember-300/30 rounded px-1">
                    <T v={{ en: "projection", zh: "推演" }} />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          PART B — EMISSION SOURCES
          ══════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <h3 className="label-mono text-xs text-azure-400 uppercase tracking-widest">
          <T v={{ en: "Sources of Emitted Carbon", zh: "碳排放的来源" }} />
        </h3>

        {/* 100% stacked bar */}
        <div
          className="flex w-full rounded-lg overflow-hidden h-8"
          style={{ gap: 1 }}
          role="img"
          aria-label={lang === "zh" ? "碳排放来源堆叠条形图" : "Stacked bar chart of carbon emission sources"}
        >
          {EMISSION_SOURCES.map((src) => {
            const widthPct = (src.share / totalShare) * 100;
            const isHovered = hoveredSource === src.key;
            return (
              <button
                key={src.key}
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: src.accent,
                  opacity: hoveredSource === null || isHovered ? 1 : 0.4,
                  transition: "opacity 0.2s ease",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                onMouseEnter={() => setHoveredSource(src.key)}
                onMouseLeave={() => setHoveredSource(null)}
                onFocus={() => setHoveredSource(src.key)}
                onBlur={() => setHoveredSource(null)}
                aria-label={`${src.name[lang]}: ${src.share}%`}
              />
            );
          })}
        </div>

        {/* source legend / detail rows */}
        <div className="grid gap-2">
          {EMISSION_SOURCES.map((src: EmissionSource) => {
            const widthPct = (src.share / totalShare) * 100;
            const isActive = hoveredSource === src.key;
            return (
              <div
                key={src.key}
                className="rounded-lg p-3 cursor-pointer transition-all"
                style={{
                  backgroundColor: isActive ? `${src.accent}18` : "transparent",
                  border: `1px solid ${isActive ? src.accent + "50" : "#8798a620"}`,
                }}
                onMouseEnter={() => setHoveredSource(src.key)}
                onMouseLeave={() => setHoveredSource(null)}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  {/* color swatch + name */}
                  <div className="flex items-center gap-2 min-w-[120px]">
                    <div
                      className="w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: src.accent }}
                    />
                    <span className="text-sm font-medium text-ghost-50">
                      {src.name[lang]}
                    </span>
                  </div>

                  {/* bar within row */}
                  <div className="flex-1 min-w-[80px]">
                    <div className="h-1.5 rounded-full bg-ghost-700/40 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${widthPct}%`,
                          backgroundColor: src.accent,
                          opacity: isActive ? 1 : 0.65,
                        }}
                      />
                    </div>
                  </div>

                  {/* share % */}
                  <span
                    className="mono tnum text-sm font-bold min-w-[40px] text-right"
                    style={{ color: src.accent }}
                  >
                    {src.share}%
                  </span>
                </div>

                {/* gloss — visible when hovered */}
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: isActive ? "4rem" : 0,
                    opacity: isActive ? 1 : 0,
                    marginTop: isActive ? "0.5rem" : 0,
                  }}
                >
                  <p className="text-xs text-ghost-300 leading-relaxed pl-5">
                    {src.gloss[lang]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* sub-caption */}
        <p className="text-xs text-ghost-300 leading-relaxed border-l-2 border-azure-500/30 pl-3">
          <T
            v={{
              en: "Shares are approximate % of annual human CO₂-equivalent emissions. Hover a source to read its gloss.",
              zh: "各比例为年度人为二氧化碳当量排放的大致百分比。悬停可查看注释。",
            }}
          />
        </p>
      </div>
    </div>
  );
}
