import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getGutscheinAktion } from "../../../lib/gutschein-aktionen";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeFileName(fileName: string) {
  const cleaned = fileName
    .replace(/[^\p{L}\p{N}._ -]/gu, "_")
    .trim()
    .slice(0, 120);

  return cleaned || "abrechnungsnachweis";
}

function hasAllowedExtension(fileName: string) {
  const lowerCaseName = fileName.toLowerCase();
  return ALLOWED_EXTENSIONS.some((extension) =>
    lowerCaseName.endsWith(extension)
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const aktionscode = getStringValue(formData, "aktionscode");
    const anrede = getStringValue(formData, "anrede");
    const name = getStringValue(formData, "name");
    const email = getStringValue(formData, "email");
    const auftragsnummer = getStringValue(formData, "auftragsnummer");

    const agbAccepted = getStringValue(formData, "agbAccepted") === "true";
    const privacyAccepted =
      getStringValue(formData, "privacyAccepted") === "true";
    const billingConfirmed =
      getStringValue(formData, "billingConfirmed") === "true";

    const abrechnungsnachweis = formData.get("abrechnungsnachweis");

    const aktion = getGutscheinAktion(aktionscode);

    if (!aktion) {
      return NextResponse.json(
        { message: "Ungültige Gutscheinaktion." },
        { status: 400 }
      );
    }

    if (
      !anrede ||
      !name ||
      !email ||
      !auftragsnummer ||
      !agbAccepted ||
      !privacyAccepted ||
      !billingConfirmed
    ) {
      return NextResponse.json(
        { message: "Bitte alle Pflichtfelder vollständig ausfüllen." },
        { status: 400 }
      );
    }

    if (anrede !== "Herr" && anrede !== "Frau") {
      return NextResponse.json(
        { message: "Bitte wählen Sie eine gültige Anrede aus." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." },
        { status: 400 }
      );
    }

    if (
      !abrechnungsnachweis ||
      typeof abrechnungsnachweis === "string" ||
      abrechnungsnachweis.size === 0
    ) {
      return NextResponse.json(
        { message: "Bitte laden Sie einen gültigen Abrechnungsnachweis hoch." },
        { status: 400 }
      );
    }

    if (abrechnungsnachweis.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          message:
            "Die hochgeladene Datei ist zu groß. Bitte laden Sie eine Datei mit maximal 10 MB hoch.",
        },
        { status: 400 }
      );
    }

    const fileName = sanitizeFileName(abrechnungsnachweis.name);
    const fileHasAllowedExtension = hasAllowedExtension(fileName);
    const fileHasAllowedMimeType = ALLOWED_MIME_TYPES.has(
      abrechnungsnachweis.type
    );

    if (!fileHasAllowedExtension && !fileHasAllowedMimeType) {
      return NextResponse.json(
        {
          message:
            "Bitte laden Sie nur PDF, JPG, JPEG, PNG oder WEBP Dateien hoch.",
        },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const gutscheinReceiver =
      process.env.GUTSCHEIN_RECEIVER || "info@stromdealz.de";

    const logoUrl =
      "https://stromdealz.de/images/logo/stromdealz_logo.png";

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
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

    const fileBuffer = Buffer.from(
      await abrechnungsnachweis.arrayBuffer()
    );

    const safeAktionscode = escapeHtml(aktionscode);
    const safeAnrede = escapeHtml(anrede);
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeAuftragsnummer = escapeHtml(auftragsnummer);
    const safeFileName = escapeHtml(fileName);
    const safeGutscheinTitel = escapeHtml(aktion.titel);
    const safeGutscheinwert = escapeHtml(String(aktion.gutscheinwert));
    const safeFileSize = escapeHtml(formatBytes(abrechnungsnachweis.size));

    await transporter.sendMail({
      from: `"StromDealz Gutscheinanforderung" <${smtpUser}>`,
      to: gutscheinReceiver,
      replyTo: email,
      subject: `Neue Gutscheinanforderung: ${aktion.gutscheinwert} € Gutschein – ${name}`,
      attachments: [
        {
          filename: fileName,
          content: fileBuffer,
          contentType: abrechnungsnachweis.type || undefined,
        },
      ],
      html: `
        <div style="margin:0;padding:0;background-color:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
          <div style="max-width:720px;margin:0 auto;padding:32px 16px;">
            <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(15,23,42,0.08);">
              <div style="background:linear-gradient(135deg,#f97316 0%,#ea580c 100%);padding:30px 32px;">
                <img
                  src="${logoUrl}"
                  alt="StromDealz"
                  style="height:42px;margin-bottom:14px;display:block;"
                />

                <div style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#ffedd5;font-weight:700;">
                  StromDealz Gutscheinaktion
                </div>

                <h1 style="margin:10px 0 0;font-size:28px;line-height:1.25;color:#ffffff;">
                  Neue Gutscheinanforderung
                </h1>

                <p style="margin:14px 0 0;font-size:15px;line-height:1.7;color:#fff7ed;">
                  Ein Kunde hat über die geschützte QR Code Gutscheinseite eine Anfrage eingereicht.
                </p>
              </div>

              <div style="padding:32px;">
                <div style="margin:0 0 26px;padding:20px;background:#fff7ed;border:1px solid #fed7aa;border-radius:16px;">
                  <div style="font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#c2410c;margin-bottom:8px;">
                    Angeforderte Gutscheinaktion
                  </div>

                  <div style="font-size:22px;line-height:1.4;color:#7c2d12;font-weight:800;">
                    ${safeGutscheinTitel}
                  </div>

                  <div style="margin-top:6px;font-size:15px;line-height:1.6;color:#9a3412;">
                    Hinterlegter Gutscheinwert: <strong>${safeGutscheinwert} €</strong>
                  </div>
                </div>

                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;width:220px;font-weight:700;color:#0f172a;">Aktionscode</td>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;color:#334155;">${safeAktionscode}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;width:220px;font-weight:700;color:#0f172a;">Anrede</td>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;color:#334155;">${safeAnrede}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;width:220px;font-weight:700;color:#0f172a;">Vollständiger Name</td>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;color:#334155;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;width:220px;font-weight:700;color:#0f172a;">E-Mail</td>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;color:#334155;">${safeEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;width:220px;font-weight:700;color:#0f172a;">Auftragsnummer</td>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;color:#334155;">${safeAuftragsnummer}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;width:220px;font-weight:700;color:#0f172a;">Abrechnungsnachweis</td>
                    <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;color:#334155;">
                      ${safeFileName} (${safeFileSize})
                    </td>
                  </tr>
                </table>

                <div style="margin-top:28px;">
                  <div style="font-size:15px;font-weight:700;color:#0f172a;margin-bottom:12px;">
                    Bestätigungen des Kunden
                  </div>

                  <div style="display:grid;gap:12px;">
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:16px;color:#334155;font-size:14px;line-height:1.7;">
                      ✅ Der Kunde bestätigt, dass der neue Versorger bereits mindestens einmal abgerechnet hat.
                    </div>

                    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:16px;color:#334155;font-size:14px;line-height:1.7;">
                      ✅ Die Teilnahmebedingungen zur Gutschein und Prämienaktionen in den AGB wurden akzeptiert.
                    </div>

                    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:16px;color:#334155;font-size:14px;line-height:1.7;">
                      ✅ Die Datenschutzerklärung wurde zur Kenntnis genommen.
                    </div>
                  </div>
                </div>

                <div style="margin-top:28px;padding:18px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:16px;color:#1e3a8a;font-size:14px;line-height:1.7;">
                  <strong>Prüfung erforderlich:</strong> Bitte kontrollieren Sie, ob die Gutscheinbedingungen tatsächlich erfüllt sind. Erst danach wird der Gutscheincode manuell per E-Mail an den Kunden versendet.
                </div>

                <div style="margin-top:20px;padding:16px 18px;background:#fff7ed;border:1px solid #fed7aa;border-radius:16px;color:#9a3412;font-size:14px;line-height:1.6;">
                  Hinweis: Durch die Reply To Funktion können Sie direkt auf diese E-Mail antworten und erreichen automatisch den Kunden.
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Gutscheinanforderung erfolgreich übermittelt.",
    });
  } catch (error) {
    console.error("Fehler beim Versenden der Gutscheinanforderung:", error);

    return NextResponse.json(
      {
        message:
          "Beim Übermitteln der Gutscheinanforderung ist ein Fehler aufgetreten.",
      },
      { status: 500 }
    );
  }
}