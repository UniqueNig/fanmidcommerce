import "server-only";
import { connectDB } from "@/src/lib/db";
import shippingMethodModel from "@/src/models/ShippingMethod";
import teamMemberModel from "@/src/models/TeamMember";
import testimonialModel from "@/src/models/Testimonial";

export type ShippingMethodDTO = {
  id: string;
  label: string;
  description: string;
  cost: number;
  active: boolean;
  sortOrder: number;
};
export type TeamMemberDTO = {
  id: string;
  name: string;
  role: string;
  image: string;
  sortOrder: number;
};
export type TestimonialDTO = {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  active: boolean;
  sortOrder: number;
};

// ── Default seed data — keeps the storefront looking complete out of the box,
//    and gives the admin editable records instead of hardcoded markup. ──────

const DEFAULT_SHIPPING = [
  { label: "Standard Delivery", description: "5–7 business days", cost: 3000, sortOrder: 0 },
  { label: "Express Delivery", description: "2–3 business days", cost: 7000, sortOrder: 1 },
  { label: "Store Pickup", description: "Free — collect at our Lagos store", cost: 0, sortOrder: 2 },
];

// Intentionally EMPTY: a fresh client database must NOT get fake team members
// or testimonials seeded onto its live homepage/About page. The admin adds real
// ones; the homepage Testimonials and About Team sections hide when empty.
const DEFAULT_TEAM: { name: string; role: string; image: string; sortOrder: number }[] = [];

const DEFAULT_TESTIMONIALS: { name: string; location: string; text: string; rating: number; sortOrder: number }[] = [];

// ── Public reads (active only), seeding defaults on first run ──────────────

export async function getShippingMethods(): Promise<ShippingMethodDTO[]> {
  await connectDB();
  if ((await shippingMethodModel.estimatedDocumentCount()) === 0) {
    await shippingMethodModel.insertMany(DEFAULT_SHIPPING);
  }
  const docs = await shippingMethodModel.find({ active: true }).sort({ sortOrder: 1, cost: 1 }).lean();
  return docs.map(mapShipping);
}

export async function getTeamMembers(): Promise<TeamMemberDTO[]> {
  await connectDB();
  if (DEFAULT_TEAM.length && (await teamMemberModel.estimatedDocumentCount()) === 0) {
    await teamMemberModel.insertMany(DEFAULT_TEAM);
  }
  const docs = await teamMemberModel.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
  return docs.map(mapTeam);
}

export async function getTestimonials(): Promise<TestimonialDTO[]> {
  await connectDB();
  if (DEFAULT_TESTIMONIALS.length && (await testimonialModel.estimatedDocumentCount()) === 0) {
    await testimonialModel.insertMany(DEFAULT_TESTIMONIALS);
  }
  const docs = await testimonialModel.find({ active: true }).sort({ sortOrder: 1, createdAt: 1 }).lean();
  return docs.map(mapTestimonial);
}

// ── Mappers (shared with the GraphQL resolver) ─────────────────────────────

export const mapShipping = (d: any): ShippingMethodDTO => ({
  id: d._id.toString(),
  label: d.label,
  description: d.description ?? "",
  cost: d.cost,
  active: d.active ?? true,
  sortOrder: d.sortOrder ?? 0,
});
export const mapTeam = (d: any): TeamMemberDTO => ({
  id: d._id.toString(),
  name: d.name,
  role: d.role ?? "",
  image: d.image ?? "",
  sortOrder: d.sortOrder ?? 0,
});
export const mapTestimonial = (d: any): TestimonialDTO => ({
  id: d._id.toString(),
  name: d.name,
  location: d.location ?? "",
  text: d.text,
  rating: d.rating ?? 5,
  active: d.active ?? true,
  sortOrder: d.sortOrder ?? 0,
});
