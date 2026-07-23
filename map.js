/* =====================================================================
   RIMTHAN VENTURE GALAXY — MAP RENDERER
   Reads venture data through loadVentureMap() / loadVenturePosition()
   (see data.js). The route + node rings use the brand gradient
   (lime -> cyan -> blue); the small core dot on each node still
   encodes real health status, so the chart stays useful, not just
   decorative.
   ===================================================================== */

const CHART_W = 1200;
const CHART_H = 640;

const HEALTH_COLOR = {
  "On Track":  "#4FAE63",
  "At Risk":   "#E8A23B",
  "Off Track": "#E1584E"
};

// brand gradient stops, sampled across ventures left-to-right (lime -> cyan -> blue)
const BRAND_STOPS = ["#D6F25C", "#9FE07C", "#7FE0A0", "#57D3DE", "#4C8DF0"];

const stage = document.getElementById("chartStage");
const overlayLayer = document.getElementById("overlayLayer");

function seededStars(count){
  let seed = 42;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  let out = "";
  for(let i=0;i<count;i++){
    const x = rand()*CHART_W;
    const y = rand()*CHART_H*0.55;
    const r = rand()*1.1 + 0.3;
    out += `<circle class="star" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" opacity="${(rand()*0.4+0.15).toFixed(2)}"/>`;
  }
  return out;
}

function horizonGrid(){
  let lines = "";
  for(let i=0;i<=8;i++){
    const y = 480 + i*17;
    const inset = i*46;
    lines += `<line x1="${inset}" y1="${y}" x2="${CHART_W-inset}" y2="${y}"/>`;
  }
  return `<g class="horizon-grid">${lines}</g>`;
}

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

  // sort by x so gradient stops read left-to-right like the route itself
  const byX = ventures.slice().sort((a,b)=>a.pos.x-b.pos.x);

  svg.innerHTML = `
    <defs>
      <linearGradient id="routeGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${BRAND_STOPS[0]}"/>
        <stop offset="50%" stop-color="${BRAND_STOPS[2]}"/>
        <stop offset="100%" stop-color="${BRAND_STOPS[4]}"/>
      </linearGradient>
    </defs>

    <path class="contour" d="M -40 120 Q 300 40 620 140 T 1260 90" />
    <path class="contour" d="M -40 520 Q 340 600 700 540 T 1260 560" />

    ${horizonGrid()}
    ${seededStars(60)}

    <path class="route-path" d="${routePath(ventures)}" />
    <g id="nodesGroup"></g>
  `;

  const nodesGroup = svg.querySelector("#nodesGroup");
  byX.forEach((v, i) => {
    const brandColor = BRAND_STOPS[i % BRAND_STOPS.length];
    const healthColor = HEALTH_COLOR[v.healthStatus] || "#93A39B";
    const { x, y, bearing } = v.pos;
    const g = document.createElementNS(svgNS, "g");
    g.setAttribute("class", "node");
    g.setAttribute("data-id", v.id);
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "button");
    g.setAttribute("aria-label", `${v.name} — ${v.healthStatus}`);
    g.innerHTML = `
      <circle class="node-ring" cx="${x}" cy="${y}" r="15" stroke="${brandColor}" style="animation-delay:${(i % 5) * 0.3}s"/>
      <circle class="node-core" cx="${x}" cy="${y}" r="8" fill="${brandColor}" stroke="${brandColor}"/>
      <circle class="node-health-dot" cx="${x + 9}" cy="${y - 9}" r="4.5" fill="${healthColor}"/>
      <text class="node-label" x="${x}" y="${y - 26}" text-anchor="middle">${v.name}</text>
      <text class="node-bearing" x="${x}" y="${y + 32}" text-anchor="middle">${bearing}</text>
    `;
    nodesGroup.appendChild(g);

    g.addEventListener("click", (e) => { e.stopPropagation(); toggleOverlay(v, healthColor); });
    g.addEventListener("keydown", (e) => { if(e.key === "Enter" || e.key === " "){ e.preventDefault(); toggleOverlay(v, healthColor); } });
  });

  return svg;
}

let activeId = null;

function toggleOverlay(v, healthColor){
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

  const flipLeft = leftPct > 62;
  const cardLeft = flipLeft ? `calc(${leftPct}% - 268px)` : `calc(${leftPct}% + 24px)`;
  const flipUp = topPct > 55;
  const cardTop = flipUp ? `calc(${topPct}% - 260px)` : `calc(${topPct}% - 10px)`;

  const cta = `<a class="oc-cta" href="project.html?venture=${v.id}">Open venture update <span>&rarr;</span></a>`;

  overlayLayer.innerHTML = `
    <div class="overlay-card visible" style="left:${cardLeft}; top:${cardTop}; color:${healthColor};">
      <div class="oc-title">${v.name}</div>
      <div class="oc-tagline">${v.tagline}</div>
      <div class="oc-health"><span class="oc-led"></span><span style="color:#F4FAF7">${v.healthStatus}</span></div>
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

/* ---- light content sections below the hero ---- */
function renderHealthTags(ventures){
  const counts = { "On Track": 0, "At Risk": 0, "Off Track": 0 };
  ventures.forEach(v => counts[v.healthStatus] = (counts[v.healthStatus] || 0) + 1);
  document.getElementById("healthTags").innerHTML = Object.entries(counts).map(([status, n]) => `
    <div class="health-tag" style="color:${HEALTH_COLOR[status]}">
      <span class="dot"></span><span style="color:var(--ink)">${status}</span>&nbsp;· ${n}
    </div>
  `).join("");
}

function renderGlanceStats(ventures){
  const withUpdate = ventures.filter(v => PROJECT_UPDATES[v.id]).length;
  document.getElementById("glanceStats").innerHTML = `
    <div class="glance-stat"><b>${withUpdate}</b><span>Generated</span></div>
    <div class="glance-stat"><b>${ventures.length - withUpdate}</b><span>Pending</span></div>
    <div class="glance-stat"><b>${ventures.length}</b><span>Total ventures</span></div>
  `;
}

async function init(){
  const ventures = await loadVentureMap();
  for (const v of ventures) {
    v.pos = await loadVenturePosition(v.id);
  }
  stage.insertBefore(buildSVG(ventures), overlayLayer);
  renderHealthTags(ventures);
  renderGlanceStats(ventures);
}

init();
