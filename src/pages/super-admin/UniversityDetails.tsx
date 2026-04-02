import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, Users, UserCog, GraduationCap, Calendar, Ban, Bell, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell
} from "recharts";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const universityData = {
  id: "1", name: "Université de Kinshasa", code: "UNIKIN", email: "admin@unikin.cd",
  status: "active", createdAt: "2024-09-01", totalStudents: 4200, totalAdmins: 8, totalNotes: 52000,
};

const promotionStats = [
  { promotion: "L1 Informatique", actifs: 320, inactifs: 15, total: 335, reussite: 68 },
  { promotion: "L2 Informatique", actifs: 280, inactifs: 8, total: 288, reussite: 74 },
  { promotion: "L3 Informatique", actifs: 210, inactifs: 5, total: 215, reussite: 82 },
  { promotion: "L1 Droit", actifs: 450, inactifs: 22, total: 472, reussite: 58 },
  { promotion: "L2 Droit", actifs: 380, inactifs: 12, total: 392, reussite: 65 },
  { promotion: "L1 Médecine", actifs: 520, inactifs: 30, total: 550, reussite: 70 },
];

const yearlyHistory = [
  { year: "2021-2022", students: 2800, admins: 4, notes: 28000 },
  { year: "2022-2023", students: 3200, admins: 5, notes: 35000 },
  { year: "2023-2024", students: 3600, admins: 6, notes: 42000 },
  { year: "2024-2025", students: 4000, admins: 7, notes: 48000 },
  { year: "2025-2026", students: 4200, admins: 8, notes: 52000 },
];

const monthlyStats = [
  { month: "Jan", inscriptions: 120, notes: 4200 },
  { month: "Fév", inscriptions: 85, notes: 5100 },
  { month: "Mar", inscriptions: 45, notes: 6800 },
  { month: "Avr", inscriptions: 30, notes: 7200 },
  { month: "Mai", inscriptions: 15, notes: 8500 },
  { month: "Jun", inscriptions: 10, notes: 9200 },
];

const quarterlyStats = [
  { trimestre: "T1", students: 3950, notes: 16100, reussite: 65 },
  { trimestre: "T2", students: 4050, notes: 22400, reussite: 70 },
  { trimestre: "T3", students: 4150, notes: 9500, reussite: 72 },
  { trimestre: "T4", students: 4200, notes: 4000, reussite: 75 },
];

const adminHistory = [
  { name: "Jean Mukendi", email: "j.mukendi@unikin.cd", status: "active", depuis: "2024-09-01", actions: 245 },
  { name: "Marie Kabila", email: "m.kabila@unikin.cd", status: "active", depuis: "2024-10-15", actions: 189 },
  { name: "Paul Tshisekedi", email: "p.tshisekedi@unikin.cd", status: "inactive", depuis: "2024-09-01", actions: 78 },
];

const studentStatus = [
  { name: "Actifs", value: 3890, color: "hsl(var(--primary))" },
  { name: "Inactifs", value: 310, color: "hsl(var(--muted-foreground))" },
];

const tooltipStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" };

export default function UniversityDetails() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [period, setPeriod] = useState<"annuel" | "mensuel" | "trimestriel">("annuel");
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  const handleBan = () => {
    setIsBanned(!isBanned);
    toast({ title: isBanned ? "Université débloquée" : "Université bannie", description: `${universityData.name} a été ${isBanned ? "débloquée" : "bannie"} avec succès.` });
    setBanDialogOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/super-admin/universities")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{universityData.name}</h1>
              <Badge variant={isBanned ? "destructive" : "default"} className={!isBanned ? "bg-accent text-accent-foreground" : ""}>
                {isBanned ? "Bannie" : "Active"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">{universityData.code} · {universityData.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm" onClick={() => setBanDialogOpen(true)}>
            <Ban className="h-4 w-4 mr-2" />{isBanned ? "Débloquer" : "Bannir"}
          </Button>
        </div>
      </motion.div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Étudiants", value: universityData.totalStudents.toLocaleString(), icon: Users },
          { label: "Admins", value: universityData.totalAdmins, icon: UserCog },
          { label: "Notes", value: universityData.totalNotes.toLocaleString(), icon: GraduationCap },
          { label: "Créée le", value: universityData.createdAt, icon: Calendar },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Period selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Période :</span>
        <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="annuel">Annuel</SelectItem>
            <SelectItem value="mensuel">Mensuel</SelectItem>
            <SelectItem value="trimestriel">Trimestriel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="promotions">
        <TabsList>
          <TabsTrigger value="promotions">Par promotion</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="etudiants">Étudiants</TabsTrigger>
        </TabsList>

        <TabsContent value="promotions" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Étudiants par promotion</CardTitle>
                <CardDescription>Actifs vs Inactifs</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={promotionStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="promotion" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Bar dataKey="actifs" fill="hsl(var(--primary))" name="Actifs" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="inactifs" fill="hsl(var(--muted-foreground))" name="Inactifs" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Taux de réussite par promotion</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={promotionStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="promotion" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
                    <Bar dataKey="reussite" fill="hsl(var(--accent))" name="Taux %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Détails par promotion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Promotion</TableHead>
                    <TableHead className="text-center">Actifs</TableHead>
                    <TableHead className="text-center">Inactifs</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Taux réussite</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotionStats.map((p) => (
                    <TableRow key={p.promotion}>
                      <TableCell className="font-medium">{p.promotion}</TableCell>
                      <TableCell className="text-center">{p.actifs}</TableCell>
                      <TableCell className="text-center">{p.inactifs}</TableCell>
                      <TableCell className="text-center font-bold">{p.total}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={p.reussite >= 70 ? "bg-accent text-accent-foreground" : p.reussite >= 50 ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}>
                          {p.reussite}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historique" className="mt-4 space-y-6">
          {period === "annuel" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Évolution annuelle des étudiants</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={yearlyHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="year" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend />
                      <Line type="monotone" dataKey="students" stroke="hsl(var(--primary))" strokeWidth={2} name="Étudiants" />
                      <Line type="monotone" dataKey="admins" stroke="hsl(var(--accent))" strokeWidth={2} name="Admins" yAxisId="right" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Historique par année</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Année</TableHead>
                        <TableHead className="text-center">Étudiants</TableHead>
                        <TableHead className="text-center">Admins</TableHead>
                        <TableHead className="text-center">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {yearlyHistory.map((y) => (
                        <TableRow key={y.year}>
                          <TableCell className="font-medium">{y.year}</TableCell>
                          <TableCell className="text-center">{y.students.toLocaleString()}</TableCell>
                          <TableCell className="text-center">{y.admins}</TableCell>
                          <TableCell className="text-center">{y.notes.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {period === "mensuel" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statistiques mensuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Bar dataKey="inscriptions" fill="hsl(var(--primary))" name="Inscriptions" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="notes" fill="hsl(var(--accent))" name="Notes" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {period === "trimestriel" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statistiques trimestrielles</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={quarterlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="trimestre" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Bar dataKey="students" fill="hsl(var(--primary))" name="Étudiants" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="notes" fill="hsl(var(--accent))" name="Notes" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="admins" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Administrateurs de l'université</CardTitle>
              <CardDescription>Historique et activité des admins</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead>Depuis</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminHistory.map((a) => (
                    <TableRow key={a.email}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell className="text-muted-foreground">{a.email}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={a.status === "active" ? "default" : "secondary"} className={a.status === "active" ? "bg-accent text-accent-foreground" : ""}>
                          {a.status === "active" ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{a.depuis}</TableCell>
                      <TableCell className="text-center font-bold">{a.actions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="etudiants" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Répartition des étudiants</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={studentStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {studentStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isBanned ? "Débloquer" : "Bannir"} {universityData.name} ?</AlertDialogTitle>
            <AlertDialogDescription>
              {isBanned
                ? "L'université retrouvera l'accès complet à la plateforme."
                : "L'université et tous ses admins seront bloqués. Les étudiants ne pourront plus se connecter."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleBan} className={!isBanned ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}>
              {isBanned ? "Débloquer" : "Bannir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
