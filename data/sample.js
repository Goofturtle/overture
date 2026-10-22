// SAMPLE DATA. Every company and person in this file is made up.
// It stands in for what only Spotify has: its customer records (HubSpot),
// signed papers (Google Drive, DocuSign), call notes (Gong) and job-change alerts.
// Company names that appear on the real Backstage adopters list (for example bol.com)
// are only used as someone's past employer, never given made-up history.

window.SAMPLE = {
  today: "2026-10-18",

  // Upcoming calls on Chris's calendar.
  invites: [
    {
      id: "northwind",
      title: "Discovery call: Northwind Freight and Spotify Portal",
      when: "Tue Oct 20, 10:00 to 10:45 ET",
      company: "Northwind Freight",
      meetingCode: "nwf-portal-call", // made up; inside Google Meet the panel matches the real meeting code to a call
      attendees: [
        { name: "Priya Raman", email: "priya.raman@northwindfreight.example" },
        { name: "Marcus Bell", email: "marcus.bell@northwindfreight.example" },
        { name: "Elena Cruz", email: "elena.cruz@northwindfreight.example" },
      ],
      notes: "Marcus says Backstage upgrades are eating his team's time. They also looked at Port last quarter.",
      versionFile: '{\n  "version": "1.24.0"\n}',
      backstageSince: 2021,
      afterNotes:
        "Priya wants a one-month pilot. Elena asked for the latest security pack before procurement. " +
        "Marcus said Tom Hughes from their security team will join the next call. Budget is approved for Q1.",
    },
    {
      id: "quillstack",
      title: "Intro: Quillstack and Spotify (AI coding agents)",
      when: "Wed Oct 21, 14:00 to 14:30 ET",
      company: "Quillstack",
      meetingCode: "qsk-intro-call",
      attendees: [
        { name: "Sam Okafor", email: "sam@quillstack.example" },
        { name: "Dana Li", email: "dana.li@quillstack.example" },
      ],
      notes: "Their engineers use Claude Code and Codex every day. They want their AI agents to know who owns what.",
      versionFile: "",
      backstageSince: null,
      afterNotes:
        "Sam wants to try Xirp with two teams first. Dana asked how Xirp connects to Portal later. " +
        "No NDA yet. Follow up next week.",
    },
    {
      id: "rookery",
      title: "Experimentation chat: Rookery Retail and Spotify Confidence",
      when: "Thu Oct 22, 11:00 to 11:45 ET",
      company: "Rookery Retail",
      meetingCode: "rky-confidence",
      attendees: [
        { name: "Michael Tran", email: "michael.tran@rookery.example" },
        { name: "Ava Brooks", email: "ava.brooks@rookery.example" },
      ],
      notes: "They run A/B tests on their checkout page. They use LaunchDarkly for feature flags today.",
      versionFile: "",
      backstageSince: null,
      afterNotes:
        "Ava wants to see how Confidence measures results. Michael asked about pricing for 40 engineers. " +
        "Security review needed before a pilot.",
    },
  ],

  // What Spotify's customer records would say about each person (stands in for HubSpot and LinkedIn Sales Navigator).
  people: {
    "priya.raman@northwindfreight.example": {
      photo: "https://images.pexels.com/photos/29811345/pexels-photo-29811345.jpeg?auto=compress&cs=tinysrgb&w=320&h=320&fit=crop", // stock photo (Pexels licence), see CREDITS.md
      title: "VP, Platform Engineering", startedAt: "2026-05", previous: "bol.com",
      previousRole: "Head of Developer Experience", known: false,
      note: "",
    },
    "marcus.bell@northwindfreight.example": {
      photo: "https://images.pexels.com/photos/37148308/pexels-photo-37148308.jpeg?auto=compress&cs=tinysrgb&w=320&h=320&fit=crop", // stock photo (Pexels licence), see CREDITS.md
      title: "Staff Engineer, Developer Experience", startedAt: "2022-03", previous: "", known: true,
      note: "Runs Northwind's Backstage. Came to Portal Office Hours in March 2026.",
    },
    "elena.cruz@northwindfreight.example": {
      photo: "https://images.pexels.com/photos/30004323/pexels-photo-30004323.jpeg?auto=compress&cs=tinysrgb&w=320&h=320&fit=crop", // stock photo (Pexels licence), see CREDITS.md
      title: "Director, Procurement", startedAt: "2019-08", previous: "", known: false,
      note: "First time on a call with Spotify.",
      // What invitee research looks like once MOAB has looked a new guest up (made up, like everything here).
      research: {
        status: "done", note: "", found: "auto", foundAt: "2026-10-19T14:00:00+00:00", confidence: "medium",
        title: "Director, Procurement", team: "Procurement", seniority: "director", tenure: "about 7 years", relationship: "employee",
        sources: [{ url: "https://northwindfreight.example/about/leadership", label: "Northwind Freight leadership page" }],
        local: { company: "Northwind Freight", adopter: false, metBefore: false, lastMet: "" },
      },
    },
    "sam@quillstack.example": {
      photo: "https://images.pexels.com/photos/20374423/pexels-photo-20374423.jpeg?auto=compress&cs=tinysrgb&w=320&h=320&fit=crop", // stock photo (Pexels licence), see CREDITS.md
      title: "CTO and co-founder", startedAt: "2023-01", previous: "Helix Health",
      previousRole: "Engineering Manager", known: true,
      note: "Talked to Spotify in January 2026 (see history).",
    },
    "dana.li@quillstack.example": {
      photo: "https://images.pexels.com/photos/20051635/pexels-photo-20051635.jpeg?auto=compress&cs=tinysrgb&w=320&h=320&fit=crop", // stock photo (Pexels licence), see CREDITS.md
      title: "Head of Developer Productivity", startedAt: "2026-10", previous: "Lumen Air",
      previousRole: "Platform Lead", known: true,
      note: "Was your strongest supporter there.",
    },
    "michael.tran@rookery.example": {
      photo: "https://images.pexels.com/photos/31268612/pexels-photo-31268612.jpeg?auto=compress&cs=tinysrgb&w=320&h=320&fit=crop", // stock photo (Pexels licence), see CREDITS.md
      title: "Head of Growth Engineering", startedAt: "2026-07", previous: "Helix Health",
      previousRole: "Senior Engineer, Experimentation", known: false,
      note: "",
    },
    "ava.brooks@rookery.example": {
      photo: "https://images.pexels.com/photos/30468665/pexels-photo-30468665.jpeg?auto=compress&cs=tinysrgb&w=320&h=320&fit=crop", // stock photo (Pexels licence), see CREDITS.md
      title: "Product Director, Checkout", startedAt: "2021-04", previous: "", known: false,
      note: "",
    },
  },

  // "Mentioned on the call" in the demo: a made-up transcript of the Northwind call and what MOAB would find in it.
  // Grace Ito stands in for someone already in Spotify's records; Tom Hughes for someone found on the web (example.com-style sources);
  // John (a first name and a team, "from product managing") for someone found automatically from one clear match.
  // Companies: Brightwave Systems (the call explains the relation right after) and Harborline Labs (no explanation, so found on the web).
  mentionSample: {
    callId: "northwind",
    file: "northwind-call.vtt",
    transcript:
      "WEBVTT\n\n00:12:41.000 --> 00:12:47.000\n<v Priya Raman>Anything over fifty thousand goes to Grace Ito in finance, so she should see the quote.</v>\n\n"
      + "00:18:05.000 --> 00:18:11.000\n<v Marcus Bell>Tom Hughes from our security team will join the next call for the security review.</v>\n\n"
      + "00:21:30.000 --> 00:21:36.000\n<v Priya Raman>I'll have to talk with John about that from product managing. He owns the roadmap.</v>\n\n"
      + "00:24:02.000 --> 00:24:09.000\n<v Marcus Bell>Most of our alerts still go through Brightwave Systems. They're our vendor for logging.</v>\n\n"
      + "00:27:15.000 --> 00:27:19.000\n<v Priya Raman>Harborline Labs keeps asking about the pilot too.</v>\n",
    items: [
      {
        id: "sample000001", name: "Grace Ito", role: "finance", kind: "known", count: 1, source: "upload", status: "known", note: "",
        quote: { text: "Anything over fifty thousand goes to Grace Ito in finance, so she should see the quote.", speaker: "Priya Raman", time: "12:41" },
        person: { name: "Grace Ito", title: "Head of Finance", team: "Finance", relationship: "employee", confidence: "", why: "", from: "Sample data", sources: [],
          met: { known: true, last: "Feb 11, 2025" } },
        candidates: [], confirmed: false, added: false, hubspot: "", connected: true,
        explain: { kind: "person", name: "Grace Ito", title: "Head of Finance", type: "employee", typeLabel: "Employee", label: "finance", team: "Finance",
          explanation: [], since: null, evidence: [], said: null, mention: null, confidence: "", likely: false,
          found: { call: "Northwind Freight", title: "Discovery call: Northwind Freight and Spotify Portal", via: "your transcript", time: "12:41", at: "2026-10-21T15:30:00+00:00", how: "Known to MOAB" } },
      },
      {
        id: "sample000002", name: "Tom Hughes", role: "security", kind: "full", count: 1, source: "upload", status: "found", note: "",
        quote: { text: "Tom Hughes from our security team will join the next call for the security review.", speaker: "Marcus Bell", time: "18:05" },
        person: { name: "Tom Hughes", title: "Security Engineering Manager", team: "Security", seniority: "manager", relationship: "employee", confidence: "medium",
          why: "Named as Northwind Freight's security engineering manager on its engineering blog.", from: "Web",
          sources: [{ url: "https://northwindfreight.example/blog/zero-trust-rollout", label: "Northwind Freight engineering blog" },
            { url: "https://conf.example.com/2026/speakers/tom-hughes", label: "Example Conf speaker page" }],
          met: { known: true, last: "" } },
        candidates: [], confirmed: false, added: false, hubspot: "", autoFound: true, connected: true,
        explain: { kind: "person", name: "Tom Hughes", title: "Security Engineering Manager", type: "employee", typeLabel: "Employee", label: "security", team: "Security",
          explanation: [{ text: "Tom Hughes manages Northwind Freight's security engineering team, which ran its zero-trust rollout.", sources: [0] },
            { text: "He spoke about that rollout at Example Conf in 2026.", sources: [1] }],
          since: null, said: null, mention: null, confidence: "medium", likely: false,
          evidence: [{ url: "https://northwindfreight.example/blog/zero-trust-rollout", label: "Northwind Freight engineering blog", date: "2026-03-12",
              quote: "Tom Hughes, who manages our security engineering team, led the zero-trust rollout across every warehouse." },
            { url: "https://conf.example.com/2026/speakers/tom-hughes", label: "Example Conf speaker page", date: "2026-05",
              quote: "Tom Hughes, Security Engineering Manager at Northwind Freight, on rolling out zero trust." }],
          found: { call: "Northwind Freight", title: "Discovery call: Northwind Freight and Spotify Portal", via: "your transcript", time: "18:05", at: "2026-10-21T15:30:00+00:00", how: "Found on the web" } },
      },
      {
        id: "sample000003", name: "John", role: "product management", kind: "partial", count: 1, source: "upload", status: "found", note: "",
        quote: { text: "I'll have to talk with John about that from product managing.", speaker: "Priya Raman", time: "21:30" },
        said: { label: "owns the roadmap", team: "", relationship: "", said: "He owns the roadmap.", speaker: "Priya Raman", time: "21:30" },
        person: { name: "John Reyes", title: "Group Product Manager", team: "Product Management", seniority: "manager", relationship: "employee", confidence: "high",
          why: "The only John on Northwind Freight's product team in public sources.", from: "Web",
          sources: [{ url: "https://northwindfreight.example/blog/roadmap-2026", label: "Northwind Freight product blog" },
            { url: "https://conf.example.com/2026/speakers/john-reyes", label: "Example Conf speaker page" }],
          met: { known: true, last: "" } },
        candidates: [], confirmed: false, added: false, hubspot: "", autoFound: true, connected: true,
        explain: { kind: "person", name: "John Reyes", title: "Group Product Manager", type: "employee", typeLabel: "Employee", label: "owns the roadmap", team: "Product Management",
          explanation: [{ text: "John Reyes is a group product manager at Northwind Freight and writes its yearly product roadmap.", sources: [0] }],
          since: null, mention: null, confidence: "high", likely: false,
          said: { text: "He owns the roadmap.", speaker: "Priya Raman", time: "21:30" },
          evidence: [{ url: "https://northwindfreight.example/blog/roadmap-2026", label: "Northwind Freight product blog", date: "2026-01-08",
              quote: "John Reyes, Group Product Manager, walks through what our product teams are building in 2026." },
            { url: "https://conf.example.com/2026/speakers/john-reyes", label: "Example Conf speaker page", date: "", quote: "" }],
          found: { call: "Northwind Freight", title: "Discovery call: Northwind Freight and Spotify Portal", via: "your transcript", time: "21:30", at: "2026-10-21T15:30:00+00:00", how: "Found on the web" } },
      },
    ],
    orgs: [
      {
        id: "sample000004", kind: "company", name: "Brightwave Systems", domain: "", count: 1, source: "upload", status: "said", note: "", removed: false, connected: true,
        quote: { text: "Most of our alerts still go through Brightwave Systems.", speaker: "Marcus Bell", time: "24:02" },
        relation: { type: "vendor", label: "their vendor (logging)", detail: "logging", said: "They're our vendor for logging.", source: "said", sources: [],
          confidence: "", speaker: "Marcus Bell", time: "24:02" },
        explain: { kind: "company", name: "Brightwave Systems", type: "vendor", typeLabel: "Vendor or supplier", label: "their vendor (logging)", detail: "logging",
          explanation: [], since: null, evidence: [], mention: null, confidence: "",
          said: { text: "They're our vendor for logging.", speaker: "Marcus Bell", time: "24:02" },
          found: { call: "Northwind Freight", title: "Discovery call: Northwind Freight and Spotify Portal", via: "your transcript", time: "24:02", at: "2026-10-21T15:30:00+00:00", how: "Said on the call" } },
      },
      {
        id: "sample000005", kind: "company", name: "Harborline Labs", domain: "", count: 1, source: "upload", status: "found", note: "", removed: false, connected: true,
        quote: { text: "Harborline Labs keeps asking about the pilot too.", speaker: "Priya Raman", time: "27:15" },
        relation: { type: "partner", label: "partner", detail: "", said: "", source: "web", confidence: "medium", speaker: "", time: "",
          sources: [{ url: "https://harborline.example/partners", label: "Harborline Labs partners page" },
            { url: "https://news.example.com/2026/harborline-northwind", label: "Example News" }] },
        explain: { kind: "company", name: "Harborline Labs", type: "partner", typeLabel: "Partner", label: "partner", detail: "",
          explanation: [{ text: "Harborline Labs is a technology partner of Northwind Freight: its route-planning tools run on Northwind's shipment data.", sources: [0] },
            { text: "The two companies announced the partnership for Northwind's freight-tracking product in 2024.", sources: [1] }],
          since: { text: "2024", sources: [1] }, said: null, mention: null, confidence: "medium",
          evidence: [{ url: "https://harborline.example/partners", label: "Harborline Labs partners page", date: "2026-08",
              quote: "Northwind Freight: our route-planning tools run on Northwind's live shipment data." },
            { url: "https://news.example.com/2026/harborline-northwind", label: "Example News", date: "2024-06-18",
              quote: "Harborline Labs and Northwind Freight today announced a partnership around Northwind's freight-tracking product." }],
          found: { call: "Northwind Freight", title: "Discovery call: Northwind Freight and Spotify Portal", via: "your transcript", time: "27:15", at: "2026-10-21T15:30:00+00:00", how: "Found on the web" } },
      },
    ],
  },

  // The People map in the demo: what MOAB adds to the connections from the sample transcript above (all made up).
  mentioned: [
    { id: "m:sample000001", type: "person", label: "Grace Ito", sub: "Head of Finance", company: "Northwind Freight", callId: "northwind", mentioned: true },
    { id: "m:sample000002", type: "person", label: "Tom Hughes", sub: "Security Engineering Manager", company: "Northwind Freight", callId: "northwind", mentioned: true, auto: true },
    { id: "m:sample000003", type: "person", label: "John Reyes", sub: "Group Product Manager", company: "Northwind Freight", callId: "northwind", mentioned: true, auto: true },
    { id: "co:Brightwave Systems", type: "company", label: "Brightwave Systems", callId: "northwind", mentioned: true, relation: "vendor" },
    { id: "co:Harborline Labs", type: "company", label: "Harborline Labs", callId: "northwind", mentioned: true, relation: "partner" },
  ],

  // Spotify's own history with companies (stands in for HubSpot).
  companies: {
    "Northwind Freight": {
      engineers: 420, status: "Open deal: Portal",
      history: [{ date: "2025-02", text: "Talked about the plugin bundle. Did not sign: no budget." }],
    },
    "Quillstack": {
      engineers: 80, status: "New lead",
      history: [{ date: "2026-01", text: "Told them it was not a good fit yet: only 20 engineers." }],
      comeBack: { then: 20, now: 80, openJobs: 31 },
    },
    "Rookery Retail": { engineers: 40, status: "New lead", history: [] },
    "Helix Health": { engineers: 900, status: "Customer since 2025: Portal and Confidence", history: [], customer: true },
    "Lumen Air": { engineers: 300, status: "Open deal: Portal", history: [{ date: "2026-08", text: "Pilot going well with Dana Li as the main supporter." }] },
  },

  // Signed papers (stands in for Google Drive and DocuSign).
  papers: {
    "Northwind Freight": { nda: { signed: true, date: "2025-02-11", where: "DocuSign" }, securityPack: { sent: "v3", sentOn: "2025-02-20" } },
    "Quillstack": { nda: { signed: false }, securityPack: null },
    "Rookery Retail": { nda: { signed: true, date: "2026-08-01", where: "DocuSign" }, securityPack: { sent: "v5", sentOn: "2026-08-03" } },
  },
  currentSecurityPack: "v5",

  // Relationships only Spotify's records would know. The map adds the ones it can work out itself
  // (who works where, who came from where, and who worked together before).
  relationships: [
    { a: "you", b: "p:dana.li@quillstack.example", kind: "warm", label: "your supporter",
      why: "Dana Li was your strongest supporter in the Lumen Air deal. She now runs developer productivity at Quillstack." },
    { a: "you", b: "p:marcus.bell@northwindfreight.example", kind: "warm", label: "Portal Office Hours",
      why: "Marcus Bell came to Portal Office Hours in March 2026, so he already knows you and the product." },
    { a: "you", b: "p:sam@quillstack.example", kind: "moved", label: "talked Jan 2026",
      why: "You spoke with Sam Okafor in January 2026 and told Quillstack it was not a good fit yet." },
    { a: "you", b: "co:Lumen Air", kind: "moved", label: "open deal",
      why: "Lumen Air is an open Portal deal. Dana Li leaving may weaken your support there." },
    { a: "you", b: "co:Helix Health", kind: "warm", label: "customer",
      why: "Helix Health has been a Spotify customer since 2025 (Portal and Confidence)." },
    // Mentioned on the Northwind call (the sample transcript): labelled with what was said, or what the web showed.
    { a: "p:priya.raman@northwindfreight.example", b: "m:sample000001", kind: "mentioned", label: "finance", src: "call", callId: "northwind",
      connId: "sc1", mentionId: "sample000001", source: "Sample data", why: "Grace Ito, Head of Finance. Priya Raman mentioned them on the call at 12:41." },
    { a: "p:marcus.bell@northwindfreight.example", b: "m:sample000002", kind: "mentioned", label: "security", src: "call", callId: "northwind",
      connId: "sc2", mentionId: "sample000002", source: "Sample data", why: "Tom Hughes, Security Engineering Manager. Marcus Bell mentioned them on the call at 18:05." },
    { a: "p:priya.raman@northwindfreight.example", b: "m:sample000003", kind: "mentioned", label: "owns the roadmap", src: "call", callId: "northwind",
      connId: "sc3", mentionId: "sample000003", source: "Sample data", why: "John Reyes, Group Product Manager. Priya Raman mentioned them on the call at 21:30. “He owns the roadmap.”" },
    { a: "p:marcus.bell@northwindfreight.example", b: "co:Brightwave Systems", kind: "mentioned", label: "their vendor (logging)", src: "call", callId: "northwind",
      connId: "sc4", mentionId: "sample000004", source: "Sample data", why: "Marcus Bell mentioned them on the call at 24:02. “They're our vendor for logging.”" },
    { a: "p:priya.raman@northwindfreight.example", b: "co:Harborline Labs", kind: "mentioned", label: "partner", src: "call", callId: "northwind",
      connId: "sc5", mentionId: "sample000005", source: "Sample data", why: "Priya Raman mentioned them on the call at 27:15. Relation found on the web.",
      sources: [{ url: "https://harborline.example/partners", label: "Harborline Labs partners page" }] },
  ],

  // Alerts the agent raised in the background between calls. callId links an alert to an upcoming call.
  watch: [
    { date: "Oct 2", kind: "Job change", callId: "quillstack", title: "Dana Li moved to Quillstack",
      text: "Dana Li, your strongest supporter at Lumen Air, moved to Quillstack. You may have less support at Lumen Air, and you now have a warm contact at Quillstack." },
    { date: "Oct 9", kind: "Come back", callId: "quillstack", title: "Quillstack grew to 80 engineers",
      text: "You told Quillstack 'not yet' in January when they had 20 engineers. They now have about 80 engineers and 31 open engineering jobs." },
  ],
};
