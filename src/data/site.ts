export const site = {
  name: "StageVerify",
  title: "StageVerify | Material Staging & Delivery Tracking for Trade Contractors",
  /** Approved hero subheadline — do not change without explicit approval. */
  description: "Stop wasting labor looking for job materials.",
  supportingDescription:
    "StageVerify tracks vendor deliveries from shop arrival to field pickup. See what arrived, where it was staged, what is missing, and what is ready.",
  /** Meta / Open Graph / schema description — product-first, nationwide. */
  seoDescription:
    "StageVerify tracks vendor deliveries from shop arrival to field pickup. See what arrived, where it was staged, what is missing, and what is ready.",
  positioning:
    "Know what is ready before dispatch sends a technician to pick it up.",
  headline: "The material may not be lost. Your labor is.",
  footerDescription:
    "Material staging and pickup verification for trade contractors.",
  url: "https://www.stageverify.com",
  locale: "en_US",
  geo: {
    city: "Green Bay",
    region: "WI",
    regionName: "Wisconsin",
    country: "US",
    /** Business location only — not a primary product-market claim. */
    locationLine: "Based in Green Bay, Wisconsin. Serving trade contractors nationwide.",
    latitude: 44.5133,
    longitude: -88.0133,
  },
  keywords: [
    "material staging software",
    "trade contractor material tracking",
    "shop staging pickup verification",
    "vendor delivery tracking",
    "job material readiness",
    "delivery to pickup visibility",
  ],
} as const;

export const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Capabilities", href: "#features" },
  { label: "Who It's For", href: "#who-its-for" },
  { label: "Pricing", href: "#pricing" },
] as const;

export const sectionCopy = {
  howItWorks: {
    eyebrow: "The workflow",
    title: "One clear trail from delivery to pickup.",
    intro:
      "StageVerify keeps the material handoff clear from vendor delivery to technician pickup.",
  },
  features: {
    eyebrow: "Capabilities",
    title: "Four capabilities across delivery, staging, and pickup.",
  },
  whoItsFor: {
    eyebrow: "Who it's for",
    title:
      "Built for HVAC service shops that receive and stage job materials before field pickup — especially shops that stage by job.",
    intro: "It is not a full warehouse WMS.",
    secondary:
      "Also fits other trades with the same workflow: electrical, plumbing, mechanical, controls, and fire protection.",
    multiLocation:
      "Contractors with multiple shop or branch locations can use StageVerify at each location. Pricing and setup apply per physical location.",
  },
  laborCost: {
    eyebrow: "Hidden labor",
    title: "Receiving a delivery still costs money.",
    receivingCost:
      "Receiving isn't free: figuring out which job a delivery belongs to and staging it is paid office, shop, or manager time—even when someone is there to receive it.",
    productScope:
      "StageVerify helps your team see what arrived, where it is, what is missing, and what is ready for the repair or install—not just the time it takes to find one part.",
    calculatorLeadIn:
      "Add the time spent receiving deliveries and hunting parts below to see how much direct wage money may be going out the door.",
  },
  costCalculator: {
    eyebrow: "Paid time",
    title: "How Much Paid Time Goes Into Receiving Deliveries and Hunting for Parts?",
    intro:
      "Enter your shop's wages and receiving time to estimate how much that work may be costing your company.",
    disclaimer:
      "Estimates are based on the time and wage assumptions you enter and are provided for illustrative purposes only. Actual results will vary. StageVerify does not guarantee any specific labor savings, cost savings, productivity improvement, or financial result.",
    disclaimerExclusions:
      "This estimate does not include payroll burden, vehicle costs, return trips, overtime, lost billable capacity, customer delays, or the value of additional technician capacity.",
    ceilingNote:
      "Monthly comparison subtracts only the recurring subscription. The annual comparison subtracts first-year subscription plus one-time setup for one location with up to 15 staging spots.",
  },
  catchAll: {
    title: "UPS, FedEx, and USPS deliveries still need a clear path.",
    body:
      "Catch-All keeps unexpected carrier deliveries visible until shop staff identify the job and stage the material.",
  },
  qualification: {
    title: "StageVerify makes the most sense when…",
    customerFit:
      "Use your own wages and workflow to decide whether StageVerify makes sense for your shop. It fits best when paid time is disappearing into receiving deliveries, sorting material to jobs, checking readiness, or hunting parts.",
  },
  readinessExamples: {
    eyebrow: "Illustrative examples",
    title: "What readiness looks like",
  },
  proveValue: {
    eyebrow: "See the work",
    title: "Example shop activity you could track in StageVerify.",
    intro:
      "Track deliveries, pickups, backorders, missing items, and estimated paid time so managers can compare shop activity with their own wages and the StageVerify subscription.",
  },
  pricing: {
    title: "Simple per-location pricing",
    monthlyPrice: "$79",
    monthlyPeriod: "/month per location",
    includedSpots: "Includes up to 15 staging spots.",
    additionalCapacity:
      "$20/month per additional block of 5 staging spots.",
    setupLabel: "One-time setup",
    setupPrice:
      "$150 per location for up to 15 staging spots — includes on-site shop mapping & labeling in Northeast Wisconsin, or a guided remote setup kit nationwide.",
    setupAboveFifteen:
      "Additional setup fees may apply for locations with more than 15 staging spots.",
    perLocationNote:
      "Each physical shop or branch requires its own StageVerify subscription, one-time setup (on-site shop mapping and labeling in Northeast Wisconsin, or a guided remote setup kit nationwide), and included staging capacity.",
    setupCalculatorLabel:
      "One-time setup (NE WI on-site or nationwide remote kit)",
    setupSummary:
      "Physical staging areas are mapped, marked, and labeled during setup so each StageVerify location has a clearly defined place for material.",
  },
  demo: {
    eyebrow: "Request a demo",
    title: "Request a demo",
    intro: "Tell us how to reach you. We’ll follow up to schedule.",
    foundingPilot:
      "Founding Shop Pilot (Northeast Wisconsin): Now onboarding 5 local trade shops — get free setup and 60 days free in exchange for honest workflow feedback.",
    submit: "Send request",
    success: "Thanks — we’ll follow up to schedule your demo.",
    error:
      "Something went wrong sending that. Email info@stageverify.com and we’ll get you scheduled.",
    privacy:
      "We use what you submit only to schedule your demo. Submissions are delivered through Formspree.",
    unconfigured:
      "Online demo requests are not configured on this build yet. Email info@stageverify.com to schedule.",
  },
  faq: {
    eyebrow: "Common questions",
    title: "Straight answers for the shop.",
    intro:
      "For shops that need a clear material trail—not another complex system.",
  },
} as const;

export const howItWorksSteps = [
  {
    step: 1,
    title: "Material arrives",
    description:
      "Vendor deliveries are tied to the job. Shop staff stage identified material to the right spots.",
  },
  {
    step: 2,
    title: "The office stays informed",
    description:
      "Delivery status, missing items, and readiness stay visible without relying on phone calls or memory.",
  },
  {
    step: 3,
    title: "Technicians know where to go",
    description:
      "Technicians get clear pickup guidance for material assigned to their jobs.",
  },
  {
    step: 4,
    title: "Pickup closes the loop",
    description:
      "Pickup is recorded so material status stays current and the shop stays organized.",
  },
] as const;

export const workflowRoles = [
  {
    role: "Vendor",
    steps: ["Check in the delivery. No app."],
  },
  {
    role: "Technician",
    steps: ["Get pickup guidance for the job. No app."],
  },
  {
    role: "Office",
    steps: ["See what arrived, what’s missing, what’s ready."],
  },
] as const;

export const laborExclusions = [
  "payroll burden",
  "vehicle costs",
  "return trips",
  "overtime",
  "lost billable capacity",
  "customer delays",
  "value of additional technician capacity",
] as const;

export const qualificationSignals = [
  "vendors regularly deliver job materials to your shop",
  "your shop stages material by job before field pickup",
  "technicians spend time hunting parts or asking where material was staged",
  "jobs involve multiple deliveries, vendors, missing items, or backorders",
  "expensive office, shop, manager, or technician time is spent receiving, locating, checking, or sorting material to jobs",
] as const;

export const managementPreview = {
  labels: {
    illustrative: "Illustrative example",
    snapshot: "Example monthly shop activity snapshot",
  },
  summaryMetrics: [
    { value: "48", label: "Deliveries processed" },
    { value: "37", label: "Pickups completed" },
    { value: "6", label: "Backorders identified" },
    {
      value: "9.4 hrs",
      label: "Estimated receiving and parts-hunt time",
      supportingText: "Based on example labor assumptions",
    },
  ],
  lineChart: {
    title: "Receiving and parts-hunt time",
    data: [
      { month: "Jan", value: 16.2 },
      { month: "Feb", value: 14.8 },
      { month: "Mar", value: 13.1 },
      { month: "Apr", value: 11.7 },
      { month: "May", value: 10.3 },
      { month: "Jun", value: 9.4 },
    ],
  },
  barChart: {
    title: "Material issues identified",
    data: [
      { category: "Backorders", value: 6 },
      { category: "Incomplete deliveries", value: 3 },
      { category: "Other material issues", value: 4 },
    ],
  },
  previewNote: "Illustrative example only — not customer data.",
} as const;

export const pricingIncludes = [
  "No long-term commitment",
  "Cancel anytime",
] as const;

export const readinessExampleCards = [
  {
    trade: "HVAC",
    job: "Compressor repair",
    materials: [
      { label: "Compressor", status: "received" as const },
      { label: "Contactor", status: "received" as const },
      { label: "Filter-drier", status: "backordered" as const },
    ],
    pickupStatus: "NOT READY FOR PICKUP",
    supporting:
      "Dispatch can see that the repair is still missing material before sending the technician to the shop.",
  },
  {
    trade: "Electrical",
    job: "Breaker panel replacement",
    materials: [
      { label: "Replacement breaker panel", status: "received" as const },
      { label: "(2) 25-amp breakers", status: "received" as const },
      { label: "(1) 50-amp breaker", status: "backordered" as const },
    ],
    pickupStatus: "NOT READY FOR PICKUP",
    supporting:
      "The panel and two 25-amp breakers are on site, but the job is still missing the 50-amp breaker. Dispatch can see that the pickup is incomplete before sending the electrician.",
  },
  {
    trade: "Plumbing",
    job: "Commercial pump replacement",
    materials: [
      { label: "Replacement pump", status: "received" as const },
      { label: "Flange kit", status: "received" as const },
      { label: "Isolation valve", status: "backordered" as const },
    ],
    pickupStatus: "NOT READY FOR PICKUP",
    supporting:
      "The job material stays marked incomplete until the required parts are there and ready for the technician.",
  },
] as const;

export const primaryCapabilities = [
  {
    title: "Delivery and staging visibility",
    description:
      "See what arrived, which job it belongs to, and where it was staged.",
  },
  {
    title: "Job readiness, missing items, and backorders",
    description:
      "Know what is ready for pickup and what still needs attention before the repair or install.",
  },
  {
    title: "Guided technician pickup",
    description:
      "Send technicians to the right staged material without a hunt through the shop.",
  },
  {
    title: "Catch-All for unexpected carriers",
    description:
      "Keep UPS, FedEx, USPS, and other unexpected carrier deliveries visible until they are identified and staged.",
  },
] as const;

export const secondaryCapabilities = [
  "Multiple vendors and deliveries tied to the same job",
  "Vendor updates kept with the material trail",
  "Pickup verification that closes the handoff",
] as const;

export const faqItems = [
  {
    question: "What is StageVerify?",
    answer:
      "StageVerify tracks vendor deliveries from shop arrival through staging and technician pickup.",
  },
  {
    question: "Does it replace my current field-service software?",
    answer:
      "No. It works alongside your current field-service software and focuses on material staging and pickup.",
  },
  {
    question: "Do vendors or technicians need accounts or apps?",
    answer: "No. Vendors and technicians do not need to install an app.",
  },
  {
    question: "What happens with UPS/FedEx/USPS deliveries?",
    answer:
      "UPS, FedEx, USPS, and other unexpected deliveries can be seen and handled through the Catch-All workflow.",
  },
  {
    question: "Who is StageVerify best for?",
    answer:
      "Trade contractors that receive and stage job materials before technicians pick them up.",
  },
  {
    question: "What does setup include on-site vs. nationwide?",
    answer:
      "For Northeast Wisconsin shops, the one-time $150 setup (up to 15 staging spots) includes an on-site visit to map your shop in StageVerify and mark and label physical staging areas. Nationwide, the same fee covers a guided remote setup kit — templates, labeling guidance, and a live walk-through so your team can complete mapping and labeling. Additional setup fees may apply when more than 15 staging spots are needed.",
  },
  {
    question: "Is there a long-term contract?",
    answer:
      "No long-term commitment is required. Subscriptions are month to month and you can cancel anytime. One-time setup is a separate fee per location — on-site shop mapping and labeling in Northeast Wisconsin, or a guided remote setup kit nationwide.",
  },
] as const;
