export const site = {
  name: "StageVerify",
  title: "StageVerify — Material Staging & Pickup Verification",
  description:
    "StageVerify helps trade contractors know what arrived, what is ready, what is missing, and what was picked up.",
  positioning: "Stop sending technicians to pickups that are not actually ready.",
  headline: "Stop Losing Job Materials Between Delivery and Pickup",
  footerDescription:
    "Material staging and pickup verification for trade contractors.",
} as const;

export const navLinks = [
  { label: "Problem", href: "#problem" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Who It's For", href: "#who-its-for" },
  { label: "Demo", href: "#demo" },
] as const;

export const problemCards = [
  { title: "Vendor says it was dropped off" },
  { title: "Order is only partially complete" },
  { title: "Dispatch thinks it is ready" },
  { title: "Technician shows up missing material" },
] as const;

export const sectionCopy = {
  problem: {
    eyebrow: "The problem",
    title: "The handoff is where materials get lost.",
    intro: "Know what is actually ready before you send the tech.",
  },
  howItWorks: {
    eyebrow: "The workflow",
    title: "One clear trail from delivery to pickup.",
    intro:
      "StageVerify keeps the shop trail clear from vendor drop-off to technician pickup.",
  },
  features: {
    eyebrow: "Capabilities",
    title: "Shop staging control without a full warehouse system.",
  },
  whoItsFor: {
    eyebrow: "Who it's for",
    title: "Built for trade contractors.",
    intro:
      "For contractors who stage job materials in a shop before sending crews to the field.",
  },
  scale: {
    eyebrow: "Grow with you",
    title: "Start with one shop. Expand to every branch.",
    intro:
      "Start with one staging area. Add more zones, branches, and material workflows as the operation grows.",
    note: "Grounded in contractor shops — not massive automated warehouses.",
  },
  demo: {
    eyebrow: "Request a demo",
    title: "Give operations a clear material trail",
    intro:
      "See what arrived, what is ready, what is missing, and what was picked up.",
    reassurance: "No platform contract required to see how it works.",
  },
} as const;

export const howItWorksSteps = [
  {
    step: 1,
    title: "Dispatch assigns it",
    description: "Job, vendor, PO, and location set before delivery.",
  },
  {
    step: 2,
    title: "Vendor drops it off",
    description: "The driver confirms delivery at the assigned location.",
  },
  {
    step: 3,
    title: "StageVerify checks readiness",
    description: "See what is ready, partial, missing, backordered, or needs review.",
  },
  {
    step: 4,
    title: "Pickup info is sent",
    description: "The technician gets the pickup link and locations.",
  },
  {
    step: 5,
    title: "Pickup is confirmed",
    description: "StageVerify records what left the shop and what remains.",
  },
] as const;

export const features = [
  {
    title: "Vendor delivery tracking",
    description: "Know which vendor dropped off, for which job and PO.",
  },
  {
    title: "Staging location visibility",
    description: "See where material is staged before anyone goes looking.",
  },
  {
    title: "Readiness status",
    description:
      "See what is ready, partial, missing, or needs review before pickup.",
  },
  {
    title: "Pickup verification",
    description: "Record when material leaves the shop with the technician.",
  },
  {
    title: "QR-based workflow",
    description: "Simple links and scans — no extra accounts for vendors or techs.",
  },
  {
    title: "Delivery history",
    description: "Pull up the record when a delivery or pickup gets questioned.",
  },
  {
    title: "Multi-shop ready",
    description: "Start with one shop and grow into multiple branches.",
  },
  {
    title: "Simple field workflow",
    description: "Each role sees only what they need to keep materials moving.",
  },
] as const;

export const industries = [
  "Mechanical",
  "Electrical",
  "Plumbing",
  "HVAC",
  "Fire Protection",
  "Controls",
  "Facility Service",
  "Self-Perform Contractors",
] as const;

export const scaleStages = [
  {
    title: "One staging area",
    description: "One location to start. Same workflow every delivery.",
  },
  {
    title: "Multiple zones",
    description: "Add bays, racks, ground stacks, and will-call areas.",
  },
  {
    title: "Multiple branches",
    description: "Run the same process at every shop.",
  },
  {
    title: "Larger material operation",
    description: "More control across locations — without a warehouse overhaul.",
  },
] as const;

export const problemCallout = {
  lead: "Most systems track the job or PO. ",
  emphasis: "StageVerify tracks whether the material is actually ready for pickup.",
} as const;
