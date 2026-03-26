import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Save, KeyRound, Shield, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function SuperAdminSettings() {
  const { toast } = useToast();
  const [defaultPassword, setDefaultPassword] = useState("EduLedger2025");
  const [minPasswordLength, setMinPasswordLength] = useState("8");
  const [forcePasswordChange, setForcePasswordChange] = useState(true);
  const [enableAuditLogs, setEnableAuditLogs] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");

  const handleSave = () => {
    toast({ title: "Paramètres enregistrés", description: "Les paramètres globaux ont été mis à jour." });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Paramètres système</h1>
        <p className="text-muted-foreground text-sm mt-1">Configuration globale de la plateforme EduLedger</p>
      </motion.div>

      {/* Password Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <KeyRound className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Mots de passe</CardTitle>
              <CardDescription>Configuration des mots de passe par défaut</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mot de passe étudiant par défaut</Label>
              <Input value={defaultPassword} onChange={(e) => setDefaultPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Longueur minimum</Label>
              <Input type="number" value={minPasswordLength} onChange={(e) => setMinPasswordLength(e.target.value)} />
            </div>
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

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-base">Sécurité</CardTitle>
              <CardDescription>Règles de sécurité du système</CardDescription>
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
              <p className="text-xs text-muted-foreground mt-0.5">Enregistrer toutes les actions des utilisateurs</p>
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
