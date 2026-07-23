/* =====================================================================
   RIMTHAN VENTURE GALAXY — MAP RENDERER
   Reads venture data through loadVentureMap() / loadVenturePosition()
   (see data.js) and draws the chart + overlay cards. Those loaders are
   the only thing that will change when an AI backend is connected —
   nothing below this comment needs to.
   ===================================================================== */

const CHART_W = 1200;
const CHART_H = 640;

const HEALTH_COLOR = {
  "On Track":  "#3FE0A6",
  "At Risk":   "#F0A93B",
  "Off Track": "#EF5D6C"
};

const stage = document.getElementById("chartStage");
const overlayLayer = document.getElementById("overlayLayer");

/* ---- deterministic "stars" for atmosphere (fixed seed so layout is stable) ---- */
function seededStars(count){
  let seed = 42;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  let out = "";
  for(let i=0;i<count;i++){
    const x = rand()*CHART_W;
    const y = rand()*CHART_H*0.6; // keep stars mostly in the upper sky
    const r = rand()*1.2 + 0.4;
    out += `<circle class="star" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" opacity="${(rand()*0.5+0.2).toFixed(2)}"/>`;
  }
  return out;
}

/* ---- horizon grid: perspective-style converging lines along the base ---- */
function horizonGrid(){
  let lines = "";
  for(let i=0;i<=10;i++){
    const y = 470 + i*17;
    const inset = i*46;
    lines += `<line x1="${inset}" y1="${y}" x2="${CHART_W-inset}" y2="${y}"/>`;
  }
  return `<g class="horizon-grid">${lines}</g>`;
}

/* ---- smooth path threading every node in map order ---- */
function routePath(nodes){
  const pts = nodes.slice().sort((a,b)=>a.pos.x-b.pos.x);
  let d = `M ${pts[0].pos.x} ${pts[0].pos.y}`;
  for(let i=1;i<pts.length;i++){
    const prev = pts[i-1].pos, cur = pts[i].pos;
    const midX = (prev.x + cur.x)/2;
    d += ` C ${midX} ${prev.y}, ${midX} ${cur.y}, ${cur.x} ${cur.y}`;
  }
  return d;
}

function buildSVG(ventures){
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${CHART_W} ${CHART_H}`);
  svg.setAttribute("class", "galaxy-svg");
  svg.setAttribute("aria-label", "Venture Galaxy chart");

  svg.innerHTML = `
    <defs>
      <linearGradient id="routeGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#2E5CE6"/>
        <stop offset="100%" stop-color="#4FE0E8"/>
      </linearGradient>
    </defs>

    <!-- topographic contour layers -->
    <path class="contour" d="M -40 120 Q 300 40 620 140 T 1260 90" />
    <path class="contour dim" d="M -40 200 Q 320 260 640 190 T 1260 230" />
    <path class="contour" d="M -40 520 Q 340 600 700 540 T 1260 560" />
    <path class="contour dim" d="M -40 60 Q 500 -20 900 60 T 1260 40" />

    ${horizonGrid()}
    ${seededStars(70)}

    <path class="route-path" d="${routePath(ventures)}" />

    <g id="nodesGroup"></g>
  `;

  const nodesGroup = svg.querySelector("#nodesGroup");
  ventures.forEach(v => {
    const color = HEALTH_COLOR[v.healthStatus] || "#8B98B8";
    const { x, y, bearing } = v.pos;
    const g = document.createElementNS(svgNS, "g");
    g.setAttribute("class", "node");
    g.setAttribute("data-id", v.id);
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "button");
    g.setAttribute("aria-label", `${v.name} — ${v.healthStatus}`);
    g.innerHTML = `
      <circle class="node-ring" cx="${x}" cy="${y}" r="14" stroke="${color}" style="animation-delay:${(x % 5) * 0.3}s"/>
      <circle class="node-core" cx="${x}" cy="${y}" r="7" fill="${color}" stroke="${color}"/>
      <text class="node-label" x="${x}" y="${y - 26}" text-anchor="middle">${v.name}</text>
      <text class="node-bearing" x="${x}" y="${y + 30}" text-anchor="middle">${bearing}</text>
    `;
    nodesGroup.appendChild(g);

    g.addEventListener("click", (e) => { e.stopPropagation(); toggleOverlay(v); });
    g.addEventListener("keydown", (e) => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); toggleOverlay(v); } });
  });

  return svg;
}

/* ---- overlay card: positioned in % so it tracks the responsive SVG ---- */
let activeId = null;

function toggleOverlay(v){
  document.querySelectorAll(".node").forEach(n => n.classList.toggle("active", n.dataset.id === v.id && activeId !== v.id));

  if(activeId === v.id){
    overlayLayer.innerHTML = "";
    activeId = null;
    return;
  }
  activeId = v.id;

  const { x, y } = v.pos;
  const leftPct = (x / CHART_W) * 100;
  const topPct  = (y / CHART_H) * 100;
  const color = HEALTH_COLOR[v.healthStatus] || "#8B98B8";

  const flipLeft = leftPct > 62; // keep the card on-screen near the right edge
  const cardLeft = flipLeft ? `calc(${leftPct}% - 268px)` : `calc(${leftPct}% + 24px)`;

  const flipUp = topPct > 55; // keep the card on-screen near the bottom edge
  const cardTop = flipUp ? `calc(${topPct}% - 260px)` : `calc(${topPct}% - 10px)`;

  // every node links to the same generic project page — it renders
  // whatever this venture's latest update looks like, including a
  // "not generated yet" state when there isn't one
  const cta = `<a class="oc-cta" href="project.html?venture=${v.id}">Open venture update <span>&rarr;</span></a>`;

  overlayLayer.innerHTML = `
    <div class="overlay-card visible ${flipUp ? "flip-up" : ""}" style="left:${cardLeft}; top:${cardTop}; color:${color};">
      <div class="oc-title" style="color:var(--ink)">${v.name}</div>
      <div class="oc-tagline">${v.tagline}</div>
      <div class="oc-health"><span class="oc-led"></span><span style="color:var(--ink)">${v.healthStatus}</span></div>
      <div class="oc-stats">
        <div class="oc-stat"><b>${v.activePriorities}</b><span>Priorities</span></div>
        <div class="oc-stat"><b>${v.risks}</b><span>Risks</span></div>
        <div class="oc-stat"><b>${v.milestonesCompleted}</b><span>Milestones</span></div>
      </div>
      ${cta}
    </div>
  `;
}

overlayLayer.addEventListener("click", (e) => e.stopPropagation());

document.addEventListener("click", () => {
  overlayLayer.innerHTML = "";
  activeId = null;
  document.querySelectorAll(".node").forEach(n => n.classList.remove("active"));
});

async function init(){
  const ventures = await loadVentureMap();
  // attach chart position/bearing to each venture (kept separate in data.js on purpose)
  for (const v of ventures) {
    v.pos = await loadVenturePosition(v.id);
  }
  stage.insertBefore(buildSVG(ventures), overlayLayer);
}

init();
