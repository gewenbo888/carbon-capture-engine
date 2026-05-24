"use client";

import { ReactNode } from "react";
import { LangProvider, LangToggle, T, useLang } from "./lang";
import { SECTIONS, FUTURES, BIG_QUESTIONS } from "./content";
import CarbonField from "./CarbonField";
import CarbonCycleEngine from "./CarbonCycleEngine";
import EmissionsRise from "./EmissionsRise";
import ClimateBalance from "./ClimateBalance";
import CaptureLab from "./CaptureLab";
import BiosphereCarbon from "./BiosphereCarbon";
import EnergyTransition from "./EnergyTransition";
import GeoengineeringSim from "./GeoengineeringSim";
import ClimateAI from "./ClimateAI";
import TerraformingSim from "./TerraformingSim";
import PlanetaryCarbonModel from "./PlanetaryCarbonModel";
import CarbonAnalyst from "./CarbonAnalyst";
import CarbonRecursionSim from "./CarbonRecursionSim";

const VIS: Record<string, ReactNode> = {
  origin: <CarbonCycleEngine />,
  industry: <EmissionsRise />,
  greenhouse: <ClimateBalance />,
  dac: <CaptureLab />,
  bio: <BiosphereCarbon />,
  energy: <EnergyTransition />,
  geo: <GeoengineeringSim />,
  ai: <ClimateAI />,
  space: (
    <div className="space-y-8">
      <TerraformingSim />
      <FuturesGrid />
    </div>
  ),
  unified: (
    <div className="space-y-8">
      <PlanetaryCarbonModel />
      <QuestionsGrid />
    </div>
  ),
};

function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-azure-500/12 bg-ink-950/80 px-5 py-3 backdrop-blur md:px-9">
      <div className="flex items-center gap-3">
        <svg viewBox="0 0 32 32" className="h-8 w-8">
          <circle cx="16" cy="16" r="11" fill="none" stroke="#37b6f6" strokeWidth="1" opacity="0.45" />
          <circle cx="16" cy="16" r="4.2" fill="#2bd48b" />
          <circle cx="16" cy="16" r="4.2" fill="none" stroke="#9af2cb" strokeWidth="0.7" />
          <circle cx="16" cy="4.5" r="1.9" fill="#37b6f6" />
          <circle cx="26" cy="21.5" r="1.9" fill="#f5923c" />
          <circle cx="6" cy="21.5" r="1.9" fill="#9a7dfa" />
          <path d="M16 11.8 A4.2 4.2 0 0 1 19.6 18" fill="none" stroke="#6cc6ff" strokeWidth="0.8" opacity="0.85" />
        </svg>
        <div className="leading-tight">
          <div className="display text-base text-ghost-50">Carbon Capture Engine</div>
          <div className="zh text-[0.6rem] text-ghost-300">碳捕获引擎</div>
        </div>
      </div>
      <nav className="hidden gap-5 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ghost-300 xl:flex">
        <a href="#origin" className="hover:text-azure-400">Cycle</a>
        <a href="#industry" className="hover:text-azure-400">Industry</a>
        <a href="#greenhouse" className="hover:text-azure-400">Greenhouse</a>
        <a href="#dac" className="hover:text-azure-400">Capture</a>
        <a href="#bio" className="hover:text-azure-400">Biosphere</a>
        <a href="#energy" className="hover:text-azure-400">Energy</a>
        <a href="#ai" className="hover:text-azure-400">AI</a>
        <a href="#unified" className="hover:text-azure-400">Model</a>
      </nav>
      <div className="flex items-center gap-3">
        <LangToggle />
        <a href="https://psyverse.fun" className="hidden font-mono text-[0.58rem] uppercase tracking-[0.18em] text-emerald-400 hover:text-azure-400 sm:block">← Psyverse</a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="absolute inset-0 z-0 opacity-90"><CarbonField /></div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-ink-950/30 via-transparent to-ink-950" />
      <div className="relative z-20 mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="label-mono">Psyverse · An atlas of carbon & the managed planet</div>
        <div className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-ghost-300">
          EN · 中文 · leaf → forest → geochemical cycle → smokestack → capture plant → AI-managed Earth → terraformed world
        </div>
        <h1 className="display mt-6 text-5xl leading-[0.95] text-ghost-50 md:text-8xl">
          Carbon Capture <span className="azure-text">Engine</span>
        </h1>
        <h2 className="zh mt-3 text-3xl text-ghost-200 md:text-5xl">碳捕获引擎</h2>

        <p className="mt-9 max-w-2xl text-lg leading-relaxed text-ghost-100 md:text-xl">
          <T v={{
            en: "Before it was a crisis, carbon was the bookkeeping of a living planet — the six-proton atom that builds every sugar and every strand of DNA, circulating for four billion years between sky, sea, life and stone through a vast engine with no engineer. Industrial civilization is, at its root, the discovery that the buried carbon of the deep past could be dug up and set on fire faster than the planet can rebury it. Carbon capture is what comes after that discovery: civilization beginning, clumsily and late, to take conscious responsibility for the metabolism of an entire planet.",
            zh: "在成为一场危机之前，碳是一颗活着的行星的记账——那个构建起每一个糖、每一条 DNA 的、带六个质子的原子，四十亿年间，借由一台无人设计的庞大引擎，在天、海、生命与岩石之间循环。工业文明，在它的根上，正是这样一个发现：远古深处被埋藏的碳，能以比行星重新埋藏更快的速度，被掘出、被点燃。碳捕获，是那个发现之后到来之物：文明开始——笨拙地、迟来地——为一整颗行星的新陈代谢，承担起自觉的责任。",
          }} />
        </p>

        <div className="mt-10 max-w-2xl holo rounded-lg p-6">
          <div className="label-mono">Central thesis · 核心论点</div>
          <p className="mt-3 text-xl leading-relaxed text-ghost-50 md:text-2xl">
            <T v={{
              en: "Climate engineering is not merely environmental policy. It is civilization-scale metabolism management — the moment a species large enough to swing a planet's carbon balance becomes conscious enough to try to hold it steady on purpose.",
              zh: "气候工程不只是环境政策。它是文明尺度的新陈代谢管理——一个物种，大到足以撼动一颗行星的碳平衡，终于清醒到足以试着有意地稳住它的、那一刻。",
            }} />
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ghost-300">
          <span>10 systems · 十大系统</span>
          <span>live planetary sims · 实时行星模拟</span>
          <span>carbon cycle · capture lab · climate balance · geoengineering · terraforming</span>
        </div>
      </div>
    </section>
  );
}

function SectionBlock({ num, id, title, sub, body, vis }: { num: string; id: string; title: any; sub: any; body: any; vis?: ReactNode }) {
  return (
    <section id={id} className="relative border-t border-azure-500/8 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline gap-4">
          <span className="display text-5xl text-azure-500/25">{num}</span>
          <div>
            <h2 className="display text-4xl text-ghost-50 md:text-5xl"><T v={title} /></h2>
            <h3 className="mt-1 text-lg text-emerald-400"><T v={sub} /></h3>
          </div>
        </div>
        <div className="mt-5 h-px rule-azure opacity-50" />
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ghost-200"><T v={body} /></p>
        {vis && <div className="mt-12">{vis}</div>}
      </div>
    </section>
  );
}

function sectionProps(id: string) {
  const s = SECTIONS.find((x) => x.id === id)!;
  return { num: s.num, id: s.id, title: s.title, sub: s.sub, body: s.body };
}

/* ---- Section 9 : futures grid ---- */
function FuturesGrid() {
  const { lang } = useLang();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FUTURES.map((f, i) => (
        <div key={i} className="holo rounded-xl p-5" style={{ borderTopColor: f.accent, borderTopWidth: 2 }}>
          <div className="flex items-center justify-between">
            <span className={`display text-lg text-ghost-50 ${lang === "zh" ? "zh" : ""}`}><T v={f.name} /></span>
            <span className="font-mono text-[0.55rem] uppercase tracking-wider" style={{ color: f.accent }}><T v={f.horizon} /></span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ghost-300"><T v={f.desc} /></p>
        </div>
      ))}
    </div>
  );
}

/* ---- Section 10 : open questions ---- */
function QuestionsGrid() {
  const { lang } = useLang();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {BIG_QUESTIONS.map((q, i) => (
        <div key={i} className="holo flex gap-4 rounded-xl p-5">
          <span className="mono shrink-0 text-2xl text-azure-400/60">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <div className={`text-base leading-snug text-ghost-50 ${lang === "zh" ? "zh" : "display"}`}><T v={q.q} /></div>
            <p className="mt-2 font-mono text-[0.68rem] leading-relaxed text-emerald-400/80">{q.lens.en}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Body() {
  const { lang } = useLang();
  return (
    <main className="relative bg-ink-950 text-ghost-100">
      <Header />
      <Hero />

      <div className="grid-bg border-y border-azure-500/12 bg-ink-900/60 py-2.5 overflow-hidden">
        <div className="whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-[0.3em] text-emerald-400/70 ticker inline-block">
          {(lang === "zh"
            ? "光合作用 · 碳循环 · 海洋 · 土壤 · 永冻土 · 化石燃料 · 二氧化碳 · 温室效应 · 反馈回路 · 临界点 · 直接空气捕获 · 矿化 · 生物炭 · 海带 · 生物泵 · 负碳 · 氢能 · 地球工程 · 数字孪生 · 火星地球化 · 行星守护 · "
            : "PHOTOSYNTHESIS · CARBON CYCLE · OCEAN · SOIL · PERMAFROST · FOSSIL FUEL · CO₂ · GREENHOUSE · FEEDBACK LOOP · TIPPING POINT · DIRECT AIR CAPTURE · MINERALIZATION · BIOCHAR · KELP · BIOLOGICAL PUMP · CARBON-NEGATIVE · HYDROGEN · GEOENGINEERING · DIGITAL TWIN · MARS TERRAFORMING · PLANETARY STEWARDSHIP · ").repeat(2)}
        </div>
      </div>

      {SECTIONS.map((s) => (
        <SectionBlock key={s.id} {...sectionProps(s.id)} vis={VIS[s.id]} />
      ))}

      {/* AI layer — the Carbon Analyst */}
      <section id="analyst" className="relative border-t border-azure-500/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">AI layer · 人工智能层</div>
          <h2 className="display mt-3 text-4xl text-ghost-50 md:text-5xl">
            <T v={{ en: "Ask the engine", zh: "向引擎发问" }} />
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ghost-200">
            <T v={{
              en: "Six disciplines, one question at a time. The analyst reads carbon structurally — as the bookkeeping of a living planet, not a slogan about pollution — and answers from the lenses of a climate scientist, an atmospheric analyst, an energy strategist, an ecological engineer, a planetary modeler, and a civilization-sustainability theorist. It explains mechanisms and trade-offs, not headlines.",
              zh: "六门学科，每次一个问题。这位分析者结构性地阅读碳——把它读作一颗活着的行星的记账，而非一句关于污染的口号——并从气候科学家、大气分析者、能源策略家、生态工程师、行星建模者与可持续性理论家的视角作答。它解释机制与取舍，而非头条。",
            }} />
          </p>
          <div className="mt-12"><CarbonAnalyst /></div>
        </div>
      </section>

      {/* Recursive engine */}
      <section id="recursion" className="relative border-t border-azure-500/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="label-mono">Recursive engine · 递归引擎</div>
          <h2 className="display mt-3 text-4xl text-ghost-50 md:text-5xl">
            <T v={{ en: "Run the engine, scale by scale", zh: "逐尺度地，运行这台引擎" }} />
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ghost-200">
            <T v={{
              en: "The same move repeats from a single leaf fixing one molecule of CO₂ to a civilization deliberately holding a whole planet's metabolism steady: pull carbon from where it destabilizes, hold it where it is stable, and keep the books balanced. Run it across natural ecosystems, industrial civilization, engineered capture, AI-coordinated Earth systems, closed off-world biospheres and planetary stewardship. Let it run.",
              zh: "同一个动作，从一片叶子固定一个二氧化碳分子，一路重复到一个有意地稳住一整颗行星之新陈代谢的文明：把碳从它致乱之处拉出，把它存放在它稳定之处，并让账目保持平衡。让它贯穿自然生态系统、工业文明、工程化捕获、AI 协调的地球系统、封闭的地外生物圈，与行星守护。让它运行起来。",
            }} />
          </p>
          <div className="mt-12"><CarbonRecursionSim /></div>
        </div>
      </section>

      {/* Closing */}
      <section className="relative border-t border-azure-500/8 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="display text-4xl leading-snug text-ghost-50 md:text-6xl">
            <T v={{ en: "Carbon is not pollution. It is the metabolism of a living planet — and civilization has just become its first conscious steward.", zh: "碳不是污染。它是一颗活着的行星的新陈代谢——而文明，刚刚成为它第一位自觉的守护者。" }} />
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-ghost-300">
            <T v={{
              en: "Carbon is one of the foundational elements of life, energy, industry and planetary equilibrium. For most of history, civilization lived inside Earth's natural carbon balance without naming it. Industrialization unlocked the buried carbon of the deep past and released it faster than the slow cycle could draw it back — and the bill arrived as a warming, acidifying, destabilizing sky. Carbon capture, read at full scale, is the opening move in a far larger turn: the transition from unconscious industrial growth to deliberate planetary management. The future of humanity may hinge on a single question — whether intelligence evolves fast enough to regulate the ecological systems that technological civilization itself transformed.",
              zh: "碳，是生命、能量、工业与行星平衡的、根基性的元素之一。在历史的大部分时间里，文明活在地球的自然碳平衡之内，却未曾为它命名。工业化解锁了远古深处被埋藏的碳，并以快过缓慢循环能将其拉回的速度释放——而账单，正以一片变暖、酸化、失稳的天空到来。碳捕获，在完整的尺度上读，是一个远为宏大的转向的开局：从无意识的工业增长，转向刻意的行星管理。人类的未来，或许系于一个问题——智能，是否演化得足够快，去调节那些技术文明自身所改变的生态系统。",
            }} />
          </p>
          <div className="mx-auto mt-10 max-w-xl rounded-lg border border-emerald-500/25 bg-ink-900/60 p-5">
            <p className="text-xs leading-relaxed text-ghost-300">
              <T v={{
                en: "An educational synthesis of climate science, chemistry, biology, energy systems, engineering and civilization theory. Figures are order-of-magnitude; simulations are illustrative simplifications, not forecasts. It reads carbon by its mechanisms and trade-offs, and states open questions as open.",
                zh: "一份融合气候科学、化学、生物学、能源系统、工程学与文明理论的教育性综述。文中数字为数量级估计；模拟为示意性的简化，而非预测。它以机制与权衡来阅读碳，并把悬而未决的问题，如实陈述为悬而未决。",
              }} />
            </p>
          </div>
          <div className="mx-auto mt-12 h-px w-40 rule-azure" />
          <p className="mt-6 font-mono text-[0.6rem] uppercase tracking-[0.4em] text-emerald-400/70">
            Carbon Capture Engine · 碳捕获引擎 · Psyverse · 2026
          </p>
        </div>
      </section>

      <footer className="border-t border-azure-500/12 bg-ink-950 px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <div className="display text-xl text-ghost-50">Carbon Capture Engine</div>
            <div className="zh mt-1 text-sm text-ghost-300">碳捕获引擎</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ghost-300">
              <T v={{ en: "The nature of carbon, climate engineering, atmospheric systems, and civilization-scale carbon management.", zh: "碳的本质、气候工程、大气系统，与文明尺度的碳管理。" }} />
            </p>
          </div>
          <div>
            <div className="label-mono">Systems · 系统</div>
            <ul className="mt-4 space-y-1.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-ghost-300">
              {SECTIONS.slice(0, 6).map((s) => (
                <li key={s.id}><a href={`#${s.id}`} className="hover:text-azure-400">{s.num} · <T v={s.title} /></a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="label-mono">Companion archives</div>
            <ul className="mt-4 space-y-1.5 text-sm text-ghost-300">
              <li><a href="https://energy-engine.psyverse.fun" className="hover:text-azure-300">Energy Engine · 能量引擎</a></li>
              <li><a href="https://entropy.psyverse.fun" className="hover:text-azure-300">Entropy · 熵</a></li>
              <li><a href="https://matter-engine.psyverse.fun" className="hover:text-azure-300">Matter Engine · 物质引擎</a></li>
              <li className="pt-3"><a href="https://psyverse.fun" className="text-emerald-400 hover:text-azure-300">↩ All Psyverse archives</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 h-px max-w-7xl rule-azure" />
        <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between text-[0.58rem] uppercase tracking-[0.3em] text-ghost-300">
          <div>© 2026 Gewenbo · Psyverse</div>
          <div>EN · 中文 · educational</div>
        </div>
      </footer>
    </main>
  );
}

export default function CarbonEngine() {
  return (
    <LangProvider>
      <Body />
    </LangProvider>
  );
}
