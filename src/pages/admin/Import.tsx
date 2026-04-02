import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, Upload, CheckCircle2, AlertCircle, X, FileUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface PreviewRow {
  nom: string;
  postnom: string;
  prenom: string;
  promotion: string;
  matiere: string;
  note: number;
  type: string;
}

const mockPreview: PreviewRow[] = [
  { nom: "Mukendi", postnom: "Kabila", prenom: "Jean", promotion: "L1 Info", matiere: "Algorithmique", note: 16, type: "Examen" },
  { nom: "Tshimanga", postnom: "Mwamba", prenom: "Marie", promotion: "L1 Info", matiere: "Algorithmique", note: 14, type: "Examen" },
  { nom: "Kalala", postnom: "Ngoy", prenom: "Pierre", promotion: "L1 Info", matiere: "Algorithmique", note: 8, type: "Examen" },
  { nom: "Ilunga", postnom: "Kasongo", prenom: "Sophie", promotion: "L1 Info", matiere: "Algorithmique", note: 15, type: "Examen" },
  { nom: "Kabongo", postnom: "Mutombo", prenom: "David", promotion: "L1 Info", matiere: "Algorithmique", note: 12, type: "Examen" },
];

type ImportStep = "upload" | "preview" | "importing" | "done";

export default function Import() {
  const [step, setStep] = useState<ImportStep>("upload");
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast({ title: "Format invalide", description: "Seuls les fichiers Excel (.xlsx, .xls) sont acceptés", variant: "destructive" });
      return;
    }
    setFileName(file.name);
    setStep("preview");
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleImport = () => {
    setStep("importing");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setStep("done"); return 100; }
        return p + 20;
      });
    }, 500);
  };

  const reset = () => { setStep("upload"); setFileName(""); setProgress(0); };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Import Excel</h1>
        <p className="text-muted-foreground text-sm mt-1">Importez les étudiants et notes depuis un fichier Excel</p>
      </motion.div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 text-sm">
        {["Téléverser", "Prévisualiser", "Importer", "Terminé"].map((label, i) => {
          const stepIndex = ["upload", "preview", "importing", "done"].indexOf(step);
          return (
            <div key={label} className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium ${i <= stepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {i + 1}
              </div>
              <span className={i <= stepIndex ? "text-foreground font-medium" : "text-muted-foreground"}>{label}</span>
              {i < 3 && <div className={`w-8 h-0.5 ${i < stepIndex ? "bg-primary" : "bg-border"}`} />}
            </div>
          );
        })}
      </div>

      {step === "upload" && (
        <Card>
          <CardContent className="p-8">
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-border"}`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <FileUp className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium">Glissez-déposez votre fichier Excel ici</p>
                  <p className="text-sm text-muted-foreground mt-1">ou cliquez pour sélectionner</p>
                </div>
                <label>
                  <input type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  <Button variant="outline" asChild><span>Parcourir</span></Button>
                </label>
                <p className="text-xs text-muted-foreground">Formats acceptés : .xlsx, .xls</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "preview" && (
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Prévisualisation — {fileName}
                </CardTitle>
                <CardDescription>{mockPreview.length} lignes détectées</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={reset}>Annuler</Button>
                <Button onClick={handleImport}><Upload className="h-4 w-4 mr-2" />Importer</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Post-nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Promotion</TableHead>
                  <TableHead>Matière</TableHead>
                  <TableHead className="text-center">Note</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPreview.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.nom}</TableCell>
                    <TableCell>{r.postnom}</TableCell>
                    <TableCell>{r.prenom}</TableCell>
                    <TableCell><Badge variant="secondary">{r.promotion}</Badge></TableCell>
                    <TableCell>{r.matiere}</TableCell>
                    <TableCell className="text-center font-bold">{r.note}/20</TableCell>
                    <TableCell><Badge variant="outline">{r.type}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "importing" && (
        <Card>
          <CardContent className="p-12 text-center space-y-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto animate-pulse">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="text-foreground font-medium">Import en cours...</p>
              <p className="text-sm text-muted-foreground mt-1">{progress}% terminé</p>
            </div>
            <Progress value={progress} className="max-w-md mx-auto h-3" />
          </CardContent>
        </Card>
      )}

      {step === "done" && (
        <Card>
          <CardContent className="p-12 text-center space-y-6">
            <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <div>
              <p className="text-foreground font-medium text-lg">Import réussi !</p>
              <p className="text-sm text-muted-foreground mt-1">{mockPreview.length} lignes importées avec succès</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={reset}>Nouvel import</Button>
              <Button>Voir les résultats</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
