import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

  if (!value) {
    throw new Error(`ENV_MISSING:${name}`);
  }

  return value;
}

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

    const smtpHost = getEnv("REFERRAL_SMTP_HOST");
    const smtpPort = Number(process.env.REFERRAL_SMTP_PORT || 465);
    const smtpSecure = process.env.REFERRAL_SMTP_SECURE === "true";
    const smtpUser = getEnv("REFERRAL_SMTP_USER");
    const smtpPass = getEnv("REFERRAL_SMTP_PASS");
    const smtpFrom =
      process.env.REFERRAL_SMTP_FROM || `StromDealz Empfehlung <${smtpUser}>`;
    const receiverEmail =
      process.env.REFERRAL_RECEIVER_EMAIL || "kontakt@stromdealz.de";

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.verify();

    const submittedAt = new Date().toLocaleString("de-DE", {
      timeZone: "Europe/Berlin",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const safeReferrerName = escapeHtml(referrerName);
    const safeReferrerEmail = escapeHtml(referrerEmail);
    const safeReferrerPhone = escapeHtml(referrerPhone || "Nicht angegeben");
    const safeReferredName = escapeHtml(referredName);
    const safeReferredEmail = escapeHtml(referredEmail || "Nicht angegeben");
    const safeContactPermission = escapeHtml(contactPermission);
    const safeReferredPhone = escapeHtml(referredPhone || "Nicht angegeben");
    const safeConsent = consent ? "Ja" : "Nein oder nicht erforderlich";
    const safeMessage = escapeHtml(message || "Keine Nachricht angegeben.");
    const safeSubmittedAt = escapeHtml(submittedAt);

    const mailHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f3f5f8;padding:24px;color:#111827;">
        <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;overflow:hidden;">
          <div style="padding:24px 28px;border-bottom:1px solid #eef0f3;">
            <p style="margin:0 0 6px 0;font-size:12px;color:#0f75bc;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">
              StromDealz Empfehlung
            </p>
            <h1 style="margin:0;font-size:26px;line-height:1.25;color:#111827;">
              Neue Weiterempfehlung eingegangen
            </h1>
            <p style="margin:10px 0 0 0;font-size:14px;color:#6b7280;">
              Eingegangen am ${safeSubmittedAt}
            </p>
          </div>

          <div style="padding:26px 28px;">
            <div style="margin-bottom:22px;padding:18px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:14px;">
              <h2 style="margin:0 0 12px 0;font-size:18px;color:#111827;">Empfehlender Kunde</h2>
              <p style="margin:0;font-size:15px;line-height:1.75;color:#374151;">
                <strong>Name:</strong> ${safeReferrerName}<br>
                <strong>E-Mail:</strong> ${safeReferrerEmail}<br>
                <strong>Telefon:</strong> ${safeReferrerPhone}
              </p>
            </div>

            <div style="margin-bottom:22px;padding:18px;background:#ffffff;border:1px solid #dbeafe;border-radius:14px;">
              <h2 style="margin:0 0 12px 0;font-size:18px;color:#111827;">Empfohlene Person</h2>
              <p style="margin:0;font-size:15px;line-height:1.75;color:#374151;">
                <strong>Name:</strong> ${safeReferredName}<br>
                <strong>E-Mail:</strong> ${safeReferredEmail}<br>
                <strong>Direkte Kontaktaufnahme gewünscht:</strong> ${safeContactPermission}<br>
                <strong>Telefon:</strong> ${safeReferredPhone}<br>
                <strong>Einwilligung bestätigt:</strong> ${safeConsent}
              </p>
            </div>

            <div style="margin-bottom:22px;padding:18px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;">
              <h2 style="margin:0 0 12px 0;font-size:18px;color:#111827;">Zusätzliche Nachricht</h2>
              <p style="margin:0;font-size:15px;line-height:1.75;color:#374151;">
                ${safeMessage}
              </p>
            </div>

            <div style="padding:18px;background:#f0f7ff;border:1px solid #bfdbfe;border-radius:14px;">
              <h2 style="margin:0 0 10px 0;font-size:17px;color:#0f172a;">Gutschein Hinweis</h2>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#334155;">
                50 € Gutschein bei erfolgreicher Empfehlung. Der Anspruch entsteht erst, wenn durch die Empfehlung ein erfolgreicher Strom oder Gasvertrag zustande kommt und der Vertrag aktiv in Belieferung ist.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    const mailText = `
Neue Weiterempfehlung eingegangen
Eingegangen am: ${submittedAt}

Empfehlender Kunde:
Name: ${referrerName}
E-Mail: ${referrerEmail}
Telefon: ${referrerPhone || "Nicht angegeben"}

Empfohlene Person:
Name: ${referredName}
E-Mail: ${referredEmail || "Nicht angegeben"}
Direkte Kontaktaufnahme gewünscht: ${contactPermission}
Telefon: ${referredPhone || "Nicht angegeben"}
Einwilligung bestätigt: ${consent ? "Ja" : "Nein oder nicht erforderlich"}

Zusätzliche Nachricht:
${message || "Keine Nachricht angegeben."}

Gutschein Hinweis:
50 € Gutschein bei erfolgreicher Empfehlung. Der Anspruch entsteht erst, wenn durch die Empfehlung ein erfolgreicher Strom oder Gasvertrag zustande kommt und der Vertrag aktiv in Belieferung ist.
`;

    await transporter.sendMail({
      from: smtpFrom,
      to: receiverEmail,
      replyTo: String(referrerEmail),
      subject: `Neue Weiterempfehlung: ${String(referredName).trim()}`,
      text: mailText,
      html: mailHtml,
    });

    return NextResponse.json(
      { message: "Empfehlung wurde erfolgreich gesendet." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fehler beim Senden der Empfehlung:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unbekannter Fehler";

    if (errorMessage.startsWith("ENV_MISSING:")) {
      const missingName = errorMessage.replace("ENV_MISSING:", "");

      return NextResponse.json(
        {
          message: `Server Einstellung fehlt: ${missingName}. Bitte .env.local prüfen und Server neu starten.`,
        },
        { status: 500 }
      );
    }

    if (
      errorMessage.includes("Invalid login") ||
      errorMessage.includes("EAUTH") ||
      errorMessage.includes("535")
    ) {
      return NextResponse.json(
        {
          message: "SMTP Login fehlgeschlagen. Bitte E-Mail-Adresse und Passwort in .env.local prüfen.",
        },
        { status: 500 }
      );
    }

    if (
      errorMessage.includes("ECONNECTION") ||
      errorMessage.includes("ETIMEDOUT") ||
      errorMessage.includes("ECONNREFUSED")
    ) {
      return NextResponse.json(
        {
          message: "SMTP Verbindung fehlgeschlagen. Bitte SMTP Host, Port und Secure Einstellung prüfen.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Die Empfehlung konnte nicht gesendet werden. Bitte Server Konsole prüfen.",
      },
      { status: 500 }
    );
  }
} 