import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = body?.name?.trim() || "";
    const email = body?.email?.trim() || "";
    const phone = body?.phone?.trim() || "";
    const subject = body?.subject?.trim() || "";
    const message = body?.message?.trim() || "";
    const privacyAccepted = body?.privacyAccepted === true;

    if (!name || !email || !phone || !subject || !message || !privacyAccepted) {
      return NextResponse.json(
        { message: "Bitte alle Pflichtfelder vollständig ausfüllen." },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactReceiver = process.env.CONTACT_RECEIVER;
    const logoUrl = "https://stromdealz.de/images/logo/stromdealz_logo.png";

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !contactReceiver) {
      return NextResponse.json(
        { message: "Die E-Mail Konfiguration ist unvollständig." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    await transporter.sendMail({
      from: `"StromDealz Kontaktformular" <${smtpUser}>`,
      to: contactReceiver,
      replyTo: email,
      subject: `Neue Anfrage über das Kontaktformular: ${subject}`,
      html: `
        <div style="margin:0;padding:0;background-color:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
          <div style="max-width:680px;margin:0 auto;padding:32px 16px;">
            <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
              <div style="background:linear-gradient(135deg,#f97316 0%,#ea580c 100%);padding:28px 32px;">
<img
  src="${logoUrl}"
  alt="StromDealz"
  style="height:40px;margin-bottom:12px;display:block;"
/>
                <div style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#ffedd5;font-weight:700;">
                  StromDealz
                </div>
                <h1 style="margin:10px 0 0;font-size:26px;line-height:1.2;color:#ffffff;">
                  Neue Kontaktanfrage
                </h1>
              </div>

              <div style="padding:32px;">
                <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#334155;">
                  Es wurde eine neue Anfrage über die StromDealz Website eingereicht.
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;width:180px;font-weight:700;color:#0f172a;">Name</td>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;color:#334155;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;width:180px;font-weight:700;color:#0f172a;">E-Mail</td>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;color:#334155;">${safeEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;width:180px;font-weight:700;color:#0f172a;">Telefon</td>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;color:#334155;">${safePhone}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;width:180px;font-weight:700;color:#0f172a;">Betreff</td>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;color:#334155;">${safeSubject}</td>
                  </tr>
                </table>

                <div style="margin-top:28px;">
                  <div style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:10px;">
                    Nachricht
                  </div>
                  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:18px;color:#334155;font-size:15px;line-height:1.7;">
                    ${safeMessage}
                  </div>
                </div>

                <div style="margin-top:28px;padding:16px 18px;background:#fff7ed;border:1px solid #fed7aa;border-radius:16px;color:#9a3412;font-size:14px;line-height:1.6;">
                  Hinweis: Durch die Reply To Funktion können Sie in Ihrem Postfach direkt auf Antworten klicken und erreichen automatisch den Absender dieser Anfrage.
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
    });

    await transporter.sendMail({
      from: `"StromDealz Energieberatung" <${smtpUser}>`,
      to: email,
      subject: "Ihre Anfrage bei StromDealz",
      html: `
        <div style="margin:0;padding:0;background-color:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
          <div style="max-width:680px;margin:0 auto;padding:32px 16px;">
            <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
              <div style="background:linear-gradient(135deg,#f97316 0%,#ea580c 100%);padding:32px;">
<img
  src="${logoUrl}"
  alt="StromDealz Energieberatung"
  style="height:45px;margin-bottom:16px;display:block;"
/>
                <div style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#ffedd5;font-weight:700;">
                  StromDealz
                </div>
                <h1 style="margin:10px 0 0;font-size:28px;line-height:1.2;color:#ffffff;">
                  Vielen Dank für Ihre Anfrage
                </h1>
                <p style="margin:14px 0 0;font-size:15px;line-height:1.7;color:#fff7ed;">
                  Ihre Nachricht wurde erfolgreich an unser Team übermittelt.
                </p>
              </div>

              <div style="padding:32px;">
                <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#334155;">
                  Sehr geehrte Damen und Herren,
                </p>

                <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#334155;">
                  vielen Dank für Ihre Kontaktaufnahme über unsere Website.
                </p>

                <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#334155;">
                  Ihr Anliegen ist erfolgreich bei uns eingegangen und wird nun von unserem Team geprüft. Wir kümmern uns zeitnah darum.
                </p>

                <p style="margin:0 0 18px;font-size:15px;line-height:1.8;color:#334155;">
                  Sollten Sie zwischenzeitlich Rückfragen haben, können Sie selbstverständlich jederzeit auch telefonischen Kontakt zu uns aufnehmen.
                </p>

                <div style="margin:28px 0;padding:20px;background:#fff7ed;border:1px solid #fed7aa;border-radius:16px;">
                  <div style="font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#c2410c;margin-bottom:8px;">
                    Ihr ausgewähltes Anliegen
                  </div>
                  <div style="font-size:16px;line-height:1.6;color:#7c2d12;font-weight:600;">
                    ${safeSubject}
                  </div>
                </div>

                <p style="margin:0 0 24px;font-size:15px;line-height:1.8;color:#334155;">
                  Wir bedanken uns für Ihr Vertrauen.
                </p>

                <p style="margin:0;font-size:15px;line-height:1.8;color:#334155;">
                  Freundliche Grüße
                </p>
                <p style="margin:6px 0 0;font-size:15px;line-height:1.8;color:#0f172a;font-weight:700;">
                  Ihr StromDealz Team
                </p>
              </div>

              <div style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:13px;line-height:1.7;color:#64748b;">
                  StromDealz Energieberatung
                </p>
              </div>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Nachricht erfolgreich gesendet.",
    });
  } catch (error) {
    console.error("Fehler beim Versenden des Kontaktformulars:", error);

    return NextResponse.json(
      { message: "Fehler beim Versenden der Nachricht." },
      { status: 500 }
    );
  }
}