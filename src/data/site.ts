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
  {
    title: "Vendor says it was delivered",
    detail: "No shop record matches the drop-off.",
  },
  {
    title: "Dispatcher thinks it is staged",
    detail: "The job is marked ready — but nobody verified it.",
  },
  {
    title: "Technician cannot find it",
    detail: "Crews burn hours searching the shop floor.",
  },
  {
    title: "Job gets delayed or reordered",
    detail: "Materials get bought twice while the first order sits somewhere.",
  },
] as const;

export const sectionCopy = {
  problem: {
    eyebrow: "The gap",
    intro:
      "Deliveries hit the shop every day. The breakdown happens in the handoff — between vendor drop-off, shop staging, and field pickup.",
  },
  howItWorks: {
    eyebrow: "The workflow",
    intro:
      "One shared record from the moment materials arrive to the moment a technician picks them up. No warehouse complexity — just a clear shop trail.",
  },
  features: {
    eyebrow: "Capabilities",
    intro:
      "Everything ops needs to control the shop handoff — without buying a full warehouse system or retraining the whole company.",
  },
  whoItsFor: {
    eyebrow: "Trade contractors",
    intro:
      "Mechanical, electrical, plumbing, HVAC, fire protection, controls, and facility contractors all move job materials through a shop. The trade changes — the handoff problem does not.",
  },
  scale: {
    eyebrow: "Grow with you",
    intro:
      "Start with one staging area and a simple check-in workflow. Add zones, branches, and tighter material control as the operation grows — without replacing the system.",
  },
  demo: {
    eyebrow: "Request a demo",
    intro:
      "Give operations a clear view of what arrived, where it was staged, whether it is complete, and when it was picked up.",
    opsNote:
      "Walk through delivery check-in, staging locations, partial orders, and pickup verification in a live demo — before you commit a single shop to rollout.",
    reassurance: "No platform contract required to see how it works.",
  },
} as const;

export const howItWorksSteps = [
  {
    step: 1,
    title: "Vendor delivery arrives",
    description: "Materials hit the shop. Staff know a drop-off needs to be checked in.",
  },
  {
    step: 2,
    title: "Items are checked in",
    description: "What arrived gets verified against the PO — while it is still at the dock or desk.",
  },
  {
    step: 3,
    title: "Materials are assigned to a staging location",
    description: "Every delivery gets a visible spot in the shop — bay, rack, or floor stack.",
  },
  {
    step: 4,
    title: "Delivery is marked partial or complete",
    description: "Dispatch sees whether the full order is ready — not just that something showed up.",
  },
  {
    step: 5,
    title: "Technician pickup is verified",
    description: "Field crews confirm pickup with a scan. The handoff is closed, not guessed.",
  },
] as const;

export const features = [
  {
    title: "Vendor delivery tracking",
    description: "Log what the vendor dropped off, when it arrived, and who checked it in.",
  },
  {
    title: "Staging location visibility",
    description: "See where materials sit in the shop before crews go looking.",
  },
  {
    title: "Partial and complete delivery status",
    description: "Know when an order is only partly in — before the job assumes it is ready.",
  },
  {
    title: "Pickup verification",
    description: "Confirm technicians picked up the right materials — not just that someone said they did.",
  },
  {
    title: "QR-based scan flow",
    description: "Simple scans at check-in, staging, and pickup. No barcode gun required.",
  },
  {
    title: "Delivery history / audit trail",
    description: "Pull the record when a job gets questioned days or weeks later.",
  },
  {
    title: "Multi-shop ready",
    description: "Run one shop today. Add branches without rebuilding your process.",
  },
  {
    title: "Simple enough for vendors, dispatchers, shop staff, and technicians",
    description: "Built for the people who touch the materials — not warehouse specialists.",
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
    description: "Check in deliveries and assign a spot on the shop floor.",
  },
  {
    title: "Multiple zones",
    description: "Separate bays, racks, and will-call areas as volume picks up.",
  },
  {
    title: "Multiple branches",
    description: "Same workflow at every shop — one view for operations.",
  },
  {
    title: "Larger material operation",
    description: "Tighter control across locations without a warehouse overhaul.",
  },
] as const;
