"use client";

import { useState } from "react";
import { T, useLang } from "./lang";
import { GEO_INTERVENTIONS, GEO_RISKS, type GeoIntervention } from "./content";

/* ─── helpers ─────────────────────────────────────────────── */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function lerpHex(hexA: string, hexB: string, t: number): string {
  const parse = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [ar, ag, ab] = parse(hexA);
  const [br, bg, bb] = parse(hexB);
  const r = Math.round(lerp(ar, br, t));
  const g = Math.round(lerp(ag, bg, t));
  const b = Math.round(lerp(ab, bb, t));
  return `rgb(${r},${g},${b})`;
}

const HOT_COLOR = "#f5923c";   // ember
const COOL_COLOR = "#37b6f6";  // azure
const WARM_COLOR = "#f5c45e";  // ember-warm mid
const ATMO_RISK = "#9a7dfa";   // violet
const EMERALD = "#2bd48b";
const EMBER = "#f5923c";

/* risk meter weight per GeoRisk index (0..3) */
// 0=termination shock, 1=governance, 2=regional disruption, 3=moral hazard
function riskWeight(idx: number, intensity: number): number {
  const t = intensity / 100;
  switch (idx) {
    case 0: return Math.min(1, t * t * 2.2);           // termination shock: spike near high
    case 1: return Math.min(1, 0.2 + t * 0.8);        // governance: rises steadily
    case 2: return Math.min(1, t * 0.9);               // regional: proportional
    case 3: return Math.min(1, 0.1 + t * 0.6);        // moral hazard: grows but plateaus
    default: return t;
  }
}

/* ─── PlanetSVG ───────────────────────────────────────────── */
function PlanetSVG({ intensity }: { intensity: number }) {
  const t = intensity / 100;
  const planetColor = lerpHex(HOT_COLOR, COOL_COLOR, t);
  const hazeOpacity = lerp(0, 0.55, t);
  const hazeRadius = lerp(0, 18, t);
  const hazeStrokeWidth = lerp(0, 12, t);
  // reflected rays: at t=0 all rays hit; at t=1 more arrows curve away
  const totalRays = 8;
  const reflectedRays = Math.round(t * 6);

  return (
    <svg viewBox="0 0 200 200" width="200" height="200" aria-label="planet diagram">
      {/* space background */}
      <circle cx="100" cy="100" r="98" fill="#070d1a" />

      {/* stars */}
      {[
        [20,30],[170,25],[15,140],[185,155],[35,175],[165,70],
        [90,18],[140,185],[50,60],[155,110],[80,175],[10,90],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.8" fill="white" opacity={0.5 + (i % 3) * 0.15} />
      ))}

      {/* sun (top-centre, small) */}
      <circle cx="100" cy="22" r="10" fill="#ffd060" />
      {/* sun rays */}
      {Array.from({ length: totalRays }).map((_, i) => {
        const angle = (i / totalRays) * Math.PI * 2 - Math.PI / 2;
        const isReflected = i < reflectedRays;
        const x1 = 100 + Math.cos(angle) * 13;
        const y1 = 22 + Math.sin(angle) * 13;
        const x2 = 100 + Math.cos(angle) * 20;
        const y2 = 22 + Math.sin(angle) * 20;
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={isReflected ? "#ffffff" : "#ffd060"}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={isReflected ? 0.9 : 0.7}
          />
        );
      })}

      {/* reflected beam lines from sun curving away (visualise scattering) */}
      {Array.from({ length: reflectedRays }).map((_, i) => {
        const frac = (i + 0.5) / Math.max(reflectedRays, 1);
        const startX = 100 + lerp(-18, 18, frac);
        const startY = 35;
        const endX = 100 + lerp(-50, 50, frac);
        const endY = 60;
        return (
          <line
            key={`r${i}`}
            x1={startX} y1={startY} x2={endX} y2={endY}
            stroke="white"
            strokeWidth="1"
            strokeDasharray="2 3"
            opacity={0.55 * t}
          />
        );
      })}

      {/* sulfate haze ring */}
      {hazeRadius > 0 && (
        <circle
          cx="100" cy="115"
          r={52 + hazeRadius * 0.5}
          fill="none"
          stroke={lerpHex("#a9def8", "#e8e8f0", t)}
          strokeWidth={hazeStrokeWidth}
          opacity={hazeOpacity}
        />
      )}

      {/* Earth glowing fill */}
      <radialGradient id="planet-glow" cx="40%" cy="38%" r="60%">
        <stop offset="0%" stopColor={lerpHex("#ffffff", "#a9def8", t)} stopOpacity="0.4" />
        <stop offset="100%" stopColor={planetColor} stopOpacity="1" />
      </radialGradient>
      <circle cx="100" cy="115" r="52" fill="url(#planet-glow)" />

      {/* subtle continent blobs */}
      <ellipse cx="90" cy="105" rx="16" ry="10" fill={lerpHex("#c06020", "#2a6a40", t)} opacity="0.45" />
      <ellipse cx="115" cy="125" rx="10" ry="7" fill={lerpHex("#b05010", "#256035", t)} opacity="0.4" />
      <ellipse cx="82" cy="128" rx="8" ry="5" fill={lerpHex("#c06020", "#2a6a40", t)} opacity="0.35" />

      {/* hot glow border when warm */}
      {t < 0.8 && (
        <circle
          cx="100" cy="115" r="52"
          fill="none"
          stroke={EMBER}
          strokeWidth={lerp(6, 0, t)}
          opacity={lerp(0.5, 0, t)}
        />
      )}

      {/* cool azure border when cooled */}
      {t > 0.2 && (
        <circle
          cx="100" cy="115" r="52"
          fill="none"
          stroke={COOL_COLOR}
          strokeWidth={lerp(0, 4, t)}
          opacity={lerp(0, 0.5, t)}
        />
      )}
    </svg>
  );
}

/* ─── TriBar: three colored bars ──────────────────────────── */
function TriBar({
  leverage, reversibility, risk,
}: {
  leverage: number; reversibility: number; risk: number;
}) {
  const bars: { label: { en: string; zh: string }; val: number; color: string }[] = [
    { label: { en: "Leverage", zh: "杠杆" }, val: leverage, color: ATMO_RISK },
    { label: { en: "Reversibility", zh: "可逆性" }, val: reversibility, color: EMERALD },
    { label: { en: "Risk", zh: "风险" }, val: risk, color: EMBER },
  ];
  return (
    <div className="flex flex-col gap-1 mt-1">
      {bars.map((b) => (
        <div key={b.label.en} className="flex items-center gap-2">
          <span className="label-mono text-ghost-300 w-[72px] shrink-0 text-right" style={{ fontSize: "0.62rem" }}>
            <T v={b.label} />
          </span>
          <div className="flex-1 bg-ink-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${b.val}%`, background: b.color, opacity: 0.85 }}
            />
          </div>
          <span className="mono tnum text-ghost-400" style={{ fontSize: "0.6rem", width: "24px" }}>
            {b.val}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── main component ──────────────────────────────────────── */
export default function GeoengineeringSim() {
  const { lang } = useLang();
  const [intensity, setIntensity] = useState(0);
  const [selected, setSelected] = useState<GeoIntervention | null>(null);

  const tempOffset = -((intensity / 100) * 2.0);
  const t = intensity / 100;

  return (
    <div className="holo rounded-2xl p-5 md:p-7">
      {/* ── header ── */}
      <div className="mb-6">
        <p className="label-mono azure-text text-xs tracking-widest mb-1">
          <T v={{ en: "SOLAR RADIATION MANAGEMENT SIM", zh: "太阳辐射管理模拟" }} />
        </p>
        <h2 className="display text-2xl md:text-3xl text-white mb-2">
          <T v={{ en: "Geoengineering: A Borrowed Thermostat", zh: "地球工程：一只借来的恒温器" }} />
        </h2>
        <p className="text-ghost-300 text-sm leading-relaxed max-w-2xl">
          <T v={{
            en: "Solar geoengineering can lower temperatures within months — but masks the cause, leaves oceans acidifying, and answers to nobody. Drag the dial.",
            zh: "太阳地球工程能在数月内降低气温——却只遮掩病因，让海洋持续酸化，且无从问责。拨动旋钮。",
          }} />
        </p>
        <div className="rule-azure mt-4" />
      </div>

      {/* ── PART A: shading dial + planet ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* left: slider controls + readouts */}
        <div className="flex flex-col gap-5">
          {/* slider */}
          <div>
            <label className="block label-mono text-ghost-300 text-xs tracking-widest mb-2">
              <T v={{ en: "SHADING INTENSITY — AEROSOL / CLOUD BRIGHTENING", zh: "遮阳强度——气溶胶 / 云增亮" }} />
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-azure-400 cursor-pointer"
              aria-label="Shading intensity"
            />
            <div className="flex justify-between label-mono text-ghost-500 text-xs mt-1">
              <span><T v={{ en: "0% — no intervention", zh: "0% — 无干预" }} /></span>
              <span className="mono tnum azure-text">{intensity}%</span>
              <span><T v={{ en: "100% — maximum", zh: "100% — 最大强度" }} /></span>
            </div>
          </div>

          {/* temperature offset readout */}
          <div className="bg-ink-900/60 border border-ink-700 rounded-xl p-4">
            <p className="label-mono text-ghost-400 text-xs tracking-widest mb-1">
              <T v={{ en: "TEMPERATURE OFFSET", zh: "温度补偿" }} />
            </p>
            <div
              className="mono tnum text-4xl font-bold transition-colors duration-500"
              style={{ color: intensity === 0 ? EMBER : COOL_COLOR }}
            >
              {tempOffset === 0 ? "±0.0" : tempOffset.toFixed(1)}°C
            </div>
            <p className="text-ghost-400 text-xs mt-1">
              {intensity === 0
                ? <T v={{ en: "No shading — baseline warming", zh: "无遮阳——基线升温" }} />
                : <T v={{ en: "Masked warming — not removed, only hidden", zh: "升温被掩盖——未被消除，只是隐藏" }} />}
            </p>
          </div>

          {/* ocean pH warning — ALWAYS RED */}
          <div className="bg-ink-900/60 border border-ember-500/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-ember-400 animate-pulse" />
              <p className="label-mono ember-text text-xs tracking-widest">
                <T v={{ en: "OCEAN pH — UNAFFECTED BY SHADING", zh: "海洋 pH——不受遮阳影响" }} />
              </p>
            </div>
            <div className="mono tnum text-2xl font-bold" style={{ color: EMBER }}>
              pH 7.95 <span className="text-base opacity-70">↓</span>
            </div>
            <p className="text-ghost-400 text-xs mt-1 leading-relaxed">
              <T v={{
                en: "CO₂ absorbed by oceans drives acidification regardless of the shade overhead. Shading treats the fever, not the poison.",
                zh: "海洋吸收的 CO₂ 导致酸化，与头顶的遮蔽无关。遮阳治的是发烧，不是毒素。",
              }} />
            </p>
          </div>

          {/* intensity annotation */}
          {intensity >= 70 && (
            <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-3 rise-in">
              <p className="label-mono violet-text text-xs tracking-widest mb-1">
                <T v={{ en: "HIGH INTENSITY WARNING", zh: "高强度警告" }} />
              </p>
              <p className="text-ghost-300 text-xs leading-relaxed">
                <T v={{
                  en: "At this level, termination shock becomes acute: stopping abruptly could unleash decades of masked warming in years.",
                  zh: "在此强度下，终止冲击变得尖锐：骤然停止，可能在数年内释放数十年被掩盖的升温。",
                }} />
              </p>
            </div>
          )}
        </div>

        {/* right: animated planet */}
        <div className="flex flex-col items-center justify-center gap-4">
          <PlanetSVG intensity={intensity} />
          <div className="text-center">
            <p className="label-mono text-ghost-400 text-xs tracking-wider">
              {intensity < 20
                ? <T v={{ en: "Hot — unshaded planet", zh: "炎热——未遮阳的行星" }} />
                : intensity < 60
                ? <T v={{ en: "Sulfate veil forming", zh: "硫酸盐面纱正在形成" }} />
                : <T v={{ en: "Cooled — masked, not healed", zh: "冷却——被遮掩，而非被治愈" }} />}
            </p>
            <p className="text-ghost-500 text-xs mt-0.5">
              <T v={{ en: "Reflected rays ↑ · Haze ring thickens", zh: "反射光线↑ · 雾环加厚" }} />
            </p>
          </div>
        </div>
      </div>

      {/* ── PART B: Risk meters ── */}
      <div className="mb-8">
        <p className="label-mono text-ghost-400 text-xs tracking-widest mb-4 border-b border-ink-700 pb-2">
          <T v={{ en: "SRM RISK PROFILE AT CURRENT INTENSITY", zh: "当前强度下的 SRM 风险图谱" }} />
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GEO_RISKS.map((risk, idx) => {
            const fill = riskWeight(idx, intensity);
            const isHigh = fill > 0.7;
            return (
              <div
                key={risk.name.en}
                className="bg-ink-900/50 border border-ink-700 rounded-xl p-4 transition-all duration-300"
                style={{
                  borderColor: isHigh ? `${EMBER}55` : undefined,
                  background: isHigh ? `rgba(245,146,60,0.05)` : undefined,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-ghost-200 text-sm font-medium">
                    <T v={risk.name} />
                  </span>
                  <span
                    className="mono tnum text-sm font-bold transition-colors duration-300"
                    style={{ color: isHigh ? EMBER : "#8798a6" }}
                  >
                    {Math.round(fill * 100)}%
                  </span>
                </div>
                {/* risk bar */}
                <div className="w-full bg-ink-800 rounded-full h-2 mb-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${fill * 100}%`,
                      background: fill > 0.7
                        ? EMBER
                        : fill > 0.4
                        ? lerpHex(ATMO_RISK, EMBER, (fill - 0.4) / 0.3)
                        : ATMO_RISK,
                    }}
                  />
                </div>
                <p className="text-ghost-400 text-xs leading-relaxed">
                  <T v={risk.gloss} />
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── PART B2: intervention comparison ── */}
      <div className="mb-8">
        <p className="label-mono text-ghost-400 text-xs tracking-widest mb-1 border-b border-ink-700 pb-2">
          <T v={{ en: "INTERVENTION COMPARISON — click to inspect", zh: "干预手段对比——点击查看" }} />
        </p>
        <p className="text-ghost-500 text-xs mb-4">
          <T v={{
            en: "High-leverage = high-risk. The safest options barely move the needle.",
            zh: "高杠杆＝高风险。最安全的选项几乎无法撼动指针。",
          }} />
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GEO_INTERVENTIONS.map((iv) => {
            const isActive = selected?.key === iv.key;
            return (
              <button
                key={iv.key}
                onClick={() => setSelected(isActive ? null : iv)}
                className="text-left bg-ink-900/50 border rounded-xl p-4 transition-all duration-200 hover:border-opacity-80 focus:outline-none focus:ring-1 focus:ring-azure-500"
                style={{
                  borderColor: isActive ? iv.accent : "#1e2e3f",
                  background: isActive ? `${iv.accent}12` : undefined,
                }}
                aria-pressed={isActive}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ background: iv.accent }}
                  />
                  <span className="text-ghost-100 text-sm font-medium leading-snug">
                    <T v={iv.name} />
                  </span>
                </div>
                <TriBar leverage={iv.leverage} reversibility={iv.reversibility} risk={iv.risk} />
                {isActive && (
                  <p className="text-ghost-300 text-xs mt-3 pt-3 border-t border-ink-700 leading-relaxed rise-in">
                    <T v={iv.gloss} />
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* key insight callout */}
        <div className="mt-4 bg-ink-900/40 border border-ink-700 rounded-xl p-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="mono tnum text-lg font-bold" style={{ color: ATMO_RISK }}>
              <T v={{ en: "Leverage", zh: "杠杆" }} />
            </div>
            <p className="text-ghost-400 text-xs">
              <T v={{ en: "violet bars", zh: "紫色柱" }} />
            </p>
          </div>
          <div>
            <div className="mono tnum text-lg font-bold" style={{ color: EMERALD }}>
              <T v={{ en: "Reversibility", zh: "可逆性" }} />
            </div>
            <p className="text-ghost-400 text-xs">
              <T v={{ en: "emerald bars", zh: "翠绿柱" }} />
            </p>
          </div>
          <div>
            <div className="mono tnum text-lg font-bold" style={{ color: EMBER }}>
              <T v={{ en: "Risk", zh: "风险" }} />
            </div>
            <p className="text-ghost-400 text-xs">
              <T v={{ en: "ember bars", zh: "琥珀柱" }} />
            </p>
          </div>
        </div>
      </div>

      {/* ── takeaway ── */}
      <div className="border border-ink-700 rounded-xl p-5 bg-ink-900/30">
        <p className="label-mono violet-text text-xs tracking-widest mb-3">
          <T v={{ en: "THE CENTRAL DILEMMA", zh: "核心困境" }} />
        </p>
        <p className="text-ghost-200 text-sm leading-relaxed mb-3">
          <T v={{
            en: "Geoengineering is a tourniquet, not a cure. It can buy time — or license us to keep emitting while the underlying CO₂ continues dissolving in the oceans. The deepest problem is not technical.",
            zh: "地球工程是一根止血带，而非良方。它可以争取时间——或者准许我们继续排放，同时底层的 CO₂ 持续溶解于海洋。最深层的问题并非技术性的。",
          }} />
        </p>
        <p className="text-ghost-200 text-sm leading-relaxed font-medium" style={{ color: ATMO_RISK }}>
          <T v={{
            en: "Who sets the thermostat of a planet that belongs to everyone?",
            zh: "谁来设定这颗属于所有人的行星的恒温器？",
          }} />
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-ink-800/50 rounded-lg p-3">
            <p className="label-mono ember-text text-xs mb-1">
              <T v={{ en: "SYMPTOM TREATED", zh: "被治疗的症状" }} />
            </p>
            <p className="text-ghost-300 text-xs leading-relaxed">
              <T v={{ en: "Surface temperature — masked, stabilised, reversed within months.", zh: "地表温度——被掩盖、稳定，可在数月内逆转。" }} />
            </p>
          </div>
          <div className="bg-ink-800/50 rounded-lg p-3">
            <p className="label-mono azure-text text-xs mb-1">
              <T v={{ en: "CAUSE UNTREATED", zh: "未被治疗的病因" }} />
            </p>
            <p className="text-ghost-300 text-xs leading-relaxed">
              <T v={{ en: "Atmospheric CO₂ and ocean acidification — unaffected by any shade.", zh: "大气 CO₂ 与海洋酸化——不受任何遮蔽的影响。" }} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
