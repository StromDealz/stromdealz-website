import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const STROMDEALZ_PHONE      = "02161 6202538";
const STROMDEALZ_PHONE_LINK = "tel:021616202538";
const STROMDEALZ_BOOKING    = "https://www.stromdealz.de/booking";
const STROMDEALZ_EMPFEHLUNG = "https://www.stromdealz.de/empfehlung";
const STROMDEALZ_WEBSITE    = "https://www.stromdealz.de";

function escapeHtml(value: unknown) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email: unknown) {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`ENV_MISSING:${name}`);
  return value;
}

/* ─────────────────────────────────────────────────────────
   Shared email wrapper (header + footer)
───────────────────────────────────────────────────────── */
function wrapEmail(body: string) {
  return `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0f75bc 0%,#0b609b 100%);border-radius:20px 20px 0 0;padding:28px 32px 24px;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.75);">
              StromDealz
            </p>
            <p style="margin:0;font-size:26px;font-weight:bold;color:#ffffff;line-height:1.2;">
              Dein Strom. Dein Deal.
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 20px 20px;padding:20px 32px;">
            <p style="margin:0 0 6px;font-size:12px;color:#6b7280;line-height:1.6;">
              <strong style="color:#374151;">StromDealz</strong> &bull; Energieberatung für Strom und Gas<br>
              Telefon: <a href="${STROMDEALZ_PHONE_LINK}" style="color:#0f75bc;text-decoration:none;">${STROMDEALZ_PHONE}</a>
              &bull; <a href="${STROMDEALZ_WEBSITE}" style="color:#0f75bc;text-decoration:none;">www.stromdealz.de</a>
            </p>
            <p style="margin:8px 0 0;font-size:11px;color:#9ca3af;line-height:1.5;">
              Diese E-Mail wurde automatisch versandt. Bitte antworten Sie nicht direkt auf diese Nachricht.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ─────────────────────────────────────────────────────────
   1. Internal notification (to StromDealz team)
───────────────────────────────────────────────────────── */
function buildInternalHtml(fields: {
  safeReferrerName: string; safeReferrerEmail: string; safeReferrerPhone: string;
  safeReferredName: string; safeReferredEmail: string; safeContactPermission: string;
  safeReferredPhone: string; safeConsent: string; safeMessage: string; safeSubmittedAt: string;
}) {
  const body = `
    <h1 style="margin:0 0 4px;font-size:22px;font-weight:bold;color:#111827;">Neue Weiterempfehlung</h1>
    <p style="margin:0 0 24px;font-size:13px;color:#6b7280;">Eingegangen am ${fields.safeSubmittedAt}</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 10px;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#0f75bc;">Empfehlender Kunde</p>
        <p style="margin:0;font-size:14px;line-height:1.8;color:#374151;">
          <strong>Name:</strong> ${fields.safeReferrerName}<br>
          <strong>E-Mail:</strong> ${fields.safeReferrerEmail}<br>
          <strong>Telefon:</strong> ${fields.safeReferrerPhone}
        </p>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:14px;overflow:hidden;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 10px;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#1d4ed8;">Empfohlene Person</p>
        <p style="margin:0;font-size:14px;line-height:1.8;color:#374151;">
          <strong>Name:</strong> ${fields.safeReferredName}<br>
          <strong>E-Mail:</strong> ${fields.safeReferredEmail}<br>
          <strong>Direkte Kontaktaufnahme:</strong> ${fields.safeContactPermission}<br>
          <strong>Telefon:</strong> ${fields.safeReferredPhone}<br>
          <strong>Einwilligung bestätigt:</strong> ${fields.safeConsent}
        </p>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 10px;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#374151;">Zusätzliche Nachricht</p>
        <p style="margin:0;font-size:14px;line-height:1.7;color:#374151;">${fields.safeMessage}</p>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fefce8;border:1px solid #fde68a;border-radius:14px;overflow:hidden;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#92400e;">Gutschein Hinweis</p>
        <p style="margin:0;font-size:13px;line-height:1.7;color:#78350f;">
          50 € Gutschein bei erfolgreicher Empfehlung. Der Anspruch entsteht erst, wenn durch die Empfehlung ein erfolgreicher Strom- oder Gasvertrag zustande kommt und der Vertrag aktiv in Belieferung ist.
        </p>
      </td></tr>
    </table>
  `;
  return wrapEmail(body);
}

/* ─────────────────────────────────────────────────────────
   2. Referrer confirmation (to the person who referred)
───────────────────────────────────────────────────────── */
function buildReferrerHtml(referrerName: string, referredName: string) {
  const safeReferrerName = escapeHtml(referrerName);
  const safeReferredName = escapeHtml(referredName);

  const body = `
    <!-- Check icon -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;background:linear-gradient(135deg,#22c55e 0%,#16a34a 100%);border-radius:20px;width:64px;height:64px;line-height:64px;text-align:center;">
        <span style="font-size:30px;color:#fff;">✓</span>
      </div>
    </div>

    <h1 style="margin:0 0 8px;font-size:24px;font-weight:bold;color:#111827;text-align:center;">
      Vielen Dank, ${safeReferrerName}!
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;text-align:center;line-height:1.6;">
      Ihre Empfehlung für <strong style="color:#111827;">${safeReferredName}</strong> ist bei uns eingegangen.<br>
      Wir prüfen die Anfrage und kümmern uns um die weitere Bearbeitung.
    </p>

    <!-- Voucher box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;background:linear-gradient(135deg,#0f75bc 0%,#0b609b 100%);border-radius:16px;overflow:hidden;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.75);">Ihre Prämie</p>
        <p style="margin:0;font-size:28px;font-weight:bold;color:#ffffff;">50 € Gutschein</p>
        <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.85);line-height:1.6;">
          Der Gutschein wird freigegeben, sobald durch Ihre Empfehlung ein Strom- oder Gasvertrag aktiv in Belieferung ist.
        </p>
      </td></tr>
    </table>

    <!-- Info boxes -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;background:#fffbeb;border:1px solid #fde68a;border-radius:14px;overflow:hidden;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#92400e;">🎁 Wichtige Hinweise</p>
        <ul style="margin:0;padding-left:18px;font-size:13px;line-height:1.8;color:#78350f;">
          <li>Der Gutscheinanspruch entsteht erst nach erfolgreichem Vertragsabschluss der empfohlenen Person.</li>
          <li>Eigenempfehlungen und Mehrfachmeldungen derselben Person können ausgeschlossen werden.</li>
          <li>Der Gutschein ist nicht übertragbar und wird separat ausgestellt.</li>
        </ul>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:14px;overflow:hidden;">
      <tr><td style="padding:16px 20px;">
        <p style="margin:0;font-size:13px;color:#0c4a6e;line-height:1.7;">
          💡 <strong>Tipp:</strong> Sie können beliebig viele Personen empfehlen — für jede erfolgreiche Empfehlung entsteht ein eigener Gutscheinanspruch!
        </p>
      </td></tr>
    </table>

    <!-- CTA button -->
    <div style="text-align:center;">
      <a href="${STROMDEALZ_EMPFEHLUNG}"
         style="display:inline-block;background:linear-gradient(135deg,#0f75bc 0%,#0b609b 100%);color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:50px;">
        Weitere Person empfehlen &amp; mehr Gutscheine sichern →
      </a>
    </div>
  `;
  return wrapEmail(body);
}

/* ─────────────────────────────────────────────────────────
   3. Referred person notification
───────────────────────────────────────────────────────── */
function buildReferredHtml(referredName: string, referrerName: string) {
  const safeReferredName = escapeHtml(referredName);
  const safeReferrerName = escapeHtml(referrerName);

  const body = `
    <!-- Greeting -->
    <p style="margin:0 0 6px;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:#0f75bc;">
      Persönliche Empfehlung
    </p>
    <h1 style="margin:0 0 16px;font-size:23px;font-weight:bold;color:#111827;line-height:1.3;">
      Hallo ${safeReferredName}, Sie wurden von<br>
      <span style="color:#0f75bc;">${safeReferrerName}</span> empfohlen!
    </h1>

    <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;">
      <strong style="color:#111827;">${safeReferrerName}</strong> hat uns mitgeteilt, dass Sie sich für eine
      persönliche Energie&shy;beratung interessieren könnten. Wir bei <strong>StromDealz</strong> helfen Ihnen
      gerne dabei, den passenden Strom- oder Gastari&shy;f zu finden — transparent, verständlich und ohne versteckte Kosten.
    </p>

    <!-- Benefits -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 14px;font-size:14px;font-weight:bold;color:#111827;">Was wir für Sie tun:</p>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:4px 0;font-size:14px;color:#374151;line-height:1.6;">
              ✅&nbsp;&nbsp;<strong>Kostenlose Beratung</strong> — kein Risiko, keine Verpflichtung
            </td>
          </tr>
          <tr>
            <td style="padding:4px 0;font-size:14px;color:#374151;line-height:1.6;">
              ✅&nbsp;&nbsp;<strong>Transparenter Vergleich</strong> — faire Tarife, verständlich erklärt
            </td>
          </tr>
          <tr>
            <td style="padding:4px 0;font-size:14px;color:#374151;line-height:1.6;">
              ✅&nbsp;&nbsp;<strong>Persönlicher Ansprechpartner</strong> — von Anfang bis Ende
            </td>
          </tr>
          <tr>
            <td style="padding:4px 0;font-size:14px;color:#374151;line-height:1.6;">
              ✅&nbsp;&nbsp;<strong>Schnell &amp; unkompliziert</strong> — Termin oder einfach anrufen
            </td>
          </tr>
        </table>
      </td></tr>
    </table>

    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6;text-align:center;">
      Nehmen Sie jetzt Kontakt auf — wir freuen uns auf Sie!
    </p>

    <!-- Two CTA buttons -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      <tr>
        <td style="padding:0 6px 0 0;" width="50%">
          <a href="${STROMDEALZ_PHONE_LINK}"
             style="display:block;background:linear-gradient(135deg,#0f75bc 0%,#0b609b 100%);color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 16px;border-radius:14px;text-align:center;">
            📞 Anrufen<br>
            <span style="font-size:12px;font-weight:normal;opacity:0.9;">${STROMDEALZ_PHONE}</span>
          </a>
        </td>
        <td style="padding:0 0 0 6px;" width="50%">
          <a href="${STROMDEALZ_BOOKING}"
             style="display:block;background:#ffffff;color:#0f75bc;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 16px;border-radius:14px;text-align:center;border:2px solid #0f75bc;">
            📅 Termin buchen<br>
            <span style="font-size:12px;font-weight:normal;color:#6b7280;">Online Termin wählen</span>
          </a>
        </td>
      </tr>
    </table>

    <!-- OR divider -->
    <p style="margin:12px 0;font-size:12px;color:#9ca3af;text-align:center;letter-spacing:1px;">— oder —</p>

    <p style="margin:0;font-size:13px;color:#6b7280;text-align:center;line-height:1.6;">
      Sie können uns auch direkt per E-Mail erreichen:<br>
      <a href="mailto:kontakt@stromdealz.de" style="color:#0f75bc;text-decoration:none;">kontakt@stromdealz.de</a>
    </p>
  `;
  return wrapEmail(body);
}

/* ─────────────────────────────────────────────────────────
   POST handler
───────────────────────────────────────────────────────── */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      referrerName,
      referrerEmail,
      referrerPhone,
      referredName,
      referredEmail,
      contactPermission,
      referredPhone,
      consent,
      message,
    } = data;

    if (!referrerName || !referrerEmail || !referredName || !contactPermission) {
      return NextResponse.json(
        { message: "Bitte füllen Sie alle Pflichtfelder aus." },
        { status: 400 }
      );
    }

    if (!isValidEmail(referrerEmail)) {
      return NextResponse.json(
        { message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." },
        { status: 400 }
      );
    }

    if (referredEmail && !isValidEmail(referredEmail)) {
      return NextResponse.json(
        { message: "Die E-Mail-Adresse der empfohlenen Person ist ungültig." },
        { status: 400 }
      );
    }

    if (contactPermission !== "Ja" && contactPermission !== "Nein") {
      return NextResponse.json(
        { message: "Bitte wählen Sie aus, ob wir die empfohlene Person kontaktieren dürfen." },
        { status: 400 }
      );
    }

    if (contactPermission === "Ja" && (!referredPhone || !consent)) {
      return NextResponse.json(
        { message: "Bitte Telefonnummer angeben und Einwilligung bestätigen." },
        { status: 400 }
      );
    }

    /* ── SMTP setup ── */
    const smtpHost   = getEnv("REFERRAL_SMTP_HOST");
    const smtpPort   = Number(process.env.REFERRAL_SMTP_PORT || 465);
    const smtpSecure = process.env.REFERRAL_SMTP_SECURE === "true";
    const smtpUser   = getEnv("REFERRAL_SMTP_USER");
    const smtpPass   = getEnv("REFERRAL_SMTP_PASS");
    const smtpFrom   = process.env.REFERRAL_SMTP_FROM || `StromDealz <${smtpUser}>`;
    const receiverEmail = process.env.REFERRAL_RECEIVER_EMAIL || "kontakt@stromdealz.de";

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.verify();

    const submittedAt = new Date().toLocaleString("de-DE", {
      timeZone: "Europe/Berlin",
      dateStyle: "medium",
      timeStyle: "short",
    });

    /* ── 1. Internal notification ── */
    const internalHtml = buildInternalHtml({
      safeReferrerName:      escapeHtml(referrerName),
      safeReferrerEmail:     escapeHtml(referrerEmail),
      safeReferrerPhone:     escapeHtml(referrerPhone || "Nicht angegeben"),
      safeReferredName:      escapeHtml(referredName),
      safeReferredEmail:     escapeHtml(referredEmail || "Nicht angegeben"),
      safeContactPermission: escapeHtml(contactPermission),
      safeReferredPhone:     escapeHtml(referredPhone || "Nicht angegeben"),
      safeConsent:           consent ? "Ja" : "Nein oder nicht erforderlich",
      safeMessage:           escapeHtml(message || "Keine Nachricht angegeben."),
      safeSubmittedAt:       escapeHtml(submittedAt),
    });

    const internalText = `
Neue Weiterempfehlung — ${submittedAt}

Empfehlender Kunde:
  Name:    ${referrerName}
  E-Mail:  ${referrerEmail}
  Telefon: ${referrerPhone || "Nicht angegeben"}

Empfohlene Person:
  Name:                  ${referredName}
  E-Mail:                ${referredEmail || "Nicht angegeben"}
  Kontaktaufnahme:       ${contactPermission}
  Telefon:               ${referredPhone || "Nicht angegeben"}
  Einwilligung:          ${consent ? "Ja" : "Nein oder nicht erforderlich"}

Nachricht:
  ${message || "Keine Nachricht angegeben."}

Gutschein: 50 € bei erfolgreichem Vertragsabschluss.
    `.trim();

    const sends: Promise<unknown>[] = [];

    sends.push(transporter.sendMail({
      from:    smtpFrom,
      to:      receiverEmail,
      replyTo: String(referrerEmail),
      subject: `Neue Weiterempfehlung: ${String(referredName).trim()}`,
      text:    internalText,
      html:    internalHtml,
    }));

    /* ── 2. Referrer confirmation ── */
    sends.push(transporter.sendMail({
      from:    smtpFrom,
      to:      String(referrerEmail),
      subject: `Ihre Empfehlung für ${String(referredName).trim()} ist eingegangen ✓`,
      text: `Vielen Dank, ${referrerName}! Ihre Empfehlung für ${referredName} ist bei StromDealz eingegangen. Sobald durch Ihre Empfehlung ein Strom- oder Gasvertrag aktiv in Belieferung ist, erhalten Sie Ihren 50 € Gutschein. Weitere Person empfehlen: ${STROMDEALZ_EMPFEHLUNG}`,
      html:    buildReferrerHtml(String(referrerName), String(referredName)),
    }));

    /* ── 3. Referred person notification (only if email provided) ── */
    if (referredEmail && isValidEmail(referredEmail)) {
      sends.push(transporter.sendMail({
        from:    smtpFrom,
        to:      String(referredEmail),
        subject: `${String(referrerName).trim()} hat Sie bei StromDealz empfohlen`,
        text: `Hallo ${referredName}, ${referrerName} hat Sie bei StromDealz empfohlen. Wir beraten Sie gerne kostenlos zu Strom- und Gastarifen. Rufen Sie uns an: ${STROMDEALZ_PHONE} oder buchen Sie einen Termin: ${STROMDEALZ_BOOKING}`,
        html:    buildReferredHtml(String(referredName), String(referrerName)),
      }));
    }

    await Promise.all(sends);

    return NextResponse.json(
      { message: "Empfehlung wurde erfolgreich gesendet." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fehler beim Senden der Empfehlung:", error);

    const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";

    if (errorMessage.startsWith("ENV_MISSING:")) {
      const missingName = errorMessage.replace("ENV_MISSING:", "");
      return NextResponse.json(
        { message: `Server Einstellung fehlt: ${missingName}. Bitte .env.local prüfen und Server neu starten.` },
        { status: 500 }
      );
    }

    if (errorMessage.includes("Invalid login") || errorMessage.includes("EAUTH") || errorMessage.includes("535")) {
      return NextResponse.json(
        { message: "SMTP Login fehlgeschlagen. Bitte E-Mail-Adresse und Passwort in .env.local prüfen." },
        { status: 500 }
      );
    }

    if (errorMessage.includes("ECONNECTION") || errorMessage.includes("ETIMEDOUT") || errorMessage.includes("ECONNREFUSED")) {
      return NextResponse.json(
        { message: "SMTP Verbindung fehlgeschlagen. Bitte SMTP Host, Port und Secure Einstellung prüfen." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Die Empfehlung konnte nicht gesendet werden. Bitte Server Konsole prüfen." },
      { status: 500 }
    );
  }
}
