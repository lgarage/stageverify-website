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
    detail: "No shop record ties the drop-off to a job, PO, and staging location.",
  },
  {
    title: "Dispatcher thinks it's staged",
    detail: "Physical drop-off and order completeness aren't tracked separately — so 'ready' is a guess.",
  },
  {
    title: "Technician can't find it",
    detail: "The pickup list doesn't show what to collect or where it sits in the shop.",
  },
  {
    title: "Job gets delayed or reordered",
    detail: "Material is somewhere on the floor — but dispatch can't see what's picked up vs. still outstanding.",
  },
] as const;

export const sectionCopy = {
  problem: {
    eyebrow: "The gap",
    intro:
      "Deliveries hit the shop every day. The breakdown happens in the handoff — between vendor drop-off, assigned staging locations, readiness, and field pickup.",
  },
  howItWorks: {
    eyebrow: "The workflow",
    intro:
      "Dispatch assigns the job and staging location before the vendor arrives. The vendor confirms physical drop-off. StageVerify applies a two-source readiness gate. The technician picks up from a simple link — no warehouse system required.",
  },
  features: {
    eyebrow: "Capabilities",
    intro:
      "Built for dispatch, vendors, and field crews — without individual vendor or technician accounts, and without replacing your existing job tools.",
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
      "Walk through dispatch setup, vendor QR check-in, the two-source Ready for Pickup gate, and technician pickup verification — before you commit a single shop to rollout.",
    reassurance: "No platform contract required to see how it works.",
  },
} as const;

export const demoPoints = [
  "Dispatch assigns job, vendor, PO, and staging location",
  "Vendor QR check-in and DELIVERED at the assigned spot",
  "Two-source Ready for Pickup (order evidence + physical delivery)",
  "Technician pickup link — checklist by location, no login",
] as const;

export const howItWorksSteps = [
  {
    step: 1,
    title: "Dispatch sets up the job and location",
    description:
      "Authorized dispatch creates the job, vendor, PO, and assigned staging location before the truck arrives.",
  },
  {
    step: 2,
    title: "Vendor arrives and checks in",
    description:
      "The entry display shows where to go. At that spot, the vendor scans the delivery QR and enters the company's shared PIN — no driver account.",
  },
  {
    step: 3,
    title: "Vendor confirms physical drop-off",
    description:
      "The vendor presses DELIVERED, reports an issue, or requests more space. They don't count items or decide when material is ready for pickup.",
  },
  {
    step: 4,
    title: "StageVerify determines readiness",
    description:
      "Ready for Pickup requires vendor order evidence and confirmed physical delivery. Neither condition alone is enough.",
  },
  {
    step: 5,
    title: "Technician pickup is verified",
    description:
      "The tech opens a pickup link with no login, checks off material by location, and submits. Dispatch sees what was picked up and what remains.",
  },
] as const;

export const features = [
  {
    title: "Vendor delivery tracking",
    description:
      "Track each vendor, PO, and delivery separately — from dispatch setup through physical drop-off at the assigned location.",
  },
  {
    title: "Staging location visibility",
    description:
      "Dispatch assigns locations before arrival. See where material sits — including additional space when a delivery spans more than one spot.",
  },
  {
    title: "Readiness by delivery, PO, and job",
    description:
      "One completed delivery does not make the whole job ready. Partial shipments, backorders, and open issues stay visible until resolved.",
  },
  {
    title: "Pickup verification",
    description:
      "Technicians confirm what they physically collect by location. Partial pickups stay in progress until dispatch sees what's still outstanding.",
  },
  {
    title: "Delivery QR and vendor PIN flow",
    description:
      "Vendors scan a delivery-specific QR and enter a shared company PIN at the staging location. No barcode gun or personal login required.",
  },
  {
    title: "Delivery history / audit trail",
    description:
      "Pull the record when a job gets questioned days or weeks later — vendor actions, readiness changes, and pickup transactions included.",
  },
  {
    title: "Multi-shop ready",
    description:
      "Run one shop today. Add branches without rebuilding your process.",
  },
  {
    title: "Simple for vendors, dispatch, and technicians",
    description:
      "A few actions for vendors at drop-off. A clear readiness view for dispatch. One pickup link for field crews — no warehouse specialists required.",
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
    description: "Dispatch assigns locations and vendors check in at the assigned spot.",
  },
  {
    title: "Multiple zones",
    description: "Separate bays, racks, ground stacks, and will-call areas as volume grows.",
  },
  {
    title: "Multiple branches",
    description: "Same workflow at every shop — one view for operations.",
  },
  {
    title: "Larger material operation",
    description:
      "Tighter control across locations without a warehouse overhaul.",
  },
] as const;

export const problemCallout = {
  lead: "Most contractor software tracks the job. Some systems track the purchase order. ",
  emphasis:
    "StageVerify tracks the physical handoff, staging assignment, readiness, and pickup — separately.",
} as const;
