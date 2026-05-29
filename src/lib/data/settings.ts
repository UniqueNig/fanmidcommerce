import "server-only";
import { connectDB } from "@/src/lib/db";
import settingsModel from "@/src/models/Settings";

/** Public, storefront-safe store settings (no secret keys). */
export async function getStoreSettings() {
  await connectDB();
  const s: any = await settingsModel.findOne();
  return {
    storeName: s?.storeName ?? "FanMid",
    whatsapp: s?.whatsapp ?? "",
    contactEmail: s?.contactEmail ?? "",
    currency: s?.currency ?? "NGN",
  };
}
