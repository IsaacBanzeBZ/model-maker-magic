import { useState } from "react";
import { motion } from "framer-motion";
import { Save, RotateCcw, GraduationCap, Download, Building, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const promotions = ["L1 Informatique", "L2 Informatique", "L3 Informatique"];

export default function AdminSettings() {
  const { toast } = useToast();
  const [defaultStudentPassword, setDefaultStudentPassword] = useState("EduLedger2025");
  const [forcePasswordChange, setForcePasswordChange] = useState(true);

  // Download control: 3 levels
  const [universityDownload, setUniversityDownload] = useState(() => {
    return localStorage.getItem("dl_university") !== "false";
  });
  const [promotionDownloads, setPromotionDownloads] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem("dl_promotions") || "{}");
    } catch { return {}; }
  });

  // Reset dialog
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetMatricule, setResetMatricule] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");

  const handleUniversityToggle = (checked: boolean) => {
    setUniversityDownload(checked);
    localStorage.setItem("dl_university", String(checked));
    toast({
      title: checked ? "Téléchargement activé (université)" : "Téléchargement désactivé (université)",
      description: checked
        ? "Tous les étudiants peuvent télécharger leur relevé."
        : "Le téléchargement est bloqué pour toute l'université.",
    });
  };

  const handlePromotionToggle = (promo: string, checked: boolean) => {
    const updated = { ...promotionDownloads, [promo]: checked };
    setPromotionDownloads(updated);
    localStorage.setItem("dl_promotions", JSON.stringify(updated));
    toast({
      title: checked ? `Téléchargement activé — ${promo}` : `Téléchargement désactivé — ${promo}`,
    });
  };

  const isPromoEnabled = (promo: string) => {
    if (!universityDownload) return false;
    return promotionDownloads[promo] !== false;
  };

  const handleSave = () => {
    localStorage.setItem("dl_university", String(universityDownload));
    localStorage.setItem("dl_promotions", JSON.stringify(promotionDownloads));
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
        <p className="text-muted-foreground text-sm mt-1">Configuration des mots de passe et téléchargements</p>
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
              <CardDescription>Ce mot de passe sera attribué aux nouveaux étudiants</CardDescription>
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

      {/* Download Control — University Level */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Building className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-base">Téléchargement — Niveau université</CardTitle>
              <CardDescription>Bloquer ou autoriser le téléchargement pour toute l'université</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Autoriser le téléchargement (global)</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {universityDownload
                  ? "Le téléchargement est autorisé au niveau de l'université"
                  : "Le téléchargement est bloqué pour TOUS les étudiants"}
              </p>
            </div>
            <Switch checked={universityDownload} onCheckedChange={handleUniversityToggle} />
          </div>
          {!universityDownload && (
            <Badge variant="destructive" className="mt-3">Tout téléchargement bloqué</Badge>
          )}
        </CardContent>
      </Card>

      {/* Download Control — Promotion Level */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-accent/20 flex items-center justify-center">
              <Users className="h-4 w-4 text-accent-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">Téléchargement — Par promotion</CardTitle>
              <CardDescription>Activer ou désactiver le téléchargement pour chaque promotion</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {promotions.map((promo) => {
            const enabled = isPromoEnabled(promo);
            return (
              <div key={promo} className="flex items-center justify-between py-2 px-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{promo}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {!universityDownload ? "Bloqué (université)" : enabled ? "Autorisé" : "Bloqué"}
                  </span>
                </div>
                <Switch
                  checked={enabled}
                  disabled={!universityDownload}
                  onCheckedChange={(checked) => handlePromotionToggle(promo, checked)}
                />
              </div>
            );
          })}
          {!universityDownload && (
            <p className="text-xs text-muted-foreground italic">Activez d'abord le téléchargement au niveau université.</p>
          )}
        </CardContent>
      </Card>

      {/* Per-Student Download Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Download className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Téléchargement — Par étudiant</CardTitle>
              <CardDescription>Gérez le téléchargement individuellement depuis la page Étudiants</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Pour bloquer ou débloquer le téléchargement d'un étudiant spécifique, 
            utilisez le menu d'actions (⋯) sur chaque étudiant dans la page <strong>Gestion des étudiants</strong>.
          </p>
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
