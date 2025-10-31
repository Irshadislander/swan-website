import jsPDF from "jspdf";
import type { DonationRecord } from "@/api/donations";

export async function genReceiptPDF(donation: DonationRecord): Promise<Blob> {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("SWAN Donation Receipt", 20, 30);

  doc.setFontSize(12);
  doc.text(`Receipt ID: ${donation.id}`, 20, 45);
  doc.text(`Donor: ${donation.name}`, 20, 55);
  doc.text(`Email: ${donation.email}`, 20, 65);
  doc.text(`Program: ${donation.program}`, 20, 75);
  doc.text(`Frequency: ${donation.frequency}`, 20, 85);
  doc.text(`Amount: $${donation.amount.toLocaleString()}`, 20, 95);
  doc.text(`Date: ${new Date(donation.ts).toLocaleString()}`, 20, 105);

  doc.setFontSize(10);
  doc.text(
    "SWAN is a registered nonprofit. No goods or services were provided in exchange for this donation.",
    20,
    125,
    { maxWidth: 170 }
  );

  const blob = doc.output("blob");
  return blob;
}
