import { useState } from "react";
import { motion } from "framer-motion";
import { Save, KeyRound, Shield, Bell, Users, GraduationCap, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SuperAdminSettings() {
  const { toast } = useToast();
  const [defaultAdminPassword, setDefaultAdminPassword] = useState("Admin@2025");
  const [defaultStudentPassword, setDefaultStudentPassword] = useState("EduLedger2025");
  const [minPasswordLength, setMinPasswordLength] = useState("8");
  const [forcePasswordChange, setForcePasswordChange] = useState(true);
  const [forceAdminPasswordChange, setForceAdminPasswordChange] = useState(true);
  const [enableAuditLogs, setEnableAuditLogs] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");

  // Reset password dialog
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState("");
  const [resetRole, setResetRole] = useState<"admin" | "student">("admin");
  const [resetNewPassword, setResetNewPassword] = useState("");

  const handleSave = () => {
    toast({ title: "Paramètres enregistrés", description: "Les paramètres globaux ont été mis à jour avec succès." });
  };

  const handleResetPassword = () => {
    if (!resetTarget || !resetNewPassword) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs.", variant: "destructive" });
      return;
    }
    toast({
      title: "Mot de passe réinitialisé",
      description: `Le mot de passe de ${resetTarget} (${resetRole === "admin" ? "Admin" : "Étudiant"}) a été réinitialisé.`,
    });
    setResetDialogOpen(false);
    setResetTarget("");
    setResetNewPassword("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Paramètres système</h1>
        <p className="text-muted-foreground text-sm mt-1">Contrôle total de la plateforme EduLedger — mots de passe, sécurité et utilisateurs</p>
      </motion.div>

      {/* Admin Password Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Mot de passe Admin par défaut</CardTitle>
              <CardDescription>Mot de passe attribué aux nouveaux administrateurs d'universités</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mot de passe par défaut (Admin)</Label>
              <Input value={defaultAdminPassword} onChange={(e) => setDefaultAdminPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Longueur minimum</Label>
              <Input type="number" value={minPasswordLength} onChange={(e) => setMinPasswordLength(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Forcer le changement au premier login</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Les admins devront changer leur mot de passe à la première connexion</p>
            </div>
            <Switch checked={forceAdminPasswordChange} onCheckedChange={setForceAdminPasswordChange} />
          </div>
        </CardContent>
      </Card>

      {/* Student Password Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Mot de passe Étudiant par défaut</CardTitle>
              <CardDescription>Mot de passe global attribué aux nouveaux étudiants (peut être surchargé par l'admin université)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-sm">
            <Label>Mot de passe par défaut (Étudiant)</Label>
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

      {/* Reset Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <RotateCcw className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-base">Réinitialisation de mot de passe</CardTitle>
              <CardDescription>Réinitialiser le mot de passe de n'importe quel admin ou étudiant</CardDescription>
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
                <DialogTitle>Réinitialiser le mot de passe</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Type d'utilisateur</Label>
                  <Select value={resetRole} onValueChange={(v) => setResetRole(v as "admin" | "student")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="student">Étudiant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{resetRole === "admin" ? "Email de l'admin" : "Matricule de l'étudiant"}</Label>
                  <Input
                    value={resetTarget}
                    onChange={(e) => setResetTarget(e.target.value)}
                    placeholder={resetRole === "admin" ? "admin@universite.cd" : "ETU-2025-0001"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nouveau mot de passe</Label>
                  <Input
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    placeholder="Laisser vide pour le mot de passe par défaut"
                  />
                  <p className="text-xs text-muted-foreground">
                    Par défaut : {resetRole === "admin" ? defaultAdminPassword : defaultStudentPassword}
                  </p>
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

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-base">Sécurité</CardTitle>
              <CardDescription>Règles de sécurité globales du système</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-w-xs">
            <Label>Tentatives de connexion max</Label>
            <Input type="number" value={maxLoginAttempts} onChange={(e) => setMaxLoginAttempts(e.target.value)} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Logs d'audit</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Enregistrer toutes les actions de tous les utilisateurs</p>
            </div>
            <Switch checked={enableAuditLogs} onCheckedChange={setEnableAuditLogs} />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
              <Bell className="h-4 w-4 text-accent" />
            </div>
            <div>
              <CardTitle className="text-base">Notifications</CardTitle>
              <CardDescription>Préférences de notification</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Notifications par email</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Recevoir les alertes de sécurité par email</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" /> Enregistrer les paramètres
        </Button>
      </div>
    </div>
  );
}
