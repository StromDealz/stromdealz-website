import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const STROMDEALZ_PHONE = "02161 6202538";
const STROMDEALZ_PHONE_LINK = "tel:021616202538";
const STROMDEALZ_BOOKING = "https://www.stromdealz.de/booking";
const STROMDEALZ_EMPFEHLUNG = "https://www.stromdealz.de/empfehlung";
const STROMDEALZ_WEBSITE = "https://www.stromdealz.de";

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function escapeHtml(value: unknown) {
  return clean(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email: unknown) {
  const value = clean(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getEnv(name: string) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`ENV_MISSING:${name}`);
  }
  return String(value).trim();
}

function normalizeYesNo(value: unknown) {
  const raw = clean(value).toLowerCase();

  if (
    value === true ||
    raw === "ja" ||
    raw === "yes" ||
    raw === "true" ||
    raw === "1" ||
    raw === "on"
  ) {
    return "Ja";
  }

  return "Nein";
}

function wrapEmail(body: string) {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;">
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

          <tr>
            <td style="background:#ffffff;padding:32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
              ${body}
            </td>
          </tr>

          <tr>
            <td style="background:#f8fafc;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 20px 20px;padding:20px 32px;">
              <p style="margin:0 0 6px;font-size:12px;color:#6b7280;line-height:1.6;">
                <strong style="color:#374151;">StromDealz</strong><br />
                Telefon:
                <a href="${STROMDEALZ_PHONE_LINK}" style="color:#0f75bc;text-decoration:none;">${STROMDEALZ_PHONE}</a><br />
                <a href="${STROMDEALZ_WEBSITE}" style="color:#0f75bc;text-decoration:none;">www.stromdealz.de</a>
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#9ca3af;line-height:1.5;">
                Diese E-Mail wurde automatisch versandt.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildInternalHtml(fields: {
  referrerName: string;
  referrerEmail: string;
  referrerPhone: string;
  referredName: string;
  referredEmail: string;
  contactPermission: string;
  referredPhone: string;
  consent: string;
  message: string;
  submittedAt: string;
}) {
  return wrapEmail(`
    <h1 style="margin:0 0 4px;font-size:22px;font-weight:bold;color:#111827;">Neue Weiterempfehlung</h1>
    <p style="margin:0 0 24px;font-size:13px;color:#6b7280;">Eingegangen am ${escapeHtml(fields.submittedAt)}</p>

    <div style="margin-bottom:16px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;padding:16px 20px;">
      <p style="margin:0 0 10px;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#0f75bc;">Empfehlender Kunde</p>
      <p style="margin:0;font-size:14px;line-height:1.8;color:#374151;">
        <strong>Name:</strong> ${escapeHtml(fields.referrerName)}<br />
        <strong>E-Mail:</strong> ${escapeHtml(fields.referrerEmail)}<br />
        <strong>Telefon:</strong> ${escapeHtml(fields.referrerPhone || "Nicht angegeben")}
      </p>
    </div>

    <div style="margin-bottom:16px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:14px;padding:16px 20px;">
      <p style="margin:0 0 10px;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#1d4ed8;">Empfohlene Person</p>
      <p style="margin:0;font-size:14px;line-height:1.8;color:#374151;">
        <strong>Name:</strong> ${escapeHtml(fields.referredName)}<br />
        <strong>E-Mail:</strong> ${escapeHtml(fields.referredEmail || "Nicht angegeben")}<br />
        <strong>Kontaktaufnahme erlaubt:</strong> ${escapeHtml(fields.contactPermission)}<br />
        <strong>Telefon:</strong> ${escapeHtml(fields.referredPhone || "Nicht angegeben")}<br />
        <strong>Einwilligung:</strong> ${escapeHtml(fields.consent)}
      </p>
    </div>

    <div style="margin-bottom:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;padding:16px 20px;">
      <p style="margin:0 0 10px;font-size:13px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#374151;">Nachricht</p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#374151;">${escapeHtml(fields.message || "Keine Nachricht angegeben.")}</p>
    </div>

    <div style="background:#fefce8;border:1px solid #fde68a;border-radius:14px;padding:16px 20px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:bold;color:#92400e;">Gutschein Hinweis</p>
      <p style="margin:0;font-size:13px;line-height:1.7;color:#78350f;">
        50 € Gutschein bei erfolgreicher Empfehlung. Der Anspruch entsteht erst, wenn durch die Empfehlung ein Strom oder Gasvertrag zustande kommt und der Vertrag aktiv in Belieferung ist.
      </p>
    </div>
  `);
}

function buildReferrerHtml(referrerName: string, referredName: string) {
  return wrapEmail(`
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:bold;color:#111827;text-align:center;">
      Vielen Dank, ${escapeHtml(referrerName)}!
    </h1>

    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;text-align:center;line-height:1.6;">
      Ihre Empfehlung für <strong style="color:#111827;">${escapeHtml(referredName)}</strong> ist bei uns eingegangen.
    </p>

    <div style="margin-bottom:16px;background:linear-gradient(135deg,#0f75bc 0%,#0b609b 100%);border-radius:16px;padding:20px 24px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.75);">Ihre Prämie</p>
      <p style="margin:0;font-size:28px;font-weight:bold;color:#ffffff;">50 € Gutschein</p>
      <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.85);line-height:1.6;">
        Der Gutschein wird freigegeben, sobald durch Ihre Empfehlung ein Strom oder Gasvertrag aktiv in Belieferung ist.
      </p>
    </div>

    <p style="margin:0 0 24px;font-size:13px;color:#374151;line-height:1.7;">
      Sie können beliebig viele Personen empfehlen. Für jede erfolgreiche Empfehlung entsteht ein eigener Gutscheinanspruch.
    </p>

    <div style="text-align:center;">
      <a href="${STROMDEALZ_EMPFEHLUNG}"
         style="display:inline-block;background:linear-gradient(135deg,#0f75bc 0%,#0b609b 100%);color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:50px;">
        Weitere Person empfehlen
      </a>
    </div>
  `);
}

function buildReferredHtml(referredName: string, referrerName: string) {
  return wrapEmail(`
    <p style="margin:0 0 6px;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:#0f75bc;">
      Persönliche Empfehlung
    </p>

    <h1 style="margin:0 0 16px;font-size:23px;font-weight:bold;color:#111827;line-height:1.3;">
      Hallo ${escapeHtml(referredName)}, Sie wurden von<br />
      <span style="color:#0f75bc;">${escapeHtml(referrerName)}</span> empfohlen.
    </h1>

    <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;">
      ${escapeHtml(referrerName)} hat uns mitgeteilt, dass Sie sich für eine persönliche Energieberatung interessieren könnten.
      StromDealz hilft Ihnen gerne dabei, den passenden Strom oder Gastarif zu finden.
    </p>

    <div style="margin-bottom:24px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:20px 24px;">
      <p style="margin:0 0 14px;font-size:14px;font-weight:bold;color:#111827;">Was wir für Sie tun:</p>
      <p style="margin:0;font-size:14px;color:#374151;line-height:1.8;">
        ✅ Kostenlose Beratung<br />
        ✅ Transparenter Vergleich<br />
        ✅ Persönlicher Ansprechpartner<br />
        ✅ Schnell und unkompliziert
      </p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:0 6px 0 0;" width="50%">
          <a href="${STROMDEALZ_PHONE_LINK}"
             style="display:block;background:linear-gradient(135deg,#0f75bc 0%,#0b609b 100%);color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 16px;border-radius:14px;text-align:center;">
            Anrufen<br />
            <span style="font-size:12px;font-weight:normal;opacity:0.9;">${STROMDEALZ_PHONE}</span>
          </a>
        </td>
        <td style="padding:0 0 0 6px;" width="50%">
          <a href="${STROMDEALZ_BOOKING}"
             style="display:block;background:#ffffff;color:#0f75bc;font-size:15px;font-weight:bold;text-decoration:none;padding:14px 16px;border-radius:14px;text-align:center;border:2px solid #0f75bc;">
            Termin buchen<br />
            <span style="font-size:12px;font-weight:normal;color:#6b7280;">Online auswählen</span>
          </a>
        </td>
      </tr>
    </table>
  `);
}

export async function POST(request: Request) {
  try {
    let data: Record<string, unknown>;

    try {
      data = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Ungültige Anfrage. Bitte Formular erneut absenden." },
        { status: 400 }
      );
    }

    const referrerName = clean(data.referrerName);
    const referrerEmail = clean(data.referrerEmail);
    const referrerPhone = clean(data.referrerPhone);

    const referredName = clean(data.referredName);
    const referredEmail = clean(data.referredEmail);
    const referredPhone = clean(data.referredPhone);

    const message = clean(data.message);
    const contactPermission = normalizeYesNo(data.contactPermission);
    const consent = Boolean(data.consent) || clean(data.consent).toLowerCase() === "true" || clean(data.consent).toLowerCase() === "on";

    if (!referrerName || !referrerEmail || !referredName) {
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

    if (contactPermission === "Ja" && !referredPhone) {
      return NextResponse.json(
        { message: "Bitte Telefonnummer der empfohlenen Person angeben." },
        { status: 400 }
      );
    }

    if (contactPermission === "Ja" && !consent) {
      return NextResponse.json(
        { message: "Bitte bestätigen Sie die Einwilligung zur Kontaktaufnahme." },
        { status: 400 }
      );
    }

const smtpHost = process.env.REFERRAL_SMTP_HOST || process.env.SMTP_HOST;
const smtpPort = Number(process.env.REFERRAL_SMTP_PORT || process.env.SMTP_PORT || 465);
const smtpSecure = String(process.env.REFERRAL_SMTP_SECURE || process.env.SMTP_SECURE || "true").toLowerCase() === "true";
const smtpUser = process.env.REFERRAL_SMTP_USER || process.env.SMTP_USER;
const smtpPass = process.env.REFERRAL_SMTP_PASS || process.env.SMTP_PASS;
const smtpFrom = process.env.REFERRAL_SMTP_FROM || process.env.SMTP_FROM || `StromDealz <${smtpUser}>`;
const receiverEmail = process.env.REFERRAL_RECEIVER_EMAIL || process.env.RECEIVER_EMAIL || smtpUser;

if (!smtpHost) throw new Error("ENV_MISSING:REFERRAL_SMTP_HOST oder SMTP_HOST");
if (!smtpUser) throw new Error("ENV_MISSING:REFERRAL_SMTP_USER oder SMTP_USER");
if (!smtpPass) throw new Error("ENV_MISSING:REFERRAL_SMTP_PASS oder SMTP_PASS");

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const submittedAt = new Date().toLocaleString("de-DE", {
      timeZone: "Europe/Berlin",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const internalText = `
Neue Weiterempfehlung

Eingegangen am: ${submittedAt}

Empfehlender Kunde:
Name: ${referrerName}
E-Mail: ${referrerEmail}
Telefon: ${referrerPhone || "Nicht angegeben"}

Empfohlene Person:
Name: ${referredName}
E-Mail: ${referredEmail || "Nicht angegeben"}
Kontaktaufnahme erlaubt: ${contactPermission}
Telefon: ${referredPhone || "Nicht angegeben"}
Einwilligung: ${consent ? "Ja" : "Nein oder nicht erforderlich"}

Nachricht:
${message || "Keine Nachricht angegeben."}

Gutschein:
50 € bei erfolgreichem Vertragsabschluss.
    `.trim();

    const internalResult = await transporter.sendMail({
      from: smtpFrom,
      to: receiverEmail,
      replyTo: referrerEmail,
      subject: `Neue Weiterempfehlung: ${referredName}`,
      text: internalText,
      html: buildInternalHtml({
        referrerName,
        referrerEmail,
        referrerPhone,
        referredName,
        referredEmail,
        contactPermission,
        referredPhone,
        consent: consent ? "Ja" : "Nein oder nicht erforderlich",
        message,
        submittedAt,
      }),
    });

    const optionalEmails = [];

    optionalEmails.push(
      transporter.sendMail({
        from: smtpFrom,
        to: referrerEmail,
        subject: `Ihre Empfehlung für ${referredName} ist eingegangen`,
        text: `Vielen Dank, ${referrerName}. Ihre Empfehlung für ${referredName} ist bei StromDealz eingegangen. Sobald durch Ihre Empfehlung ein Strom oder Gasvertrag aktiv in Belieferung ist, erhalten Sie Ihren 50 € Gutschein.`,
        html: buildReferrerHtml(referrerName, referredName),
      })
    );

    if (referredEmail) {
      optionalEmails.push(
        transporter.sendMail({
          from: smtpFrom,
          to: referredEmail,
          subject: `${referrerName} hat Sie bei StromDealz empfohlen`,
          text: `Hallo ${referredName}, ${referrerName} hat Sie bei StromDealz empfohlen. Wir beraten Sie gerne kostenlos zu Strom und Gas. Telefon: ${STROMDEALZ_PHONE}. Termin: ${STROMDEALZ_BOOKING}`,
          html: buildReferredHtml(referredName, referrerName),
        })
      );
    }

    const optionalResults = await Promise.allSettled(optionalEmails);

    console.log("Empfehlung gesendet:", {
      internalMessageId: internalResult.messageId,
      optionalResults: optionalResults.map((result) => result.status),
    });

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
        { message: `Server Einstellung fehlt: ${missingName}.` },
        { status: 500 }
      );
    }

    if (
      errorMessage.includes("Invalid login") ||
      errorMessage.includes("EAUTH") ||
      errorMessage.includes("535")
    ) {
      return NextResponse.json(
        { message: "SMTP Login fehlgeschlagen. Bitte Zugangsdaten prüfen." },
        { status: 500 }
      );
    }

    if (
      errorMessage.includes("ECONNECTION") ||
      errorMessage.includes("ETIMEDOUT") ||
      errorMessage.includes("ECONNREFUSED")
    ) {
      return NextResponse.json(
        { message: "SMTP Verbindung fehlgeschlagen. Bitte Host, Port und Secure prüfen." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Die Empfehlung konnte nicht gesendet werden." },
      { status: 500 }
    );
  }
}