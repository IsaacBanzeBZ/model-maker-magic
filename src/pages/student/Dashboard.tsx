import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Award, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, Legend, ReferenceLine
} from "recharts";

const studentInfo = {
  name: "Jean Mukendi",
  matricule: "ETU-2025-0042",
  promotion: "L2 Informatique",
  university: "Université de Kinshasa",
  year: "2025-2026",
};

const stats = [
  { label: "Moyenne générale", value: "14.2/20", icon: TrendingUp, detail: "Admis" },
  { label: "Matières", value: "8", icon: BookOpen, detail: "En cours" },
  { label: "Crédits validés", value: "42/60", icon: Award, detail: "70%" },
  { label: "Année académique", value: "2025-2026", icon: Calendar, detail: "Active" },
];

const gradesBySubject = [
  { subject: "Algo", note: 16, max: 20 },
  { subject: "BDD", note: 14, max: 20 },
  { subject: "Réseaux", note: 12, max: 20 },
  { subject: "Maths", note: 15, max: 20 },
  { subject: "Anglais", note: 17, max: 20 },
  { subject: "Physique", note: 11, max: 20 },
  { subject: "Système", note: 13, max: 20 },
  { subject: "Stats", note: 14, max: 20 },
];

const radarData = [
  { subject: "Algo", note: 16 },
  { subject: "BDD", note: 14 },
  { subject: "Réseaux", note: 12 },
  { subject: "Maths", note: 15 },
  { subject: "Anglais", note: 17 },
  { subject: "Physique", note: 11 },
];

const progressionData = [
  { period: "S1 2024", moyenne: 11.5 },
  { period: "S2 2024", moyenne: 12.8 },
  { period: "S1 2025", moyenne: 13.6 },
  { period: "S2 2025", moyenne: 14.2 },
];

const recentGrades = [
  { subject: "Algorithmique", grade: 16, type: "Examen", date: "15/01/2026" },
  { subject: "Base de données", grade: 14, type: "TP", date: "12/01/2026" },
  { subject: "Réseaux", grade: 12, type: "Interrogation", date: "10/01/2026" },
  { subject: "Mathématiques", grade: 15, type: "Examen", date: "08/01/2026" },
  { subject: "Anglais", grade: 17, type: "TP", date: "05/01/2026" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function StudentDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">Bienvenue, {studentInfo.name}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {studentInfo.matricule} — {studentInfo.promotion} — {studentInfo.year}
        </p>
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
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{s.detail}</p>
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
              <CardTitle className="text-base">Notes par matière</CardTitle>
              <CardDescription>Vos résultats dans chaque matière</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={gradesBySubject}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis domain={[0, 20]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <ReferenceLine y={10} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ value: "Seuil", fill: "hsl(var(--destructive))", fontSize: 11 }} />
                  <Bar dataKey="note" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Note /20" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profil de compétences</CardTitle>
              <CardDescription>Vue radar de vos performances</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <PolarRadiusAxis domain={[0, 20]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Radar name="Note" dataKey="note" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" fillOpacity={0.6} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Chart Row 2 + Progression */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Évolution de la moyenne</CardTitle>
              <CardDescription>Progression sur les semestres</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={progressionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis domain={[0, 20]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <ReferenceLine y={10} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                  <Legend />
                  <Line type="monotone" dataKey="moyenne" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", r: 5 }} name="Moyenne" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progression</CardTitle>
            <CardDescription>Crédits validés cette année</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">70%</p>
              <p className="text-sm text-muted-foreground mt-1">42/60 crédits</p>
            </div>
            <Progress value={70} className="h-3" />
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Semestre 1</span>
                <span className="font-medium text-foreground">28/30</span>
              </div>
              <Progress value={93} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Semestre 2</span>
                <span className="font-medium text-foreground">14/30</span>
              </div>
              <Progress value={47} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent grades */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dernières notes</CardTitle>
            <CardDescription>Vos notes les plus récentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentGrades.map((g, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{g.subject}</p>
                      <p className="text-xs text-muted-foreground">{g.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={g.type === "Examen" ? "default" : "secondary"} className="text-xs">
                      {g.type}
                    </Badge>
                    <span className={`text-sm font-bold ${g.grade >= 10 ? "text-accent" : "text-destructive"}`}>
                      {g.grade}/20
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
