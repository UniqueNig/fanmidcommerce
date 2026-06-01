/**
 * Shared Cloudinary image upload (client-side, unsigned preset).
 *
 * Configurable per client:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME      — required
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET   — optional (defaults to "fanmid_products")
 *
 * Throws a clear Error on failure so the caller can show the real reason to the
 * admin (instead of failing silently). Cloudinary returns a JSON
 * `{ error: { message } }` on rejected uploads — we surface that message.
 */
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "fanmid_products";

export async function uploadImage(file: File): Promise<string> {
  if (!CLOUD_NAME) {
    throw new Error(
      "Image upload isn't configured: set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  let res: Response;
  try {
    res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData },
    );
  } catch {
    throw new Error("Upload failed: network error. Check your connection.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.secure_url) {
    const reason =
      data?.error?.message ||
      `Cloudinary rejected the upload (preset "${UPLOAD_PRESET}"). Check the preset exists and is unsigned.`;
    throw new Error(reason);
  }
  return data.secure_url as string;
}
