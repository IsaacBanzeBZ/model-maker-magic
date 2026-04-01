import { motion } from "framer-motion";
import { Users, GraduationCap, BookOpen, FileSpreadsheet, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend
} from "recharts";

const stats = [
  { label: "Étudiants", value: "1,248", icon: Users, change: "+12%", color: "text-primary" },
  { label: "Promotions", value: "18", icon: GraduationCap, change: "+2", color: "text-accent-foreground" },
  { label: "Matières", value: "64", icon: BookOpen, change: "+5", color: "text-primary" },
  { label: "Imports", value: "32", icon: FileSpreadsheet, change: "Ce mois", color: "text-muted-foreground" },
];

const averageByPromotion = [
  { promotion: "L1 Info", moyenne: 12.4, reussite: 68 },
  { promotion: "L2 Info", moyenne: 13.8, reussite: 74 },
  { promotion: "L3 Info", moyenne: 14.2, reussite: 82 },
  { promotion: "L1 Droit", moyenne: 11.6, reussite: 58 },
  { promotion: "L2 Droit", moyenne: 12.9, reussite: 65 },
  { promotion: "L1 Méd.", moyenne: 13.1, reussite: 70 },
];

const monthlyImports = [
  { month: "Jan", imports: 5, notes: 1200 },
  { month: "Fév", imports: 8, notes: 2100 },
  { month: "Mar", imports: 6, notes: 1800 },
  { month: "Avr", imports: 12, notes: 3400 },
  { month: "Mai", imports: 10, notes: 2900 },
  { month: "Jun", imports: 15, notes: 4200 },
];

const gradeDistribution = [
  { name: "0-5", count: 45, color: "hsl(0, 70%, 50%)" },
  { name: "6-9", count: 120, color: "hsl(30, 70%, 50%)" },
  { name: "10-13", count: 380, color: "hsl(var(--accent))" },
  { name: "14-16", count: 450, color: "hsl(var(--primary))" },
  { name: "17-20", count: 180, color: "hsl(150, 60%, 45%)" },
];

const subjectPerformance = [
  { subject: "Algo", moyenne: 14.2 },
  { subject: "BDD", moyenne: 13.5 },
  { subject: "Réseaux", moyenne: 12.1 },
  { subject: "Maths", moyenne: 11.8 },
  { subject: "Anglais", moyenne: 15.3 },
  { subject: "Physique", moyenne: 10.9 },
];

const quickActions = [
  { title: "Gérer les étudiants", description: "Ajouter, modifier ou rechercher des étudiants", icon: Users, url: "/admin/students" },
  { title: "Gérer les promotions", description: "Créer et organiser les promotions", icon: GraduationCap, url: "/admin/promotions" },
  { title: "Importer des notes", description: "Importer un fichier Excel de notes", icon: FileSpreadsheet, url: "/admin/import" },
  { title: "Publier les résultats", description: "Consulter et publier les résultats", icon: BookOpen, url: "/admin/results" },
  { title: "Années académiques", description: "Gérer les années académiques", icon: Calendar, url: "/admin/academic-years" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble de votre université</p>
      </motion.div>

      {/* Stats */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={container} initial="hidden" animate="show">
        {stats.map((s) => (
          <motion.div key={s.label} variants={item}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-accent" />
                  <span>{s.change}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Moyenne par promotion</CardTitle>
              <CardDescription>Performance académique par promotion</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={averageByPromotion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="promotion" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis domain={[0, 20]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Legend />
                  <Bar dataKey="moyenne" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Moyenne /20" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Taux de réussite par promotion</CardTitle>
              <CardDescription>Pourcentage d'étudiants admis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={averageByPromotion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="promotion" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} formatter={(v: number) => `${v}%`} />
                  <Bar dataKey="reussite" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} name="Taux de réussite" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribution des notes</CardTitle>
              <CardDescription>Répartition globale</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={gradeDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="count" label={({ name, count }) => `${name}: ${count}`}>
                    {gradeDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Imports mensuels</CardTitle>
              <CardDescription>Fichiers Excel importés</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyImports}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Legend />
                  <Line type="monotone" dataKey="imports" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} name="Imports" />
                  <Line type="monotone" dataKey="notes" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: "hsl(var(--accent))" }} name="Notes ajoutées" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance par matière</CardTitle>
              <CardDescription>Moyennes comparées</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={subjectPerformance}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <PolarRadiusAxis domain={[0, 20]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Radar name="Moyenne" dataKey="moyenne" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" fillOpacity={0.6} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Accès rapide</h2>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" variants={container} initial="hidden" animate="show">
          {quickActions.map((a) => (
            <motion.div key={a.title} variants={item}>
              <Card className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group" onClick={() => navigate(a.url)}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <a.icon className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-base">{a.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription>{a.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
