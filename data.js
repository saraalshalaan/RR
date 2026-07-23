 /* =====================================================================
   RIMTHAN VENTURE GALAXY — DATA SOURCE
   ---------------------------------------------------------------------
   Field names below mirror Rimthan's actual weekly stand-up template
   (Venture / Venture Lead / Stage / Overall Health, Key Priorities,
   Key Wins, Risks/Blockers, Leadership Support Needed) so filling this
   in from a real stand-up doc is a direct copy, not a translation.
   ===================================================================== */

/* ----------------------------------------------------------------------
   1. VENTURE MAP DATA — one entry per node on the Venture Galaxy chart
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
];

/* chart coordinates, kept separate from business data — an AI feed
   should never need to know where a dot sits on screen */
const VENTURE_POSITIONS = {
  takamol:     { x: 190,  y: 430, bearing: "N24° · E118°" },
  aether:      { x: 430,  y: 215, bearing: "N41° · E122°" },
  novafreight: { x: 655,  y: 465, bearing: "N08° · E131°" },
  orbithealth: { x: 885,  y: 195, bearing: "N53° · E140°" },
  helios:      { x: 1075, y: 405, bearing: "N02° · E152°" }
};

/* ----------------------------------------------------------------------
   2. WEEKLY PROJECT UPDATES — keyed by venture id.
   Powers project.html?venture=<id>. Shape mirrors the real stand-up
   template exactly:
     venture, ventureLead, stage, overallHealth   — header strip
     priorities[]  — one row per stream (name, stream, team, progress,
                     progressNotes[], nextStep, notes)
     keyWins[]     — "Key wins last week"
     risks[]       — "Risks or blockers" (item, stream, severity, mitigation)
     support[]     — "Leadership support needed" (type, person)
     timeline      — completed vs this week's targets

   Only "takamol" has a real update below. A venture with no entry
   here renders a "not generated yet" state instead of erroring —
   exactly what you want once the AI stand-up starts filling these in
   automatically week to week.
   ---------------------------------------------------------------------- */
const PROJECT_UPDATES = {
  takamol: {
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
   map.js or project.js needs to change.

   Suggested API shape (so no other code changes):
     GET /ventures            -> VENTURE_MAP  (array, same fields)
     GET /ventures/:id/update -> one PROJECT_UPDATES[id] object, or
                                  404 / null if not generated yet
   ---------------------------------------------------------------------- */
const USE_LIVE_DATA = false; // flip to true once your backend is live

async function loadVentureMap(){
  if (USE_LIVE_DATA) {
    // TODO: const res = await fetch("https://your-api.com/ventures");
    // return await res.json();
  }
  return VENTURE_MAP;
}

async function loadVenturePosition(id){
  return VENTURE_POSITIONS[id] || { x: 600, y: 340, bearing: "" };
}

async function loadProjectUpdate(ventureId){
  if (USE_LIVE_DATA) {
    // TODO: const res = await fetch(`https://your-api.com/ventures/${ventureId}/update`);
    // if (!res.ok) return null;
    // return await res.json();
  }
  return PROJECT_UPDATES[ventureId] || null;
}
