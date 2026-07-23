/* =====================================================================
   RIMTHAN VENTURE GALAXY — GENERIC PROJECT PAGE RENDERER
   Reads ?venture=<id> from the URL, then loads that venture's info
   (loadVentureMap) and its latest update (loadProjectUpdate) — see
   data.js. Works for any venture id with no page-specific code; a
   venture with no update yet gets a clean "not generated" state
   instead of an error. This is the file your AI generator's output
   flows through once it's connected.
   ===================================================================== */

const HEALTH_COLOR = {
  "On Track":  "#3FE0A6",
  "At Risk":   "#F0A93B",
  "Off Track": "#EF5D6C"
};

function meterSVG(progress){
  const r = 27, c = 2 * Math.PI * r;
  const offset = c * (1 - progress / 100);
  return `
    <div class="meter">
      <svg viewBox="0 0 64 64">
        <circle class="track" cx="32" cy="32" r="${r}"></circle>
        <circle class="value" cx="32" cy="32" r="${r}"
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
    <div class="card card-full" style="text-align:center;padding:60px 30px;">
      <h3 style="font-family:var(--font-display);font-size:19px;margin-bottom:10px;">
        No weekly update yet for ${ventureName}
      </h3>
      <p style="color:var(--slate);font-size:14px;">
        This venture's stand-up hasn't been generated this week. Check back once it's run.
      </p>
    </div>
  `;
}

function renderUpdate(d){
  document.getElementById("weekLabel").textContent = d.weekLabel;

  const healthColor = HEALTH_COLOR[d.overallHealth] || "#8B98B8";
  document.getElementById("healthPill").style.color = healthColor;
  document.getElementById("healthPill").innerHTML =
    `<span class="led" style="background:${healthColor}"></span><span style="color:var(--ink)">${d.overallHealth}</span>`;

  const prioritiesHTML = d.priorities.map(p => `
    <div class="card">
      <div class="card-head">
        <div><h3>${p.team}</h3><small>${p.lead}</small></div>
        ${meterSVG(p.progress)}
      </div>
      <ul class="bullet-list">
        ${p.meetings.map(m => `<li>${m}</li>`).join("")}
      </ul>
      <a class="next-step" href="#">${p.nextStep}</a>
    </div>
  `).join("");

  const allPoints = [
    ...d.timeline.completed.map(label => ({ label, done: true })),
    ...d.timeline.targets.map(label => ({ label, done: false }))
  ];
  const donePct = (d.timeline.completed.length / allPoints.length) * 100;

  document.getElementById("updateBody").innerHTML = `
    <div class="card-grid" style="margin-bottom:22px;">${prioritiesHTML}</div>

    <div class="card card-full" style="margin-bottom:22px;">
      <div class="card-head"><div><h3>Key Wins</h3><small>Last week</small></div></div>
      <ul class="bullet-list">${d.keyWins.map(w => `<li>${w}</li>`).join("")}</ul>
    </div>

    <div class="card-grid" style="margin-bottom:22px;">
      <div class="card risk-card">
        <div class="risk-head">
          <span class="led" style="color:var(--at-risk)"></span>
          <h3 style="font-family:var(--font-display);font-size:16px;">${d.risk.stream} · ${d.risk.owner}</h3>
        </div>
        <span class="severity-tag" style="margin-bottom:12px;display:inline-block;">Severity: ${d.risk.severity}</span>
        <p>${d.risk.note}</p>
      </div>
      <div class="card support-card">
        <div>
          <h3 style="font-family:var(--font-display);font-size:16px;margin-bottom:8px;">${d.support.type}</h3>
          <p><strong style="color:var(--ink)">Person involved:</strong> ${d.support.person} — ${d.support.note}</p>
        </div>
        <button class="support-btn" type="button">Approve request</button>
      </div>
    </div>

    <div class="card card-full">
      <div class="card-head"><div><h3>Weekly Timeline</h3><small>Completed &amp; this week's targets</small></div></div>
      <div class="timeline-wrap">
        <span class="tl-tag">${d.timeline.completed.length} completed &middot; ${d.timeline.targets.length} targeted this week</span>
        <div class="timeline-track" style="background:linear-gradient(90deg, var(--on-track) 0%, var(--on-track) ${donePct}%, var(--panel-edge) ${donePct}%, var(--panel-edge) 100%);"></div>
        <div class="timeline-points">
          ${allPoints.map(p => `
            <div class="tl-point ${p.done ? "" : "pending"}">
              <div class="tl-dot"></div>
              <span>${p.label}</span>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
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

  document.title = `${venture.name} · Weekly Update · Rimthan`;
  document.getElementById("crumbName").textContent = venture.name;
  document.getElementById("ventureTitle").textContent = `${venture.name} — Weekly Update`;

  const update = await loadProjectUpdate(venture.id);
  if (!update) {
    document.getElementById("healthPill").style.display = "none";
    renderEmptyState(venture.name);
    return;
  }
  renderUpdate(update);
}

init();
