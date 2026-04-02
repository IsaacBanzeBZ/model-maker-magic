import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Calendar, Users, FileSpreadsheet, BookOpen, Eye, Lock, Unlock, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell
} from "recharts";

const yearlyStats = [
  { year: "2022-2023", students: 800, imports: 45, publications: 12, actions: 320 },
  { year: "2023-2024", students: 1050, imports: 68, publications: 18, actions: 480 },
  { year: "2024-2025", students: 1248, imports: 92, publications: 24, actions: 620 },
];

const monthlyActions = [
  { month: "Jan", imports: 12, publications: 3, students: 45, notes: 1200 },
  { month: "Fév", imports: 8, publications: 2, students: 30, notes: 980 },
  { month: "Mar", imports: 15, publications: 5, students: 20, notes: 2100 },
  { month: "Avr", imports: 10, publications: 4, students: 15, notes: 1800 },
  { month: "Mai", imports: 18, publications: 6, students: 10, notes: 2500 },
  { month: "Jun", imports: 22, publications: 8, students: 5, notes: 3200 },
];

const quarterlyStats = [
  { trimestre: "T1", actions: 180, students: 95, reussite: 65, echec: 35 },
  { trimestre: "T2", actions: 220, students: 65, reussite: 72, echec: 28 },
  { trimestre: "T3", actions: 150, students: 30, reussite: 78, echec: 22 },
  { trimestre: "T4", actions: 70, students: 15, reussite: 70, echec: 30 },
];

const promotionDetails = [
  { promotion: "L1 Informatique", total: 335, actifs: 320, inactifs: 15, reussite: 68, echec: 32, moyenne: 12.4 },
  { promotion: "L2 Informatique", total: 288, actifs: 280, inactifs: 8, reussite: 74, echec: 26, moyenne: 13.8 },
  { promotion: "L3 Informatique", total: 215, actifs: 210, inactifs: 5, reussite: 82, echec: 18, moyenne: 14.2 },
];

const recentActions = [
  { action: "Import Excel — L1 Info", type: "import", date: "28/03/2026 14:30", icon: FileSpreadsheet },
  { action: "Publication résultats — L2 Info", type: "publish", date: "28/03/2026 10:15", icon: Eye },
  { action: "Ajout étudiant — Mukendi Jean", type: "student", date: "27/03/2026 16:45", icon: Users },
  { action: "Modification note — Kalala Pierre", type: "grade", date: "27/03/2026 09:20", icon: BookOpen },
  { action: "Import Excel — L3 Info", type: "import", date: "26/03/2026 11:00", icon: FileSpreadsheet },
];

const actionDistribution = [
  { name: "Imports", value: 92, color: "hsl(var(--primary))" },
  { name: "Publications", value: 24, color: "hsl(var(--accent))" },
  { name: "Ajouts étudiants", value: 156, color: "hsl(210, 70%, 55%)" },
  { name: "Modif. notes", value: 348, color: "hsl(var(--muted-foreground))" },
];

const tooltipStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" };

export default function AdminActivityHistory() {
  const { toast } = useToast();
  const [period, setPeriod] = useState<"annuel" | "mensuel" | "trimestriel">("mensuel");
  const [transcriptDownloadEnabled, setTranscriptDownloadEnabled] = useState(true);

  const handleToggleTranscript = (enabled: boolean) => {
    setTranscriptDownloadEnabled(enabled);
    toast({
      title: enabled ? "Téléchargement activé" : "Téléchargement bloqué",
      description: enabled
        ? "Les étudiants peuvent télécharger leur relevé de côtes."
        : "Le téléchargement du relevé de côtes est maintenant bloqué pour les étudiants.",
    });
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Historique & Statistiques</h1>
          <p className="text-muted-foreground text-sm mt-1">Suivi complet de votre activité et statistiques par période</p>
        </div>
        <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="annuel">Annuel</SelectItem>
            <SelectItem value="mensuel">Mensuel</SelectItem>
            <SelectItem value="trimestriel">Trimestriel</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Transcript download control */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {transcriptDownloadEnabled ? <Unlock className="h-5 w-5 text-primary" /> : <Lock className="h-5 w-5 text-destructive" />}
              </div>
              <div>
                <Label className="text-sm font-medium">Téléchargement du relevé de côtes</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {transcriptDownloadEnabled ? "Les étudiants peuvent télécharger leur relevé en PDF" : "Téléchargement bloqué pour tous les étudiants"}
                </p>
              </div>
            </div>
            <Switch checked={transcriptDownloadEnabled} onCheckedChange={handleToggleTranscript} />
          </div>
        </CardContent>
      </Card>

      {/* Charts based on period */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Actions {period === "annuel" ? "par année" : period === "mensuel" ? "par mois" : "par trimestre"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={period === "annuel" ? yearlyStats : period === "mensuel" ? monthlyActions : quarterlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey={period === "annuel" ? "year" : period === "mensuel" ? "month" : "trimestre"} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="imports" fill="hsl(var(--primary))" name="Imports" radius={[4, 4, 0, 0]} />
                {period !== "trimestriel" && <Bar dataKey="publications" fill="hsl(var(--accent))" name="Publications" radius={[4, 4, 0, 0]} />}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Répartition des actions</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={actionDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {actionDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Promotion details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Étudiants par promotion</CardTitle>
          <CardDescription>Détails des effectifs, taux de réussite et performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promotion</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Actifs</TableHead>
                <TableHead className="text-center">Inactifs</TableHead>
                <TableHead className="text-center">Réussite</TableHead>
                <TableHead className="text-center">Échec</TableHead>
                <TableHead className="text-center">Moyenne</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotionDetails.map((p) => (
                <TableRow key={p.promotion}>
                  <TableCell className="font-medium">{p.promotion}</TableCell>
                  <TableCell className="text-center font-bold">{p.total}</TableCell>
                  <TableCell className="text-center">{p.actifs}</TableCell>
                  <TableCell className="text-center">{p.inactifs}</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-accent text-accent-foreground">{p.reussite}%</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="destructive">{p.echec}%</Badge>
                  </TableCell>
                  <TableCell className="text-center font-bold">{p.moyenne}/20</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Taux de réussite/échec */}
      {period === "trimestriel" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Taux de réussite vs échec par trimestre</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={quarterlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="trimestre" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
                <Legend />
                <Bar dataKey="reussite" fill="hsl(var(--accent))" name="Réussite %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="echec" fill="hsl(var(--destructive))" name="Échec %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dernières actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActions.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <a.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.action}</p>
                    <p className="text-xs text-muted-foreground">{a.date}</p>
                  </div>
                </div>
                <Badge variant="outline">{a.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
