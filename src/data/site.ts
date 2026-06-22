export const site = {
  name: "StageVerify",
  title: "StageVerify — Material Staging & Pickup Verification",
  description:
    "StageVerify tracks vendor deliveries from drop-off to shop staging to field pickup, so trade contractors know what arrived, where it is, whether it is complete, and when it was picked up.",
  positioning:
    "StageVerify controls the material handoff between vendor delivery, shop staging, and field pickup.",
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
  { title: "Dispatch thinks it is ready" },
  { title: "Technician cannot find it" },
  { title: "Job gets delayed" },
] as const;

export const sectionCopy = {
  problem: {
    eyebrow: "The gap",
  },
  howItWorks: {
    eyebrow: "The workflow",
    intro:
      "From vendor drop-off to technician pickup, StageVerify keeps the shop trail clear.",
  },
  features: {
    eyebrow: "Capabilities",
  },
  whoItsFor: {
    eyebrow: "Trade contractors",
    intro:
      "For contractors who stage job materials in a shop before sending crews to the field.",
  },
  scale: {
    eyebrow: "Grow with you",
    intro:
      "Start with one staging area. Add more zones, branches, and material workflows as the operation grows.",
  },
  demo: {
    eyebrow: "Request a demo",
    intro:
      "Show operations what arrived, where it is, what is ready, and what was picked up.",
    reassurance: "No platform contract required to see how it works.",
  },
} as const;

export const howItWorksSteps = [
  {
    step: 1,
    title: "Vendor drops off material",
    description:
      "The driver follows the assigned staging location and confirms the delivery.",
  },
  {
    step: 2,
    title: "StageVerify records the drop-off",
    description:
      "The delivery, vendor, PO, time, and location are saved in one record.",
  },
  {
    step: 3,
    title: "Readiness is checked",
    description:
      "StageVerify helps dispatch see what is complete, what is missing, and what needs review.",
  },
  {
    step: 4,
    title: "Pickup gets scheduled",
    description:
      "When the material is ready, dispatch sends the technician the pickup details.",
  },
  {
    step: 5,
    title: "Technician confirms pickup",
    description:
      "The technician opens the checklist, picks up the material, and StageVerify records what left the shop.",
  },
] as const;

export const features = [
  {
    title: "Vendor delivery tracking",
    description: "Know which vendor dropped off material, for which job and PO.",
  },
  {
    title: "Staging location visibility",
    description: "See where material is staged before anyone goes looking.",
  },
  {
    title: "Readiness status",
    description: "Know what is ready, partial, missing, or needs review.",
  },
  {
    title: "Pickup verification",
    description: "Record when material leaves the shop with the technician.",
  },
  {
    title: "QR-based workflow",
    description: "Simple links and scans without extra accounts for vendors or techs.",
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
    title: "Built for real users",
    description: "Simple enough for vendors, dispatch, shop staff, and technicians.",
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
  emphasis: "StageVerify tracks the material handoff in the shop.",
} as const;
