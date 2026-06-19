import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type NachreichenPayload = {
  fullName?: string;
  orderNumber?: string;
  category?: string;

  electricityMeterNumber?: string;
  electricityMaloId?: string;

  gasMeterNumber?: string;
  gasMaloId?: string;

  notes?: string;
  website?: string;
};

function cleanValue(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:12px 14px;border-bottom:1px solid #e5e7eb;background:#f8fafc;font-weight:700;color:#1f2937;width:210px;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:12px 14px;border-bottom:1px solid #e5e7eb;color:#111827;">
        ${escapeHtml(value || "Nicht angegeben")}
      </td>
    </tr>
  `;
}

function buildSection(title: string, color: string, rows: string) {
  return `
    <div style="margin-top:22px;border:1px solid ${color};border-radius:14px;overflow:hidden;">
      <div style="background:${color};padding:14px 16px;">
        <h2 style="margin:0;color:#ffffff;font-size:17px;line-height:1.35;">
          ${escapeHtml(title)}
        </h2>
      </div>

      <table style="width:100%;border-collapse:collapse;">
        ${rows}
      </table>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as NachreichenPayload;

    const fullName = cleanValue(body.fullName);
    const orderNumber = cleanValue(body.orderNumber);
    const category = cleanValue(body.category);

    const electricityMeterNumber = cleanValue(body.electricityMeterNumber);
    const electricityMaloId = cleanValue(body.electricityMaloId);

    const gasMeterNumber = cleanValue(body.gasMeterNumber);
    const gasMaloId = cleanValue(body.gasMaloId);

    const notes = cleanValue(body.notes);
    const website = cleanValue(body.website);

    if (website) {
      return NextResponse.json({ success: true });
    }

    const allowedCategories = ["Stromvertrag", "Gasvertrag", "Beides"];

    if (!fullName) {
      return NextResponse.json(
        { success: false, message: "Bitte den vollständigen Namen eintragen." },
        { status: 400 }
      );
    }

    if (!category || !allowedCategories.includes(category)) {
      return NextResponse.json(
        { success: false, message: "Bitte auswählen, worum es geht." },
        { status: 400 }
      );
    }

    const smtpHost = process.env.ZAEHLER_SMTP_HOST || process.env.SMTP_HOST;
    const smtpPort = Number(process.env.ZAEHLER_SMTP_PORT || process.env.SMTP_PORT || "465");
    const smtpUser = process.env.ZAEHLER_SMTP_USER || process.env.SMTP_USER;
    const smtpPass = process.env.ZAEHLER_SMTP_PASS || process.env.SMTP_PASS;
    const smtpFrom =
      process.env.ZAEHLER_SMTP_FROM ||
      process.env.SMTP_FROM ||
      "StromDealz <zaehlernummer@stromdealz.de>";
    const smtpSecure = (process.env.ZAEHLER_SMTP_SECURE || process.env.SMTP_SECURE) !== "false";
    const mailTo = process.env.ZAEHLER_MAIL_TO || "zaehlernummer@stromdealz.de";

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error("SMTP Konfiguration fehlt.");
      return NextResponse.json(
        { success: false, message: "Der Versand ist aktuell nicht eingerichtet." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const submittedAt = new Intl.DateTimeFormat("de-DE", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Europe/Berlin"
    }).format(new Date());

    const subject = `Neue Nachreichung von ${fullName}`;

    const generalSection = buildSection(
      "Allgemeine Zuordnung",
      "#1f2f46",
      [
        buildRow("Eingang", submittedAt),
        buildRow("Vollständiger Name", fullName),
        buildRow("Auftragsnummer", orderNumber),
        buildRow("Einordnung", category)
      ].join("")
    );

    const electricitySection =
      category === "Stromvertrag" || category === "Beides"
        ? buildSection(
            "Angaben zum Stromvertrag",
            "#2563eb",
            [
              buildRow("Zählernummer Strom", electricityMeterNumber),
              buildRow("MaLo ID Strom", electricityMaloId)
            ].join("")
          )
        : "";

    const gasSection =
      category === "Gasvertrag" || category === "Beides"
        ? buildSection(
            "Angaben zum Gasvertrag",
            "#f28c28",
            [
              buildRow("Zählernummer Gas", gasMeterNumber),
              buildRow("MaLo ID Gas", gasMaloId)
            ].join("")
          )
        : "";

    const notesSection = buildSection(
      "Sonstiges",
      "#64748b",
      buildRow("Hinweis des Kunden", notes)
    );

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;padding:24px;">
        <div style="max-width:760px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;">
          <div style="background:#1f2f46;padding:22px 26px;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;line-height:1.35;">
              Neue Daten wurden über StromDealz nachgereicht
            </h1>
            <p style="margin:8px 0 0;color:#dbeafe;font-size:14px;">
              Formularseite: /nachreichen
            </p>
          </div>

          <div style="padding:24px 26px;">
            ${generalSection}
            ${electricitySection}
            ${gasSection}
            ${notesSection}

            <p style="margin:22px 0 0;color:#6b7280;font-size:13px;line-height:1.6;">
              Diese E-Mail wurde automatisch über das StromDealz Nachreichen Formular erzeugt.
            </p>
          </div>
        </div>
      </div>
    `;

    const textParts = [
      "Neue Daten wurden über StromDealz nachgereicht",
      "",
      "Allgemeine Zuordnung",
      `Eingang: ${submittedAt}`,
      `Vollständiger Name: ${fullName}`,
      `Auftragsnummer: ${orderNumber || "Nicht angegeben"}`,
      `Einordnung: ${category}`,
      ""
    ];

    if (category === "Stromvertrag" || category === "Beides") {
      textParts.push(
        "Angaben zum Stromvertrag",
        `Zählernummer Strom: ${electricityMeterNumber || "Nicht angegeben"}`,
        `MaLo ID Strom: ${electricityMaloId || "Nicht angegeben"}`,
        ""
      );
    }

    if (category === "Gasvertrag" || category === "Beides") {
      textParts.push(
        "Angaben zum Gasvertrag",
        `Zählernummer Gas: ${gasMeterNumber || "Nicht angegeben"}`,
        `MaLo ID Gas: ${gasMaloId || "Nicht angegeben"}`,
        ""
      );
    }

    textParts.push("Sonstiges", notes || "Nicht angegeben");

    const text = textParts.join("\n");

    await transporter.sendMail({
      from: smtpFrom,
      to: mailTo,
      subject,
      text,
      html
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler beim Nachreichen Formular:", error);

    return NextResponse.json(
      { success: false, message: "Die Daten konnten nicht gesendet werden." },
      { status: 500 }
    );
  }
}