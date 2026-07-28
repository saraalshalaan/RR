/* =====================================================================
   RIMTHAN VENTURE GALAXY — PROJECT PAGE RENDERER
   Reads ?venture=<id> from the URL, then loads that venture's info
   (loadVentureMap) and its latest stand-up (loadProjectUpdate) — see
   data.js. Field names match the real weekly stand-up template, so
   pasting a filled-in stand-up into data.js needs no translation.
   ===================================================================== */

const HEALTH_COLOR = {
  "On Track":  "#1F6FE0",
  "At Risk":   "#C97C1D",
  "Off Track": "#C43D3D"
};

// the header search box lives on every page, but only index.html has a
// venture grid to filter — so from here, Enter just hands the query
// over to the dashboard instead of doing nothing.
const headerSearch = document.getElementById("headerSearch");
headerSearch?.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const q = e.target.value.trim();
  window.location.href = q ? `index.html?q=${encodeURIComponent(q)}` : "index.html";
});
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    headerSearch?.focus();
  }
});

function meterSVG(progress){
  const r = 25, c = 2 * Math.PI * r;
  const offset = c * (1 - progress / 100);
  return `
    <div class="meter">
      <svg viewBox="0 0 60 60">
        <circle class="track" cx="30" cy="30" r="${r}"></circle>
        <circle class="value" cx="30" cy="30" r="${r}"
          stroke-dasharray="${c.toFixed(1)}"
          stroke-dashoffset="${c.toFixed(1)}"
          data-target-offset="${offset.toFixed(1)}"></circle>
      </svg>
      <div class="meter-label">${progress}%</div>
    </div>
  `;
}

function renderEmptyState(ventureName){
  document.getElementById("updateBody").innerHTML = `
    <div class="card card-full">
      <div class="empty-state">
        <h3>No weekly stand-up yet for ${ventureName}</h3>
        <p>This venture's update hasn't been generated this week. Check back once it's run.</p>
      </div>
    </div>
  `;
}

function renderStrip(venture, d){
  const color = HEALTH_COLOR[d.overallHealth] || "#93A39B";
  document.getElementById("ventureStrip").innerHTML = `
    <div class="strip-item"><span class="k">Venture</span><span class="v">${venture.name}</span></div>
    <div class="strip-item"><span class="k">Venture Lead</span><span class="v">${d.ventureLead || "—"}</span></div>
    <div class="strip-item"><span class="k">Stage</span><span class="v">${d.stage || "—"}</span></div>
    <div class="strip-item"><span class="k">Overall Health</span><span class="v health" style="color:${color}"><span class="led"></span>${d.overallHealth}</span></div>
    <div class="strip-logo">${venture.name}</div>
  `;
}

function renderUpdate(venture, d){
  const prioritiesHTML = d.priorities.map(p => `
    <div class="card">
      <div class="card-head">
        <div><h3>${p.name}</h3><small>${[p.stream, p.team].filter(Boolean).join(" · ")}</small></div>
        ${meterSVG(p.progress)}
      </div>
      <ul class="bullet-list">
        ${p.progressNotes.map(n => `<li>${n}</li>`).join("")}
      </ul>
      ${p.nextStep ? `<a class="next-step" href="#">${p.nextStep}</a>` : ""}
      ${p.notes ? `<p style="margin-top:12px;font-size:13px;color:var(--ink-faint);">${p.notes}</p>` : ""}
    </div>
  `).join("");

  const keyWinsHTML = d.keyWins.length
    ? `<ul class="bullet-list">${d.keyWins.map(w => `<li>${w}</li>`).join("")}</ul>`
    : `<p class="empty-list">No wins logged this week.</p>`;

  const risksHTML = d.risks.length
    ? d.risks.map(r => `
        <div class="risk-card card">
          <div class="risk-head">
            <span class="led" style="color:${r.severity === "High" ? "var(--off-track)" : r.severity === "Low" ? "var(--on-track)" : "var(--at-risk)"}"></span>
            <h4>${[r.item, r.stream].filter(Boolean).join(" · ")}</h4>
            <span class="severity-tag">Severity: ${r.severity}</span>
          </div>
          <p>${r.mitigation || "No mitigation action logged yet."}</p>
        </div>
      `).join("")
    : `<div class="card"><p class="empty-list">No risks or blockers this week.</p></div>`;

  const supportHTML = d.support.filter(s => s.type || s.person).length
    ? d.support.filter(s => s.type || s.person).map(s => `
        <div class="support-card card">
          <div class="support-row">
            <p><strong>${s.type || "Support needed"}</strong>${s.person ? ` — ${s.person}` : ""}</p>
            <button class="support-btn" type="button">Approve request</button>
          </div>
        </div>
      `).join("")
    : `<div class="card"><p class="empty-list">No leadership support requested this week.</p></div>`;

  const allPoints = [
    ...d.timeline.completed.map(label => ({ label, done: true })),
    ...d.timeline.targets.map(label => ({ label, done: false }))
  ];
  const donePct = allPoints.length ? (d.timeline.completed.length / allPoints.length) * 100 : 0;

  const timelineHTML = allPoints.length ? `
    <div class="timeline-wrap">
      <span class="tl-tag">${d.timeline.completed.length} completed &middot; ${d.timeline.targets.length} targeted this week</span>
      <div class="timeline-track" style="background:linear-gradient(90deg, var(--on-track) 0%, var(--on-track) ${donePct}%, var(--hairline) ${donePct}%, var(--hairline) 100%);"></div>
      <div class="timeline-points">
        ${allPoints.map(p => `
          <div class="tl-point ${p.done ? "" : "pending"}">
            <div class="tl-dot"></div>
            <span>${p.label}</span>
          </div>
        `).join("")}
      </div>
    </div>
  ` : `<p class="empty-list">No milestones logged yet.</p>`;

  document.getElementById("updateBody").innerHTML = `
    <div class="section-label" style="margin-top:0;">Key Priorities</div>
    <div class="card-grid">${prioritiesHTML}</div>

    <div class="section-label">Key Wins Last Week</div>
    <div class="card card-full" style="margin-bottom:20px;">${keyWinsHTML}</div>

    <div class="section-label">Risks or Blockers</div>
    <div style="margin-bottom:20px;">${risksHTML}</div>

    <div class="section-label">Leadership Support Needed</div>
    <div style="margin-bottom:20px;">${supportHTML}</div>

    <div class="section-label">Weekly Timeline</div>
    <div class="card card-full">${timelineHTML}</div>
  `;

  window.requestAnimationFrame(() => {
    setTimeout(() => {
      document.querySelectorAll(".meter .value").forEach(c => {
        c.style.strokeDashoffset = c.dataset.targetOffset;
      });
    }, 150);
  });
}

async function init(){
  const params = new URLSearchParams(window.location.search);
  const ventureId = params.get("venture") || "takamol";

  const ventures = await loadVentureMap();
  const venture = ventures.find(v => v.id === ventureId) || ventures[0];

  document.title = `${venture.name} · Weekly Stand-up · Rimthan`;
  document.getElementById("crumbName").textContent = venture.name;

  const update = await loadProjectUpdate(venture.id);
  if (!update) {
    document.getElementById("ventureStrip").innerHTML = `
      <div class="strip-item"><span class="k">Venture</span><span class="v">${venture.name}</span></div>
      <div class="strip-item"><span class="k">Overall Health</span><span class="v health" style="color:${HEALTH_COLOR[venture.healthStatus]}"><span class="led"></span>${venture.healthStatus}</span></div>
      <div class="strip-logo">${venture.name}</div>
    `;
    renderEmptyState(venture.name);
    return;
  }
  renderStrip(venture, update);
  renderUpdate(venture, update);
}

init();
