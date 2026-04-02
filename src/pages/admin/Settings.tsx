import { useState } from "react";
import { motion } from "framer-motion";
import { Save, KeyRound, RotateCcw, GraduationCap, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default function AdminSettings() {
  const { toast } = useToast();
  const [defaultStudentPassword, setDefaultStudentPassword] = useState("EduLedger2025");
  const [forcePasswordChange, setForcePasswordChange] = useState(true);
  const [downloadEnabled, setDownloadEnabled] = useState(() => {
    return localStorage.getItem("adminDownloadEnabled") !== "false";
  });

  // Reset dialog
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetMatricule, setResetMatricule] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");

  const handleToggleDownload = (checked: boolean) => {
    setDownloadEnabled(checked);
    localStorage.setItem("adminDownloadEnabled", String(checked));
    toast({
      title: checked ? "Téléchargement activé" : "Téléchargement désactivé",
      description: checked
        ? "Les étudiants peuvent télécharger leur relevé de notes."
        : "Les étudiants ne peuvent plus télécharger leur relevé de notes.",
    });
  };

  const handleSave = () => {
    localStorage.setItem("adminDownloadEnabled", String(downloadEnabled));
    toast({ title: "Paramètres enregistrés", description: "Les paramètres ont été mis à jour." });
  };

  const handleResetPassword = () => {
    if (!resetMatricule) {
      toast({ title: "Erreur", description: "Veuillez entrer le matricule de l'étudiant.", variant: "destructive" });
      return;
    }
    toast({
      title: "Mot de passe réinitialisé",
      description: `Le mot de passe de ${resetMatricule} a été réinitialisé à "${resetNewPassword || defaultStudentPassword}".`,
    });
    setResetDialogOpen(false);
    setResetMatricule("");
    setResetNewPassword("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground text-sm mt-1">Configuration des mots de passe étudiants de votre université</p>
      </motion.div>

      {/* Student Default Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Mot de passe étudiant par défaut</CardTitle>
              <CardDescription>Ce mot de passe sera attribué aux nouveaux étudiants de votre université</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-sm">
            <Label>Mot de passe par défaut</Label>
            <Input value={defaultStudentPassword} onChange={(e) => setDefaultStudentPassword(e.target.value)} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Forcer le changement au premier login</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Les étudiants devront changer leur mot de passe à la première connexion</p>
            </div>
            <Switch checked={forcePasswordChange} onCheckedChange={setForcePasswordChange} />
          </div>
        </CardContent>
      </Card>

      {/* Reset Student Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <RotateCcw className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-base">Réinitialiser le mot de passe d'un étudiant</CardTitle>
              <CardDescription>Réinitialiser le mot de passe d'un étudiant par son matricule</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><RotateCcw className="h-4 w-4 mr-2" />Réinitialiser un mot de passe</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Réinitialiser le mot de passe étudiant</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Matricule de l'étudiant</Label>
                  <Input value={resetMatricule} onChange={(e) => setResetMatricule(e.target.value)} placeholder="ETU-2025-0001" />
                </div>
                <div className="space-y-2">
                  <Label>Nouveau mot de passe</Label>
                  <Input value={resetNewPassword} onChange={(e) => setResetNewPassword(e.target.value)} placeholder="Laisser vide pour le mot de passe par défaut" />
                  <p className="text-xs text-muted-foreground">Par défaut : {defaultStudentPassword}</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setResetDialogOpen(false)}>Annuler</Button>
                <Button variant="destructive" onClick={handleResetPassword}>Réinitialiser</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" /> Enregistrer
        </Button>
      </div>
    </div>
  );
}
