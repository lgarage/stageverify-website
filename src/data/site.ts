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
  { title: "Order is only partially complete" },
  { title: "Dispatch thinks it is ready" },
  { title: "Technician shows up missing material" },
] as const;

export const sectionCopy = {
  problem: {
    eyebrow: "Don't send the tech until the material is ready",
  },
  howItWorks: {
    eyebrow: "The workflow",
    intro:
      "StageVerify keeps the shop trail clear from vendor drop-off to technician pickup.",
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
    title: "Give operations a clear material trail",
    intro:
      "See how StageVerify helps operations know what is ready, what is missing, and what was picked up.",
    reassurance: "No platform contract required to see how it works.",
  },
} as const;

export const howItWorksSteps = [
  {
    step: 1,
    title: "Dispatch assigns it",
    description: "Job, vendor, PO, and staging location are set before delivery.",
  },
  {
    step: 2,
    title: "Vendor drops it off",
    description: "The driver follows the assigned location and confirms delivery.",
  },
  {
    step: 3,
    title: "StageVerify checks readiness",
    description:
      "Dispatch sees what is ready, partial, backordered, missing, or needs review.",
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
    description:
      "Know which vendor dropped off material, for which job and PO.",
  },
  {
    title: "Staging location visibility",
    description: "See where material is staged before anyone goes looking.",
  },
  {
    title: "Readiness status",
    description:
      "See what is ready, partial, missing, backordered, or needs review before pickup is scheduled.",
  },
  {
    title: "Pickup verification",
    description: "Record when material leaves the shop with the technician.",
  },
  {
    title: "QR-based workflow",
    description:
      "Simple links and scans without extra accounts for vendors or techs.",
  },
  {
    title: "Delivery history",
    description:
      "Pull up the record when a delivery or pickup gets questioned.",
  },
  {
    title: "Multi-shop ready",
    description: "Start with one shop and grow into multiple branches.",
  },
  {
    title: "Simple field workflow",
    description:
      "Vendors, dispatch, shop staff, and technicians each see only what they need to keep materials moving.",
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
    description:
      "More control across locations — without a warehouse overhaul.",
  },
] as const;

export const problemCallout = {
  lead: "Most systems track the job or PO. ",
  emphasis: "StageVerify tracks whether the material is actually ready for pickup.",
} as const;
