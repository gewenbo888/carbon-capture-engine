"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { T, useLang } from "./lang";
import { BIO_SYSTEMS, BioSystem, OCEAN_PUMP } from "./content";

/* ─── types ──────────────────────────────────────────────────────────── */
type Particle = { x: number; y: number; size: number; speed: number; alpha: number; wobble: number; wobbleSpeed: number };

/* ─── helpers ────────────────────────────────────────────────────────── */
const W = 480;   // SVG viewBox width for scatter plot
const H = 380;   // SVG viewBox height for scatter plot
const PAD = 52;  // axis padding

function toSvgX(durability: number) { return PAD + (durability / 100) * (W - PAD * 2); }
function toSvgY(capacity: number) { return H - PAD - (capacity / 100) * (H - PAD * 2); }

/* ─── scatter chart ──────────────────────────────────────────────────── */
function ScatterChart() {
  const { lang } = useLang();
  const [hovered, setHovered] = useState<BioSystem | null>(null);

  const quadrants: { x: number; y: number; w: number; h: number; label: { en: string; zh: string } }[] = [
    { x: PAD, y: PAD, w: (W - PAD * 2) / 2, h: (H - PAD * 2) / 2, label: { en: "high capacity\nlow durability", zh: "高吸纳\n低持久" } },
    { x: PAD + (W - PAD * 2) / 2, y: PAD, w: (W - PAD * 2) / 2, h: (H - PAD * 2) / 2, label: { en: "high capacity\nhigh durability", zh: "高吸纳\n高持久" } },
    { x: PAD, y: PAD + (H - PAD * 2) / 2, w: (W - PAD * 2) / 2, h: (H - PAD * 2) / 2, label: { en: "low capacity\nlow durability", zh: "低吸纳\n低持久" } },
    { x: PAD + (W - PAD * 2) / 2, y: PAD + (H - PAD * 2) / 2, w: (W - PAD * 2) / 2, h: (H - PAD * 2) / 2, label: { en: "low capacity\nhigh durability", zh: "低吸纳\n高持久" } },
  ];

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label={lang === "zh" ? "生物碳汇：容量与持久性散点图" : "Biological carbon sinks: capacity vs durability scatter plot"}>
        {/* quadrant fills */}
        {quadrants.map((q, i) => (
          <rect key={i} x={q.x} y={q.y} width={q.w} height={q.h}
            fill={i === 1 ? "#2bd48b" : i === 0 ? "#37b6f6" : "#9a7dfa"}
            fillOpacity={i === 0 ? 0.05 : i === 1 ? 0.07 : 0.03}
          />
        ))}
        {/* quadrant labels */}
        {quadrants.map((q, i) => {
          const lines = q.label[lang].split("\n");
          const cx = q.x + q.w / 2;
          const cy = q.y + q.h / 2;
          return (
            <g key={i}>
              {lines.map((line, li) => (
                <text key={li} x={cx} y={cy - 8 + li * 16} textAnchor="middle"
                  fill="#8798a6" fillOpacity={0.45} fontSize={10} fontFamily="monospace">
                  {line}
                </text>
              ))}
            </g>
          );
        })}
        {/* axis grid lines */}
        {[25, 50, 75].map(v => (
          <g key={v}>
            <line x1={toSvgX(v)} y1={PAD} x2={toSvgX(v)} y2={H - PAD} stroke="#8798a6" strokeOpacity={0.12} strokeDasharray="4 4" />
            <line x1={PAD} y1={toSvgY(v)} x2={W - PAD} y2={toSvgY(v)} stroke="#8798a6" strokeOpacity={0.12} strokeDasharray="4 4" />
          </g>
        ))}
        {/* midpoint crosshair */}
        <line x1={toSvgX(50)} y1={PAD} x2={toSvgX(50)} y2={H - PAD} stroke="#8798a6" strokeOpacity={0.25} />
        <line x1={PAD} y1={toSvgY(50)} x2={W - PAD} y2={toSvgY(50)} stroke="#8798a6" strokeOpacity={0.25} />
        {/* axes */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#8798a6" strokeOpacity={0.5} />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#8798a6" strokeOpacity={0.5} />
        {/* axis tick labels */}
        {[0, 25, 50, 75, 100].map(v => (
          <g key={v}>
            <text x={toSvgX(v)} y={H - PAD + 14} textAnchor="middle" fill="#8798a6" fontSize={9} fontFamily="monospace">{v}</text>
            <text x={PAD - 6} y={toSvgY(v) + 4} textAnchor="end" fill="#8798a6" fontSize={9} fontFamily="monospace">{v}</text>
          </g>
        ))}
        {/* axis titles */}
        <text x={(PAD + W - PAD) / 2} y={H - 4} textAnchor="middle" fill="#8798a6" fontSize={10} fontFamily="monospace">
          {lang === "zh" ? "持久性 →" : "Durability →"}
        </text>
        <text x={12} y={(PAD + H - PAD) / 2} textAnchor="middle" fill="#8798a6" fontSize={10} fontFamily="monospace"
          transform={`rotate(-90, 12, ${(PAD + H - PAD) / 2})`}>
          {lang === "zh" ? "容量 →" : "Capacity →"}
        </text>
        {/* bubbles */}
        {BIO_SYSTEMS.map((sys) => {
          const cx = toSvgX(sys.durability);
          const cy = toSvgY(sys.capacity);
          const r = 14 + (sys.capacity / 100) * 8;
          const isHov = hovered?.key === sys.key;
          return (
            <g key={sys.key} style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(sys)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setHovered(isHov ? null : sys)}>
              <circle cx={cx} cy={cy} r={r + 6} fill={sys.accent} fillOpacity={isHov ? 0.12 : 0} />
              <circle cx={cx} cy={cy} r={r} fill={sys.accent} fillOpacity={isHov ? 0.9 : 0.72}
                stroke={sys.accent} strokeWidth={isHov ? 2 : 1} strokeOpacity={0.8} />
              <text x={cx} y={cy - r - 5} textAnchor="middle" fill={sys.accent} fontSize={9.5} fontFamily="monospace" fontWeight={600}>
                {sys.name[lang]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* hover detail card */}
      {hovered && (
        <div className="mt-3 rounded-xl border border-ghost-700/40 bg-ink-900/80 p-4 backdrop-blur-sm" style={{ borderColor: hovered.accent + "44" }}>
          <div className="flex items-start justify-between gap-3">
            <p className="display text-sm font-semibold" style={{ color: hovered.accent }}>
              <T v={hovered.name} />
            </p>
            <button onClick={() => setHovered(null)} className="text-ghost-500 hover:text-ghost-300 text-xs mt-0.5">✕</button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="label-mono mb-1 text-[10px]">
                <T v={{ en: "Capacity", zh: "吸纳容量" }} />
              </p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-ink-700">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${hovered.capacity}%`, background: hovered.accent }} />
                </div>
                <span className="mono tnum text-xs" style={{ color: hovered.accent }}>{hovered.capacity}</span>
              </div>
            </div>
            <div>
              <p className="label-mono mb-1 text-[10px]">
                <T v={{ en: "Durability", zh: "持久程度" }} />
              </p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 rounded-full bg-ink-700">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${hovered.durability}%`, background: "#6cc6ff" }} />
                </div>
                <span className="mono tnum azure-text text-xs">{hovered.durability}</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-ghost-300 leading-relaxed">
            <T v={hovered.gloss} />
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── ocean pump canvas ───────────────────────────────────────────────── */
function OceanPump() {
  const { lang } = useLang();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  const spawnParticle = useCallback((canvasWidth: number): Particle => ({
    x: 10 + Math.random() * (canvasWidth - 20),
    y: Math.random() * 60,
    size: 0.8 + Math.random() * 2.2,
    speed: 0.25 + Math.random() * 0.55,
    alpha: 0.25 + Math.random() * 0.55,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.008 + Math.random() * 0.018,
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? (window.devicePixelRatio || 1) : 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    // init particles
    particlesRef.current = Array.from({ length: 60 }, () => {
      const p = spawnParticle(W);
      p.y = Math.random() * H; // spread initially
      return p;
    });

    const stageH = H / 4;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // ocean gradient background
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "rgba(169, 222, 248, 0.18)");
      grad.addColorStop(0.15, "rgba(108, 198, 255, 0.15)");
      grad.addColorStop(0.4, "rgba(55, 182, 246, 0.12)");
      grad.addColorStop(0.7, "rgba(31, 127, 214, 0.1)");
      grad.addColorStop(1, "rgba(7, 12, 21, 0.35)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // stage dividers (faint)
      [1, 2, 3].forEach(i => {
        ctx.beginPath();
        ctx.moveTo(0, i * stageH);
        ctx.lineTo(W, i * stageH);
        ctx.strokeStyle = "rgba(135, 152, 166, 0.12)";
        ctx.setLineDash([5, 8]);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // update & draw particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speed;
        p.wobble += p.wobbleSpeed;
        p.x += Math.sin(p.wobble) * 0.35;

        // fade as sinks deeper
        const depth = p.y / H;
        const fadeAlpha = p.alpha * (1 - depth * 0.55);

        // color shifts from azure → deep blue → near invisible at bottom
        const r = Math.round(169 - depth * 100);
        const g = Math.round(222 - depth * 150);
        const b = Math.round(248 - depth * 80);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${fadeAlpha})`;
        ctx.fill();

        // settle at bottom: tiny "settled" particles
        if (p.y >= H - 12) {
          ctx.beginPath();
          ctx.arc(p.x, H - 4, p.size * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(108, 198, 255, 0.25)`;
          ctx.fill();
          // respawn at surface
          particlesRef.current[i] = spawnParticle(W);
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [spawnParticle]);

  const stageColors = ["#a9def8", "#6cc6ff", "#37b6f6", "#1f7fd6"];

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ minHeight: 360 }}>
      {/* canvas sits behind the label overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full rounded-xl" style={{ zIndex: 0 }} />

      {/* stage labels overlaid */}
      <div className="relative z-10 flex flex-col" style={{ minHeight: 360 }}>
        {OCEAN_PUMP.map((stage, i) => (
          <div key={i} className="flex flex-1 items-center px-4 py-2 gap-3" style={{ borderBottom: i < 3 ? "1px solid rgba(135,152,166,0.1)" : "none" }}>
            {/* accent dot */}
            <div className="flex-shrink-0 w-2 h-2 rounded-full" style={{ background: stageColors[i], boxShadow: `0 0 6px ${stageColors[i]}88` }} />
            <div className="flex-1 min-w-0">
              <p className="mono text-xs font-semibold tracking-wide" style={{ color: stageColors[i] }}>
                <T v={stage.name} />
              </p>
              <p className="text-[11px] text-ghost-400 mt-0.5 leading-snug">
                <T v={stage.gloss} />
              </p>
            </div>
            {/* depth indicator */}
            <span className="mono tnum text-[10px] text-ghost-600 flex-shrink-0">
              {i === 0 ? "0 m" : i === 1 ? "200 m" : i === 2 ? "1 000 m" : "4 000 m"}
            </span>
          </div>
        ))}
      </div>

      {/* surface light shimmer */}
      <div className="absolute top-0 left-0 right-0 h-10 rounded-t-xl pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(169,222,248,0.13), transparent)", zIndex: 5 }} />
    </div>
  );
}

/* ─── main export ────────────────────────────────────────────────────── */
export default function BiosphereCarbon() {
  const { lang } = useLang();

  return (
    <div className="holo rounded-2xl p-5 md:p-7">
      {/* section header */}
      <div className="mb-6">
        <p className="label-mono emerald-text mb-1 text-xs tracking-widest uppercase">
          <T v={{ en: "Biological & Oceanic Carbon Systems", zh: "生物与海洋的碳系统" }} />
        </p>
        <h2 className="display text-xl font-bold text-ghost-50 leading-tight">
          <T v={{ en: "The Living Carbon Machinery", zh: "活着的碳机械" }} />
        </h2>
        <p className="mt-1 text-sm text-ghost-400 leading-relaxed">
          <T v={{
            en: "Life has captured carbon freely, at planetary scale, for a billion years — the cheapest, most scalable technology on Earth.",
            zh: "生命已免费地、以行星尺度捕获碳，长达十亿年——这是地球上最廉价、最可扩展的技术。",
          }} />
        </p>
      </div>

      {/* part A — scatter chart */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="emerald-text font-mono text-sm font-bold">A</span>
          <h3 className="display text-base font-semibold text-ghost-100">
            <T v={{ en: "Capacity vs. Durability of Biological Sinks", zh: "生物碳汇：容量与持久性" }} />
          </h3>
        </div>
        <p className="mb-4 text-xs text-ghost-500 leading-relaxed">
          <T v={{
            en: "X-axis: how long carbon stays stored. Y-axis: how much it absorbs. Bubble size reflects capacity. Hover to explore.",
            zh: "横轴：碳能存放多久。纵轴：它吸纳多少。气泡大小反映容量。悬停探索。",
          }} />
        </p>
        <ScatterChart />

        {/* legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          {BIO_SYSTEMS.map(sys => (
            <span key={sys.key} className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono"
              style={{ background: sys.accent + "18", border: `1px solid ${sys.accent}44`, color: sys.accent }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: sys.accent }} />
              <T v={sys.name} />
            </span>
          ))}
        </div>
      </div>

      {/* part B — ocean pump */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="azure-text font-mono text-sm font-bold">B</span>
          <h3 className="display text-base font-semibold text-ghost-100">
            <T v={{ en: "The Ocean Biological Pump", zh: "海洋生物泵" }} />
          </h3>
        </div>
        <p className="mb-4 text-xs text-ghost-500 leading-relaxed">
          <T v={{
            en: "Marine snow: dead plankton and fecal pellets sinking from the sunlit surface into cold dark water — carbon raining into the abyss.",
            zh: "海雪：死去的浮游生物与粪粒，从阳光照耀的表层沉入寒冷的黑暗——碳，如雨落入深渊。",
          }} />
        </p>
        <OceanPump />
      </div>

      {/* takeaway */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <p className="label-mono emerald-text mb-2 text-[10px] tracking-widest uppercase">
          <T v={{ en: "Key Insight", zh: "核心洞见" }} />
        </p>
        <p className="text-sm text-ghost-300 leading-relaxed">
          <T v={{
            en: "Roughly a quarter of human carbon emissions is soaked up by land plants and soils each year, and another quarter by the ocean — two free planetary services worth trillions. Yet neither is permanent nor without cost: fire and the axe reverse forest storage; tilling releases soil carbon; ocean absorption drives acidification. These living systems are the cheapest carbon technology we have, but they are not a license to keep emitting.",
            zh: "每年约四分之一的人类碳排放，被陆地植物与土壤吸纳，另有四分之一被海洋吸纳——两项价值数万亿的免费行星服务。然而两者均非永久，也并非没有代价：火与斧逆转了森林储碳；翻耕释放了土壤碳；海洋的吸收推动了酸化。这些活着的系统是我们拥有的最廉价的碳技术，但它们不是继续排放的许可证。",
          }} />
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { val: "~25%", label: { en: "land absorption", zh: "陆地吸纳" }, color: "#2bd48b" },
            { val: "~25%", label: { en: "ocean absorption", zh: "海洋吸纳" }, color: "#37b6f6" },
            { val: "1 bn yrs", label: { en: "biology running this", zh: "生物运作的年数" }, color: "#9a7dfa" },
            { val: "free", label: { en: "cost of the service", zh: "该服务的成本" }, color: "#ffb368" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <p className="mono tnum text-lg font-bold" style={{ color: item.color }}>{item.val}</p>
              <p className="mt-0.5 text-[10px] text-ghost-500">
                {lang === "zh" ? item.label.zh : item.label.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
