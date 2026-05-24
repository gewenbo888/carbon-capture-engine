"use client";

import { useEffect, useRef } from "react";

/**
 * Hero background — a planet's carbon cycle, rendered as a living field. A bright
 * planetary core (the biosphere, breathing) sits low-left, wrapped in an
 * atmospheric halo; carbon packets stream along a sparse lattice of reservoir
 * nodes — atmosphere, ocean, life, rock — lighting each as carbon passes through.
 * Fine motes drift over a faint graticule. The visual thesis: carbon is matter in
 * perpetual circulation between sky, sea, life and stone, and the planet is the engine.
 */
export default function CarbonField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0, dpr = 1;
    let core = { x: 0, y: 0 };

    // azure, emerald, ember, violet as rgb triples
    const COLORS = ["55,182,246", "43,212,139", "245,146,60", "154,125,250"];

    type Node = { x: number; y: number; r: number; c: number; ph: number; lit: number };
    type Edge = { a: number; b: number };
    type Packet = { e: number; t: number; sp: number; c: number; dir: number };
    type Mote = { x: number; y: number; vx: number; vy: number; r: number; c: number; ph: number };

    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let packets: Packet[] = [];
    let motes: Mote[] = [];

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      core = { x: w * 0.24, y: h * 0.6 };

      // reservoir nodes scattered across the field
      const n = Math.min(36, Math.max(16, Math.floor((w * h) / 40000)));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1.4 + Math.random() * 2.8,
        c: Math.floor(Math.random() * 4),
        ph: Math.random() * Math.PI * 2,
        lit: Math.random(),
      }));

      // connect each node to its 2 nearest neighbours → a sparse flux graph
      edges = [];
      for (let i = 0; i < nodes.length; i++) {
        const d = nodes
          .map((p, j) => ({ j, dist: Math.hypot(p.x - nodes[i].x, p.y - nodes[i].y) }))
          .filter((x) => x.j !== i)
          .sort((a, b) => a.dist - b.dist);
        for (let k = 0; k < 2 && k < d.length; k++) {
          const b = d[k].j;
          if (!edges.some((e) => (e.a === i && e.b === b) || (e.a === b && e.b === i))) {
            edges.push({ a: i, b });
          }
        }
      }

      // carbon packets flowing along the flux edges
      packets = Array.from({ length: Math.min(64, edges.length * 2) }, () => ({
        e: Math.floor(Math.random() * edges.length),
        t: Math.random(),
        sp: 0.0016 + Math.random() * 0.0036,
        c: Math.floor(Math.random() * 4),
        dir: Math.random() > 0.5 ? 1 : -1,
      }));

      // drifting background motes
      const mn = Math.min(120, Math.floor((w * h) / 9000));
      motes = Array.from({ length: mn }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.1 + 0.2, c: Math.floor(Math.random() * 4), ph: Math.random() * Math.PI * 2,
      }));
    }

    let t = 0;
    function frame() {
      t += 0.006;
      ctx.clearRect(0, 0, w, h);

      // drifting motes
      for (const m of motes) {
        m.x += m.vx; m.y += m.vy;
        if (m.x < -10) m.x = w + 10; if (m.x > w + 10) m.x = -10;
        if (m.y < -10) m.y = h + 10; if (m.y > h + 10) m.y = -10;
        const a = 0.08 + 0.18 * (0.5 + 0.5 * Math.sin(t * 1.3 + m.ph));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLORS[m.c]},${a})`;
        ctx.fill();
      }

      // carbon radiating from the planetary core to nearby reservoirs (faint flux lines)
      for (const nd of nodes) {
        const d = Math.hypot(nd.x - core.x, nd.y - core.y);
        if (d < Math.max(w, h) * 0.34) {
          ctx.beginPath();
          ctx.moveTo(core.x, core.y);
          ctx.lineTo(nd.x, nd.y);
          ctx.strokeStyle = `rgba(169,222,248,${0.05 * (1 - d / (Math.max(w, h) * 0.34))})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // flux-graph edges
      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(169,222,248,${0.05 + 0.03 * Math.sin(t + e.a)})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // carbon packets travelling the edges
      for (const p of packets) {
        p.t += p.sp * p.dir;
        if (p.t > 1) { p.t = 0; p.e = Math.floor(Math.random() * edges.length); }
        if (p.t < 0) { p.t = 1; p.e = Math.floor(Math.random() * edges.length); }
        const e = edges[p.e];
        if (!e) continue;
        const a = nodes[e.a], b = nodes[e.b];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const col = COLORS[p.c];
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},0.85)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 3.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},0.10)`;
        ctx.fill();
      }

      // reservoir nodes — small luminous tiles that pulse as carbon lights them
      for (const nd of nodes) {
        nd.ph += 0.035;
        nd.lit = 0.5 + 0.5 * Math.sin(nd.ph);
        const tw = nd.lit;
        const col = COLORS[nd.c];
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, nd.r + 2.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${0.05 + 0.06 * tw})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, nd.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},${0.4 + 0.42 * tw})`;
        ctx.fill();
      }

      // the planetary core — the living biosphere, breathing, wrapped in atmosphere
      const pulse = 0.6 + 0.4 * Math.sin(t * 1.4);
      const g = ctx.createRadialGradient(core.x, core.y, 0, core.x, core.y, 220);
      g.addColorStop(0, `rgba(154,242,203,${0.42 * pulse})`);
      g.addColorStop(0.18, `rgba(43,212,139,${0.20 * pulse})`);
      g.addColorStop(0.45, `rgba(55,182,246,${0.12 * pulse})`);
      g.addColorStop(0.75, "rgba(31,127,214,0.05)");
      g.addColorStop(1, "rgba(31,127,214,0)");
      ctx.fillStyle = g;
      ctx.fillRect(core.x - 230, core.y - 230, 460, 460);

      // thin atmospheric ring around the planet
      ctx.beginPath();
      ctx.arc(core.x, core.y, 26 + pulse * 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(108,198,255,${0.28 * pulse})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // packets spiralling outward from the core — carbon leaving the biosphere
      for (let i = 0; i < 6; i++) {
        const ang = t * 0.6 + (i * Math.PI * 2) / 6;
        const rad = 30 + ((t * 40 + i * 28) % 130);
        const x = core.x + Math.cos(ang) * rad;
        const y = core.y + Math.sin(ang) * rad * 0.85;
        const fade = 1 - rad / 160;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(154,242,203,${0.8 * Math.max(0, fade)})`;
        ctx.fill();
      }

      // the planet itself
      ctx.beginPath();
      ctx.arc(core.x, core.y, 8 + pulse * 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(220,245,236,0.96)";
      ctx.fill();

      raf = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={ref} className="h-full w-full" />;
}
