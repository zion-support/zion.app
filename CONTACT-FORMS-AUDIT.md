# Contact Forms Audit – commercial@ziontechgroup.com

**Date:** 2025-03-07  
**Re-audit:** 2026-03-08, 2026-03-09  
**Site:** https://ziontechgroup.com

## Summary

All contact-related forms and mailto links on the site send or direct to **commercial@ziontechgroup.com**. The single source of truth for the commercial email is `app/utils/seoConstants.ts` → `CONTACT_INFO.email`.

## Forms and Destinations

| Location | Type | Destination | Notes |
|----------|------|-------------|--------|
| `/contact` | Contact form (ContactFormClient) | commercial@ziontechgroup.com | Uses `CONTACT_INFO.email`; submits via `mailto:` with subject/body |
| `/blog` | Stay Updated (newsletter) | commercial@ziontechgroup.com | `BlogNewsletterSignup`; submits via `mailto:` to `CONTACT_INFO.email` |
| NewsletterSignup component | Newsletter form | commercial@ziontechgroup.com | Uses `CONTACT_INFO.email`; submits via `mailto:` (2026-03-08) |
| Contact page contact methods | mailto/tel/address | commercial@ziontechgroup.com | From `CONTACT_INFO` |
| Careers apply links | mailto | commercial@ziontechgroup.com | `CONTACT_INFO.email` with role-specific subject |
| Press / media | mailto | commercial@ziontechgroup.com | `CONTACT_INFO.email` with "Media Inquiry" etc. |
| Partners | mailto | commercial@ziontechgroup.com | `CONTACT_INFO.email` with "Partner Program Inquiry" |
| App Footer | mailto/tel/address | commercial@ziontechgroup.com | From `CONTACT_INFO` |
| Root `components/Footer.tsx` | mailto | commercial@ziontechgroup.com | Hardcoded; not used by app layout (app uses `app/components/Footer.tsx`) |

## Other References (not form submissions)

- **SEO / structured data:** `app/utils/seoConstants.ts`, `app/components/SEOOptimization.tsx`, `app/components/SEOHead.tsx`, `app/data/servicesData.ts` — all use or reference commercial@ziontechgroup.com for schema/contactPoint.
- **NewsletterSignup.tsx:** Sends to commercial@ziontechgroup.com via mailto (CONTACT_INFO.email) as of 2026-03-08.
- **automation/ai-contact-form-handler.cjs:** Optional backend for form queue; does not set recipient email; site uses mailto for contact form.

## Changes Made (2025-03-07)

1. **Blog “Stay Updated”**  
   Replaced static email input + button with `BlogNewsletterSignup` client component. On submit, opens mailto to `CONTACT_INFO.email` (commercial@ziontechgroup.com) with subject “Blog newsletter signup / Stay Updated” and body containing the entered email so submissions go to commercial.

No other contact forms required changes; they already used `CONTACT_INFO.email` or hardcoded commercial@ziontechgroup.com.

## Changes Made (2026-03-08)

1. **NewsletterSignup.tsx**  
   Updated to send to commercial@ziontechgroup.com via `mailto:` using `CONTACT_INFO.email`, with subject "Newsletter signup / Stay Updated" and body containing the entered email. Aligns with BlogNewsletterSignup and ContactFormClient; any page using this component now sends submissions to commercial.
2. **Re-audit**  
   Confirmed all contact forms (contact page, blog newsletter, careers, press, partners, app footer) use `CONTACT_INFO.email` (commercial@ziontechgroup.com). Single source of truth: `app/utils/seoConstants.ts`.

## Changes Made (2026-03-09)

1. **Re-audit**  
   Visited the live site and re-verified all contact-related forms (contact page form, blog newsletter, shared `NewsletterSignup`, careers, press, partners, footer contact links). All still submit or direct to **commercial@ziontechgroup.com** via `CONTACT_INFO.email`; no code changes required.
