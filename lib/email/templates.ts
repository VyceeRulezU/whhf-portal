import { sitePhotos } from "@/lib/content/sitePhotos";
import { placeholderImages } from "@/lib/content/placeholderImages";

/**
 * Branded HTML wrapper for every outgoing email — admin replies/compose
 * (see app/api/admin/email/send/route.ts) and system notifications (e.g.
 * donationReceiptTemplate below, wired into the payment webhooks' success
 * path). Table-based layout with inline styles throughout, since email
 * clients (Outlook especially) don't support modern CSS or external
 * stylesheets — this is the one place in the codebase that's deliberately
 * not using CSS Modules/design tokens.
 */

const BRAND_BLACK = "#0A0A0A";
const BRAND_GOLD = "#D4A64C";
const TEXT_PRIMARY = "#1A1A1A";
const TEXT_SECONDARY = "#5C5C5C";
const BORDER = "#E5E2DC";
const PAGE_BG = "#F4F3F0";

const SITE_URL = "https://whheritagefoundation.org";
const CONTACT_ADDRESS = "3FVM+H9M, Along Nile Street, Maitama, Abuja 904101, FCT";
const CONTACT_PHONE = "0806 432 0084";
const CONTACT_EMAIL = "contact@whheritagefoundation.org";

// Header masthead background — the site's own hero photo, dimmed by a
// dark overlay cell (below) so it reads as a faint texture behind the
// logo rather than competing with it. Most clients (Gmail, Apple Mail,
// modern Outlook) render it; legacy desktop Outlook falls back to the
// plain BRAND_BLACK background-color, which is still the correct look.
const HEADER_BG_IMAGE = placeholderImages.homeHero;

interface BaseTemplateOptions {
  preheader: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaHref?: string;
  unsubscribeHref?: string;
}

export function baseEmailTemplate({ preheader, bodyHtml, ctaLabel, ctaHref, unsubscribeHref }: BaseTemplateOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<!-- Without these, Apple Mail's automatic dark-mode color adjustment
     mistakes the near-black rgba() overlay below for a "light" color it
     should invert, rendering it washed-out white on iPhone/iPad while
     every other client (which doesn't do this color-guessing) shows it
     correctly. This opts the whole email out of that adjustment. -->
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>William &amp; Helen Heritage Foundation</title>
</head>
<body style="margin:0; padding:0; background-color:${PAGE_BG}; font-family:Georgia, 'Times New Roman', serif;">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${PAGE_BG}; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#FFFFFF; border-radius:12px; overflow:hidden; border:1px solid ${BORDER};">
          <tr>
            <td align="center" bgcolor="${BRAND_BLACK}" style="background-color:${BRAND_BLACK}; background-image:url('${HEADER_BG_IMAGE}'); background-size:cover; background-position:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" bgcolor="${BRAND_BLACK}" style="background-color:rgba(10,10,10,0.78); padding:32px 24px; border-bottom:3px solid ${BRAND_GOLD};">
                    <img src="${sitePhotos.logoEmail}" alt="William & Helen Heritage Foundation" width="72" height="72" style="display:block;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 32px; font-family:Georgia, 'Times New Roman', serif; color:${TEXT_PRIMARY}; font-size:15px; line-height:1.6;">
              ${bodyHtml}
              ${
                ctaLabel && ctaHref
                  ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                      <tr>
                        <td align="center" style="background-color:${BRAND_GOLD}; border-radius:999px;">
                          <a href="${ctaHref}" style="display:inline-block; padding:14px 32px; color:${BRAND_BLACK}; font-family:Arial, sans-serif; font-weight:bold; font-size:14px; text-decoration:none;">${escapeHtml(ctaLabel)}</a>
                        </td>
                      </tr>
                    </table>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px; background-color:${PAGE_BG}; border-top:1px solid ${BORDER}; font-family:Arial, sans-serif; font-size:12px; color:${TEXT_SECONDARY}; line-height:1.6;">
              <strong style="color:${TEXT_PRIMARY};">William &amp; Helen Heritage Foundation</strong><br />
              ${CONTACT_ADDRESS}<br />
              ${CONTACT_PHONE} &nbsp;·&nbsp; <a href="mailto:${CONTACT_EMAIL}" style="color:${TEXT_SECONDARY};">${CONTACT_EMAIL}</a><br /><br />
              You&rsquo;re receiving this because of your interaction with WHHF at
              <a href="${SITE_URL}" style="color:${TEXT_SECONDARY};">whheritagefoundation.org</a>.
              ${
                unsubscribeHref
                  ? `<br /><a href="${unsubscribeHref}" style="color:${TEXT_SECONDARY};">Unsubscribe from these emails</a>.`
                  : ""
              }
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

interface DonationReceiptOptions {
  donorName: string;
  amount: string;
  causeName: string;
  reference: string;
  date: string;
}

/** Sent from the payment webhooks' success path (see
    app/api/webhooks/{paystack,flutterwave,korapay}/route.ts) once a
    donation's status flips to "succeeded" — never on the initial
    pending/redirect step, since only a verified webhook confirms the
    charge actually went through. */
export function donationReceiptTemplate({ donorName, amount, causeName, reference, date }: DonationReceiptOptions): string {
  const bodyHtml = `
    <p style="margin:0 0 20px; font-size:20px; font-weight:bold; color:${TEXT_PRIMARY};">Thank you, ${escapeHtml(donorName)}.</p>
    <p style="margin:0 0 20px; color:${TEXT_SECONDARY};">
      Your generosity has been received, and it goes directly toward WHHF&rsquo;s work, starting with support for indigent cancer patients. This email is your receipt.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0; border:1px solid ${BORDER}; border-radius:8px;">
      <tr>
        <td style="padding:16px 20px; border-bottom:1px solid ${BORDER}; font-family:Arial, sans-serif; font-size:13px; color:${TEXT_SECONDARY};">Amount</td>
        <td style="padding:16px 20px; border-bottom:1px solid ${BORDER}; font-family:Arial, sans-serif; font-size:13px; color:${TEXT_PRIMARY}; font-weight:bold; text-align:right;">${escapeHtml(amount)}</td>
      </tr>
      <tr>
        <td style="padding:16px 20px; border-bottom:1px solid ${BORDER}; font-family:Arial, sans-serif; font-size:13px; color:${TEXT_SECONDARY};">Cause</td>
        <td style="padding:16px 20px; border-bottom:1px solid ${BORDER}; font-family:Arial, sans-serif; font-size:13px; color:${TEXT_PRIMARY}; text-align:right;">${escapeHtml(causeName)}</td>
      </tr>
      <tr>
        <td style="padding:16px 20px; border-bottom:1px solid ${BORDER}; font-family:Arial, sans-serif; font-size:13px; color:${TEXT_SECONDARY};">Date</td>
        <td style="padding:16px 20px; border-bottom:1px solid ${BORDER}; font-family:Arial, sans-serif; font-size:13px; color:${TEXT_PRIMARY}; text-align:right;">${escapeHtml(date)}</td>
      </tr>
      <tr>
        <td style="padding:16px 20px; font-family:Arial, sans-serif; font-size:13px; color:${TEXT_SECONDARY};">Reference</td>
        <td style="padding:16px 20px; font-family:Arial, sans-serif; font-size:13px; color:${TEXT_PRIMARY}; text-align:right;">${escapeHtml(reference)}</td>
      </tr>
    </table>
    <p style="margin:0; color:${TEXT_SECONDARY};">
      Every gift is tracked and accounted for, with no hidden fees and no unexplained gaps. Thank you for carrying this legacy forward, one life at a time.
    </p>`;

  return baseEmailTemplate({
    preheader: `Your donation of ${amount} to WHHF has been received.`,
    bodyHtml,
    ctaLabel: "Visit Our Website",
    ctaHref: SITE_URL
  });
}

/** Wraps an admin's composed/reply message body (already HTML-escaped
    with newlines converted to <br>, see app/api/admin/email/send/route.ts)
    in the same branded shell as every other outgoing email. */
export function adminMessageTemplate(bodyHtmlWithBreaks: string): string {
  return baseEmailTemplate({
    preheader: "A message from the William & Helen Heritage Foundation team.",
    bodyHtml: `<div>${bodyHtmlWithBreaks}</div>`
  });
}

interface NewsletterTemplateOptions {
  subject: string;
  bodyHtmlWithBreaks: string;
  unsubscribeHref: string;
}

/** Sent individually (not bcc-blasted) so each copy's unsubscribe link
    can point at that one recipient's own email — see
    app/api/admin/newsletter/send/route.ts and lib/email/resend.ts's
    sendBatchEmails, which submits the whole run as one Resend batch call
    rather than one HTTP request per subscriber. */
export function newsletterTemplate({ subject, bodyHtmlWithBreaks, unsubscribeHref }: NewsletterTemplateOptions): string {
  const bodyHtml = `
    <p style="margin:0 0 20px; font-size:20px; font-weight:bold; color:${TEXT_PRIMARY};">${escapeHtml(subject)}</p>
    <div>${bodyHtmlWithBreaks}</div>`;

  return baseEmailTemplate({
    preheader: subject,
    bodyHtml,
    ctaLabel: "Visit Our Website",
    ctaHref: SITE_URL,
    unsubscribeHref
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
