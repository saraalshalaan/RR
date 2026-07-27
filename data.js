/* =====================================================================
   RIMTHAN VENTURE GALAXY — DATA SOURCE
   ---------------------------------------------------------------------
   Field names below mirror Rimthan's actual weekly stand-up template
   (Venture / Venture Lead / Stage / Overall Health, Key Priorities,
   Key Wins, Risks/Blockers, Leadership Support Needed) so filling this
   in from a real stand-up doc is a direct copy, not a translation.
   ===================================================================== */

/* ----------------------------------------------------------------------
   1. VENTURE DIRECTORY — one entry per venture card on the dashboard.
   This drives a searchable, filterable GRID rather than a fixed map,
   on purpose: a grid works whether there are 5 ventures or 500. Add a
   venture by adding an object here — nothing else needs to change.
   ---------------------------------------------------------------------- */
const VENTURE_MAP = [
  {
    id: "takamol",
    name: "Takamol",
    tagline: "Workforce mobility platform",
    healthStatus: "On Track",       // "On Track" | "At Risk" | "Off Track"
    activePriorities: 2,
    risks: 1,
    milestonesCompleted: 6
  },
  {
    id: "aether",
    name: "Aether Mobility",
    tagline: "Autonomous last-mile fleet",
    healthStatus: "On Track",
    activePriorities: 4,
    risks: 0,
    milestonesCompleted: 9
  },
  {
    id: "novafreight",
    name: "Nova Freight",
    tagline: "Cross-border logistics network",
    healthStatus: "At Risk",
    activePriorities: 5,
    risks: 3,
    milestonesCompleted: 7
  },
  {
    id: "orbithealth",
    name: "Orbit Health",
    tagline: "Remote diagnostics network",
    healthStatus: "On Track",
    activePriorities: 3,
    risks: 1,
    milestonesCompleted: 11
  },
  {
    id: "helios",
    name: "Helios Energy",
    tagline: "Distributed solar micro-grids",
    healthStatus: "Off Track",
    activePriorities: 2,
    risks: 4,
    milestonesCompleted: 3
  }

  // Add more ventures the same way — the dashboard's search, filter
  // and grid all scale automatically. The block below appends 45 demo
  // placeholders (purely so you can see the grid behave at ~50
  // ventures) — delete DEMO_FILLER_VENTURES and the lines that spread
  // it in below once you have real ventures to replace them with.
];

const DEMO_FILLER_VENTURES = (() => {
  const prefixes = ["Nimbus","Cedar","Falcon","Marlin","Delta","Onyx","Vertex","Lumen","Atlas","Quartz",
                     "Harbor","Ridge","Pioneer","Zenith","Solace","Meridian","Anchor","Beacon","Cobalt","Drift"];
  const suffixes = ["Labs","Works","Systems","Health","Logistics","Energy","Mobility","Retail","Finance","Robotics"];
  const healths = ["On Track","On Track","On Track","At Risk","Off Track"];
  const out = [];
  for (let i = 0; i < 45; i++){
    const p = prefixes[i % prefixes.length];
    const s = suffixes[(i + 3) % suffixes.length];
    out.push({
      id: `demo-${i+1}`,
      name: `${p} ${s}`,
      tagline: "Demo venture — replace with real data",
      healthStatus: healths[i % healths.length],
      activePriorities: (i % 5) + 1,
      risks: i % 4,
      milestonesCompleted: (i * 3) % 20
    });
  }
  return out;
})();

VENTURE_MAP.push(...DEMO_FILLER_VENTURES);

/* ----------------------------------------------------------------------
   2. WEEKLY PROJECT UPDATES — keyed by venture id.
   Powers project.html?venture=<id>. Shape mirrors the real stand-up
   template exactly:
     meta            — how/when this update was produced
     venture, ventureLead, stage, overallHealth   — header strip
     priorities[]    — one row per stream (name, stream, team, progress,
                       progressNotes[], nextStep, notes)
     keyWins[]       — "Key wins last week"
     risks[]         — "Risks or blockers" (item, stream, severity, mitigation)
     support[]       — "Leadership support needed" (type, person)
     timeline        — completed vs this week's targets

   Only "takamol" has a real update below. A venture with no entry
   here renders a "not generated yet" state instead of erroring —
   exactly what you want once the AI stand-up starts filling these in
   automatically week to week.
   ---------------------------------------------------------------------- */
const PROJECT_UPDATES = {
  takamol: {
    meta: {
      generatedFrom: "Meeting transcript",   // vs. "Manual entry"
      generatedAt: "Jul 24, 2026"
    },
    ventureLead: "Ali",
    stage: "MVB, handover",
    weekLabel: "Week of Jul 20 – Jul 24",
    overallHealth: "On Track",

    priorities: [
      {
        name: "Business Development Taskforce",
        stream: "BORD",
        team: "Feras, Ibrahim",
        progress: 95,
        progressNotes: [
          "Albawani — start the procurement process",
          "Meeting done: Proline, ToYou, THA, EFSIM",
          "Meeting set: Oriental Yields Ltd., Tamkeen HR, Al-Suwaidi Holding Co."
        ],
        nextStep: "Demo · Proline",
        notes: ""
      },
      {
        name: "Tech",
        stream: "BORD",
        team: "Kuba",
        progress: 99,
        progressNotes: [
          "Course assignment per user/team/org & PDPL — RELEASE DONE, production",
          "Now: Marketplace + Checkout.com release, waiting for prod card approval"
        ],
        nextStep: "",
        notes: ""
      }
    ],

    keyWins: [
      // populate from "Key wins last week" — empty this week
    ],

    risks: [
      {
        item: "Stream Commercial",
        stream: "BORD",
        severity: "Medium",
        mitigation: ""
      }
    ],

    support: [
      {
        type: "",
        person: ""
      }
    ],

    timeline: {
      completed: [],
      targets: ["Demo · Proline", "Marketplace go-live"]
    }
  }

  // aether: { ...same shape as "takamol" above... },
  // novafreight: { ...same shape as "takamol" above... },
};

/* ----------------------------------------------------------------------
   3. LIVE DATA CONNECTOR — the seam for your AI stand-up generator
   ---------------------------------------------------------------------
   Everything reads through the functions below instead of touching
   VENTURE_MAP / PROJECT_UPDATES directly. Today they just hand back
   the static objects above. When your generator is ready, flip
   USE_LIVE_DATA to true and fill in the fetch() calls — nothing in
   the page scripts needs to change.

   Suggested API shape (so no other code changes):
     GET  /ventures                  -> VENTURE_MAP  (array, same fields)
     GET  /ventures/:id/update       -> one PROJECT_UPDATES[id] object, or
                                        404 / null if not generated yet
     POST /ventures/:id/generate     -> { transcript } in, one
                                        PROJECT_UPDATES[id]-shaped object out
   ---------------------------------------------------------------------- */
const USE_LIVE_DATA = false; // flip to true once your backend is live

async function loadVentureMap(){
  if (USE_LIVE_DATA) {
    // TODO: const res = await fetch("https://your-api.com/ventures");
    // return await res.json();
  }
  return VENTURE_MAP;
}

async function loadProjectUpdate(ventureId){
  if (USE_LIVE_DATA) {
    // TODO: const res = await fetch(`https://your-api.com/ventures/${ventureId}/update`);
    // if (!res.ok) return null;
    // return await res.json();
  }
  return PROJECT_UPDATES[ventureId] || null;
}

/* Generates (or regenerates) a venture's weekly stand-up from a pasted
   meeting transcript. This is the exact seam for "take a script from
   the meeting and turn it into the stand-up" — today it's a stub that
   returns null so the UI can show an honest "not connected yet" state
   instead of pretending to work. */
async function generateStandupFromTranscript(ventureId, transcriptText){
  if (USE_LIVE_DATA) {
    // TODO: const res = await fetch(`https://your-api.com/ventures/${ventureId}/generate`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ transcript: transcriptText })
    // });
    // const update = await res.json();
    // PROJECT_UPDATES[ventureId] = update; // cache for this session
    // return update;
  }
  return null;
}
