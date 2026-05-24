import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const TITLE_EN =
  "Carbon Capture Engine · The Nature of Carbon, Climate Engineering, Atmospheric Systems & Civilization-Scale Carbon Management";
const TITLE_ZH = "碳捕获引擎 · 碳的本质、气候工程、大气系统与文明尺度的碳管理";
const DESC =
  "A civilization-scale, bilingual exploration of carbon — not as pollution but as the bookkeeping of a living planet. From photosynthesis and the geochemical cycle to industrial combustion, the greenhouse effect, direct air capture, biological and oceanic sinks, carbon-negative energy, geoengineering, AI-coordinated Earth systems, and the terraforming of dead worlds — how carbon capture may be the opening move in civilization learning to consciously regulate its own planetary metabolism.";

export const metadata: Metadata = {
  metadataBase: new URL("https://carbon-capture-engine.psyverse.fun"),
  title: `${TITLE_EN} | ${TITLE_ZH}`,
  description: DESC,
  keywords: [
    "carbon", "carbon cycle", "carbon capture", "carbon sequestration", "direct air capture", "DAC",
    "climate change", "greenhouse effect", "greenhouse gases", "CO2", "atmospheric CO2", "climate dynamics",
    "carbon removal", "CDR", "BECCS", "carbon mineralization", "enhanced weathering", "biochar",
    "ocean acidification", "ocean carbon", "biological pump", "blue carbon", "kelp", "algae", "soil carbon",
    "photosynthesis", "fossil fuels", "industrial emissions", "decarbonization", "carbon-negative economy",
    "renewable energy", "nuclear power", "hydrogen", "synthetic fuels", "energy transition", "net zero",
    "geoengineering", "solar radiation management", "stratospheric aerosols", "cloud brightening", "planetary management",
    "AI climate", "climate modeling", "digital twin earth", "carbon accounting", "MRV", "autonomous ecological systems",
    "terraforming", "closed biosphere", "Mars", "space habitats", "planetary metabolism", "earth system science",
    "climate engineering", "civilization sustainability", "planetary carbon stability", "Psy Protocol", "Psyverse",
    "碳", "碳循环", "碳捕获", "碳封存", "直接空气捕获", "气候变化", "温室效应", "温室气体", "二氧化碳",
    "碳移除", "矿化", "强化风化", "生物炭", "海洋酸化", "生物泵", "蓝碳", "光合作用", "化石燃料", "工业排放",
    "脱碳", "负碳经济", "可再生能源", "核能", "氢能", "合成燃料", "能源转型", "净零", "地球工程",
    "太阳辐射管理", "平流层气溶胶", "云增亮", "行星管理", "气候建模", "地球数字孪生", "碳核算",
    "地球化", "封闭生物圈", "火星", "太空栖息地", "行星新陈代谢", "地球系统科学", "气候工程", "文明可持续性",
  ],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: { canonical: "/", languages: { en: "/", "zh-CN": "/", "x-default": "/" } },
  openGraph: {
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Carbon Capture Engine · 碳捕获引擎 — The Nature of Carbon & Planetary Carbon Management" }],
    title: TITLE_EN,
    description:
      "From the leaf to the managed planet. A bilingual atlas of carbon — the cycle, the greenhouse effect, direct air capture, biological and oceanic sinks, carbon-negative energy, geoengineering, AI-coordinated Earth systems, terraforming, and a unified model of planetary carbon stability.",
    url: "https://carbon-capture-engine.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: TITLE_EN,
    description: "Carbon is not merely pollution. It is the bookkeeping of a living planet. A bilingual exploration of carbon capture as civilization learning to consciously regulate its own planetary metabolism.",
  },
  robots: { index: true, follow: true },
  other: { "theme-color": "#04070d" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: TITLE_EN,
              alternateName: TITLE_ZH,
              description: DESC,
              url: "https://carbon-capture-engine.psyverse.fun/",
              inLanguage: ["en", "zh-CN"],
              author: { "@type": "Person", name: "Gewenbo", url: "https://psyverse.fun/" },
              publisher: { "@type": "Organization", name: "Psyverse", url: "https://psyverse.fun/" },
            }),
          }}
        />
      </head>
      <body className="bg-ink-950 text-ghost-100 antialiased">
        {children}
        <Script src="https://analytics-dashboard-two-blue.vercel.app/tracker.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
