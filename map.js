/* =====================================================================
   RIMTHAN VENTURE GALAXY — DASHBOARD RENDERER
   Renders a searchable, filterable grid of venture cards from
   loadVentureMap() (see data.js). Deliberately grid-based rather than
   a fixed chart, so it works the same whether there are 5 ventures or
   500 — a fixed set of hand-placed nodes doesn't scale, a grid does.
   ===================================================================== */

const HEALTH_COLOR = {
  "On Track":  "#1F6FE0",
  "At Risk":   "#C97C1D",
  "Off Track": "#C43D3D"
};

let ALL_VENTURES = [];
let activeFilter = "All";
let searchTerm = "";

function renderFilterPills(){
  // "Completed" is separate from health — a venture that's been handed off
  // isn't On Track/At Risk/Off Track anymore, it's just done.
  const statuses = ["All", "On Track", "At Risk", "Off Track", "Completed"];
  document.getElementById("healthFilters").innerHTML = statuses.map(s => `
    <button class="filter-pill ${s === activeFilter ? "active" : ""}" data-status="${s}"
      style="${s !== "All" && s !== "Completed" ? `color:${HEALTH_COLOR[s]}` : ""}">
      ${s !== "All" && s !== "Completed" ? `<span class="dot"></span>` : ""}${s}
    </button>
  `).join("");

  document.querySelectorAll(".filter-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.status;
      renderFilterPills();
      renderGrid();
    });
  });
}

function renderGrid(){
  const term = searchTerm.trim().toLowerCase();
  const filtered = ALL_VENTURES.filter(v => {
    const matchesSearch = !term || v.name.toLowerCase().includes(term) || v.tagline.toLowerCase().includes(term);
    if (!matchesSearch) return false;

    // "Completed" pill shows archived ventures; every other pill (including
    // "All") shows only active ones — a finished venture doesn't clutter
    // the default view, but nothing about it is deleted.
    if (activeFilter === "Completed") return v.archived;
    if (v.archived) return false;
    return activeFilter === "All" || v.healthStatus === activeFilter;
  });

  document.getElementById("resultCount").textContent =
    `${filtered.length} of ${ALL_VENTURES.length} venture${ALL_VENTURES.length === 1 ? "" : "s"}`;

  const grid = document.getElementById("ventureGrid");
  if (!filtered.length){
    grid.innerHTML = `<div class="no-results">No ventures match "${searchTerm}".</div>`;
    return;
  }

  grid.innerHTML = filtered.map(v => {
    const color = HEALTH_COLOR[v.healthStatus] || "#93A39B";
    return `
      <a class="venture-card ${v.archived ? "archived" : ""}" href="project.html?venture=${v.id}">
        <div class="vc-top">
          <span class="vc-name">${v.name}</span>
          ${v.archived
            ? `<span class="vc-completed-badge">✓ Completed</span>`
            : `<span class="vc-health-dot" style="color:${color}"></span>`}
        </div>
        <div class="vc-tagline">${v.tagline}</div>
        <div class="vc-stats">
          <span><b>${v.activePriorities}</b> priorities</span>
          <span><b>${v.risks}</b> risks</span>
          <span><b>${v.milestonesCompleted}</b> done</span>
        </div>
      </a>
    `;
  }).join("");
}

document.getElementById("ventureSearch").addEventListener("input", (e) => {
  searchTerm = e.target.value;
  renderGrid();
});

/* ---- numbered accordion: "How the transcript feature works" ---- */
function initAccordion(){
  document.querySelectorAll(".acc-row").forEach(row => {
    row.querySelector(".acc-row-top").addEventListener("click", () => {
      const isOpen = row.classList.contains("open");
      document.querySelectorAll(".acc-row").forEach(r => r.classList.remove("open"));
      if (!isOpen) row.classList.add("open");
    });
  });
}

async function init(){
  ALL_VENTURES = await loadVentureMap();
  renderFilterPills();
  renderGrid();
  initAccordion();
}

init();
