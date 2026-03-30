import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface SubjectGrade {
  name: string;
  tp?: number | null;
  interro?: number | null;
  examen?: number | null;
  coefficient?: number;
  avg: number | null;
  credits?: number;
}

interface TranscriptData {
  studentName: string;
  matricule: string;
  promotion: string;
  university: string;
  academicYear: string;
  subjects: SubjectGrade[];
  generalAverage: number;
  status: string;
}

export function generateTranscriptPDF(data: TranscriptData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("RELEVÉ DE NOTES", pageWidth / 2, 25, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(data.university, pageWidth / 2, 33, { align: "center" });

  // Line
  doc.setDrawColor(34, 139, 87);
  doc.setLineWidth(0.8);
  doc.line(20, 38, pageWidth - 20, 38);

  // Student info
  const infoY = 48;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Étudiant:", 20, infoY);
  doc.setFont("helvetica", "normal");
  doc.text(data.studentName, 55, infoY);

  doc.setFont("helvetica", "bold");
  doc.text("Matricule:", 20, infoY + 7);
  doc.setFont("helvetica", "normal");
  doc.text(data.matricule, 55, infoY + 7);

  doc.setFont("helvetica", "bold");
  doc.text("Promotion:", 110, infoY);
  doc.setFont("helvetica", "normal");
  doc.text(data.promotion, 145, infoY);

  doc.setFont("helvetica", "bold");
  doc.text("Année:", 110, infoY + 7);
  doc.setFont("helvetica", "normal");
  doc.text(data.academicYear, 145, infoY + 7);

  // Table
  const hasDetail = data.subjects.some((s) => s.tp !== undefined);

  const head = hasDetail
    ? [["Matière", "TP", "Interro", "Examen", "Coeff.", "Moyenne", "Statut"]]
    : [["Matière", "Moyenne", "Crédits", "Statut"]];

  const body = data.subjects.map((s) => {
    const avg = s.avg !== null ? s.avg.toFixed(1) : "—";
    const status = s.avg !== null ? (s.avg >= 10 ? "Validé" : "Échec") : "—";
    if (hasDetail) {
      return [
        s.name,
        s.tp != null ? String(s.tp) : "—",
        s.interro != null ? String(s.interro) : "—",
        s.examen != null ? String(s.examen) : "—",
        String(s.coefficient ?? "—"),
        avg,
        status,
      ];
    }
    return [s.name, avg, String(s.credits ?? "—"), status];
  });

  autoTable(doc, {
    startY: infoY + 16,
    head,
    body,
    theme: "grid",
    headStyles: {
      fillColor: [34, 139, 87],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 20, right: 20 },
  });

  // Summary after table
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12;

  doc.setDrawColor(34, 139, 87);
  doc.setLineWidth(0.5);
  doc.line(20, finalY - 4, pageWidth - 20, finalY - 4);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Moyenne générale: ${data.generalAverage.toFixed(1)}/20`, 20, finalY + 4);
  doc.text(`Décision: ${data.status}`, pageWidth - 20, finalY + 4, { align: "right" });

  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text(
    `Document généré le ${new Date().toLocaleDateString("fr-FR")} — EduLedger`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: "center" }
  );

  doc.save(`releve_${data.matricule}_${data.academicYear}.pdf`);
}
