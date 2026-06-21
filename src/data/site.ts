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
  "Vendor says it was delivered",
  "Dispatcher thinks it is staged",
  "Technician cannot find it",
  "Job gets delayed or reordered",
] as const;

export const howItWorksSteps = [
  {
    step: 1,
    title: "Vendor delivery arrives",
    description: "Materials arrive at the shop from the vendor drop-off.",
  },
  {
    step: 2,
    title: "Items are checked in",
    description: "Shop staff verify what was delivered against the order.",
  },
  {
    step: 3,
    title: "Materials are assigned to a staging location",
    description: "Every delivery gets a visible place in the shop.",
  },
  {
    step: 4,
    title: "Delivery is marked partial or complete",
    description: "Dispatch knows whether the full order is ready for pickup.",
  },
  {
    step: 5,
    title: "Technician pickup is verified",
    description: "Field crews confirm pickup with a scan-based trail.",
  },
] as const;

export const features = [
  "Vendor delivery tracking",
  "Staging location visibility",
  "Partial and complete delivery status",
  "Pickup verification",
  "QR-based scan flow",
  "Delivery history / audit trail",
  "Multi-shop ready",
  "Simple enough for vendors, dispatchers, shop staff, and technicians",
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
  "One staging area",
  "Multiple zones",
  "Multiple branches",
  "Larger material operation",
] as const;
