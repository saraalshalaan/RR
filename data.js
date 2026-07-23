/* =====================================================================
   RIMTHAN VENTURE GALAXY — DATA SOURCE
   ---------------------------------------------------------------------
   Everything the map and project pages render lives in this one file.
   Update these objects and the UI updates automatically — no markup
   or script changes required.
   ===================================================================== */

/* ----------------------------------------------------------------------
   1. VENTURE MAP DATA
   One entry per node on the Venture Galaxy chart (index.html).
   x / y are position coordinates on a 1200 x 640 chart plane —
   move a venture by changing these two numbers.
   ---------------------------------------------------------------------- */
const VENTURE_MAP = [
  {
    id: "takamol",
    name: "Takamol",
    tagline: "Workforce mobility platform",
    healthStatus: "On Track",       // "On Track" | "At Risk" | "Off Track"
    activePriorities: 6,
    risks: 1,
    milestonesCompleted: 14,
    iconImageUrl: "assets/icons/takamol.svg" // placeholder
  },
  {
    id: "aether",
    name: "Aether Mobility",
    tagline: "Autonomous last-mile fleet",
    healthStatus: "On Track",
    activePriorities: 4,
    risks: 0,
    milestonesCompleted: 9,
    iconImageUrl: "assets/icons/aether.svg"
  },
  {
    id: "novafreight",
    name: "Nova Freight",
    tagline: "Cross-border logistics network",
    healthStatus: "At Risk",
    activePriorities: 5,
    risks: 3,
    milestonesCompleted: 7,
    iconImageUrl: "assets/icons/novafreight.svg"
  },
  {
    id: "orbithealth",
    name: "Orbit Health",
    tagline: "Remote diagnostics network",
    healthStatus: "On Track",
    activePriorities: 3,
    risks: 1,
    milestonesCompleted: 11,
    iconImageUrl: "assets/icons/orbithealth.svg"
  },
  {
    id: "helios",
    name: "Helios Energy",
    tagline: "Distributed solar micro-grids",
    healthStatus: "Off Track",
    activePriorities: 2,
    risks: 4,
    milestonesCompleted: 3,
    iconImageUrl: "assets/icons/helios.svg"
  }
];

/* fixed chart coordinates, kept separate from business data on purpose —
   an AI-generated feed should never need to know where a dot sits on screen */
const VENTURE_POSITIONS = {
  takamol:     { x: 190,  y: 430, bearing: "N24° · E118°" },
  aether:      { x: 430,  y: 215, bearing: "N41° · E122°" },
  novafreight: { x: 655,  y: 465, bearing: "N08° · E131°" },
  orbithealth: { x: 885,  y: 195, bearing: "N53° · E140°" },
  helios:      { x: 1075, y: 405, bearing: "N02° · E152°" }
};

/* ----------------------------------------------------------------------
   2. WEEKLY PROJECT UPDATES
   Keyed by venture id. Powers project.html?venture=<id>.
   Only "takamol" has a sample update below — that's intentional. Once
   your AI generator is connected, it can add/replace an entry here (or,
   with USE_LIVE_DATA on, return one straight from the API) for ANY
   venture id from VENTURE_MAP, and project.html will render it with no
   code changes. A venture with no entry here shows a "not generated
   yet" state instead of erroring.
   ---------------------------------------------------------------------- */
const PROJECT_UPDATES = {
  takamol: {
    weekLabel: "Week of Jul 20 – Jul 24",
    overallHealth: "On Track",

    // Active Priorities: two focus areas (BizDev + Tech)
    priorities: [
      {
        team: "Business Development Taskforce",
        lead: "BORD",
        progress: 95,
        meetings: [
          "4 meetings set with strategic partners",
          "3 meetings completed this week"
        ],
        nextStep: "Demo · Proline"
      },
      {
        team: "Tech",
        lead: "Kuba",
        progress: 99,
        meetings: [
          "RELEASE DONE — core checkout module",
          "Marketplace integration live on Checkout.com"
        ],
        nextStep: "Go-live · Marketplace"
      }
    ],

    // Key Wins (last week)
    keyWins: [
      "Meeting done — signed intent with anchor partner",
      "4 new meetings set for next sprint",
      "RELEASE DONE — checkout module shipped to production"
    ],

    // Risks / Blockers
    risk: {
      stream: "Stream Commercial",
      owner: "BORD",
      severity: "Medium",
      note: "Commercial terms pending legal sign-off before rollout can proceed."
    },

    // Leadership Support Needed
    support: {
      type: "Provide prod card approval",
      person: "Kuba",
      note: "Blocking the Checkout.com marketplace go-live until approved."
    },

    // Weekly timeline: completed milestones + this week's targets
    timeline: {
      completed: ["Meeting done", "Meeting set", "RELEASE DONE"],
      targets: ["Prod card approval", "Demo · Proline", "Marketplace go-live"]
    }
  }

  // aether: { ...same shape as "takamol" above... },
  // novafreight: { ...same shape as "takamol" above... },
};

/* ----------------------------------------------------------------------
   3. LIVE DATA CONNECTOR — the seam for your AI stand-up generator
   ---------------------------------------------------------------------
   Everything on this page currently reads through the two functions
   below instead of touching VENTURE_MAP / PROJECT_UPDATES directly.
   That's the whole point: today they just hand back the static objects
   above. When your generator is ready, flip USE_LIVE_DATA to true and
   fill in the two fetch() calls — nothing in map.js or detail.js needs
   to change, because they already just `await` these functions.

   Suggested shape for your API responses (so no other code changes):
     GET /ventures            -> VENTURE_MAP  (array, same fields)
     GET /ventures/:id/update -> one PROJECT_UPDATES[id] object, or
                                  404 / null if that venture has no
                                  update generated yet this week
   ---------------------------------------------------------------------- */
const USE_LIVE_DATA = false; // flip to true once your backend is live

async function loadVentureMap(){
  if (USE_LIVE_DATA) {
    // TODO: point this at your AI backend, e.g.
    // const res = await fetch("https://your-api.com/ventures");
    // return await res.json();
  }
  return VENTURE_MAP;
}

async function loadVenturePosition(id){
  // chart coordinates always stay local — no reason for the AI feed to manage layout
  return VENTURE_POSITIONS[id] || { x: 600, y: 340, bearing: "" };
}

async function loadProjectUpdate(ventureId){
  if (USE_LIVE_DATA) {
    // TODO: point this at your AI backend, e.g.
    // const res = await fetch(`https://your-api.com/ventures/${ventureId}/update`);
    // if (!res.ok) return null;
    // return await res.json();
  }
  return PROJECT_UPDATES[ventureId] || null;
}
