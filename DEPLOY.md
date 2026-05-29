# FanMidCommerce — Deploy Checklist

A repeatable checklist for deploying this store (and future client copies) to Vercel.

## 1. Environment variables (set ALL of these in Vercel → Project → Settings → Environment Variables)

| Variable | Example / Notes |
|---|---|
| `MONGO_DB_URI` | Your MongoDB Atlas connection string (use a **separate DB per client**). |
| `JWT_SECRET` | A long random string. **Change it from the dev value** before going live. |
| `NEXT_PUBLIC_SITE_URL` | Your real URL, e.g. `https://yourshop.com`. Used by SEO, sitemap, canonical, OG, emails. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name (for image uploads). |
| `PAYSTACK_SECRET_KEY` | **LIVE** secret key (`sk_live_...`) — see §2. |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | **LIVE** public key (`pk_live_...`). |
| `RESEND_API_KEY` | Your Resend API key. |
| `RESEND_FROM` | `Your Shop <noreply@yourdomain.com>` — needs a verified domain (see §3). |
| `EMAIL_OVERRIDE` | **Leave UNSET in production** so mail reaches real customers. Only set in sandbox/testing. |
| `CONTACT_EMAIL` | (Optional) where /contact messages go, e.g. `support@yourdomain.com`. |

> Tip: set the same vars locally in `.env.local` for testing. `NEXT_PUBLIC_*` vars are exposed to the browser — never put secrets in them.

## 2. Paystack (go live)
- Switch from **test** keys (`sk_test_/pk_test_`) to **live** keys (`sk_live_/pk_live_`) in Vercel env vars.
- Complete Paystack business verification (required for live mode).
- ✅ **Add the Paystack webhook** (built): in the Paystack dashboard → Settings → API Keys & Webhooks, set the webhook URL to `https://yourshop.com/api/paystack/webhook`. This finalizes orders server-side even if the customer closes the tab after paying (signature-verified, idempotent).

## 3. Email / Resend (real delivery)
1. Add your domain in the Resend dashboard and add the DNS records it gives you.
2. Once verified, set `RESEND_FROM` to an address on that domain.
3. Remove `EMAIL_OVERRIDE` so emails go to real recipients (not your inbox).

## 4. Cloudinary
- Ensure an **unsigned upload preset** named `fanmid_products` exists (Cloudinary → Settings → Upload → Upload presets). Admin product/team image uploads use it.

## 5. Database / seeding
- Shipping methods, team, and testimonials **auto-seed** on first page load (Standard ₦3,000 / Express ₦7,000 / Store Pickup free).
- Run the slug backfill once if importing existing products: `npm run backfill:slugs`.
- Create your real **categories** and **products** in the admin before launch.

## 6. Admin account
- There is no public admin signup. Create the first admin directly, e.g. via a one-off script or the `createAdmin` mutation (run while authenticated as an existing admin).
- For a brand-new DB, insert one admin user manually (hash the password with bcrypt) or temporarily seed one.
- Log in at `/admin/login`. Admin routes are protected by middleware + per-resolver role checks.

## 7. Final pre-launch smoke test
- [ ] Place a real test order end-to-end (add to cart → checkout → pay → order confirmed).
- [ ] Confirm stock decremented and the order shows in `/admin/orders`.
- [ ] Apply a coupon and confirm the discount reaches the charged amount.
- [ ] Submit the contact form and the newsletter form.
- [ ] Leave a product review as a verified buyer.
- [ ] Check `/sitemap.xml` and `/robots.txt` return your live domain.
- [ ] Verify `/admin` is blocked when logged out.

## Done since first draft
- ✅ Paystack **webhook** (`/api/paystack/webhook`) — guaranteed, race-safe order finalization.
- ✅ **Order confirmation email** to the customer.
- ✅ **Forgot/reset password** flow (`/forgot-password`, `/reset-password`).
- ✅ **Spam protection** — honeypots + in-memory rate limit on contact & newsletter.
- ✅ **Related products** on the product page; **enriched order detail** in the dashboard.

## Remaining (optional, later)
- Analytics (Vercel/GA), back-in-stock notifications.
- Server-side search + pagination for large catalogs.
- Hard rate-limiting via a shared store (Upstash Redis) — current limiter is per-instance.
