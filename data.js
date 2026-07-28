/* =====================================================================
   RIMTHAN VENTURE GALAXY — DATA SOURCE
   ---------------------------------------------------------------------
   Field names below mirror Rimthan's actual weekly stand-up template
   (Venture / Venture Lead / Stage / Overall Health, Key Priorities,
   Key Wins, Risks/Blockers, Leadership Support Needed) so filling this
   in from a real stand-up doc is a direct copy, not a translation.

   Populated from the real "Weekly Standup" deck. A few numbers (progress
   %, priority/risk/milestone counts) weren't stated as exact figures in
   the source and were estimated to fit the schema — see the inline
   comments marking each estimate.
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
    activePriorities: 3,
    risks: 1,
    milestonesCompleted: 3,
    archived: false                 // set true once a venture is handed off / submitted —
                                     // it stays in the data (nothing is deleted) but drops
                                     // out of the default dashboard view
  },
  {
    id: "qiib",
    name: "QIIB",
    tagline: "Digital banking & salary-switch app",
    healthStatus: "On Track",
    activePriorities: 2,
    risks: 0,
    milestonesCompleted: 0,
    archived: false
  },
  {
    id: "seize",
    name: "Seize",
    tagline: "RDI establishment & business development",
    healthStatus: "On Track",
    activePriorities: 2,
    risks: 0,
    milestonesCompleted: 1,
    archived: false
  },
  {
    id: "alansari",
    name: "Al Ansari",
    tagline: "Venture studio blueprint",
    healthStatus: "On Track",
    activePriorities: 3,
    risks: 1,
    milestonesCompleted: 2,
    archived: false
  },
  {
    id: "altawuniya-partnerships",
    name: "Altawuniya Partnerships",
    tagline: "Partnership engine diagnostic",
    healthStatus: "On Track",
    activePriorities: 3,
    risks: 0,
    milestonesCompleted: 0,
    archived: false
  },
  {
    id: "altawuniya-occupational-health",
    name: "Altawuniya Occupational Health",
    tagline: "Occupational health value proposition",
    healthStatus: "On Track",
    activePriorities: 3,
    risks: 1,
    milestonesCompleted: 0,
    archived: false
  },
  {
    id: "altawuniya-snb",
    name: "Altawuniya SNB",
    tagline: "SNB ideation & validation sprint",
    healthStatus: "On Track",
    activePriorities: 3,
    risks: 3,
    milestonesCompleted: 1,
    archived: false
  },
  {
    id: "sar",
    name: "SAR",
    tagline: "Mobility-as-a-service platform",
    healthStatus: "On Track",
    activePriorities: 3,
    risks: 0,
    milestonesCompleted: 3,
    archived: false
  },
  {
    id: "almajed-oud",
    name: "Almajed Oud",
    tagline: "Organic hotel & personal-care products",
    healthStatus: "On Track",
    activePriorities: 1,
    risks: 0,
    milestonesCompleted: 0,
    archived: false
  },
  {
    id: "tasdeed",
    name: "Tasdeed",
    tagline: "SME invoice financing",
    healthStatus: "On Track",
    activePriorities: 1,
    risks: 0,
    milestonesCompleted: 0,
    archived: false
  },
  {
    id: "hcc",
    name: "Health Credit Card (HCC)",
    tagline: "Out-of-pocket healthcare discounts",
    healthStatus: "On Track",
    activePriorities: 1,
    risks: 0,
    milestonesCompleted: 0,
    archived: false
  }

  // Add more ventures the same way — search, filter and the grid all
  // scale automatically. Once a venture graduates or is handed off,
  // don't delete its entry — set archived: true instead so its history
  // stays intact but it drops out of the default dashboard view.
];

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

   A venture with no entry here renders a "not generated yet" state
   instead of erroring — exactly what you want once the AI stand-up
   starts filling these in automatically week to week.
   ---------------------------------------------------------------------- */
const PROJECT_UPDATES = {
  takamol: {
    ventureLead: "Ali",
    stage: "MVB, handover",
    weekLabel: "Latest weekly update",
    overallHealth: "On Track",

    priorities: [
      {
        name: "Commercialization & Sales Activation",
        stream: "Commercial",
        team: "Tina, Shahad, Feras",
        progress: 70, // not stated as a % in source — estimated
        progressNotes: [
          "Executed outreach campaign (1,000+ messages sent) to activate pipeline",
          "Re-initiated sales efforts with structured follow-up approach"
        ],
        nextStep: "",
        notes: ""
      },
      {
        name: "Client Onboarding & Experience",
        stream: "Operation",
        team: "Tina, Feras",
        progress: 80,
        progressNotes: [
          "Developing standardized onboarding templates for clients",
          "Defining client journey and activation steps"
        ],
        nextStep: "",
        notes: ""
      },
      {
        name: "Tech Stability & Compliance",
        stream: "Tech and legal",
        team: "Marcus, Zuza",
        progress: 80,
        progressNotes: [],
        nextStep: "",
        notes: "PDPL compliance, LEAP conference"
      }
    ],

    keyWins: [
      "Nominait officially launched into production",
      "Platform stability confirmed by tech team",
      "Candidate invitations started"
    ],

    risks: [
      { item: "Low conversion despite high outreach", stream: "Commercial", severity: "Medium", mitigation: "" }
    ],

    support: [
      { type: "", person: "" }
    ],

    timeline: {
      completed: ["Nominait launched into production"],
      targets: ["Improve outreach conversion", "Finalize onboarding templates"]
    }
  },

  qiib: {
    ventureLead: "Gustav",
    stage: "Validation",
    weekLabel: "Latest weekly update",
    overallHealth: "On Track",

    priorities: [
      {
        name: "Validation",
        stream: "Stream 2",
        team: "Renad, Noura, Agata",
        progress: 60, // source shows "Ongoing" with no %, estimated
        progressNotes: [
          "V2 prototype ready and being tested against UX, value props",
          "Usability testing running on selected features",
          "V3 research-backed validation is under progress",
          "High buy-in from Qatar nationals and expats during usability testing"
        ],
        nextStep: "",
        notes: "NA"
      },
      {
        name: "Mobile App Development",
        stream: "Stream 3",
        team: "Marcus, Zuza, Norbert, Vlad",
        progress: 60,
        progressNotes: [
          "Terms of Service backend fully delivered",
          "V1 refinement session done with devops to align scope",
          "Onboarding is ready"
        ],
        nextStep: "",
        notes: ""
      }
    ],

    keyWins: [],
    risks: [],
    support: [],

    timeline: {
      completed: [],
      targets: [
        "Integrate Regula for ID document capture & verification",
        "Build file upload for registration forms",
        "Deploy Keycloak on Azure",
        "End-to-end test and refine registration form UI"
      ]
    }
  },

  seize: {
    ventureLead: "Ahmed",
    stage: "RDI Setup",
    weekLabel: "Latest weekly update",
    overallHealth: "On Track",

    priorities: [
      {
        name: "Account Strategy & Lighthouse",
        stream: "S2",
        team: "Christoffer, Damian, Kuba, Ahmed, Kamil, Wojtech",
        progress: 80,
        progressNotes: [
          "Lighthouse V1.5 implementation",
          "Lighthouse frontend done + backend connection",
          "Lighthouse branding iteration done"
        ],
        nextStep: "Complete and connect all V1.5 features",
        notes: ""
      },
      {
        name: "Business Development (BD)",
        stream: "S3",
        team: "Aryan, Ahmed, Naif, Hussam, Majed, Abdullah",
        progress: 70, // source shows "Ongoing" with no %, estimated
        progressNotes: [
          "First official MOU signed",
          "Multiple key meetings this week",
          "CEO update"
        ],
        nextStep: "BD dashboard workshop, Knowledge Hub proposal, Economical card evolution",
        notes: ""
      }
    ],

    keyWins: ["First official MOU signed"],
    risks: [],
    support: [],

    timeline: {
      completed: ["Lighthouse frontend + backend connection"],
      targets: ["Complete V1.5 features", "BD dashboard workshop", "Knowledge Hub proposal"]
    }
  },

  alansari: {
    ventureLead: "Nikola",
    stage: "Final sprint",
    weekLabel: "Latest weekly update",
    overallHealth: "On Track",

    priorities: [
      {
        name: "Venture Studio Blueprint",
        stream: "Workstream 1",
        team: "Nikola, Christofer, Gustav",
        progress: 95,
        progressNotes: ["Milestone 2 deck presented", "Building blocks foundation complete"],
        nextStep: "",
        notes: "Huge enthusiasm from the board"
      },
      {
        name: "Venture Advisory Packs",
        stream: "Workstream 2",
        team: "Aryan, Nikola",
        progress: 95,
        progressNotes: [
          "Advisory packs in final development, to be finalised this week",
          "Board-wide input clarified on both ventures"
        ],
        nextStep: "",
        notes: ""
      },
      {
        name: "Full Venture Business Case",
        stream: "Workstream 3",
        team: "Nikola, Aryan, Ahmed, Leen",
        progress: 95,
        progressNotes: [
          "E-Home deep dive and branding presented during workshop 2",
          "Largest enthusiasm amongst all current ventures"
        ],
        nextStep: "",
        notes: "Manage client enthusiasm while business model issues remain"
      }
    ],

    keyWins: [
      "Final workshop preparation going great",
      "Formal proposal request for Rimthan to remain in the process"
    ],

    risks: [
      { item: "Advisory packs may become too detailed for a new direction", stream: "Workstream 2", severity: "Low", mitigation: "" }
    ],

    support: [],

    timeline: {
      completed: ["Milestone 2 deck presented", "Building blocks foundation complete"],
      targets: ["Finalize advisory packs", "Present final business case"]
    }
  },

  "altawuniya-partnerships": {
    ventureLead: "Rasha",
    stage: "Discovery Phase",
    weekLabel: "Latest weekly update",
    overallHealth: "On Track",

    priorities: [
      {
        name: "Diagnostic of Partnership Engine",
        stream: "S1",
        team: "Rasha, Ahmed, Tina",
        progress: 100,
        progressNotes: ["Pending client sign-off"],
        nextStep: "",
        notes: ""
      },
      {
        name: "Operating Models",
        stream: "S2",
        team: "Michael, Patrick, Sebastian",
        progress: 75,
        progressNotes: [],
        nextStep: "",
        notes: ""
      },
      {
        name: "Opportunity Activation & Execution Readiness",
        stream: "S3",
        team: "Rasha, Ahmed",
        progress: 20,
        progressNotes: [],
        nextStep: "",
        notes: ""
      }
    ],

    keyWins: [],
    risks: [],
    support: [],

    timeline: {
      completed: ["Diagnostic of Partnership Engine"],
      targets: ["Continue to design the Operating Model", "Reach out to Takamol on partnership opportunities"]
    }
  },

  "altawuniya-occupational-health": {
    ventureLead: "Ali & Leen",
    stage: "Validation Phase",
    weekLabel: "Latest weekly update",
    overallHealth: "On Track",

    priorities: [
      {
        name: "Value Proposition",
        stream: "",
        team: "",
        progress: 100,
        progressNotes: ["Reviewed the value proposition, ICP and personas with the client for the final version"],
        nextStep: "",
        notes: ""
      },
      {
        name: "Financials",
        stream: "",
        team: "",
        progress: 70,
        progressNotes: [
          "Mapping out business model and different potential revenue streams",
          "Structuring the financial projections"
        ],
        nextStep: "",
        notes: ""
      },
      {
        name: "Operating Model",
        stream: "",
        team: "",
        progress: 100,
        progressNotes: ["Developing the operating model for this venture"],
        nextStep: "",
        notes: ""
      }
    ],

    keyWins: [],
    risks: [
      { item: "Value proposition finalization pending client review", stream: "", severity: "Low", mitigation: "" }
    ],
    support: [],

    timeline: {
      completed: ["Value proposition finalized", "Operating model developed"],
      targets: ["Finalize financial projections"]
    }
  },

  "altawuniya-snb": {
    ventureLead: "Nikola",
    stage: "Ideation & Validation Sprint — Week 4 of 8",
    weekLabel: "Latest weekly update",
    overallHealth: "On Track",

    priorities: [
      {
        name: "WS1 Delivery",
        stream: "",
        team: "",
        progress: 100,
        progressNotes: [
          "Workshop 1 delivered successfully (Jul 22)",
          "Follow-up workshop scheduled this week to close open questions and finalize OA prioritization"
        ],
        nextStep: "",
        notes: ""
      },
      {
        name: "Solution Concept Prioritization Research",
        stream: "",
        team: "",
        progress: 60, // source shows "On track", no % given, estimated
        progressNotes: [
          "Screening and shaping solution concepts for the front-running opportunity areas",
          "Getting a head start ahead of the Aug 4 prioritization milestone"
        ],
        nextStep: "",
        notes: ""
      },
      {
        name: "Workshop 2",
        stream: "",
        team: "",
        progress: 50, // source shows "On track", no % given, estimated
        progressNotes: ["Working toward Aug 4 milestone: 5 solution concepts ranked, 2–3 advancing to validation"],
        nextStep: "",
        notes: ""
      }
    ],

    keyWins: ["Workshop 1 delivered successfully"],

    risks: [
      { item: "SNB open questions must close this week to keep prioritization on schedule", stream: "", severity: "Medium", mitigation: "Follow-up workshop scheduled" },
      { item: "Building on unconfirmed signals from Workshop 1", stream: "", severity: "Medium", mitigation: "" },
      { item: "Time pressure ahead of the Aug 4 milestone", stream: "", severity: "High", mitigation: "Lock in scope early" }
    ],

    support: [],

    timeline: {
      completed: ["Workshop 1 delivered"],
      targets: ["Close SNB open questions", "Rank 5 solution concepts", "Advance 2–3 to validation"]
    }
  },

  sar: {
    ventureLead: "Aziz",
    stage: "Build Phase",
    weekLabel: "Latest weekly update",
    overallHealth: "On Track",

    priorities: [
      {
        name: "Integration Negotiations",
        stream: "Partnerships",
        team: "Wajd, Abdulelah",
        progress: 70, // source shows "On-track" status dot, no %, estimated
        progressNotes: [
          "Jeddah pilot completed",
          "Telgani feedback sent — mandate code still pending, blocking dev",
          "Jeeny dynamic pricing flagged: price must be final at booking (SLA clause needed)",
          "MDA met with Ziyad Deoli; TGA on hold until after launch"
        ],
        nextStep: "",
        notes: ""
      },
      {
        name: "Product – Design & Research",
        stream: "Product",
        team: "Yaman",
        progress: 70,
        progressNotes: ["Cross-functional squads launched (Product + Design + Eng + QA)", "Pilot bugs logged"],
        nextStep: "",
        notes: ""
      },
      {
        name: "CS & CRM Build",
        stream: "Operations",
        team: "Wajd, Ani",
        progress: 70,
        progressNotes: ["ElevenLabs guardrails enabled on agent"],
        nextStep: "",
        notes: ""
      }
    ],

    keyWins: [
      "First real HHR production bookings on MaaS app — biggest milestone yet",
      "EBKS stress test scheduled for Jul 21 — finally happening",
      "CTC, HyperPay, HHR all confirmed working; mobile 80% pilot-ready"
    ],

    risks: [],
    support: [],

    timeline: {
      completed: ["First HHR production bookings"],
      targets: ["Run EBKS stress test", "Resolve Telgani mandate code blocker"]
    }
  },

  "almajed-oud": {
    ventureLead: "Ghiyath Alani",
    stage: "Validation",
    weekLabel: "Latest weekly update",
    overallHealth: "On Track",

    priorities: [
      {
        name: "Validation",
        stream: "",
        team: "",
        progress: 70, // source shows "On Track" status dot, no %, estimated
        progressNotes: [
          "20 hypotheses validated, with 52 currently underway",
          "25+ visits and interviews conducted during the validation phase",
          "Progress is steady across both purely and bundle"
        ],
        nextStep: "",
        notes: "NA"
      }
    ],

    keyWins: [],
    risks: [],
    support: [],

    timeline: {
      completed: ["20 hypotheses validated"],
      targets: ["Continue validating remaining 52 hypotheses"]
    }
  },

  tasdeed: {
    ventureLead: "Ziyad Al Homaid",
    stage: "Activation Phase",
    weekLabel: "Latest weekly update",
    overallHealth: "On Track",

    priorities: [
      {
        name: "8-Week Activation Phase",
        stream: "Tasdeed",
        team: "Ziyad, Noura",
        progress: 60, // source shows "On track" status dot, no %, estimated
        progressNotes: [
          "Conducted 10+ interviews with importers & financing partners",
          "Signed 3 MoUs with importers",
          "Signed 2 MoUs with financing partners (Beehive, Raqameyah)"
        ],
        nextStep: "",
        notes: ""
      }
    ],

    keyWins: [],
    risks: [],
    support: [],

    timeline: {
      completed: ["3 MoUs signed with importers", "2 MoUs signed with financing partners"],
      targets: ["Continue activation-phase outreach"]
    }
  },

  hcc: {
    ventureLead: "",
    stage: "Phase 1",
    weekLabel: "Latest weekly update",
    overallHealth: "On Track",

    priorities: [
      {
        name: "Phase 1",
        stream: "",
        team: "",
        progress: 60, // no % stated in source, estimated
        progressNotes: [
          "Focused value prop: out-of-pocket healthcare discounts incl. premium access",
          "Double CEO presentation scheduled; Chief Development Officer presentation same day"
        ],
        nextStep: "Green light on Build 'Phase 2'",
        notes: ""
      }
    ],

    keyWins: [],
    risks: [],
    support: [],

    timeline: { completed: [], targets: ["Secure green light on Phase 2 build"] }
  }
};

/* ----------------------------------------------------------------------
   3. LIVE DATA CONNECTOR — the seam for a future backend
   ---------------------------------------------------------------------
   Everything reads through the functions below instead of touching
   VENTURE_MAP / PROJECT_UPDATES directly. Today they just hand back
   the static objects above. When a backend is ready, flip
   USE_LIVE_DATA to true and fill in the fetch() calls — nothing in
   the page scripts needs to change.

   Suggested API shape (so no other code changes):
     GET  /ventures                  -> VENTURE_MAP  (array, same fields)
     GET  /ventures/:id/update       -> one PROJECT_UPDATES[id] object, or
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

async function loadProjectUpdate(ventureId){
  if (USE_LIVE_DATA) {
    // TODO: const res = await fetch(`https://your-api.com/ventures/${ventureId}/update`);
    // if (!res.ok) return null;
    // return await res.json();
  }
  return PROJECT_UPDATES[ventureId] || null;
}
