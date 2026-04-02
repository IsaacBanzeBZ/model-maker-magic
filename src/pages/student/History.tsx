import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, BookOpen, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateTranscriptPDF } from "@/lib/generate-transcript";
import { toast } from "@/hooks/use-toast";

const academicYears = [
  {
    year: "2025-2026",
    promotion: "L2 Informatique",
    average: 14.2,
    status: "En cours",
    subjects: [
      { name: "Algorithmique", avg: 16, credits: 4 },
      { name: "Base de données", avg: 14, credits: 3 },
      { name: "Réseaux", avg: 12, credits: 3 },
      { name: "Mathématiques", avg: 15, credits: 4 },
    ],
  },
  {
    year: "2024-2025",
    promotion: "L1 Informatique",
    average: 13.5,
    status: "Admis",
    subjects: [
      { name: "Introduction à l'informatique", avg: 15, credits: 4 },
      { name: "Mathématiques I", avg: 13, credits: 4 },
      { name: "Physique", avg: 11, credits: 3 },
      { name: "Anglais I", avg: 16, credits: 2 },
      { name: "Logique", avg: 12, credits: 3 },
    ],
  },
];

export default function StudentHistory() {
  const [selectedYear, setSelectedYear] = useState(academicYears[0].year);
  const yearData = academicYears.find((y) => y.year === selectedYear)!;

  const handleDownloadPDF = () => {
    generateTranscriptPDF({
      studentName: "Jean Mukendi",
      matricule: "ETU-2025-0042",
      promotion: yearData.promotion,
      university: "Université de Kinshasa",
      academicYear: yearData.year,
      subjects: yearData.subjects.map((s) => ({
        name: s.name,
        avg: s.avg,
        credits: s.credits,
      })),
      generalAverage: yearData.average,
      status: yearData.status === "Admis" ? "Admis" : yearData.status === "En cours" ? "En cours" : "Ajourné",
    });
    toast({ title: "PDF téléchargé", description: `Relevé ${yearData.year} généré.` });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Historique</h1>
          <p className="text-muted-foreground text-sm mt-1">Résultats par année académique</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadPDF} className="gap-2">
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {academicYears.map((y) => (
              <SelectItem key={y.year} value={y.year}>{y.year}</SelectItem>
            ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Promotion</p>
            <p className="text-lg font-bold text-foreground mt-1">{yearData.promotion}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Moyenne</p>
            <p className="text-2xl font-bold text-foreground mt-1">{yearData.average}/20</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Statut</p>
            <Badge className={`mt-2 ${yearData.status === "Admis" || yearData.status === "En cours" ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"}`}>
              {yearData.status}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Résultats — {yearData.year}
          </CardTitle>
          <CardDescription>{yearData.subjects.length} matières</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matière</TableHead>
                <TableHead className="text-center">Moyenne</TableHead>
                <TableHead className="text-center">Crédits</TableHead>
                <TableHead className="text-center">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yearData.subjects.map((s) => (
                <TableRow key={s.name}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-center font-bold">{s.avg}/20</TableCell>
                  <TableCell className="text-center">{s.credits}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={s.avg >= 10 ? "default" : "destructive"} className={s.avg >= 10 ? "bg-accent text-accent-foreground" : ""}>
                      {s.avg >= 10 ? "Validé" : "Échec"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
