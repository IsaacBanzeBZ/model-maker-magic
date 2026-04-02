import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateTranscriptPDF } from "@/lib/generate-transcript";
import { toast } from "@/hooks/use-toast";

const subjects = [
  { id: 1, name: "Algorithmique", tp: 15, interro: 14, examen: 16, coefficient: 4 },
  { id: 2, name: "Base de données", tp: 13, interro: 12, examen: 14, coefficient: 3 },
  { id: 3, name: "Réseaux informatiques", tp: 11, interro: 13, examen: 12, coefficient: 3 },
  { id: 4, name: "Mathématiques discrètes", tp: null, interro: 16, examen: 15, coefficient: 4 },
  { id: 5, name: "Anglais technique", tp: 17, interro: 18, examen: 17, coefficient: 2 },
  { id: 6, name: "Systèmes d'exploitation", tp: 14, interro: 13, examen: 13, coefficient: 3 },
  { id: 7, name: "Génie logiciel", tp: 12, interro: 11, examen: 14, coefficient: 3 },
  { id: 8, name: "Physique appliquée", tp: 10, interro: 9, examen: 11, coefficient: 2 },
];

function computeAvg(s: typeof subjects[0]) {
  const grades = [s.tp, s.interro, s.examen].filter((g): g is number => g !== null);
  if (grades.length === 0) return null;
  return grades.reduce((a, b) => a + b, 0) / grades.length;
}

export default function StudentResults() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = subjects.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchSearch;
    const avg = computeAvg(s);
    if (filter === "passed") return matchSearch && avg !== null && avg >= 10;
    if (filter === "failed") return matchSearch && avg !== null && avg < 10;
    return matchSearch;
  });

  const generalAvg = subjects.reduce((sum, s) => {
    const avg = computeAvg(s);
    return sum + (avg || 0) * s.coefficient;
  }, 0) / subjects.reduce((sum, s) => sum + s.coefficient, 0);

  // Check 3-level download permission: university > promotion > student
  const checkDownloadEnabled = () => {
    // Level 1: University-wide
    if (localStorage.getItem("dl_university") === "false") return false;
    // Level 2: Promotion-level
    try {
      const promoSettings = JSON.parse(localStorage.getItem("dl_promotions") || "{}");
      const studentPromo = "L2 Informatique"; // Mock: would come from auth context
      if (promoSettings[studentPromo] === false) return false;
    } catch {}
    // Level 3: Per-student
    try {
      const studentSettings = JSON.parse(localStorage.getItem("dl_students") || "{}");
      const studentMatricule = "ETU-2025-0042"; // Mock: would come from auth context
      if (studentSettings[studentMatricule] === true) return false;
    } catch {}
    return true;
  };

  const isDownloadEnabled = checkDownloadEnabled();

  const handleDownloadPDF = () => {
    if (!isDownloadEnabled) {
      toast({ title: "Téléchargement bloqué", description: "L'administrateur a désactivé le téléchargement des relevés de notes.", variant: "destructive" });
      return;
    }
    generateTranscriptPDF({
      studentName: "Jean Mukendi",
      matricule: "ETU-2025-0042",
      promotion: "L2 Informatique",
      university: "Université de Kinshasa",
      academicYear: "2025-2026",
      subjects: subjects.map((s) => ({
        name: s.name,
        tp: s.tp,
        interro: s.interro,
        examen: s.examen,
        coefficient: s.coefficient,
        avg: computeAvg(s),
      })),
      generalAverage: generalAvg,
      status: generalAvg >= 10 ? "Admis" : "Ajourné",
    });
    toast({ title: "PDF téléchargé", description: "Votre relevé de notes a été généré." });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mes résultats</h1>
          <p className="text-muted-foreground text-sm mt-1">Consultation de vos notes par matière</p>
        </div>
        <Button onClick={handleDownloadPDF} className="gap-2" disabled={!isDownloadEnabled} variant={isDownloadEnabled ? "default" : "secondary"}>
          <Download className="h-4 w-4" />
          {isDownloadEnabled ? "Télécharger le relevé PDF" : "Téléchargement désactivé"}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Moyenne générale</p>
              <p className="text-2xl font-bold text-foreground">{generalAvg.toFixed(1)}/20</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Statut</p>
            <Badge className="mt-2 bg-accent text-accent-foreground">Admis</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Matières</p>
            <p className="text-2xl font-bold text-foreground mt-1">{subjects.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base">Détail des notes</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full sm:w-[200px]"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="passed">Réussies</SelectItem>
                  <SelectItem value="failed">Échouées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matière</TableHead>
                <TableHead className="text-center">TP</TableHead>
                <TableHead className="text-center">Interro</TableHead>
                <TableHead className="text-center">Examen</TableHead>
                <TableHead className="text-center">Coeff.</TableHead>
                <TableHead className="text-center">Moyenne</TableHead>
                <TableHead className="text-center">Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => {
                const avg = computeAvg(s);
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-center">{s.tp ?? "—"}</TableCell>
                    <TableCell className="text-center">{s.interro ?? "—"}</TableCell>
                    <TableCell className="text-center">{s.examen ?? "—"}</TableCell>
                    <TableCell className="text-center">{s.coefficient}</TableCell>
                    <TableCell className="text-center font-bold">
                      {avg !== null ? avg.toFixed(1) : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {avg !== null ? (
                        <Badge variant={avg >= 10 ? "default" : "destructive"} className={avg >= 10 ? "bg-accent text-accent-foreground" : ""}>
                          {avg >= 10 ? "Validé" : "Échec"}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">En attente</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
