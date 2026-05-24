"use client";

import { useState } from "react";
import { T, useLang } from "./lang";
import {
  FEEDBACKS,
  CLIMATE_SENSITIVITY,
  PREINDUSTRIAL_PPM,
} from "./content";

/* ── helpers ──────────────────────────────────────────────── */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.clamp(t, 0, 1);
}
// Math.clamp polyfill for TS
declare global {
  interface Math {
    clamp(v: number, lo: number, hi: number): number;
  }
}
Math.clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

/** Interpolate between three hex colors at t ∈ [0,1].
 *  t < 0.5 → color0..color1, t >= 0.5 → color1..color2 */
function lerpHex(
  c0: string,
  c1: string,
  c2: string,
  t: number
): string {
  const hex = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const toH = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  const [a, b] = t < 0.5 ? [hex(c0), hex(c1)] : [hex(c1), hex(c2)];
  const s = t < 0.5 ? t * 2 : (t - 0.5) * 2;
  return `#${toH(lerp(a[0], b[0], s))}${toH(lerp(a[1], b[1], s))}${toH(
    lerp(a[2], b[2], s)
  )}`;
}

const AZURE = "#37b6f6";
const GHOST = "#8798a6";
const EMBER = "#f5923c";
const MAX_DT = CLIMATE_SENSITIVITY * Math.log2(1000 / PREINDUSTRIAL_PPM); // ~5.4 °C

/* ── SVG Energy-Balance Diagram ──────────────────────────── */
interface EnergyDiagramProps {
  ppm: number;
  dT: number;
}

function EnergyDiagram({ ppm, dT }: EnergyDiagramProps) {
  const { lang } = useLang();
  // greenhouse opacity: 0 at 278 ppm, 1 at 1000 ppm
  const ghOpacity = Math.clamp((ppm - 278) / 722, 0, 1);
  // fraction of IR that is trapped (absorbed by greenhouse layer)
  const trapped = 0.15 + ghOpacity * 0.55; // 15% to 70%
  const escaped = 1 - trapped;

  const W = 320;
  const H = 300;
  const surfaceY = 220;
  const ghTop = 100;
  const ghBot = 150;
  const ghMid = (ghTop + ghBot) / 2;

  // arrow helper: returns a <path> with arrowhead
  function arrow(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    opacity: number = 1,
    dashed = false
  ) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLen = 7;
    const ax = x2 - headLen * Math.cos(angle - Math.PI / 6);
    const ay = y2 - headLen * Math.sin(angle - Math.PI / 6);
    const bx = x2 - headLen * Math.cos(angle + Math.PI / 6);
    const by = y2 - headLen * Math.sin(angle + Math.PI / 6);
    return (
      <g opacity={opacity} key={`${x1}-${y1}-${x2}-${y2}-${color}`}>
        <path
          d={`M${x1},${y1} L${x2},${y2}`}
          stroke={color}
          strokeWidth={2}
          fill="none"
          strokeDasharray={dashed ? "4 3" : undefined}
        />
        <path
          d={`M${ax},${ay} L${x2},${y2} L${bx},${by}`}
          stroke={color}
          strokeWidth={2}
          fill="none"
        />
      </g>
    );
  }

  // incoming solar arrows (azure) – always pass through
  const incomingSolar = [80, 160, 240].map((x) =>
    arrow(x, 0, x, surfaceY - 8, AZURE, 0.85)
  );

  // outgoing IR arrows from surface upward
  // some escape to space (above greenhouse), some get re-emitted down
  const irPositions = [80, 140, 200, 260];
  const escapeCount = Math.round(escaped * irPositions.length);
  const outgoingIR = irPositions.map((x, i) => {
    const escapes = i < escapeCount;
    return arrow(
      x,
      surfaceY + 4,
      x,
      escapes ? 2 : ghBot - 2,
      "#f59b3c",
      0.8
    );
  });

  // re-emitted arrows going back down (from greenhouse layer)
  const reDownCount = Math.round(trapped * irPositions.length);
  const reDownArrows = irPositions.slice(escapeCount).map((x) =>
    arrow(x, ghMid, x, surfaceY - 6, "#c5631a", 0.75 * ghOpacity, true)
  );

  // escaped IR arrows (those that pass greenhouse, continue to space)
  const escapedArrows = irPositions
    .slice(0, escapeCount)
    .map((x) => arrow(x, ghTop - 2, x, 0, "#f5923c", 0.55));

  const warmColor = lerpHex(AZURE, GHOST, EMBER, Math.clamp(dT / MAX_DT, 0, 1));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: 340, display: "block", margin: "0 auto" }}
      aria-label={
        lang === "zh"
          ? "地球能量平衡图"
          : "Earth energy-balance diagram"
      }
    >
      {/* Space background gradient */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070f1a" />
          <stop offset="60%" stopColor="#0d1b2e" />
          <stop offset="100%" stopColor="#152540" />
        </linearGradient>
        <linearGradient id="surfGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={warmColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={warmColor} stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width={W} height={H} fill="url(#skyGrad)" rx={8} />

      {/* Incoming solar label */}
      <text
        x={6}
        y={14}
        fill={AZURE}
        fontSize={9}
        fontFamily="monospace"
        opacity={0.7}
      >
        {lang === "zh" ? "太阳辐射" : "solar"}
      </text>

      {/* Outgoing IR label */}
      <text
        x={W - 6}
        y={14}
        fill="#f5923c"
        fontSize={9}
        fontFamily="monospace"
        opacity={0.7}
        textAnchor="end"
      >
        {lang === "zh" ? "红外辐射" : "infrared"}
      </text>

      {/* Incoming solar arrows */}
      {incomingSolar}

      {/* Greenhouse layer */}
      <rect
        x={0}
        y={ghTop}
        width={W}
        height={ghBot - ghTop}
        fill="#37b6f6"
        opacity={0.06 + ghOpacity * 0.22}
        rx={4}
      />
      <rect
        x={0}
        y={ghTop}
        width={W}
        height={3}
        fill={AZURE}
        opacity={0.15 + ghOpacity * 0.35}
      />
      <rect
        x={0}
        y={ghBot - 3}
        width={W}
        height={3}
        fill={AZURE}
        opacity={0.1 + ghOpacity * 0.3}
      />
      <text
        x={W / 2}
        y={ghMid + 4}
        fill={AZURE}
        fontSize={9}
        fontFamily="monospace"
        opacity={0.5 + ghOpacity * 0.4}
        textAnchor="middle"
      >
        {lang === "zh"
          ? `温室层 · ${ppm} ppm CO₂`
          : `greenhouse layer · ${ppm} ppm CO₂`}
      </text>

      {/* Outgoing IR from surface */}
      {outgoingIR}

      {/* Re-emitted back down */}
      {reDownArrows}

      {/* IR that escapes to space */}
      {escapedArrows}

      {/* Surface */}
      <rect
        x={0}
        y={surfaceY}
        width={W}
        height={H - surfaceY}
        fill="url(#surfGrad)"
      />
      {/* Surface line */}
      <line
        x1={0}
        y1={surfaceY}
        x2={W}
        y2={surfaceY}
        stroke={warmColor}
        strokeWidth={2}
        opacity={0.7}
      />
      <text
        x={W / 2}
        y={surfaceY + 16}
        fill={warmColor}
        fontSize={9}
        fontFamily="monospace"
        opacity={0.8}
        textAnchor="middle"
      >
        {lang === "zh" ? "地表" : "surface"}
      </text>

      {/* Paris threshold lines at dT=1.5 and dT=2.0 */}
      {/* Shown as a small annotation in the diagram */}
      <text
        x={W - 6}
        y={surfaceY - 6}
        fill={EMBER}
        fontSize={8}
        fontFamily="monospace"
        opacity={0.6}
        textAnchor="end"
      >
        {dT >= 2.0
          ? lang === "zh"
            ? "⚠ 超过 2 °C 巴黎目标"
            : "⚠ past 2 °C Paris target"
          : dT >= 1.5
          ? lang === "zh"
            ? "⚠ 超过 1.5 °C 目标"
            : "⚠ past 1.5 °C target"
          : ""}
      </text>
    </svg>
  );
}

/* ── Thermometer Bar ─────────────────────────────────────── */
interface ThermometerProps {
  dT: number;
}

function Thermometer({ dT }: ThermometerProps) {
  const { lang } = useLang();
  const pct = Math.clamp(dT / MAX_DT, 0, 1);
  const fillColor = lerpHex(AZURE, GHOST, EMBER, pct);

  return (
    <div className="flex flex-col items-center gap-1" style={{ minWidth: 40 }}>
      {/* Vertical bar */}
      <div
        style={{
          width: 28,
          height: 120,
          borderRadius: 14,
          background: "rgba(55,182,246,0.08)",
          border: "1.5px solid rgba(55,182,246,0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Paris 1.5°C marker */}
        <div
          style={{
            position: "absolute",
            bottom: `${Math.clamp(1.5 / MAX_DT, 0, 1) * 100}%`,
            left: 0,
            right: 0,
            height: 1.5,
            background: "#f5923c",
            opacity: 0.5,
          }}
        />
        {/* Paris 2°C marker */}
        <div
          style={{
            position: "absolute",
            bottom: `${Math.clamp(2.0 / MAX_DT, 0, 1) * 100}%`,
            left: 0,
            right: 0,
            height: 1.5,
            background: "#c5631a",
            opacity: 0.6,
          }}
        />
        {/* Fill */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: `${pct * 100}%`,
            background: `linear-gradient(to top, ${fillColor}, ${fillColor}aa)`,
            transition: "height 0.4s ease, background 0.4s ease",
            borderRadius: "0 0 12px 12px",
          }}
        />
      </div>
      <span
        className="label-mono"
        style={{ fontSize: 9, color: GHOST, opacity: 0.7 }}
      >
        {lang === "zh" ? "升温" : "ΔT"}
      </span>
    </div>
  );
}

/* ── Feedback Rows ───────────────────────────────────────── */
function FeedbackRows() {
  const { lang } = useLang();

  const signGlyph = (sign: "+" | "−" | "±") => {
    if (sign === "+") return "▲";
    if (sign === "−") return "▼";
    return "◆";
  };

  const amplifying = FEEDBACKS.filter((f) => f.sign === "+");
  const stabilizing = FEEDBACKS.filter((f) => f.sign === "−");
  const uncertain = FEEDBACKS.filter((f) => f.sign === "±");

  const groupLabel = (
    sign: "+" | "−" | "±",
    color: string,
    en: string,
    zh: string
  ) => (
    <div
      className="flex items-center gap-2 mb-1 mt-3 first:mt-0"
      key={sign}
    >
      <span
        className="label-mono"
        style={{ color, fontSize: 10, letterSpacing: "0.08em" }}
      >
        {signGlyph(sign)}
      </span>
      <span className="label-mono" style={{ color, fontSize: 10, opacity: 0.8 }}>
        {lang === "zh" ? zh : en}
      </span>
    </div>
  );

  const row = (f: (typeof FEEDBACKS)[0]) => (
    <div key={f.key} className="flex flex-col gap-0.5 py-1.5 border-b border-white/5">
      <div className="flex items-center gap-2">
        <span style={{ color: f.accent, fontSize: 13, width: 16, flexShrink: 0 }}>
          {signGlyph(f.sign)}
        </span>
        <span
          className="mono"
          style={{ fontSize: 12, color: "#c8d8e8", flexShrink: 0, minWidth: 130 }}
        >
          <T v={f.name} />
        </span>
        {/* Strength bar */}
        <div
          style={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            background: "rgba(255,255,255,0.06)",
            overflow: "hidden",
            minWidth: 60,
          }}
        >
          <div
            style={{
              width: `${f.strength}%`,
              height: "100%",
              borderRadius: 3,
              background: f.accent,
              opacity: 0.85,
              transition: "width 0.4s ease",
            }}
          />
        </div>
        <span
          className="tnum"
          style={{ fontSize: 10, color: GHOST, width: 26, textAlign: "right", flexShrink: 0 }}
        >
          {f.strength}
        </span>
      </div>
      <div style={{ paddingLeft: 18 }}>
        <span style={{ fontSize: 11, color: GHOST, opacity: 0.75, lineHeight: 1.4 }}>
          <T v={f.gloss} />
        </span>
      </div>
    </div>
  );

  return (
    <div>
      {groupLabel("+", EMBER, "Amplifying — accelerate warming", "放大反馈——加速变暖")}
      {amplifying.map(row)}
      {groupLabel("−", "#2bd48b", "Stabilizing — resist change", "稳定反馈——抵抗变化")}
      {stabilizing.map(row)}
      {groupLabel("±", "#9a7dfa", "Uncertain — could tip either way", "不确定反馈——可能倒向任一方")}
      {uncertain.map(row)}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function ClimateBalance() {
  const { lang } = useLang();
  const [ppm, setPpm] = useState(420);

  const dT = CLIMATE_SENSITIVITY * Math.log2(ppm / PREINDUSTRIAL_PPM);
  const warmColor = lerpHex(AZURE, GHOST, EMBER, Math.clamp(dT / MAX_DT, 0, 1));

  // Paris threshold status
  const parisStatus: "safe" | "warn" | "critical" =
    dT < 1.5 ? "safe" : dT < 2.0 ? "warn" : "critical";

  const parisLabel = {
    safe: {
      en: "Below 1.5 °C Paris target",
      zh: "低于 1.5 °C 巴黎目标",
    },
    warn: {
      en: "Between 1.5 °C and 2 °C targets",
      zh: "1.5 °C 与 2 °C 目标之间",
    },
    critical: {
      en: "Above 2 °C — beyond both Paris targets",
      zh: "超过 2 °C——超出两项巴黎目标",
    },
  }[parisStatus];

  const parisColor =
    parisStatus === "safe"
      ? "#2bd48b"
      : parisStatus === "warn"
      ? EMBER
      : "#c5631a";

  return (
    <div className="holo rounded-2xl p-5 md:p-7">
      {/* Title */}
      <div className="mb-6">
        <h2 className="display text-xl md:text-2xl azure-text mb-1">
          <T v={{ en: "Climate Balance Engine", zh: "气候平衡引擎" }} />
        </h2>
        <p style={{ fontSize: 13, color: GHOST, opacity: 0.8, lineHeight: 1.5 }}>
          <T
            v={{
              en: "Adjust CO₂ concentration to see how Earth's energy balance shifts — and how feedback loops amplify the original push.",
              zh: "调整二氧化碳浓度，观察地球能量平衡如何改变——以及反馈回路如何放大那原初的推力。",
            }}
          />
        </p>
      </div>

      {/* ── Part A: Greenhouse Dial ── */}
      <section className="mb-8">
        <h3
          className="label-mono mb-4"
          style={{ color: AZURE, fontSize: 11, letterSpacing: "0.1em" }}
        >
          <T
            v={{
              en: "A — GREENHOUSE DIAL",
              zh: "A — 温室旋钮",
            }}
          />
        </h3>

        {/* Slider */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="ppm-slider"
              className="label-mono"
              style={{ fontSize: 11, color: GHOST, opacity: 0.8 }}
            >
              <T v={{ en: "Atmospheric CO₂ concentration", zh: "大气二氧化碳浓度" }} />
            </label>
            <span
              className="mono tnum"
              style={{ fontSize: 13, color: AZURE }}
            >
              {ppm} ppm
            </span>
          </div>
          <input
            id="ppm-slider"
            type="range"
            min={278}
            max={1000}
            step={1}
            value={ppm}
            onChange={(e) => setPpm(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: AZURE, cursor: "pointer" }}
          />
          <div
            className="flex justify-between label-mono mt-1"
            style={{ fontSize: 9, color: GHOST, opacity: 0.5 }}
          >
            <span>278 ppm · {lang === "zh" ? "工业化前" : "pre-industrial"}</span>
            <span>420 ppm · {lang === "zh" ? "今日" : "today"}</span>
            <span>1000 ppm</span>
          </div>
        </div>

        {/* dT readout + thermometer + diagram */}
        <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-start">
          {/* Left: dT big readout + thermometer */}
          <div className="flex gap-4 items-start flex-shrink-0">
            <Thermometer dT={dT} />
            <div className="flex flex-col gap-1">
              {/* Big temperature readout */}
              <div
                className="display tnum"
                style={{
                  fontSize: 52,
                  lineHeight: 1,
                  color: warmColor,
                  transition: "color 0.4s ease",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                }}
              >
                {dT >= 0 ? "+" : ""}
                {dT.toFixed(1)}
                <span style={{ fontSize: 22, marginLeft: 2 }}>°C</span>
              </div>
              <div style={{ fontSize: 11, color: GHOST, opacity: 0.75, lineHeight: 1.3, maxWidth: 200 }}>
                <T
                  v={{
                    en: "Warming above pre-industrial",
                    zh: "相对工业化前的升温",
                  }}
                />
              </div>
              {/* Paris status */}
              <div
                className="label-mono mt-2"
                style={{
                  fontSize: 10,
                  color: parisColor,
                  transition: "color 0.4s ease",
                  maxWidth: 200,
                }}
              >
                {lang === "zh" ? parisLabel.zh : parisLabel.en}
              </div>
              {/* Paris threshold ticks */}
              <div
                className="flex flex-col gap-1 mt-2"
                style={{ fontSize: 10, color: GHOST }}
              >
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: 20,
                      height: 1.5,
                      background: dT >= 1.5 ? EMBER : "#8798a6",
                      opacity: 0.7,
                    }}
                  />
                  <span className="tnum" style={{ color: dT >= 1.5 ? EMBER : GHOST }}>
                    +1.5 °C
                  </span>
                  <span style={{ opacity: 0.6, fontSize: 9 }}>
                    <T
                      v={{
                        en: "Paris ambitious",
                        zh: "巴黎目标·积极",
                      }}
                    />
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      width: 20,
                      height: 1.5,
                      background: dT >= 2.0 ? "#c5631a" : "#8798a6",
                      opacity: 0.7,
                    }}
                  />
                  <span
                    className="tnum"
                    style={{ color: dT >= 2.0 ? "#c5631a" : GHOST }}
                  >
                    +2.0 °C
                  </span>
                  <span style={{ opacity: 0.6, fontSize: 9 }}>
                    <T
                      v={{
                        en: "Paris upper limit",
                        zh: "巴黎目标·上限",
                      }}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: SVG energy diagram */}
          <div className="flex-1 w-full" style={{ minWidth: 0 }}>
            <EnergyDiagram ppm={ppm} dT={dT} />
            {/* Diagram caption */}
            <p
              style={{
                fontSize: 10,
                color: GHOST,
                opacity: 0.6,
                textAlign: "center",
                marginTop: 6,
                lineHeight: 1.4,
              }}
            >
              <T
                v={{
                  en: "Incoming solar (azure) passes through; outgoing infrared (orange) is absorbed by the greenhouse layer. Dashed arrows show heat re-emitted back to the surface.",
                  zh: "入射太阳辐射（蓝）穿透大气；出射红外（橙）被温室层吸收。虚线箭头显示热量被重新向下辐射至地表。",
                }}
              />
            </p>
          </div>
        </div>

        {/* Inline physics note */}
        <div
          className="mt-4 rounded-lg px-4 py-3"
          style={{
            background: "rgba(55,182,246,0.06)",
            borderLeft: `2px solid ${AZURE}40`,
          }}
        >
          <span className="label-mono" style={{ fontSize: 10, color: AZURE, opacity: 0.7 }}>
            <T v={{ en: "PHYSICS", zh: "物理学" }} />
          </span>
          <p style={{ fontSize: 11, color: GHOST, opacity: 0.8, marginTop: 3, lineHeight: 1.5 }}>
            <T
              v={{
                en: `ΔT = ${CLIMATE_SENSITIVITY} × log₂(${ppm} ÷ ${PREINDUSTRIAL_PPM}) = ${dT.toFixed(2)} °C  ·  Equilibrium climate sensitivity ~3 °C per CO₂ doubling.`,
                zh: `ΔT = ${CLIMATE_SENSITIVITY} × log₂(${ppm} ÷ ${PREINDUSTRIAL_PPM}) = ${dT.toFixed(2)} °C  ·  均衡气候敏感度约为每倍增二氧化碳 3 °C。`,
              }}
            />
          </p>
        </div>
      </section>

      {/* ── Part B: Feedback Loops ── */}
      <section>
        <h3
          className="label-mono mb-1"
          style={{ color: AZURE, fontSize: 11, letterSpacing: "0.1em" }}
        >
          <T
            v={{
              en: "B — FEEDBACK LOOPS",
              zh: "B — 反馈回路",
            }}
          />
        </h3>
        <p style={{ fontSize: 12, color: GHOST, opacity: 0.75, marginBottom: 16, lineHeight: 1.5 }}>
          <T
            v={{
              en: "Each feedback responds to the warming CO₂ causes and either amplifies or resists it. Bar width ∝ feedback strength (0–100).",
              zh: "每条反馈，都响应于二氧化碳引发的变暖，并进一步放大或抵抗之。条形宽度正比于反馈强度（0–100）。",
            }}
          />
        </p>

        <FeedbackRows />

        {/* Takeaway */}
        <div
          className="mt-5 rounded-lg px-4 py-3"
          style={{
            background: "rgba(245,146,60,0.07)",
            borderLeft: `2px solid ${EMBER}50`,
          }}
        >
          <span
            className="label-mono"
            style={{ fontSize: 10, color: EMBER, opacity: 0.8 }}
          >
            <T v={{ en: "KEY INSIGHT", zh: "核心洞察" }} />
          </span>
          <p style={{ fontSize: 12, color: "#c8d8e8", marginTop: 4, lineHeight: 1.6 }}>
            <T
              v={{
                en: "Amplifying feedbacks — water vapor, ice-albedo, permafrost methane, ocean solubility — collectively dwarf the original CO₂ push. Earth's climate is not a gently self-correcting thermostat: it is a system of tipping balances, capable of lurching from one stable state to another, and right now the amplifiers outweigh the stabilizers by a wide margin.",
                zh: "放大反馈——水汽、冰-反照率、永冻土甲烷、海洋溶解度——合而言之，远超那原初的二氧化碳推力。地球的气候，不是一个温柔自我修正的恒温器：它是一个由临界平衡构成的系统，能够从一个稳定态猛然跌入另一个，而此刻，放大器的力量，以显著的优势压过了稳定器。",
              }}
            />
          </p>
        </div>
      </section>
    </div>
  );
}
